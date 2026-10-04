import {readFileSync} from 'node:fs';import {inflateSync} from 'node:zlib';import {describe,it,expect} from 'vitest';
import {Surface} from '../scripts/pixelArt.mjs';import {factionUnit} from '../assets/sources/faction-people.mjs';
import {factionBase} from '../assets/sources/faction-bases.mjs';
import {unitOrigin,unitFrame,motion,unitOverlayOffsets} from '../src/presentation/animation';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url)),p=JSON.parse(read('assets/palette.json')),manifest=JSON.parse(read('public/assets/manifest.json'));
function sheet(kind){const atlas=JSON.parse(read(`public/assets/${kind}-atlas.json`)),png=read(`public/assets/${kind}-atlas.png`),chunks=[];for(let at=8;at<png.length;){const n=png.readUInt32BE(at);if(png.subarray(at+4,at+8).toString()==='IDAT')chunks.push(png.subarray(at+8,at+8+n));at+=n+12;}const raw=inflateSync(Buffer.concat(chunks)),stride=png.readUInt32BE(16)*4+1;return id=>{const f=atlas.frames[id],data=Buffer.alloc(f.frame.w*f.frame.h*4);expect(f.rotated).toBe(false);expect(f.trimmed).toBe(false);for(let y=0;y<f.frame.h;y++){expect(raw[(f.frame.y+y)*stride]).toBe(0);raw.copy(data,y*f.frame.w*4,(f.frame.y+y)*stride+1+f.frame.x*4,(f.frame.y+y)*stride+1+(f.frame.x+f.frame.w)*4);}return data;};}
describe('RTS-155 faction art export (technical evidence, not an aesthetic approval)',()=>{
 it('every other faction unit pose exactly equals its source, has transparent margins and stable feet',()=>{
  const frame=sheet('units'),dirs=['e','se','s','sw','w','nw','n','ne'];
  for(const faction of ['clans','elves','dwarves','goblins'])for(const type of ['worker','soldier'])for(const owner of ['player','enemy'])for(let dir=0;dir<8;dir++)for(const state of type==='worker'?['idle','walk','attack','death','gather','build']:['idle','walk','attack','death'])for(let n=0;n<(state==='idle'?1:4);n++){
   const id=`${faction}-${type}-${owner}-${dirs[dir]}-${state}-${n}`,source=factionUnit(Surface,p,faction,type,owner,dir,state,n),data=frame(id);expect(data.equals(Buffer.from(source.data)),id).toBe(true);
   if(state!=='death'){let top=0;while(top<64&&!data.subarray(top*64*4,(top+1)*64*4).some((v,i)=>i%4===3&&v))top++;expect(-unitOverlayOffsets(type,faction).hp+4,`${id} HP overlaps sprite`).toBeLessThan(top-44);}
   expect(manifest.frames[id]).toMatchObject({width:64,height:64,anchor:{x:32,y:44}});expect(unitOrigin(type)).toEqual({x:32/64,y:44/64});
   for(let i=0;i<64;i++)for(const xy of [[i,0],[i,63],[0,i],[63,i]])expect(data[(xy[1]*64+xy[0])*4+3],`${id} clipped at ${xy}`).toBe(0);
   expect(manifest.frames[unitFrame(motion(undefined,{x:0,y:0},state,0,type,owner,undefined,faction),n/8)]).toBeDefined();
  }
 });
 it('each base stage equals its source; transparent edges, team and logical footprint survive',()=>{
  const frame=sheet('buildings');for(const faction of ['clans','elves','dwarves','goblins'])for(const owner of ['player','enemy'])for(const stage of ['foundation','building','complete','damaged']){const id=`${faction}-base-${owner}-${stage}`,source=factionBase(Surface,p,faction,owner,stage),data=frame(id);expect(data.equals(Buffer.from(source.data)),id).toBe(true);expect(manifest.frames[id]).toMatchObject({anchor:{x:64,y:96},logicalFootprint:{width:owner==='player'?48:96,height:owner==='player'?48:96}});for(let i=0;i<128;i++)for(const [x,y]of [[i,0],[i,127],[0,i],[127,i]])expect(data[(y*128+x)*4+3],`${id} clipped edge`).toBe(0);}
 });
});
