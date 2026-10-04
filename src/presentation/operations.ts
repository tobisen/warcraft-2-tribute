import {operationFor} from '../config/operations';
import {isVisible,isExplored} from '../gameplay/fog';
import {controlsCapture} from '../gameplay/operations';
import {passengerUnits} from '../gameplay/navy';
import type {MatchState} from '../gameplay/match';
export function operationMessage(m:MatchState):string{
 const o=operationFor(m.scenario);if(!o)return '';
 const remaining=o.guards.filter(g=>m.combat.enemies.some(e=>e.id===g.id&&e.hp>0)).length;
 if(o.kind==='escort')return `Ridge Courier: ${[...m.gathering.units,...passengerUnits(m.navy)].some(u=>u.id===o.courier.id&&(u.hp??0)>0)?'alive':'lost'} · Guards remaining: ${remaining}/2 · Safe zone (${o.zone.x},${o.zone.y}), radius ${o.radius}px.`;
 if(o.kind==='rescue')return `Camp guards remaining: ${remaining}/2 · Bring a living combat unit to (${o.zone.x},${o.zone.y}), radius ${o.radius}px.`;
 return `Banner hold: ${(m.capture?.holdSeconds??0).toFixed(1)}/${o.holdSeconds}s · ${controlsCapture(m)?'Uncontested':'Bring land combatants; enemies or absence reset time'} · Zone (${o.zone.x},${o.zone.y}).`;
}
export function operationMarkers(m:MatchState){
 const o=operationFor(m.scenario);if(!o)return [];
 const markers:{position:{x:number;y:number};radius:number;color:number;label:string}[]=[];
 if(!m.fog||isExplored(m.fog,'player',o.zone))markers.push({position:{...o.zone},radius:o.radius,color:0xd5b66b,label:o.kind==='escort'?'Safe Zone':o.kind==='rescue'?'Rescue Camp':'Coastal Banner'});
 if(o.kind==='escort'){const courier=m.gathering.units.find(u=>u.id===o.courier.id&&(u.hp??0)>0);if(courier)markers.push({position:{...courier.position},radius:18,color:0xd5b66b,label:o.courier.name});}
 for(const guard of o.guards){const enemy=m.combat.enemies.find(e=>e.id===guard.id);if(enemy&&enemy.hp>0&&(!m.fog||isVisible(m.fog,'player',enemy.position)))markers.push({position:{...enemy.position},radius:18,color:0xf47c70,label:guard.name});}
 return markers;
}
export function renderOperation(m:MatchState):void{const el=document.getElementById('operation-objective')!,message=operationMessage(m);if(el.textContent!==message)el.textContent=message;el.hidden=!message;}
