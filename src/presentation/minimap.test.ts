import { describe,expect,it } from 'vitest';
import { cameraIndicator,minimapCamera,minimapData,minimapContent,minimapToWorld,worldToMinimap } from './minimap';
import { createMatch } from '../gameplay/match';
const world={width:1280,height:960},viewport={width:800,height:600};
describe('minimap camera and snapshots',()=>{
 it('converts exact corners/center and clamps points outside the map',()=>{
  for(const p of [{x:0,y:0},{x:1280,y:960},{x:640,y:480},{x:1008,y:144}])expect(minimapToWorld(worldToMinimap(p,world),world)).toEqual(p);
  expect(minimapToWorld({x:-1,y:160},world)).toEqual({x:0,y:960});expect(worldToMinimap({x:9999,y:-3},world)).toEqual({x:160,y:20});
 });
 it('centers and clamps camera at every minimap edge, and for a smaller world',()=>{
  expect(minimapCamera({x:0,y:0},world,viewport)).toEqual({x:0,y:0});expect(minimapCamera({x:160,y:160},world,viewport)).toEqual({x:480,y:360});expect(minimapCamera({x:80,y:80},world,viewport)).toEqual({x:240,y:180});expect(minimapCamera({x:160,y:160},{width:400,height:300},viewport)).toEqual({x:0,y:0});
 });
 it('scales the viewport rectangle including clamped far-world edge',()=>{
  expect(cameraIndicator({x:0,y:0},world,viewport)).toEqual({x:0,y:20,width:100,height:75});expect(cameraIndicator({x:9999,y:9999},world,viewport)).toEqual({x:60,y:65,width:100,height:75});expect(cameraIndicator({x:100,y:100},{width:400,height:300},viewport)).toEqual({x:0,y:20,width:160,height:120});
 });
 it('creates fresh live data, supports visibility filtering, and cannot modify selection/orders',()=>{
  const s=createMatch('skirmish');s.gathering.units[0].selected=true;s.gathering.units[0].order={kind:'move'};const before=JSON.stringify(s),data=minimapData(s,m=>m.owner!=='enemy');
  expect(data.markers.some(m=>m.owner==='enemy')).toBe(false);expect(data.markers.filter(m=>m.id.startsWith('unit-'))).toHaveLength(3);minimapCamera({x:160,y:160},s.map,viewport);expect(JSON.stringify(s)).toBe(before);
  data.terrain[0].x=-999;data.markers[0].position.x=-999;expect(JSON.stringify(s)).toBe(before);
  s.gathering.units.pop();s.combat.enemies=[];expect(minimapData(s).markers.filter(m=>m.id.startsWith('unit-'))).toHaveLength(2);expect(minimapData(createMatch('survival')).markers.some(m=>m.owner==='enemy')).toBe(false);expect(minimapData(createMatch('skirmish')).markers.some(m=>m.id==='enemy-base')).toBe(true);
 });
});

it('fits rectangular maps and clamps clicks in the letterbox without distortion',()=>{
 const world={width:3200,height:1600},area=minimapContent(world);expect(area).toEqual({x:0,y:40,width:160,height:80});
 expect(worldToMinimap({x:1600,y:800},world)).toEqual({x:80,y:80});expect(minimapToWorld({x:80,y:0},world)).toEqual({x:1600,y:0});expect(minimapToWorld({x:80,y:160},world)).toEqual({x:1600,y:1600});
 const squareWorldSize=worldToMinimap({x:100,y:100},world);expect(squareWorldSize.x).toBe(squareWorldSize.y-40);
});
