import {describe,it,expect} from 'vitest';
import {volume,audioGain,defaultAudio,audioEvents,type AudioSnapshot} from './audioPolicy';
const snapshot:AudioSnapshot={baseHP:240,own:{a:30},visibleEnemies:{x:40},completed:[],outcome:'playing'};
describe('audio volume and information policy',()=>{
 it('clamps and mutes immediately at every channel',()=>{expect(volume(NaN)).toBe(0);expect(volume(-1)).toBe(0);expect(volume(2)).toBe(1);expect(audioGain({...defaultAudio,muted:true},'effects')).toBe(0);expect(audioGain({master:.5,effects:.4,music:.2,muted:false},'music')).toBe(.1);});
 it('silences initial, paused and hidden/revealed enemy changes',()=>{expect(audioEvents(undefined,snapshot,true)).toEqual([]);expect(audioEvents(snapshot,{...snapshot,baseHP:0},false)).toEqual([]);expect(audioEvents({...snapshot,visibleEnemies:{}},{...snapshot,visibleEnemies:{x:1}},true)).toEqual([]);expect(audioEvents(snapshot,{...snapshot,visibleEnemies:{}},true)).toEqual([]);});
 it('sounds public damage/completion and exactly one game-over transition',()=>{expect(audioEvents(snapshot,{...snapshot,baseHP:239,completed:['farm']},true)).toEqual(['impact','complete']);expect(audioEvents(snapshot,{...snapshot,visibleEnemies:{x:39}},true)).toEqual(['impact']);const end={...snapshot,outcome:'defeat' as const};expect(audioEvents(snapshot,end,true)).toEqual(['defeat']);expect(audioEvents(end,end,true)).toEqual([]);});
});

it('cannon audio requires a newly fired visible shot; hidden flight/reveal/pause/load is silent',()=>{
 const shot={id:'arrow-1',audible:true};expect(audioEvents(snapshot,{...snapshot,navalShots:[shot]},true)).toEqual(['cannon']);expect(audioEvents({...snapshot,navalShots:[shot]},{...snapshot,navalShots:[shot]},true)).toEqual([]);expect(audioEvents(snapshot,{...snapshot,navalShots:[{...shot,audible:false}]},true)).toEqual([]);expect(audioEvents({...snapshot,navalShots:[{...shot,audible:false}]},{...snapshot,navalShots:[shot]},true)).toEqual([]);expect(audioEvents(snapshot,{...snapshot,navalShots:[shot]},false)).toEqual([]);expect(audioEvents(undefined,{...snapshot,navalShots:[shot]},true)).toEqual([]);
});
