import {afterEach,expect,it,vi} from 'vitest';
import {GameAudio} from './audio';
import {allowEffect,defaultAudio,type Sound} from './audioPolicy';
import {effectMix,audioConfig,audioFiles} from '../config/audio';
afterEach(()=>vi.unstubAllGlobals());
it('limits work repetition, reserves alert slots and preserves per-cue gains',()=>{
 expect(allowEffect('gather',.79,0,0)).toBe(false);expect(allowEffect('gather',.8,0,0)).toBe(true);
 expect(allowEffect('train',1,undefined,4)).toBe(false);expect(allowEffect('warning',1,undefined,4)).toBe(true);
 expect(allowEffect('warning',2,undefined,6)).toBe(false);
 for(const mix of Object.values(effectMix)){expect(mix.gain).toBeGreaterThan(0);expect(mix.gain).toBeLessThanOrEqual(1);expect(mix.cooldown).toBeGreaterThan(0);}
});
it('the engine caps concurrent sources, cleans gains/reset, mutes, pauses and leaves one terminal cue',async()=>{
 const sources:any[]=[],gains:any[]=[];let context:any;
 class FakeContext{
  state='running';currentTime=0;destination={};
  constructor(){context=this;}
  async resume(){this.state='running';}async suspend(){this.state='suspended';}
  async decodeAudioData(){return {};}
  createDynamicsCompressor(){return {threshold:{value:0},knee:{value:0},ratio:{value:0},attack:{value:0},release:{value:0},connect:vi.fn()};}
  createGain(){const node={gain:{value:1,setValueAtTime(v:number){this.value=v;},setTargetAtTime:vi.fn(function(this:{value:number},v:number){this.value=v;})},connect:vi.fn(),disconnect:vi.fn()};gains.push(node);return node;}
  createBufferSource(){const node={buffer:null,playbackRate:{value:1},connect:vi.fn(),disconnect:vi.fn(),start:vi.fn(),stop:vi.fn(),onended:null};sources.push(node);return node;}
 }
 vi.stubGlobal('AudioContext',FakeContext);vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(0)})));
 const engine=new GameAudio();await engine.unlock();expect(engine.status.loaded).toBe(audioFiles.length);expect(engine.status.music).toBe(true);expect(gains[1].gain.value).toBeCloseTo(defaultAudio.master*defaultAudio.music*audioConfig.menuMusicGain);engine.setPhase('playing');await Promise.resolve();expect(engine.status.music).toBe(true);expect(gains[1].gain.value).toBeCloseTo(defaultAudio.master*defaultAudio.music);
 engine.play('animal-deer');const animalCount=engine.status.effects;context.currentTime=.3;engine.play('animal-rabbit');expect(engine.status.effects).toBe(animalCount);context.currentTime=.9;engine.play('animal-fox');expect(engine.status.effects).toBe(animalCount+1);engine.reset();await engine.unlock();
 engine.play('bow',false,.25);expect(gains.at(-1).gain.value).toBeCloseTo(effectMix.bow.gain*.25);engine.reset();await engine.unlock();
 for(const sound of ['gather','build','train','impact'] as Sound[])engine.play(sound);
 expect(engine.status.effects).toBe(4);engine.play('cannon');expect(engine.status.effects).toBe(4);
 engine.play('warning');expect(engine.status.effects).toBe(5);context.currentTime=2;engine.play('warning');expect(engine.status.effects).toBe(6);engine.play('warning');expect(engine.status.effects).toBe(6);
 engine.setSettings({muted:true});expect(gains[0].gain.value).toBe(0);expect(gains[1].gain.value).toBe(0);
 engine.setSettings({...defaultAudio});expect(gains[0].gain.value).toBeCloseTo(defaultAudio.master*defaultAudio.effects);
 engine.setPhase('paused');expect(context.state).toBe('suspended');engine.play('gather');expect(engine.status.effects).toBe(6);
 engine.reset();expect(engine.status.effects).toBe(0);expect(engine.status.music).toBe(false);expect(gains.slice(3).every(g=>g.disconnect.mock.calls.length>0)).toBe(true);
 engine.setPhase('playing');await Promise.resolve();engine.setPhase('ended');engine.play('victory',true);expect(engine.status.effects).toBe(1);expect(engine.status.music).toBe(false);
 expect(sources.filter(s=>s.stop.mock.calls.length>0).length).toBeGreaterThanOrEqual(7);
 engine.setPhase('menu');await Promise.resolve();expect(engine.status.effects).toBe(0);expect(engine.status.music).toBe(true);expect(gains[1].gain.value).toBeCloseTo(defaultAudio.master*defaultAudio.music*audioConfig.menuMusicGain);engine.setPhase('menu');expect(sources.filter(s=>s.loop&&!s.stop.mock.calls.length)).toHaveLength(1);engine.setSettings({muted:true});expect(gains[1].gain.value).toBe(0);
 // A delayed menu resume must not wake a match loaded into pause.
 engine.setPhase('ended');let finishResume!:()=>void;context.resume=()=>new Promise<void>(resolve=>{finishResume=()=>{context.state='running';resolve();};});engine.setPhase('menu');engine.setPhase('paused');finishResume();await Promise.resolve();await Promise.resolve();expect(context.state).toBe('suspended');expect(engine.status.music).toBe(false);
});

