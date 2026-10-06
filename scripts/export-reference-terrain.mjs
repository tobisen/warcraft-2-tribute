import {writeFileSync} from 'node:fs';
import {Surface,png} from './pixelArt.mjs';
import {referenceFrames,colors} from '../assets/sources/reference-terrain.mjs';
const sources=referenceFrames(Surface),image=new Surface(768,Math.ceil(sources.length/8)*96),frames={};
for(const [i,f] of sources.entries()){const x=i%8*96,y=Math.floor(i/8)*96;image.blit(f.image,x,y);frames[f.id]={frame:{x,y,w:f.image.width,h:f.image.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:f.image.width,h:f.image.height},sourceSize:{w:f.image.width,h:f.image.height}};}
const out=new URL('../public/assets/',import.meta.url);
writeFileSync(new URL('reference-terrain-atlas.png',out),png(image));
writeFileSync(new URL('reference-terrain-atlas.json',out),JSON.stringify({frames,meta:{image:'reference-terrain-atlas.png',size:{w:image.width,h:image.height},scale:'1',source:'assets/sources/reference-terrain.mjs',origin:'Original repo-authored pixels; no imported raster',colors}},null,2)+'\n');
