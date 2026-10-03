import {enemyStartingBudget} from '../config/enemyNaval';
import {passengerUnits} from './navy';
import {mapResourceTotals} from '../config/maps';
import {resourceNodes} from './gathering';
import {scenarioConfig} from '../config/scenarios';
import {difficultyProfiles} from '../config/difficulty';
import {enemyEconomyConfig} from '../config/enemyEconomy';
import type {ResourceType} from './gathering';
import type {MatchState} from './match';
export interface ResourceStats {gathered:number;delivered:number;spent:number}
export interface TeamStats {wood:ResourceStats;gold:ResourceStats;added:number;lost:number;killed:number;built:number;destroyed:number;removed:number}
export interface MatchStats {seconds:number;player:TeamStats;enemy:TeamStats}
const nonnegative=(n:number)=>Math.max(0,Math.abs(n)<1e-8?0:n);
/** All totals derive from existing authoritative counters/finite resource accounting. */
export function matchStats(m:MatchState):MatchStats {
 const definition=mapResourceTotals(m.map.id??'arena'),initial=scenarioConfig[m.scenario??'survival'].initial,profile=difficultyProfiles[m.difficulty??'normal'],bank=m.enemyProduction,budget=enemyStartingBudget(profile.budget,!!m.enemyNaval);
 const playerResource=(type:ResourceType):ResourceStats=>{
  const enemyGathered=bank?.extracted?.[type]??0,remaining=resourceNodes(m.gathering).filter(n=>(n.resource??'wood')===type).reduce((sum,n)=>sum+n.remaining,0);
  const gathered=nonnegative(definition[type]-remaining-enemyGathered),balance=type==='wood'?m.gathering.wood:m.gathering.goldBalance??0;
  const carried=[...m.gathering.units,...passengerUnits(m.navy)].reduce((n,u)=>n+(u.kind==='worker'&&(u.cargoType??'wood')===type?u.cargo:0),0),lost=m.gathering.lostCargo?.[type]??0;
  const spent=nonnegative(initial[type]+gathered-balance-carried-lost);
  return {gathered,delivered:nonnegative(gathered-carried-lost),spent};
 };
 const enemyResource=(type:ResourceType):ResourceStats=>{
  const gathered=bank?.extracted?.[type]??0,carried=[...m.combat.enemies,...(m.enemyNaval?.passengers??[])].reduce((n,e)=>n+(e.work&&(e.work.cargoType??'wood')===type?e.work.cargo:0),0),lost=bank?.lostCargo?.[type]??0;
  return {gathered,delivered:nonnegative(gathered-carried-lost),spent:bank?.spent?.[type]??(bank?nonnegative(budget[type]-bank[type]):0)};
 };
 const playerAdded=nonnegative(Math.max(m.production.nextUnitNumber,m.soldierProduction.nextUnitNumber)-4+(m.navy?m.navy.production.nextUnitNumber-1:0)),playerLost=nonnegative(3+playerAdded-[...m.gathering.units,...passengerUnits(m.navy)].filter(u=>(u.hp??1)>0).length-(m.navy?.ships.filter(s=>s.hp>0).length??0)-(m.statLedger?.player.removed??0));
 const initialEnemyWorkers=bank?.extracted?enemyEconomyConfig.workerCount:0;
 const enemyAdded=(m.enemyNaval?.production.nextUnitNumber??1)-1+(m.waves.nextEnemyNumber-1)+(bank?.production.nextUnitNumber??1)-1+(m.enemyRecovery?m.enemyRecovery.production.nextUnitNumber-enemyEconomyConfig.workerCount-1:0);
 const enemyLost=nonnegative(initialEnemyWorkers+enemyAdded-m.combat.enemies.filter(e=>!e.footprint&&e.hp>0).length-(m.enemyNaval?.passengers.length??0)-(m.statLedger?.enemy.removed??0));
 return {seconds:m.waves.elapsedSeconds,player:{wood:playerResource('wood'),gold:playerResource('gold'),added:playerAdded,lost:playerLost,killed:enemyLost,built:m.statLedger?.player.built??0,destroyed:m.statLedger?.player.destroyed??0,removed:m.statLedger?.player.removed??0},enemy:{wood:enemyResource('wood'),gold:enemyResource('gold'),added:nonnegative(enemyAdded),lost:enemyLost,killed:playerLost,built:m.statLedger?.enemy.built??0,destroyed:m.statLedger?.enemy.destroyed??0,removed:m.statLedger?.enemy.removed??0}};
}
