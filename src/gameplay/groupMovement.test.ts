import { describe, expect, it } from 'vitest';
import { createMatch, updateMatch } from './match';
import { commandGroupMove, groupCandidates } from './groupMovement';
import { bodyFits, replaceObstacles } from './map';
import { navigationConfig } from '../config/navigation';

describe('separate group destinations', () => {
  it('allocates unique reachable goals stably by ID independent of array order', () => {
    const s=createMatch();const units=s.gathering.units.map(u=>({...u,selected:true}));
    const a=commandGroupMove(units,{x:500,y:300},s.map),b=commandGroupMove([...units].reverse(),{x:500,y:300},s.map);
    const targets=(u:typeof a)=>Object.fromEntries(u.map(v=>[v.id,v.target]));
    expect(targets(a)).toEqual(targets(b));expect(new Set(a.map(u=>JSON.stringify(u.target))).size).toBe(3);
    const finished=updateMatch({...s,gathering:{...s.gathering,units:a}},10);
    expect(finished.gathering.units.map(u=>u.position)).toEqual(a.map(u=>u.target));
  });
  it('uses only body-safe edge candidates and rejects invalid central clicks', () => {
    const s=createMatch(),units=s.gathering.units.map(u=>({...u,selected:true}));
    const result=commandGroupMove(units,{x:788,y:588},s.map);
    for(const unit of result)expect(bodyFits(s.map,unit.target,12)).toBe(true);
    expect(new Set(result.map(u=>JSON.stringify(u.target))).size).toBe(3);
    expect(commandGroupMove(units,{x:120,y:120},s.map).every(u=>u.navigation?.error==='blocked-target')).toBe(true);
    expect(commandGroupMove(units,{x:s.map.width,y:s.map.height},s.map).every(u=>u.navigation?.error==='outside-world')).toBe(true);
  });
  it('bounded candidate exhaustion never assigns a duplicate fallback even after revision', () => {
    const s=createMatch();s.map={...s.map,obstacles:[]};
    const count=groupCandidates({x:400,y:300}).length;
    const units=Array.from({length:count+2},(_,i)=>({...s.gathering.units[0],id:`unit-${i+1}`,selected:true,position:{x:400,y:300}}));
    const ordered=commandGroupMove(units,{x:400,y:300},s.map);
    expect(count).toBe((navigationConfig.groupRadius*2+1)**2);
    const allocated=ordered.filter(u=>u.navigation?.error!=='no-space');
    expect(new Set(allocated.map(u=>JSON.stringify(u.target))).size).toBe(count);
    expect(ordered.filter(u=>u.navigation?.error==='no-space')).toHaveLength(2);
    const blocked=ordered.filter(u=>u.navigation?.error==='no-space');
    const next=updateMatch({...s,map:replaceObstacles(s.map,[]),gathering:{...s.gathering,units:blocked}},1);
    expect(next.gathering.units.map(u=>u.position)).toEqual(blocked.map(u=>u.position));
    expect(next.gathering.units.every(u=>u.navigation?.error==='no-space')).toBe(true);
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
