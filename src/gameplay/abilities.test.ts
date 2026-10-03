import {describe,it,expect} from 'vitest';
import {abilityReady,useAbility,advanceAbilities} from './abilities';
import {createMatch,updateMatch} from './match';
import {factionsForPlayer} from '../config/factions';
import {encodeSave,decodeSave} from './save';
import {updateCombat} from './combat';
import {matchFog} from './matchFog';
import type {Soldier} from './gathering';
const view={camera:{x:0,y:0},building:null};
function fixture(id:'crown'|'clans'='crown'){
 const m=createMatch('survival','normal',factionsForPlayer(id));
 const unit:Soldier={id:'unit-4',owner:'player',kind:'soldier',position:{x:400,y:300},target:{x:400,y:300},selected:true,hp:id==='clans'?66:60,cargo:0,order:{kind:'attack',enemyId:'enemy-1'}};
 m.gathering.units=[...m.gathering.units,unit];m.production.nextUnitNumber=5;m.soldierProduction.nextUnitNumber=5;
 m.combat.enemies=[{id:'enemy-1',owner:'enemy',position:{x:424,y:300},hp:36}];m.waves.nextEnemyNumber=2;m.fog=matchFog(m);return m;
}
describe('faction self abilities',()=>{
 it('activates only selected ready living combat units without changing work, selection or orders',()=>{
  const m=fixture();m.gathering.units[0].selected=true;const worker=m.gathering.units[0],soldier=m.gathering.units[3];const g=useAbility(m.gathering);
  expect(g.units[0]).toBe(worker);expect(g.units[3]).toMatchObject({selected:true,order:soldier.order,ability:{activeSeconds:5,cooldownSeconds:20}});expect(useAbility(g)).toBe(g);expect(useAbility(m.gathering,false)).toBe(m.gathering);
  const next=advanceAbilities(g,5);expect((next.units[3] as Soldier).ability).toEqual({activeSeconds:0,cooldownSeconds:15});expect(abilityReady(next.units[3])).toBe(false);
  const ready=advanceAbilities(next,15);expect(abilityReady(ready.units[3])).toBe(true);expect(useAbility(ready).units[3]).toMatchObject({ability:{activeSeconds:5,cooldownSeconds:20}});
 });
 it('crown defense and clan melee damage multiply upgrades, with unselected units unaffected',()=>{
  for(const id of ['crown','clans'] as const){const m=fixture(id);m.gathering=useAbility(m.gathering);m.combat.upgrades={attack:1,defense:1};const f=updateCombat(m.gathering,m.combat,1);expect(f.combat.enemies[0].hp).toBeCloseTo(36-(id==='clans'?20*1.3*1.25:18*1.25));expect(f.gathering.units.find(u=>u.id==='unit-4')!.hp).toBeCloseTo((id==='clans'?66:60)-6*(id==='crown'?.75*.75:.8));}
 });
 it('ranged damage is fixed at firing and shots at exact expiry receive no expired bonus',()=>{
  const m=fixture('clans'),u=m.gathering.units[3] as Soldier;u.archetype='archer';u.hp=45;m.combat.enemies[0].position={x:540,y:300};m.gathering=useAbility(m.gathering);
  const first=updateCombat(m.gathering,m.combat,.01,undefined,undefined,()=>true);expect(first.combat.projectiles?.[0].damage).toBe(15);
  const expired={...m.gathering,units:m.gathering.units.map(u=>u.kind==='soldier'?{...u,ability:{activeSeconds:.1,cooldownSeconds:15.1},attackCooldown:.1}:u)};
  const boundary=updateCombat(expired,m.combat,.1,undefined,undefined,()=>true);expect(boundary.combat.projectiles?.[0].damage).toBe(12);
 });
 it.each([1,10,100])('match splits effect expiry across %s time steps and freezes pause/game over',steps=>{
  let m=fixture('clans');m.combat.enemies=[];m.gathering.units[3].order={kind:'idle'};m.gathering=useAbility(m.gathering);for(let i=0;i<steps;i++)m=updateMatch(m,6/steps);expect((m.gathering.units[3] as Soldier).ability?.activeSeconds).toBe(0);expect((m.gathering.units[3] as Soldier).ability?.cooldownSeconds).toBeCloseTo(14);
  m.paused=true;expect(updateMatch(m,100)).toBe(m);m.paused=false;m.outcome='defeat';expect(updateMatch(m,100)).toBe(m);
 });
 it('matches continuous melee damage over expiry for coarse and fine steps',()=>{
  function run(steps:number){let m=fixture('clans');m.combat.enemies[0].hp=10000;m.gathering.units=m.gathering.units.filter(u=>u.kind==='soldier');m.gathering.units[0].hp=10000;m.gathering=useAbility(m.gathering);m.map.obstacles=[];for(let i=0;i<steps;i++)m=updateMatch(m,6/steps);return m.combat.enemies[0].hp;}
  expect(run(1)).toBeCloseTo(10000-20*(5*1.25+1));expect(run(120)).toBeCloseTo(run(1));
 });
 it('defense expires at the same boundary over coarse and fine steps and siege snapshots its bonus',()=>{
  function run(steps:number){let m=fixture('crown');m.combat.enemies[0].hp=10000;m.gathering.units=m.gathering.units.filter(u=>u.kind==='soldier');m.gathering.units[0].hp=10000;m.gathering=useAbility(m.gathering);m.map.obstacles=[];for(let i=0;i<steps;i++)m=updateMatch(m,6/steps);return m.gathering.units[0].hp!;}
  expect(run(1)).toBeCloseTo(10000-6*(5*.75+1));expect(run(120)).toBeCloseTo(run(1));
  const m=fixture('clans'),u=m.gathering.units[3] as Soldier;u.archetype='catapult';u.hp=80;m.combat.enemies[0].position={x:550,y:300};m.gathering=useAbility(m.gathering);expect(updateCombat(m.gathering,m.combat,.01,undefined,undefined,()=>true).combat.projectiles?.[0].damage).toBe(32.5);
 });
 it('fog-hidden targets remain unavailable while a self buff reveals no enemy information',()=>{
  const m=fixture('clans');m.combat.enemies[0].position={x:1100,y:900};m.gathering=useAbility(m.gathering);const fight=updateCombat(m.gathering,m.combat,1,undefined,undefined,()=>false,()=>false);expect(fight.combat.enemies[0].hp).toBe(36);expect(fight.combat.projectiles??[]).toEqual([]);expect(fight.gathering.units.find(u=>u.id==='unit-4')?.order.kind).toBe('idle');
 });
 it('save preserves timers without wall time, legacy config has no ability, restart is fresh and invalid timers are rejected',()=>{
  const m=fixture('clans');m.gathering=advanceAbilities(useAbility(m.gathering),2);m.paused=true;const json=encodeSave(m,view),loaded=decodeSave(json);expect(loaded.ok).toBe(true);if(!loaded.ok)return;expect((loaded.match.gathering.units[3] as Soldier).ability).toEqual({activeSeconds:3,cooldownSeconds:18});expect(updateMatch(loaded.match,1000)).toBe(loaded.match);expect(createMatch('survival','normal',m.factions).gathering.units.every(u=>!('ability' in u))).toBe(true);
  for(const bad of [{activeSeconds:6,cooldownSeconds:21},{activeSeconds:3,cooldownSeconds:3},{activeSeconds:-1,cooldownSeconds:0}]){const d=JSON.parse(json);d.state.gathering.units[3].ability=bad;expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}
  const d=JSON.parse(json);d.configVersion='tribute-config-3';delete d.state.statLedger;expect(decodeSave(JSON.stringify(d)).ok).toBe(false);delete d.state.gathering.units[3].ability;expect(decodeSave(JSON.stringify(d)).ok).toBe(true);
 });
});
