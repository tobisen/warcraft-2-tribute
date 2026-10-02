import { describe,expect,it } from 'vitest';
import { createMatch,updateMatch } from './match';
import { createResearch,startResearch,updateResearch } from './research';
import { beginPlacement,placeBuilding,placementObstacles } from './placement';
import { updateConstruction } from './construction';
import { updateCombat } from './combat';
import { enqueueProduction,updateQueuedProduction } from './productionQueue';
import type { Soldier } from './gathering';
const ready=()=>{const s=createMatch();s.gathering.wood=200;s.gathering.goldBalance=100;s.placement.forge={id:'forge',owner:'player',hp:120,footprint:{x:256,y:384,width:64,height:64},construction:{remainingSeconds:0,builderId:null}};s.map.obstacles.push(s.placement.forge.footprint);return s;};
const soldier:Soldier={kind:'soldier',id:'unit-4',hp:60,cargo:0,selected:true,position:{x:300,y:300},target:{x:300,y:300},order:{kind:'attack',enemyId:'e'}};
describe('Forge and research',()=>{
 it('places/builds with worker, pays both costs once, and never grants supply',()=>{
  let s=createMatch();s.gathering.wood=100;s.gathering.goldBalance=30;s.gathering.units[0].selected=true;
  const r=placeBuilding(beginPlacement(s.placement,'forge'),{x:256,y:384},100,placementObstacles(s.gathering),{gathering:s.gathering,map:s.map,enemies:[]});
  expect(r.gathering).toMatchObject({wood:60,goldBalance:20});expect(r.placement.forge).toMatchObject({hp:120,construction:{remainingSeconds:5,builderId:'unit-1'}});
  expect(beginPlacement(r.placement,'forge')).toBe(r.placement);
  const built=updateConstruction(r.gathering!,r.placement,r.map!,6);expect(built.placement.forge!.construction.remainingSeconds).toBe(0);expect(built.gathering.units[0].order.kind).toBe('idle');expect(built.placement.farms).toEqual([]);
 });
 it('requires completed live Forge, affordability, idle research and uncompleted level',()=>{
  const s=ready(),r=createResearch();s.placement.forge!.construction.remainingSeconds=1;
  expect(startResearch(s.gathering,r,s.placement,'attack').gathering).toBe(s.gathering);s.placement.forge!.construction.remainingSeconds=0;
  const first=startResearch(s.gathering,r,s.placement,'attack');expect(first.gathering).toMatchObject({wood:160,goldBalance:90});
  expect(startResearch(first.gathering,first.research,s.placement,'defense').gathering).toBe(first.gathering);
  const finished=updateResearch(first.research,s.placement,8);expect(finished).toEqual({attack:1,defense:0,job:null});
  expect(startResearch(first.gathering,finished,s.placement,'attack').research).toBe(finished);
  s.gathering.goldBalance=9;expect(startResearch(s.gathering,r,s.placement,'defense').gathering).toBe(s.gathering);
  expect(startResearch(first.gathering,r,s.placement,'defense',false).research).toBe(r);
 });
 it.each([1,8,80])('completes exactly once across %s time steps and never before eight seconds',steps=>{
  const s=ready();let r=startResearch(s.gathering,createResearch(),s.placement,'attack').research;
  expect(updateResearch(r,s.placement,7.99).attack).toBe(0);
  for(let i=0;i<steps;i++)r=updateResearch(r,s.placement,8/steps);
  expect(r.attack).toBe(1);expect(updateResearch(r,s.placement,100)).toBe(r);
 });
 it('affects existing/new melee units dynamically; defense does not heal or affect workers',()=>{
  const s=ready();s.gathering.units=[soldier];s.combat.enemies=[{id:'e',hp:100,position:{x:330,y:300}}];
  const plain=updateCombat(s.gathering,s.combat,1),upgraded=updateCombat(s.gathering,{...s.combat,upgrades:{attack:1,defense:1}},1);
  expect(100-upgraded.combat.enemies[0].hp).toBeCloseTo((100-plain.combat.enemies[0].hp)*1.25);
  expect(60-upgraded.gathering.units[0].hp!).toBeCloseTo((60-plain.gathering.units[0].hp!)*.75);
  const queued=enqueueProduction(s.gathering,s.soldierProduction,{kind:'barracks',footprint:{x:512,y:384,width:64,height:64}});
  const produced=updateQueuedProduction(queued.gathering,queued.production,5,{kind:'barracks',footprint:{x:512,y:384,width:64,height:64}});
  expect(produced.gathering.units[1].hp).toBe(60);
 });
 it('snapshots ranged damage at firing time and retains old in-flight damage',()=>{
  const s=ready();s.gathering.units=[{...soldier,archetype:'archer'}];s.combat.enemies=[{id:'e',hp:100,position:{x:430,y:300}}];
  const fired=updateCombat(s.gathering,{...s.combat,upgrades:{attack:1,defense:0}},.1,s.map);expect(fired.combat.projectiles![0].damage).toBe(15);
  const changed=updateCombat(fired.gathering,{...fired.combat,upgrades:{attack:0,defense:0}},.01,s.map);expect(changed.combat.projectiles![0].damage).toBe(15);
 });
 it('Forge death cancels research without refund, keeps completed level and removes footprint/builder',()=>{
  let s=ready();const first=startResearch(s.gathering,{attack:1,defense:0,job:null},s.placement,'defense');s={...s,gathering:first.gathering,research:first.research};s.placement.forge!.hp=0;
  const funds={wood:s.gathering.wood,gold:s.gathering.goldBalance};s=updateMatch(s,1);
  expect(s.placement.forge).toBeUndefined();expect(s.research).toEqual({attack:1,defense:0,job:null});expect({wood:s.gathering.wood,gold:s.gathering.goldBalance}).toEqual(funds);expect(s.map.revision).toBe(1);
  expect(createMatch().research).toEqual(createResearch());expect(createMatch().placement.forge).toBeUndefined();
 });
 it('research completion wins no bonus when Forge is killed in the same boundary',()=>{
  let s=ready();s.research={attack:0,defense:0,job:{kind:'attack',remainingSeconds:.1}};s.placement.forge!.hp=.1;s.combat.enemies=[{id:'e',hp:36,position:{x:240,y:416}}];s=updateMatch(s,.1);
  expect(s.placement.forge).toBeUndefined();expect(s.research!.attack).toBe(0);expect(s.research!.job).toBeNull();
 });
});
