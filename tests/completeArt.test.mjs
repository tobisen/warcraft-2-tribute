import {readFileSync} from 'node:fs';import {inflateSync} from 'node:zlib';import {describe,it,expect} from 'vitest';
import {Surface} from '../scripts/pixelArt.mjs';import {rosterUnit} from '../assets/sources/roster-complete.mjs';
import {settlement} from '../assets/sources/settlement-complete.mjs';
import {unitOrigin,unitFrame,motion,unitOverlayOffsets} from '../src/presentation/animation';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url)),p=JSON.parse(read('assets/palette.json')),manifest=JSON.parse(read('public/assets/manifest.json'));
function sheet(kind){const atlas=JSON.parse(read(`public/assets/${kind}-atlas.json`)),png=read(`public/assets/${kind}-atlas.png`),chunks=[];for(let at=8;at<png.length;){const n=png.readUInt32BE(at);if(png.subarray(at+4,at+8).toString()==='IDAT')chunks.push(png.subarray(at+8,at+8+n));at+=n+12;}const raw=inflateSync(Buffer.concat(chunks)),stride=png.readUInt32BE(16)*4+1;expect(Array.from({length:png.readUInt32BE(20)},(_,y)=>raw[y*stride]).every(n=>n===0)).toBe(true);return id=>{const f=atlas.frames[id],data=Buffer.alloc(f.frame.w*f.frame.h*4);expect(f.rotated).toBe(false);expect(f.trimmed).toBe(false);for(let y=0;y<f.frame.h;y++){raw.copy(data,y*f.frame.w*4,(f.frame.y+y)*stride+1+f.frame.x*4,(f.frame.y+y)*stride+1+(f.frame.x+f.frame.w)*4);}return data;};}
describe('RTS-155 complete reference roster and settlement (technical evidence, not an aesthetic approval)',()=>{
 it('every other faction unit pose exactly equals its source, has transparent margins and stable feet',()=>{
  const frame=sheet('units'),dirs=['e','se','s','sw','w','nw','n','ne'];
  for(const faction of ['crown','clans','elves','dwarves','goblins'])for(const type of ['archer','specialist','catapult'])for(const owner of ['player','enemy'])for(let dir=0;dir<8;dir++)for(const state of type==='worker'?['idle','walk','attack','death','gather','build']:['idle','walk','attack','death'])for(let n=0;n<(state==='idle'?1:4);n++){
   const id=`${faction==='crown'?'':faction+'-'}${type}-${owner}-${dirs[dir]}-${state}-${n}`,source=rosterUnit(Surface,p,faction,type,owner,dir,state,n),data=frame(id);expect(data.equals(Buffer.from(source.data)),id).toBe(true);
   if(state!=='death'){let top=0;while(top<64&&!data.subarray(top*64*4,(top+1)*64*4).some((v,i)=>i%4===3&&v))top++;expect(-unitOverlayOffsets(type,faction).hp+4,`${id} HP overlaps sprite`).toBeLessThan(top-(type==='catapult'?40:44));}
   expect(manifest.frames[id]).toMatchObject({width:64,height:64,anchor:{x:32,y:type==='catapult'?40:44}});expect(unitOrigin(type)).toEqual({x:32/64,y:(type==='catapult'?40:44)/64});
   expect(Array.from({length:64},(_,i)=>[[i,0],[i,63],[0,i],[63,i]]).flat().every(([x,y])=>data[(y*64+x)*4+3]===0),`${id} clipped edge`).toBe(true);
   expect(manifest.frames[unitFrame(motion(undefined,{x:0,y:0},state,0,type,owner,undefined,faction),n/8)]).toBeDefined();
  }
 });
 it('each remaining building stage equals its source; transparent edges, team and logical footprint survive',()=>{
  const frame=sheet('buildings');for(const faction of ['crown','clans','elves','dwarves','goblins'])for(const kind of ['barracks','farm','forge'])for(const owner of ['player','enemy'])for(const stage of ['foundation','building','complete','damaged']){const prefix=faction==='crown'?'':faction+'-',id=`${prefix}${kind}-${owner}-${stage}`,source=settlement(Surface,p,faction,kind,owner,stage),data=frame(id),size=kind==='farm'?64:128;expect(data.equals(Buffer.from(source.data)),id).toBe(true);expect(manifest.frames[id]).toMatchObject({anchor:{x:size/2,y:size*.75},logicalFootprint:{width:64,height:64}});expect(Array.from({length:size},(_,i)=>[[i,0],[i,size-1],[0,i],[size-1,i]]).flat().every(([x,y])=>data[(y*size+x)*4+3]===0),`${id} clipped edge`).toBe(true);}

 });
});
