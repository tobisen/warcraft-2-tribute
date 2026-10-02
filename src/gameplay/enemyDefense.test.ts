import { describe,expect,it } from 'vitest';
import { createEnemyAI,updateEnemyAI } from './enemyAI';
import { enemyAIConfig } from '../config/enemyAI';
import { createMatch,updateMatch } from './match';
import type { Enemy,CombatState } from './combat';
import type { Soldier,Unit } from './gathering';
const map={width:1280,height:960,tileSize:32,revision:0,obstacles:[{x:960,y:96,width:96,height:96}]};
const base:Enemy={kind:'base',id:'enemy-base',owner:'enemy',hp:240,position:{x:1008,y:144},footprint:map.obstacles[0]};
const enemy=(n:number):Enemy=>({id:`enemy-produced-${n}`,kind:'unit',hp:36,position:{x:928,y:144+n*32},order:{kind:'idle'}});
const threat=(extra:Partial<Soldier>={}):Soldier=>({id:'unit-4',kind:'soldier',hp:60,cargo:0,selected:false,position:{x:880,y:144},target:{x:880,y:144},order:{kind:'idle'},...extra});
const update=(s:ReturnType<typeof createEnemyAI>,c:CombatState,p:Unit[]=[],visible?:()=>boolean)=>updateEnemyAI(s,c,map,{x:400,y:450},0,p,enemyAIConfig,visible);
describe('local enemy defense',()=>{
 it('holds reserve outside base and borrows at most two reachable defenders without duplicate membership',()=>{
  let r=update(createEnemyAI(),{baseHP:240,enemies:[base,enemy(1),enemy(2),enemy(3)]});expect(r.state.reserve).toEqual(['enemy-produced-1']);expect(r.state.groups.flatMap(g=>g.members)).toEqual(['enemy-produced-2','enemy-produced-3']);
  r=update(r.state,r.combat,[threat()]);expect(r.state.defenders).toHaveLength(2);expect(r.state.threatId).toBe('unit-4');
  const protectedIds=new Set([...r.state.reserve,...r.state.defenders.map(d=>d.id)]);expect(r.state.groups.flatMap(g=>g.members).some(id=>protectedIds.has(id))).toBe(false);
  const orders=r.combat.enemies.filter(e=>e.order?.kind==='defend').map(e=>e.order);const repeated=update(r.state,r.combat,[threat()]);expect(repeated.combat.enemies.filter(e=>e.order?.kind==='defend').map(e=>e.order)).toEqual(orders);
  expect(repeated.combat.enemies.find(e=>e.id==='enemy-produced-1')!.order).toBe(r.combat.enemies.find(e=>e.id==='enemy-produced-1')!.order);
 });
 it('preserves valid target, ignores workers/hidden/distant/dead threats and pauses dispatch under threat',()=>{
  let r=update(createEnemyAI(),{baseHP:240,enemies:[base,enemy(1),enemy(2)]},[threat()]);r=update(r.state,r.combat,[threat(),threat({id:'closer',position:{x:920,y:144}})]);expect(r.state.threatId).toBe('unit-4');
  r=update({...r.state,elapsedSeconds:100},r.combat,[threat()]);expect(r.state.groups.every(g=>g.status!=='attack')).toBe(true);
  const worker=createMatch().gathering.units[0];worker.position={x:920,y:144};
  for(const [players,visibility] of [[[worker],undefined],[[threat({hp:0})],undefined],[[threat({position:{x:500,y:144}})],undefined],[[threat()],()=>false]] as const){const clear=update(r.state,r.combat,[...players],visibility);expect(clear.state.threatId).toBeNull();expect(clear.state.defenders).toEqual([]);}
 });
 it('returns borrowed members to their previous group while reserve returns safely home',()=>{
  let r=update(createEnemyAI(),{baseHP:240,enemies:[base,enemy(1),enemy(2),enemy(3)]});const group=r.state.groups[0].id;
  r=update(r.state,r.combat,[threat()]);expect(r.state.defenders.some(d=>d.groupId===group)).toBe(true);
  r=update(r.state,r.combat);expect(r.state.defenders).toEqual([]);expect(r.state.groups.find(g=>g.id===group)!.members).toHaveLength(2);
  expect(r.combat.enemies.find(e=>e.id==='enemy-produced-1')!.order).toEqual({kind:'muster',destination:{x:928,y:144}});
 });
 it('uses real finite budget to replace reserve losses and stops after budget exhaustion',()=>{
  let s=createMatch('siege-test');s.enemyProduction!.cap=1;
  for(let i=0;i<4;i++){s=updateMatch(s,5);const unit=s.combat.enemies.find(e=>e.kind!=='base')!;expect(unit).toBeDefined();expect(s.enemyProduction!.acceptedJobs).toBe(i+1);unit.hp=0;s=updateMatch(s,0);expect(s.enemyAI!.reserve).toEqual([]);}
  expect(s.enemyProduction).toMatchObject({wood:0,gold:0,acceptedJobs:4});s=updateMatch(s,50);expect(s.combat.enemies.some(e=>e.id.startsWith('enemy-produced-'))).toBe(false);expect(s.enemyProduction!.acceptedJobs).toBe(4);
 });
 it('does not pursue a hidden/unreachable raid across an impassable wall',()=>{
  const blocked={...map,obstacles:[...map.obstacles,{x:896,y:0,width:32,height:960}]};
  const e={...enemy(1),position:{x:944,y:240}};
  const result=updateEnemyAI(createEnemyAI(),{baseHP:240,enemies:[base,e]},blocked,{x:400,y:450},0,[threat({position:{x:850,y:240}})]);
  expect(result.state.threatId).toBeNull();expect(result.state.defenders).toEqual([]);
 });
 it('base destruction cancels jobs and releases reserve to attack-group logic with no ghost targets',()=>{
  let s=createMatch('siege-test');s=updateMatch(s,5);expect(s.enemyAI!.reserve).toHaveLength(1);s.combat.enemies.find(e=>e.kind==='base')!.hp=0;s=updateMatch(s,.1);
  expect(s.enemyAI!.reserve).toEqual([]);expect(s.enemyAI!.defenders).toEqual([]);expect(s.enemyProduction!.production.queue).toEqual([]);expect(s.enemyAI!.groups.flatMap(g=>g.members)).toContain('enemy-produced-1');
  expect(createMatch('siege-test').enemyAI).toEqual(createEnemyAI());
 });
 it('cleans orphaned borrowed group metadata when outcome freezes',()=>{
  let s=createMatch('siege-test');s.combat.enemies.push(enemy(1),enemy(2),enemy(3));s.gathering.units=[threat()];const grouped=update(s.enemyAI!,s.combat);const r=update(grouped.state,grouped.combat,s.gathering.units);s.enemyAI=r.state;s.combat=r.combat;
  const remaining=s.enemyAI.groups.flatMap(g=>g.members);for(const e of s.combat.enemies)if(remaining.includes(e.id))e.hp=0;s.combat.baseHP=0;s=updateMatch(s,0);
  expect(s.enemyAI!.groups).toEqual([]);expect(s.enemyAI!.defenders.every(d=>d.groupId===undefined)).toBe(true);
 });
 it('dead target/defender references are removed even when defeat freezes simulation',()=>{
  let s=createMatch('siege-test');s.combat.enemies.push(enemy(1));s.gathering.units=[threat()];const r=update(s.enemyAI!,s.combat,s.gathering.units);s.enemyAI=r.state;s.combat=r.combat;s.gathering.units[0].hp=0;s.combat.baseHP=0;s=updateMatch(s,0);
  expect(s.enemyAI!.threatId).toBeNull();expect(s.combat.enemies.some(e=>e.order?.kind==='defend')).toBe(false);
 });
});
