import { describe,expect,it } from 'vitest';
import { createEnemyAI,updateEnemyAI } from './enemyAI';
import type { WorldMap } from './map';
import { updateCombat } from './combat';
import { createMatch,updateMatch } from './match';
import { enemyAIConfig } from '../config/enemyAI';
import type { CombatState,Enemy } from './combat';
const world:WorldMap={width:1280,height:960,tileSize:32,revision:0,obstacles:[]};
const enemy=(number:number):Enemy=>({id:`enemy-produced-${number}`,kind:'unit',owner:'enemy',hp:36,position:{x:800+number*30,y:300},order:{kind:'idle'}});
const combat=(enemies:Enemy[]):CombatState=>({baseHP:240,enemies});
const update=(s:ReturnType<typeof createEnemyAI>,c:CombatState,delta=0,map=world)=>updateEnemyAI(s,c,map,{x:400,y:450},delta,[],{...enemyAIConfig,reserveCount:0});
describe('enemy muster groups',()=>{
 it('assigns each produced unit once with stable IDs/separate destinations, excluding waves',()=>{
  let r=update(createEnemyAI(),combat([enemy(4),enemy(2),enemy(1),enemy(3),{...enemy(5),id:'enemy-1'}]));
  expect(r.state.groups.map(g=>g.members)).toEqual([['enemy-produced-1','enemy-produced-2'],['enemy-produced-3','enemy-produced-4']]);
  const ids=r.state.groups.flatMap(g=>g.members);expect(new Set(ids).size).toBe(ids.length);expect(r.state.nextGroupNumber).toBe(3);
  expect(r.state.groups[0].destinations[ids[0]]).not.toEqual(r.state.groups[0].destinations[ids[1]]);
  r=update(r.state,r.combat);expect(r.state.groups).toHaveLength(2);expect(r.combat.enemies.find(e=>e.id==='enemy-1')!.order!.kind).toBe('idle');
 });
 it('waits for full/arrived group, then dispatches each once subject to grace and spacing',()=>{
  let r=update(createEnemyAI(),combat([enemy(1),enemy(2),enemy(3),enemy(4)]));
  for(const g of r.state.groups)r.combat.enemies=r.combat.enemies.map(e=>g.destinations[e.id]?{...e,position:{...g.destinations[e.id]}}:e);
  r=update(r.state,r.combat,1);expect(r.state.groups.every(g=>g.status==='ready')).toBe(true);
  r=update(r.state,r.combat,59);expect(r.state.groups.map(g=>g.status)).toEqual(['attack','ready']);expect(r.state.lastDispatchSeconds).toBe(60);
  const first=r.state.groups[0].dispatchedAt;r=update(r.state,r.combat,15);expect(r.state.groups.map(g=>g.status)).toEqual(['attack','attack']);expect(r.state.groups[0].dispatchedAt).toBe(first);expect(r.state.groups[1].dispatchedAt).toBe(75);
  expect(r.combat.enemies.every(e=>e.order?.kind==='attack-move')).toBe(true);
 });
 it('marks understrength/blocked survivors ready by timeout without any new units or budget',()=>{
  let r=update(createEnemyAI(),combat([enemy(1)]),0,{...world,obstacles:[{x:880,y:0,width:32,height:960}]});
  const count=r.combat.enemies.length;r=update(r.state,r.combat,14.99);expect(r.state.groups[0].status).toBe('muster');
  r=update(r.state,r.combat,.01);expect(r.state.groups[0].status).toBe('ready');r=update(r.state,r.combat,45);expect(r.state.groups[0].status).toBe('attack');expect(r.combat.enemies).toHaveLength(count);
 });
 it('removes dead member/destination references and never reuses IDs',()=>{
  let r=update(createEnemyAI(),combat([enemy(1),enemy(2)]));r.combat.enemies=[enemy(3)];r=update(r.state,r.combat);
  expect(r.state.groups).toHaveLength(1);expect(r.state.groups[0]).toMatchObject({id:'enemy-group-2',members:['enemy-produced-3']});expect(Object.keys(r.state.groups[0].destinations)).toEqual(['enemy-produced-3']);
 });
 it('real match units gather around obstacles and two groups dispatch; budget remains exhausted',()=>{
  let s=createMatch('siege-test');for(let i=0;i<770;i++)s=updateMatch(s,.1);
  expect(s.enemyProduction).toMatchObject({wood:0,gold:0,acceptedJobs:4});expect(s.enemyAI!.nextGroupNumber).toBe(3);
  expect(s.enemyAI!.groups.filter(g=>g.status==='attack')).toHaveLength(2);expect(s.enemyAI!.groups[0].dispatchedAt).toBeCloseTo(60);expect(s.enemyAI!.groups[1].dispatchedAt).toBeCloseTo(75);
  expect(s.enemyAI!.groups[0].members.every(id=>s.combat.enemies.find(e=>e.id===id)!.position.x<enemyAIConfig.muster.x)).toBe(true);
 });
 it('restores missing muster navigation without attacking the player during travel',()=>{
  const s=createMatch();s.gathering.units=[];const e={...enemy(1),navigation:undefined,order:{kind:'muster' as const,destination:{x:896,y:320}}};
  const result=updateCombat(s.gathering,combat([e]),2,world);expect(result.combat.enemies[0].position).toEqual({x:896,y:320});expect(result.combat.baseHP).toBe(240);
 });
 it('death cleanup works even when outcome freezes before the AI phase; restart is fresh',()=>{
  let s=createMatch('siege-test');s.combat.enemies.push(enemy(1));const grouped=update(createEnemyAI(),s.combat);s.enemyAI=grouped.state;s.combat=grouped.combat;s.combat.enemies.find(e=>e.id==='enemy-produced-1')!.hp=0;s.combat.baseHP=0;s=updateMatch(s,0);
  expect(s.outcome).toBe('defeat');expect(s.enemyAI!.groups).toEqual([]);expect(createMatch('siege-test').enemyAI).toEqual(createEnemyAI());
 });
});
