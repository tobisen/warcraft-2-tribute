import { describe, expect, it } from 'vitest';
import {createClassicMatch as createMatch} from './testHelpers/classicMatch';
import {updateMatch} from './match';
import { commandGroupMove, groupCandidates } from './groupMovement';
import { bodyFits, replaceObstacles } from './map';
import {combatUnitStats} from '../config/unit';
import type {Unit} from './gathering';
import {createNavy,commandShips} from './navy';

describe('separate group destinations', () => {
  it('allocates unique reachable goals stably by ID independent of array order', () => {
    const s=createMatch();const units=s.gathering.units.map(u=>({...u,selected:true}));
    const a=commandGroupMove(units,{x:500,y:300},s.map),b=commandGroupMove([...units].reverse(),{x:500,y:300},s.map);
    const targets=(u:typeof a)=>Object.fromEntries(u.map(v=>[v.id,v.target]));
    expect(targets(a)).toEqual(targets(b));expect(new Set(a.map(u=>JSON.stringify(u.target))).size).toBe(3);
    const finished=updateMatch({...s,gathering:{...s.gathering,units:a}},10);
    expect(finished.gathering.units.map(u=>u.position)).toEqual(a.map(u=>u.target));
  });
  it('uses only body-safe edge candidates and uses reachable alternatives for blocked central clicks', () => {
    const s=createMatch(),units=s.gathering.units.map(u=>({...u,selected:true}));
    const result=commandGroupMove(units,{x:788,y:588},s.map);
    for(const unit of result)expect(bodyFits(s.map,unit.target,12)).toBe(true);
    expect(new Set(result.map(u=>JSON.stringify(u.target))).size).toBe(3);
    const fallback=commandGroupMove(units,{x:120,y:120},s.map);expect(fallback.every(u=>u.navigation?.status!=='blocked'&&bodyFits(s.map,u.target,12))).toBe(true);
    expect(commandGroupMove(units,{x:s.map.width,y:s.map.height},s.map)).toBe(units);
  });
  it('bounded candidate exhaustion never assigns a duplicate fallback even after revision', () => {
    const s=createMatch();s.map={...s.map,obstacles:[]};
    const count=groupCandidates({x:400,y:300},32,8).length;
    const units=Array.from({length:count+2},(_,i)=>({...s.gathering.units[0],id:`unit-${i+1}`,selected:true,position:{x:400,y:300}}));
    const ordered=commandGroupMove(units,{x:400,y:300},s.map);
    expect(count).toBe(17**2);
    const allocated=ordered.filter(u=>u.navigation?.error!=='no-space');
    expect(new Set(allocated.map(u=>JSON.stringify(u.target))).size).toBe(count);
    expect(ordered.filter(u=>u.navigation?.error==='no-space')).toHaveLength(2);
    const blocked=ordered.filter(u=>u.navigation?.error==='no-space');
    const next=updateMatch({...s,map:replaceObstacles(s.map,[]),gathering:{...s.gathering,units:blocked}},1);
    // Local separation may settle coincident bodies, but must never allocate/retry the failed move.
    expect(next.gathering.units.map(u=>u.target)).toEqual(blocked.map(u=>u.target));
    expect(next.gathering.units.every(u=>u.order.kind==='idle')).toBe(true);
    expect(next.gathering.units.every(u=>u.navigation?.error==='no-space')).toBe(true);
  });
  it('fits 128 mixed bodies without overlapping slots and keeps air independent',()=>{
    const s=createMatch('skirmish');s.map={...s.map,obstacles:[]};
    const units:Unit[]=Array.from({length:128},(_,i)=>({id:`unit-${i+1}`,kind:'soldier',archetype:i%4===0?'catapult':i%4===1?'air':'archer',hp:60,cargo:0,position:{x:200+(i%16)*40,y:200+Math.floor(i/16)*40},target:{x:200,y:200},selected:true,order:{kind:'idle'}}));
    const moved=commandGroupMove(units,{x:700,y:600},s.map);expect(moved.every(u=>u.navigation?.status!=='blocked')).toBe(true);
    for(const a of moved)for(const b of moved)if(a!==b&&a.kind==='soldier'&&b.kind==='soldier'&&(a.archetype==='air')===(b.archetype==='air'))expect(Math.abs(a.target.x-b.target.x)>=combatUnitStats(a).size/2+combatUnitStats(b).size/2||Math.abs(a.target.y-b.target.y)>=combatUnitStats(a).size/2+combatUnitStats(b).size/2).toBe(true);
    expect(commandGroupMove([...units].reverse(),{x:700,y:600},s.map).map(u=>u.target).reverse()).toEqual(moved.map(u=>u.target));
  });
  it('allocates water-safe distinct ship slots using the same formation policy',()=>{
    const m=createMatch('mission-outpost');m.navy={...createNavy(),ships:Array.from({length:3},(_,i)=>({id:`ship-${i+1}`,kind:'ship',owner:'player',hp:90,selected:true,position:{x:144+i*32,y:480},target:{x:208,y:512},order:{kind:'idle'}}))};
    const moved=commandShips(m,{x:144,y:512})!;expect(new Set(moved.ships.map(s=>JSON.stringify(s.target))).size).toBe(3);expect(moved.ships.every(s=>s.navigation?.status!=='blocked')).toBe(true);
  });
  it.each([4,24])('passes %i bodies through a narrow gate and settles without repeated route planning',count=>{
    let m=createMatch('skirmish');m.enemyAI=undefined;m.enemyProduction=undefined;
    m.map=replaceObstacles(m.map,[{x:0,y:352,width:512,height:64},{x:576,y:352,width:m.map.width-576,height:64}]);
    m.gathering.units=Array.from({length:count},(_,i)=>({...m.gathering.units[0],id:`unit-${i+1}`,selected:true,position:{x:400+(i%6)*32,y:180+Math.floor(i/6)*32},target:{x:544,y:560},order:{kind:'idle'}}));
    m.gathering.units=commandGroupMove(m.gathering.units,{x:544,y:560},m.map);
    for(let i=0;i<1200&&m.gathering.units.some(u=>u.order.kind==='move');i++)m=updateMatch(m,.1);
    expect(m.gathering.units.every(u=>u.position.y>416&&u.order.kind==='idle')).toBe(true);
    const settled=m.gathering.units.map(u=>({...u.position}));for(let i=0;i<30;i++)m=updateMatch(m,.1);expect(m.gathering.units.map(u=>u.position)).toEqual(settled);
  });
  it('tests individual reachability and leaves unselected units unchanged', () => {
    const s=createMatch();const units=s.gathering.units.map((u,i)=>({...u,selected:i<2}));
    const m=replaceObstacles(s.map,[...s.map.obstacles,{x:350,y:0,width:32,height:s.map.height}]);
    const ordered=commandGroupMove(units,{x:600,y:300},m);
    expect(ordered[0].navigation?.error).toBe('no-space');expect(ordered[1].navigation?.status).not.toBe('blocked');
    expect(ordered[2]).toBe(units[2]);
    const changed=commandGroupMove(ordered,{x:450,y:300},m);
    expect(changed[1].target).not.toEqual(ordered[1].target);
  });
});
