import { describe, expect, it } from 'vitest';
import { acquireTargets } from './acquisition';
import { orderAttack, updateCombat, type Enemy } from './combat';
import { orderUnits, type GatheringState, type Soldier } from './gathering';
import { stopSelected } from './orders';
import { createMatch } from './match';
import { updateGathering } from './gathering';
import type { WorldMap } from './map';
const soldier=(extra:Partial<Soldier>={}):Soldier=>({id:'unit-1',kind:'soldier',hp:60,cargo:0,selected:true,
 position:{x:100,y:100},target:{x:100,y:100},order:{kind:'idle'},...extra});
const enemy=(id:string,x:number,y=100,hp=36):Enemy=>({id,position:{x,y},hp});
const economy=(units:Soldier[]):GatheringState=>({units,base:{x:500,y:500},wood:0,node:{id:'wood',position:{x:600,y:500},remaining:100}});
const map:WorldMap={width:800,height:600,tileSize:32,revision:0,obstacles:[]};
describe('automatic acquisition',()=>{
 it('chooses nearest live visible target with stable numeric ID ties, independent of selection',()=>{
  const units=[soldier({selected:false})], enemies=[enemy('enemy-10',130),enemy('enemy-2',130),enemy('dead',101,100,0),enemy('far',500)];
  expect(acquireTargets(units,enemies)[0].order).toEqual({kind:'attack',enemyId:'enemy-2'});
  expect(acquireTargets(units,enemies,undefined,e=>e.id!=='enemy-2')[0].order).toEqual({kind:'attack',enemyId:'enemy-10'});
  expect(acquireTargets(units,enemies,undefined,()=>false)[0].order.kind).toBe('idle');
 });
 it('rejects unreachable enemies, selecting a reachable alternative',()=>{
  const wall={...map,obstacles:[{x:160,y:0,width:32,height:600}]};
  expect(acquireTargets([soldier()],[enemy('sealed',220),enemy('reachable',100,220)],wall)[0].order).toEqual({kind:'attack',enemyId:'reachable'});
  expect(acquireTargets([soldier()],[enemy('sealed',220)],wall)[0].order.kind).toBe('idle');
 });
 it('retains a current automatic target instead of switching to a closer one every frame',()=>{
  const first=acquireTargets([soldier()],[enemy('first',180)])[0];
  expect(acquireTargets([first],[enemy('first',180),enemy('closer',101)])[0].order).toEqual(first.order);
 });
 it('manual attacks override automatic origin, hold and proximity targeting',()=>{
  const units=orderAttack([soldier({autoDisabled:true,autoOrigin:{x:30,y:30}})],'manual');
  expect(acquireTargets(units,[enemy('closer',101),enemy('manual',500)])[0]).toMatchObject({autoDisabled:false,autoOrigin:undefined,order:{kind:'attack',enemyId:'manual'}});
 });
 it('Move cancels pursuit and resumes automatic defence only after arrival; Stop holds until a new command',()=>{
  const fighting=acquireTargets([soldier()],[enemy('e',132)]);
  let units=orderUnits(fighting,{x:100,y:300});
  expect(acquireTargets(units,[enemy('e',132)])[0].order.kind).toBe('move');
  units=stopSelected(units,true);expect(acquireTargets(units,[enemy('e',132)])[0].order.kind).toBe('idle');
  units=orderUnits(units,{x:100,y:110});
  const arrived=updateGathering({...economy([]),units},1);
  expect(acquireTargets(arrived.units,[enemy('e',132)])[0].order.kind).toBe('attack');
 });
 it.each(['range','hidden','dead','unreachable'] as const)('returns to its origin after automatic target becomes %s',reason=>{
  const unit=soldier({position:{x:120,y:100},autoOrigin:{x:100,y:100},order:{kind:'attack',enemyId:'e'}});
  const targets=[enemy('e',reason==='range'?400:150,100,reason==='dead'?0:36)];
  const world=reason==='unreachable'?{...map,obstacles:[{x:135,y:0,width:32,height:600}]}:map;
  const result=acquireTargets([unit],targets,world,()=>reason!=='hidden')[0];
  expect(result).toMatchObject({target:{x:100,y:100},order:{kind:'move'},autoOrigin:undefined});
 });
 it('kills multiple nearby enemies without extra commands and clears dead references',()=>{
  let g=economy([soldier()]),c={baseHP:240,enemies:[enemy('e1',128,100,1),enemy('e2',128,110,1)]};
  for(let i=0;i<20;i++){const next=updateCombat(g,c,.1);g=next.gathering;c=next.combat;}
  expect(c.enemies).toEqual([]);expect(g.units[0].order.kind).not.toBe('attack');
 });
 it('fresh match does not retain automatic origins or hold flags',()=>{
  expect(createMatch().gathering.units.every(u=>!('autoOrigin' in u)&&!('autoDisabled' in u))).toBe(true);
 });
});
