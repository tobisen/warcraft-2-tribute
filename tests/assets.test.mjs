import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { describe,expect,it } from 'vitest';
import { terrainFrame,terrainEdges,resourceFrame,resourceOrigin } from '../src/presentation/assets';
import { createMap,blockedTile } from '../src/gameplay/map';
import { gatheringConfig,goldConfig } from '../src/config/gathering';
const file=(path)=>readFileSync(new URL(`../${path}`,import.meta.url));
const manifest=JSON.parse(file('public/assets/manifest.json').toString()),atlas=JSON.parse(file('public/assets/world-atlas.json').toString());
const png=file('public/assets/world-atlas.png');
describe('native pixel exports and logical anchors',()=>{
 it('exports a real 8-bit RGBA PNG with matching atlas dimensions and stable IDs',()=>{
  expect([...png.subarray(0,8)]).toEqual([137,80,78,71,13,10,26,10]);expect(png.readUInt32BE(16)).toBe(256);expect(png.readUInt32BE(20)).toBe(192);expect(png[24]).toBe(8);expect(png[25]).toBe(6);expect(Object.keys(manifest.frames).filter(id=>manifest.frames[id].atlas==='world').sort()).toEqual(Object.keys(atlas.frames).sort());expect(Object.keys(manifest.frames).filter(id=>manifest.frames[id].atlas==='world')).toHaveLength(23);
 });
 it('bounds every frame, avoids overlap and validates source/manifest files',()=>{
  const frames=Object.entries(atlas.frames);
  for(const [id,f] of frames){expect(f.rotated).toBe(false);expect(f.trimmed).toBe(false);expect(f.frame.x).toBeGreaterThanOrEqual(0);expect(f.frame.y).toBeGreaterThanOrEqual(0);expect(f.frame.x+f.frame.w).toBeLessThanOrEqual(256);expect(f.frame.y+f.frame.h).toBeLessThanOrEqual(192);expect(manifest.frames[id].width).toBe(f.frame.w);expect(manifest.frames[id].height).toBe(f.frame.h);}
  for(let a=0;a<frames.length;a++)for(let b=a+1;b<frames.length;b++){const x=frames[a][1].frame,y=frames[b][1].frame;expect(x.x<y.x+y.w&&x.x+x.w>y.x&&x.y<y.y+y.h&&x.y+x.h>y.y).toBe(false);}
  expect(file(manifest.source).length).toBeGreaterThan(0);expect(file(manifest.palette).length).toBeGreaterThan(0);
 });
 it('resource corners are actually transparent and all opaque colors are from the documented palette',()=>{
  const chunks=[];for(let pos=8;pos<png.length;){const length=png.readUInt32BE(pos),type=png.subarray(pos+4,pos+8).toString();if(type==='IDAT')chunks.push(png.subarray(pos+8,pos+8+length));pos+=length+12;}
  const raw=inflateSync(Buffer.concat(chunks)),stride=256*4+1,palette=new Set(Object.values(JSON.parse(file('assets/palette.json').toString())).map(c=>String(c).toLowerCase()));expect(raw.length).toBe(stride*192);
  for(let y=0;y<192;y++){expect(raw[y*stride]).toBe(0);for(let x=0;x<256;x++){const p=y*stride+1+x*4;if(raw[p+3])expect(palette.has(`#${raw.subarray(p,p+3).toString('hex')}`)).toBe(true);}}
  for(const [id,definition] of Object.entries(manifest.frames))if(definition.kind==='resource'){const f=atlas.frames[id].frame;expect(raw[f.y*stride+1+f.x*4+3]).toBe(0);}
 });
 it('maps all current terrain IDs at native 32px while keeping walkability intact',()=>{
  const map=createMap();for(let row=0;row<30;row++)for(let col=0;col<40;col++){const frame=terrainFrame(col,row);expect(manifest.frames[frame]).toMatchObject({width:32,height:32,anchor:{x:0,y:0}});expect(blockedTile(map,{column:col,row})).toBe(frame==='rock'||frame==='water');}
 });
 it('blends only exposed terrain edges without seams inside patches',()=>{expect(terrainEdges(3,3)).toEqual(['edge-rock-n','edge-rock-w']);expect(terrainEdges(4,4)).toEqual([]);expect(terrainEdges(0,0)).toEqual([]);expect(terrainEdges(3,14)).toContain('edge-water-n');});
 it('maps observed depletion and preserves existing amounts/footprints/anchors',()=>{
  expect(resourceFrame('wood',1,true)).toBe('wood-available');expect(resourceFrame('wood',0,true)).toBe('wood-depleted');expect(resourceFrame('gold',0,true)).toBe('gold-depleted');expect(resourceFrame('gold',0,false)).toBe('gold-available');expect(resourceOrigin).toEqual({x:.5,y:.625});
  for(const type of ['wood','gold'])for(const state of ['available','depleted'])expect(manifest.frames[`${type}-${state}`]).toMatchObject({width:64,height:64,anchor:{x:32,y:40},logicalFootprint:{width:gatheringConfig.nodeRadius*2,height:gatheringConfig.nodeRadius*2}});expect(gatheringConfig.initialWood).toBe(400);expect(goldConfig.initialAmount).toBe(300);
 });
});
