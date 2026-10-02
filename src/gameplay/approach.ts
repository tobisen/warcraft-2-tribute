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
  return {...map,obstacles:map.obstacles.filter(o=>o.x!==target.x || o.y!==target.y
    || o.width!==target.width || o.height!==target.height)};
}

export function canInteract(map: WorldMap, point: Position, target: Footprint, range: number): boolean {
  if(!bodyFits(map,point,map.bodyHalf??navigationConfig.halfBody) || footprintDistance(point,target)>range+1e-9)return false;
  const edge={x:Math.max(target.x,Math.min(point.x,target.x+target.width)),
    y:Math.max(target.y,Math.min(point.y,target.y+target.height))};
  return segmentFits(targetFreeMap(map,target),point,edge,0);
}

export function approachRoute(map: WorldMap, position: Position, target: Footprint, range: number,
  commandNumber=1): RouteState {
  if(canInteract(map,position,target,range))return {commandNumber,destination:{...position},
    waypoints:[],revision:map.revision,status:'arrived'};
  const half=map.bodyHalf??navigationConfig.halfBody;
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
  let best: {waypoints:Position[];point:Position;length:number}|undefined;
  for(const point of points) {
    if(!canInteract(map,point,target,range))continue;
    const result=findRoute(map,position,point);if(!result.ok)continue;
    let previous=position,length=0;
    for(const p of result.waypoints){length+=Math.hypot(p.x-previous.x,p.y-previous.y);previous=p;}
    if(!best || length<best.length-1e-9)best={waypoints:result.waypoints,point,length};
  }
  return {commandNumber,destination:best?{...best.point}:{...position},waypoints:best?.waypoints??[],
    revision:map.revision,status:best?(best.waypoints.length?'moving':'arrived'):'blocked',
    ...(!best?{error:'unreachable' as const}:{})};
}
