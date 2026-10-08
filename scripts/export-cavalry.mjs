import {readFileSync,writeFileSync} from 'node:fs';import {Surface,png} from './pixelArt.mjs';import {cavalryFrames} from '../assets/sources/cavalry.mjs';
import {readRGBA} from './read-rgba-png.mjs';
import {cell,draw} from '../assets/sources/visual-refresh/frames.mjs';
const riders=readRGBA('assets/sources/visual-refresh/cavalry.png'),stables=readRGBA('assets/sources/visual-refresh/stables.png'),races=['crown','clans','elves','dwarves','goblins'],cache=new Map();
function painted(id,w,h){const match=id.match(/^(?:(clans|elves|dwarves|goblins)-)?(cavalry|stable)-(player|enemy)-(.*)$/),[,race='crown',role,owner,pose]=match,row=races.indexOf(race);let column=0,state=pose,index=0,direction='s';
 if(role==='cavalry'){[direction,state,index]=pose.split('-');index=Number(index);column=state==='walk'?[1,0,2,0][index]:state==='attack'?[0,3,3,0][index]:0;}
 if(role==='stable'&&!['complete','damaged'].includes(state))return null;
 const key=role+'/'+row+'/'+column;if(!cache.has(key))cache.set(key,cell(role==='cavalry'?riders:stables,column,row,role==='cavalry'?4:1,5,role==='cavalry'?[0,.215,.405,.596,.805,1]:[0,.235,.447,.655,.842,1]));
 return draw(cache.get(key),w,h,{bottom:role==='cavalry'?44:72,maxHeight:role==='cavalry'?42:66,maxWidth:w-6,owner,state,index,direction,flip:['w','sw','nw'].includes(direction)});
}
const items=cavalryFrames(Surface).map(f=>({...f,image:painted(f.id,f.image.width,f.image.height)??f.image})),columns=16,slot=96,rows=Math.ceil(items.length/columns),image=new Surface(columns*slot,rows*slot),frames={};
for(const [i,f]of items.entries()){const x=i%columns*slot,y=Math.floor(i/columns)*slot;image.blit(f.image,x,y);frames[f.id]={frame:{x,y,w:f.image.width,h:f.image.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:f.image.width,h:f.image.height},sourceSize:{w:f.image.width,h:f.image.height}};}
writeFileSync('public/assets/cavalry-atlas.png',png(image));writeFileSync('public/assets/cavalry-atlas.json',JSON.stringify({frames,meta:{image:'cavalry-atlas.png',size:{w:image.width,h:image.height},scale:'1'}},null,2)+'\n');console.log(`${items.length} original mounted/stable frames`);

const manifest=JSON.parse(readFileSync('public/assets/manifest.json','utf8'));manifest.atlases.cavalry={image:'assets/cavalry-atlas.png',data:'assets/cavalry-atlas.json',width:image.width,height:image.height,source:'assets/sources/cavalry.mjs',refreshSource:'assets/sources/visual-refresh/cavalry.md'};for(const f of items){const stable=f.id.includes('stable-');manifest.frames[f.id]={atlas:'cavalry',width:f.image.width,height:f.image.height,anchor:stable?{x:48,y:72}:{x:32,y:44},kind:stable?'building':'unit',...(stable?{logicalFootprint:{width:64,height:64},buildingType:'stable'}:{type:'cavalry'})};}writeFileSync('public/assets/manifest.json',JSON.stringify(manifest,null,2)+'\n');
