import { describe,expect,it } from 'vitest';
import { createFog,fogIndex,isExplored,isVisible,updateFog,type VisionObserver } from './fog';
import { createMatch,updateMatch } from './match';
import { matchFog,visionObservers } from './matchFog';
const observer=(id:string,x:number,y:number,radius=32,owner:'player'|'enemy'='player'):VisionObserver=>({id,owner,position:{x,y},radius});
describe('team visibility and explored memory',()=>{
 it('unions observers, includes radius edge, clips world cells and isolates teams',()=>{
  const f=updateFog(createFog({width:100,height:64}),[observer('a',16,16),observer('b',80,16,32),observer('c',80,48,0,'enemy')]);
  expect(isVisible(f,'player',{x:48,y:16})).toBe(true);expect(isVisible(f,'player',{x:16,y:48})).toBe(true);expect(isVisible(f,'player',{x:48,y:48})).toBe(false);expect(isVisible(f,'enemy',{x:80,y:48})).toBe(true);expect(isVisible(f,'enemy',{x:16,y:16})).toBe(false);expect(f.teams.player.visible).toHaveLength(8);expect(fogIndex(f,{x:100,y:16})).toBeNull();expect(fogIndex(f,{x:NaN,y:0})).toBeNull();
 });
 it('keeps explored while losing current vision, never mutates previous state, and resets',()=>{
  const f=updateFog(createFog({width:128,height:64}),[observer('a',16,16)]),before=JSON.stringify(f),moved=updateFog(f,[observer('a',112,48)]);
  expect(isVisible(moved,'player',{x:16,y:16})).toBe(false);expect(isExplored(moved,'player',{x:16,y:16})).toBe(true);expect(JSON.stringify(f)).toBe(before);expect(createFog(f).teams.player.explored.some(Boolean)).toBe(false);
  const changed=updateFog(f,[observer('a',16,16,32,'enemy')]);expect(isVisible(changed,'player',{x:16,y:16})).toBe(false);expect(isVisible(changed,'enemy',{x:16,y:16})).toBe(true);expect(isExplored(changed,'enemy',{x:112,y:48})).toBe(false);
 });
 it('reveals rock itself, but blocks cells behind it and preserves sight around it',()=>{
  const rock={x:64,y:0,width:32,height:64},f=updateFog(createFog({width:192,height:128}),[observer('a',16,16,160)],[rock]);
  expect(isVisible(f,'player',{x:80,y:16})).toBe(true);expect(isVisible(f,'player',{x:112,y:16})).toBe(false);expect(isVisible(f,'player',{x:48,y:80})).toBe(true);
 });
 it('measures building vision from footprint edge, including non-full final tiles',()=>{
  const f=updateFog(createFog({width:100,height:64}),[{id:'base',owner:'player',position:{x:32,y:32},footprint:{x:16,y:16,width:32,height:32},radius:32}]);expect(isVisible(f,'player',{x:80,y:32})).toBe(true);expect(isVisible(f,'player',{x:98,y:32})).toBe(false);
 });
 it('uses only living observers and completed buildings, and recomputes after death even at delta zero',()=>{
  let s=createMatch('skirmish');expect(visionObservers(s).filter(o=>o.owner==='player')).toHaveLength(4);expect(visionObservers(s).filter(o=>o.owner==='enemy')).toHaveLength(1);
  const enemy=s.combat.enemies[0];expect(isVisible(s.fog!,'enemy',enemy.position)).toBe(true);enemy.hp=0;s=updateMatch(s,0);expect(s.fog!.teams.enemy.visible.some(Boolean)).toBe(false);expect(s.fog!.teams.enemy.explored.some(Boolean)).toBe(true);expect(s.outcome).toBe('victory');
  const b=createMatch();b.placement.barracks={x:800,y:600,width:64,height:64};b.placement.barracksHP=120;b.placement.construction={remainingSeconds:5,builderId:null};expect(visionObservers(b).some(o=>o.id==='barracks')).toBe(false);b.placement.construction!.remainingSeconds=0;expect(visionObservers(b).some(o=>o.id==='barracks')).toBe(true);b.placement.barracksHP=0;expect(visionObservers(b).some(o=>o.id==='barracks')).toBe(false);
 });
 it('match fog uses rock LOS, not water/building movement obstacles, and resets per scenario',()=>{
  const s=createMatch();s.gathering.units=[{...s.gathering.units[0],position:{x:64,y:480}}];s.combat.baseHP=0;const fog=matchFog(s);expect(isVisible(fog,'player',{x:208,y:480})).toBe(true);
  s.fog=fog;const fresh=createMatch('skirmish');expect(fresh.fog!.teams.enemy.explored.some(Boolean)).toBe(true);expect(createMatch().fog!.teams.enemy.explored.some(Boolean)).toBe(false);expect(fresh.fog!.teams.player.explored).not.toBe(fog.teams.player.explored);
 });
});
