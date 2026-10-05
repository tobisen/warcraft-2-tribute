import {placementObstacles} from './placement';
import {resourceNodes} from './gathering';
import {legacyEnemyFixture} from './testHelpers/legacyEnemyFixture';
import {expect,it} from 'vitest';
import {createMatch,updateMatch} from './match';
import {createMap,bodyFits,tileFootprint} from './map';
import {findRoute,segmentFits} from './navigation';
import {encodeSave,decodeSave} from './save';
import {isExplored} from './fog';
import {matchFog} from './matchFog';
import {cameraIndicator,minimapCamera,worldToMinimap,visibleMinimapData} from '../presentation/minimap';
import {clampCamera} from '../presentation/camera';
import {releasePlaythrough} from './testHelpers/releaseBot';

for(const [id,tiles] of [['plains96',96],['plains128',128]] as const){
 it(`${id}: full bounds, fog, camera and minimap use authored dimensions`,()=>{
  const m=createMatch('skirmish','beginner',undefined,id),size=tiles*32,last={x:size-16,y:size-16};
  expect(m.map).toMatchObject({width:size,height:size,tileSize:32});
  expect(tileFootprint(m.map,{column:tiles-1,row:tiles-1})).toEqual({x:size-32,y:size-32,width:32,height:32});
  expect(bodyFits(m.map,last,12)).toBe(true);expect(findRoute(m.map,m.gathering.units[0].position,last).ok).toBe(true);
  expect(m.fog!.teams.player.visible).toHaveLength(tiles*tiles);expect(isExplored(m.fog!,'player',last)).toBe(false);
  m.gathering.units[0].position=last;m.fog=matchFog(m);expect(isExplored(m.fog!,'player',last)).toBe(true);
  expect(visibleMinimapData(m).world).toEqual({width:size,height:size});expect(worldToMinimap({x:size,y:size},m.map)).toEqual({x:200,y:150});
  const viewport={width:1000,height:502},scroll={x:size-1000,y:size-502};
  expect(minimapCamera({x:200,y:150},m.map,viewport)).toEqual(scroll);expect(clampCamera({x:size,y:size},m.map,viewport)).toEqual(scroll);
  expect(cameraIndicator(scroll,m.map,viewport).width).toBeCloseTo(1000/size*200);
 });
 it(`${id}: long blocked-direct routes search beyond the former small-map budget`,()=>{
  const m=createMatch('skirmish','beginner',undefined,id),size=m.map.width;
  const map={...m.map,obstacles:[{x:size/2,y:0,width:32,height:size-96}]};
  const start={x:256,y:256},goal={x:size-256,y:256},route=findRoute(map,start,goal);
  expect(route.ok).toBe(true);
  if(route.ok){let from=start;for(const to of route.waypoints){expect(segmentFits(map,from,to,12)).toBe(true);from=to;}expect(from).toEqual(goal);}
 });
 it(`${id}: far camera and active far movement survive strict Save/load`,()=>{
  const m=createMatch('skirmish','beginner',undefined,id),size=m.map.width,view={camera:{x:size-1000,y:size-502},building:null};
  m.gathering.units[0].target={x:size-16,y:size-16};m.gathering.units[0].order={kind:'move'};
  const json=encodeSave(m,view),loaded=decodeSave(json);expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);
  if(loaded.ok){expect(loaded.view).toEqual(view);expect(loaded.match.gathering.units[0].target).toEqual(m.gathering.units[0].target);}
  for(const mutate of [(d:any)=>d.configVersion='tribute-config-20',(d:any)=>d.state.map.width=1280,(d:any)=>d.state.fog.teams.player.explored.pop()]){const doc=JSON.parse(json);mutate(doc);expect(decodeSave(JSON.stringify(doc)).ok).toBe(false);}
 });
 it(`${id}: existing paid skirmish and enemy economy remain playable`,()=>{
  const result=releasePlaythrough('skirmish','normal',undefined,{faction:'crown',abilities:true,map:id});
  expect(result.match.outcome).toBe('victory');expect(result.spentWood).toBeGreaterThan(40);expect(result.match.enemyProduction!.acceptedJobs).toBeGreaterThan(0);
  let passive=createMatch('skirmish','normal',undefined,id);for(let i=0;i<1600&&passive.outcome==='playing';i++)passive=updateMatch(passive,.25);
  expect(passive.combat.baseHP).toBeLessThan(240);
 },60_000);
}
it('config20 preserves existing matches, ledger and views when migrating to21',()=>{
 const m=createMatch('skirmish','beginner',undefined,'frontier'),view={camera:{x:400,y:300},building:null};m.statLedger!.player.built=2;
 // Reconstruct the actual config20 terrain/resources, rather than relabeling a new reference-layout save.
 m.map=createMap('frontier','legacy');for(const node of resourceNodes(m.gathering))delete node.grove;delete m.fog!.forest;m.map.obstacles.push(...placementObstacles(m.gathering),...m.combat.enemies.flatMap(e=>e.footprint?[e.footprint]:[]));
 const doc=JSON.parse(encodeSave(m,view));delete doc.state.map.terrainLayout;delete doc.state.wildlife;doc.configVersion='tribute-config-20';legacyEnemyFixture(doc);const loaded=decodeSave(JSON.stringify(doc));
 expect(loaded.ok).toBe(true);if(loaded.ok){expect(loaded.match.statLedger).toEqual(m.statLedger);expect(loaded.match.gathering).toMatchObject({extraNodes:m.gathering.extraNodes});expect(loaded.view).toEqual(view);}
});
