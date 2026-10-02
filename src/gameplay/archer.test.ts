import { describe, expect, it } from 'vitest';
import { archerConfig } from '../config/archer';
import { createMatch, updateMatch } from './match';
import { enqueueProduction, updateQueuedProduction } from './productionQueue';
import { populationState } from './population';
import { updateCombat } from './combat';
import { orderUnits, type Soldier } from './gathering';
import { commandAttackMove } from './attackMove';
import { selectUnitAt } from './selection';
const ready=()=>{const s=createMatch();s.gathering.wood=100;s.gathering.goldBalance=30;s.placement.barracks={x:512,y:384,width:64,height:64};return s;};
const building={kind:'barracks' as const,footprint:{x:512,y:384,width:64,height:64},unitType:'archer' as const};
const archer:Soldier={kind:'soldier',archetype:'archer',id:'unit-4',hp:40,cargo:0,selected:true,position:{x:300,y:300},target:{x:300,y:300},order:{kind:'attack',enemyId:'enemy'}};
describe('archer slice',()=>{
 it('debits both costs, reserves supply and produces an idle unselected archer exactly once after six seconds',()=>{
  const s=ready(),r=enqueueProduction(s.gathering,s.soldierProduction,building);
  expect(r.gathering).toMatchObject({wood:80,goldBalance:20});expect(populationState(r.gathering,s.placement,[r.production]).reserved).toBe(archerConfig.supply);
  const before=updateQueuedProduction(r.gathering,r.production,5.9,building);expect(before.gathering.units).toHaveLength(3);
  const after=updateQueuedProduction(before.gathering,before.production,.1,building);expect(after.gathering.units[3]).toMatchObject({archetype:'archer',hp:40,cargo:0,selected:false,order:{kind:'idle'}});
  expect(updateQueuedProduction(after.gathering,after.production,10,building).gathering.units).toHaveLength(4);
 });
 it('blocks insufficient gold, full supply and incomplete buildings without debit',()=>{
  const s=ready();s.gathering.goldBalance=9;expect(enqueueProduction(s.gathering,s.soldierProduction,building).gathering).toBe(s.gathering);
  s.gathering.goldBalance=30;expect(enqueueProduction(s.gathering,s.soldierProduction,building,{cap:3,used:3,reserved:0}).production).toBe(s.soldierProduction);
  expect(enqueueProduction(s.gathering,s.soldierProduction,{...building,ready:false}).gathering).toBe(s.gathering);
 });
 it('preserves mixed FIFO unit types and their durations across different time steps',()=>{
  for(const steps of [1,11,110]){const s=ready();let r=enqueueProduction(s.gathering,s.soldierProduction,building);r=enqueueProduction(r.gathering,r.production,{...building,unitType:'soldier'});
   for(let i=0;i<steps;i++)r=updateQueuedProduction(r.gathering,r.production,11/steps,building);
   expect(r.gathering.units.slice(3).map(u=>u.kind==='soldier'?u.archetype??'soldier':u.kind)).toEqual(['archer','soldier']);
  }
 });
 it('can be selected/moved but resource clicks preserve combat orders',()=>{
  const s=ready(),selected=selectUnitAt([{...archer,selected:false}],archer.position,24);expect(selected[0].selected).toBe(true);
  expect(orderUnits(selected,{x:600,y:300})[0].order.kind).toBe('move');expect(orderUnits(selected,s.gathering.node.position,s.gathering.node)[0].order).toEqual(archer.order);
 });
 it('fires from range with an interval and never substitutes melee damage',()=>{
  const s=ready();s.gathering.units=[archer];s.combat.enemies=[{id:'enemy',hp:100,position:{x:430,y:300}}];
  const first=updateCombat(s.gathering,s.combat,.1,s.map);expect(first.gathering.units[0].position).toEqual(archer.position);expect(first.combat.projectiles).toHaveLength(1);expect(first.combat.enemies[0].hp).toBe(100);
  const second=updateCombat(first.gathering,first.combat,.1,s.map);expect(second.combat.nextProjectileNumber).toBe(2);
 });
 it('does not fire through terrain or toward hidden targets; dead target clears arrows',()=>{
  const s=ready();s.gathering.units=[archer];s.combat.enemies=[{id:'enemy',hp:100,position:{x:450,y:300}}];
  const map={...s.map,obstacles:[{x:352,y:0,width:32,height:960}]};
  expect(updateCombat(s.gathering,s.combat,.1,map).combat.projectiles??[]).toEqual([]);
  expect(updateCombat(s.gathering,s.combat,.1,s.map,undefined,()=>false).combat.projectiles??[]).toEqual([]);
  const fired=updateCombat(s.gathering,s.combat,.1,s.map);fired.combat.enemies=[];expect(updateCombat(fired.gathering,fired.combat,.1,s.map).combat.projectiles).toEqual([]);
 });
 it('ticks cooldown during attack-move travel and does not burst when resuming',()=>{
  const s=ready();s.gathering.units=commandAttackMove([{...archer,order:{kind:'idle'},attackCooldown:1}],{x:700,y:300},s.map);
  const moved=updateCombat(s.gathering,s.combat,.5,s.map);expect(moved.gathering.units[0]).toMatchObject({attackCooldown:.5});
 });
 it('freezes projectiles at game over and restart has no projectile or cooldown state',()=>{
  const s=ready();s.gathering.units=[archer];s.outcome='defeat';expect(updateMatch(s,1)).toBe(s);expect(createMatch().combat.projectiles??[]).toEqual([]);
 });
});
