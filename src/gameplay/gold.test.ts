import { describe, expect, it } from 'vitest';
import { orderUnits, updateGathering, type GatheringState, type Worker, type ResourceType } from './gathering';
import { createMatch } from './match';
import { stopSelected } from './orders';

const fixture=():GatheringState=>({
  node:{id:'wood',resource:'wood',position:{x:0,y:0},remaining:20},
  gold:{id:'gold',resource:'gold',position:{x:416,y:0},remaining:20},
  base:{x:208,y:0},wood:0,goldBalance:0,
  units:[{id:'w',kind:'worker',position:{x:440,y:0},target:{x:416,y:0},selected:true,cargo:0,order:{kind:'gather',nodeId:'gold'}}],
});
const total=(s:GatheringState,resource:ResourceType)=>(resource==='wood'?s.wood+s.node.remaining:(s.goldBalance??0)+s.gold!.remaining)
  +s.units.reduce((sum,u)=>sum+(u.kind==='worker'&&(u.cargoType??'wood')===resource?u.cargo:0),0);
describe('typed resource delivery',()=>{
  it.each([1,50,500])('delivers gold over %s steps without affecting wood',steps=>{
    let s=fixture();for(let i=0;i<steps;i++)s=updateGathering(s,14/steps);
    expect(s.goldBalance).toBeCloseTo(10,8);expect(s.wood).toBe(0);
    expect(total(s,'gold')).toBeCloseTo(20,8);expect(total(s,'wood')).toBe(20);
  });
  it.each([2,5])('delivers old partial/full gold cargo %s before switching to wood',cargo=>{
    let s=fixture();const u=s.units[0] as Worker;u.cargo=cargo;u.cargoType='gold';s.gold!.remaining-=cargo;
    s.units=orderUnits(s.units,s.node.position,s.node);expect(s.units[0].order.kind).toBe('deliver');
    s=updateGathering(s,2);expect(s.goldBalance).toBe(cargo);expect(s.wood).toBe(0);
    expect(total(s,'gold')).toBe(20);expect(total(s,'wood')).toBe(20);
    s=updateGathering(s,10);expect(s.wood).toBeGreaterThan(0);expect(total(s,'wood')).toBeCloseTo(20,8);
    expect(total(s,'gold')).toBe(20);
  });
  it('delivers old wood before switching to gold, preserving type through Stop/move',()=>{
    let s=fixture();const u=s.units[0] as Worker;u.cargo=3;u.cargoType='wood';s.node.remaining-=3;
    s.units=stopSelected(s.units,true);expect((s.units[0] as Worker).cargoType).toBe('wood');
    s.units=orderUnits(s.units,{x:300,y:0});expect(s.units[0].cargo).toBe(3);
    s.units=orderUnits(s.units,s.gold!.position,s.gold!);expect(s.units[0].order.kind).toBe('deliver');
    s=updateGathering(s,2);expect(s.wood).toBe(3);expect(total(s,'wood')).toBe(20);expect(total(s,'gold')).toBe(20);
  });
  it('shares a limited gold node and delivers partial depletion loads',()=>{
    let s=fixture();s.gold!.remaining=7.5;s.units.push({...s.units[0],id:'w2'});
    for(let i=0;i<300;i++)s=updateGathering(s,.1);
    expect(s.gold!.remaining).toBe(0);expect(s.goldBalance).toBeCloseTo(7.5,8);
    expect(s.units.every(u=>u.order.kind==='idle'&&u.cargo===0)).toBe(true);
  });
  it('requires a reachable mine and preserves clean resource state on restart',()=>{
    let s=createMatch().gathering;const m=createMatch().map;
    s.units=[{...s.units[0],selected:true}];s.units=orderUnits(s.units,s.gold!.position,s.gold!);
    s=updateGathering(s,1,m);expect(s.gold!.remaining).toBe(3000);expect(s.units[0].cargo).toBe(0);
    const wall={...m,revision:1,obstacles:[...m.obstacles,{x:800,y:0,width:32,height:m.height}]};
    s=updateGathering(s,20,wall);expect(s.units[0].navigation?.status).toBe('blocked');expect(s.goldBalance).toBe(0);
    const fresh=createMatch();expect(fresh.gathering.goldBalance).toBe(0);expect(fresh.gathering.gold!.remaining).toBe(3000);
  });
  it('resource clicks preserve soldier orders in mixed selection',()=>{
    const s=fixture();s.units.push({id:'army',kind:'soldier',position:{x:100,y:0},target:{x:200,y:0},selected:true,hp:60,cargo:0,order:{kind:'move'}});
    const units=orderUnits(s.units,s.gold!.position,s.gold!);expect(units[1]).toBe(s.units[1]);
  });
});
