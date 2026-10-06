import { advanceProjectiles } from './projectiles';
import { describe,expect,it } from 'vitest';
import { createFog,updateFog } from './fog';
import { entityVisible,knownResource,placementVisible } from './visibility';
import {createClassicMatch as createMatch} from './testHelpers/classicMatch';
import {updateMatch} from './match';
import { visibleMinimapData } from '../presentation/minimap';
import { matchLabels } from '../presentation/hud';
import { orderAttack,updateCombat,type CombatState } from './combat';
import { acquireTargets } from './acquisition';
import type { GatheringState,Soldier } from './gathering';
const soldier=():Soldier=>({kind:'soldier',id:'unit-4',hp:60,cargo:0,selected:true,position:{x:400,y:300},target:{x:400,y:300},order:{kind:'idle'}});
const gathering=():GatheringState=>({...createMatch().gathering,units:[soldier()]});
const enemy=()=>({id:'hidden',hp:36,position:{x:430,y:300}});
describe('shared fog information contract',()=>{
 it('uses unit centers and any visible building cell, including clipped footprint borders',()=>{
  const f=createFog({width:1280,height:960});f.teams.player.visible[4*40+30]=true;
  expect(entityVisible(f,'player',{position:{x:1008,y:144}})).toBe(false);expect(entityVisible(f,'player',{position:{x:1008,y:144},footprint:{x:960,y:96,width:96,height:96}})).toBe(true);expect(entityVisible(f,'enemy',{position:{x:976,y:144}})).toBe(false);
 });
 it('never leaks hidden enemy markers/footprints/HP or hidden resource quantities in HUD/minimap',()=>{
  const s=createMatch('skirmish'),before=visibleMinimapData(s),hud=matchLabels(s);expect(before.markers.some(m=>m.owner==='enemy')).toBe(false);expect(before.terrain.some(r=>r.x===960&&r.y===96)).toBe(false);expect(hud.economy).toContain('node: ?');
  s.combat.enemies[0].hp=1;s.combat.enemies[0].position={x:1100,y:144};s.combat.enemies[0].footprint={x:1088,y:96,width:96,height:96};s.gathering.node.remaining=1;s.gathering.gold!.remaining=1;
  expect(visibleMinimapData(s)).toEqual(before);expect(matchLabels(s)).toEqual(hud);
 });
 it('reveals objects only during current vision and keeps no last-seen enemy data',()=>{
  const s=createMatch('skirmish');s.fog=updateFog(s.fog!,[{id:'scout',owner:'player',position:{x:880,y:144},radius:192}]);expect(visibleMinimapData(s).markers.some(m=>m.id==='enemy-base')).toBe(true);
  s.fog=updateFog(s.fog,[]);expect(visibleMinimapData(s).markers.some(m=>m.owner==='enemy')).toBe(false);expect(s.fog.teams.player.explored.some(Boolean)).toBe(true);
 });
 it('blocks hidden manual attack and acquisition, drops navigation, and causes no hidden damage',()=>{
  const g=gathering(),c:CombatState={enemies:[enemy()],baseHP:240};g.units=orderAttack(g.units,'hidden');g.units[0].navigation={destination:{x:430,y:300},waypoints:[{x:430,y:300}],commandNumber:1,revision:0,status:'moving'};
  const result=updateCombat(g,c,1,undefined,undefined,()=>false,()=>false);expect(result.gathering.units[0].order.kind).toBe('idle');expect(result.gathering.units[0].navigation).toBeUndefined();expect(result.gathering.units[0].position).toEqual({x:400,y:300});expect(result.combat.enemies[0].hp).toBe(36);expect(acquireTargets(gathering().units,[enemy()],undefined,()=>false)[0].order.kind).toBe('idle');
 });
 it('losing auto-target vision resumes attack-move destination instead of hidden tracking',()=>{
  const u={...soldier(),order:{kind:'attack' as const,enemyId:'hidden'},autoOrigin:{x:400,y:300},attackMoveTarget:{x:500,y:300}};
  const next=acquireTargets([u],[enemy()],undefined,()=>false)[0];expect(next.order.kind).toBe('move');expect(next.target).toEqual({x:500,y:300});
 });
 it('enemy defense drops hidden targets regardless of their new position',()=>{
  const run=(position:{x:number;y:number})=>{const g=gathering();g.units[0].position=position;return updateCombat(g,{baseHP:240,enemies:[{...enemy(),order:{kind:'defend',targetId:'unit-4'}}]},1,undefined,undefined,()=>false,()=>false).combat.enemies[0];};
  expect(run({x:430,y:300})).toEqual(run({x:1000,y:800}));expect(run({x:430,y:300}).order?.kind).toBe('idle');
 });
 it('enemy explores a configured base goal without hidden player-unit tracking/damage',()=>{
  const run=(position:{x:number;y:number})=>{const g=gathering();g.units[0].position=position;return updateCombat(g,{baseHP:240,enemies:[{...enemy(),position:{x:740,y:60}}]},1,undefined,undefined,()=>false,()=>false);};
  const a=run({x:750,y:60}),b=run({x:1000,y:800});expect(a.combat.enemies[0].position).toEqual(b.combat.enemies[0].position);expect(a.gathering.units[0].hp).toBe(60);expect(a.combat.baseHP).toBe(240);
 });
 it('team vision controls already-fired impacts even after shooter death, and hidden impact is discarded',()=>{
  const g=gathering();g.units=[];const c:CombatState={baseHP:240,enemies:[{id:'target',kind:'base',hp:36,position:{x:80,y:80},footprint:{x:64,y:64,width:32,height:32}}],projectiles:[{id:'arrow-1',shooterId:'dead',targetId:'target',position:{x:48,y:80},destination:{x:80,y:80},speed:300,remainingLife:2,damage:12,hitRadius:16}]};
  const visible=updateCombat(g,c,1,undefined,undefined,()=>true,()=>false,()=>true);expect(visible.combat.enemies[0].hp).toBe(24);
  const hidden=updateCombat(g,c,1,undefined,undefined,()=>false,()=>false,()=>false);expect(hidden.combat.enemies[0].hp).toBe(36);expect(hidden.combat.projectiles).toEqual([]);
 });
 it('siege flight cannot reveal whether a hidden initial target moved or died',()=>{
  const p={id:'stone',targetId:'hidden',position:{x:100,y:100},destination:{x:200,y:100},speed:100,remainingLife:2,damage:24,hitRadius:0,splashRadius:48};
  const hidden=advanceProjectiles([p],[{id:'hidden',hp:36,position:{x:1100,y:800}}],.5,undefined,()=>false),dead=advanceProjectiles([p],[],.5,undefined,()=>false);expect(hidden).toEqual(dead);expect(hidden.projectiles[0].position).toEqual({x:150,y:100});expect(hidden.damage.size).toBe(0);
 });
 it('requires whole-footprint current vision before placement, but resource memory only explored',()=>{
  let f=updateFog(createFog({width:1280,height:960}),[{id:'worker',owner:'player',position:{x:600,y:176},radius:160}]);expect(knownResource(f,{x:650,y:180})).toBe(true);expect(placementVisible(f,{x:608,y:160,width:64,height:64})).toBe(true);expect(placementVisible(f,{x:960,y:96,width:64,height:64})).toBe(false);
  f=updateFog(f,[]);expect(knownResource(f,{x:650,y:180})).toBe(true);expect(placementVisible(f,{x:608,y:160,width:64,height:64})).toBe(false);
 });
 it('actual match update clears hidden explicit target and restart resets both teams/markers',()=>{
  let s=createMatch('skirmish');s.gathering.units.push({...soldier(),position:{x:500,y:500},order:{kind:'attack',enemyId:'enemy-base'}});s=updateMatch(s,.1);expect(s.gathering.units.find(u=>u.id==='unit-4')!.order.kind).toBe('idle');expect(s.combat.enemies[0].hp).toBe(260);expect(visibleMinimapData(createMatch('skirmish')).markers.some(m=>m.owner==='enemy')).toBe(false);
 });
});

it('retains the legitimate exploration route cache while a hidden base goal is approached',()=>{
 const s=createMatch('skirmish');s.gathering.units=[];s.combat.enemies=[s.combat.enemies[0],{id:'wave-fixture',hp:36,position:{x:740,y:60},order:{kind:'attack-move',destination:{x:400,y:450}}}];const next=updateMatch(s,.1),enemy=next.combat.enemies.find(e=>e.id==='wave-fixture')!;expect(enemy.navigation?.targetId).toBe('explore-goal');expect(enemy.navigation?.waypoints.length).toBeGreaterThan(0);expect(next.combat.baseHP).toBe(240);
});
