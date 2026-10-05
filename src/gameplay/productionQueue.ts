import {unitAvailability} from './productionPrerequisites';
import {productionFaction} from '../config/factions';
import { type ResourceCost } from '../config/economy';
import { queueConfig } from '../config/production';
import { canAfford, payCost } from './economy';
import { hasPopulation, type Population } from './population';
import { productionRecipe,soldierSpawn, updateProduction, type ProductionState, type ProductionBuilding } from './production';
import type { GatheringState } from './gathering';
import type { WorldMap } from './map';
import type { Position } from './movement';
export interface ProductionJob {
  id:string; kind:'transport'|'warship'|'worker'|'soldier'|'archer'|'catapult'|'specialist'|'air'; supply?:number; cost:ResourceCost;
  durationSeconds:number; remainingSeconds:number;legacyRecipe?:true;
}
const base:ProductionBuilding={kind:'base'};
export function productionJobCount(p:ProductionState):number {
  return p.queue?.length??(p.remainingSeconds!==null?1:0);
}
export function canEnqueue(g:GatheringState,p:ProductionState,b:ProductionBuilding=base,pop?:Population):boolean {
  const recipe=productionRecipe(g,b);
  return unitAvailability(productionFaction(g),b.kind==='base'?'worker':b.unitType??'soldier',b.kind==='base'?undefined:b.technology)===null && productionJobCount(p)<queueConfig.maxJobs && (!pop||hasPopulation(pop,recipe.supply))
    && canAfford(g,recipe.cost)
    && (b.kind==='base'||b.ready!==false&&b.footprint!==null&&soldierSpawn(b.footprint,recipe.size,b.bounds)!==null);
}
export function enqueueProduction(gathering:GatheringState,production:ProductionState,
  building:ProductionBuilding=base,population?:Population,playing=true) {
  if(!playing||!canEnqueue(gathering,production,building,population))return {gathering,production};
  const kind=building.kind==='base'?'worker':building.unitType??'soldier';
  const recipe=productionRecipe(gathering,building),cost=recipe.cost,durationSeconds=recipe.durationSeconds;
  let number=production.nextJobNumber??1;
  const queue=production.queue??(production.remainingSeconds!==null?[{
    id:`${building.kind}-job-${number++}`,kind,cost:{...cost},durationSeconds,remainingSeconds:production.remainingSeconds,
  }]:[]);
  const job:ProductionJob={id:`${building.kind}-job-${number}`,kind,supply:recipe.supply,cost:{...cost},durationSeconds,remainingSeconds:durationSeconds};
  return {gathering:payCost(gathering,cost),production:{...production,queue:[...queue,job],nextJobNumber:number+1,
    remainingSeconds:queue.length?production.remainingSeconds:durationSeconds}};
}
export function cancelProduction(gathering:GatheringState,production:ProductionState,id:string,playing=true) {
  const queue=production.queue,index=queue?.findIndex(j=>j.id===id)??-1;
  if(!playing||!queue||index<0)return {gathering,production};
  const job=queue[index],fraction=index===0?queueConfig.activeRefund:queueConfig.queuedRefund;
  const next=queue.filter(j=>j.id!==id);
  return {gathering:{...gathering,wood:gathering.wood+job.cost.wood*fraction,
      ...(gathering.goldBalance!==undefined||job.cost.gold>0?{goldBalance:(gathering.goldBalance??0)+job.cost.gold*fraction}:{})},
    production:{...production,queue:next,
      remainingSeconds:index===0?(next[0]?.remainingSeconds??null):production.remainingSeconds,
      blockedSpawnKey:index===0?undefined:production.blockedSpawnKey}};
}
/** Spend one delta across FIFO completions; a blocked head consumes no later job time. */
export function updateQueuedProduction(gathering:GatheringState,production:ProductionState,delta:number,
  building:ProductionBuilding=base,context?:{map:WorldMap;enemies:readonly {id:string;position:Position;kind?:string;role?:string}[]}) {
  if(!production.queue)return updateProduction(gathering,production,delta,building,context);
  let g=gathering,p=production,remaining=Math.max(0,delta);
  while(p.queue!.length) {
    const time=p.remainingSeconds??p.queue![0].remainingSeconds;
    const result=updateProduction(g,p,remaining,building.kind==='barracks'?{...building,unitType:p.queue![0].kind==='air'?'air':p.queue![0].kind==='specialist'?'specialist':p.queue![0].kind==='catapult'?'catapult':p.queue![0].kind==='archer'?'archer':'soldier'}:building,context);
    if(result.production.remainingSeconds!==null) {
      const queue=p.queue!.map((j,i)=>i===0?{...j,remainingSeconds:result.production.remainingSeconds!}:j);
      return {gathering:result.gathering,production:{...result.production,queue}};
    }
    if(result.gathering.units.length===g.units.length)return {gathering:g,production:p};
    remaining=Math.max(0,remaining-time);
    const queue=p.queue!.slice(1);
    g=result.gathering;p={...result.production,queue,remainingSeconds:queue[0]?.remainingSeconds??null,blockedSpawnKey:undefined};
    if(remaining<=0)break;
  }
  return {gathering:g,production:p};
}
