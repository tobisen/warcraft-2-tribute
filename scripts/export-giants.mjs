import {readFileSync,writeFileSync} from 'node:fs';
import {Surface,png} from './pixelArt.mjs';
import {readRGBA} from './read-rgba-png.mjs';
import {cell,draw} from '../assets/sources/visual-refresh/frames.mjs';
const sheet=readRGBA('assets/sources/visual-refresh/giants.png'),races=['crown','clans','elves','dwarves','goblins'],items=[],cache=new Map();
for(const [row,race]of races.entries())for(const owner of ['player','enemy'])for(const direction of ['e','se','s','sw','w','nw','n','ne'])for(const state of ['idle','walk','attack','death'])for(let frame=0;frame<(state==='idle'?1:4);frame++){
 const col=state==='walk'?[1,0,2,0][frame]:state==='attack'?[0,3,3,0][frame]:0,key=row+'/'+col;if(!cache.has(key))cache.set(key,cell(sheet,col,row,4,5,[0,.213,.407,.595,.796,1]));
 const id=`${race==='crown'?'':race+'-'}giant-${owner}-${direction}-${state}-${frame}`,image=draw(cache.get(key),64,64,{bottom:56,maxWidth:60,maxHeight:54,owner,state,index:frame,direction,flip:['w','sw','nw'].includes(direction)});items.push({id,image});
}
const image=new Surface(1024,Math.ceil(items.length/16)*64),frames={},manifest=JSON.parse(readFileSync('public/assets/manifest.json'));
for(const [i,f]of items.entries()){const x=i%16*64,y=Math.floor(i/16)*64;image.blit(f.image,x,y);frames[f.id]={frame:{x,y,w:64,h:64},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:64,h:64},sourceSize:{w:64,h:64}};manifest.frames[f.id]={atlas:'giant',width:64,height:64,anchor:{x:32,y:56},kind:'unit',type:'giant'};}
writeFileSync('public/assets/giant-atlas.png',png(image));writeFileSync('public/assets/giant-atlas.json',JSON.stringify({frames,meta:{image:'giant-atlas.png',size:{w:image.width,h:image.height},scale:'1'}},null,2)+'\n');manifest.atlases.giant={image:'assets/giant-atlas.png',data:'assets/giant-atlas.json',width:image.width,height:image.height,source:'assets/sources/visual-refresh/giants.png'};writeFileSync('public/assets/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(`${items.length} painted giant frames`);
