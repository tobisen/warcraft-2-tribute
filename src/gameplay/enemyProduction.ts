import {factions,type FactionId} from '../config/factions';
import { enemyProductionConfig } from '../config/enemyProduction';
import { combatConfig } from '../config/combat';
import { canEnqueue,enqueueProduction,updateQueuedProduction } from './productionQueue';
import type { ProductionState } from './production';
import type { CombatState,Enemy } from './combat';
import type { GatheringState,Unit } from './gathering';
import type { WorldMap } from './map';
export interface EnemyProductionState {wood:number;gold:number;cap:number;production:ProductionState;acceptedJobs:number;durationSeconds?:number}
export function createEnemyProduction(profile:{budget:{wood:number;gold:number};cap:number;durationSeconds:number}=enemyProductionConfig):EnemyProductionState {
 return {wood:profile.budget.wood,gold:profile.budget.gold,cap:profile.cap,...(profile===enemyProductionConfig?{}:{durationSeconds:profile.durationSeconds}),
 production:{remainingSeconds:null,nextUnitNumber:1},acceptedJobs:0};
}
/** Adapter to shared atomic queue/time/spawn rules; temporary units never enter player state. */
export function updateEnemyProduction(state:EnemyProductionState,combat:CombatState,player:GatheringState,map:WorldMap,delta:number,faction?:FactionId) {
 const base=combat.enemies.find(e=>e.kind==='base'&&e.hp>0);
 if(!base?.footprint)return {combat,state:{...state,production:{...state.production,queue:[],remainingSeconds:null,blockedSpawnKey:undefined}}};
 let next=state,c=combat,time=Math.max(0,delta);
 const building={kind:'barracks' as const,unitType:enemyProductionConfig.unitType,footprint:base.footprint,jobCost:faction?factions[faction].units.soldier.cost:enemyProductionConfig.cost,durationSeconds:(state.durationSeconds??enemyProductionConfig.durationSeconds)+(faction?factions[faction].units.soldier.durationSeconds-5:0)};
 for(;;){
  const units:Unit[]=c.enemies.filter(e=>e.kind!=='base').map(e=>({kind:'soldier',id:e.id,hp:e.hp,cargo:0,selected:false,position:{...e.position},target:{...e.position},order:{kind:'idle'}}));
  let g:GatheringState={faction,units,wood:next.wood,goldBalance:next.gold,base:base.position,node:{id:'unused',position:base.position,remaining:0}};
  let p=next.production,acceptedJobs=next.acceptedJobs;
  const population=()=>({cap:next.cap,used:units.length,reserved:p.queue?.reduce((n,j)=>n+(j.supply??1),0)??0});
  while(canEnqueue(g,p,building,population())){const started=enqueueProduction(g,p,building,population());g=started.gathering;p=started.production;acceptedJobs++;}
  if(p.remainingSeconds===null)return {combat:c,state:{...next,wood:g.wood,gold:g.goldBalance??0,production:p,acceptedJobs}};
  const step=Math.min(time,p.remainingSeconds);
  const result=updateQueuedProduction(g,p,step,building,{map,enemies:player.units});
  const spawned:Enemy[]=result.gathering.units.slice(units.length).map(u=>({id:`enemy-produced-${u.id.slice(5)}`,kind:'unit',owner:'enemy',order:{kind:'idle'},hp:combatConfig.enemyHP,position:{...u.position}}));
  c={...c,enemies:[...c.enemies,...spawned]};
  next={...next,wood:result.gathering.wood,gold:result.gathering.goldBalance??0,production:result.production,acceptedJobs};
  time=Math.max(0,time-step);
  if(!time||step===0&&!spawned.length)return {combat:c,state:next};
 }
}
