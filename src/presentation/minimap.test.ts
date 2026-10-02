import { describe,expect,it } from 'vitest';
import { cameraIndicator,minimapCamera,minimapData,minimapToWorld,worldToMinimap } from './minimap';
import { createMatch } from '../gameplay/match';
const world={width:1280,height:960},viewport={width:800,height:600};
describe('minimap camera and snapshots',()=>{
 it('converts exact corners/center and clamps points outside the map',()=>{
  for(const p of [{x:0,y:0},{x:1280,y:960},{x:640,y:480},{x:1008,y:144}])expect(minimapToWorld(worldToMinimap(p,world),world)).toEqual(p);
  expect(minimapToWorld({x:-1,y:151},world)).toEqual({x:0,y:960});expect(worldToMinimap({x:9999,y:-3},world)).toEqual({x:200,y:0});
 });
 it('centers and clamps camera at every minimap edge, and for a smaller world',()=>{
  expect(minimapCamera({x:0,y:0},world,viewport)).toEqual({x:0,y:0});expect(minimapCamera({x:200,y:150},world,viewport)).toEqual({x:480,y:360});expect(minimapCamera({x:100,y:75},world,viewport)).toEqual({x:240,y:180});expect(minimapCamera({x:200,y:150},{width:400,height:300},viewport)).toEqual({x:0,y:0});
 });
 it('scales the viewport rectangle including clamped far-world edge',()=>{
  expect(cameraIndicator({x:0,y:0},world,viewport)).toEqual({x:0,y:0,width:125,height:93.75});expect(cameraIndicator({x:9999,y:9999},world,viewport)).toEqual({x:75,y:56.25,width:125,height:93.75});expect(cameraIndicator({x:100,y:100},{width:400,height:300},viewport)).toEqual({x:0,y:0,width:200,height:150});
 });
 it('creates fresh live data, supports visibility filtering, and cannot modify selection/orders',()=>{
  const s=createMatch('skirmish');s.gathering.units[0].selected=true;s.gathering.units[0].order={kind:'move'};const before=JSON.stringify(s),data=minimapData(s,m=>m.owner!=='enemy');
  expect(data.markers.some(m=>m.owner==='enemy')).toBe(false);expect(data.markers.filter(m=>m.id.startsWith('unit-'))).toHaveLength(3);minimapCamera({x:200,y:150},s.map,viewport);expect(JSON.stringify(s)).toBe(before);
  data.terrain[0].x=-999;data.markers[0].position.x=-999;expect(JSON.stringify(s)).toBe(before);
  s.gathering.units.pop();s.combat.enemies=[];expect(minimapData(s).markers.filter(m=>m.id.startsWith('unit-'))).toHaveLength(2);expect(minimapData(createMatch('survival')).markers.some(m=>m.owner==='enemy')).toBe(false);expect(minimapData(createMatch('skirmish')).markers.some(m=>m.id==='enemy-base')).toBe(true);
 });
});
