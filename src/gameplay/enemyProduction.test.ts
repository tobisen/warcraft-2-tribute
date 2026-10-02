import { describe,expect,it } from 'vitest';
import { createMatch,updateMatch,type MatchState } from './match';
import { createEnemyProduction,updateEnemyProduction } from './enemyProduction';
import { spawnCandidates,unitBody } from './spawning';
import { overlaps } from './map';
import { enqueueProduction } from './productionQueue';
const ready=()=>createMatch('siege-test','normal',{player:'crown',enemy:'crown'});
const tick=(s:ReturnType<typeof ready>,delta:number):MatchState=>{const r=updateEnemyProduction(s.enemyProduction!,s.combat,s.gathering,s.map,delta);return {...s,combat:r.combat,enemyProduction:r.state};};
describe('finite enemy production',()=>{
 it('debits every accepted job once and preserves player economy',()=>{
  const s=ready(),first=tick(s,0);expect(first.enemyProduction).toMatchObject({wood:20,gold:5,acceptedJobs:3});expect(first.enemyProduction!.production.queue).toHaveLength(3);
  expect(tick(first,0).enemyProduction!.acceptedJobs).toBe(3);expect(tick(first,1).enemyProduction).toMatchObject({wood:20,gold:5});expect(first.gathering).toBe(s.gathering);
 });
 it.each([1,20,200])('produces exactly four unique enemy-owned IDs from finite budget over %s steps',steps=>{
  let s=ready();for(let i=0;i<steps;i++)s=tick(s,20/steps);
  const produced=s.combat.enemies.filter(e=>e.kind!=='base');expect(produced.map(e=>e.id)).toEqual(['enemy-produced-1','enemy-produced-2','enemy-produced-3','enemy-produced-4']);expect(produced.every(e=>e.owner==='enemy'&&e.hp===36)).toBe(true);
  expect(s.enemyProduction).toMatchObject({wood:0,gold:0,acceptedJobs:4});expect(s.enemyProduction!.production.queue).toEqual([]);
  expect(tick(s,100).combat.enemies).toHaveLength(5);
 });
 it('waits at cap and replaces a loss only with actual remaining budget',()=>{
  let s=ready();s.enemyProduction!.cap=1;s=tick(s,10);expect(s.combat.enemies).toHaveLength(2);expect(s.enemyProduction).toMatchObject({wood:60,gold:15,acceptedJobs:1});
  s.combat.enemies=s.combat.enemies.filter(e=>e.kind==='base');s=tick(s,5);expect(s.combat.enemies[1].id).toBe('enemy-produced-2');expect(s.enemyProduction!.wood).toBe(40);
 });
 it('waits safely behind blocked spawn, without duplicate debit/spawn, then spawns once when freed',()=>{
  let s=ready();const base=s.combat.enemies[0],candidates=spawnCandidates(s.map,base.footprint!,'barracks');
  s.gathering.units=candidates.map((position,i)=>({id:`blocker-${i}`,kind:'soldier',hp:60,cargo:0,selected:false,position,target:{...position},order:{kind:'idle'}}));
  s=tick(s,5);expect(s.enemyProduction!.production.remainingSeconds).toBe(0);expect(s.combat.enemies).toHaveLength(1);const funds=s.enemyProduction!.wood;
  s=tick(s,10);expect(s.enemyProduction!.wood).toBe(funds);expect(s.combat.enemies).toHaveLength(1);
  s.gathering.units=s.gathering.units.filter(u=>!overlaps(unitBody(u.position,24),unitBody(candidates[0],24)));s=tick(s,0);expect(s.combat.enemies).toHaveLength(2);expect(s.combat.enemies[1].position).toEqual(candidates[0]);
 });
 it('runs player/enemy production simultaneously without ID/currency contamination',()=>{
  let s=ready();s.gathering.wood=20;const player=enqueueProduction(s.gathering,s.production);s={...s,gathering:player.gathering,production:player.production};s=updateMatch(s,5);
  expect(s.gathering.units).toHaveLength(4);expect(s.gathering.units[3].id).toBe('unit-4');expect(s.gathering.wood).toBe(0);
  expect(s.combat.enemies.filter(e=>e.kind!=='base')).toHaveLength(1);expect(s.enemyProduction!.wood).toBe(20);
 });
 it('shared jobs snapshot explicit enemy-config cost/time without mutating player defaults',()=>{
  const s=ready(),b={kind:'barracks' as const,footprint:s.combat.enemies[0].footprint!,jobCost:{wood:7,gold:2},durationSeconds:9};
  s.gathering.wood=20;s.gathering.goldBalance=5;
  const r=enqueueProduction(s.gathering,s.soldierProduction,b);expect(r.gathering).toMatchObject({wood:13,goldBalance:3});expect(r.production.queue![0]).toMatchObject({cost:{wood:7,gold:2},durationSeconds:9});
  const plain=enqueueProduction(s.gathering,s.soldierProduction,{kind:'barracks',footprint:b.footprint});expect(plain.production.remainingSeconds).toBe(5);
 });
 it('base death removes every reservation without refund or later spawn and reset restores all budget',()=>{
  let s=tick(ready(),1);s.combat.enemies[0].hp=0;const funds=s.enemyProduction!.wood;s=updateMatch(s,20);
  expect(s.enemyProduction!.wood).toBe(funds);expect(s.enemyProduction!.production.queue).toEqual([]);expect(s.combat.enemies).toEqual([]);
  const fresh=ready();expect(fresh.enemyProduction).toEqual({...createEnemyProduction(),durationSeconds:5});expect(createMatch().enemyProduction).toBeUndefined();
 });
});
