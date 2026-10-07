import {readFileSync,writeFileSync} from 'node:fs';
import {Surface,png} from './pixelArt.mjs';
import {readRGBA} from './read-rgba-png.mjs';
import {reduceSprite} from '../assets/sources/visual-refresh/sample.mjs';
const frames={},atlas=new Surface(384,192);
for(const [row,id]of ['bramblemaw','gravelheart'].entries()){
 const sheet=readRGBA(new URL(`../assets/sources/bosses/${id}.png`,import.meta.url));
 for(let col=0;col<4;col++){
  const x=Math.floor(col*sheet.width/4),right=Math.floor((col+1)*sheet.width/4),sprite=new Surface(96,96);
  // Equal source cells and one shared scale preserve the wind-up's height and the corpse's size.
  const reduced=reduceSprite({sheet,x,y:0,width:right-x,height:sheet.height},72,96);
  for(let y=0;y<96;y++)for(let xx=0;xx<72;xx++)sprite.data.set(reduced.subarray((y*72+xx)*4,(y*72+xx)*4+4),(y*96+xx+12)*4);
  atlas.blit(sprite,col*96,row*96);frames[`${id}-${col}`]={frame:{x:col*96,y:row*96,w:96,h:96},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:96,h:96},sourceSize:{w:96,h:96}};
 }
}
writeFileSync(new URL('../public/assets/bosses-atlas.png',import.meta.url),png(atlas));writeFileSync(new URL('../public/assets/bosses-atlas.json',import.meta.url),JSON.stringify({frames,meta:{image:'bosses-atlas.png',size:{w:384,h:192},scale:'1'}},null,2)+'\n');

const manifestPath=new URL('../public/assets/manifest.json',import.meta.url),manifest=JSON.parse(readFileSync(manifestPath));manifest.atlases.bosses={image:'assets/bosses-atlas.png',data:'assets/bosses-atlas.json',width:384,height:192,source:'assets/sources/bosses/README.md'};for(const [id,v]of Object.entries(frames))manifest.frames[id]={atlas:'bosses',kind:'boss',width:96,height:96,anchor:{x:48,y:75}};writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
