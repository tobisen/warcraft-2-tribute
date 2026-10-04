import atlasJSON from '../../public/assets/world-atlas.json?raw';
import manifestJSON from '../../public/assets/manifest.json?raw';
import {describe,expect,it} from 'vitest';
import {maps,type MapId} from '../config/maps';
import {createMap,blockedTile} from '../gameplay/map';
import {terrainFrame,terrainImageFrame,terrainEdges,terrainDetails,resourceFrame,resourceOrigin} from './assets';
const atlas=JSON.parse(atlasJSON);
const manifest=JSON.parse(manifestJSON);
describe('terrain presentation preserves the gameplay map',()=>{
 for(const id of Object.keys(maps) as MapId[])it(`${id}: complete frame coverage and exact exposed edges`,()=>{
  const map=createMap(id);
  for(let row=0;row<map.height/map.tileSize;row++)for(let col=0;col<map.width/map.tileSize;col++){
   const frame=terrainFrame(col,row,id),kind=frame.startsWith('grass')?'grass':frame;
   expect(blockedTile(map,{column:col,row})).toBe(kind!=='grass');
   expect(atlas.frames[terrainImageFrame(col,row,id)]).toBeDefined();
   const details=terrainDetails(col,row,id);if(kind!=='grass')expect(details).toEqual([]);for(const detail of details)expect(atlas.frames[detail]).toBeDefined();
   const edges=terrainEdges(col,row,id);for(const e of edges)expect(atlas.frames[e]).toBeDefined();
   for(const [dx,dy,side] of [[0,-1,'n'],[1,0,'e'],[0,1,'s'],[-1,0,'w']] as const){
    const x=col+dx,y=row+dy,inside=x>=0&&y>=0&&x<map.width/map.tileSize&&y<map.height/map.tileSize;
    expect(edges.includes(`edge-${kind}-${side}`)).toBe(kind!=='grass'&&inside&&terrainFrame(x,y,id)!==kind);
   }
  }
 });
 it('forest canopy only occupies blocked rock and tracks stay off water',()=>{expect(terrainImageFrame(5,4,'forest')).toBe('forest-rock');expect(terrainDetails(12,14,'arena')).toContain('road-e');expect(terrainDetails(25,14,'frontier')).toEqual([]);});
 it('shared water joins get diagonal corners but no internal or out-of-world shore',()=>{
  expect(terrainEdges(22,1,'islands')).toContain('corner-water-sw');
  expect(terrainEdges(23,1,'islands')).not.toContain('corner-water-sw');
  expect(terrainEdges(0,0,'islands')).toEqual([]);
  expect(terrainEdges(23,10,'islands')).toEqual([]);
 });
 it('variations are repeatable and avoid a two-frame checkerboard',()=>{
  const frames=new Set<string>();for(let y=0;y<3;y++)for(let x=10;x<20;x++){
   const frame=terrainImageFrame(x,y);frames.add(frame);expect(terrainImageFrame(x,y)).toBe(frame);
  }expect(frames.size).toBe(4);
  expect(terrainImageFrame(24,10,'islands')).not.toBe(terrainImageFrame(24,11,'islands'));
 });
 it('every atlas frame is in bounds and resource states keep anchors and footprints',()=>{
  for(const entry of Object.values(atlas.frames) as {frame:{x:number;y:number;w:number;h:number}}[]){
   const f=entry.frame;expect(f.x).toBeGreaterThanOrEqual(0);expect(f.y).toBeGreaterThanOrEqual(0);expect(f.x+f.w).toBeLessThanOrEqual(atlas.meta.size.w);expect(f.y+f.h).toBeLessThanOrEqual(atlas.meta.size.h);
  }
  expect(resourceOrigin).toEqual({x:.5,y:.625});
  for(const type of ['wood','gold'] as const){
   expect(resourceFrame(type,0,true)).toBe(`${type}-depleted`);expect(resourceFrame(type,0,false)).toBe(`${type}-available`);
   for(const state of ['available','depleted']){
    expect(manifest.frames[`${type}-${state}`].anchor).toEqual({x:32,y:40});
    expect(manifest.frames[`${type}-${state}`].logicalFootprint).toEqual({x:-20,y:-20,width:40,height:40});
   }
  }
 });
});
