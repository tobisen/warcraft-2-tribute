import {wildlifeFrames} from './wildlife.mjs';
/** Original hand-authored pixel composition; all colors come from the local project palette. */
export function worldFrames(Surface,p){
 const terrain=(kind,variant=0)=>{const s=new Surface(32,32);s.rect(0,0,32,32,kind==='water'?p.water:p.grass);
  if(kind==='grass'){
   const tufts=[[[4,7],[19,22],[26,12]],[[12,5],[24,27],[5,20]],[[8,25],[22,8]],[[17,15],[3,28]]][variant];
   for(const [x,y] of tufts){s.line(x,y,x+1,y-2,p.grassLight);s.pixel(x+3,y,p.grassDark);}
   // Tiny soft ground flecks stay walkable; no rock/tree-shaped decoration.
   for(const [x,y] of [[7,12],[25,23],[14,4],[2,18]])s.pixel((x+variant*3)%32,y,p.grassDark);
   for(const [x,y] of tufts){s.pixel(x-1,y,p.grassLight);s.pixel(x+1,y+1,p.grassDark);}
  }
  if(kind==='water'){
   for(const [x,y,w] of variant?[[7,7,8],[19,19,7],[3,27,11]]:[[3,5,10],[18,15,9],[5,26,9]]){
    s.rect(x,y,w,1,p.waterLight);s.rect(x+2,y+1,Math.max(1,w-5),1,p.waterDark);s.pixel(x+w-2,y-1,p.foam);
   }
   // No full-width stripe: neighboring water tiles share the same base tone.
  }
  if(kind==='rock'){s.rect(0,0,32,32,p.rockDark);for(const [x,y,w,h] of [[1,2,14,11],[18,1,12,14],[6,17,18,12]]){s.polygon([[x,y+4],[x+4,y],[x+w-3,y+1],[x+w,y+h-3],[x+w-4,y+h],[x+2,y+h-1]],p.rock);s.line(x+4,y+1,x+w-4,y+1,p.rockLight);s.line(x+2,y+4,x+2,y+h-3,p.rockLight);s.line(x+5,y+h-2,x+w-4,y+h-2,p.rockDark);}}
  return s;};
 const wood=depleted=>{const s=new Surface(64,64);s.ellipse(32,51,20,6,p.earth);s.rect(28,29,10,23,p.barkDark);s.rect(30,31,6,20,p.bark);s.rect(31,36,2,13,p.barkLight);s.line(28,46,23,53,p.bark);s.line(36,47,43,54,p.bark);
  if(depleted){s.ellipse(33,39,7,3,p.barkLight);s.ellipse(33,39,4,1,p.barkDark);s.rect(27,28,14,10,p.earth);s.line(27,27,35,30,p.barkLight);}
  else{for(const [x,y,rx,ry] of [[22,28,16,11],[43,25,16,13],[33,13,15,10],[32,30,19,12]])s.ellipse(x,y,rx,ry,p.leafDark);for(const [x,y,rx,ry] of [[20,23,12,8],[42,20,12,9],[31,10,11,7],[32,27,15,8]])s.ellipse(x,y,rx,ry,p.leaf);s.ellipse(26,16,9,6,p.leafLight);s.ellipse(38,23,9,5,p.leafLight);s.line(20,12,26,10,p.leafHighlight);s.line(34,19,40,18,p.leafHighlight);for(const [x,y] of [[16,25],[28,30],[40,14],[44,28]]){s.line(x,y,x+4,y-1,p.leafLight);s.pixel(x+2,y+2,p.leafDark);}s.line(29,43,32,39,p.barkLight);s.line(36,43,38,46,p.barkDark);}
  return s;};
 const gold=depleted=>{const s=new Surface(64,64);s.ellipse(32,50,24,7,p.earth);s.polygon([[8,46],[14,25],[29,14],[47,22],[57,46],[47,54],[18,54]],p.rockDark);s.polygon([[11,43],[18,24],[29,19],[44,25],[51,43],[43,49],[19,49]],p.rock);s.line(18,24,29,19,p.rockLight);s.line(31,19,44,25,p.rockLight);s.line(18,26,23,31,p.rockDark);s.line(43,27,47,35,p.rockDark);s.line(13,41,19,39,p.rockLight);s.rect(25,34,14,18,p.ink);
  if(!depleted){for(const [x,y] of [[18,31],[40,29],[13,44],[45,43],[21,48]]){s.polygon([[x,y],[x+5,y-2],[x+8,y+3],[x+3,y+5]],p.goldDark);s.rect(x+1,y,4,3,p.gold);s.pixel(x+2,y,p.goldLight);}s.rect(29,40,6,3,p.gold);s.pixel(31,39,p.goldLight);}else{s.rect(25,38,15,3,p.barkDark);s.line(25,38,39,45,p.bark);s.line(39,37,26,47,p.barkLight);}
  return s;};
 const edges=[];
 for(const kind of ['water','rock'])for(const side of ['n','e','s','w']){
  const image=new Surface(32,32);
  for(let i=0;i<32;i++){
   // Same endpoint depth on every tile, gentle variation between endpoints.
   const depth=kind==='water'?4+Math.floor(Math.sin(i*Math.PI/31)*2):3;
   for(let d=0;d<depth;d++){
    const x=side==='w'?d:side==='e'?31-d:i,y=side==='n'?d:side==='s'?31-d:i;
    image.pixel(x,y,kind==='water'?(d===depth-1?p.foam:d===depth-2?p.waterLight:d===0?p.grassDark:d===1?p.barkLight:p.earth):(d===depth-1?p.rockLight:p.grassDark));
   }
  }
  edges.push({id:`edge-${kind}-${side}`,image,x:edges.length*32,y:128,anchor:{x:0,y:0},kind:'transition'});
 }
 const corners=['nw','ne','se','sw'].map((corner,index)=>{
  const image=new Surface(32,32);
  for(let y=0;y<6;y++)for(let x=0;x<6;x++){
   const d=Math.sqrt(x*x+y*y);if(d>5)continue;
   image.pixel(corner.includes('e')?31-x:x,corner.includes('s')?31-y:y,d>3.5?p.foam:d>2.5?p.waterLight:d<1?p.grassDark:p.earth);
  }
  return {id:`corner-water-${corner}`,image,x:index*32,y:160,anchor:{x:0,y:0},kind:'transition'};
 });
 const details=[];
 const add=(id,image)=>details.push({id,image,x:(details.length%8)*32,y:192+Math.floor(details.length/8)*32,anchor:{x:0,y:0},kind:'decoration'});
 for(const side of ['n','e','s','w']){const s=new Surface(32,32);const vertical=side==='n'||side==='s';s.rect(vertical?9:0,vertical?0:9,vertical?14:32,vertical?32:14,p.earth);s.rect(vertical?12:0,vertical?0:12,vertical?8:32,vertical?32:8,p.barkLight);for(let n=0;n<32;n+=7)s.pixel(vertical?15:n,vertical?n:15,p.earth);add('road-'+side,s);}
 const blooms=new Surface(32,32);for(const [x,y]of [[6,22],[22,10],[24,26]]){blooms.line(x,y,x,y-3,p.grassLight);blooms.pixel(x,y-4,p.goldLight);blooms.pixel(x+1,y-3,p.linenLight);}add('flowers',blooms);
 const fern=new Surface(32,32);for(let n=0;n<5;n++){fern.line(16,25,10+n,18-n,p.leafLight);fern.line(16,25,21-n,18-n,p.leaf);}add('fern',fern);
 // A canopy confined to the existing blocked rock cell: forest silhouette cannot claim free ground.
 const forest=terrain('rock');forest.rect(14,20,5,10,p.bark);for(const [x,y,r]of [[10,11,8],[22,10,8],[16,6,8],[17,17,9]]){forest.ellipse(x,y,r,6,p.leafDark);forest.ellipse(x-1,y-2,r-2,4,p.leaf);forest.line(x-3,y-4,x+1,y-5,p.leafLight);}add('forest-rock',forest);
 return [
  ...edges,...corners,...details,...wildlifeFrames(Surface,p),
  {id:'grass-a',image:terrain('grass'),x:0,y:0,anchor:{x:0,y:0},kind:'terrain'},
  {id:'grass-b',image:terrain('grass',1),x:32,y:0,anchor:{x:0,y:0},kind:'terrain'},
  {id:'grass-c',image:terrain('grass',2),x:128,y:0,anchor:{x:0,y:0},kind:'terrain'},
  {id:'grass-d',image:terrain('grass',3),x:160,y:0,anchor:{x:0,y:0},kind:'terrain'},
  {id:'water-b',image:terrain('water',1),x:192,y:0,anchor:{x:0,y:0},kind:'terrain'},
  {id:'rock',image:terrain('rock'),x:64,y:0,anchor:{x:0,y:0},kind:'terrain'},
  {id:'water',image:terrain('water'),x:96,y:0,anchor:{x:0,y:0},kind:'terrain'},
  ...['wood','gold'].flatMap((type,n)=>['available','depleted'].map((state,i)=>({id:`${type}-${state}`,image:type==='wood'?wood(i===1):gold(i===1),x:n*128+i*64,y:64,anchor:{x:32,y:40},kind:'resource',logicalFootprint:{x:-20,y:-20,width:40,height:40}})))
 ];
}
