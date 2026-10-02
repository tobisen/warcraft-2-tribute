import { describe,expect,it } from 'vitest';
import { bindGroup,recallGroup,pruneGroups,combineSelection } from './controlGroups';
import { selectUnitAt,selectUnitsInRectangle } from './selection';
import { createMatch,updateMatch } from './match';
const units=()=>createMatch().gathering.units;
describe('selection modifiers and live ID groups',()=>{
 it('click toggles only hit units; empty click preserves prior selection and orders',()=>{
  let u=units();u[0].selected=true;const orders=u.map(x=>x.order);u=combineSelection(u,selectUnitAt(u,u[1].position,24),'toggle');expect(u.map(x=>x.selected)).toEqual([true,true,false]);u=combineSelection(u,selectUnitAt(u,u[0].position,24),'toggle');expect(u.map(x=>x.selected)).toEqual([false,true,false]);u=combineSelection(u,selectUnitAt(u,{x:0,y:0},24),'toggle');expect(u.map(x=>x.selected)).toEqual([false,true,false]);expect(u.map(x=>x.order)).toEqual(orders);
 });
 it.each([[{x:270,y:290},{x:410,y:310}],[{x:410,y:290},{x:270,y:310}],[{x:270,y:310},{x:410,y:290}],[{x:410,y:310},{x:270,y:290}]])('shift drag adds in all directions, preserving old hits', (start,end)=>{
  let u=units();u[2].selected=true;u=combineSelection(u,selectUnitsInRectangle(u,start,end),'add');expect(u.every(x=>x.selected)).toBe(true);u=combineSelection(u,selectUnitsInRectangle(u,{x:0,y:0},{x:1,y:1}),'add');expect(u.every(x=>x.selected)).toBe(true);
 });
 it('bind replaces only its slot, deduplicates IDs, and recall changes only selection',()=>{
  const u=units();u[0].selected=true;u[1].selected=true;u[0].order={kind:'move'};u[0].target={x:600,y:300};const g=bindGroup({'2':['unit-3']},'1',u),before=u.map(x=>({order:x.order,target:x.target}));expect(g).toEqual({'1':['unit-1','unit-2'],'2':['unit-3']});u.forEach(x=>x.selected=false);const recalled=recallGroup(g,'1',u);expect(recalled.map(x=>x.selected)).toEqual([true,true,false]);expect(recalled.map(x=>({order:x.order,target:x.target}))).toEqual(before);expect(recallGroup(g,'9',u).some(x=>x.selected)).toBe(false);expect(bindGroup(g,'0',u)).toBe(g);
 });
 it('rejects dead, hidden, foreign and stale IDs at bind/recall, and permanently prunes death',()=>{
  const own=units();own.forEach(u=>u.selected=true);own[0].hp=0;const foreign={...own[2],id:'enemy-unit',owner:'enemy'},all=[...own,foreign];
  const bound=bindGroup({},'1',all,u=>u.id!=='unit-2');expect(bound['1']).toEqual(['unit-3']);expect(recallGroup({'1':['unit-1','unit-2','unit-3','enemy-unit','missing']},'1',all,u=>u.id!=='unit-2').filter(u=>u.selected).map(u=>u.id)).toEqual(['unit-3']);expect(pruneGroups({'1':['unit-1','unit-3','missing','unit-3'],'99':['unit-3']},all)).toEqual({'1':['unit-3']});
 });
 it('match death cleanup and restart preserve only valid current-match IDs',()=>{
  let s=createMatch();s.controlGroups={'1':['unit-1','unit-2']};s.gathering.units[0].hp=0;s=updateMatch(s,0);expect(s.controlGroups).toEqual({'1':['unit-2']});expect(createMatch().controlGroups).toEqual({});
 });
});
