import {inflateSync} from 'node:zlib';
import {combatConfig} from '../src/config/combat';
import {forgeConfig} from '../src/config/upgrades';
import {navyConfig} from '../src/config/navy';
import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
import {buildingFrame,buildingOrigin} from '../src/presentation/assets';
const read=p=>JSON.parse(readFileSync(new URL(`../${p}`,import.meta.url),'utf8'));
const manifest=read('public/assets/manifest.json'),atlas=read('public/assets/buildings-atlas.json');
describe('building sprites preserve gameplay geometry',()=>{
 it('has four bounded native states for each type and both teams',()=>{
  expect(Object.keys(atlas.frames)).toHaveLength(80);
  for(const faction of ['crown','clans'])for(const owner of ['player','enemy'])for(const kind of ['base','barracks','farm','forge','harbor'])for(const stage of ['foundation','building','complete','damaged']){
   const id=`${faction==='clans'?'clans-':''}${kind}-${owner}-${stage}`,m=manifest.frames[id],f=atlas.frames[id].frame,size=kind==='farm'?64:128;
   expect(m).toMatchObject({kind:'building',faction,owner,buildingType:kind,stage,width:size,height:size,anchor:{x:size/2,y:size*.75}});
   expect(f.x+f.w).toBeLessThanOrEqual(1024);expect(f.y+f.h).toBeLessThanOrEqual(1280);expect(f.w).toBe(size);expect(f.h).toBe(size);
   expect(m.logicalFootprint).toEqual({width:kind==='base'?(owner==='player'?48:96):64,height:kind==='base'?(owner==='player'?48:96):64});
  }
 });
 it('switches at half progress and completion without changing anchors or team',()=>{
  for(const faction of ['crown','clans'])for(const kind of ['base','barracks','farm','forge','harbor'])for(const owner of ['player','enemy']){expect(buildingFrame(kind,owner,5,5,faction)).toBe(`${faction==='clans'?'clans-':''}${kind}-${owner}-foundation`);expect(buildingFrame(kind,owner,2.5,5,faction)).toBe(`${faction==='clans'?'clans-':''}${kind}-${owner}-building`);expect(buildingFrame(kind,owner,0,5,faction)).toBe(`${faction==='clans'?'clans-':''}${kind}-${owner}-complete`);expect(buildingFrame(kind,owner,-1,5,faction)).toBe(`${faction==='clans'?'clans-':''}${kind}-${owner}-complete`);expect(buildingOrigin(kind)).toEqual({x:.5,y:.75});}
 });
 it('documents a readable original source and actual PNG RGBA export',()=>{expect(readFileSync(new URL('../assets/sources/buildings.mjs',import.meta.url),'utf8')).toContain('Original');const png=readFileSync(new URL('../public/assets/buildings-atlas.png',import.meta.url));expect(png[25]).toBe(6);expect(png.readUInt32BE(16)).toBe(1024);expect(png.readUInt32BE(20)).toBe(1280);});
 it('damage uses each building maximum and never replaces an unfinished stage',()=>{
  const hp={base:combatConfig.baseHP,barracks:combatConfig.barracksHP,farm:combatConfig.farmHP,forge:forgeConfig.hp,harbor:navyConfig.harbor.hp};
  for(const faction of ['crown','clans'])for(const owner of ['player','enemy'])for(const kind of Object.keys(hp)){
   const prefix=`${faction==='clans'?'clans-':''}${kind}-${owner}-`;
   expect(buildingFrame(kind,owner,0,5,faction,hp[kind]/2+.01)).toBe(prefix+'complete');
   expect(buildingFrame(kind,owner,0,5,faction,hp[kind]/2)).toBe(prefix+'damaged');
   expect(buildingFrame(kind,owner,0,5,faction,1)).toBe(prefix+'damaged');
   expect(buildingFrame(kind,owner,5,5,faction,1)).toBe(prefix+'foundation');
   expect(buildingFrame(kind,owner,2.5,5,faction,1)).toBe(prefix+'building');
  }
 });
 it('all four actual raster states differ, stay palette-only, transparent and retain team colors',()=>{
  const png=readFileSync(new URL('../public/assets/buildings-atlas.png',import.meta.url)),chunks=[];
  for(let pos=8;pos<png.length;){const n=png.readUInt32BE(pos);if(png.subarray(pos+4,pos+8).toString()==='IDAT')chunks.push(png.subarray(pos+8,pos+8+n));pos+=n+12;}
  const raw=inflateSync(Buffer.concat(chunks)),stride=1024*4+1,palette=read('assets/palette.json'),colors=new Set(Object.values(palette));
  for(const faction of ['crown','clans'])for(const owner of ['player','enemy'])for(const kind of ['base','barracks','farm','forge','harbor']){
   const states=[];
   for(const stage of ['foundation','building','complete','damaged']){
    const f=atlas.frames[`${faction==='clans'?'clans-':''}${kind}-${owner}-${stage}`].frame,data=Buffer.alloc(f.w*f.h*4),seen=new Set();
    for(let y=0;y<f.h;y++)for(let x=0;x<f.w;x++){
     const p=(f.y+y)*stride+1+(f.x+x)*4,at=(y*f.w+x)*4;raw.copy(data,at,p,p+4);
     if(raw[p+3]){const c='#'+raw.subarray(p,p+3).toString('hex');seen.add(c);}
    }
    // Validate every opaque color once per frame instead of an assertion per pixel.
    expect([...seen].filter(c=>!colors.has(c))).toEqual([]);
    expect(data[3]).toBe(0);if(stage==='complete'||stage==='damaged')expect(seen.has(owner==='player'?palette.teamBlue:palette.teamRed)).toBe(true);
    states.push(data.toString('base64'));
   }
   expect(new Set(states).size).toBe(4);
  }
 });

});
