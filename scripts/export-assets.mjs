import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import {navalFrames,navalDirections} from '../assets/sources/naval.mjs';
import { Surface,png } from './pixelArt.mjs';
import { uiFrames } from '../assets/sources/ui.mjs';
import { unitFrames,animationSpec,directions } from '../assets/sources/units.mjs';
import { buildingFrames } from '../assets/sources/buildings.mjs';
import { worldFrames } from '../assets/sources/world.mjs';
const palette=JSON.parse(readFileSync(new URL('../assets/palette.json',import.meta.url),'utf8'));
const output=new URL('../public/assets/',import.meta.url);mkdirSync(output,{recursive:true});
const image=new Surface(256,192),frames={},manifest={version:1,palette:'assets/palette.json',source:'assets/sources/world.mjs',origin:'original repo-local pixel sources; no imported game artwork',atlases:{world:{image:'assets/world-atlas.png',data:'assets/world-atlas.json',width:256,height:192}},frames:{}};
for(const f of worldFrames(Surface,palette)){
 image.blit(f.image,f.x,f.y);frames[f.id]={frame:{x:f.x,y:f.y,w:f.image.width,h:f.image.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:f.image.width,h:f.image.height},sourceSize:{w:f.image.width,h:f.image.height}};
 manifest.frames[f.id]={atlas:'world',kind:f.kind,width:f.image.width,height:f.image.height,anchor:f.anchor,...(f.logicalFootprint?{logicalFootprint:f.logicalFootprint}:{})};
}
writeFileSync(new URL('world-atlas.png',output),png(image));writeFileSync(new URL('world-atlas.json',output),JSON.stringify({frames,meta:{image:'world-atlas.png',size:{w:256,h:192},scale:'1'}},null,2)+'\n');writeFileSync(new URL('manifest.json',output),JSON.stringify(manifest,null,2)+'\n');
const buildingImage=new Surface(1024,1280),buildingAtlas={};
for(const f of buildingFrames(Surface,palette)){buildingImage.blit(f.image,f.x,f.y);buildingAtlas[f.id]={frame:{x:f.x,y:f.y,w:f.image.width,h:f.image.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:f.image.width,h:f.image.height},sourceSize:{w:f.image.width,h:f.image.height}};manifest.frames[f.id]={atlas:'buildings',width:f.image.width,height:f.image.height,anchor:f.anchor,logicalFootprint:f.logicalFootprint,kind:f.kind,faction:f.faction,owner:f.owner,buildingType:f.buildingType,stage:f.stage};}
manifest.atlases.buildings={image:'assets/buildings-atlas.png',data:'assets/buildings-atlas.json',width:1024,height:1280,source:'assets/sources/buildings.mjs'};
writeFileSync(new URL('buildings-atlas.png',output),png(buildingImage));writeFileSync(new URL('buildings-atlas.json',output),JSON.stringify({frames:buildingAtlas,meta:{image:'buildings-atlas.png',size:{w:1024,h:1280},scale:'1'}},null,2)+'\n');writeFileSync(new URL('manifest.json',output),JSON.stringify(manifest,null,2)+'\n');
const unitImage=new Surface(2048,4096),unitAtlas={};
for(const f of unitFrames(Surface,palette)){unitImage.blit(f.image,f.x,f.y);unitAtlas[f.id]={frame:{x:f.x,y:f.y,w:f.image.width,h:f.image.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:f.image.width,h:f.image.height},sourceSize:{w:f.image.width,h:f.image.height}};manifest.frames[f.id]={atlas:'units',width:f.image.width,height:f.image.height,anchor:f.anchor,kind:f.kind,faction:f.faction,type:f.type,owner:f.owner,direction:f.direction,state:f.state,frame:f.frame};}
manifest.atlases.units={image:'assets/units-atlas.png',data:'assets/units-atlas.json',width:4096,height:4096,source:'assets/sources/units.mjs',slotSize:64,directions,animations:animationSpec};
writeFileSync(new URL('units-atlas.png',output),png(unitImage));writeFileSync(new URL('units-atlas.json',output),JSON.stringify({frames:unitAtlas,meta:{image:'units-atlas.png',size:{w:2048,h:4096},scale:'1'}},null,2)+'\n');writeFileSync(new URL('manifest.json',output),JSON.stringify(manifest,null,2)+'\n');
const uiImage=new Surface(512,128),uiAtlas={};
for(const f of uiFrames(Surface,palette)){uiImage.blit(f.image,f.x,f.y);uiAtlas[f.id]={frame:{x:f.x,y:f.y,w:f.image.width,h:f.image.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:f.image.width,h:f.image.height},sourceSize:{w:f.image.width,h:f.image.height}};manifest.frames[f.id]={atlas:'ui',width:f.image.width,height:f.image.height,anchor:f.anchor,kind:f.kind,...(f.border?{border:f.border}:{})};if(f.id==='panel')writeFileSync(new URL('panel.png',output),png(f.image));}
manifest.atlases.ui={image:'assets/ui-atlas.png',data:'assets/ui-atlas.json',width:512,height:128,source:'assets/sources/ui.mjs',effectFPS:8,effectLifetime:.5};
writeFileSync(new URL('ui-atlas.png',output),png(uiImage));writeFileSync(new URL('ui-atlas.json',output),JSON.stringify({frames:uiAtlas,meta:{image:'ui-atlas.png',size:{w:512,h:128},scale:'1'}},null,2)+'\n');writeFileSync(new URL('manifest.json',output),JSON.stringify(manifest,null,2)+'\n');
console.log(`Exported ${Object.keys(frames).length} original world/resource frames.`);

const navalImage=new Surface(1024,3328),navalAtlas={};
for(const f of navalFrames(Surface,palette)){navalImage.blit(f.image,f.x,f.y);navalAtlas[f.id]={frame:{x:f.x,y:f.y,w:64,h:64},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:64,h:64},sourceSize:{w:64,h:64}};manifest.frames[f.id]={atlas:'naval',width:64,height:64,anchor:f.anchor,kind:f.kind,faction:f.faction,owner:f.owner,role:f.role,direction:f.direction,state:f.state,frame:f.frame};}
manifest.atlases.naval={image:'assets/naval-atlas.png',data:'assets/naval-atlas.json',width:1024,height:3328,source:'assets/sources/naval.mjs',directions:navalDirections,animations:{idle:1,walk:4,attack:4,death:4},fps:8};
writeFileSync(new URL('naval-atlas.png',output),png(navalImage));writeFileSync(new URL('naval-atlas.json',output),JSON.stringify({frames:navalAtlas,meta:{image:'naval-atlas.png',size:{w:1024,h:3328},scale:'1'}},null,2)+'\n');writeFileSync(new URL('manifest.json',output),JSON.stringify(manifest,null,2)+'\n');
