import {voiceConfig,dialogue,type VoiceRole,type VoiceAction} from '../config/voices';
import {audioGain,type AudioSettings} from './audioPolicy';
import type {FactionId} from '../config/factions';
/** One app-owned, local-only speech lane. No queue, external assets or gameplay state. */
export class UnitVoices {
 private phase='menu';private last=-Infinity;private active=false;private generation=0;
 private selection?:{id:string;time:number;count:number};
 private history=new Map<string,number>();private activeGain=0;
 constructor(private settings:()=>AudioSettings,private now=()=>performance.now()/1000){}
 private localVoice(){return typeof speechSynthesis==='undefined'?undefined:speechSynthesis.getVoices().filter(v=>v.localService&&/^en(?:[-_]|$)/i.test(v.lang)).sort((a,b)=>a.name.localeCompare(b.name))[0];}
 get status(){return {available:!!this.localVoice(),speaking:this.active};}
 setPhase(phase:string){this.phase=phase;if(phase!=='playing')this.cancel();}
 onSettingsChange(){const gain=audioGain(this.settings(),'voices');if(gain===0||this.active&&gain!==this.activeGain)this.cancel();}
 speak(role:VoiceRole,action:VoiceAction,faction:FactionId):boolean{
  const voice=this.localVoice(),now=this.now();
  if(this.phase!=='playing'||!voice||typeof SpeechSynthesisUtterance==='undefined'||this.active||speechSynthesis.speaking||speechSynthesis.pending||now-this.last<voiceConfig.cooldownSeconds||audioGain(this.settings(),'voices')===0)return false;
  const key=`${faction}:${role}:${action}`,lines=dialogue(role,action,faction),index=((this.history.get(key)??-1)+1)%lines.length;
  const utterance=new SpeechSynthesisUtterance(lines[index]);utterance.voice=voice;utterance.lang=voice.lang;
  utterance.rate=voiceConfig.rate;utterance.pitch=(faction==='clans'?.8:1)*(role==='catapult'?.8:role==='archer'?1.15:1);this.activeGain=audioGain(this.settings(),'voices');utterance.volume=this.activeGain*voiceConfig.gain;
  const generation=this.generation;utterance.onend=utterance.onerror=()=>{if(generation===this.generation)this.active=false;};
  try{speechSynthesis.speak(utterance);this.active=true;this.last=now;this.history.set(key,index);return true;}catch{this.active=false;return false;}
 }
 select(role:VoiceRole,faction:FactionId,id:string):boolean{
  const time=this.now(),old=this.selection,count=old?.id===id&&time-old.time<8?old.count+1:1;this.selection={id,time,count};
  return this.speak(role,count>=3?'repeat':'select',faction);
 }
 private cancel(){this.generation++;if(this.active&&typeof speechSynthesis!=='undefined')speechSynthesis.cancel();this.active=false;}
 reset(){this.cancel();this.last=-Infinity;this.history.clear();this.selection=undefined;}
}
