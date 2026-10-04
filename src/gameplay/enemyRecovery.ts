import {enemyNavigationMap} from './map';
import {enemyEconomyConfig} from '../config/enemyEconomy';
import {defaultFactions} from '../config/factions';
import {enqueueProduction,updateQueuedProduction} from './productionQueue';
import {enemyWorker} from './enemyGathering';
import {enemyPopulation} from './enemyConstruction';
import type {ProductionState} from './production';
import type {GatheringState,Worker} from './gathering';
import type {MatchState} from './match';
export interface EnemyRecoveryState {production:ProductionState;nextExpansionAttemptSeconds:number}
export const createEnemyRecovery=():EnemyRecoveryState=>({nextExpansionAttemptSeconds:0,production:{remainingSeconds:null,nextUnitNumber:enemyEconomyConfig.workerCount+1}});
export function needsEnemyWorker(m:MatchState):boolean {
 return !!m.enemyRecovery&&m.combat.enemies.filter(e=>e.kind==='worker'&&e.hp>0).length<enemyEconomyConfig.workerCount;
}
function view(m:MatchState):GatheringState {
 const base=m.combat.enemies.find(e=>e.kind==='base')!;
 return {base:base.position,baseSize:base.footprint!.width,faction:(m.factions??defaultFactions).enemy,wood:m.enemyProduction!.wood,goldBalance:m.enemyProduction!.gold,node:m.gathering.node,gold:m.gathering.gold,units:m.combat.enemies.flatMap(e=>{const w=enemyWorker(e);return w?[w]:[];})};
}
/** Start one replacement, paid immediately. Existing army/research jobs keep progressing. */
export function prepareEnemyRecovery(m:MatchState):MatchState {
 if(!needsEnemyWorker(m)||!m.enemyProduction||!m.combat.enemies.some(e=>e.kind==='base'&&e.hp>0)||m.enemyRecovery!.production.remainingSeconds!==null)return m;
 const g=view(m),started=enqueueProduction(g,m.enemyRecovery!.production,{kind:'base'},enemyPopulation(m));
 if(started.production===m.enemyRecovery!.production)return m;
 return {...m,enemyRecovery:{...m.enemyRecovery!,production:started.production},enemyProduction:{...m.enemyProduction,wood:started.gathering.wood,gold:started.gathering.goldBalance??0,spent:{wood:(m.enemyProduction.spent?.wood??0)+g.wood-started.gathering.wood,gold:(m.enemyProduction.spent?.gold??0)+(g.goldBalance??0)-(started.gathering.goldBalance??0)}}};
}
export function advanceEnemyRecovery(m:MatchState,delta:number):MatchState {
 if(!m.enemyRecovery||!m.enemyProduction||!m.combat.enemies.some(e=>e.kind==='base'&&e.hp>0))return m;
 const g=view(m),result=updateQueuedProduction(g,m.enemyRecovery.production,delta,{kind:'base'},{map:enemyNavigationMap(m.map),enemies:[...m.gathering.units,...m.combat.enemies.filter(e=>e.kind!=='worker')]});
 const existing=new Set(g.units.map(u=>u.id));
 const spawned=result.gathering.units.filter(u=>!existing.has(u.id)).map(unit=>{const u=unit as Worker;return {id:`enemy-worker-${u.id.slice(5)}`,owner:'enemy' as const,kind:'worker' as const,hp:u.hp!,position:u.position,work:{cargo:0,target:u.target,order:{kind:'idle' as const}}};});
 return {...m,enemyRecovery:{...m.enemyRecovery,production:result.production},combat:{...m.combat,enemies:[...m.combat.enemies,...spawned]}};
}
