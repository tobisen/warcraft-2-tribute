import {knownEnemyNode} from './enemyKnowledge';
import {wantsEnemyExpansion} from './enemyExpansion';
import {enemyExpansionConfig} from '../config/enemyExpansion';
import {needsEnemyWorker} from './enemyRecovery';
import {costs} from '../config/economy';
import {enemyPolicyConfig as config} from '../config/enemyPolicy';
import {enemyConstructionConfig} from '../config/enemyConstruction';
import {factions,defaultFactions} from '../config/factions';
import {forgeConfig,upgradeConfig} from '../config/upgrades';
import {queueConfig} from '../config/production';
import {enemyBuildingView,enemyPopulation} from './enemyConstruction';
import {createResearch,startResearch,updateResearch,type ResearchState} from './research';
import {enemyWorker} from './enemyGathering';
import {orderUnits,type GatheringState,type Worker} from './gathering';
import type {MatchState} from './match';
export interface EnemyPolicyState {research:ResearchState}
export const createEnemyPolicy=():EnemyPolicyState=>({research:createResearch()});
export type EnemyPriority='expansion'|'workers'|'barracks'|'supply'|'army'|'forge'|'attack'|'defense';
/** Decisions use only own live entities, paid reservations and bank; discovery is RTS-075. */
export function enemyPriority(m:MatchState):EnemyPriority {
 if(needsEnemyWorker(m))return 'workers';
 if(!m.enemyPolicy)return 'army';
 const p=enemyBuildingView(m),pop=enemyPopulation(m),r=m.enemyPolicy.research;
 if(!p.barracks||p.construction?.remainingSeconds)return 'barracks';
 if(!p.farms?.some(f=>f.construction.remainingSeconds===0)&&pop.used+pop.reserved>=pop.cap-enemyConstructionConfig.supplyMargin)return 'supply';
 if(m.combat.enemies.filter(e=>!e.footprint&&e.kind!=='worker'&&e.hp>0).length<config.minLiveArmy)return 'army';
 if(wantsEnemyExpansion(m))return 'expansion';
 if(r.job||r.attack>=upgradeConfig.maxLevel&&r.defense>=upgradeConfig.maxLevel)return 'army';
 if(!p.forge||p.forge.construction.remainingSeconds>0)return 'forge';
 return r.attack<upgradeConfig.maxLevel?'attack':'defense';
}
export function prepareEnemyPolicy(m:MatchState):MatchState {
 if(!m.enemyPolicy||!m.enemyProduction||!m.combat.enemies.some(e=>e.kind==='base'&&e.hp>0))return m;
 const priority=enemyPriority(m),base=m.combat.enemies.find(e=>e.kind==='base')!,bank=m.enemyProduction;
 let g:GatheringState={base:base.position,baseSize:base.footprint!.width,wood:bank.wood,goldBalance:bank.gold,units:m.combat.enemies.flatMap(e=>{const w=enemyWorker(e);return w?[w]:[];}),node:knownEnemyNode(m,m.gathering.node)??{...m.gathering.node,remaining:0},gold:knownEnemyNode(m,m.gathering.gold)};
 let research=m.enemyPolicy.research;
 if(priority==='attack'||priority==='defense'){const started=startResearch(g,research,enemyBuildingView(m),priority);g=started.gathering;research=started.research;}
 const recipe=factions[(m.factions??defaultFactions).enemy].units.soldier.cost;
 const desired=priority==='expansion'?enemyExpansionConfig.cost:priority==='workers'?costs.worker:priority==='forge'?forgeConfig.cost:priority==='attack'||priority==='defense'?upgradeConfig.cost:priority==='barracks'?costs.barracks:priority==='supply'?costs.farm:{wood:recipe.wood*queueConfig.maxJobs,gold:recipe.gold*queueConfig.maxJobs};
 const woodBias=(g.goldBalance??0)>=desired.gold&&g.wood<desired.wood;
 const woodWorker=g.units.filter(u=>u.kind==='worker'&&u.hp!>0).map(u=>u.id).sort((a,b)=>a.localeCompare(b,'en',{numeric:true}))[0];
 for(const worker of [...g.units]){if(worker.kind!=='worker'||worker.hp!<=0||worker.order.kind!=='idle'&&!(worker.order.kind==='gather'&&worker.cargo<=config.emptyCargoEpsilon))continue;const desiredNode=worker.id===woodWorker||woodBias||!g.gold?.remaining?g.node:g.gold;const node=desiredNode.remaining>0?desiredNode:g.node.remaining>0?g.node:g.gold;if(!node||node.remaining<=0||'nodeId' in worker.order&&worker.order.nodeId===node.id)continue;g.units=orderUnits(g.units.map(u=>({...u,selected:u.id===worker.id})),node.position,node);}
 const byId=new Map(g.units.map(u=>[u.id,u as Worker]));
 return {...m,enemyPolicy:{research},enemyProduction:{...bank,wood:g.wood,gold:g.goldBalance??0,spent:{wood:(bank.spent?.wood??0)+bank.wood-g.wood,gold:(bank.spent?.gold??0)+bank.gold-(g.goldBalance??0)}},combat:{...m.combat,enemies:m.combat.enemies.map(e=>{const u=byId.get(e.id);return u?{...e,navigation:u.navigation,work:{cargo:u.cargo,cargoType:u.cargoType,target:u.target,order:u.order}}:e;})}};
}
export function advanceEnemyPolicy(m:MatchState,delta:number):EnemyPolicyState|undefined {
 return m.enemyPolicy?{research:updateResearch(m.enemyPolicy.research,enemyBuildingView(m),delta)}:undefined;
}
