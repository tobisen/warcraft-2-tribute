import {enemyBase} from './enemyBases';
import {compositionRole,type ArmyPlan} from './combinedArmy';
import {isAir} from './domains';
import {unitAvailability} from './productionPrerequisites';
import {enemySoldier,enemySupply} from './enemyUnits';
import {factions,type UnitRole,type FactionId,type TechnologyState} from '../config/factions';
import { enemyProductionConfig } from '../config/enemyProduction';
import { combatConfig } from '../config/combat';
import { canEnqueue,enqueueProduction,updateQueuedProduction } from './productionQueue';
import type { ProductionState } from './production';
import type { CombatState,Enemy } from './combat';
import type { GatheringState,Unit } from './gathering';
import type {Population} from './population';
import type { WorldMap } from './map';
export interface EnemyProductionState {baseDevelopment?:import('../config/baseUpgrade').BaseDevelopment;wood:number;gold:number;cap:number;production:ProductionState;acceptedJobs:number;roster?:true;durationSeconds?:number;extracted?:{wood:number;gold:number};spent?:{wood:number;gold:number};lostCargo?:{wood:number;gold:number}}
export function createEnemyProduction(profile:{budget:{wood:number;gold:number};cap:number;durationSeconds:number}=enemyProductionConfig,roster=false):EnemyProductionState {
 return {...(roster?{roster:true as const}:{}),wood:profile.budget.wood,gold:profile.budget.gold,cap:profile.cap,...(profile===enemyProductionConfig?{}:{durationSeconds:profile.durationSeconds}),
 production:{remainingSeconds:null,nextUnitNumber:1},acceptedJobs:0};
}
/** Skip locked recipes, but save for the next unlocked role instead of buying cheap units forever. */
export function nextEnemyRole(state:EnemyProductionState,faction?:FactionId,technology?:TechnologyState,maxArmy?:number):Exclude<UnitRole,'worker'>|undefined{
 const profile=faction?factions[faction]:undefined;
 const roles=state.roster&&profile?profile.roster.filter((role):role is Exclude<UnitRole,'worker'>=>role!=='worker'):['soldier' as const];
 return roles.map((_,i)=>roles[(state.acceptedJobs+i)%roles.length]).find(role=>(!profile||!unitAvailability(profile,role,technology))&&(maxArmy!==2||role==='air'||(profile?.units[role].supply??1)===1));
}
/** Adapter to shared atomic queue/time/spawn rules; temporary units never enter player state. */
export function updateEnemyProduction(state:EnemyProductionState,combat:CombatState,player:GatheringState,map:WorldMap,delta:number,faction?:FactionId,buildings?:{armyPlan?:ArmyPlan;technology?:TechnologyState;site?:Enemy;population:Population;reserveForFarm?:number;startAllowed?:boolean;workerReservations?:number;maxArmy?:number;embarked?:number;airThreat?:boolean}) {
 const base=enemyBase(combat,map);
 if(!base?.footprint)return {combat,state:{...state,production:{...state.production,queue:[],remainingSeconds:null,blockedSpawnKey:undefined}}};
 if(buildings&&(!buildings.site?.footprint||buildings.site.construction?.remainingSeconds!==0))return {combat,state};
 let next=state,c=combat,time=Math.max(0,delta);
 const profile=faction?factions[faction]:undefined;
 const roleBuilding=(role:Exclude<UnitRole,'worker'>)=>({kind:'barracks' as const,producer:role==='healer'||role==='giant'?'academy' as const:role==='cavalry'?'stable' as const:'barracks' as const,bounds:map,technology:buildings?.technology,unitType:role,footprint:role==='healer'||role==='giant'?combat.enemies.find(e=>e.buildingType==='academy'&&e.hp>0&&e.construction?.remainingSeconds===0)?.footprint??null:role==='cavalry'?combat.enemies.find(e=>e.buildingType==='stable'&&e.hp>0&&e.construction?.remainingSeconds===0)?.footprint??null:(map.design==='regions'?combat.enemies.find(e=>e.buildingType==='outpost'&&e.hp>0&&e.construction?.remainingSeconds===0)?.footprint:undefined)??buildings?.site?.footprint??base.footprint!,jobCost:profile?profile.units[role].cost:enemyProductionConfig.cost,durationSeconds:role==='cavalry'||role==='healer'||role==='giant'?profile!.units[role].durationSeconds:Math.max(1,(state.durationSeconds??enemyProductionConfig.durationSeconds)+(profile?profile.units[role].durationSeconds-5:0))});
 for(;;){
  const units:Unit[]=c.enemies.filter(e=>!e.footprint).map(e=>enemySoldier(e,faction??'clans'));
  let g:GatheringState={faction,units,wood:next.wood,goldBalance:next.gold,base:base.position,node:{id:'unused',position:base.position,remaining:0}};
  let p=next.production,acceptedJobs=next.acceptedJobs,spent=next.spent?{...next.spent}:undefined;
  const population=()=>({cap:Math.min(next.cap,buildings?buildings.population.cap-c.enemies.filter(e=>e.kind==='worker').length-(buildings.workerReservations??0):Infinity),used:c.enemies.filter(e=>!e.footprint&&e.kind!=='ship'&&e.kind!=='worker').reduce((n,e)=>n+enemySupply(e,faction??'clans'),0)+(buildings?.embarked??0),reserved:p.queue?.reduce((n,j)=>n+(j.supply??1),0)??0});
  // The transport's two land seats do not cap aircraft. All domains still share real supply.
  const groundCommitted=()=>c.enemies.filter(e=>!e.footprint&&e.kind!=='ship'&&e.kind!=='worker'&&!isAir(e)).reduce((n,e)=>n+enemySupply(e,faction??'clans'),0)+(buildings?.embarked??0)+(p.queue??[]).filter(j=>j.kind!=='air').reduce((n,j)=>n+(j.supply??1),0);
  const savingForFarm=()=>buildings?.reserveForFarm!==undefined&&population().used+population().reserved+c.enemies.filter(e=>e.kind==='worker').length+(buildings.workerReservations??0)>=buildings.population.cap-buildings.reserveForFarm;
  while(buildings?.startAllowed!==false&&!savingForFarm()){
   const counter=buildings?.airThreat&&c.enemies.filter(e=>e.role==='archer'&&e.hp>0).length+(p.queue??[]).filter(j=>j.kind==='archer').length<2;
   const role=counter?'archer':buildings?.armyPlan?compositionRole(buildings.armyPlan,c,p,faction,buildings.technology,buildings.maxArmy,buildings.embarked,acceptedJobs):nextEnemyRole({...state,acceptedJobs},faction,buildings?.technology,buildings?.maxArmy);
   if(!role||role!=='air'&&groundCommitted()+(profile?.units[role].supply??1)>(buildings?.maxArmy??Infinity)||!canEnqueue(g,p,roleBuilding(role),population()))break;
   const started=enqueueProduction(g,p,roleBuilding(role),population());if(spent){spent.wood+=g.wood-started.gathering.wood;spent.gold+=(g.goldBalance??0)-(started.gathering.goldBalance??0);}g=started.gathering;p=started.production;acceptedJobs++;
  }
  if(p.remainingSeconds===null)return {combat:c,state:{...next,wood:g.wood,gold:g.goldBalance??0,production:p,acceptedJobs,...(spent?{spent}:{})}};
  const step=Math.min(time,p.remainingSeconds);
  const result=updateQueuedProduction(g,p,step,roleBuilding((p.queue?.[0]?.kind??'soldier') as Exclude<UnitRole,'worker'>),{map,enemies:player.units});
  const spawned:Enemy[]=result.gathering.units.slice(units.length).map(u=>({id:`enemy-produced-${u.id.slice(5)}`,kind:'unit',owner:'enemy',order:{kind:'idle'},...(u.kind==='soldier'&&u.archetype==='healer'?{healAutocast:true}:{}),...(u.kind==='soldier'&&u.mana!==undefined?{mana:u.mana}:{}),...(state.roster?{role:u.kind==='soldier'?u.archetype??'soldier':'soldier',hp:u.hp!}: {hp:combatConfig.enemyHP}),position:{...u.position}}));
  c={...c,enemies:[...c.enemies,...spawned]};
  next={...next,wood:result.gathering.wood,gold:result.gathering.goldBalance??0,production:result.production,acceptedJobs,...(spent?{spent}:{})};
  time=Math.max(0,time-step);
  if(!time||step===0&&!spawned.length)return {combat:c,state:next};
 }
}
