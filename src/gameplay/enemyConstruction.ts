import {technologyFor} from './productionPrerequisites';
import {baseUpgradeConfig} from '../config/baseUpgrade';
import {regionBuildSites,regionDefinition} from '../config/mapRegions';
import {enemyBase,hasEnemyBase} from './enemyBases';
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
 const siegeWorks=m.combat.enemies.find(e=>e.buildingType==='siegeWorks');const aviary=m.combat.enemies.find(e=>e.buildingType==='aviary');const bar=m.combat.enemies.find(e=>e.buildingType==='barracks'),farm=m.combat.enemies.find(e=>e.buildingType==='farm'),stable=m.combat.enemies.find(e=>e.buildingType==='stable'),forge=m.combat.enemies.find(e=>e.buildingType==='forge'),academy=m.combat.enemies.find(e=>e.buildingType==='academy');
 return {...(siegeWorks?{siegeWorks:{id:'siegeWorks',owner:'player',hp:siegeWorks.hp,footprint:siegeWorks.footprint!,construction:siegeWorks.construction!,production:{remainingSeconds:null,nextUnitNumber:1}}}:{}),...(aviary?{aviary:{id:'aviary',owner:'player',hp:aviary.hp,footprint:aviary.footprint!,construction:aviary.construction!,production:{remainingSeconds:null,nextUnitNumber:1}}}:{}),...(stable?{stable:{id:'stable',owner:'player',hp:stable.hp,footprint:stable.footprint!,construction:stable.construction!,production:{remainingSeconds:null,nextUnitNumber:1}}}:{}),...(academy?{academy:{id:'academy',owner:'player',hp:academy.hp,footprint:academy.footprint!,construction:academy.construction!}}:{}),...(forge?{forge:{id:'forge' as const,owner:'player' as const,hp:forge.hp,footprint:forge.footprint!,construction:forge.construction!}}:{}),active:false,barracks:bar?.footprint??null,...(bar?{barracksOwner:'player',barracksHP:bar.hp,construction:bar.construction}:{}),farms:farm?[{id:'farm-1',owner:'player',hp:farm.hp,footprint:farm.footprint!,construction:farm.construction!}]:[],nextFarmNumber:1};
}
export function enemyPopulation(m:MatchState){
 const g:GatheringState={...m.gathering,faction:factionForTeam(m,'enemy').id,units:m.combat.enemies.flatMap(e=>{const w=enemyWorker(e);return w&&e.hp>0?[w]:[];})};g.units=[...g.units,...m.combat.enemies.filter(e=>!e.footprint&&e.kind!=='worker'&&e.kind!=='ship'&&e.hp>0).map(e=>enemySoldier(e,factionForTeam(m,'enemy').id))];
 const population=populationState(g,enemyBuildingView(m),[...(m.enemyProduction?[m.enemyProduction.production]:[]),...(m.enemyRecovery?[m.enemyRecovery.production]:[])]);
 return {...population,used:population.used+m.combat.enemies.filter(e=>e.kind==='ship'&&e.hp>0).reduce((n,e)=>n+enemySupply(e,factionForTeam(m,'enemy').id),0)+(m.enemyNaval?.passengers.reduce((n,e)=>n+enemySupply(e,factionForTeam(m,'enemy').id),0)??0),reserved:population.reserved+(m.enemyNaval?.production.queue?.reduce((n,j)=>n+(j.supply??1),0)??0),cap:population.cap+m.combat.enemies.filter(e=>e.buildingType==='outpost'&&e.hp>0&&e.construction?.remainingSeconds===0).length*enemyExpansionConfig.supply};
}
function economy(m:MatchState):GatheringState {const base=enemyBase(m.combat,m.map)!;return {campaignContent:campaignContentFor(m),faction:factionForTeam(m,'enemy').id,base:base.position,baseSize:base.footprint!.width,units:m.combat.enemies.flatMap(e=>{const w=enemyWorker(e);return w?[w]:[];}),wood:m.enemyProduction!.wood,goldBalance:m.enemyProduction!.gold,node:m.gathering.node,gold:m.gathering.gold,extraNodes:m.gathering.extraNodes};}
function workers(m:MatchState,g:GatheringState){const byId=new Map(g.units.map(u=>[u.id,u as Worker]));return m.combat.enemies.map(e=>{const u=byId.get(e.id);return u?{...e,position:u.position,navigation:u.navigation,work:{cargo:u.cargo,cargoType:u.cargoType,target:u.target,order:u.order}}:e;});}
function copySites(enemies:Enemy[],p:PlacementState):Enemy[]{return enemies.map(e=>e.buildingType==='barracks'?{...e,construction:p.construction}:e.buildingType==='farm'?{...e,construction:p.farms?.[0]?.construction}:e.buildingType==='forge'?{...e,construction:p.forge?.construction}:e.buildingType==='academy'?{...e,construction:p.academy?.construction}:e.buildingType==='siegeWorks'?{...e,construction:p.siegeWorks?.construction}:e.buildingType==='aviary'?{...e,construction:p.aviary?.construction}:e.buildingType==='stable'?{...e,construction:p.stable?.construction}:e);}
/** Bounded build decisions before the shared traffic snapshot. */
export function prepareEnemyConstruction(m:MatchState):MatchState {
 if(!m.enemyConstruction||!m.enemyProduction||!hasEnemyBase(m.combat,m.map))return m;
 let p=enemyBuildingView(m),g=economy(m);const site=m.combat.enemies.find(e=>e.construction&&e.construction.remainingSeconds>0);
 if(site?.buildingType==='harbor')return m;
 if(site){const builder=m.combat.enemies.find(e=>e.id===site.construction!.builderId&&e.hp>0&&e.work?.order.kind==='build');if(builder&&builder.navigation?.status!=='blocked')return m;}
 if(m.waves.elapsedSeconds+1e-9<m.enemyConstruction.nextAttemptSeconds)return m;
 m={...m,enemyConstruction:{nextAttemptSeconds:m.waves.elapsedSeconds+config.retrySeconds}};
 const available=g.units.filter(u=>u.kind==='worker'&&u.hp!>0).sort((a,b)=>a.id.localeCompare(b.id));
 if(site){for(const builder of available){g={...g,units:g.units.map(u=>({...u,selected:u.id===builder.id}))};const result=resumeConstruction(g,p,enemyNavigationMap(m.map),site.buildingType==='farm'?'farm-1':site.buildingType!);const job=site.buildingType==='barracks'?result.placement.construction:site.buildingType==='forge'?result.placement.forge?.construction:site.buildingType==='siegeWorks'?result.placement.siegeWorks?.construction:site.buildingType==='aviary'?result.placement.aviary?.construction:site.buildingType==='stable'?result.placement.stable?.construction:site.buildingType==='academy'?result.placement.academy?.construction:result.placement.farms?.[0]?.construction;if(job?.builderId===builder.id)return {...m,combat:{...m.combat,enemies:copySites(workers(m,result.gathering),result.placement)}};}return m;}
 if((m.enemyProduction!.baseDevelopment?.level??1)===1&&m.enemyProduction!.baseDevelopment?.remainingSeconds==null&&p.forge?.construction.remainingSeconds===0&&(academyCampaignReason(m)||p.academy?.construction.remainingSeconds===0)&&!contentReason(campaignContentFor(m),'units','cavalry')){const cost=baseUpgradeConfig[2].cost,bank=m.enemyProduction!;if(bank.wood>=cost.wood&&bank.gold>=cost.gold)return {...m,enemyProduction:{...bank,wood:bank.wood-cost.wood,gold:bank.gold-cost.gold,spent:bank.spent?{wood:bank.spent.wood+cost.wood,gold:bank.spent.gold+cost.gold}:undefined,baseDevelopment:{level:1,remainingSeconds:baseUpgradeConfig[2].seconds}}};}
 if(m.enemyProduction!.baseDevelopment?.level===2&&m.enemyProduction!.baseDevelopment.remainingSeconds===null&&p.academy?.construction.remainingSeconds===0&&(m.enemyPolicy?.research.attack??0)>=2&&(m.enemyPolicy?.research.defense??0)>=2&&!contentReason(campaignContentFor(m),'units','giant')){const bank=m.enemyProduction!,cost=baseUpgradeConfig[3].cost;if(bank.wood>=cost.wood&&bank.gold>=cost.gold)return {...m,enemyProduction:{...bank,wood:bank.wood-cost.wood,gold:bank.gold-cost.gold,spent:bank.spent?{wood:bank.spent.wood+cost.wood,gold:bank.spent.gold+cost.gold}:undefined,baseDevelopment:{level:2,remainingSeconds:baseUpgradeConfig[3].seconds}}};}
 const pop=enemyPopulation(m),kind=!p.barracks?'barracks':(p.farms?.length??0)<config.maxFarms&&pop.used+pop.reserved>=pop.cap-config.supplyMargin?'farm':m.enemyPolicy&&!p.forge&&(m.enemyPolicy.research.attack<(academyCampaignReason(m)?1:upgradeConfig.maxLevel)||m.enemyPolicy.research.defense<(academyCampaignReason(m)?1:upgradeConfig.maxLevel))&&m.combat.enemies.filter(e=>!e.footprint&&e.kind!=='worker'&&e.hp>0).length>=enemyPolicyConfig.minLiveArmy?'forge':(m.enemyProduction!.baseDevelopment?.level??1)>=2&&p.forge?.construction.remainingSeconds===0&&!p.siegeWorks&&!contentReason(campaignContentFor(m),'buildings','siegeWorks')?'siegeWorks':(m.enemyProduction!.baseDevelopment?.level??1)>=2&&!p.aviary&&!contentReason(campaignContentFor(m),'buildings','aviary')?'aviary':(m.enemyProduction!.baseDevelopment?.level??1)>=2&&!p.stable&&!contentReason(campaignContentFor(m),'buildings','stable')?'stable':m.enemyPolicy&&!academyCampaignReason(m)&&!p.academy&&p.forge?.construction.remainingSeconds===0&&m.enemyPolicy.research.attack>=1&&m.enemyPolicy.research.defense>=1?'academy':null;
 if(!kind)return m;
 for(const builder of available)for(const point of m.aiContext?.buildSites??(m.map.design==='regions'&&enemyBase(m.combat,m.map)?.buildingType==='outpost'?regionBuildSites(enemyBase(m.combat,m.map)!.footprint!):regionDefinition(m.map.id??'arena',maps[m.map.id??'arena'],m.map.design).enemyBuildSites)??config.candidates){
  g={...g,units:g.units.map(u=>({...u,selected:u.id===builder.id}))};
  const rect={...point,width:64,height:64};if(m.gathering.units.some(u=>!isAir(u)&&overlaps(rect,unitBody(u.position,(u.kind==='worker'?unitStats:combatUnitStats(u)).size))))continue;
  // Ordinary placement already checks reachability; only open gates need the enemy-only view.
  if(m.map.enemyPassageBlocks?.length&&approachRoute(enemyNavigationMap(m.map),builder.position,buildingFootprint(point,kind),24).status==='blocked')continue;
  const placed=placeBuilding(beginPlacement(p,kind),point,g.wood,[],{technology:technologyFor(m,'enemy'),map:m.map,gathering:g,enemies:[...m.gathering.units,...m.combat.enemies.filter(e=>!e.footprint&&e.kind!=='worker')]});
  if(!placed.gathering||placed.wood===g.wood)continue;
  p=placed.placement;const footprint=kind==='barracks'?p.barracks!:kind==='forge'?p.forge!.footprint:kind==='siegeWorks'?p.siegeWorks!.footprint:kind==='aviary'?p.aviary!.footprint:kind==='stable'?p.stable!.footprint:kind==='academy'?p.academy!.footprint:p.farms![0].footprint,construction=kind==='barracks'?p.construction!:kind==='forge'?p.forge!.construction:kind==='siegeWorks'?p.siegeWorks!.construction:kind==='aviary'?p.aviary!.construction:kind==='stable'?p.stable!.construction:kind==='academy'?p.academy!.construction:p.farms![0].construction;
  const entity:Enemy={id:kind==='farm'?'enemy-farm-1':`enemy-${kind}`,kind:'building',owner:'enemy',buildingType:kind,construction,footprint,position:{x:footprint.x+32,y:footprint.y+32},hp:factionForTeam(m,'enemy').buildings[kind].hp};
  const bank=m.enemyProduction!;return {...m,map:placed.map!,enemyProduction:{...bank,wood:placed.gathering.wood,gold:placed.gathering.goldBalance??0,spent:{wood:(bank.spent?.wood??0)+bank.wood-placed.gathering.wood,gold:(bank.spent?.gold??0)+bank.gold-(placed.gathering.goldBalance??0)}},combat:{...m.combat,enemies:[...workers(m,placed.gathering),entity]}};
 }
 return m;
}
export function updateEnemyConstruction(m:MatchState,delta:number,gateFor?:GateFor):{match:MatchState;productionDelta:number} {
 if(!m.enemyConstruction||!m.enemyProduction||!hasEnemyBase(m.combat,m.map))return {match:m,productionDelta:delta};
 const development=m.enemyProduction.baseDevelopment;if(development?.remainingSeconds!=null){const remaining=Math.max(0,development.remainingSeconds-delta);m={...m,enemyProduction:{...m.enemyProduction,baseDevelopment:{level:remaining<=1e-9?(Math.min(3,development.level+1) as 2|3):development.level,remainingSeconds:remaining<=1e-9?null:remaining}}};}
 const result=updateConstruction(economy(m),enemyBuildingView(m),enemyNavigationMap(m.map),delta,gateFor?(id=>gateFor(id.replace(/^player:/,'enemy:'))):undefined);
 const ready=result.placement.barracks&&result.placement.construction?.remainingSeconds===0;
 return {match:{...m,combat:{...m.combat,enemies:copySites(workers(m,result.gathering),result.placement)}},productionDelta:ready?Math.max(0,delta-(result.barracksReadyAfter??0)):0};
}
