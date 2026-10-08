import {hasMainBase} from './extraBases';
import {campaignActionReason} from '../config/campaignContent';
import {allocateFormation} from './formations';
import type {OrderState} from './commandOrders';
import {isAir} from './domains';
import {factionForTeam} from '../config/factions';
import {text as uiText} from '../text';
import {nodeRadius,resourceNodes,type Unit} from './gathering';
import {placementVisible} from './visibility';
import {navyConfig} from '../config/navy';
import {queueConfig} from '../config/production';
import {canAfford,payCost} from './economy';
import {populationState,hasPopulation,type Population} from './population';
import {productionJobCount} from './productionQueue';
import type {ProductionState} from './production';
import type {SelectableUnit} from './selection';
import type {Footprint,ConstructionJob} from './placement';
import {workerResourceTargets,buildingFootprint,placementObstacles} from './placement';
import {replaceObstacles,overlaps} from './map';
import {unitBody,spawnCandidates,hasSpawnExit} from './spawning';
import {unitStats,combatUnitStats} from '../config/unit';
import {canReachFootprint,approachRoute} from './approach';
import {updateSite} from './construction';
import {domainMap,coastalFootprint,planDomainRoute,advanceDomainRoute} from './terrainNavigation';
import type {RouteState} from './navigation';
import type {Position} from './movement';
import type {MatchState} from './match';
export interface Ship extends SelectableUnit, OrderState {transfer?:import('./autoTransport').TransportTransfer;kind:'ship';role?:'warship'|'transport';passengers?:Unit[];owner:'player';hp:number;attackCooldown?:number;order:{kind:'idle'|'move'}|{kind:'attack';enemyId:string}|{kind:'hunt';animalId:string};navigation?:RouteState}
export interface Harbor {owner:'player';hp:number;footprint:Footprint;construction:ConstructionJob}
export interface NavyState {harbor:Harbor|null;ships:Ship[];production:ProductionState}
export const createNavy=():NavyState=>({harbor:null,ships:[],production:{remainingSeconds:null,nextUnitNumber:1}});
export const shipRecipe=(m:MatchState,role:'warship'|'transport'='warship')=>factionForTeam(m,'player').naval.units[role];
export function matchPopulation(m:MatchState):Population {
 const pop=populationState({...m.gathering,...(m.combat.baseHP<=0?{primaryDropoff:false}:{})},m.placement,[m.production,m.soldierProduction,...(m.placement.academy?.production?[m.placement.academy.production]:[]),...(m.placement.stable?[m.placement.stable.production]:[]),...(m.placement.bases??[]).map(b=>b.production),...(m.navy?[m.navy.production]:[])]);
 return {...pop,used:pop.used+(m.navy?.ships??[]).reduce((n,s)=>n+shipRecipe(m,s.role).supply,0)+populationState({...m.gathering,units:passengerUnits(m.navy)},m.placement,[]).used};
}
export function harborFootprint(point:Position):Footprint {return buildingFootprint(point,'harbor');}
export function harborSpawn(m:MatchState,footprint:Footprint,occupancy=true,role:'warship'|'transport'='warship'):Position|null {
 const map={...domainMap(m.map,'water'),bodyHalf:shipRecipe(m,role).size/2,obstacles:[...domainMap(m.map,'water').obstacles,footprint]};
 return spawnCandidates(map,footprint,'barracks',shipRecipe(m,role).size).find(p=>hasSpawnExit(map,p)&&(!occupancy||![...m.gathering.units.filter(u=>!isAir(u)).map(u=>unitBody(u.position,u.kind==='worker'?unitStats.size:combatUnitStats(u).size)),...(m.navy?.ships??[]).map(u=>unitBody(u.position,shipRecipe(m,role).size)),...m.combat.enemies.filter(e=>!e.footprint&&!isAir(e)).map(e=>unitBody(e.position,24))].some(b=>overlaps(unitBody(p,shipRecipe(m,role).size),b))))??null;
}
function checkHarborPlacement(m:MatchState,point:Position,preview=false):string|null {
 const locked=campaignActionReason(m,'build-harbor');if(locked)return locked;
 if(m.navy?.harbor)return uiText.harborExists;
 const rect=harborFootprint(point);if(m.fog&&!placementVisible(m.fog,rect))return uiText.theSiteMustBeVisible;if(!coastalFootprint(m.map,rect))return uiText.aHarborNeedsAFreeCoastWithLand;
 if(!canAfford(m.gathering,factionForTeam(m,'player').naval.harbor.cost))return uiText.notEnoughWoodOrGold;
 if(m.gathering.units.some(u=>!isAir(u)&&overlaps(rect,unitBody(u.position,u.kind==='worker'?unitStats.size:combatUnitStats(u).size)))||m.combat.enemies.some(e=>!e.footprint&&!isAir(e)&&overlaps(rect,unitBody(e.position,24)))||(m.navy?.ships??[]).some(s=>overlaps(rect,unitBody(s.position,factionForTeam(m,'player').naval.units.warship.size))))return uiText.overlapsAUnit;
 const builder=m.gathering.units.filter(u=>u.kind==='worker'&&u.selected).sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}))[0];
 if(!builder)return uiText.selectAWorkerToBuild;
 if(preview)return null;
 const after={...m,map:replaceObstacles(m.map,[...m.map.obstacles,rect])};
 if(approachRoute(after.map,builder.position,rect,factionForTeam(m,'player').naval.harbor.constructionRange).status==='blocked')return uiText.theBuildingSiteCannotBeReached;
 for(const worker of m.gathering.units.filter((u):u is Extract<Unit,{kind:'worker'}>=>u.kind==='worker'))for(const target of [placementObstacles(m.gathering)[0],...workerResourceTargets(m.gathering,worker).map(n=>({x:n.position.x-nodeRadius(n),y:n.position.y-nodeRadius(n),width:nodeRadius(n)*2,height:nodeRadius(n)*2}))]){
  if(canReachFootprint(m.map,worker.position,target,24)&&!canReachFootprint(after.map,worker.position,target,24))return uiText.blocksAWorkerRouteToTheBaseOr;
 }
 const base=placementObstacles(m.gathering)[0];
 const exit=(map:typeof m.map,foot:Footprint,kind:'base'|'barracks')=>spawnCandidates(map,foot,kind).some(p=>hasSpawnExit(map,p));
 if(exit(m.map,base,'base')&&!exit(after.map,base,'base')||m.placement.barracks&&exit(m.map,m.placement.barracks,'barracks')&&!exit(after.map,m.placement.barracks,'barracks'))return uiText.blocksAProductionExit;
 if(!harborSpawn(after,rect,false))return uiText.noFreeWaterExit;
 return null;
}
export const harborPlacementError=(m:MatchState,p:Position)=>checkHarborPlacement(m,p);
export const harborPreviewError=(m:MatchState,p:Position)=>checkHarborPlacement(m,p,true);
export function placeHarbor(m:MatchState,point:Position):MatchState {
 if(m.outcome!=='playing'||m.paused||!!m.multiplePlayers&&!hasMainBase(m)||!m.placement.active||m.placement.kind!=='harbor'||harborPlacementError(m,point))return m;
 const builder=m.gathering.units.filter(u=>u.kind==='worker'&&u.selected).sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}))[0],footprint=harborFootprint(point);
 return {...m,map:replaceObstacles(m.map,[...m.map.obstacles,footprint]),placement:{...m.placement,active:false,kind:undefined},navy:{...(m.navy??createNavy()),harbor:{owner:'player',hp:factionForTeam(m,'player').naval.harbor.hp,footprint,construction:{remainingSeconds:factionForTeam(m,'player').naval.harbor.constructionSeconds,builderId:builder.id}}},gathering:{...payCost(m.gathering,factionForTeam(m,'player').naval.harbor.cost),units:m.gathering.units.map(u=>u.id===builder.id&&u.kind==='worker'?{...u,commandMode:undefined,orderQueue:undefined,navigation:undefined,order:{kind:'build' as const,buildingId:'harbor' as const}}:u)}};
}
export function canTrainShip(m:MatchState,role:'warship'|'transport'='warship'){return !campaignActionReason(m,role==='transport'?'train-transport':'train-ship')&&m.outcome==='playing'&&!m.paused&&(!m.multiplePlayers||hasMainBase(m))&&!!m.navy?.harbor&&m.navy.harbor.construction.remainingSeconds===0&&productionJobCount(m.navy.production)<queueConfig.maxJobs&&hasPopulation(matchPopulation(m),shipRecipe(m,role).supply)&&canAfford(m.gathering,role==='transport'?factionForTeam(m,'player').naval.units.transport.cost:factionForTeam(m,'player').naval.units.warship.cost);}
export function trainShip(m:MatchState,role:'warship'|'transport'='warship'):MatchState {
 if(!canTrainShip(m,role))return m;const recipe=role==='transport'?factionForTeam(m,'player').naval.units.transport:factionForTeam(m,'player').naval.units.warship;const navy=m.navy!,p=navy.production,number=p.nextJobNumber??1,job={id:`harbor-job-${number}`,kind:role,supply:recipe.supply,cost:{...recipe.cost},durationSeconds:recipe.durationSeconds,remainingSeconds:recipe.durationSeconds};
 return {...m,gathering:payCost(m.gathering,job.cost),navy:{...navy,production:{...p,queue:[...(p.queue??[]),job],nextJobNumber:number+1,remainingSeconds:p.remainingSeconds??job.durationSeconds}}};
}
export function commandShips(m:MatchState,target:Position):NavyState|undefined {
 if(!m.navy)return undefined;
 const water=domainMap(m.map,'water'),routes=allocateFormation(m.navy.ships.filter(s=>s.selected).map(s=>({id:s.id,position:s.position,half:shipRecipe(m,s.role).size/2,domain:'water',map:water,commandNumber:(s.navigation?.commandNumber??0)+1})),target);
 return {...m.navy,ships:m.navy.ships.map(s=>{const navigation=routes.get(s.id);return navigation?{...s,transfer:undefined,commandMode:undefined,orderQueue:undefined,target:{...navigation.destination},navigation,order:{kind:navigation.status==='moving'?'move' as const:'idle' as const}}:s;})};
}
export function updateNavy(m:MatchState,delta:number):MatchState {
 if(!m.navy||m.outcome!=='playing'||m.paused||!!m.multiplePlayers&&!hasMainBase(m)||!hasMainBase(m))return m;
 let navy=m.navy,gathering=m.gathering;
 if(navy.harbor){const built=updateSite(gathering,navy.harbor.construction,navy.harbor.footprint,'harbor',m.map,delta);gathering=built.gathering;navy={...navy,harbor:{...navy.harbor,construction:built.job}};}
 navy={...navy,ships:navy.ships.map(s=>{if(s.order.kind!=='move')return s;const route=s.navigation??planDomainRoute(m.map,'water',s.position,s.target,shipRecipe(m,s.role).size/2);const step=advanceDomainRoute(m.map,'water',s.position,route,shipRecipe(m,s.role).size/2,shipRecipe(m,s.role).speed,delta);return {...s,position:step.position,navigation:step.route,order:{kind:step.route.status==='moving'?'move' as const:'idle' as const}};})};
 let remaining=Math.max(0,delta),p=navy.production;
 const harbor=navy.harbor;
 if(harbor?.construction.remainingSeconds===0)while(p.queue?.length){
  const head=p.queue[0],time=Math.max(0,head.remainingSeconds-remaining);
  if(time>1e-10){p={...p,remainingSeconds:time,queue:p.queue.map((j,i)=>i?j:{...j,remainingSeconds:time})};break;}
  const position=harborSpawn({...m,gathering,navy},harbor.footprint,true,head.kind==='transport'?'transport':'warship');
  if(!position){p={...p,remainingSeconds:0,queue:p.queue.map((j,i)=>i?j:{...j,remainingSeconds:0})};break;}
  const id=`ship-${p.nextUnitNumber}`;navy={...navy,ships:[...navy.ships,{id,kind:'ship',...(head.kind==='transport'?{role:'transport' as const,passengers:[]}:{}),owner:'player',hp:shipRecipe(m,head.kind==='transport'?'transport':'warship').hp,selected:false,position,target:{...position},order:{kind:'idle'}}]};remaining=Math.max(0,remaining-head.remainingSeconds);const queue=p.queue.slice(1);p={...p,queue,remainingSeconds:queue[0]?.remainingSeconds??null,nextUnitNumber:p.nextUnitNumber+1};if(remaining<=0)break;
 }
 return {...m,gathering,navy:{...navy,production:p}};
}

