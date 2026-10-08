import {marineFlightMap} from './terrainNavigation';
import { navigationConfig } from '../config/navigation';
import { bodyFits, tileCenter, type WorldMap } from './map';
import type { Footprint } from './placement';
import type { Position } from './movement';
import { findRoute, segmentFits, type RouteState } from './navigation';

export function footprintDistance(point: Position, rect: Footprint): number {
  return Math.hypot(Math.max(rect.x-point.x,0,point.x-rect.x-rect.width),
    Math.max(rect.y-point.y,0,point.y-rect.y-rect.height));
}

function targetFreeMap(map: WorldMap, target: Footprint): WorldMap {
  return {...map,interactionTarget:target};
}

export function canInteract(map: WorldMap, point: Position, target: Footprint, range: number): boolean {
  if(!bodyFits(map,point,map.bodyHalf??navigationConfig.halfBody) || footprintDistance(point,target)>range+1e-9)return false;
  const edge={x:Math.max(target.x,Math.min(point.x,target.x+target.width)),
    y:Math.max(target.y,Math.min(point.y,target.y+target.height))};
  return !!map.ignoreAttackOcclusion||segmentFits(targetFreeMap(map.attackAcrossWater?marineFlightMap(map):map,target),point,edge,0);
}

const candidateCache=new WeakMap<WorldMap['obstacles'],{length:number;entries:Map<string,{point:Position;index:number}[]>}>();
/** Contact geometry is independent of the actor; retain original tie indices. */
function interactionCandidates(map:WorldMap,target:Footprint,range:number){
 const half=map.bodyHalf??navigationConfig.halfBody,t=map.interactionTarget;
 const cacheKey=`${map.width}:${map.height}:${map.tileSize}:${map.revision}:${half}:${!!map.ignoreAttackOcclusion}:${!!map.attackAcrossWater}:${t?`${t.x},${t.y},${t.width},${t.height}`:''}:${target.x},${target.y},${target.width},${target.height}:${range}`;
 let cache=candidateCache.get(map.obstacles);if(!cache||cache.length!==map.obstacles.length){cache={length:map.obstacles.length,entries:new Map()};candidateCache.set(map.obstacles,cache);}
 const cached=cache.entries.get(cacheKey);if(cached)return cached;
  const points: Position[]=[
    {x:target.x-half,y:target.y+target.height/2},{x:target.x+target.width+half,y:target.y+target.height/2},
    {x:target.x+target.width/2,y:target.y-half},{x:target.x+target.width/2,y:target.y+target.height+half},
  ];
  // Only centers in the target's expanded bounding box are interaction candidates.
  for(let row=Math.max(0,Math.floor((target.y-range)/map.tileSize));row<=Math.floor((target.y+target.height+range)/map.tileSize);row++) {
    for(let column=Math.max(0,Math.floor((target.x-range)/map.tileSize));column<=Math.floor((target.x+target.width+range)/map.tileSize);column++) {
      const point=tileCenter(map,{column,row});if(point)points.push(point);
    }
  }
 const result=points.map((point,index)=>({point,index})).filter(c=>canInteract(map,c.point,target,range));
 if(cache.entries.size>=32)cache.entries.delete(cache.entries.keys().next().value!);
 cache.entries.set(cacheKey,result);return result;
}

export function approachRoute(map: WorldMap, position: Position, target: Footprint, range: number,
  commandNumber=1,reachableOnly=false): RouteState {
  if(canInteract(map,position,target,range))return {commandNumber,destination:{...position},
    waypoints:[],revision:map.revision,status:'arrived'};
  const points=interactionCandidates(map,target,range);
  let best: {waypoints:Position[];point:Position;length:number;index:number}|undefined;
  // Straight distance is a lower bound for any route. Search the most promising
  // contact first, then skip BFSs that cannot improve it. Keep original tie order.
  const candidates=points.map(({point,index})=>({point,index,bound:Math.hypot(point.x-position.x,point.y-position.y)}))
    .sort((a,b)=>a.bound-b.bound||a.index-b.index);
  for(const {point,index,bound} of candidates) {
    if(best&&bound>best.length+1e-9)break;
    const result=findRoute(map,position,point);if(!result.ok)continue;
    let previous=position,length=0;
    for(const p of result.waypoints){length+=Math.hypot(p.x-previous.x,p.y-previous.y);previous=p;}
    if(!best || length<best.length-1e-9 || Math.abs(length-best.length)<=1e-9&&index<best.index)best={waypoints:result.waypoints,point,length,index};
    if(reachableOnly)break;
  }
  return {commandNumber,destination:best?{...best.point}:{...position},waypoints:best?.waypoints??[],
    revision:map.revision,status:best?(best.waypoints.length?'moving':'arrived'):'blocked',
    ...(!best?{error:'unreachable' as const}:{})};
}

/** Connectivity checks need a witness, not the shortest interaction route. */
export function canReachFootprint(map:WorldMap,position:Position,target:Footprint,range:number):boolean {
 return approachRoute(map,position,target,range,1,true).status!=='blocked';
}
