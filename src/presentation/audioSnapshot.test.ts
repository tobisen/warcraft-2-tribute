import {expect,it} from 'vitest';
import {createMatch} from '../gameplay/match';
import {matchAudioSnapshot} from './audioSnapshot';
import {audioEvents} from './audioPolicy';
it('snapshots expose own work/build/counters and only caller-visible enemies without changing the match',()=>{
 const m=createMatch(),worker=m.gathering.units[0];worker.order={kind:'gather',nodeId:'wood-1'};worker.cargo=1;
 m.placement.barracks={x:512,y:384,width:64,height:64};m.placement.construction={remainingSeconds:5,builderId:worker.id};
 const copy=structuredClone(m),before=matchAudioSnapshot(m,[]);expect(before.visibleEnemies).toEqual({});expect(before.work).toEqual({[worker.id]:1});expect(m).toEqual(copy);
 worker.cargo=2;m.placement.construction.remainingSeconds=4;m.production.nextUnitNumber++;
 expect(audioEvents(before,matchAudioSnapshot(m,[]),true)).toEqual(['chop','build','train']);
 worker.order={kind:'move'};expect(matchAudioSnapshot(m,[]).work).toEqual({});
});
it('opening the naval system is not production; boarding/unloading do not change the spawn counter',async()=>{
 const {createNavy}=await import('../gameplay/navy');
 const m=createMatch(),before=matchAudioSnapshot(m,[]);m.navy=createNavy();
 expect(audioEvents(before,matchAudioSnapshot(m,[]),true)).toEqual([]);
 const initialized=matchAudioSnapshot(m,[]);m.navy.production.nextUnitNumber++;
 expect(audioEvents(initialized,matchAudioSnapshot(m,[]),true)).toEqual(['train']);
});

it('uses resource definitions and distinguishes treasure from recruits without sounding restored claims',()=>{
 const m=createMatch(),worker=m.gathering.units[0];
 m.gathering.gold={id:'ore',resource:'gold',position:{x:400,y:400},remaining:50};
 worker.order={kind:'gather',nodeId:'ore'};worker.cargo=1;
 const before=matchAudioSnapshot(m,[]);expect(before.workMaterials?.[worker.id]).toBe('gold');
 worker.cargo=2;m.discoveries={version:1,claimed:['arena-discovery-1','arena-discovery-3'],recruits:{}};
 const next=matchAudioSnapshot(m,[]);expect(next.treasures).toEqual(['arena-discovery-1']);
 expect(audioEvents(before,next,true)).toEqual(['mining','treasure']);
 expect(audioEvents(undefined,next,true)).toEqual([]);expect(audioEvents(next,next,true)).toEqual([]);
});