it('recorded voices share the unlocked graph, route actual faction, duck only SFX and stop on mute/pause/restart',async()=>{
 const {voiceConfig}=await import('../config/voices');
 const gains:any[]=[],sources:any[]=[];let context:any;
 const clips=['crown','clans','elves','dwarves','goblins'].flatMap(faction=>['selection','move'].map(action=>({
  id:`${faction}-worker-${action}-01`,faction,role:'worker',action,text:'Fixture only',
  recording:`audio/voices/${faction}-worker-${action}-01.wav`,author:'Test fixture',source:'Fixture only',license:'CC0-1.0',processing:'Fixture',listeningVerified:false,
 })));
 class FakeContext{
  state='running';currentTime=0;destination={};
  constructor(){context=this;}
  async resume(){this.state='running';}async suspend(){this.state='suspended';}
  async decodeAudioData(){return {duration:.3};}
  createDynamicsCompressor(){return {threshold:{value:0},knee:{value:0},ratio:{value:0},attack:{value:0},release:{value:0},connect:vi.fn()};}
  createGain(){const node={gain:{value:1,setValueAtTime(v:number){this.value=v;},setTargetAtTime:vi.fn(function(this:{value:number},v:number){this.value=v;})},connect:vi.fn(),disconnect:vi.fn()};gains.push(node);return node;}
  createBufferSource(){const node={buffer:null,playbackRate:{value:1},connect:vi.fn(),disconnect:vi.fn(),start:vi.fn(),stop:vi.fn(),onended:null};sources.push(node);return node;}
 }
 const fetch=vi.fn(async(path:string)=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(0),json:async()=>({version:1,entries:clips})}));
 vi.stubGlobal('AudioContext',FakeContext);vi.stubGlobal('fetch',fetch);
 const engine=new GameAudio();expect(engine.voices.status.available).toBe(false);await engine.unlock();engine.setPhase('playing');await Promise.resolve();
 expect(engine.voices.status.recordings).toBe(10);expect(fetch.mock.calls.every(([path])=>!path.startsWith('https:'))).toBe(true);
 const originalSFX=gains[0].gain.value,originalMusic=gains[1].gain.value;
 expect(engine.voices.speak('worker','select','elves')).toBe(true);
 const source=sources.at(-1);expect(source.connect).toHaveBeenCalledWith(gains[2]);expect(source.playbackRate.value).toBe(1);
 expect(gains[0].gain.value).toBeCloseTo(originalSFX*voiceConfig.duckGain);expect(gains[0].gain.setTargetAtTime).toHaveBeenLastCalledWith(originalSFX*voiceConfig.duckGain,context.currentTime,.012);expect(gains[1].gain.value).toBeCloseTo(originalMusic);
 expect(gains[2].gain.value).toBeCloseTo(defaultAudio.master*defaultAudio.voices!*voiceConfig.gain);
 expect(engine.voices.speak('worker','select','goblins')).toBe(false);
 const oldSelectionEnd=source.onended;expect(engine.voices.speak('worker','move','goblins')).toBe(true);expect(source.stop).toHaveBeenCalledTimes(1);
 oldSelectionEnd();expect(engine.voices.status.speaking).toBe(true);expect(gains[0].gain.value).toBeCloseTo(originalSFX*voiceConfig.duckGain);
 sources.at(-1).onended();expect(gains[0].gain.value).toBeCloseTo(originalSFX);
 context.currentTime=3;engine.setSettings({effects:0});
 engine.say({id:'unit-1',kind:'worker',selected:true,faction:'goblins',owner:'player',order:{kind:'move'},target:{x:0,y:0}},'move','crown');
 expect(engine.voices.status.speaking).toBe(true);expect(gains[0].gain.value).toBe(0);
 const active=sources.at(-1),stale=active.onended;engine.setSettings({muted:true});expect(active.stop).toHaveBeenCalledTimes(1);expect(gains[2].gain.value).toBe(0);expect(engine.voices.status.speaking).toBe(false);
 engine.setSettings({muted:false});context.currentTime=6;expect(engine.voices.speak('worker','select','clans')).toBe(true);stale();expect(engine.voices.status.speaking).toBe(true);
 engine.setPhase('paused');expect(context.state).toBe('suspended');expect(engine.voices.status.speaking).toBe(false);
 engine.reset();engine.setPhase('playing');await Promise.resolve();expect(engine.voices.speak('worker','select','dwarves')).toBe(true);
 engine.setPhase('ended');expect(engine.voices.status.speaking).toBe(false);expect(engine.voices.speak('worker','select','crown')).toBe(false);
});
