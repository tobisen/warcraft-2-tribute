import type {Position} from '../gameplay/movement';
import type {VoiceRole,VoiceAction} from '../config/voices';
export interface VoiceUnit {id:string;kind:string;selected:boolean;owner?:string;faction?:import('../config/factions').FactionId;archetype?:string;role?:string;order:{kind:string};target:Position;attackMoveTarget?:Position;navigation?:{status:string}}
export function voiceRole(u:VoiceUnit):VoiceRole{return u.kind==='ship'?(u.role==='transport'?'transport':'warship'):u.kind==='worker'?'worker':u.archetype==='archer'?'archer':u.archetype==='catapult'?'catapult':u.archetype==='specialist'?'specialist':'soldier';}
export function voiceSpeaker(units:readonly VoiceUnit[]):VoiceUnit|undefined{return units.filter(u=>u.selected&&(u.owner===undefined||u.owner==='player')).sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}))[0];}
const orderKey=(u:VoiceUnit)=>JSON.stringify([u.order,u.target,u.attackMoveTarget]);
export function voiceOrders(units:readonly VoiceUnit[]):Map<string,string>{return new Map(units.map(u=>[u.id,orderKey(u)]));}
export function orderedSpeaker(before:ReadonlyMap<string,string>,units:readonly VoiceUnit[]):VoiceUnit|undefined{
 return voiceSpeaker(units.filter(u=>before.has(u.id)&&before.get(u.id)!==orderKey(u)&&u.navigation?.status!=='blocked'));
}
export function failedOrderSpeaker(before:ReadonlyMap<string,string>,units:readonly VoiceUnit[]):VoiceUnit|undefined{
 return voiceSpeaker(units.filter(u=>before.has(u.id)&&before.get(u.id)!==orderKey(u)&&u.navigation?.status==='blocked'));
}
export interface ReadyVoiceUnit {id:string;role:VoiceRole;faction:import('../config/factions').FactionId}
/** Initial/loading snapshots and paused frames must not replay arrival lines. */
export function readyVoiceSpeaker(previous:readonly ReadyVoiceUnit[]|undefined,next:readonly ReadyVoiceUnit[],playing:boolean):ReadyVoiceUnit|undefined {
 if(!previous||!playing)return undefined;
 const old=new Set(previous.map(u=>u.id));
 return next.filter(u=>!old.has(u.id)).sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}))[0];
}

export function voiceOrderAction(unit:VoiceUnit|undefined):VoiceAction{
 return !unit?'order':unit.order.kind==='gather'?'gather':['deliver','build'].includes(unit.order.kind)?'work':unit.order.kind==='attack'||unit.order.kind==='hunt'||unit.attackMoveTarget?'attack':unit.order.kind==='move'?'move':'order';
}
