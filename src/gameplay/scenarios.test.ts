import { describe,expect,it } from 'vitest';
import { createMatch,updateMatch } from './match';
import { initialScenario } from '../config/scenarios';
import { matchLabels } from '../presentation/hud';
describe('scenario policy isolation',()=>{
 it('starts survival/skirmish with correct physical base, budget and economy',()=>{
  const survival=createMatch('survival'),skirmish=createMatch('skirmish');expect(survival.enemyProduction).toBeUndefined();expect(skirmish.enemyProduction).toMatchObject({wood:80,gold:20});expect(skirmish.combat.enemies[0].kind).toBe('base');expect(skirmish.gathering).toEqual(survival.gathering);
  expect(initialScenario('skirmish')).toBe('skirmish');expect(initialScenario('invalid')).toBe('survival');expect(initialScenario(null)).toBe('survival');
 });
 it('never spawns waves in skirmish, independent of elapsed time/nextWave',()=>{
  let s=createMatch('skirmish');s.gathering.units=[];for(let i=0;i<700;i++)s=updateMatch(s,.1);
  expect(s.waves.nextWave).toBe(0);expect(s.combat.enemies.some(e=>/^enemy-\d+$/.test(e.id))).toBe(false);expect(matchLabels(s).wave).toContain('Skirmish');
 });
 it('wins on enemy-base death with surviving enemy units and does not wait for wave schedule',()=>{
  let s=createMatch('skirmish');s.combat.enemies.push({id:'army',hp:36,position:{x:900,y:300},owner:'enemy'});s.combat.enemies[0].hp=0;s=updateMatch(s,0);
  expect(s.outcome).toBe('victory');expect(s.combat.enemies.some(e=>e.id==='army')).toBe(true);expect(updateMatch(s,100)).toBe(s);
 });
 it.each(['survival','skirmish'] as const)('defeat has priority at simultaneous end conditions in %s',scenario=>{
  const s=createMatch(scenario);s.combat.baseHP=0;s.combat.enemies=[];s.waves.nextWave=3;expect(updateMatch(s,0).outcome).toBe('defeat');
 });
 it('survival cannot win just because it has no enemy-base and still uses finite waves',()=>{
  let s=createMatch('survival');expect(updateMatch(s,0).outcome).toBe('playing');s=updateMatch(s,60);expect(s.waves.nextWave).toBe(1);expect(s.combat.enemies).toHaveLength(1);
  s.waves.nextWave=3;s.combat.enemies=[];expect(updateMatch(s,0).outcome).toBe('victory');
 });
 it('restart fully resets chosen scenario including AI, projectiles, research and orders',()=>{
  let s=createMatch('skirmish');s=updateMatch(s,10);s.research!.attack=1;s.gathering.wood=100;s.combat.baseHP=0;const restarted=createMatch(s.scenario);
  expect(restarted.scenario).toBe('skirmish');expect(restarted.enemyProduction!.acceptedJobs).toBe(0);expect(restarted.enemyAI!.groups).toEqual([]);expect(restarted.research!.attack).toBe(0);expect(restarted.combat.projectiles??[]).toEqual([]);expect(restarted.gathering.wood).toBe(0);
 });
});
