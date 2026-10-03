import {factions,type FactionId} from '../config/factions';
import { enemyProductionConfig } from '../config/enemyProduction';
import { combatConfig } from '../config/combat';
import { canEnqueue,enqueueProduction,updateQueuedProduction } from './productionQueue';
import type { ProductionState } from './production';
import type { CombatState,Enemy } from './combat';
import type { GatheringState,Unit } from './gathering';
import type {Population} from './population';
import type { WorldMap } from './map';
export interface EnemyProductionState {wood:number;gold:number;cap:number;production:ProductionState;acceptedJobs:number;durationSeconds?:number;extracted?:{wood:number;gold:number};spent?:{wood:number;gold:number};lostCargo?:{wood:number;gold:number}}
export function createEnemyProduction(profile:{budget:{wood:number;gold:number};cap:number;durationSeconds:number}=enemyProductionConfig):EnemyProductionState {
 return {wood:profile.budget.wood,gold:profile.budget.gold,cap:profile.cap,...(profile===enemyProductionConfig?{}:{durationSeconds:profile.durationSeconds}),
 production:{remainingSeconds:null,nextUnitNumber:1},acceptedJobs:0};
}
/** Adapter to shared atomic queue/time/spawn rules; temporary units never enter player state. */
export function updateEnemyProduction(state:EnemyProductionState,combat:CombatState,player:GatheringState,map:WorldMap,delta:number,faction?:FactionId,buildings?:{site?:Enemy;population:Population;reserveForFarm?:number;startAllowed?:boolean;workerReservations?:number;maxArmy?:number;embarked?:number}) {
 const base=combat.enemies.find(e=>e.kind==='base'&&e.hp>0);
 if(!base?.footprint)return {combat,state:{...state,production:{...state.production,queue:[],remainingSeconds:null,blockedSpawnKey:undefined}}};
 if(buildings&&(!buildings.site?.footprint||buildings.site.construction?.remainingSeconds!==0))return {combat,state};
 let next=state,c=combat,time=Math.max(0,delta);
 const building={kind:'barracks' as const,unitType:enemyProductionConfig.unitType,footprint:buildings?.site?.footprint??base.footprint,jobCost:faction?factions[faction].units.soldier.cost:enemyProductionConfig.cost,durationSeconds:(state.durationSeconds??enemyProductionConfig.durationSeconds)+(faction?factions[faction].units.soldier.durationSeconds-5:0)};
 for(;;){
  const units:Unit[]=c.enemies.filter(e=>!e.footprint).map(e=>({kind:'soldier',id:e.id,hp:e.hp,cargo:0,selected:false,position:{...e.position},target:{...e.position},order:{kind:'idle'}}));
  let g:GatheringState={faction,units,wood:next.wood,goldBalance:next.gold,base:base.position,node:{id:'unused',position:base.position,remaining:0}};
  let p=next.production,acceptedJobs=next.acceptedJobs,spent=next.spent?{...next.spent}:undefined;
  const population=()=>({cap:Math.min(next.cap,buildings?.maxArmy??Infinity,buildings?buildings.population.cap-c.enemies.filter(e=>e.kind==='worker').length-(buildings.workerReservations??0):Infinity),used:c.enemies.filter(e=>!e.footprint&&e.kind!=='ship'&&e.kind!=='worker').length+(buildings?.embarked??0),reserved:p.queue?.reduce((n,j)=>n+(j.supply??1),0)??0});
  const savingForFarm=()=>buildings?.reserveForFarm!==undefined&&population().used+population().reserved+c.enemies.filter(e=>e.kind==='worker').length+(buildings.workerReservations??0)>=buildings.population.cap-buildings.reserveForFarm;
  while(buildings?.startAllowed!==false&&!savingForFarm()&&canEnqueue(g,p,building,population())){const started=enqueueProduction(g,p,building,population());if(spent){spent.wood+=g.wood-started.gathering.wood;spent.gold+=(g.goldBalance??0)-(started.gathering.goldBalance??0);}g=started.gathering;p=started.production;acceptedJobs++;}
  if(p.remainingSeconds===null)return {combat:c,state:{...next,wood:g.wood,gold:g.goldBalance??0,production:p,acceptedJobs,...(spent?{spent}:{})}};
  const step=Math.min(time,p.remainingSeconds);
  const result=updateQueuedProduction(g,p,step,building,{map,enemies:player.units});
  const spawned:Enemy[]=result.gathering.units.slice(units.length).map(u=>({id:`enemy-produced-${u.id.slice(5)}`,kind:'unit',owner:'enemy',order:{kind:'idle'},hp:combatConfig.enemyHP,position:{...u.position}}));
  c={...c,enemies:[...c.enemies,...spawned]};
  next={...next,wood:result.gathering.wood,gold:result.gathering.goldBalance??0,production:result.production,acceptedJobs,...(spent?{spent}:{})};
  time=Math.max(0,time-step);
  if(!time||step===0&&!spawned.length)return {combat:c,state:next};
 }
}
