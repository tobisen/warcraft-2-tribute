import {readFileSync,writeFileSync} from 'node:fs';
import {Surface,png} from './pixelArt.mjs';
import {readRGBA} from './read-rgba-png.mjs';
import {cell,draw} from '../assets/sources/visual-refresh/frames.mjs';
const sheet=readRGBA('assets/sources/visual-refresh/aviaries.png'),races=['crown','clans','elves','dwarves','goblins'],items=[];
for(const [row,race]of races.entries())for(const owner of ['player','enemy'])for(const state of ['complete','damaged','foundation','building']){
 const src=cell(sheet,0,row,1,5,[0,.223,.426,.631,.806,1]);const image=draw(src,96,96,{bottom:72,maxWidth:88,maxHeight:66,owner,state,index:state==='damaged'?1:0,direction:'s'});if(state==='foundation'||state==='building'){for(let i=3;i<image.data.length;i+=4)image.data[i]=Math.round(image.data[i]*(state==='foundation'?.35:.65));}
 items.push({id:`${race==='crown'?'':race+'-'}aviary-${owner}-${state}`,image});
}
const image=new Surface(768,Math.ceil(items.length/8)*96),frames={},manifest=JSON.parse(readFileSync('public/assets/manifest.json'));
for(const [i,f]of items.entries()){const x=i%8*96,y=Math.floor(i/8)*96;image.blit(f.image,x,y);frames[f.id]={frame:{x,y,w:96,h:96},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:96,h:96},sourceSize:{w:96,h:96}};manifest.frames[f.id]={atlas:'aviary',width:96,height:96,anchor:{x:48,y:72},kind:'building',buildingType:'aviary',logicalFootprint:{width:64,height:64}};}
writeFileSync('public/assets/aviary-atlas.png',png(image));writeFileSync('public/assets/aviary-atlas.json',JSON.stringify({frames,meta:{image:'aviary-atlas.png',size:{w:image.width,h:image.height},scale:'1'}},null,2)+'\n');manifest.atlases.aviary={image:'assets/aviary-atlas.png',data:'assets/aviary-atlas.json',width:image.width,height:image.height,source:'assets/sources/visual-refresh/aviaries.png'};writeFileSync('public/assets/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(`${items.length} painted flight buildings`);
