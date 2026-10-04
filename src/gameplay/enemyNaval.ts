import {enemyNavigationMap} from './map';
import {factionForTeam} from '../config/factions';
import {enemyNavalConfig as cfg} from '../config/enemyNaval';
import {navyConfig} from '../config/navy';
import {canAfford} from './economy';
import {enemyWorker} from './enemyGathering';
import {enemyPopulation} from './enemyConstruction';
import {updateSite} from './construction';
import {coastalFootprint,domainMap,planDomainRoute,advanceDomainRoute,marineFlightMap} from './terrainNavigation';
import {bodyFits,overlaps,replaceObstacles} from './map';
import {spawnCandidates,hasSpawnExit,unitBody} from './spawning';
import {approachRoute} from './approach';
import {planRoute,segmentFits} from './navigation';
import {placementVisible} from './visibility';
import type {MatchState} from './match';
import type {Enemy} from './combat';
import type {ProductionState} from './production';
import type {GatheringState} from './gathering';
import type {Position} from './movement';
export interface EnemyNavalState {production:ProductionState;passengers:Enemy[];phase:'waiting'|'loading'|'sailing'|'landed'|'finished'}
export const createEnemyNaval=():EnemyNavalState=>({production:{remainingSeconds:null,nextUnitNumber:1},passengers:[],phase:'waiting'});
function seen(m:MatchState,rect:Parameters<typeof placementVisible>[1]){return !m.fog||placementVisible({...m.fog,teams:{...m.fog.teams,player:m.fog.teams.enemy}},rect);}
function spend(m:MatchState,cost:{wood:number;gold:number}):MatchState {const bank=m.enemyProduction!;return {...m,enemyProduction:{...bank,wood:bank.wood-cost.wood,gold:bank.gold-cost.gold,spent:{wood:(bank.spent?.wood??0)+cost.wood,gold:(bank.spent?.gold??0)+cost.gold}}};}
export function prepareEnemyNaval(m:MatchState):MatchState {
 if(!m.enemyNaval||!m.enemyProduction||m.enemyNaval.phase==='finished'||!m.combat.enemies.some(e=>e.kind==='base'&&e.hp>0))return m;
 const site=m.combat.enemies.find(e=>e.buildingType==='harbor');
 const available=m.combat.enemies.filter(e=>e.work&&e.hp>0&&e.work.order.kind!=='build').sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}));
 if(site?.construction?.remainingSeconds===0)return m;
 if(site){const current=m.combat.enemies.find(e=>e.id===site.construction?.builderId&&e.work?.order.kind==='build'&&e.work.order.buildingId==='harbor');if(current)return m;const builder=available.find(e=>approachRoute(enemyNavigationMap(m.map),e.position,site.footprint!,24).status!=='blocked');return builder?{...m,combat:{...m.combat,enemies:m.combat.enemies.map(e=>e===site?{...e,construction:{...e.construction!,builderId:builder.id}}:e===builder?{...e,navigation:undefined,work:{...e.work!,order:{kind:'build',buildingId:'harbor'}}}:e)}}:m;}
 if(m.enemyNaval.production.nextUnitNumber>1||!seen(m,cfg.harbor)||!coastalFootprint(m.map,cfg.harbor)||!canAfford({wood:m.enemyProduction.wood,goldBalance:m.enemyProduction.gold},factionForTeam(m,'enemy').naval.harbor.cost))return m;
 const builder=available.find(e=>approachRoute(enemyNavigationMap(m.map),e.position,cfg.harbor,24).status!=='blocked');if(!builder||[...m.gathering.units,...m.combat.enemies.filter(e=>!e.footprint)].some(e=>overlaps(cfg.harbor,unitBody(e.position,24))))return m;
 m=spend(m,factionForTeam(m,'enemy').naval.harbor.cost);return {...m,map:replaceObstacles(m.map,[...m.map.obstacles,cfg.harbor]),combat:{...m.combat,enemies:[...m.combat.enemies.map(e=>e.id===builder.id?{...e,navigation:undefined,work:{...e.work!,order:{kind:'build' as const,buildingId:'harbor' as const}}}:e),{id:'enemy-harbor',owner:'enemy',kind:'building',buildingType:'harbor',hp:factionForTeam(m,'enemy').naval.harbor.hp,footprint:{...cfg.harbor},position:{x:cfg.harbor.x+32,y:cfg.harbor.y+32},construction:{remainingSeconds:factionForTeam(m,'enemy').naval.harbor.constructionSeconds,builderId:builder.id}}]}};
}
function freeWaterSpawn(m:MatchState,foot:NonNullable<Enemy['footprint']>){const map={...domainMap(m.map,'water'),bodyHalf:16};return spawnCandidates(map,foot,'barracks',32).find(p=>hasSpawnExit(map,p)&&![...m.gathering.units,...m.combat.enemies.filter(e=>!e.footprint),...(m.navy?.ships??[])].some(e=>overlaps(unitBody(p,32),unitBody(e.position,32))));}
function contact(m:MatchState,a:Position,b:Position){return Math.hypot(a.x-b.x,a.y-b.y)<=navyConfig.transport.contactRange+1e-9&&segmentFits(marineFlightMap(m.map),a,b,0);}
/** Naval bodies are excluded from the land movement scheduler; only this adapter moves them. */
export function updateEnemyNaval(m:MatchState,delta:number):MatchState {
 if(!m.enemyNaval||delta<=0||m.paused||m.outcome!=='playing')return m;
 let state=m.enemyNaval,site=m.combat.enemies.find(e=>e.buildingType==='harbor');
 if(!m.combat.enemies.some(e=>e.kind==='base'&&e.hp>0))return {...m,enemyNaval:{...state,production:{...state.production,queue:[],remainingSeconds:null}}};
 let productionDelta=delta;
 if(site?.construction&&site.construction.remainingSeconds>0){const g:GatheringState={...m.gathering,faction:factionForTeam(m,'enemy').id,units:m.combat.enemies.flatMap(e=>{const w=enemyWorker(e);return w?[w]:[];})};const result=updateSite(g,site.construction,site.footprint!,'harbor',enemyNavigationMap(m.map),delta);const workers=new Map(result.gathering.units.map(u=>[u.id,u]));m={...m,combat:{...m.combat,enemies:m.combat.enemies.map(e=>{const u=workers.get(e.id);return e===site?{...e,construction:result.job}:u&&u.kind==='worker'?{...e,position:u.position,navigation:u.navigation,work:{...e.work!,target:u.target,order:u.order}}:e;})}};site=m.combat.enemies.find(e=>e.buildingType==='harbor');productionDelta=result.completedAfterSeconds===undefined?0:Math.max(0,delta-result.completedAfterSeconds);}
 const p=state.production,recipe=factionForTeam(m,'enemy').naval.units.transport;
 if(site?.construction?.remainingSeconds===0&&p.nextUnitNumber===1&&!p.queue?.length&&m.enemyProduction&&canAfford({wood:m.enemyProduction.wood,goldBalance:m.enemyProduction.gold},recipe.cost)&&enemyPopulation(m).used+enemyPopulation(m).reserved+recipe.supply<=enemyPopulation(m).cap){m=spend(m,recipe.cost);state={...state,production:{...p,queue:[{id:'enemy-harbor-job-1',kind:'transport',supply:recipe.supply,cost:{...recipe.cost},durationSeconds:recipe.durationSeconds,remainingSeconds:recipe.durationSeconds}],remainingSeconds:recipe.durationSeconds,nextJobNumber:2}};}
 if(site?.construction?.remainingSeconds===0&&state.production.queue?.length){const job=state.production.queue[0],remainingSeconds=Math.max(0,job.remainingSeconds-productionDelta),position=remainingSeconds<=1e-9?freeWaterSpawn(m,site.footprint!):undefined;if(position){const ship:Enemy={id:'enemy-ship-1',kind:'ship',owner:'enemy',hp:factionForTeam(m,'enemy').naval.units.transport.hp,position,order:{kind:'muster',destination:{...cfg.waterStart}},navigation:planDomainRoute(m.map,'water',position,cfg.waterStart,16)};m={...m,combat:{...m.combat,enemies:[...m.combat.enemies,ship]}};state={...state,production:{...state.production,queue:[],remainingSeconds:null,nextUnitNumber:2}};}else state={...state,production:{...state.production,queue:[{...job,remainingSeconds}],remainingSeconds}};}
 let ship=m.combat.enemies.find(e=>e.kind==='ship'&&e.hp>0);if(!ship)return {...m,enemyNaval:state};
 if(state.phase==='waiting'&&m.waves.elapsedSeconds>=cfg.launchSeconds[m.difficulty??'normal']&&!m.enemyAI?.threatId){const army=m.combat.enemies.filter(e=>e.kind==='unit'&&e.id.startsWith('enemy-produced-')&&e.hp>0).slice(0,cfg.passengers);if(army.length===cfg.passengers){const committed=new Set(army.map(e=>e.id));m={...m,...(m.enemyAI?{enemyAI:{...m.enemyAI,reserve:m.enemyAI.reserve.filter(id=>!committed.has(id)),defenders:m.enemyAI.defenders.filter(d=>!committed.has(d.id)),groups:m.enemyAI.groups.map(g=>({...g,members:g.members.filter(id=>!committed.has(id)),destinations:Object.fromEntries(Object.entries(g.destinations).filter(([id])=>!committed.has(id)))})).filter(g=>g.members.length)}}:{}),combat:{...m.combat,enemies:m.combat.enemies.map(e=>army.includes(e)?{...e,navalLanding:true,navigation:planRoute(enemyNavigationMap(m.map),e.position,cfg.loading),order:{kind:'muster',destination:{...cfg.loading}}}:e)}};state={...state,phase:'loading'};}}
 if(ship.order?.kind==='muster'){const route=ship.navigation??planDomainRoute(m.map,'water',ship.position,ship.order.destination,16),step=advanceDomainRoute(m.map,'water',ship.position,route,16,factionForTeam(m,'enemy').naval.units.transport.speed,delta);ship={...ship,position:step.position,navigation:step.route};m={...m,combat:{...m.combat,enemies:m.combat.enemies.map(e=>e.id===ship!.id?ship!:e)}};}
 if(state.phase==='loading'){const army=m.combat.enemies.filter(e=>e.kind==='unit'&&e.navalLanding&&e.hp>0);if(army.length===cfg.passengers&&army.every(e=>contact(m,ship!.position,e.position))&&Math.hypot(ship.position.x-cfg.waterStart.x,ship.position.y-cfg.waterStart.y)<1e-9){state={...state,phase:'sailing',passengers:army.map(e=>({...e,navigation:undefined,order:{kind:'idle'}}))};const loaded=new Set(army.map(e=>e.id));m={...m,combat:{...m.combat,enemies:m.combat.enemies.filter(e=>!loaded.has(e.id)).map(e=>e.id===ship!.id?{...e,navigation:planDomainRoute(m.map,'water',e.position,cfg.waterGoal,16),order:{kind:'muster',destination:{...cfg.waterGoal}}}:e)}};}}
 if(state.phase==='sailing'&&Math.hypot(ship.position.x-cfg.waterGoal.x,ship.position.y-cfg.waterGoal.y)<1e-9){const points=[cfg.landing,...[0,-1,1].flatMap(dy=>[0,-1].map(dx=>({x:cfg.landing.x+dx*32,y:cfg.landing.y+dy*32})))],occupied=[...m.gathering.units,...m.combat.enemies.filter(e=>!e.footprint)].map(e=>unitBody(e.position,24)),landed:Enemy[]=[];for(const passenger of state.passengers){const point=points.find(p=>bodyFits(enemyNavigationMap(m.map),p,12)&&seen(m,unitBody(p,24))&&contact(m,ship!.position,p)&&!occupied.some(o=>overlaps(o,unitBody(p,24))));if(!point)break;occupied.push(unitBody(point,24));landed.push({...passenger,position:{...point},navigation:undefined,order:{kind:'attack-move',destination:{...(m.enemyKnowledge?.playerBase??cfg.landSearch)}}});}if(landed.length===state.passengers.length){state={...state,passengers:[],phase:'landed'};m={...m,combat:{...m.combat,enemies:[...m.combat.enemies,...landed]}};}}
 return {...m,enemyNaval:state};
}
