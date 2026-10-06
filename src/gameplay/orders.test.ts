import { describe, expect, it } from 'vitest';
import {createClassicMatch as createMatch} from './testHelpers/classicMatch';
import {updateMatch} from './match';
import { stopSelected } from './orders';
import type { Unit, WorkerOrder } from './gathering';
import { planRoute } from './navigation';
import { orderMarkers } from '../presentation/orders';

describe('Stop and order feedback',()=>{
  it.each(['idle','move','gather','deliver'] as const)('stops a selected worker in %s without changing cargo or balance',kind=>{
    const s=createMatch(),u=s.gathering.units[0];if(u.kind!=='worker')throw Error();
    u.selected=true;u.cargo=4;u.order=(kind==='gather'||kind==='deliver'?{kind,nodeId:s.gathering.node.id}:{kind}) as WorkerOrder;
    u.navigation=planRoute(s.map,u.position,{x:700,y:300});
    const units=stopSelected(s.gathering.units,true);
    expect(units[0].order.kind).toBe('idle');expect(units[0].cargo).toBe(4);expect(units[0].navigation).toBeUndefined();
    expect(units[1]).toBe(s.gathering.units[1]);
    const later=updateMatch({...s,gathering:{...s.gathering,units},map:{...s.map,revision:1}},3);
    expect(later.gathering.units[0].position).toEqual(u.position);expect(later.gathering.wood).toBe(0);
    expect(later.gathering.node.remaining).toBe(400);
  });
  it('stops soldier attacks and rejects game-over Stop',()=>{
    const unit:Unit={kind:'soldier',id:'army',position:{x:300,y:300},target:{x:500,y:300},selected:true,cargo:0,hp:60,order:{kind:'attack',enemyId:'e'}};
    expect(stopSelected([unit],true)[0].order.kind).toBe('idle');
    const units=[unit];expect(stopSelected(units,false)).toBe(units);
  });
  it('shows only current selected active/rejected orders and cleans completion/death',()=>{
    const s=createMatch(),u=s.gathering.units[0];u.selected=true;u.order={kind:'move'};u.target={x:700,y:300};
    expect(orderMarkers(s.gathering,s.combat,true)).toEqual([{id:u.id,position:u.target,blocked:false,kind:'move'}]);
    u.navigation=planRoute(s.map,u.position,{x:120,y:120});
    expect(orderMarkers(s.gathering,s.combat,true)[0].blocked).toBe(true);
    u.selected=false;expect(orderMarkers(s.gathering,s.combat,true)).toEqual([]);
    u.selected=true;s.gathering.units=stopSelected(s.gathering.units,true);
    expect(orderMarkers(s.gathering,s.combat,true)).toEqual([]);
    s.gathering.units=[];expect(orderMarkers(s.gathering,s.combat,true)).toEqual([]);
    expect(orderMarkers(createMatch().gathering,s.combat,true)).toEqual([]);
    expect(orderMarkers(s.gathering,s.combat,false)).toEqual([]);
  });
});
