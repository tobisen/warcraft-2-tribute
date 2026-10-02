import { describe,expect,it } from 'vitest';
import { difficultyProfiles,initialDifficulty,type Difficulty } from '../config/difficulty';
import { createMatch,updateMatch } from './match';
import { matchLabels } from '../presentation/hud';
const choices:Difficulty[]=['easy','normal','hard'];
describe('bounded difficulty profiles',()=>{
 it('validates initial choice and isolates mutable states/configs',()=>{
  expect(initialDifficulty('invalid')).toBe('normal');expect(initialDifficulty('easy')).toBe('easy');expect(initialDifficulty('hard')).toBe('hard');
  const before=JSON.stringify(difficultyProfiles),a=createMatch('skirmish','easy'),b=createMatch('skirmish','easy');a.enemyProduction!.wood=0;a.enemyAI!.reserve.push('invalid');a.map.obstacles[0].x=0;
  expect(b.enemyProduction!.wood).toBe(40);expect(b.enemyAI!.reserve).toEqual([]);expect(JSON.stringify(difficultyProfiles)).toBe(before);
 });
 it.each(choices)('%s survival uses only its configured schedule and keeps player economy/stats',difficulty=>{
  let s=createMatch('survival',difficulty);const p=difficultyProfiles[difficulty];s=updateMatch(s,p.waves[0].atSeconds-.001);expect(s.waves.nextWave).toBe(0);
  s=updateMatch(s,.001);expect(s.combat.enemies).toHaveLength(p.waves[0].count);expect(s.enemyProduction).toBeUndefined();expect(s.gathering.wood).toBe(0);expect(s.gathering.node.remaining).toBe(400);expect(s.combat.baseHP).toBe(240);expect(matchLabels(s).wave).toContain('Våg 1 / 3');
 });
 it.each(choices)('%s skirmish spends finite budget once, honors time/cap and dispatch grace',difficulty=>{
  let s=createMatch('skirmish',difficulty,{player:'crown',enemy:'crown'});const p=difficultyProfiles[difficulty];s=updateMatch(s,p.durationSeconds-.001);expect(s.combat.enemies.filter(e=>e.kind!=='base')).toHaveLength(0);
  s=updateMatch(s,.001);expect(s.combat.enemies.filter(e=>e.kind!=='base')).toHaveLength(1);expect(s.gathering.wood).toBe(0);expect(s.gathering.goldBalance).toBe(0);expect(s.enemyAI!.lastDispatchSeconds).toBeNull();
  for(let n=0;n<350;n++)s=updateMatch(s,.1);
  const e=s.enemyProduction!,units=s.combat.enemies.filter(e=>e.kind!=='base'),jobs=e.production.queue??[];
  expect(units.length+jobs.length).toBeLessThanOrEqual(p.cap);expect(e.wood+e.acceptedJobs*20).toBe(p.budget.wood);expect(e.gold+e.acceptedJobs*5).toBe(p.budget.gold);expect(e.acceptedJobs).toBe(p.budget.wood/20);expect(s.waves.nextWave).toBe(0);
  expect(s.enemyAI!.lastDispatchSeconds).toBeNull();
  while(s.waves.elapsedSeconds<p.ai.firstAttackSeconds-.001)s=updateMatch(s,Math.min(.1,p.ai.firstAttackSeconds-.001-s.waves.elapsedSeconds));
  expect(s.enemyAI!.lastDispatchSeconds).toBeNull();s=updateMatch(s,.002);expect(s.enemyAI!.lastDispatchSeconds).toBeCloseTo(p.ai.firstAttackSeconds,2);
  expect(s.enemyAI!.groups.filter(g=>g.status==='attack')).toHaveLength(1);
  const restart=createMatch(s.scenario,s.difficulty);expect(restart.difficulty).toBe(difficulty);expect(restart.enemyProduction!.wood).toBe(p.budget.wood);expect(restart.enemyProduction!.gold).toBe(p.budget.gold);expect(restart.enemyProduction!.acceptedJobs).toBe(0);
 });
 it('easy/normal/hard provide increasing bounded pressure without combat stat cheats',()=>{
  expect(choices.map(d=>difficultyProfiles[d].budget.wood)).toEqual([40,80,120]);expect(choices.map(d=>difficultyProfiles[d].durationSeconds)).toEqual([7,5,4]);expect(choices.map(d=>difficultyProfiles[d].waves.reduce((n,w)=>n+w.count,0))).toEqual([4,6,9]);expect(choices.map(d=>difficultyProfiles[d].ai.firstAttackSeconds)).toEqual([75,60,50]);
 });
});
