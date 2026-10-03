import { describe, expect, it } from 'vitest';
import { createMatch, updateMatch, type MatchState } from './match';
import { populationState, hasPopulation } from './population';
import { beginPlacement, placeBuilding, placementObstacles, placementError } from './placement';
import { startProduction } from './production';
import { resumeConstruction } from './construction';
import { stopSelected } from './orders';
const pop=(s:MatchState)=>populationState(s.gathering,s.placement,[s.production,s.soldierProduction]);
const ready=()=>{const s=createMatch();s.gathering.wood=200;s.gathering.goldBalance=30;s.gathering.units[0].selected=true;return s;};
const farm=(s:MatchState,point={x:256,y:384})=>{
  const r=placeBuilding(beginPlacement(s.placement,'farm'),point,s.gathering.wood,placementObstacles(s.gathering),{map:s.map,gathering:s.gathering,enemies:[]});
  if(!r.map||!r.gathering)throw Error('farm placement failed');return {...s,map:r.map,gathering:r.gathering,placement:r.placement};
};
describe('farms and reserved population',()=>{
  it('begins at 3/8, reserves a place at production start and converts it to used exactly once',()=>{
    let s=ready();expect(pop(s)).toEqual({cap:8,used:3,reserved:0});
    const r=startProduction(s.gathering,s.production,{kind:'base'},pop(s));s={...s,gathering:r.gathering,production:r.production};
    expect(pop(s)).toEqual({cap:8,used:3,reserved:1});s=updateMatch(s,5);
    expect(pop(s)).toEqual({cap:8,used:4,reserved:0});expect(pop(updateMatch(s,1)).used).toBe(4);
  });
  it('blocks a second building start when the last slot was reserved, without debiting either resource',()=>{
    let s=ready();s.gathering.units=Array.from({length:7},(_,i)=>({...s.gathering.units[i%3],id:`unit-${i+1}`,selected:false}));
    const first=startProduction(s.gathering,s.production,{kind:'base'},pop(s));s={...s,gathering:first.gathering,production:first.production};
    expect(pop(s)).toEqual({cap:8,used:7,reserved:1});
    const second=startProduction(s.gathering,s.soldierProduction,{kind:'barracks',footprint:{x:512,y:384,width:64,height:64}},pop(s));
    expect(second.gathering).toBe(s.gathering);expect(second.production).toBe(s.soldierProduction);
    s.production.remainingSeconds=0;s.production.blockedSpawnKey='waiting';expect(pop(s).reserved).toBe(1);
  });
  it('reserves a farm footprint but increases cap only after effective construction',()=>{
    let s=farm(ready());expect(s.gathering.wood).toBe(180);expect(pop(s).cap).toBe(8);
    expect(s.map.obstacles).toContainEqual(s.placement.farms![0].footprint);
    s=updateMatch(s,2);s.gathering.units=stopSelected(s.gathering.units,true);const time=s.placement.farms![0].construction.remainingSeconds;
    s=updateMatch(s,10);expect(pop(s).cap).toBe(8);expect(s.placement.farms![0].construction.remainingSeconds).toBe(time);
    s={...s,...resumeConstruction(s.gathering,s.placement,s.map,'farm-1')};s=updateMatch(s,10);
    expect(pop(s).cap).toBe(13);expect(pop(updateMatch(s,1)).cap).toBe(13);
  });
  it('tracks unique farm IDs, multiple paused sites and an explicit three-farm limit',()=>{
    let s=farm(ready());s=farm(s,{x:640,y:384});
    expect(s.placement.farms!.map(f=>f.id)).toEqual(['farm-1','farm-2']);
    s=updateMatch(s,12);expect(s.placement.farms![0].construction.remainingSeconds).toBe(5);expect(pop(s).cap).toBe(13);
    s={...s,...resumeConstruction(s.gathering,s.placement,s.map,'farm-1')};s=updateMatch(s,12);expect(pop(s).cap).toBe(18);
    s=farm(s,{x:768,y:384});s=updateMatch(s,12);expect(pop(s).cap).toBe(23);expect(s.placement.nextFarmNumber).toBe(4);
    expect(beginPlacement(s.placement,'farm')).toBe(s.placement);
    const reset=createMatch();expect(reset.placement.farms).toEqual([]);expect(reset.placement.nextFarmNumber).toBe(1);expect(pop(reset)).toEqual({cap:8,used:3,reserved:0});
  });
  it('lets separate builders progress concurrently and resumes one site without cancelling the other',()=>{
    let s=farm(ready());s.gathering.units=s.gathering.units.map((u,i)=>({...u,selected:i===1}));
    s=farm(s,{x:640,y:384});s=updateMatch(s,3);
    expect(s.placement.farms!.every(f=>f.construction.remainingSeconds<5)).toBe(true);
    s.gathering.units=s.gathering.units.map((u,i)=>({...u,selected:i===2}));
    s={...s,...resumeConstruction(s.gathering,s.placement,s.map,'farm-1')};
    expect(s.gathering.units[1].order).toEqual({kind:'build',buildingId:'farm-2'});
    s=updateMatch(s,12);expect(pop(s).cap).toBe(18);
  });
  it('preserves a paused builders route to an existing unfinished site',()=>{
    const s=ready();s.gathering.node.position={x:300,y:180};s.gathering.gold!.position={x:350,y:220};
    s.placement.barracks={x:640,y:384,width:64,height:64};s.placement.construction={remainingSeconds:5,builderId:'unit-1'};
    s.map={...s.map,revision:1,obstacles:[...placementObstacles(s.gathering),s.placement.barracks,
      {x:544,y:0,width:64,height:320},{x:544,y:384,width:64,height:s.map.height-384},
      {x:728,y:48,width:24,height:104}]};
    expect(placementError(beginPlacement(s.placement,'farm'),{x:544,y:320},s.gathering.wood,placementObstacles(s.gathering),{map:s.map,gathering:s.gathering,enemies:[]})).toContain('builder');
    const r=placeBuilding(beginPlacement(s.placement,'farm'),{x:544,y:320},s.gathering.wood,placementObstacles(s.gathering),{map:s.map,gathering:s.gathering,enemies:[]});
    expect(r.placement.farms).toEqual([]);expect(r.map).toBe(s.map);expect(r.wood).toBe(200);
  });
  it('keeps units and accepted jobs when capacity falls, blocking only new starts',()=>{
    let s=ready();s.placement.farms=[{id:'farm-1',footprint:{x:256,y:384,width:64,height:64},construction:{remainingSeconds:0,builderId:null}}];
    s.gathering.units=Array.from({length:8},(_,i)=>({...s.gathering.units[i%3],id:`unit-${i+1}`,selected:false}));
    const r=startProduction(s.gathering,s.production,{kind:'base'},pop(s));s={...s,gathering:r.gathering,production:r.production};
    s.placement.farms=[];expect(hasPopulation(pop(s))).toBe(false);s=updateMatch(s,5);
    expect(s.gathering.units).toHaveLength(9);expect(pop(s).cap).toBe(8);
    expect(startProduction(s.gathering,s.production,{kind:'base'},pop(s)).gathering).toBe(s.gathering);
  });
});
