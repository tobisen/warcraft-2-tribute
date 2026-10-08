import {roleResearchKinds,roleResearchConfig,isRoleResearch,type RoleResearchKind} from '../config/roleResearch';
import {enemyBase,hasEnemyBase} from './enemyBases';
import {academyCampaignReason,campaignContentFor,contentReason} from '../config/campaignContent';
import {aiProfile} from '../config/aiProfiles';
import {nextEnemyRole} from './enemyProduction';
import {technologyFor} from './productionPrerequisites';
import {knownEnemyNode} from './enemyKnowledge';
import {wantsEnemyExpansion} from './enemyExpansion';
import {enemyExpansionConfig} from '../config/enemyExpansion';
import {needsEnemyWorker} from './enemyRecovery';
import {enemyPolicyConfig as config} from '../config/enemyPolicy';
import {enemyConstructionConfig} from '../config/enemyConstruction';
import {factions,defaultFactions} from '../config/factions';
import {queueConfig} from '../config/production';
import {enemyBuildingView,enemyPopulation} from './enemyConstruction';
import {createResearch,startResearch,updateResearch,researchRecipe,type ResearchState} from './research';
import {knownResourceFor,enemyWorker} from './enemyGathering';
import {orderUnits,type GatheringState,type Worker} from './gathering';
import type {MatchState} from './match';
export interface EnemyPolicyState {research:ResearchState}
export const createEnemyPolicy=():EnemyPolicyState=>({research:createResearch()});
export type EnemyPriority=RoleResearchKind|'expansion'|'workers'|'barracks'|'supply'|'army'|'forge'|'academy'|'attack'|'defense';
/** Decisions use only own live entities, paid reservations and bank; discovery is RTS-075. */
export function enemyPriority(m:MatchState):EnemyPriority {
 if(needsEnemyWorker(m))return 'workers';
 if(!m.enemyPolicy)return 'army';
 const p=enemyBuildingView(m),pop=enemyPopulation(m),r=m.enemyPolicy.research;
 if(!p.barracks||p.construction?.remainingSeconds)return 'barracks';
 if(!p.farms?.some(f=>f.construction.remainingSeconds===0)&&pop.used+pop.reserved>=pop.cap-enemyConstructionConfig.supplyMargin)return 'supply';
 if(m.combat.enemies.filter(e=>!e.footprint&&e.kind!=='worker'&&e.hp>0).length<aiProfile(m).minArmy)return 'army';
 if(wantsEnemyExpansion(m))return 'expansion';
 if(r.job||r.attack>=factions[(m.factions??defaultFactions).enemy].upgrades.attack.maxLevel&&r.defense>=factions[(m.factions??defaultFactions).enemy].upgrades.defense.maxLevel)return r.job?'army':roleResearchKinds.find(k=>!r[k]&&!contentReason(campaignContentFor(m),'research',k)&&roleResearchConfig[k].buildings.every(b=>{const site=p[b];return !!site&&site.construction.remainingSeconds===0;}))??'army';
 if(!p.forge||p.forge.construction.remainingSeconds>0)return 'forge';
 const first=aiProfile(m).researchFirst;if(r[first]<1)return first;const second=first==='attack'?'defense':'attack';if(r[second]<1)return second;if(academyCampaignReason(m))return 'army';if(!p.academy||p.academy.construction.remainingSeconds>0)return 'academy';return r[first]<factions[(m.factions??defaultFactions).enemy].upgrades[first].maxLevel?first:first==='attack'?'defense':'attack';
}
export function prepareEnemyPolicy(m:MatchState):MatchState {
 if(!m.enemyPolicy||!m.enemyProduction||!hasEnemyBase(m.combat,m.map))return m;
 const priority=enemyPriority(m),base=enemyBase(m.combat,m.map)!,bank=m.enemyProduction;
 let g:GatheringState={campaignContent:campaignContentFor(m),faction:(m.factions??defaultFactions).enemy,base:base.position,baseSize:base.footprint!.width,wood:bank.wood,goldBalance:bank.gold,units:m.combat.enemies.flatMap(e=>{const w=enemyWorker(e);return w?[w]:[];}),node:knownResourceFor(m,'wood')??{...m.gathering.node,remaining:0},gold:knownResourceFor(m,'gold')};
 let research=m.enemyPolicy.research;
 if(priority==='attack'||priority==='defense'||isRoleResearch(priority)){const started=startResearch(g,research,enemyBuildingView(m),priority);g=started.gathering;research=started.research;}
 const faction=factions[(m.factions??defaultFactions).enemy],recipe=faction.units[nextEnemyRole(bank,faction.id,technologyFor(m,'enemy'),m.enemyNaval?2:undefined)??'soldier'].cost;
 const desired=priority==='expansion'?enemyExpansionConfig.cost:priority==='workers'?faction.units.worker.cost:priority==='academy'?faction.buildings.academy.cost:priority==='forge'?faction.buildings.forge.cost:priority==='attack'||priority==='defense'||isRoleResearch(priority)?researchRecipe(faction,priority,research[priority]??0).cost:priority==='barracks'?faction.buildings.barracks.cost:priority==='supply'?faction.buildings.farm.cost:{wood:recipe.wood*queueConfig.maxJobs,gold:recipe.gold*queueConfig.maxJobs};
 const woodBias=(g.goldBalance??0)>=desired.gold&&g.wood<desired.wood;
 const woodWorker=g.units.filter(u=>u.kind==='worker'&&u.hp!>0).map(u=>u.id).sort((a,b)=>a.localeCompare(b,'en',{numeric:true}))[0];
 for(const worker of [...g.units]){if(worker.kind!=='worker'||worker.hp!<=0||worker.order.kind!=='idle'&&!(worker.order.kind==='gather'&&worker.cargo<=config.emptyCargoEpsilon))continue;const type=worker.id===woodWorker||woodBias||!g.gold?.remaining?'wood':'gold';const current='nodeId' in worker.order?m.enemyKnowledge?.nodes.find(n=>n.id===('nodeId' in worker.order?worker.order.nodeId:undefined)):undefined;const node=current&&(current.resource??'wood')===type&&current.remaining>0?current:knownResourceFor(m,type,worker.position)??knownResourceFor(m,type==='wood'?'gold':'wood',worker.position);if(!node||node.remaining<=0||'nodeId' in worker.order&&worker.order.nodeId===node.id)continue;g.units=orderUnits(g.units.map(u=>({...u,selected:u.id===worker.id})),node.position,node);}
 const byId=new Map(g.units.map(u=>[u.id,u as Worker]));
 return {...m,enemyPolicy:{research},enemyProduction:{...bank,wood:g.wood,gold:g.goldBalance??0,spent:{wood:(bank.spent?.wood??0)+bank.wood-g.wood,gold:(bank.spent?.gold??0)+bank.gold-(g.goldBalance??0)}},combat:{...m.combat,enemies:m.combat.enemies.map(e=>{const u=byId.get(e.id);return u?{...e,navigation:u.navigation,work:{cargo:u.cargo,cargoType:u.cargoType,target:u.target,order:u.order}}:e;})}};
}
export function advanceEnemyPolicy(m:MatchState,delta:number):EnemyPolicyState|undefined {
 return m.enemyPolicy?{research:updateResearch(m.enemyPolicy.research,enemyBuildingView(m),delta,true,(m.factions??defaultFactions).enemy,hasEnemyBase(m.combat,m.map))}:undefined;
}
