import {afterEach,expect,it,vi} from 'vitest';
import {GameAudio} from './audio';
import {allowEffect,defaultAudio,type Sound} from './audioPolicy';
import {effectMix,audioConfig} from '../config/audio';
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
  createGain(){const node={gain:{value:1,setValueAtTime(v:number){this.value=v;}},connect:vi.fn(),disconnect:vi.fn()};gains.push(node);return node;}
  createBufferSource(){const node={buffer:null,playbackRate:{value:1},connect:vi.fn(),disconnect:vi.fn(),start:vi.fn(),stop:vi.fn(),onended:null};sources.push(node);return node;}
 }
 vi.stubGlobal('AudioContext',FakeContext);vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(0)})));
 const engine=new GameAudio();await engine.unlock();expect(engine.status.loaded).toBe(15);expect(engine.status.music).toBe(true);expect(gains[1].gain.value).toBeCloseTo(defaultAudio.master*defaultAudio.music*audioConfig.menuMusicGain);engine.setPhase('playing');await Promise.resolve();expect(engine.status.music).toBe(true);expect(gains[1].gain.value).toBeCloseTo(defaultAudio.master*defaultAudio.music);
 engine.play('bow',false,.25);expect(gains.at(-1).gain.value).toBeCloseTo(effectMix.bow.gain*.25);engine.reset();await engine.unlock();
 for(const sound of ['gather','build','train','impact'] as Sound[])engine.play(sound);
 expect(engine.status.effects).toBe(4);engine.play('cannon');expect(engine.status.effects).toBe(4);
 engine.play('warning');expect(engine.status.effects).toBe(5);context.currentTime=2;engine.play('warning');expect(engine.status.effects).toBe(6);engine.play('warning');expect(engine.status.effects).toBe(6);
 engine.setSettings({muted:true});expect(gains[0].gain.value).toBe(0);expect(gains[1].gain.value).toBe(0);
 engine.setSettings({...defaultAudio});expect(gains[0].gain.value).toBeCloseTo(defaultAudio.master*defaultAudio.effects);
 engine.setPhase('paused');expect(context.state).toBe('suspended');engine.play('gather');expect(engine.status.effects).toBe(6);
 engine.reset();expect(engine.status.effects).toBe(0);expect(engine.status.music).toBe(false);expect(gains.slice(2).every(g=>g.disconnect.mock.calls.length>0)).toBe(true);
 engine.setPhase('playing');await Promise.resolve();engine.setPhase('ended');engine.play('victory',true);expect(engine.status.effects).toBe(1);expect(engine.status.music).toBe(false);
 expect(sources.filter(s=>s.stop.mock.calls.length>0).length).toBeGreaterThanOrEqual(7);
 engine.setPhase('menu');await Promise.resolve();expect(engine.status.effects).toBe(0);expect(engine.status.music).toBe(true);expect(gains[1].gain.value).toBeCloseTo(defaultAudio.master*defaultAudio.music*audioConfig.menuMusicGain);engine.setPhase('menu');expect(sources.filter(s=>s.loop&&!s.stop.mock.calls.length)).toHaveLength(1);engine.setSettings({muted:true});expect(gains[1].gain.value).toBe(0);
 // A delayed menu resume must not wake a match loaded into pause.
 engine.setPhase('ended');let finishResume!:()=>void;context.resume=()=>new Promise<void>(resolve=>{finishResume=()=>{context.state='running';resolve();};});engine.setPhase('menu');engine.setPhase('paused');finishResume();await Promise.resolve();await Promise.resolve();expect(context.state).toBe('suspended');expect(engine.status.music).toBe(false);
});
