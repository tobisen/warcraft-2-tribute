import {factionIds,type FactionId} from './factions';
/** Recorded local assets only; scripts and provenance live in the shared voice manifest. */
export const voiceConfig={cooldownSeconds:1.2,gain:.9,humorClicks:4,humorChance:.65,humorCooldownSeconds:20,duckGain:.45};
export type VoiceRole='worker'|'soldier'|'archer'|'catapult'|'ballista'|'specialist'|'transport'|'warship';
export type VoiceAction='select'|'order'|'move'|'attack'|'work'|'repeat'|'gather'|'ready'|'error';

export const recordedVoiceRoles=['worker','soldier','archer'] as const;
export const recordedVoiceActions=['selection','move','attack','gather','ready','error','humor'] as const;
export type RecordedVoiceRole=typeof recordedVoiceRoles[number];
export type RecordedVoiceAction=typeof recordedVoiceActions[number];
export interface VoiceClip {
 id:string;faction:FactionId;role:RecordedVoiceRole;
 action:RecordedVoiceAction;text:string;recording:string;author:string;source:string;
 license:string;processing:string;listeningVerified:boolean;
}
/** Only declared local assets with provenance can enter the recorded voice lane. */
export function recordedVoiceManifest(value:unknown):VoiceClip[]{
 if(!value||typeof value!=='object'||!('version' in value)||value.version!==1||!('entries' in value)||!Array.isArray(value.entries))return [];
 const seen=new Set<string>();
 return value.entries.filter((entry:unknown):entry is VoiceClip=>{
  if(!entry||typeof entry!=='object')return false;
  const e=entry as Record<string,unknown>;
  if(typeof e.id!=='string'||seen.has(e.id)||!factionIds.includes(e.faction as FactionId)||!recordedVoiceRoles.includes(e.role as RecordedVoiceRole)||!recordedVoiceActions.includes(e.action as RecordedVoiceAction))return false;
  if(!new RegExp(`^${e.faction}-${e.role}-${e.action}-[0-9]{2}$`).test(e.id)||e.recording!==`audio/voices/${e.id}.wav`)return false;
  if(!['text','author','source','license','processing'].every(key=>typeof e[key]==='string'&&String(e[key]).trim().length>0)||typeof e.listeningVerified!=='boolean')return false;
  seen.add(e.id);return true;
 });
}
export function recordedVoiceAction(action:VoiceAction):RecordedVoiceAction {
 return action==='select'?'selection':action==='work'||action==='gather'?'gather':action==='repeat'?'humor':action==='order'?'move':action;
}
