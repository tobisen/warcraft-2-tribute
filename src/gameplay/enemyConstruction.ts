import {academyCampaignReason,campaignContentFor,contentReason} from '../config/campaignContent';
import {isAir} from './domains';
import {approachRoute} from './approach';
import {enemyNavigationMap} from './map';
import {enemySoldier,enemySupply} from './enemyUnits';
import {factionForTeam} from '../config/factions';
import {maps} from '../config/maps';
import {enemyExpansionConfig} from '../config/enemyExpansion';
import {enemyPolicyConfig} from '../config/enemyPolicy';
import {forgeConfig,upgradeConfig} from '../config/upgrades';
import {enemyConstructionConfig as config} from '../config/enemyConstruction';
import {combatConfig} from '../config/combat';
import {combatUnitStats,unitStats} from '../config/unit';
import {buildingFootprint,beginPlacement,placeBuilding,type PlacementState} from './placement';
import {resumeConstruction,updateConstruction} from './construction';
import {populationState} from './population';
import {overlaps} from './map';
import {unitBody} from './spawning';
import {enemyWorker} from './enemyGathering';
import type {Enemy} from './combat';
import type {GatheringState,Worker} from './gathering';
import type {MatchState} from './match';
import type {GateFor} from './traffic';
export interface EnemyConstructionState {nextAttemptSeconds:number}
export const createEnemyConstruction=():EnemyConstructionState=>({nextAttemptSeconds:0});
export function enemyBuildingView(m:MatchState):PlacementState {
 const bar=m.combat.enemies.find(e=>e.buildingType==='barracks'),farm=m.combat.enemies.find(e=>e.buildingType==='farm'),forge=m.combat.enemies.find(e=>e.buildingType==='forge'),academy=m.combat.enemies.find(e=>e.buildingType==='academy');
 return {...(academy?{academy:{id:'academy',owner:'player',hp:academy.hp,footprint:academy.footprint!,construction:academy.construction!}}:{}),...(forge?{forge:{id:'forge' as const,owner:'player' as const,hp:forge.hp,footprint:forge.footprint!,construction:forge.construction!}}:{}),active:false,barracks:bar?.footprint??null,...(bar?{barracksOwner:'player',barracksHP:bar.hp,construction:bar.construction}:{}),farms:farm?[{id:'farm-1',owner:'player',hp:farm.hp,footprint:farm.footprint!,construction:farm.construction!}]:[],nextFarmNumber:1};
}
export function enemyPopulation(m:MatchState){
 const g:GatheringState={...m.gathering,faction:factionForTeam(m,'enemy').id,units:m.combat.enemies.flatMap(e=>{const w=enemyWorker(e);return w&&e.hp>0?[w]:[];})};g.units=[...g.units,...m.combat.enemies.filter(e=>!e.footprint&&e.kind!=='worker'&&e.kind!=='ship'&&e.hp>0).map(e=>enemySoldier(e,factionForTeam(m,'enemy').id))];
 const population=populationState(g,enemyBuildingView(m),[...(m.enemyProduction?[m.enemyProduction.production]:[]),...(m.enemyRecovery?[m.enemyRecovery.production]:[])]);
 return {...population,used:population.used+m.combat.enemies.filter(e=>e.kind==='ship'&&e.hp>0).reduce((n,e)=>n+enemySupply(e,factionForTeam(m,'enemy').id),0)+(m.enemyNaval?.passengers.reduce((n,e)=>n+enemySupply(e,factionForTeam(m,'enemy').id),0)??0),reserved:population.reserved+(m.enemyNaval?.production.queue?.reduce((n,j)=>n+(j.supply??1),0)??0),cap:population.cap+m.combat.enemies.filter(e=>e.buildingType==='outpost'&&e.hp>0&&e.construction?.remainingSeconds===0).length*enemyExpansionConfig.supply};
}
function economy(m:MatchState):GatheringState {const base=m.combat.enemies.find(e=>e.kind==='base')!;return {faction:factionForTeam(m,'enemy').id,base:base.position,baseSize:base.footprint!.width,units:m.combat.enemies.flatMap(e=>{const w=enemyWorker(e);return w?[w]:[];}),wood:m.enemyProduction!.wood,goldBalance:m.enemyProduction!.gold,node:m.gathering.node,gold:m.gathering.gold,extraNodes:m.gathering.extraNodes};}
function workers(m:MatchState,g:GatheringState){const byId=new Map(g.units.map(u=>[u.id,u as Worker]));return m.combat.enemies.map(e=>{const u=byId.get(e.id);return u?{...e,position:u.position,navigation:u.navigation,work:{cargo:u.cargo,cargoType:u.cargoType,target:u.target,order:u.order}}:e;});}
function copySites(enemies:Enemy[],p:PlacementState):Enemy[]{return enemies.map(e=>e.buildingType==='barracks'?{...e,construction:p.construction}:e.buildingType==='farm'?{...e,construction:p.farms?.[0]?.construction}:e.buildingType==='forge'?{...e,construction:p.forge?.construction}:e.buildingType==='academy'?{...e,construction:p.academy?.construction}:e);}
/** Bounded build decisions before the shared traffic snapshot. */
export function prepareEnemyConstruction(m:MatchState):MatchState {
 if(!m.enemyConstruction||!m.enemyProduction||!m.combat.enemies.some(e=>e.kind==='base'&&e.hp>0))return m;
 let p=enemyBuildingView(m),g=economy(m);const site=m.combat.enemies.find(e=>e.construction&&e.construction.remainingSeconds>0);
 if(site?.buildingType==='harbor')return m;
 if(site){const builder=m.combat.enemies.find(e=>e.id===site.construction!.builderId&&e.hp>0&&e.work?.order.kind==='build');if(builder&&builder.navigation?.status!=='blocked')return m;}
 if(m.waves.elapsedSeconds+1e-9<m.enemyConstruction.nextAttemptSeconds)return m;
 m={...m,enemyConstruction:{nextAttemptSeconds:m.waves.elapsedSeconds+config.retrySeconds}};
 const available=g.units.filter(u=>u.kind==='worker'&&u.hp!>0).sort((a,b)=>a.id.localeCompare(b.id));
 if(site){for(const builder of available){g={...g,units:g.units.map(u=>({...u,selected:u.id===builder.id}))};const result=resumeConstruction(g,p,enemyNavigationMap(m.map),site.buildingType==='farm'?'farm-1':site.buildingType!);const job=site.buildingType==='barracks'?result.placement.construction:site.buildingType==='forge'?result.placement.forge?.construction:site.buildingType==='academy'?result.placement.academy?.construction:result.placement.farms?.[0]?.construction;if(job?.builderId===builder.id)return {...m,combat:{...m.combat,enemies:copySites(workers(m,result.gathering),result.placement)}};}return m;}
 const pop=enemyPopulation(m),kind=!p.barracks?'barracks':(p.farms?.length??0)<config.maxFarms&&pop.used+pop.reserved>=pop.cap-config.supplyMargin?'farm':m.enemyPolicy&&!p.forge&&(m.enemyPolicy.research.attack<(academyCampaignReason(m)?1:upgradeConfig.maxLevel)||m.enemyPolicy.research.defense<(academyCampaignReason(m)?1:upgradeConfig.maxLevel))&&m.combat.enemies.filter(e=>!e.footprint&&e.kind!=='worker'&&e.hp>0).length>=enemyPolicyConfig.minLiveArmy?'forge':m.enemyPolicy&&!academyCampaignReason(m)&&!p.academy&&p.forge?.construction.remainingSeconds===0&&m.enemyPolicy.research.attack>=1&&m.enemyPolicy.research.defense>=1?'academy':null;
 if(!kind)return m;
 for(const builder of available)for(const point of m.aiContext?.buildSites??maps[m.map.id??'arena'].enemyBuildSites??config.candidates){
  g={...g,units:g.units.map(u=>({...u,selected:u.id===builder.id}))};
  const rect={...point,width:64,height:64};if(m.gathering.units.some(u=>!isAir(u)&&overlaps(rect,unitBody(u.position,(u.kind==='worker'?unitStats:combatUnitStats(u)).size))))continue;
  // Ordinary placement already checks reachability; only open gates need the enemy-only view.
  if(m.map.enemyPassageBlocks?.length&&approachRoute(enemyNavigationMap(m.map),builder.position,buildingFootprint(point,kind),24).status==='blocked')continue;
  const placed=placeBuilding(beginPlacement(p,kind),point,g.wood,[],{map:m.map,gathering:g,enemies:[...m.gathering.units,...m.combat.enemies.filter(e=>!e.footprint&&e.kind!=='worker')]});
  if(!placed.gathering||placed.wood===g.wood)continue;
  p=placed.placement;const footprint=kind==='barracks'?p.barracks!:kind==='forge'?p.forge!.footprint:kind==='academy'?p.academy!.footprint:p.farms![0].footprint,construction=kind==='barracks'?p.construction!:kind==='forge'?p.forge!.construction:kind==='academy'?p.academy!.construction:p.farms![0].construction;
  const entity:Enemy={id:kind==='farm'?'enemy-farm-1':`enemy-${kind}`,kind:'building',owner:'enemy',buildingType:kind,construction,footprint,position:{x:footprint.x+32,y:footprint.y+32},hp:factionForTeam(m,'enemy').buildings[kind].hp};
  const bank=m.enemyProduction!;return {...m,map:placed.map!,enemyProduction:{...bank,wood:placed.gathering.wood,gold:placed.gathering.goldBalance??0,spent:{wood:(bank.spent?.wood??0)+bank.wood-placed.gathering.wood,gold:(bank.spent?.gold??0)+bank.gold-(placed.gathering.goldBalance??0)}},combat:{...m.combat,enemies:[...workers(m,placed.gathering),entity]}};
 }
 return m;
}
export function updateEnemyConstruction(m:MatchState,delta:number,gateFor?:GateFor):{match:MatchState;productionDelta:number} {
 if(!m.enemyConstruction||!m.enemyProduction||!m.combat.enemies.some(e=>e.kind==='base'))return {match:m,productionDelta:delta};
 const result=updateConstruction(economy(m),enemyBuildingView(m),enemyNavigationMap(m.map),delta,gateFor?(id=>gateFor(id.replace(/^player:/,'enemy:'))):undefined);
 const ready=result.placement.barracks&&result.placement.construction?.remainingSeconds===0;
 return {match:{...m,combat:{...m.combat,enemies:copySites(workers(m,result.gathering),result.placement)}},productionDelta:ready?Math.max(0,delta-(result.barracksReadyAfter??0)):0};
}
