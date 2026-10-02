import { describe,expect,it } from 'vitest';
import { createMatch } from './match';
import { updateCombat,type Enemy,type CombatState } from './combat';
import type { Soldier,GatheringState } from './gathering';
import { archerConfig } from '../config/archer';
import { catapultConfig } from '../config/catapult';
import { combatConfig } from '../config/combat';
const unit=(id:string,archetype?:Soldier['archetype'],position={x:300,y:300}):Soldier=>({id,kind:'soldier',archetype,position,target:{...position},hp:archetype==='archer'?archerConfig.hp:archetype==='catapult'?catapultConfig.hp:combatConfig.soldierHP,cargo:0,selected:true,order:{kind:'attack',enemyId:'e1'}});
function fight(units:Soldier[],enemies:Enemy[],until=(c:CombatState)=>c.enemies.length===0){
 const match=createMatch();let g:GatheringState={...match.gathering,units},c:CombatState={baseHP:240,enemies};let seconds=0;
 const map={width:1000,height:1000,tileSize:32,revision:0,obstacles:[]};
 for(let i=0;i<800&&!until(c)&&g.units.length;i++){const next=updateCombat(g,c,.05,map);g=next.gathering;c=next.combat;seconds+=.05;}
 return {g,c,seconds};
}
describe('repeatable army roles',()=>{
 it('melee survives a close single enemy and ends its attack references',()=>{
  const r=fight([unit('s')],[{id:'e1',position:{x:420,y:300},hp:36}]);
  expect(r.c.enemies).toEqual([]);expect(r.g.units[0].hp).toBeGreaterThan(0);expect(r.g.units[0].order.kind).not.toBe('attack');
  console.log('BALANCE melee duel',JSON.stringify({seconds:r.seconds,hp:r.g.units[0].hp}));
 });
 it('ranged support behind melee avoids damage and shortens a sustained fight',()=>{
  const enemy={id:'e1',position:{x:420,y:300},hp:72};
  const solo=fight([unit('s')],[enemy]);const mixed=fight([unit('s'),unit('a','archer',{x:260,y:350})],[enemy]);
  expect(mixed.c.enemies).toEqual([]);expect(mixed.seconds).toBeLessThan(solo.seconds);expect(mixed.g.units.find(u=>u.id==='a')!.hp).toBe(archerConfig.hp);
  expect(mixed.g.units.find(u=>u.id==='s')!.hp).toBeGreaterThan(solo.g.units[0].hp!);
  console.log('BALANCE ranged support',JSON.stringify({soloSeconds:solo.seconds,mixedSeconds:mixed.seconds,units:mixed.g.units.map(u=>({id:u.id,hp:u.hp}))}));
 });
 it('siege removes clustered building targets while sparing an outside target',()=>{
  const target=(id:string,x:number):Enemy=>({id,position:{x,y:300},hp:48,footprint:{x:x-4,y:296,width:8,height:8}});
  const r=fight([unit('c','catapult')],[target('e1',500),target('edge',548),target('outside',560)],c=>!c.enemies.some(e=>e.id==='e1'));
  expect(r.c.enemies.map(e=>e.id)).toEqual(['outside']);expect(r.c.enemies[0].hp).toBe(48);expect(r.g.units[0].hp).toBe(catapultConfig.hp);
  console.log('BALANCE siege cluster',JSON.stringify({seconds:r.seconds,hp:r.g.units[0].hp,outsideHP:r.c.enemies[0].hp}));
 });
});
