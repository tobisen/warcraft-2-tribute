import { describe, expect, it } from 'vitest';
import { createMatch, updateMatch } from './match';
import { baseFootprint } from './buildingSelection';
import { setRally } from './rally';
import { startProduction } from './production';
import { bodyFits } from './map';

describe('building rally',()=>{
  it('accepts a reachable world goal and retains it when the next goal is blocked',()=>{
    const s=createMatch();const p=setRally(s.production,{x:48,y:144},s.map,baseFootprint(s.gathering.base),'base');
    expect(p.rally).toEqual({x:48,y:144});expect(p.rallyError).toBeUndefined();
    const invalid=setRally(p,{x:120,y:120},s.map,baseFootprint(s.gathering.base),'base');
    expect(invalid.rally).toEqual(p.rally);expect(invalid.rallyError).toBeTruthy();
    expect(setRally(p,{x:1280,y:960},s.map,baseFootprint(s.gathering.base),'base').rallyError).toBeTruthy();
    expect(setRally(s.soldierProduction,{x:600,y:300},s.map,null,'barracks').rally).toBeUndefined();
  });
  it('spawn remains safe, unselected and uses the current rally without implicit gather',()=>{
    let s=createMatch();s.gathering.wood=20;
    const rally=setRally(s.production,{x:48,y:144},s.map,baseFootprint(s.gathering.base),'base');
    const start=startProduction(s.gathering,rally);s={...s,gathering:start.gathering,production:start.production};
    s=updateMatch(s,5);const worker=s.gathering.units.find(u=>u.id==='unit-4')!;
    expect(worker.selected).toBe(false);expect(worker.cargo).toBe(0);expect(worker.order.kind).toBe('move');
    expect(worker.target).toEqual({x:48,y:144});expect(bodyFits(s.map,worker.position,12)).toBe(true);
    expect(s.production.rally).toEqual({x:48,y:144});
    s=updateMatch(s,10);expect(s.gathering.units.find(u=>u.id==='unit-4')!.position).toEqual({x:48,y:144});
    expect(s.gathering.node.remaining).toBe(400);
  });
  it('uses separate current rally goals for simultaneous worker and soldier production',()=>{
    let s=createMatch();const footprint={x:512,y:384,width:64,height:64};
    s.placement.barracks=footprint;s.map.obstacles.push(footprint);s.gathering.wood=40;s.gathering.goldBalance=5;
    s.production=setRally(s.production,{x:700,y:300},s.map,baseFootprint(s.gathering.base),'base');
    s.soldierProduction=setRally(s.soldierProduction,{x:48,y:144},s.map,footprint,'barracks');
    const w=startProduction(s.gathering,s.production);const army=startProduction(w.gathering,s.soldierProduction,{kind:'barracks',footprint});
    s={...s,gathering:army.gathering,production:w.production,soldierProduction:army.production};
    s=updateMatch(s,5);
    expect(s.gathering.units.find(u=>u.id==='unit-4')!.target).toEqual({x:700,y:300});
    expect(s.gathering.units.find(u=>u.id==='unit-5')!.target).toEqual({x:48,y:144});
    expect(s.gathering.units.every(u=>!u.selected)).toBe(true);
  });
  it('does not teleport or overcharge when later terrain blocks an accepted rally',()=>{
    let s=createMatch();s.gathering.wood=20;
    const p=setRally(s.production,{x:700,y:300},s.map,baseFootprint(s.gathering.base),'base');
    const start=startProduction(s.gathering,p);s={...s,gathering:start.gathering,production:start.production};
    s.map={...s.map,revision:1,obstacles:[...s.map.obstacles,{x:688,y:288,width:24,height:24}]};
    s=updateMatch(s,5);const worker=s.gathering.units.find(u=>u.id==='unit-4')!;
    expect(bodyFits(s.map,worker.position,12)).toBe(true);expect(worker.navigation?.status).toBe('blocked');
    expect(worker.order.kind).toBe('idle');expect(s.gathering.wood).toBe(0);
    expect(updateMatch(s,1).gathering.units).toHaveLength(4);
  });
  it('keeps independent building state and resets all rally data',()=>{
    const s=createMatch();const base=setRally(s.production,{x:700,y:300},s.map,baseFootprint(s.gathering.base),'base');
    expect(base.rally).toBeDefined();expect(s.soldierProduction.rally).toBeUndefined();
    expect(createMatch().production.rally).toBeUndefined();expect(createMatch().soldierProduction.rallyError).toBeUndefined();
  });
});
