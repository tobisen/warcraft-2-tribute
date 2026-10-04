import {afterEach,expect,it,vi} from 'vitest';
import {UnitVoices} from './voices';
import {defaultAudio} from './audioPolicy';
import {voiceSpeaker,voiceOrders,orderedSpeaker,voiceRole,type VoiceUnit} from './voicePolicy';
afterEach(()=>vi.unstubAllGlobals());
const unit=(id:string,selected=true):VoiceUnit=>({id,kind:'worker',selected,owner:'player',order:{kind:'idle'},target:{x:0,y:0}});
it('chooses one stable own speaker and suppresses unchanged, unselected and blocked orders',()=>{
 const a=unit('unit-10'),b=unit('unit-2'),enemy={...unit('enemy-1'),owner:'enemy'};
 expect(voiceSpeaker([a,enemy,b])?.id).toBe(b.id);expect(voiceSpeaker([{...a,selected:false},enemy])).toBeUndefined();
 const before=voiceOrders([a,b]);expect(orderedSpeaker(before,[a,b])).toBeUndefined();
 const gather={...b,order:{kind:'gather',nodeId:'wood-1'}};expect(orderedSpeaker(before,[a,gather])?.id).toBe(b.id);
 expect(orderedSpeaker(before,[a,{...gather,selected:false}])).toBeUndefined();expect(orderedSpeaker(before,[{...gather,navigation:{status:'blocked'}}])).toBeUndefined();
 expect(voiceRole({...a,kind:'soldier',archetype:'archer'})).toBe('archer');expect(voiceRole({...a,kind:'ship',role:'transport'})).toBe('transport');
});
it('uses local English speech, rotates lines, drops busy/cooldown requests, cancels on mute/pause/reset',()=>{
 let time=0;const settings={...defaultAudio},spoken:any[]=[];
 const local={name:'Local English',lang:'en-US',localService:true};
 const synth={speaking:false,pending:false,getVoices:()=>[{name:'Remote',lang:'en-US',localService:false},{name:'Other',lang:'sv-SE',localService:true},local],speak:vi.fn(u=>spoken.push(u)),cancel:vi.fn()};
 class Utterance{constructor(public text:string){} }
 vi.stubGlobal('speechSynthesis',synth);vi.stubGlobal('SpeechSynthesisUtterance',Utterance);
 const lane=new UnitVoices(()=>settings,()=>time);expect(lane.speak('worker','select','crown')).toBe(false);lane.setPhase('playing');expect(lane.status.available).toBe(true);
 expect(lane.speak('worker','select','crown')).toBe(true);expect(spoken[0].voice).toBe(local);expect(spoken[0].volume).toBeGreaterThan(0);time=3;expect(lane.speak('soldier','order','clans')).toBe(false);spoken[0].onend();
 time=1;expect(lane.speak('worker','select','crown')).toBe(false);time=3;expect(lane.speak('worker','select','crown')).toBe(true);expect(spoken[1].text).not.toBe(spoken[0].text);spoken[1].onend();
 time=6;synth.pending=true;expect(lane.speak('worker','select','crown')).toBe(false);synth.pending=false;expect(lane.speak('worker','order','clans')).toBe(true);expect(spoken[2].pitch).toBeLessThan(spoken[0].pitch);
 settings.muted=true;lane.onSettingsChange();expect(synth.cancel).toHaveBeenCalledTimes(1);expect(lane.status.speaking).toBe(false);expect(lane.speak('worker','select','crown')).toBe(false);
 settings.muted=false;time=9;expect(lane.speak('worker','select','crown')).toBe(true);lane.setPhase('paused');expect(synth.cancel).toHaveBeenCalledTimes(2);expect(lane.speak('worker','select','crown')).toBe(false);
 lane.reset();lane.setPhase('playing');expect(lane.speak('worker','select','crown')).toBe(true);expect(spoken.at(-1).text).toBe(spoken[0].text);
});
it('missing API or only remote voices is silent and never blocks gameplay',()=>{
 const lane=new UnitVoices(()=>defaultAudio);lane.setPhase('playing');expect(lane.status.available).toBe(false);expect(lane.speak('worker','select','crown')).toBe(false);
 const speak=vi.fn();vi.stubGlobal('speechSynthesis',{getVoices:()=>[{localService:false,lang:'en-US',name:'Cloud'}],speaking:false,pending:false,speak});expect(lane.speak('worker','select','crown')).toBe(false);expect(speak).not.toHaveBeenCalled();
});
it('voice gain is independent of effects and a changed voice/master gain cancels active speech',()=>{
 const settings={...defaultAudio,effects:0,voices:.8},spoken:any[]=[];let time=0;const cancel=vi.fn();
 vi.stubGlobal('speechSynthesis',{getVoices:()=>[{localService:true,lang:'en-US',name:'Local'}],speaking:false,pending:false,speak:(u:any)=>spoken.push(u),cancel});
 vi.stubGlobal('SpeechSynthesisUtterance',class{constructor(public text:string){}});
 const lane=new UnitVoices(()=>settings,()=>time);lane.setPhase('playing');expect(lane.speak('soldier','select','crown')).toBe(true);expect(spoken[0].volume).toBeCloseTo(settings.master*.8*.9);
 settings.music=0;lane.onSettingsChange();expect(cancel).not.toHaveBeenCalled();settings.voices=.2;lane.onSettingsChange();expect(cancel).toHaveBeenCalledTimes(1);
 time=3;expect(lane.speak('soldier','order','crown')).toBe(true);settings.voices=0;lane.onSettingsChange();expect(cancel).toHaveBeenCalledTimes(2);time=6;expect(lane.speak('soldier','select','crown')).toBe(false);
});
it('provides distinct faction/role dialogue for every activity without treating text as recordings',async()=>{
 const {dialogue}=await import('../config/voices'),{voiceOrderAction}=await import('./voicePolicy');
 for(const role of ['worker','soldier','archer','specialist','catapult','transport','warship'] as const)for(const action of ['select','move','attack','work','repeat'] as const){const variants=['crown','clans','elves','dwarves','goblins'].map(f=>dialogue(role,action,f as 'crown'));expect(new Set(variants.map(v=>v[0])).size).toBe(5);for(const lines of variants){expect(lines.length).toBeGreaterThanOrEqual(2);expect(new Set(lines).size).toBe(lines.length);}}
 const u=unit('unit-1');expect(voiceOrderAction({...u,order:{kind:'gather'}})).toBe('work');expect(voiceOrderAction({...u,order:{kind:'attack'}})).toBe('attack');expect(voiceOrderAction({...u,order:{kind:'move'}})).toBe('move');expect(voiceRole({...u,kind:'soldier',archetype:'specialist'})).toBe('specialist');
});
it('third click on the same unit uses repeat dialogue; cooldown still drops rapid speech',()=>{
 let time=0;const spoken:any[]=[];vi.stubGlobal('speechSynthesis',{speaking:false,pending:false,getVoices:()=>[{localService:true,lang:'en-US',name:'Local'}],speak:(u:any)=>spoken.push(u),cancel:vi.fn()});vi.stubGlobal('SpeechSynthesisUtterance',class{constructor(public text:string){}});
 const lane=new UnitVoices(()=>defaultAudio,()=>time);lane.setPhase('playing');expect(lane.select('worker','dwarves','one')).toBe(true);spoken[0].onend();time=1;expect(lane.select('worker','dwarves','one')).toBe(false);time=3;expect(lane.select('worker','dwarves','one')).toBe(true);expect(spoken[1].text).toContain('still billable');spoken[1].onend();time=6;expect(lane.select('worker','dwarves','two')).toBe(true);expect(spoken[2].text).toContain('Payroll');
});
