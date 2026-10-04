import {operationFor} from '../config/operations';
import {factions} from '../config/factions';
import {passengerUnits} from './navy';
import type {MatchState} from './match';
export interface CaptureState {holdSeconds:number}
/** Stable IDs are authored config, not a second mutable objective entity registry. */
export function initializeOperation(m:MatchState):MatchState{
 const operation=operationFor(m.scenario);if(!operation)return m;
 const guard=factions[m.factions!.enemy].units.soldier;
 m.combat.enemies=operation.guards.map(g=>({id:g.id,kind:'unit',owner:'enemy',role:'soldier',hp:guard.hp,position:{...g.position},order:{kind:'attack-move',destination:{...g.position}}}));
 m.waves.nextEnemyNumber=operation.guards.length+1;
 if(operation.kind==='escort'){
  const courier=operation.courier;
  m.gathering.units.push({id:courier.id,kind:'worker',owner:'player',hp:factions[m.factions!.player].units.worker.hp,position:{...courier.position},target:{...courier.position},selected:false,cargo:0,order:{kind:'idle'}});
  m.production.nextUnitNumber=m.soldierProduction.nextUnitNumber=5;
 }
 if(operation.kind==='capture')m.capture={holdSeconds:0};
 return m;
}
export function controlsCapture(m:MatchState):boolean{
 const o=operationFor(m.scenario);if(o?.kind!=='capture')return false;
 const inside=(p:{x:number;y:number})=>Math.hypot(p.x-o.zone.x,p.y-o.zone.y)<=o.radius;
 return m.gathering.units.some(u=>u.kind==='soldier'&&(u.hp??0)>0&&inside(u.position))&&!m.combat.enemies.some(e=>e.hp>0&&e.kind==='unit'&&!e.footprint&&inside(e.position));
}
export function advanceCapture(before:MatchState,after:MatchState,delta:number):MatchState{
 const o=operationFor(after.scenario);if(o?.kind!=='capture')return after;
 // Entering a zone during a simulation step starts the clock at its end, never early.
 const accumulated=controlsCapture(before)&&controlsCapture(after)?Math.min(o.holdSeconds,(before.capture?.holdSeconds??0)+Math.max(0,delta)):0;
 const holdSeconds=accumulated+1e-9>=o.holdSeconds?o.holdSeconds:accumulated;
 return {...after,capture:{holdSeconds}};
}
export function operationOutcome(m:MatchState):'playing'|'victory'|'defeat'{
 const o=operationFor(m.scenario);if(!o)return 'playing';
 const inZone=(p:{x:number;y:number})=>Math.hypot(p.x-o.zone.x,p.y-o.zone.y)<=o.radius;
 const guardsCleared=o.guards.every(g=>!m.combat.enemies.some(e=>e.id===g.id&&e.hp>0));
 if(o.kind==='escort'){
  const courier=[...m.gathering.units,...passengerUnits(m.navy)].find(u=>u.id===o.courier.id&&(u.hp??0)>0);
  if(!courier)return 'defeat';
  return guardsCleared&&m.gathering.units.some(u=>u.id===o.courier.id&&(u.hp??0)>0&&inZone(u.position))?'victory':'playing';
 }
 if(o.kind==='rescue')return guardsCleared&&m.gathering.units.some(u=>u.kind==='soldier'&&(u.hp??0)>0&&inZone(u.position))?'victory':'playing';
 return controlsCapture(m)&&(m.capture?.holdSeconds??0)+1e-9>=o.holdSeconds?'victory':'playing';
}
