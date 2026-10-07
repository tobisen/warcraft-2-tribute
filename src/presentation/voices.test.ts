import scriptText from '../../assets/sources/audio-identity/all-factions-voices.json?raw';
import {expect,it,vi} from 'vitest';
import {UnitVoices,type VoicePlayback} from './voices';
import {defaultAudio} from './audioPolicy';
import {recordedVoiceManifest,voiceConfig,type VoiceClip,recordedVoiceRoles,recordedVoiceActions} from '../config/voices';
import {factionIds} from '../config/factions';
import {voiceSpeaker,voiceOrders,orderedSpeaker,failedOrderSpeaker,voiceRole,voiceOrderAction,readyVoiceSpeaker,type VoiceUnit} from './voicePolicy';
const script=JSON.parse(scriptText);
const unit=(id:string,selected=true):VoiceUnit=>({id,kind:'worker',selected,owner:'player',order:{kind:'idle'},target:{x:0,y:0}});
function recordings():VoiceClip[]{return recordedVoiceManifest({version:1,entries:script.entries.map((e:Record<string,unknown>)=>({...e,recording:`audio/voices/${e.id}.wav`,author:'Test fixture',source:'Fixture, not an asset license',license:'CC0-1.0',processing:'Test-only silence metadata',listeningVerified:false}))});}
function fixture(random=()=>1){
 let time=0;const settings={...defaultAudio},played:{clip:VoiceClip;gain:number;ended:()=>void}[]=[];
 const playback:VoicePlayback={has:()=>true,play:(clip,gain,ended)=>{played.push({clip,gain,ended});return true;},stop:vi.fn()};
 const lane=new UnitVoices(()=>settings,()=>time,playback,random);lane.setClips(recordings());
 return {lane,settings,played,playback,setTime:(t:number)=>{time=t;},finish:()=>played.at(-1)?.ended()};
}
it('chooses one own representative and distinguishes accepted and failed changed orders',()=>{
 const a=unit('unit-10'),b=unit('unit-2'),enemy={...unit('enemy-1'),owner:'enemy'};
 expect(voiceSpeaker([a,enemy,b])?.id).toBe(b.id);expect(voiceSpeaker([{...a,selected:false},enemy])).toBeUndefined();
 const before=voiceOrders([a,b]);expect(orderedSpeaker(before,[a,b])).toBeUndefined();
 const gather={...b,order:{kind:'gather',nodeId:'wood-1'}};expect(orderedSpeaker(before,[a,gather])?.id).toBe(b.id);
 expect(orderedSpeaker(before,[{...gather,selected:false}])).toBeUndefined();
 const blocked={...gather,navigation:{status:'blocked'}};
 expect(orderedSpeaker(before,[blocked])).toBeUndefined();expect(failedOrderSpeaker(before,[blocked])?.id).toBe(b.id);
 expect(failedOrderSpeaker(before,[gather])).toBeUndefined();
 expect(voiceRole({...a,kind:'soldier',archetype:'archer'})).toBe('archer');expect(voiceRole({...a,kind:'ship',role:'transport'})).toBe('transport');
 expect(voiceOrderAction(gather)).toBe('gather');expect(voiceOrderAction({...a,order:{kind:'attack'}})).toBe('attack');expect(voiceOrderAction({...a,order:{kind:'move'}})).toBe('move');
});
it('provides three own variants for all five factions, three roles and seven actions with declared provenance and honest listening status',()=>{
 expect(script.entries).toHaveLength(315);expect(new Set(script.entries.map((e:VoiceClip)=>e.id)).size).toBe(315);
 for(const faction of factionIds)for(const role of recordedVoiceRoles)for(const action of recordedVoiceActions){
  const entries=script.entries.filter((e:VoiceClip)=>e.faction===faction&&e.role===role&&e.action===action);
  expect(entries).toHaveLength(3);expect(new Set(entries.map((e:VoiceClip)=>e.text)).size).toBe(3);
  for(const entry of entries){expect(entry.listeningVerified).toBe(false);if(entry.recording===null){expect(entry.license).toBeNull();}else{expect(recordedVoiceManifest({version:1,entries:[entry]})).toHaveLength(1);}}
 }
 expect(recordedVoiceManifest({version:1,entries:script.entries})).toHaveLength(script.entries.filter((e:VoiceClip)=>e.recording!==null).length);
});
it('accepts only local matching recording paths and declared provenance; ignores missing, duplicate and malformed entries',()=>{
 const clip=recordings()[0];
 expect(recordedVoiceManifest({version:1,entries:[clip,clip,{...clip,id:'other'},null,{...clip,recording:'https://example.org/voice.wav'}]})).toEqual([clip]);
 for(const change of [{recording:'audio/voices/../evil.wav'},{author:null},{license:null},{faction:'unknown'},{action:'unknown'},{processing:''},{listeningVerified:'yes'}])expect(recordedVoiceManifest({version:1,entries:[{...clip,...change}]})).toEqual([]);
 expect(recordedVoiceManifest(null)).toEqual([]);expect(recordedVoiceManifest({version:2,entries:[clip]})).toEqual([]);
});
it('routes recordings by faction, role and action, drops overlap/cooldown and rotates without immediate repeat',()=>{
 const f=fixture();expect(f.lane.speak('worker','select','crown')).toBe(false);f.lane.setPhase('playing');
 expect(f.lane.status.recordings).toBe(315);expect(f.lane.speak('worker','select','crown')).toBe(true);
 f.setTime(3);expect(f.lane.speak('soldier','attack','clans')).toBe(false);f.finish();
 f.setTime(.5);expect(f.lane.speak('worker','select','crown')).toBe(false);
 f.setTime(3);expect(f.lane.speak('worker','select','crown')).toBe(true);expect(f.played[1].clip.id).not.toBe(f.played[0].clip.id);f.finish();
 let time=6;
 for(const faction of factionIds)for(const role of recordedVoiceRoles)for(const action of ['select','move','attack','gather','ready','error'] as const){
  f.setTime(time);time+=3;expect(f.lane.speak(role,action,faction)).toBe(true);
  expect(f.played.at(-1)?.clip).toMatchObject({faction,role,action:action==='select'?'selection':action});f.finish();
 }
});
it('mute/voice/master changes stop only the active lane; pause/reset reject stale callbacks and restart cleanly',()=>{
 const f=fixture();f.lane.setPhase('playing');f.settings.effects=0;expect(f.lane.speak('worker','select','elves')).toBe(true);
 expect(f.played[0].gain).toBeCloseTo(f.settings.master*f.settings.voices!*voiceConfig.gain);
 f.settings.music=0;f.lane.onSettingsChange();expect(f.playback.stop).not.toHaveBeenCalled();
 f.settings.voices=.2;f.lane.onSettingsChange();expect(f.playback.stop).toHaveBeenCalledTimes(1);expect(f.lane.status.speaking).toBe(false);
 f.setTime(3);expect(f.lane.speak('worker','select','elves')).toBe(true);f.played[0].ended();expect(f.lane.status.speaking).toBe(true);
 f.settings.muted=true;f.lane.onSettingsChange();expect(f.playback.stop).toHaveBeenCalledTimes(2);expect(f.lane.speak('worker','select','elves')).toBe(false);
 f.settings.muted=false;f.setTime(6);expect(f.lane.speak('worker','select','elves')).toBe(true);f.lane.setPhase('paused');expect(f.playback.stop).toHaveBeenCalledTimes(3);
 expect(f.lane.speak('worker','select','elves')).toBe(false);f.lane.reset();f.lane.setPhase('playing');expect(f.lane.speak('worker','select','elves')).toBe(true);expect(f.played.at(-1)?.clip.id).toBe(f.played[0].clip.id);
});
it('missing recordings and playback failures are silent, do not consume cooldown or enter a queue',()=>{
 const f=fixture();f.lane.setPhase('playing');f.playback.has=()=>false;expect(f.lane.status.available).toBe(false);expect(f.lane.speak('worker','select','goblins')).toBe(false);
 f.playback.has=()=>true;f.playback.play=()=>false;expect(f.lane.speak('worker','select','goblins')).toBe(false);expect(f.lane.status.speaking).toBe(false);
 f.playback.play=()=>{throw Error('audio unavailable');};expect(f.lane.speak('worker','select','goblins')).toBe(false);expect(f.lane.status.speaking).toBe(false);
 f.playback.play=(clip,gain,ended)=>{f.played.push({clip,gain,ended});return true;};expect(f.lane.speak('worker','select','goblins')).toBe(true);
 expect(f.lane.speak('transport','select','goblins')).toBe(false);
});
it('humor requires six repeated clicks, a rare draw and its own cooldown; unavailable humor falls back to selection',()=>{
 const f=fixture(()=>0);f.lane.setPhase('playing');
 for(let i=0;i<12;i++){f.setTime(i*2);expect(f.lane.select('worker','dwarves','one')).toBe(true);f.finish();}
 expect(f.played.filter(p=>p.clip.action==='humor')).toHaveLength(1);expect(f.played[5].clip.action).toBe('humor');expect(f.played[11].clip.action).toBe('selection');
 f.setTime(60);f.lane.select('worker','dwarves','two');f.finish();expect(f.played.at(-1)?.clip.action).toBe('selection');
 const ordinary=fixture();ordinary.lane.setPhase('playing');for(let i=0;i<18;i++){ordinary.setTime(i*2);ordinary.lane.select('worker','dwarves','one');ordinary.finish();}
 expect(ordinary.played.every(p=>p.clip.action==='selection')).toBe(true);
 const missing=fixture(()=>0);missing.playback.has=id=>!id.includes('-humor-');missing.lane.setPhase('playing');for(let i=0;i<6;i++){missing.setTime(i*2);expect(missing.lane.select('worker','clans','one')).toBe(true);missing.finish();}expect(missing.played.at(-1)?.clip.action).toBe('selection');
});
it('arrival chooses one stable new voice, respects faction and silences initial/load/pause frames',()=>{
 const old={id:'unit-1',role:'worker' as const,faction:'crown' as const};
 const a={id:'unit-10',role:'soldier' as const,faction:'elves' as const},b={...a,id:'unit-2',faction:'goblins' as const};
 expect(readyVoiceSpeaker(undefined,[old],true)).toBeUndefined();expect(readyVoiceSpeaker([old],[old,a,b],false)).toBeUndefined();
 expect(readyVoiceSpeaker([old],[old,a,b],true)).toEqual(b);expect(readyVoiceSpeaker([old,a,b],[old,a,b],true)).toBeUndefined();
});
