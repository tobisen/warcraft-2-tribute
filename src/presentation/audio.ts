import {text as uiText} from '../text';
import {attackWarningConfig} from '../config/feedback';
import {audioConfig,effectMix,audioFiles} from '../config/audio';
import {audioGain,defaultAudio,volume,allowEffect,type AudioSettings,type Sound} from './audioPolicy';
import type {SessionPhase} from '../gameplay/session';
type AudioName=Sound|'music';
/** One app-owned audio graph. Scene restart cannot duplicate music, listeners or stale effects. */
export class GameAudio {
 settings:AudioSettings={...defaultAudio};
 private context?:AudioContext;
 private effectGain?:GainNode;
 private musicGain?:GainNode;
 private buffers=new Map<AudioName,AudioBuffer>();
 private loading?:Promise<void>;
 private music?:AudioBufferSourceNode;
 private effects=new Map<AudioBufferSourceNode,GainNode>();
 private phase:SessionPhase='menu';
 private lastEffect=new Map<Sound,number>();
 private generation=0;
 get status(){return {state:this.context?.state??'locked',loaded:this.buffers.size,music:!!this.music,effects:this.effects.size,phase:this.phase,settings:{...this.settings}};}
 async unlock():Promise<void>{
  try{
   if(!this.context){this.context=new AudioContext();this.effectGain=this.context.createGain();this.musicGain=this.context.createGain();this.effectGain.connect(this.context.destination);this.musicGain.connect(this.context.destination);this.applyVolume();}
   await this.context.resume();
   if(!this.loading)this.loading=this.load();await this.loading;
   if(this.phase==='playing')this.startMusic();else if(this.phase==='paused')await this.context.suspend();
  }catch{document.getElementById('audio-status')!.textContent=uiText.audioUnavailableGameplayRemainsAvailable;}
 }
 private async load():Promise<void>{for(const name of audioFiles){for(const ext of ['ogg','wav'])try{const response=await fetch(`${import.meta.env.BASE_URL}audio/${name}.${ext}`);if(!response.ok)throw new Error('missing audio');this.buffers.set(name,await this.context!.decodeAudioData(await response.arrayBuffer()));break;}catch{/* Validated PCM fallback; missing sound never blocks gameplay. */}}}
 setSettings(change:Partial<AudioSettings>):void {this.settings={...this.settings,...change};this.settings.master=volume(this.settings.master);this.settings.music=volume(this.settings.music);this.settings.effects=volume(this.settings.effects);this.applyVolume();}
 private applyVolume():void {if(this.context&&this.effectGain&&this.musicGain){this.effectGain.gain.setValueAtTime(audioGain(this.settings,'effects'),this.context.currentTime);this.musicGain.gain.setValueAtTime(audioGain(this.settings,'music'),this.context.currentTime);}}
 setPhase(phase:SessionPhase):void{
  if(this.phase===phase)return;this.phase=phase;
  if(phase==='menu'||phase==='ended'){this.reset();return;}
  if(phase==='paused'){void this.context?.suspend().catch(()=>{});return;}
  if(this.context){void this.context.resume().then(()=>{if(this.phase==='playing')this.startMusic();}).catch(()=>{});}
 }
 private startMusic():void {if(this.music||!this.context||!this.musicGain||this.phase!=='playing')return;const buffer=this.buffers.get('music');if(!buffer)return;const source=this.context.createBufferSource();source.buffer=buffer;source.loop=true;source.loopStart=0;source.loopEnd=audioConfig.musicLoopSeconds;source.connect(this.musicGain);source.start();this.music=source;}
 play(name:Sound,terminal=false):void{
  if(!this.context||!this.effectGain||this.context.state!=='running'||this.phase!=='playing'&&!terminal)return;const now=this.context.currentTime;if(!allowEffect(name,now,this.lastEffect.get(name),this.effects.size))return;const buffer=this.buffers.get(name==='warning'?'command':name);if(!buffer)return;this.lastEffect.set(name,now);const source=this.context.createBufferSource();source.buffer=buffer;if(name==='warning')source.playbackRate.value=attackWarningConfig.soundPlaybackRate;const gain=this.context.createGain();gain.gain.value=effectMix[name].gain;source.connect(gain);gain.connect(this.effectGain);const generation=this.generation;this.effects.set(source,gain);source.onended=()=>{if(generation===this.generation)this.effects.delete(source);source.disconnect();gain.disconnect();};source.start();
 }
 reset():void {this.generation++;this.music?.stop();this.music?.disconnect();this.music=undefined;for(const [effect,gain] of this.effects){effect.stop();effect.disconnect();gain.disconnect();}this.effects.clear();this.lastEffect.clear();}
}
export const gameAudio=new GameAudio();
export function bindAudioControls():void{
 const gesture=()=>{void gameAudio.unlock();document.removeEventListener('pointerdown',gesture);document.removeEventListener('keydown',gesture);};document.addEventListener('pointerdown',gesture);document.addEventListener('keydown',gesture);
 for(const channel of ['master','effects','music'] as const){const input=document.getElementById(`audio-${channel}`) as HTMLInputElement;input.value=String(gameAudio.settings[channel]);input.addEventListener('input',()=>gameAudio.setSettings({[channel]:Number(input.value)}));}
 document.getElementById('audio-enable')!.addEventListener('click',()=>{void gameAudio.unlock();});
 const mute=document.getElementById('audio-mute') as HTMLInputElement;mute.addEventListener('change',()=>gameAudio.setSettings({muted:mute.checked}));
}
