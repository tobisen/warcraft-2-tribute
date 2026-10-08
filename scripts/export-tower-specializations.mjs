import {readFileSync,writeFileSync} from 'node:fs';
import {Surface,png} from './pixelArt.mjs';
import {readRGBA} from './read-rgba-png.mjs';
import {cell,draw} from '../assets/sources/visual-refresh/frames.mjs';
const sheet=readRGBA('assets/sources/visual-refresh/tower-specializations.png'),races=['crown','clans','elves','dwarves','goblins'],items=[];
for(const [row,race]of races.entries())for(const owner of ['player','enemy'])for(const [col,mode]of ['ground','air'].entries())for(const state of ['complete','damaged']){
 const src=cell(sheet,col,row,2,5,[0,.196,.386,.588,.787,1]);const image=draw(src,64,64,{bottom:48,maxWidth:58,maxHeight:46,owner,state,index:state==='damaged'?1:0,direction:'s'});
 items.push({id:`${race==='crown'?'':race+'-'}tower-${mode}-${owner}-${state}`,image});
}
const image=new Surface(512,Math.ceil(items.length/8)*64),frames={},manifest=JSON.parse(readFileSync('public/assets/manifest.json'));
for(const [i,f]of items.entries()){const x=i%8*64,y=Math.floor(i/8)*64;image.blit(f.image,x,y);frames[f.id]={frame:{x,y,w:64,h:64},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:64,h:64},sourceSize:{w:64,h:64}};manifest.frames[f.id]={atlas:'tower-specializations',width:64,height:64,anchor:{x:32,y:48},kind:'building',buildingType:'tower',logicalFootprint:{width:32,height:32}};}
writeFileSync('public/assets/tower-specializations-atlas.png',png(image));writeFileSync('public/assets/tower-specializations-atlas.json',JSON.stringify({frames,meta:{image:'tower-specializations-atlas.png',size:{w:image.width,h:image.height},scale:'1'}},null,2)+'\n');manifest.atlases['tower-specializations']={image:'assets/tower-specializations-atlas.png',data:'assets/tower-specializations-atlas.json',width:image.width,height:image.height,source:'assets/sources/visual-refresh/tower-specializations.png'};writeFileSync('public/assets/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(`${items.length} painted tower specializations`);
