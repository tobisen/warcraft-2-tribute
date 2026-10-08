import {hasEnemyBase} from './enemyBases';
import {hasMainBase} from './extraBases';
import {withGateRules} from './gates';
import {recordBuildingDeaths} from './statLedger';
import { pruneGroups } from './controlGroups';
import { replaceObstacles } from './map';
import { baseFootprint } from './buildingSelection';
import { playerTargets } from './targets';
import type { GatheringState, Unit } from './gathering';
import type { MatchState } from './match';
import type { ProductionState } from './production';
import type { ConstructionJob, Footprint } from './placement';
export function removeDeadUnits(g:GatheringState):GatheringState {
  const dead=g.units.filter(u=>u.hp!==undefined&&u.hp<=0);
  if(!dead.length)return g;
  const lost={...(g.lostCargo??{wood:0,gold:0})};
  for(const unit of dead)if(unit.kind==='worker')lost[unit.cargoType??'wood']+=unit.cargo;
  return {...g,units:g.units.filter(u=>!dead.includes(u)),lostCargo:lost};
}
const clearProduction=(p:ProductionState):ProductionState=>({...p,queue:[],remainingSeconds:null,blockedSpawnKey:undefined,rally:undefined,rallyError:undefined});
const equalFoot=(a:Footprint,b:Footprint)=>a.x===b.x&&a.y===b.y&&a.width===b.width&&a.height===b.height;
/** One transaction removes bodies, references and reservations before any producer can tick. */
export function cleanDestroyed(state:MatchState):MatchState {
  let gathering=removeDeadUnits(state.gathering);
  const drowned=state.navy?.ships.filter(s=>s.hp<=0).flatMap(s=>s.passengers??[])??[];
  if(drowned.length){const lost={...(gathering.lostCargo??{wood:0,gold:0})};for(const u of drowned)if(u.kind==='worker')lost[u.cargoType??'wood']+=u.cargo;gathering={...gathering,lostCargo:lost};}
  const navalHarborDead=state.combat.enemies.some(e=>e.buildingType==='harbor'&&e.hp<=0);const navalShipAlive=state.combat.enemies.some(e=>e.kind==='ship'&&e.hp>0);
  if(state.enemyNaval?.phase==='loading'&&!navalShipAlive)state={...state,combat:{...state.combat,enemies:state.combat.enemies.map(e=>e.navalLanding?{...e,navalLanding:undefined,navigation:undefined,order:{kind:'idle'}}:e)}};
  if(state.enemyNaval&&(state.enemyNaval.production.nextUnitNumber>1&&!navalShipAlive||navalHarborDead||!hasEnemyBase(state.combat,state.map))){state={...state,enemyNaval:{...state.enemyNaval,production:clearProduction(state.enemyNaval.production),...(navalShipAlive?{}:{passengers:[],phase:'finished'})}};}
  const baseDead=state.combat.baseHP<=0,allBasesDead=!hasMainBase(state);
  const deadBases=(state.placement.bases??[]).filter(b=>b.hp<=0);
  const barDead=state.placement.barracks!==null&&state.placement.barracksHP!==undefined&&state.placement.barracksHP<=0;
  const harborDead=!!state.navy?.harbor&&state.navy.harbor.hp<=0;
  const stableDead=!!state.placement.stable&&state.placement.stable.hp<=0;
  const academyDead=!!state.placement.academy&&state.placement.academy.hp<=0;
  const forgeDead=!!state.placement.forge&&state.placement.forge.hp<=0;
  const deadDefenses=(state.placement.defenses??[]).filter(t=>t.hp<=0);
  const deadFarms=(state.placement.farms??[]).filter(f=>f.hp!==undefined&&f.hp<=0);
  const deadSites=new Set<string>([...(stableDead?['stable']:[]),...(academyDead?['academy']:[]),...(harborDead?['harbor']:[]),...(forgeDead?['forge']:[]),...(barDead?['barracks']:[]),...deadBases.map(b=>b.id),...deadFarms.map(f=>f.id),...deadDefenses.map(t=>t.id)]);
  state={...state,statLedger:recordBuildingDeaths(state,deadSites.size,(state.combat.destroyedEnemyFootprints?.length??0)+state.combat.enemies.filter(e=>e.hp<=0&&e.footprint).length)};
  const removed:Footprint[]=[...(stableDead?[state.placement.stable!.footprint]:[]),...(academyDead?[state.placement.academy!.footprint]:[]),...deadBases.map(b=>b.footprint),...deadDefenses.map(t=>t.footprint),...(harborDead?[state.navy!.harbor!.footprint]:[]),...(forgeDead?[state.placement.forge!.footprint]:[]),...(state.combat.destroyedEnemyFootprints??[]),...state.combat.enemies.filter(e=>e.hp<=0&&e.footprint).map(e=>e.footprint!),...(baseDead?[baseFootprint(gathering.base)]:[]),...(barDead?[state.placement.barracks!]:[]),...deadFarms.map(f=>f.footprint)];
  const obstacles=state.map.obstacles.filter(o=>!removed.some(f=>equalFoot(o,f)));
  const alive=new Set(gathering.units.map(u=>u.id));
  const paused=(job:ConstructionJob|undefined)=>job?.builderId&&!alive.has(job.builderId)?{...job,builderId:null}:job;
  let placement=state.placement.defenses?{...state.placement,defenses:state.placement.defenses.filter(t=>t.hp>0).map(t=>({...t,construction:paused(t.construction)!}))}:state.placement;
  if(forgeDead||paused(placement.forge?.construction)!==placement.forge?.construction||barDead||deadFarms.length||paused(placement.construction)!==placement.construction||(placement.farms??[]).some(f=>paused(f.construction)!==f.construction)) {
    placement={...placement,...(forgeDead?{forge:undefined}:placement.forge?{forge:{...placement.forge,construction:paused(placement.forge.construction)!}}:{}),...(barDead?{barracks:null,barracksHP:undefined,barracksOwner:undefined,construction:undefined}:{construction:paused(placement.construction)}),
      ...(placement.farms?{farms:placement.farms.filter(f=>!deadFarms.includes(f)).map(f=>({...f,construction:paused(f.construction)!}))}:{})};
  }
  if(placement.stable)placement={...placement,stable:stableDead?undefined:{...placement.stable,construction:paused(placement.stable.construction)!,production:allBasesDead?clearProduction(placement.stable.production):placement.stable.production}};
  if(placement.academy)placement={...placement,academy:academyDead?undefined:{...placement.academy,construction:paused(placement.academy.construction)!}};
  if(placement.bases)placement={...placement,bases:placement.bases.filter(b=>b.hp>0).map(b=>({...b,construction:paused(b.construction)!}))};
  if(state.enemyProduction){const dead=state.combat.enemies.filter(e=>e.hp<=0&&e.work);if(dead.length){const lost={wood:state.enemyProduction.lostCargo?.wood??0,gold:state.enemyProduction.lostCargo?.gold??0};for(const e of dead)lost[e.work!.cargoType??'wood']+=e.work!.cargo;state={...state,enemyProduction:{...state.enemyProduction,lostCargo:lost}};}}
  const liveEnemies=state.combat.enemies.filter(e=>e.hp>0);
  const units=gathering.units.map((u):Unit=>u.kind==='soldier'&&u.order.kind==='attack'&&!liveEnemies.some(e=>u.order.kind==='attack'&&e.id===u.order.enemyId)?{...u,navigation:undefined,target:{...u.position},order:{kind:'idle'}}:
    (u.order.kind==='build'||u.order.kind==='repair')&&(deadSites.has(u.order.buildingId)||u.order.buildingId==='base'&&baseDead)
    ||allBasesDead&&(u.order.kind==='gather'||u.order.kind==='deliver')?{...u,navigation:undefined,target:{...u.position},order:{kind:'idle'}}:u);
  if(units.some((u,i)=>u!==gathering.units[i]))gathering={...gathering,units};
  if(placement.active&&!gathering.units.some(u=>u.kind==='worker'&&u.selected))placement={...placement,active:false};
  const targets=new Set(playerTargets(gathering,state.combat,placement,state.navy).map(t=>t.id));
  const enemyBaseAlive=hasEnemyBase({...state.combat,enemies:liveEnemies},state.map);
  const enemyWorkers=new Set(liveEnemies.filter(e=>e.kind==='worker').map(e=>e.id));
  const readyEnemies=liveEnemies.map(e=>e.construction?.builderId&&!enemyWorkers.has(e.construction.builderId)?{...e,construction:{...e.construction,builderId:null}}:e).map(e=>e.work?.order.kind==='build'&&!liveEnemies.some(site=>site.id===`enemy-${e.work!.order.kind==='build'?e.work!.order.buildingId:''}`)?{...e,navigation:undefined,work:{...e.work,order:{kind:'idle' as const}}}:e);
  const enemies=readyEnemies.map(e=>e.work&&!enemyBaseAlive?{...e,navigation:undefined,work:{...e.work,order:{kind:'idle' as const}}}:e.order?.kind==='defend'&&!targets.has(e.order.targetId)?{...e,navigation:undefined,order:{kind:'idle' as const}}:e.navigation?.targetId&&e.navigation.targetId!=='explore-goal'&&!targets.has(e.navigation.targetId)?{...e,navigation:undefined}:e);
  const production=baseDead?clearProduction(state.production):state.production;
  const soldierProduction=allBasesDead||barDead?clearProduction(state.soldierProduction):state.soldierProduction;
  const enemyAlive=new Set(enemies.map(e=>e.id));
  const liveGroups=state.enemyAI?.groups.map(g=>({...g,members:g.members.filter(id=>enemyAlive.has(id)),destinations:Object.fromEntries(Object.entries(g.destinations).filter(([id])=>enemyAlive.has(id)))})).filter(g=>g.members.length);
  const enemyAI=state.enemyAI?{...state.enemyAI,reserve:state.enemyAI.reserve.filter(id=>enemyAlive.has(id)),defenders:state.enemyAI.defenders.filter(d=>enemyAlive.has(d.id)).map(d=>d.groupId&&!liveGroups!.some(g=>g.id===d.groupId)?{id:d.id}:d),threatId:gathering.units.some(u=>u.id===state.enemyAI!.threatId)?state.enemyAI.threatId:null,groups:liveGroups!}:undefined;
  return withGateRules({...state,...(state.navy?{navy:{...state.navy,ships:state.navy.ships.filter(s=>s.hp>0).map(s=>s.transfer?.kind==='load'&&s.transfer.unitIds.some(id=>!gathering.units.some(u=>u.id===id))?{...s,transfer:undefined}:s).map(ship=>ship.order.kind==='attack'&&!liveEnemies.some(e=>ship.order.kind==='attack'&&e.id===ship.order.enemyId)?{...ship,navigation:undefined,order:{kind:'idle' as const}}:ship),harbor:harborDead?null:state.navy.harbor?{...state.navy.harbor,construction:paused(state.navy.harbor.construction)!}:null,production:allBasesDead||harborDead?clearProduction(state.navy.production):state.navy.production}}:{}),...(state.enemyRecovery&&!enemyBaseAlive?{enemyRecovery:{...state.enemyRecovery,production:{...state.enemyRecovery.production,queue:[],remainingSeconds:null,blockedSpawnKey:undefined}}}:{}),...(state.enemyPolicy?.research.job&&(!enemyBaseAlive||state.enemyPolicy.research.job.kind!=='workerTools'&&(!enemies.some(e=>e.buildingType==='forge')||(state.enemyPolicy.research[state.enemyPolicy.research.job.kind]??0)>=1&&!enemies.some(e=>e.buildingType==='academy')))?{enemyPolicy:{research:{...state.enemyPolicy.research,job:null}}}:{}),gathering,placement,production,soldierProduction,...(state.controlGroups?{controlGroups:pruneGroups(state.controlGroups,[...gathering.units,...(state.navy?.ships.filter(s=>s.hp>0)??[])])}:{}),...(enemyAI?{enemyAI}:{}),
    ...(state.enemyProduction&&!hasEnemyBase({...state.combat,enemies},state.map)?{enemyProduction:{...state.enemyProduction,production:{...state.enemyProduction.production,queue:[],remainingSeconds:null,blockedSpawnKey:undefined}}}:{}),
    ...(state.research?.job&&(allBasesDead||state.research.job.kind!=='workerTools'&&(forgeDead||!placement.forge||(state.research[state.research.job.kind]??0)>=1&&!placement.academy))?{research:{...state.research,job:null}}:{}),
    map:obstacles.length===state.map.obstacles.length?state.map:replaceObstacles(state.map,obstacles),combat:{...state.combat,enemies,...(state.combat.destroyedEnemyFootprints?{destroyedEnemyFootprints:undefined}:{})}});
}
