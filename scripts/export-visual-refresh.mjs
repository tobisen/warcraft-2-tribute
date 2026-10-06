import {readFileSync,writeFileSync} from 'node:fs';
import {Surface,png} from './pixelArt.mjs';
import {readRGBA} from './read-rgba-png.mjs';
import {refreshedFrame} from '../assets/sources/visual-refresh/frames.mjs';
const output=new URL('../public/assets/',import.meta.url);
const factions=['crown','clans','elves','dwarves','goblins'];
const manifest=JSON.parse(readFileSync(new URL('manifest.json',output)));
for(const atlas of ['units','buildings','naval','world']){
 const metadata=JSON.parse(readFileSync(new URL(`${atlas}-atlas.json`,output))),image=readRGBA(new URL(`${atlas}-atlas.png`,output));let changed=0;
 for(const [id,item] of Object.entries(metadata.frames)){
  const m=manifest.frames[id],f=item.frame;if(!m)continue;const sprite=refreshedFrame(atlas,m,id,f.w,f.h);if(!sprite)continue;for(let y=0;y<f.h;y++)for(let x=0;x<f.w;x++){const j=((f.y+y)*image.width+f.x+x)*4;image.data.set(sprite.data.subarray((y*f.w+x)*4,(y*f.w+x)*4+4),j);}changed++;
 }
 writeFileSync(new URL(`${atlas}-atlas.png`,output),png(image));manifest.atlases[atlas].refreshSource='assets/sources/visual-refresh/README.md';console.log(`Refreshed ${changed} ${atlas} frames`);
}
const airFrames={};let n=0;
for(const [row,faction] of factions.entries())for(const owner of ['player','enemy'])for(const direction of ['e','se','s','sw','w','nw','n','ne'])for(const state of ['idle','walk','attack','death'])for(let i=0;i<4;i++){
 const x=n%16*64,y=Math.floor(n/16)*64,id=`${faction}-air-${owner}-${direction}-${state}-${i}`;
 airFrames[id]={frame:{x,y,w:64,h:64},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:64,h:64},sourceSize:{w:64,h:64}};n++;
}
// 1280 cells: 16 columns ×80rows, packed within an ordinary desktop atlas.
const packed=new Surface(1024,Math.ceil(n/16)*64);for(const [id,v]of Object.entries(airFrames)){const f=v.frame;packed.blit(refreshedFrame('air',{},id,64,64),f.x,f.y);}
writeFileSync(new URL('air-atlas.png',output),png(packed));writeFileSync(new URL('air-atlas.json',output),JSON.stringify({frames:airFrames,meta:{image:'air-atlas.png',size:{w:packed.width,h:packed.height},scale:'1'}},null,2)+'\n');
manifest.atlases.air={image:'assets/air-atlas.png',data:'assets/air-atlas.json',width:packed.width,height:packed.height,refreshSource:'assets/sources/visual-refresh/README.md'};for(const [id,v]of Object.entries(airFrames))manifest.frames[id]={atlas:'air',width:64,height:64,anchor:{x:32,y:32}};
writeFileSync(new URL('manifest.json',output),JSON.stringify(manifest,null,2)+'\n');
