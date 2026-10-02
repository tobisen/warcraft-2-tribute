import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
import {buildingFrame,buildingOrigin} from '../src/presentation/assets';
const read=p=>JSON.parse(readFileSync(new URL(`../${p}`,import.meta.url),'utf8'));
const manifest=read('public/assets/manifest.json'),atlas=read('public/assets/buildings-atlas.json');
describe('building sprites preserve gameplay geometry',()=>{
 it('has three bounded native stages for each type and both teams',()=>{
  expect(Object.keys(atlas.frames)).toHaveLength(24);
  for(const owner of ['player','enemy'])for(const kind of ['base','barracks','farm','forge'])for(const stage of ['foundation','building','complete']){
   const id=`${kind}-${owner}-${stage}`,m=manifest.frames[id],f=atlas.frames[id].frame,size=kind==='farm'?64:128;
   expect(m).toMatchObject({kind:'building',owner,buildingType:kind,stage,width:size,height:size,anchor:{x:size/2,y:size*.75}});
   expect(f.x+f.w).toBeLessThanOrEqual(1024);expect(f.y+f.h).toBeLessThanOrEqual(384);expect(f.w).toBe(size);expect(f.h).toBe(size);
   expect(m.logicalFootprint).toEqual({width:kind==='base'?(owner==='player'?48:96):64,height:kind==='base'?(owner==='player'?48:96):64});
  }
 });
 it('switches at half progress and completion without changing anchors or team',()=>{
  for(const kind of ['base','barracks','farm','forge'])for(const owner of ['player','enemy']){expect(buildingFrame(kind,owner,5)).toBe(`${kind}-${owner}-foundation`);expect(buildingFrame(kind,owner,2.5)).toBe(`${kind}-${owner}-building`);expect(buildingFrame(kind,owner,0)).toBe(`${kind}-${owner}-complete`);expect(buildingFrame(kind,owner,-1)).toBe(`${kind}-${owner}-complete`);expect(buildingOrigin(kind)).toEqual({x:.5,y:.75});}
 });
 it('documents a readable original source and actual PNG RGBA export',()=>{expect(readFileSync(new URL('../assets/sources/buildings.mjs',import.meta.url),'utf8')).toContain('Original');const png=readFileSync(new URL('../public/assets/buildings-atlas.png',import.meta.url));expect(png[25]).toBe(6);expect(png.readUInt32BE(16)).toBe(1024);expect(png.readUInt32BE(20)).toBe(384);});
});
