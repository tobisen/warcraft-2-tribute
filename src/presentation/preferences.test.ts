import {saveConfig} from '../config/save';
import {expect,it} from 'vitest';
import {createPreferenceStore,preferencesKey,validatePreferences} from './preferences';
import {defaultAudio,audioGain} from './audioPolicy';
import {defaultCameraPreferences} from './cameraPreferences';
it('missing/invalid/future preferences use defaults and validate fields independently',()=>{
 expect(validatePreferences({game:{faction:'elves'}}).game.faction).toBe('elves');
 const defaults=validatePreferences(null);expect(defaults.audio).toEqual(defaultAudio);expect(defaults.camera).toEqual(defaultCameraPreferences);
 expect(validatePreferences({audio:{master:.2,effects:2,music:'0.4',voices:.8,muted:true},camera:{speed:NaN,edgePan:false},game:{faction:'unknown-faction',difficulty:'beginner',speed:.75}})).toMatchObject({audio:{master:.2,effects:defaultAudio.effects,music:defaultAudio.music,voices:.8,muted:true},camera:{speed:defaultCameraPreferences.speed,edgePan:false},game:{faction:'crown',difficulty:'beginner',speed:.75}});
 for(const raw of [null,'{','[]','null',JSON.stringify({version:2,settings:{audio:{master:0}}}),'x'.repeat(17000)]){
  const write=()=>{throw Error('load must not write');};const store=createPreferenceStore(()=>({getItem:()=>raw,setItem:write}));store.load();expect(store.get()).toEqual(defaults);
 }
});
it('roundtrips only a separate slot, preserves snapshots and updates without resetting other settings',()=>{
 const data=new Map<string,string>([[saveConfig.key,'existing match']]),host={getItem:(key:string)=>data.get(key)??null,setItem:(key:string,value:string)=>{data.set(key,value);}};
 const a=createPreferenceStore(()=>host);a.load();expect(a.update({audio:{voices:.2,master:.8},camera:{speed:720,edgePan:false},game:{faction:'clans',speed:.75}})).toBe(true);
 a.update({game:{difficulty:'hard'}});const b=createPreferenceStore(()=>host);b.load();expect(b.get()).toEqual(a.get());expect(data.get(saveConfig.key)).toBe('existing match');expect(JSON.parse(data.get(preferencesKey)!).version).toBe(1);
 const copy=b.get();copy.audio.master=0;expect(b.get().audio.master).toBe(.8);expect(b.get().game).toEqual({faction:'clans',speed:.75,difficulty:'hard'});
});
it('storage failures do not prevent session settings or defaults',()=>{
 const broken=createPreferenceStore(()=>{throw Error('blocked');});broken.load();expect(broken.update({audio:{voices:0},camera:{edgePan:false}})).toBe(false);expect(broken.get().audio.voices).toBe(0);expect(broken.get().camera.edgePan).toBe(false);
});
it('voices are independent of effects/music but follow master/mute and legacy default',()=>{
 expect(audioGain({...defaultAudio,master:.5,effects:0,music:0,voices:.8},'voices')).toBe(.4);
 expect(audioGain({...defaultAudio,voices:0},'effects')).toBeGreaterThan(0);
 expect(audioGain({...defaultAudio,voices:0},'music')).toBeGreaterThan(0);
 expect(audioGain({...defaultAudio,muted:true},'voices')).toBe(0);
 expect(audioGain({master:1,music:0,effects:0,muted:false},'voices')).toBe(defaultAudio.voices);
});
