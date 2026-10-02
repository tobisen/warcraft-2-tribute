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
  const baseDead=state.combat.baseHP<=0;
  const barDead=state.placement.barracks!==null&&state.placement.barracksHP!==undefined&&state.placement.barracksHP<=0;
  const forgeDead=!!state.placement.forge&&state.placement.forge.hp<=0;
  const deadFarms=(state.placement.farms??[]).filter(f=>f.hp!==undefined&&f.hp<=0);
  const deadSites=new Set<string>([...(forgeDead?['forge']:[]),...(barDead?['barracks']:[]),...deadFarms.map(f=>f.id)]);
  const removed:Footprint[]=[...(forgeDead?[state.placement.forge!.footprint]:[]),...(state.combat.destroyedEnemyFootprints??[]),...state.combat.enemies.filter(e=>e.hp<=0&&e.footprint).map(e=>e.footprint!),...(baseDead?[baseFootprint(gathering.base)]:[]),...(barDead?[state.placement.barracks!]:[]),...deadFarms.map(f=>f.footprint)];
  const obstacles=state.map.obstacles.filter(o=>!removed.some(f=>equalFoot(o,f)));
  const alive=new Set(gathering.units.map(u=>u.id));
  const paused=(job:ConstructionJob|undefined)=>job?.builderId&&!alive.has(job.builderId)?{...job,builderId:null}:job;
  let placement=state.placement;
  if(forgeDead||paused(placement.forge?.construction)!==placement.forge?.construction||barDead||deadFarms.length||paused(placement.construction)!==placement.construction||(placement.farms??[]).some(f=>paused(f.construction)!==f.construction)) {
    placement={...placement,...(forgeDead?{forge:undefined}:placement.forge?{forge:{...placement.forge,construction:paused(placement.forge.construction)!}}:{}),...(barDead?{barracks:null,barracksHP:undefined,barracksOwner:undefined,construction:undefined}:{construction:paused(placement.construction)}),
      ...(placement.farms?{farms:placement.farms.filter(f=>!deadFarms.includes(f)).map(f=>({...f,construction:paused(f.construction)!}))}:{})};
  }
  if(state.enemyProduction){const dead=state.combat.enemies.filter(e=>e.hp<=0&&e.work);if(dead.length){const lost={wood:state.enemyProduction.lostCargo?.wood??0,gold:state.enemyProduction.lostCargo?.gold??0};for(const e of dead)lost[e.work!.cargoType??'wood']+=e.work!.cargo;state={...state,enemyProduction:{...state.enemyProduction,lostCargo:lost}};}}
  const liveEnemies=state.combat.enemies.filter(e=>e.hp>0);
  const units=gathering.units.map((u):Unit=>u.kind==='soldier'&&u.order.kind==='attack'&&!liveEnemies.some(e=>u.order.kind==='attack'&&e.id===u.order.enemyId)?{...u,navigation:undefined,target:{...u.position},order:{kind:'idle'}}:
    u.order.kind==='build'&&deadSites.has(u.order.buildingId)
    ||baseDead&&(u.order.kind==='gather'||u.order.kind==='deliver')?{...u,navigation:undefined,target:{...u.position},order:{kind:'idle'}}:u);
  if(units.some((u,i)=>u!==gathering.units[i]))gathering={...gathering,units};
  if(placement.active&&!gathering.units.some(u=>u.kind==='worker'&&u.selected))placement={...placement,active:false};
  const targets=new Set(playerTargets(gathering,state.combat,placement).map(t=>t.id));
  const enemyBaseAlive=liveEnemies.some(e=>e.kind==='base');
  const enemyWorkers=new Set(liveEnemies.filter(e=>e.kind==='worker').map(e=>e.id));
  const readyEnemies=liveEnemies.map(e=>e.construction?.builderId&&!enemyWorkers.has(e.construction.builderId)?{...e,construction:{...e.construction,builderId:null}}:e).map(e=>e.work?.order.kind==='build'&&!liveEnemies.some(site=>site.id===`enemy-${e.work!.order.kind==='build'?e.work!.order.buildingId:''}`)?{...e,navigation:undefined,work:{...e.work,order:{kind:'idle' as const}}}:e);
  const enemies=readyEnemies.map(e=>e.work&&!enemyBaseAlive?{...e,navigation:undefined,work:{...e.work,order:{kind:'idle' as const}}}:e.order?.kind==='defend'&&!targets.has(e.order.targetId)?{...e,navigation:undefined,order:{kind:'idle' as const}}:e.navigation?.targetId&&e.navigation.targetId!=='explore-goal'&&!targets.has(e.navigation.targetId)?{...e,navigation:undefined}:e);
  const production=baseDead?clearProduction(state.production):state.production;
  const soldierProduction=baseDead||barDead?clearProduction(state.soldierProduction):state.soldierProduction;
  const enemyAlive=new Set(enemies.map(e=>e.id));
  const liveGroups=state.enemyAI?.groups.map(g=>({...g,members:g.members.filter(id=>enemyAlive.has(id)),destinations:Object.fromEntries(Object.entries(g.destinations).filter(([id])=>enemyAlive.has(id)))})).filter(g=>g.members.length);
  const enemyAI=state.enemyAI?{...state.enemyAI,reserve:state.enemyAI.reserve.filter(id=>enemyAlive.has(id)),defenders:state.enemyAI.defenders.filter(d=>enemyAlive.has(d.id)).map(d=>d.groupId&&!liveGroups!.some(g=>g.id===d.groupId)?{id:d.id}:d),threatId:gathering.units.some(u=>u.id===state.enemyAI!.threatId)?state.enemyAI.threatId:null,groups:liveGroups!}:undefined;
  return {...state,gathering,placement,production,soldierProduction,...(state.controlGroups?{controlGroups:pruneGroups(state.controlGroups,gathering.units)}:{}),...(enemyAI?{enemyAI}:{}),
    ...(state.enemyProduction&&!enemies.some(e=>e.kind==='base')?{enemyProduction:{...state.enemyProduction,production:{...state.enemyProduction.production,queue:[],remainingSeconds:null,blockedSpawnKey:undefined}}}:{}),
    ...(state.research?.job&&(baseDead||forgeDead||!placement.forge)?{research:{...state.research,job:null}}:{}),
    map:obstacles.length===state.map.obstacles.length?state.map:replaceObstacles(state.map,obstacles),combat:{...state.combat,enemies,...(state.combat.destroyedEnemyFootprints?{destroyedEnemyFootprints:undefined}:{})}};
}
