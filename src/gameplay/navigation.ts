import { navigationConfig } from '../config/navigation';
import { soldierStats, combatUnitStats, unitStats } from '../config/unit';
import type { Unit } from './gathering';
import { bodyFits, tileCenter, worldTile, type Tile, type WorldMap } from './map';
import { moveTowards, type Position } from './movement';

export type RouteError = 'outside-world' | 'blocked-target' | 'blocked-start' | 'unreachable' | 'no-space';
export interface RouteState {
  commandNumber: number;
  goalKey?: string;
  retryAfter?: number;
  targetId?: string;
  destination: Position;
  waypoints: Position[];
  revision: number;
  status: 'moving' | 'arrived' | 'blocked';
  error?: RouteError;
}
export type RouteResult = { ok: true; waypoints: Position[] } | { ok: false; error: RouteError };
const key = (tile: Tile) => `${tile.column},${tile.row}`;
const same = (a: Position, b: Position) => a.x === b.x && a.y === b.y;

/** Swept square-body collision, including the connector between a point and a tile center. */
export function segmentFits(map: WorldMap, a: Position, b: Position, half = map.bodyHalf??navigationConfig.halfBody): boolean {
  if (!bodyFits(map, a, half) || !bodyFits(map, b, half)) return false;
  for (const obstacle of map.obstacles) {
    let enter = 0, exit = 1;
    for (const axis of ['x', 'y'] as const) {
      const extent = axis === 'x' ? obstacle.width : obstacle.height;
      const low = obstacle[axis] - half + 1e-9, high = obstacle[axis] + extent + half - 1e-9;
      const delta = b[axis] - a[axis];
      if (delta === 0) { if (a[axis] < low || a[axis] > high) { enter = 2; break; } }
      else {
        const t1 = (low - a[axis]) / delta, t2 = (high - a[axis]) / delta;
        enter = Math.max(enter, Math.min(t1, t2)); exit = Math.min(exit, Math.max(t1, t2));
      }
    }
    if (enter <= exit) return false;
  }
  return true;
}

function connectors(map: WorldMap, point: Position, half: number): Tile[] {
  const tile = worldTile(map, point)!;
  const result: Tile[] = [];
  // Fixed local connector search permits valid off-center starts beside partial footprints.
  for (let row = tile.row - 1; row <= tile.row + 1; row++) {
    for (let column = tile.column - 1; column <= tile.column + 1; column++) {
      const candidate = { column, row }, center = tileCenter(map, candidate);
      if (center && segmentFits(map, point, center, half)) result.push(candidate);
    }
  }
  return result.sort((a,b) => {
    const ca=tileCenter(map,a)!,cb=tileCenter(map,b)!;
    return Math.hypot(ca.x-point.x,ca.y-point.y)-Math.hypot(cb.x-point.x,cb.y-point.y)
      || a.row-b.row || a.column-b.column;
  });
}

/** Bounded synchronous four-neighbor BFS; stable tie order, no diagonal corner cutting. */
export function findRoute(map: WorldMap, start: Position, destination: Position,
  half = map.bodyHalf??navigationConfig.halfBody): RouteResult {
  if (!worldTile(map, destination)) return { ok: false, error: 'outside-world' };
  if (!bodyFits(map, destination, half)) return { ok: false, error: 'blocked-target' };
  if (!bodyFits(map, start, half)) return { ok: false, error: 'blocked-start' };
  if (same(start, destination)) return { ok: true, waypoints: [] };
  // Avoid backtracking to tile centers when the exact destination already has a safe direct segment.
  if (segmentFits(map,start,destination,half)) return {ok:true,waypoints:[{...destination}]};
  const goals = new Set(connectors(map, destination, half).map(key));
  const queue = connectors(map, start, half);
  const parent = new Map<string, Tile | null>(queue.map(t => [key(t), null]));
  for (let index = 0; index < queue.length && index < navigationConfig.maxVisited; index++) {
    const tile = queue[index], center = tileCenter(map, tile)!;
    if (goals.has(key(tile))) {
      const route: Position[] = [];
      let current: Tile | null = tile;
      while (current) { route.unshift(tileCenter(map,current)!); current = parent.get(key(current)) ?? null; }
      if (!same(route[route.length-1],destination)) route.push({...destination});
      return { ok: true, waypoints: route.filter((p,i)=> i !== 0 || !same(p,start)) };
    }
    for (const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]) {
      const neighbor={column:tile.column+dx,row:tile.row+dy};
      if (parent.has(key(neighbor))) continue;
      const next=tileCenter(map,neighbor);
      if (next && segmentFits(map,center,next,half)) { parent.set(key(neighbor),tile);queue.push(neighbor); }
    }
  }
  return { ok: false, error: 'unreachable' };
}

export function planRoute(map: WorldMap, position: Position, destination: Position, commandNumber=1): RouteState {
  const result=findRoute(map,position,destination);
  return { commandNumber, destination:{...destination}, revision:map.revision,
    waypoints:result.ok?result.waypoints:[],status:result.ok?(result.waypoints.length?'moving':'arrived'):'blocked',
    ...(!result.ok?{error:result.error}:{}) };
}

export function advanceRoute(map: WorldMap, position: Position, route: RouteState, speed: number, delta: number) {
  const current=route.revision===map.revision?route:planRoute(map,position,route.destination,route.commandNumber);
  let point={...position},remaining=Math.max(0,delta);
  if(current.status==='blocked')return {position:point,route:current,remaining};
  const waypoints=current.waypoints.map(p=>({...p}));
  while(waypoints.length) {
    const target=waypoints[0],distance=Math.hypot(target.x-point.x,target.y-point.y);
    if(!segmentFits(map,point,target))return {position:point,remaining,
      route:{...current,waypoints:[],status:'blocked' as const,error:'unreachable' as const}};
    if(distance===0){waypoints.shift();continue;}
    if(speed<=0 || remaining<=0)break;
    const time=distance/speed;
    point=remaining >= time ? {...target} : moveTowards(point,target,speed,remaining);
    remaining=Math.max(0,remaining-time);
    if(same(point,target))waypoints.shift();else break;
  }
  return {position:point,remaining,route:{...current,waypoints,status:waypoints.length?'moving' as const:'arrived' as const}};
}

export function commandMappedMove(units: Unit[], destination: Position, map: WorldMap): Unit[] {
  return units.map(unit=>{
    if(!unit.selected)return unit;
    const unitMap={...map,bodyHalf:(unit.kind==='worker'?unitStats:combatUnitStats(unit)).size/2};
    const navigation=planRoute(unitMap,unit.position,destination,(unit.navigation?.commandNumber??0)+1);
    return {...unit,...(unit.kind==='soldier'?{attackMoveTarget:undefined,autoOrigin:undefined,autoDisabled:false}:{}),navigation,target:{...destination},order:{kind:navigation.status==='moving'?'move':'idle'}};
  });
}

export function updateMappedMove(unit: Unit, map: WorldMap, delta: number): Unit {
  map={...map,bodyHalf:(unit.kind==='worker'?unitStats:combatUnitStats(unit)).size/2};
  const route=unit.navigation??planRoute(map,unit.position,unit.target);
  const step=advanceRoute(map,unit.position,route,unit.kind==='worker'?unitStats.speed:combatUnitStats(unit).speed,delta);
  return {...unit,position:step.position,navigation:step.route,
    order:{kind:step.route.status==='moving'?'move':'idle'}};
}
