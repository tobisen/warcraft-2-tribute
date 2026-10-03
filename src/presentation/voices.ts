import {voiceConfig,voiceLines,type VoiceRole,type VoiceAction} from '../config/voices';
import {audioGain,type AudioSettings} from './audioPolicy';
import type {FactionId} from '../config/factions';
/** One app-owned, local-only speech lane. No queue, external assets or gameplay state. */
export class UnitVoices {
 private phase='menu';private last=-Infinity;private active=false;private generation=0;
 private history=new Map<string,number>();
 constructor(private settings:()=>AudioSettings,private now=()=>performance.now()/1000){}
 private localVoice(){return typeof speechSynthesis==='undefined'?undefined:speechSynthesis.getVoices().filter(v=>v.localService&&/^en(?:[-_]|$)/i.test(v.lang)).sort((a,b)=>a.name.localeCompare(b.name))[0];}
 get status(){return {available:!!this.localVoice(),speaking:this.active};}
 setPhase(phase:string){this.phase=phase;if(phase!=='playing')this.cancel();}
 onSettingsChange(){if(audioGain(this.settings(),'effects')===0)this.cancel();}
 speak(role:VoiceRole,action:VoiceAction,faction:FactionId):boolean{
  const voice=this.localVoice(),now=this.now();
  if(this.phase!=='playing'||!voice||typeof SpeechSynthesisUtterance==='undefined'||this.active||speechSynthesis.speaking||speechSynthesis.pending||now-this.last<voiceConfig.cooldownSeconds||audioGain(this.settings(),'effects')===0)return false;
  const key=`${role}:${action}`,lines=voiceLines[role][action],index=((this.history.get(key)??-1)+1)%lines.length;
  const utterance=new SpeechSynthesisUtterance(lines[index]);utterance.voice=voice;utterance.lang=voice.lang;
  utterance.rate=voiceConfig.rate;utterance.pitch=(faction==='clans'?.8:1)*(role==='catapult'?.8:role==='archer'?1.15:1);utterance.volume=audioGain(this.settings(),'effects')*voiceConfig.gain;
  const generation=this.generation;utterance.onend=utterance.onerror=()=>{if(generation===this.generation)this.active=false;};
  try{speechSynthesis.speak(utterance);this.active=true;this.last=now;this.history.set(key,index);return true;}catch{this.active=false;return false;}
 }
 private cancel(){this.generation++;if(this.active&&typeof speechSynthesis!=='undefined')speechSynthesis.cancel();this.active=false;}
 reset(){this.cancel();this.last=-Infinity;this.history.clear();}
}
