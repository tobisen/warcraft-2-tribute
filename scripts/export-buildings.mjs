/** Export only buildings so independent unit-source work remains untouched. */
import {readFileSync,writeFileSync} from 'node:fs';
import {readRGBA} from './read-rgba-png.mjs';
import {Surface,png} from './pixelArt.mjs';
import {buildingFrames} from '../assets/sources/buildings.mjs';
const palette=JSON.parse(readFileSync('assets/palette.json','utf8')),frames=buildingFrames(Surface,palette),height=Math.max(...frames.map(f=>f.y+f.image.height)),image=new Surface(1024,height),atlas={};
const previous=readRGBA('public/assets/buildings-atlas.png'),previousAtlas=JSON.parse(readFileSync('public/assets/buildings-atlas.json','utf8'));image.data.set(previous.data);
const manifest=JSON.parse(readFileSync('public/assets/manifest.json','utf8'));
for(const f of frames){if(previousAtlas.frames[f.id]&&f.buildingType!=='academy'){const old=previousAtlas.frames[f.id].frame;if(old.x!==f.x||old.y!==f.y||old.w!==f.image.width||old.h!==f.image.height)throw Error(`Existing frame moved: ${f.id}`);}else{for(let y=0;y<f.image.height;y++)image.data.fill(0,((f.y+y)*image.width+f.x)*4,((f.y+y)*image.width+f.x+f.image.width)*4);image.blit(f.image,f.x,f.y);}atlas[f.id]={frame:{x:f.x,y:f.y,w:f.image.width,h:f.image.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:f.image.width,h:f.image.height},sourceSize:{w:f.image.width,h:f.image.height}};manifest.frames[f.id]={atlas:'buildings',width:f.image.width,height:f.image.height,anchor:f.anchor,logicalFootprint:f.logicalFootprint,kind:f.kind,faction:f.faction,owner:f.owner,buildingType:f.buildingType,stage:f.stage};}
manifest.atlases.buildings={...manifest.atlases.buildings,width:1024,height};
writeFileSync('public/assets/buildings-atlas.png',png(image));writeFileSync('public/assets/buildings-atlas.json',JSON.stringify({frames:atlas,meta:{image:'buildings-atlas.png',size:{w:1024,h:height},scale:'1'}},null,2)+'\n');writeFileSync('public/assets/manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Exported ${frames.length} building frames at 1024×${height}.`);
