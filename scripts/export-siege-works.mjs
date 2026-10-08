import {readFileSync,writeFileSync} from 'node:fs';
import {Surface,png} from './pixelArt.mjs';
import {readRGBA} from './read-rgba-png.mjs';
import {cell,draw} from '../assets/sources/visual-refresh/frames.mjs';
const sheet=readRGBA('assets/sources/visual-refresh/siege-works.png'),races=['crown','clans','elves','dwarves','goblins'],items=[];
for(const [row,race]of races.entries())for(const owner of ['player','enemy'])for(const state of ['complete','damaged','foundation','building']){
 const src=cell(sheet,0,row,1,5,[0,.20,.40,.60,.80,1]);const image=draw(src,96,96,{bottom:72,maxWidth:88,maxHeight:66,owner,state,index:state==='damaged'?1:0,direction:'s'});if(state==='foundation'||state==='building'){for(let i=3;i<image.data.length;i+=4)image.data[i]=Math.round(image.data[i]*(state==='foundation'?.35:.65));}
 items.push({id:`${race==='crown'?'':race+'-'}siegeWorks-${owner}-${state}`,image});
}
const image=new Surface(768,Math.ceil(items.length/8)*96),frames={},manifest=JSON.parse(readFileSync('public/assets/manifest.json'));
for(const [i,f]of items.entries()){const x=i%8*96,y=Math.floor(i/8)*96;image.blit(f.image,x,y);frames[f.id]={frame:{x,y,w:96,h:96},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:96,h:96},sourceSize:{w:96,h:96}};manifest.frames[f.id]={atlas:'siegeWorks',width:96,height:96,anchor:{x:48,y:72},kind:'building',buildingType:'siegeWorks',logicalFootprint:{width:64,height:64}};}
writeFileSync('public/assets/siegeWorks-atlas.png',png(image));writeFileSync('public/assets/siegeWorks-atlas.json',JSON.stringify({frames,meta:{image:'siegeWorks-atlas.png',size:{w:image.width,h:image.height},scale:'1'}},null,2)+'\n');manifest.atlases.siegeWorks={image:'assets/siegeWorks-atlas.png',data:'assets/siegeWorks-atlas.json',width:image.width,height:image.height,source:'assets/sources/visual-refresh/siege-works.png'};writeFileSync('public/assets/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(`${items.length} painted siege workshops`);
