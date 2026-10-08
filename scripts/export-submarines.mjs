import {readFileSync,writeFileSync} from 'node:fs';
import {Surface,png} from './pixelArt.mjs';
import {readRGBA} from './read-rgba-png.mjs';
import {cell,draw} from '../assets/sources/visual-refresh/frames.mjs';
const sheet=readRGBA('assets/sources/visual-refresh/submarines.png'),races=['crown','clans','elves','dwarves','goblins'],items=[],cache=new Map();
for(const [row,race]of races.entries())for(const owner of ['player','enemy'])for(const direction of ['e','se','s','sw','w','nw','n','ne'])for(const state of ['idle','walk','attack','death'])for(let frame=0;frame<4;frame++){
 const col=state==='death'?0:frame,key=row+'/'+col;if(!cache.has(key))cache.set(key,cell(sheet,col,row,4,5,[0,.20,.40,.60,.80,1]));
 const id=`${race==='crown'?'':race+'-'}submarine-${owner}-${direction}-${state}-${frame}`,image=draw(cache.get(key),64,64,{bottom:40,maxWidth:62,maxHeight:42,owner,state,index:frame,direction,flip:['w','sw','nw'].includes(direction)});items.push({id,image});
}
const image=new Surface(1024,Math.ceil(items.length/16)*64),frames={},manifest=JSON.parse(readFileSync('public/assets/manifest.json'));
for(const [i,f]of items.entries()){const x=i%16*64,y=Math.floor(i/16)*64;image.blit(f.image,x,y);frames[f.id]={frame:{x,y,w:64,h:64},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:64,h:64},sourceSize:{w:64,h:64}};manifest.frames[f.id]={atlas:'submarine',width:64,height:64,anchor:{x:32,y:32},kind:'unit',type:'submarine'};}
writeFileSync('public/assets/submarine-atlas.png',png(image));writeFileSync('public/assets/submarine-atlas.json',JSON.stringify({frames,meta:{image:'submarine-atlas.png',size:{w:image.width,h:image.height},scale:'1'}},null,2)+'\n');manifest.atlases.submarine={image:'assets/submarine-atlas.png',data:'assets/submarine-atlas.json',width:image.width,height:image.height,source:'assets/sources/visual-refresh/submarines.png'};writeFileSync('public/assets/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(`${items.length} painted submarine frames`);
