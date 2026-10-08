import { describe, expect, it } from 'vitest';
import { catapultConfig } from '../config/catapult';
import { advanceProjectiles, type Projectile } from './projectiles';
import { createMatch, updateMatch } from './match';
import { commandMappedMove, findRoute, updateMappedMove } from './navigation';
import { enqueueProduction, updateQueuedProduction } from './productionQueue';
import { populationState } from './population';
import { bodyFits, overlaps } from './map';
import { unitBody } from './spawning';
import { orderUnits, type Soldier } from './gathering';
import { updateCombat } from './combat';
const cat:Soldier={kind:'soldier',archetype:'catapult',id:'unit-4',hp:80,cargo:0,selected:true,position:{x:300,y:300},target:{x:300,y:300},order:{kind:'idle'}};
const shot:Projectile={id:'siege-1',targetId:'e1',position:{x:100,y:100},destination:{x:200,y:100},speed:100,remainingLife:3,damage:24,hitRadius:0,splashRadius:48};
const enemy=(id:string,x:number,y=100)=>({id,hp:100,position:{x,y}});
describe('catapult splash and body',()=>{
 it('applies flat splash to multiple visible enemies including radius edge, once only',()=>{
  const targets=[enemy('e1',200),enemy('edge',248),enemy('outside',248.001),enemy('hidden',210)];
  const r=advanceProjectiles([shot],targets,1,undefined,e=>e.id!=='hidden');expect([...r.damage]).toEqual([['e1',24],['edge',24]]);
  expect(advanceProjectiles(r.projectiles,targets,1).damage.size).toBe(0);
 });
 it('uses distance to enemy building footprint and retains siege shot after initial target dies',()=>{
  const building={...enemy('building',280),footprint:{x:248,y:80,width:64,height:64}};
  const r=advanceProjectiles([shot],[building],1);expect(r.damage.get('building')).toBe(24);expect(r.projectiles).toEqual([]);
  const pre=advanceProjectiles([shot],[],.5);expect(pre.projectiles).toHaveLength(1);
  expect(advanceProjectiles(pre.projectiles,[enemy('other',200)],.5).damage.get('other')).toBe(24);
 });
 it('cannot damage player units or buildings because impacts only accept enemy targets',()=>{
  const s=createMatch();s.gathering.units=[{...cat,position:{x:200,y:100}}];s.gathering.base={x:200,y:100};s.combat.projectiles=[shot];s.combat.enemies=[{...enemy('e1',200),footprint:{x:192,y:92,width:16,height:16}}];
  const r=updateCombat(s.gathering,s.combat,1);expect(r.gathering.units[0].hp).toBe(80);expect(r.combat.baseHP).toBe(240);expect(r.combat.enemies[0].hp).toBeLessThan(100);
 });
 it('uses 40 px clearance through narrow passage and for revision replanning',()=>{
  const map={width:400,height:320,tileSize:32,revision:0,obstacles:[{x:160,y:0,width:32,height:144},{x:160,y:176,width:32,height:144}]};
  expect(findRoute(map,{x:100,y:160},{x:300,y:160}).ok).toBe(true);
  const unit={...cat,position:{x:100,y:160},target:{x:100,y:160}};
  const commanded=commandMappedMove([unit],{x:300,y:160},map)[0];expect(commanded.navigation!.status).toBe('blocked');
  expect(updateMappedMove(commanded,{...map,revision:1},1).position).toEqual(unit.position);
 });
 it('debits both costs, reserves two supply and spawns safely after ten seconds',()=>{
  const s=createMatch();s.gathering.wood=100;s.gathering.goldBalance=50;s.placement.barracks={x:512,y:384,width:64,height:64};s.map.obstacles.push(s.placement.barracks);
  const b={kind:'barracks' as const,unitType:'catapult' as const,producer:'siegeWorks' as const,technology:{baseLevel:2,buildings:['forge' as const,'siegeWorks' as const],research:{}},footprint:s.placement.barracks};
  const r=enqueueProduction(s.gathering,s.soldierProduction,b,populationState(s.gathering,s.placement,[s.production,s.soldierProduction]));
  expect(r.gathering).toMatchObject({wood:60,goldBalance:30});expect(populationState(r.gathering,s.placement,[r.production]).reserved).toBe(2);
  const result=updateQueuedProduction(r.gathering,r.production,10,b,{map:s.map,enemies:[]});const spawned=result.gathering.units[3];
  expect(spawned).toMatchObject({archetype:'catapult',hp:80,selected:false,cargo:0,order:{kind:'idle'}});
  expect(bodyFits(s.map,spawned.position,20)).toBe(true);expect(overlaps(unitBody(spawned.position,40),s.placement.barracks)).toBe(false);
  expect(populationState(result.gathering,s.placement,[result.production]).used).toBe(5);
  expect(orderUnits([{...spawned,selected:true}],s.gathering.node.position,s.gathering.node)[0].order.kind).toBe('idle');
 });
 it('blocks two-supply training with only one slot and preserves currency',()=>{
  const s=createMatch();s.gathering.wood=100;s.gathering.goldBalance=50;
  const b={kind:'barracks' as const,unitType:'catapult' as const,footprint:{x:512,y:384,width:64,height:64}};
  expect(enqueueProduction(s.gathering,s.soldierProduction,b,{cap:8,used:7,reserved:0}).gathering).toBe(s.gathering);
 });
 it('shoots a stationary building and clears its footprint after death, retaining defeat precedence',()=>{
  let s=createMatch();s.gathering.units=[{...cat,order:{kind:'attack',enemyId:'building'}}];
  const footprint={x:448,y:272,width:64,height:64};s.map.obstacles.push(footprint);s.combat.enemies=[{id:'building',position:{x:480,y:304},hp:1,footprint}];
  for(let i=0;i<30&&s.combat.enemies.length;i++)s=updateMatch(s,.1);
  expect(s.combat.enemies).toEqual([]);expect(s.map.obstacles).not.toContainEqual(footprint);
  s.combat.baseHP=0;s.waves.nextWave=3;expect(updateMatch(s,0).outcome).toBe('defeat');
 });
});
