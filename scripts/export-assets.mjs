import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { Surface,png } from './pixelArt.mjs';
import { unitFrames,animationSpec,directions } from '../assets/sources/units.mjs';
import { buildingFrames } from '../assets/sources/buildings.mjs';
import { worldFrames } from '../assets/sources/world.mjs';
const palette=JSON.parse(readFileSync(new URL('../assets/palette.json',import.meta.url),'utf8'));
const output=new URL('../public/assets/',import.meta.url);mkdirSync(output,{recursive:true});
const image=new Surface(256,160),frames={},manifest={version:1,palette:'assets/palette.json',source:'assets/sources/world.mjs',origin:'original repo-local pixel sources; no imported game artwork',atlases:{world:{image:'/assets/world-atlas.png',data:'/assets/world-atlas.json',width:256,height:160}},frames:{}};
for(const f of worldFrames(Surface,palette)){
 image.blit(f.image,f.x,f.y);frames[f.id]={frame:{x:f.x,y:f.y,w:f.image.width,h:f.image.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:f.image.width,h:f.image.height},sourceSize:{w:f.image.width,h:f.image.height}};
 manifest.frames[f.id]={atlas:'world',kind:f.kind,width:f.image.width,height:f.image.height,anchor:f.anchor,...(f.logicalFootprint?{logicalFootprint:f.logicalFootprint}:{})};
}
writeFileSync(new URL('world-atlas.png',output),png(image));writeFileSync(new URL('world-atlas.json',output),JSON.stringify({frames,meta:{image:'world-atlas.png',size:{w:256,h:160},scale:'1'}},null,2)+'\n');writeFileSync(new URL('manifest.json',output),JSON.stringify(manifest,null,2)+'\n');
const buildingImage=new Surface(1024,384),buildingAtlas={};
for(const f of buildingFrames(Surface,palette)){buildingImage.blit(f.image,f.x,f.y);buildingAtlas[f.id]={frame:{x:f.x,y:f.y,w:f.image.width,h:f.image.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:f.image.width,h:f.image.height},sourceSize:{w:f.image.width,h:f.image.height}};manifest.frames[f.id]={atlas:'buildings',width:f.image.width,height:f.image.height,anchor:f.anchor,logicalFootprint:f.logicalFootprint,kind:f.kind,owner:f.owner,buildingType:f.buildingType,stage:f.stage};}
manifest.atlases.buildings={image:'/assets/buildings-atlas.png',data:'/assets/buildings-atlas.json',width:1024,height:384,source:'assets/sources/buildings.mjs'};
writeFileSync(new URL('buildings-atlas.png',output),png(buildingImage));writeFileSync(new URL('buildings-atlas.json',output),JSON.stringify({frames:buildingAtlas,meta:{image:'buildings-atlas.png',size:{w:1024,h:384},scale:'1'}},null,2)+'\n');writeFileSync(new URL('manifest.json',output),JSON.stringify(manifest,null,2)+'\n');
const unitImage=new Surface(2048,2048),unitAtlas={};
for(const f of unitFrames(Surface,palette)){unitImage.blit(f.image,f.x,f.y);unitAtlas[f.id]={frame:{x:f.x,y:f.y,w:f.image.width,h:f.image.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:f.image.width,h:f.image.height},sourceSize:{w:f.image.width,h:f.image.height}};manifest.frames[f.id]={atlas:'units',width:f.image.width,height:f.image.height,anchor:f.anchor,kind:f.kind,type:f.type,owner:f.owner,direction:f.direction,state:f.state,frame:f.frame};}
manifest.atlases.units={image:'/assets/units-atlas.png',data:'/assets/units-atlas.json',width:2048,height:2048,source:'assets/sources/units.mjs',slotSize:64,directions,animations:animationSpec};
writeFileSync(new URL('units-atlas.png',output),png(unitImage));writeFileSync(new URL('units-atlas.json',output),JSON.stringify({frames:unitAtlas,meta:{image:'units-atlas.png',size:{w:2048,h:2048},scale:'1'}},null,2)+'\n');writeFileSync(new URL('manifest.json',output),JSON.stringify(manifest,null,2)+'\n');
console.log(`Exported ${Object.keys(frames).length} original world/resource frames.`);
