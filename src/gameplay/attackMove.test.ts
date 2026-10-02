import { describe, expect, it } from 'vitest';
import { commandAttackMove } from './attackMove';
import { updateCombat, orderAttack, type CombatState } from './combat';
import { orderUnits, updateGathering, type GatheringState, type Soldier } from './gathering';
import { commandGroupMove } from './groupMovement';
import { stopSelected } from './orders';
import { createMatch } from './match';
import type { WorldMap } from './map';
const map:WorldMap={width:800,height:600,tileSize:32,revision:0,obstacles:[]};
const soldier=(extra:Partial<Soldier>={}):Soldier=>({id:'unit-1',kind:'soldier',hp:60,cargo:0,selected:true,position:{x:100,y:300},target:{x:100,y:300},order:{kind:'idle'},...extra});
const economy=(units:GatheringState['units']=[soldier()]):GatheringState=>({units,base:{x:500,y:500},wood:0,node:{id:'wood',position:{x:650,y:500},remaining:100}});
const combat=(enemies:CombatState['enemies']=[]):CombatState=>({baseHP:240,enemies});
function tick(g:GatheringState,c:CombatState,delta=.1,visible?:()=>boolean){return updateCombat(updateGathering(g,delta,map),c,delta,map,undefined,visible);}
describe('attack-move',()=>{
 it('uses separate group destinations only for selected soldiers, preserving worker work',()=>{
  const worker=createMatch().gathering.units[0];worker.selected=true;
  const units=[soldier(),soldier({id:'unit-2'}),soldier({id:'unselected',selected:false}),worker];
  const result=commandAttackMove(units,{x:600,y:300},map);
  expect(result[0]).toMatchObject({attackMoveTarget:result[0].target,order:{kind:'move'}});
  expect(result[1].target).not.toEqual(result[0].target);expect(result[2]).toBe(units[2]);expect(result[3]).toBe(worker);
  expect(commandAttackMove(units,{x:600,y:300},map,false)).toBe(units);
 });
 it('spends travel delta only once without enemies',()=>{
  const g=economy(commandAttackMove([soldier()],{x:600,y:300},map));
  const next=tick(g,combat(),1);expect(next.gathering.units[0].position).toEqual({x:260,y:300});
 });
 it('engages multiple enemies then reaches the original destination without more input',()=>{
  let g=economy(commandAttackMove([soldier()],{x:600,y:300},map)),c=combat([{id:'e1',hp:10,position:{x:240,y:300}},{id:'e2',hp:10,position:{x:300,y:300}}]);
  let engaged=false;
  for(let i=0;i<100;i++){const next=tick(g,c);g=next.gathering;c=next.combat;engaged ||=g.units[0]?.order.kind==='attack';}
  expect(engaged).toBe(true);expect(c.enemies).toEqual([]);expect(g.units[0]).toMatchObject({position:{x:600,y:300},order:{kind:'idle'},attackMoveTarget:undefined});
 });
 it('resumes after hidden targets and avoids inaccessible targets',()=>{
  let g=economy(commandAttackMove([soldier()],{x:600,y:300},map)),c=combat([{id:'e',hp:100,position:{x:200,y:300}}]);
  const first=tick(g,c);expect(first.gathering.units[0].order.kind).toBe('attack');
  const next=tick(first.gathering,first.combat,.1,()=>false);expect(next.gathering.units[0].order.kind).toBe('move');
  expect(next.gathering.units[0]).toMatchObject({target:{x:600,y:300},attackMoveTarget:{x:600,y:300}});
  const blockedMap={...map,obstacles:[{x:160,y:0,width:32,height:600}]};
  const invalid=commandAttackMove([soldier()],{x:600,y:300},blockedMap)[0];expect(invalid).toMatchObject({order:{kind:'idle'},attackMoveTarget:undefined});
 });
 it.each(['stop','move','group','manual'] as const)('%s replaces the entire continuing attack-move',kind=>{
  const units=commandAttackMove([soldier()],{x:600,y:300},map);
  const next=kind==='stop'?stopSelected(units,true):kind==='move'?orderUnits(units,{x:100,y:100}):kind==='group'?commandGroupMove(units,{x:100,y:100},map):orderAttack(units,'manual');
  expect((next[0] as Soldier).attackMoveTarget).toBeUndefined();expect((next[0] as Soldier).autoOrigin).toBeUndefined();
 });
 it('ordinary Move passes nearby enemies without attacking',()=>{
  const g=economy(commandGroupMove([soldier()],{x:600,y:300},map)),c=combat([{id:'e',hp:36,position:{x:200,y:300}}]);
  const next=tick(g,c);expect(next.gathering.units[0].order.kind).toBe('move');expect(next.combat.enemies[0].hp).toBe(36);
 });
 it('map revisions blocking the original goal terminate the continuing order',()=>{
  let g=economy(commandAttackMove([soldier()],{x:600,y:300},map));
  const blocked={...map,revision:1,obstacles:[{x:580,y:280,width:40,height:40}]};
  const next=updateCombat(updateGathering(g,.1,blocked),combat(),.1,blocked);
  expect(next.gathering.units[0]).toMatchObject({order:{kind:'idle'},attackMoveTarget:undefined});
 });
});