export function resumeHarbor(m:MatchState):MatchState {
 const harbor=m.navy?.harbor;if(!harbor||harbor.construction.remainingSeconds<=0||m.outcome!=='playing'||m.paused||!!m.multiplePlayers&&!hasMainBase(m))return m;
 const builder=m.gathering.units.filter(u=>u.kind==='worker'&&u.selected).sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}))[0];
 if(!builder||approachRoute(m.map,builder.position,harbor.footprint,factionForTeam(m,'player').naval.harbor.constructionRange).status==='blocked')return m;
 return {...m,navy:{...m.navy!,harbor:{...harbor,construction:{...harbor.construction,builderId:builder.id}}},gathering:{...m.gathering,units:m.gathering.units.map(u=>u.kind==='worker'&&u.id===builder.id?{...u,commandMode:undefined,orderQueue:undefined,navigation:undefined,order:{kind:'build' as const,buildingId:'harbor' as const}}:u.order.kind==='build'&&u.order.buildingId==='harbor'?{...u,commandMode:undefined,orderQueue:undefined,navigation:undefined,order:{kind:'idle' as const}}:u)}};
}
export function stopShips(navy:NavyState|undefined){return navy?{...navy,ships:navy.ships.map(s=>s.selected?{...s,transfer:undefined,commandMode:undefined,orderQueue:undefined,navigation:undefined,target:{...s.position},order:{kind:'idle' as const}}:s)}:undefined;}

export function attackShips(m:MatchState,enemyId:string):NavyState|undefined {return m.navy?{...m.navy,ships:m.navy.ships.map(s=>s.selected&&s.role!=='transport'?{...s,transfer:undefined,commandMode:undefined,orderQueue:undefined,navigation:undefined,order:{kind:'attack' as const,enemyId}}:s)}:undefined;}

export function passengerUnits(navy:NavyState|undefined):Unit[]{return navy?.ships.flatMap(s=>s.passengers??[])??[];}
