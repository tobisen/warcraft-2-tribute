import {voiceConfig,recordedVoiceAction,type VoiceClip,type VoiceRole,type VoiceAction} from '../config/voices';
import {audioGain,type AudioSettings} from './audioPolicy';
import type {FactionId} from '../config/factions';

/** Playback uses GameAudio's existing graph; no browser TTS and no voice queue. */
export interface VoicePlayback {
 has(id:string):boolean;
 play(clip:VoiceClip,gain:number,ended:()=>void):boolean;
 stop():void;
}
const silent:VoicePlayback={has:()=>false,play:()=>false,stop:()=>{}};
export class UnitVoices {
 private phase='menu';private last=-Infinity;private active=false;private generation=0;
 private selection?:{key:string;time:number;count:number};
 private history=new Map<string,string>();private activeGain=0;
 private lastHumor=-Infinity;private clips:readonly VoiceClip[]=[];
 constructor(private settings:()=>AudioSettings,private now=()=>performance.now()/1000,
  private playback:VoicePlayback=silent,private random=()=>Math.random()){}
 setClips(clips:readonly VoiceClip[]){this.clips=clips;}
 get status(){return {available:this.clips.some(c=>this.playback.has(c.id)),speaking:this.active,
  recordings:this.clips.filter(c=>this.playback.has(c.id)).length};}
 setPhase(phase:string){this.phase=phase;if(phase!=='playing')this.cancel();}
 onSettingsChange(){const gain=audioGain(this.settings(),'voices');if(gain===0||this.active&&gain!==this.activeGain)this.cancel();}
 speak(role:VoiceRole,action:VoiceAction,faction:FactionId):boolean{
  const now=this.now(),gain=audioGain(this.settings(),'voices');
  if(this.phase!=='playing'||this.active||now-this.last<voiceConfig.cooldownSeconds||gain===0)return false;
  const cue=recordedVoiceAction(action),key=`${faction}:${role}:${cue}`;
  const clips=this.clips.filter(c=>c.faction===faction&&c.role===role&&c.action===cue&&this.playback.has(c.id));
  if(!clips.length)return false;
  if(cue==='humor'&&now-this.lastHumor<voiceConfig.humorCooldownSeconds)return false;
  const previous=this.history.get(key),index=clips.findIndex(c=>c.id===previous);
  // Rotation prevents immediate repetition whenever two or more assets exist.
  const clip=clips[(index+1)%clips.length],generation=this.generation;
  this.active=true;this.activeGain=gain;
  const ended=()=>{if(generation===this.generation)this.active=false;};
  try{
   if(!this.playback.play(clip,gain*voiceConfig.gain,ended)){this.active=false;return false;}
   this.last=now;this.history.set(key,clip.id);if(cue==='humor')this.lastHumor=now;
   return true;
  }catch{this.playback.stop();this.active=false;return false;}
 }
 select(role:VoiceRole,faction:FactionId,id:string):boolean{
  const time=this.now(),key=`${faction}:${role}:${id}`,old=this.selection;
  const count=old?.key===key&&time-old.time<8?old.count+1:1;
  this.selection={key,time,count};
  const humor=count%voiceConfig.humorClicks===0&&time-this.lastHumor>=voiceConfig.humorCooldownSeconds&&this.random()<voiceConfig.humorChance;
  if(humor&&this.speak(role,'repeat',faction))return true;
  return this.speak(role,'select',faction);
 }
 private cancel(){this.generation++;if(this.active)this.playback.stop();this.active=false;}
 reset(){this.cancel();this.last=-Infinity;this.lastHumor=-Infinity;this.history.clear();this.selection=undefined;}
}
