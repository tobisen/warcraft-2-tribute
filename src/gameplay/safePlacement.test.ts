import {createClassicMatch as createMatch} from './testHelpers/classicMatch';
import { describe, expect, it } from 'vitest';

import { beginPlacement, cancelPlacement, placementError, placementObstacles, placeBarracks } from './placement';
import { replaceObstacles, bodyFits } from './map';
import { chooseSpawn, spawnCandidates, unitBody } from './spawning';
import { startProduction, updateProduction } from './production';
import { overlaps } from './map';

const ready=()=>{const s=createMatch();s.gathering.wood=100;s.gathering.units[0].selected=true;return s;};
const context=(s:ReturnType<typeof createMatch>)=>({map:s.map,gathering:s.gathering,enemies:s.combat.enemies});
const error=(s:ReturnType<typeof createMatch>,point:{x:number;y:number})=>placementError(s.placement,point,s.gathering.wood,placementObstacles(s.gathering),context(s));
describe('safe placement and spawn', () => {
  it('rejects terrain and living bodies, including enemies and click-time changes', () => {
    const s=ready();expect(error(s,{x:96,y:96})).toContain('terrain');
    expect(error(s,{x:256,y:288})).toContain('unit');
    expect(error(s,{x:512,y:384})).toBeNull();
    s.combat.enemies.push({id:'e',hp:36,position:{x:530,y:400}});
    expect(error(s,{x:512,y:384})).toContain('unit');
    s.combat.enemies=[];s.gathering.wood=0;expect(error(s,{x:512,y:384})).toContain('wood');
  });
  it('commits footprint/revision and cost atomically once, invalid/cancel leave all unchanged', () => {
    const s=ready();s.placement=beginPlacement(s.placement);
    const invalid=placeBarracks(s.placement,{x:96,y:96},100,placementObstacles(s.gathering),context(s));
    expect(invalid.map).toBe(s.map);expect(invalid.wood).toBe(100);expect(invalid.placement).toBe(s.placement);
    const accepted=placeBarracks(s.placement,{x:512,y:384},100,placementObstacles(s.gathering),context(s));
    expect(accepted.wood).toBe(60);expect(accepted.map?.revision).toBe(s.map.revision+1);
    expect(bodyFits(accepted.map!,{x:540,y:410},12)).toBe(false);
    expect(s.map.revision).toBe(0);expect(s.map.obstacles).not.toContainEqual(accepted.placement.barracks);
    const repeated=placeBarracks(accepted.placement,{x:600,y:400},60,placementObstacles(s.gathering),{...context(s),map:accepted.map!});
    expect(repeated.wood).toBe(60);expect(repeated.map).toBe(accepted.map);
    const cancelled=placeBarracks(cancelPlacement(s.placement),{x:512,y:384},100,placementObstacles(s.gathering),context(s));
    expect(cancelled.wood).toBe(100);expect(cancelled.map).toBe(s.map);
  });
  it('preserves worker access through a gateway and does not demand repair of pre-existing disconnection', () => {
    const s=ready();s.map=replaceObstacles(s.map,[...s.map.obstacles,
      {x:544,y:0,width:64,height:320},{x:544,y:384,width:64,height:s.map.height-384}]);
    expect(error(s,{x:544,y:320})).toContain('worker');
    s.map=replaceObstacles(s.map,[...s.map.obstacles,{x:544,y:320,width:64,height:64}]);
    expect(error(s,{x:256,y:384})).toBeNull();
  });
  it('preserves entry-to-base paths and cannot block future wave entry bodies', () => {
    const s=ready();s.gathering.units=[];
    s.map=replaceObstacles(s.map,[...s.map.obstacles,{x:0,y:160,width:704,height:64},{x:768,y:160,width:s.map.width-768,height:64}]);
    expect(error(s,{x:704,y:160})).toContain('enemy wave');
    const normal=ready();expect(error(normal,{x:736,y:32})).toContain('enemy wave');
  });
  it('holds a finished job when every spawn is occupied and spawns once when space is freed', () => {
    const s=ready(),base=placementObstacles(s.gathering)[0];
    const candidates=spawnCandidates(s.map,base,'base');
    s.gathering.units=candidates.map((p,i)=>({...s.gathering.units[0],id:`block-${i}`,position:p,selected:false}));
    const started=startProduction(s.gathering,s.production);expect(started.gathering.wood).toBe(80);
    expect(chooseSpawn(s.map,base,'base',s.gathering.units,[])).toBeNull();
    const waiting=updateProduction(started.gathering,started.production,5,{kind:'base'},context(s));
    expect(waiting.production.remainingSeconds).toBe(0);expect(waiting.production.blockedSpawnKey).toBeDefined();
    expect(waiting.gathering.units).toHaveLength(candidates.length);
    expect(updateProduction(waiting.gathering,waiting.production,10,{kind:'base'},context(s)).production).toBe(waiting.production);
    const point=candidates[0];const freed={...waiting.gathering,units:waiting.gathering.units.filter(u=>!overlaps(unitBody(u.position,24),unitBody(point,24)))};
    const complete=updateProduction(freed,waiting.production,1,{kind:'base'},context(s));
    expect(complete.gathering.units).toHaveLength(freed.units.length+1);expect(complete.production.remainingSeconds).toBeNull();
    expect(complete.gathering.wood).toBe(80);expect(bodyFits(s.map,complete.gathering.units.at(-1)!.position,12)).toBe(true);
    expect(updateProduction(complete.gathering,complete.production,100,{kind:'base'},context(s)).gathering.units).toHaveLength(complete.gathering.units.length);
  });
});
