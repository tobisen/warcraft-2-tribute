import { describe, expect, it } from 'vitest';
import { createMatch, updateMatch } from './match';
import { placeBarracks, placementObstacles } from './placement';
import { barracksReady, resumeConstruction, updateConstruction } from './construction';
import { canStartProduction, startProduction } from './production';
import { stopSelected } from './orders';
import { bodyFits } from './map';
const started=()=>{
  const s=createMatch();s.gathering.wood=60;s.gathering.goldBalance=5;s.gathering.units[0].selected=true;
  const result=placeBarracks({...s.placement,active:true},{x:512,y:384},s.gathering.wood,placementObstacles(s.gathering),{map:s.map,gathering:s.gathering,enemies:[]});
  if(!result.gathering||!result.map)throw Error('placement failed');
  return {...s,placement:result.placement,map:result.map,gathering:result.gathering};
};
describe('worker construction',()=>{
  it('requires a selected worker and atomically reserves footprint/cost/build order',()=>{
    const s=createMatch();s.gathering.wood=40;
    const invalid=placeBarracks({...s.placement,active:true},{x:512,y:384},40,placementObstacles(s.gathering),{map:s.map,gathering:s.gathering,enemies:[]});
    expect(invalid.wood).toBe(40);expect(invalid.placement.barracks).toBeNull();expect(invalid.map).toBe(s.map);
    const build=started();expect(build.gathering.wood).toBe(20);expect(build.gathering.goldBalance).toBe(5);
    expect(build.map.obstacles).toContainEqual(build.placement.barracks);expect(build.map.revision).toBe(1);
    expect(build.gathering.units[0].order.kind).toBe('build');expect(barracksReady(build.placement)).toBe(false);
    const blocked={kind:'barracks' as const,footprint:build.placement.barracks,ready:false};
    expect(canStartProduction(build.gathering,build.soldierProduction,blocked)).toBe(false);
    expect(startProduction(build.gathering,build.soldierProduction,blocked).gathering).toBe(build.gathering);
  });
  it.each([1,100,1000])('walks to outside and completes once over %s steps',steps=>{
    let s=started();for(let i=0;i<steps;i++)s=updateMatch(s,12/steps);
    expect(barracksReady(s.placement)).toBe(true);expect(s.placement.construction!.builderId).toBeNull();
    expect(s.gathering.units[0].order.kind).toBe('idle');expect(bodyFits(s.map,s.gathering.units[0].position,12)).toBe(true);
    expect(s.gathering.wood).toBe(20);expect(s.map.revision).toBe(1);
    expect(updateMatch(s,1).placement).toEqual(s.placement);
  });
  it('does not progress during approach, Stop, or loss of worker order; resumes remaining progress',()=>{
    let s=started();s=updateMatch(s,.1);expect(s.placement.construction!.remainingSeconds).toBe(5);
    s=updateMatch(s,2);const remaining=s.placement.construction!.remainingSeconds;expect(remaining).toBeLessThan(5);
    s.gathering.units[0].cargo=3;if(s.gathering.units[0].kind==='worker')s.gathering.units[0].cargoType='gold';
    s.gathering.units=stopSelected(s.gathering.units,true);s=updateMatch(s,10);
    expect(s.placement.construction!.remainingSeconds).toBe(remaining);expect(s.gathering.units[0].cargo).toBe(3);
    const resumed=resumeConstruction(s.gathering,s.placement,s.map);s={...s,...resumed};s=updateMatch(s,remaining);
    expect(barracksReady(s.placement)).toBe(true);expect(s.gathering.units[0].cargo).toBe(3);
    expect(s.gathering.goldBalance).toBe(5);
  });
  it('joins the selected builder and pauses safely when navigation is blocked',()=>{
    let s=started();s.gathering.units=s.gathering.units.map((u,i)=>({...u,selected:i===1}));
    s={...s,...resumeConstruction(s.gathering,s.placement,s.map)};
    expect(s.gathering.units[0].order.kind).toBe('build');expect(s.placement.construction!.builderId).toBe('unit-2');
    s.map={...s.map,revision:2,obstacles:[...s.map.obstacles,{x:450,y:0,width:32,height:s.map.height}]};
    const result=updateConstruction(s.gathering,s.placement,s.map,30);
    expect(result.placement.construction!.remainingSeconds).toBe(5);
    expect(result.gathering.units[1].navigation!.status).toBe('blocked');
    expect(createMatch().placement.construction).toBeUndefined();
  });
});
