import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { Surface,png } from './pixelArt.mjs';
import { worldFrames } from '../assets/sources/world.mjs';
const palette=JSON.parse(readFileSync(new URL('../assets/palette.json',import.meta.url),'utf8'));
const output=new URL('../public/assets/',import.meta.url);mkdirSync(output,{recursive:true});
const image=new Surface(256,128),frames={},manifest={version:1,palette:'assets/palette.json',source:'assets/sources/world.mjs',origin:'original repo-local pixel sources; no imported game artwork',atlases:{world:{image:'/assets/world-atlas.png',data:'/assets/world-atlas.json',width:256,height:128}},frames:{}};
for(const f of worldFrames(Surface,palette)){
 image.blit(f.image,f.x,f.y);frames[f.id]={frame:{x:f.x,y:f.y,w:f.image.width,h:f.image.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:f.image.width,h:f.image.height},sourceSize:{w:f.image.width,h:f.image.height}};
 manifest.frames[f.id]={atlas:'world',kind:f.kind,width:f.image.width,height:f.image.height,anchor:f.anchor,...(f.logicalFootprint?{logicalFootprint:f.logicalFootprint}:{})};
}
writeFileSync(new URL('world-atlas.png',output),png(image));writeFileSync(new URL('world-atlas.json',output),JSON.stringify({frames,meta:{image:'world-atlas.png',size:{w:256,h:128},scale:'1'}},null,2)+'\n');writeFileSync(new URL('manifest.json',output),JSON.stringify(manifest,null,2)+'\n');
console.log(`Exported ${Object.keys(frames).length} original world/resource frames.`);
