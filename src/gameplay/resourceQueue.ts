import {unitStats} from '../config/unit';
import {trafficConfig as config} from '../config/traffic';
import {gatheringConfig} from '../config/gathering';
import type {GatheringState} from './gathering';
import {bodyFits,tileCenter,type WorldMap} from './map';
import {canInteract,footprintDistance} from './approach';
import {findRoute,segmentFits} from './navigation';
import {placementObstacles} from './placement';
import type {Position} from './movement';
export interface ResourceService {point:Position;working:boolean}
/** Bounded service places, rotated by saved gameplay time; no serialized queue/refs. */
export function resourceServices(state:GatheringState,map:WorldMap,elapsed:number):Map<string,ResourceService>{
 const result=new Map<string,ResourceService>();
 map={...map,obstacles:[...map.obstacles,...placementObstacles(state)]};
 for(const node of [state.node,...(state.gold?[state.gold]:[])]){
  const cohort=state.units.filter(u=>u.kind==='worker'&&(u.hp===undefined||u.hp>0)&&(u.order.kind==='gather'||u.order.kind==='deliver')&&u.order.nodeId===node.id);
  const workers=cohort.filter(u=>u.order.kind==='gather').sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}));
  // Delivery takes no active slot. A returning carrier waits for the next snapshot
  // rather than bypassing admission inside a large gathering delta.
  if(cohort.length>config.resourceSlots)for(const u of cohort.filter(u=>u.order.kind==='deliver'))result.set(u.id,{point:{...u.position},working:false});
  // Preserve the existing approach for nodes with no excess demand.
  if(workers.length<=config.resourceSlots)continue;
  const half=unitStats.size/2,rect={x:node.position.x-gatheringConfig.nodeRadius,y:node.position.y-gatheringConfig.nodeRadius,width:gatheringConfig.nodeRadius*2,height:gatheringConfig.nodeRadius*2};
  const offset=gatheringConfig.nodeRadius+half;
  const places:Position[]=[{x:node.position.x-offset,y:node.position.y},{x:node.position.x+offset,y:node.position.y},{x:node.position.x,y:node.position.y-offset},{x:node.position.x,y:node.position.y+offset}];
  for(let row=Math.max(0,Math.floor((rect.y-gatheringConfig.range)/map.tileSize));row<=Math.floor((rect.y+rect.height+gatheringConfig.range)/map.tileSize);row++)for(let column=Math.max(0,Math.floor((rect.x-gatheringConfig.range)/map.tileSize));column<=Math.floor((rect.x+rect.width+gatheringConfig.range)/map.tileSize);column++){const p=tileCenter(map,{row,column});if(p)places.push(p);}
  let available=places.filter(p=>canInteract(map,p,rect,gatheringConfig.range));
  const start=Math.floor((elapsed+1e-9)/config.resourceWindowSeconds)*config.resourceSlots%workers.length;
  const admitted=new Set<string>();
  for(let i=0;i<workers.length&&admitted.size<config.resourceSlots;i++){
   const worker=workers[(start+i)%workers.length];
   available.sort((a,b)=>Math.hypot(a.x-worker.position.x,a.y-worker.position.y)-Math.hypot(b.x-worker.position.x,b.y-worker.position.y));
   const point=available.find(p=>segmentFits(map,worker.position,p,half)||worker.navigation?.status!=='blocked'&&worker.navigation?.revision===map.revision&&worker.navigation.destination.x===p.x&&worker.navigation.destination.y===p.y||findRoute(map,worker.position,p,half).ok);
   if(!point)continue;
   admitted.add(worker.id);result.set(worker.id,{point,working:true});
   available=available.filter(p=>Math.abs(p.x-point.x)>=unitStats.size||Math.abs(p.y-point.y)>=unitStats.size);
  }
  const waiting:Position[]=[];
  for(let i=0;i<config.waitingPoints;i++){const side=i%4,ring=Math.floor(i/4),distance=offset+gatheringConfig.range+half+ring*unitStats.size;const p=side===0?{x:node.position.x-distance,y:node.position.y}:side===1?{x:node.position.x+distance,y:node.position.y}:side===2?{x:node.position.x,y:node.position.y-distance}:{x:node.position.x,y:node.position.y+distance};if(bodyFits(map,p,half)&&footprintDistance(p,rect)>gatheringConfig.range+half)waiting.push(p);}
  for(const worker of workers.filter(w=>!admitted.has(w.id))){waiting.sort((a,b)=>Math.hypot(a.x-worker.position.x,a.y-worker.position.y)-Math.hypot(b.x-worker.position.x,b.y-worker.position.y));result.set(worker.id,{point:waiting.shift()??{...worker.position},working:false});}
 }
 return result;
}
