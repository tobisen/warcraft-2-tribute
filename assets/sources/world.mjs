/** Original hand-authored pixel composition; all colors come from the local project palette. */
export function worldFrames(Surface,p){
 const terrain=(kind,variant=0)=>{const s=new Surface(32,32);s.rect(0,0,32,32,kind==='water'?p.water:p.grass);
  if(kind==='grass')for(const [x,y] of [[3,4],[17,2],[26,11],[9,16],[21,25],[4,29]]){s.line((x+variant*7)%32,y,(x+variant*7)%32+2,y-2,p.grassLight);s.pixel((x+variant*7+3)%32,y,p.grassDark);}
  if(kind==='water'){for(const [x,y,w] of [[3,6,12],[18,14,11],[1,24,10],[14,30,10]]){s.rect(x,y,w,1,p.waterLight);s.rect(x+2,y+1,Math.max(1,w-5),1,p.foam);}s.rect(0,0,32,2,p.waterDark);}
  if(kind==='rock'){s.rect(0,0,32,32,p.rockDark);for(const [x,y,w,h] of [[1,2,14,11],[18,1,12,14],[6,17,18,12]]){s.polygon([[x,y+4],[x+4,y],[x+w-3,y+1],[x+w,y+h-3],[x+w-4,y+h],[x+2,y+h-1]],p.rock);s.line(x+4,y+1,x+w-4,y+1,p.rockLight);s.line(x+2,y+4,x+2,y+h-3,p.rockLight);s.line(x+5,y+h-2,x+w-4,y+h-2,p.rockDark);}}
  return s;};
 const wood=depleted=>{const s=new Surface(64,64);s.ellipse(32,51,20,6,p.earth);s.rect(28,29,10,23,p.barkDark);s.rect(30,31,6,20,p.bark);s.rect(31,36,2,13,p.barkLight);s.line(28,46,23,53,p.bark);s.line(36,47,43,54,p.bark);
  if(depleted){s.ellipse(33,39,7,3,p.barkLight);s.ellipse(33,39,4,1,p.barkDark);s.rect(27,28,14,10,p.earth);s.line(27,27,35,30,p.barkLight);}
  else{for(const [x,y,rx,ry] of [[22,28,16,11],[43,25,16,13],[33,13,15,10],[32,30,19,12]])s.ellipse(x,y,rx,ry,p.leafDark);for(const [x,y,rx,ry] of [[20,23,12,8],[42,20,12,9],[31,10,11,7],[32,27,15,8]])s.ellipse(x,y,rx,ry,p.leaf);s.ellipse(26,16,9,6,p.leafLight);s.ellipse(38,23,9,5,p.leafLight);s.line(20,12,26,10,p.leafHighlight);s.line(34,19,40,18,p.leafHighlight);}
  return s;};
 const gold=depleted=>{const s=new Surface(64,64);s.ellipse(32,50,24,7,p.earth);s.polygon([[8,46],[14,25],[29,14],[47,22],[57,46],[47,54],[18,54]],p.rockDark);s.polygon([[11,43],[18,24],[29,19],[44,25],[51,43],[43,49],[19,49]],p.rock);s.line(18,24,29,19,p.rockLight);s.line(31,19,44,25,p.rockLight);s.rect(25,34,14,18,p.ink);
  if(!depleted){for(const [x,y] of [[18,31],[40,29],[13,44],[45,43],[21,48]]){s.polygon([[x,y],[x+5,y-2],[x+8,y+3],[x+3,y+5]],p.goldDark);s.rect(x+1,y,4,3,p.gold);s.pixel(x+2,y,p.goldLight);}s.rect(29,40,6,3,p.gold);s.pixel(31,39,p.goldLight);}else{s.rect(25,38,15,3,p.barkDark);s.line(25,38,39,45,p.bark);s.line(39,37,26,47,p.barkLight);}
  return s;};
 const edges=[];for(const kind of ['water','rock'])for(const side of ['n','e','s','w']){const image=new Surface(32,32);for(let i=0;i<32;i++){const depth=2+(Math.floor(i/4)%2);for(let d=0;d<depth;d++){const x=side==='w'?d:side==='e'?31-d:i,y=side==='n'?d:side==='s'?31-d:i;image.pixel(x,y,kind==='water'?(d===depth-1?p.foam:p.earth):(d===depth-1?p.grassLight:p.rockDark));}}edges.push({id:`edge-${kind}-${side}`,image,x:edges.length*32,y:128,anchor:{x:0,y:0},kind:'transition'});}
 return [
  ...edges,
  {id:'grass-a',image:terrain('grass'),x:0,y:0,anchor:{x:0,y:0},kind:'terrain'},
  {id:'grass-b',image:terrain('grass',1),x:32,y:0,anchor:{x:0,y:0},kind:'terrain'},
  {id:'rock',image:terrain('rock'),x:64,y:0,anchor:{x:0,y:0},kind:'terrain'},
  {id:'water',image:terrain('water'),x:96,y:0,anchor:{x:0,y:0},kind:'terrain'},
  ...['wood','gold'].flatMap((type,n)=>['available','depleted'].map((state,i)=>({id:`${type}-${state}`,image:type==='wood'?wood(i===1):gold(i===1),x:n*128+i*64,y:64,anchor:{x:32,y:40},kind:'resource',logicalFootprint:{x:-20,y:-20,width:40,height:40}})))
 ];
}
