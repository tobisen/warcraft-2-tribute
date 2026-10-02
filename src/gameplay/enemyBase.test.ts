import { describe,expect,it } from 'vitest';
import { createMatch,updateMatch } from './match';
import { enemyBaseConfig } from '../config/scenarios';
import { enemyAt } from './combat';
import { findRoute } from './navigation';
import { selectPlayerTarget,allowsProduction } from './buildingSelection';
import type { Soldier } from './gathering';
describe('enemy base scenario',()=>{
 it('exists only in the configured siege scenario, blocks body/navigation and is an enemy target',()=>{
  const plain=createMatch(),siege=createMatch('siege-test');expect(plain.combat.enemies).toEqual([]);
  const base=siege.combat.enemies[0];expect(base).toMatchObject({kind:'base',owner:'enemy',hp:enemyBaseConfig.hp});expect(enemyAt(siege.combat.enemies,base.position)).toBe(base);
  expect(findRoute(siege.map,{x:900,y:144},base.position).ok).toBe(false);
  const selected=selectPlayerTarget(siege.gathering.units,base.position,siege.gathering.base,siege.placement.barracks,24);expect(selected.building).toBeNull();expect(allowsProduction(selected.building,'base',true,true)).toBe(false);
 });
 it.each([undefined,'archer','catapult'] as const)('can be destroyed by %s with reachable approach and full cleanup',archetype=>{
  let s=createMatch('siege-test');const base=s.combat.enemies[0];base.hp=20;
  const unit:Soldier={id:'unit-4',kind:'soldier',archetype,hp:80,cargo:0,selected:true,position:{x:880,y:144},target:{x:880,y:144},order:{kind:'attack',enemyId:base.id}};s.gathering.units=[unit];
  const foot={...base.footprint!};for(let i=0;i<100&&s.combat.enemies.some(e=>e.id===base.id);i++)s=updateMatch(s,.1);
  expect(s.combat.enemies.some(e=>e.id===base.id)).toBe(false);expect(s.map.obstacles).not.toContainEqual(foot);expect(s.map.revision).toBe(1);expect(s.gathering.units[0].order.kind).not.toBe('attack');
  expect(s.outcome).toBe('playing');expect(s.combat.projectiles??[]).toEqual([]);
 });
 it('base destruction never prematurely wins waves; living base does not change completed-wave victory',()=>{
  let s=createMatch('siege-test');s.combat.enemies[0].hp=0;expect(updateMatch(s,0).outcome).toBe('playing');
  s=createMatch('siege-test');s.waves.nextWave=3;expect(updateMatch(s,0).outcome).toBe('victory');
  s=createMatch('siege-test');s.waves.nextWave=3;s.combat.baseHP=0;expect(updateMatch(s,0).outcome).toBe('defeat');
 });
 it('restart creates an isolated full base and original scenario state',()=>{
  const previous=createMatch('siege-test');previous.combat.enemies[0].hp=0;const fresh=createMatch('siege-test');expect(fresh.combat.enemies[0].hp).toBe(240);expect(fresh.map.revision).toBe(0);expect(fresh.combat.enemies[0].footprint).not.toBe(previous.combat.enemies[0].footprint);
 });
});
