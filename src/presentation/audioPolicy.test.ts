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

it('work/build/train cues use actual changes, aggregate multiple workers and silence initial/order/delivery/pauses',()=>{
 const before={...snapshot,work:{a:1,b:2},construction:{farm:4},production:8};
 expect(audioEvents(before,{...before,work:{a:2,b:3},construction:{farm:3},production:9},true)).toEqual(['gather','build','train']);
 expect(audioEvents(before,{...before,work:{a:0,b:2,c:1},construction:{farm:4,newSite:5}},true)).toEqual([]);
 expect(audioEvents(undefined,before,true)).toEqual([]);expect(audioEvents(before,{...before,production:9},false)).toEqual([]);
 expect(audioEvents(before,{...before,work:{},construction:{farm:0},completed:['farm']},true)).toEqual(['complete']);
});

it('routes wood, ore and newly claimed treasure separately and coalesces resource groups',()=>{
 const before={...snapshot,work:{a:1,b:1,c:1},workMaterials:{a:'wood' as const,b:'wood' as const,c:'gold' as const},treasures:[]};
 const next={...before,work:{a:2,b:2,c:2},treasures:['chest']};
 expect(audioEvents(before,next,true)).toEqual(['chop','mining','treasure']);
 expect(audioEvents(next,next,true)).toEqual([]);
 expect(audioEvents(before,{...before,work:{a:0,b:1,c:1}},true)).toEqual([]);
 expect(audioEvents(undefined,next,true)).toEqual([]);expect(audioEvents(before,next,false)).toEqual([]);
});
