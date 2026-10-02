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
  const deadFarms=(state.placement.farms??[]).filter(f=>f.hp!==undefined&&f.hp<=0);
  const deadSites=new Set<string>([...(barDead?['barracks']:[]),...deadFarms.map(f=>f.id)]);
  const removed:Footprint[]=[...(baseDead?[baseFootprint(gathering.base)]:[]),...(barDead?[state.placement.barracks!]:[]),...deadFarms.map(f=>f.footprint)];
  const obstacles=state.map.obstacles.filter(o=>!removed.some(f=>equalFoot(o,f)));
  const alive=new Set(gathering.units.map(u=>u.id));
  const paused=(job:ConstructionJob|undefined)=>job?.builderId&&!alive.has(job.builderId)?{...job,builderId:null}:job;
  let placement=state.placement;
  if(barDead||deadFarms.length||paused(placement.construction)!==placement.construction||(placement.farms??[]).some(f=>paused(f.construction)!==f.construction)) {
    placement={...placement,...(barDead?{barracks:null,barracksHP:undefined,barracksOwner:undefined,construction:undefined}:{construction:paused(placement.construction)}),
      ...(placement.farms?{farms:placement.farms.filter(f=>!deadFarms.includes(f)).map(f=>({...f,construction:paused(f.construction)!}))}:{})};
  }
  const liveEnemies=state.combat.enemies.filter(e=>e.hp>0);
  const units=gathering.units.map((u):Unit=>u.kind==='soldier'&&u.order.kind==='attack'&&!liveEnemies.some(e=>u.order.kind==='attack'&&e.id===u.order.enemyId)?{...u,navigation:undefined,target:{...u.position},order:{kind:'idle'}}:
    u.order.kind==='build'&&deadSites.has(u.order.buildingId)
    ||baseDead&&(u.order.kind==='gather'||u.order.kind==='deliver')?{...u,navigation:undefined,target:{...u.position},order:{kind:'idle'}}:u);
  if(units.some((u,i)=>u!==gathering.units[i]))gathering={...gathering,units};
  if(placement.active&&!gathering.units.some(u=>u.kind==='worker'&&u.selected))placement={...placement,active:false};
  const targets=new Set(playerTargets(gathering,state.combat,placement).map(t=>t.id));
  const enemies=liveEnemies.map(e=>e.navigation?.targetId&&!targets.has(e.navigation.targetId)?{...e,navigation:undefined}:e);
  const production=baseDead?clearProduction(state.production):state.production;
  const soldierProduction=baseDead||barDead?clearProduction(state.soldierProduction):state.soldierProduction;
  return {...state,gathering,placement,production,soldierProduction,
    map:obstacles.length===state.map.obstacles.length?state.map:replaceObstacles(state.map,obstacles),combat:{...state.combat,enemies}};
}
