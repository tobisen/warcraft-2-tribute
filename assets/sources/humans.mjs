/** Original Human pixel compositions, authored against the user's approved RTS-155 references.
 * Native 64px unit cells and 128px castle; no reference raster is cropped or resampled.
 * Feet stay at (32,44), preserving the existing normalized origin and logical bodies.
 */
function colors(p,owner){return {...p,cloth:owner==='player'?p.teamBlue:p.teamRed,clothLight:owner==='player'?p.humanBlueLight:p.teamRedLight,clothDark:owner==='player'?p.humanBlueDark:p.humanRedDark};}
function poly(s,points,base){s.polygon(points,base);}
function stroke(s,x1,y1,x2,y2,width,color){for(let i=-Math.floor(width/2);i<=Math.floor(width/2);i++)s.line(x1+i,y1,x2+i,y2,color);}
function limb(s,a,b,c,width,base,light){stroke(s,...a,...b,width+2,c.ink);stroke(s,...a,...b,width,base);stroke(s,...a,...b,Math.max(1,width-2),light);}
function boot(s,x,y,c){poly(s,[[x-3,y-7],[x+3,y-7],[x+3,y-1],[x+6,y+1],[x+5,y+4],[x-4,y+4],[x-5,y+1]],c.ink);s.rect(x-2,y-6,4,6,c.barkDark);s.rect(x-3,y,7,3,c.bark);s.line(x-2,y+1,x+3,y+1,c.barkLight);s.line(x-2,y-4,x+1,y-4,c.goldDark);}
function workerHead(s,x,y,back,side,c){
 poly(s,[[x-6,y-5],[x-3,y-8],[x+3,y-8],[x+6,y-4],[x+6,y+6],[x+2,y+10],[x-4,y+8],[x-7,y+3]],c.ink);
 s.ellipse(x,y,6,7,c.skinShadow);s.ellipse(x+1,y-1,4,5,c.skin);s.rect(x+1,y-2,3,3,c.skinLight);
 poly(s,[[x-6,y],[x-7,y-5],[x-3,y-8],[x+3,y-8],[x+5,y-6],[x+6,y-2],[x+3,y-3],[x+1,y-5],[x-3,y-3],[x-3,y+1]],c.barkDark);
 s.line(x-4,y-5,x+2,y-6,c.bark);s.line(x-3,y-6,x,y-7,c.barkLight);s.pixel(x-4,y-3,c.barkLight);
 if(back){s.rect(x-5,y-2,10,6,c.barkDark);s.line(x-3,y+1,x+2,y+2,c.bark);s.rect(x-2,y+6,4,3,c.skinShadow);}
 else {s.pixel(x+1+(side?2:0),y,c.ink);s.pixel(x+1+(side?2:0),y-1,c.linenLight);s.rect(x+3+(side?2:0),y+1,2,2,c.skinLight);poly(s,[[x-4,y+3],[x,y+5],[x+4,y+3],[x+5,y+7],[x+1,y+10],[x-4,y+7]],c.barkDark);s.line(x-2,y+6,x+1,y+7,c.bark);s.pixel(x+3,y+5,c.barkLight);s.pixel(x+1,y+3,c.skinShadow);}
}
function helmet(s,x,y,back,side,c){
 // Crested steel helmet, gold rim and visor. The worker has neither plume nor armor.
 poly(s,[[x-7,y+4],[x-7,y-4],[x-3,y-9],[x+3,y-9],[x+7,y-5],[x+8,y+4],[x+4,y+9],[x-4,y+9]],c.ink);
 poly(s,[[x-6,y-3],[x-2,y-8],[x+2,y-8],[x+6,y-4],[x+7,y+3],[x+3,y+7],[x-4,y+6]],c.rockDark);
 poly(s,[[x-5,y-4],[x-2,y-7],[x+1,y-7],[x+3,y-2],[x+2,y+3],[x-4,y+2]],c.rockLight);s.line(x-3,y-5,x-2,y+1,c.metalLight);s.rect(x-5,y+3,11,2,c.goldDark);s.line(x-5,y+3,x+4,y+3,c.gold);s.rect(x-1,y-7,2,12,c.gold);s.pixel(x-1,y-6,c.goldLight);
 if(!back){s.rect(x+(side?1:-4),y+5,side?5:9,2,c.ink);s.pixel(x+(side?4:-2),y+5,c.metalLight);s.rect(x-4,y+7,8,2,c.rockDark);s.line(x-3,y+8,x+3,y+8,c.goldDark);}
 const plume=side?2:0;poly(s,[[x-1,y-8],[x-3,y-12],[x-1,y-17],[x+3,y-20],[x+8+plume,y-18],[x+11+plume,y-12],[x+12+plume,y-7],[x+8+plume,y-8],[x+5,y-14],[x+2,y-15],[x+1,y-8]],c.ink);
 poly(s,[[x,y-9],[x-1,y-13],[x+2,y-18],[x+6,y-17],[x+9+plume,y-11],[x+10+plume,y-9],[x+7,y-11],[x+5,y-15],[x+2,y-15]],c.clothDark);s.line(x+1,y-15,x+3,y-17,c.clothLight);s.line(x+3,y-17,x+7,y-13,c.cloth);s.pixel(x+7,y-15,c.clothLight);
}
function shield(s,x,y,c,back=false){
 poly(s,[[x-1,y],[x+12,y-3],[x+15,y+1],[x+14,y+17],[x+7,y+23],[x-1,y+17]],c.ink);
 poly(s,[[x,y+1],[x+12,y-1],[x+13,y+2],[x+12,y+16],[x+7,y+20],[x+1,y+16]],c.goldDark);
 poly(s,[[x+2,y+3],[x+11,y+1],[x+11,y+15],[x+7,y+18],[x+3,y+15]],back?c.barkDark:c.clothDark);
 s.line(x+1,y+1,x+11,y-1,c.goldLight);s.line(x+1,y+2,x+2,y+15,c.gold);s.line(x+12,y+2,x+12,y+14,c.gold);s.line(x+4,y+16,x+7,y+19,c.goldLight);
 if(back){s.line(x+4,y+5,x+9,y+12,c.barkLight);s.rect(x+5,y+7,4,3,c.rockDark);}
 else {s.line(x+4,y+4,x+9,y+3,c.cloth);s.line(x+4,y+13,x+9,y+12,c.cloth);s.rect(x+6,y+6,3,7,c.gold);s.pixel(x+8,y+4,c.goldLight);s.pixel(x+9,y+5,c.gold);s.line(x+5,y+8,x+3,y+6,c.gold);s.line(x+8,y+9,x+10,y+7,c.goldLight);s.line(x+7,y+11,x+4,y+14,c.gold);s.pixel(x+10,y+12,c.goldLight);}
}
function sword(s,hand,tip,c){
 const [x,y]=hand,[tx,ty]=tip;stroke(s,x,y,tx,ty,4,c.ink);stroke(s,x,y-1,tx,ty,2,c.rockLight);s.line(x-1,y-2,tx-1,ty+1,c.metalLight);s.line(x+1,y-3,tx+1,ty+3,c.rock);s.line(x-4,y+1,x+4,y-1,c.goldDark);s.line(x-3,y,x+3,y-1,c.goldLight);stroke(s,x,y+2,x+1,y+5,2,c.barkDark);s.pixel(x+1,y+6,c.gold);
}
function hammer(s,hand,tip,c,build){
 const [x,y]=hand,[tx,ty]=tip;stroke(s,x-14,y-2,tx,ty,3,c.ink);stroke(s,x-13,y-2,tx,ty,1,c.barkLight);s.line(x-9,y-3,tx-1,ty-1,c.bark);
 if(build){poly(s,[[tx-5,ty-4],[tx+4,ty-5],[tx+6,ty-1],[tx+4,ty+3],[tx-5,ty+2]],c.ink);s.rect(tx-4,ty-3,8,4,c.rockDark);s.line(tx-4,ty-3,tx+3,ty-4,c.metalLight);s.rect(tx+3,ty-2,2,3,c.rockLight);}
 else {poly(s,[[tx-4,ty-7],[tx+3,ty-8],[tx+7,ty-4],[tx+6,ty+4],[tx+2,ty+7],[tx-4,ty+5]],c.ink);poly(s,[[tx-3,ty-5],[tx+2,ty-6],[tx+5,ty-3],[tx+4,ty+3],[tx+1,ty+5],[tx-3,ty+3]],c.rockDark);s.line(tx-2,ty-5,tx+2,ty-6,c.metalLight);s.rect(tx-2,ty-3,4,5,c.rockLight);s.line(tx+3,ty-2,tx+3,ty+2,c.rock);s.pixel(tx+1,ty+4,c.rockHighlight);}
}
function fallen(s,type,frame,c,back){
 // Four authored collapse/recovery-free poses: knee, fall, grounded, settled.
 s.ellipse(32,50,21,4,c.earth);const y=[36,42,46,48][frame];
 if(frame===0){boot(s,25,46,c);boot(s,40,46,c);poly(s,[[24,30],[35,30],[40,42],[29,45],[23,40]],type==='worker'?c.clothDark:c.rockDark);if(type==='worker')workerHead(s,27,23,back,true,c);else helmet(s,28,22,back,true,c);}
 else {poly(s,[[17,y-4],[35,y-7],[43,y-1],[39,y+5],[21,y+5],[14,y+2]],c.ink);s.rect(19,y-3,18,6,c.clothDark);s.line(20,y-3,34,y-5,c.cloth);s.rect(36,y,12,4,c.barkDark);s.rect(47,y+1,6,4,c.bark);s.line(47,y+1,51,y+1,c.barkLight);if(type==='worker')workerHead(s,18,y-7,false,true,c);else {s.ellipse(18,y-6,7,6,c.rockDark);s.ellipse(16,y-8,4,3,c.rockLight);s.line(15,y-10,20,y-10,c.gold);s.line(19,y-12,27,y-10,c.clothLight);}}
 if(type==='worker')hammer(s,[35,50],[51,49-frame],c,false);else {shield(s,36,34+frame*2,c,true);sword(s,[21,53],[5+frame,45],c);}
}
export function humanUnit(Surface,p,type,owner,direction,state,frame){
 const s=new Surface(64,64),c=colors(p,owner),mirror=[3,4,5].includes(direction),dir=mirror?({3:1,4:0,5:7}[direction]):direction,back=dir>=6,side=dir===0||dir===7;
 if(state==='death'){fallen(s,type,frame,c,back);}
 else {
  const stride=state==='walk'?[-2,1,3,-1][frame]:0,bob=state==='walk'?[0,-1,0,1][frame]:0,lean=['attack','gather','build'].includes(state)?[0,-1,2,1][frame]:0,x=32+(side?2:dir===1?1:0)+lean,y=(type==='worker'?30:36)+bob;
  const stepX=side?stride:dir===1?Math.round(stride*.7):0,stepY=(back?-1:1)*(side?Math.round(stride*.4):stride);
  s.ellipse(32,52,17,4,c.earth);s.ellipse(31,51,12,2,c.barkDark);
  // Legs remain grounded and opposing strides read as walking at normal size.
  limb(s,[x-5,y+5],[27-stepX,45+stepY],c,5,type==='worker'?c.linenShadow:c.rockDark,type==='worker'?c.linen:c.rockLight);
  limb(s,[x+5,y+5],[38+stepX,45-stepY],c,5,type==='worker'?c.linenShadow:c.rockDark,type==='worker'?c.linen:c.rockLight);
  boot(s,27-stepX,47+stepY,c);boot(s,38+stepX,47-stepY,c);
  if(type==='worker'){
   // Off-white rolled sleeves, shaded blue waistcoat, belt, linen trousers and pouch.
   poly(s,[[x-10,y-13],[x+8,y-14],[x+12,y-8],[x+9,y+6],[x-7,y+8],[x-12,y]],c.ink);
   poly(s,[[x-9,y-12],[x+7,y-13],[x+10,y-7],[x+7,y+6],[x-6,y+6],[x-10,y]],c.linenShadow);s.rect(x-6,y-10,11,9,c.linen);s.line(x-6,y-10,x-2,y-12,c.linenLight);
   poly(s,[[x-6,y-12],[x-1,y-11],[x+1,y-3],[x+2,y+5],[x-6,y+5],[x-8,y-4]],c.clothDark);poly(s,[[x+4,y-12],[x+7,y-8],[x+6,y+5],[x+2,y+6],[x+1,y-4]],c.cloth);
   s.line(x-5,y-10,x-3,y-4,c.clothLight);s.line(x-5,y-3,x-5,y+3,c.cloth);s.line(x+4,y-8,x+5,y,c.clothLight);s.rect(x-6,y+4,13,3,c.barkDark);s.rect(x-1,y+4,3,2,c.gold);s.pixel(x,y+4,c.goldLight);
   s.rect(x-9,y+4,6,6,c.ink);s.rect(x-8,y+5,4,4,c.bark);s.line(x-8,y+5,x-5,y+5,c.barkLight);s.pixel(x-6,y+7,c.goldDark);
   s.line(x-7,y-6,x-5,y-3,c.linenLight);s.line(x+6,y-7,x+7,y-4,c.linenShadow);workerHead(s,x+(side?3:0),y-20,back,side,c);
   const swing=['gather','build','attack'].includes(state)?[0,-10,-4,5][frame]:0,h=[x+7,y-2+swing],tip=[x+18-(swing<-5?8:0),y-2+swing-(swing<-5?7:0)];
   const leftShoulder=[x-10,y-9],rightShoulder=[x+10,y-8];
   if(back){limb(s,leftShoulder,[x-10,y-2],c,5,c.linenShadow,c.linen);limb(s,[x-10,y-2],[x+1,y-1+swing],c,4,c.skinShadow,c.skin);}
   else {limb(s,leftShoulder,[x-9,y],c,5,c.linenShadow,c.linenLight);limb(s,[x-11,y-1],[x-2,y-3+swing],c,4,c.skinShadow,c.skin);}
   hammer(s,h,tip,c,state==='build');limb(s,rightShoulder,[x+12,y-1+swing/2],c,5,c.linenShadow,c.linen);limb(s,[x+12,y-1+swing/2],h,c,4,c.skinShadow,c.skinLight);s.rect(x-3,y-4+swing,3,3,c.skin);
   if(back){poly(s,[[x-6,y-12],[x+5,y-12],[x+7,y-5],[x+5,y+3],[x-6,y+3]],c.clothDark);s.rect(x-3,y-10,6,10,c.cloth);s.line(x-5,y-11,x-6,y+3,c.clothLight);s.line(x-3,y-10,x+3,y-8,c.clothLight);s.line(x+3,y-5,x+4,y+1,c.cloth);}
  }else {
   // Broad steel shoulders and segmented armor; saturated tabard and gold edging.
   poly(s,[[x-10,y-14],[x+8,y-15],[x+11,y-8],[x+8,y+6],[x-6,y+8],[x-10,y]],c.ink);
   poly(s,[[x-7,y-12],[x+6,y-13],[x+8,y-7],[x+6,y+5],[x-5,y+5],[x-8,y-5]],c.rockDark);
   poly(s,[[x-6,y-11],[x+2,y-12],[x+5,y-5],[x+1,y],[x-6,y-3]],c.rockLight);s.line(x-5,y-10,x+1,y-11,c.metalLight);s.line(x-6,y-5,x,y-3,c.rockHighlight);
   poly(s,[[x-3,y-10],[x+5,y-10],[x+6,y+5],[x+8,y+12],[x+1,y+10],[x-5,y+12],[x-3,y+3]],c.clothDark);s.line(x-2,y-9,x+3,y-9,c.gold);s.rect(x-1,y-7,5,8,c.cloth);s.line(x,y-6,x,y,c.clothLight);s.line(x-4,y+9,x+1,y+7,c.goldDark);s.line(x+2,y+7,x+6,y+10,c.gold);
   s.rect(x-7,y+2,15,3,c.barkDark);s.rect(x-1,y+2,4,3,c.gold);s.rect(x,y+3,2,1,c.goldLight);
   for(const dx of [-10,8]){s.ellipse(x+dx,y-10,6,5,c.ink);s.ellipse(x+dx,y-11,5,4,c.rock);s.ellipse(x+dx-1,y-12,3,2,c.rockHighlight);s.line(x+dx-3,y-14,x+dx+1,y-14,c.metalLight);s.line(x+dx-4,y-8,x+dx+3,y-8,c.goldDark);s.pixel(x+dx-3,y-8,c.goldLight);}
   helmet(s,x+(side?3:dir===1?1:0),y-14,back,side,c);
   const swing=state==='attack'?[0,-5,10,5][frame]:0,hand=[x-14,y-4+swing/2],tip=state==='attack'&&frame===2?[x+7,y-10]:[x-19+(side?3:0),y-29+swing];
   limb(s,[x-11,y-8],hand,c,4,c.rockDark,c.rockLight);sword(s,hand,tip,c);s.rect(hand[0]-2,hand[1]+1,4,3,c.rockLight);s.line(hand[0]-2,hand[1]+1,hand[0]+1,hand[1]+1,c.gold);
   shield(s,x+6+(side?-3:0),y-9+(state==='attack'?frame%2:0),c,back);
   if(back){s.rect(x-4,y-10,8,9,c.clothDark);s.line(x-3,y-9,x+2,y-9,c.gold);s.line(x-2,y-7,x-2,y-2,c.clothLight);}
  }
 }
 if(mirror){const original=s.data.slice();for(let y=0;y<64;y++)for(let x=0;x<64;x++)s.data.set(original.subarray((y*64+x)*4,(y*64+x)*4+4),(y*64+63-x)*4);}
 return s;
}

function masonry(s,x,y,w,h,c,shade=false){
 s.rect(x,y,w,h,c.ink);s.rect(x+1,y+1,w-2,h-2,shade?c.rockDark:c.rock);
 for(let row=0;row<Math.floor((h-2)/5);row++)for(let col=-1;col<w/8;col++){
  const xx=x+1+col*8+(row%2?4:0),yy=y+1+row*5;
  const l=Math.max(x+1,xx),r=Math.min(x+w-1,xx+7);if(r<=l)continue;
  s.rect(l,yy,r-l,4,shade?c.rock:((row+col)%3?c.rockLight:c.rockHighlight));s.line(l,yy,r-1,yy,shade?c.rockLight:c.metalLight);s.pixel(r-1,yy+3,c.rockDark);
 }
}
function battlements(s,x,y,w,c){s.rect(x,y+5,w,4,c.ink);s.rect(x+1,y+5,w-2,2,c.rockHighlight);for(let dx=0;dx<w;dx+=7){s.rect(x+dx,y,5,8,c.ink);s.rect(x+dx+1,y+1,3,6,c.rockLight);s.line(x+dx+1,y+1,x+dx+3,y+1,c.metalLight);}}
function roof(s,x,y,w,h,c){
 poly(s,[[x-2,y+h],[x+w/2,y-2],[x+w+2,y+h],[x+w/2,y+h+5]],c.ink);
 poly(s,[[x,y+h],[x+w/2,y],[x+w/2,y+h+3]],c.cloth);poly(s,[[x+w/2,y],[x+w,y+h],[x+w/2,y+h+3]],c.clothDark);
 for(let yy=5;yy<h;yy+=4){const span=yy*w/(2*h);s.line(x+w/2-span,y+yy,x+w/2,y+yy+2,c.clothLight);s.line(x+w/2,y+yy+2,x+w/2+span,y+yy,c.cloth);for(let xx=x+w/2-span+3;xx<x+w/2+span;xx+=5)s.line(xx,y+yy,xx-1,y+yy+3,c.clothDark);}
 s.line(x,y+h,x+w/2,y+h+3,c.goldDark);s.line(x+w/2,y+h+3,x+w,y+h,c.gold);s.pixel(x+w/2,y,c.goldLight);
}
function flag(s,x,y,c){s.line(x,y,x,y+16,c.ink);s.line(x+1,y,x+1,y+15,c.gold);s.pixel(x+1,y-1,c.goldLight);poly(s,[[x+2,y+1],[x+8,y],[x+13,y+3],[x+16,y+2],[x+15,y+7],[x+9,y+5],[x+3,y+6]],c.clothDark);s.line(x+3,y+1,x+7,y+1,c.clothLight);s.line(x+8,y+2,x+11,y+3,c.cloth);s.line(x+4,y+2,x+4,y+4,c.cloth);}
function banner(s,x,y,w,h,c){poly(s,[[x,y],[x+w,y],[x+w,y+h-5],[x+w/2,y+h],[x,y+h-5]],c.goldDark);poly(s,[[x+1,y+1],[x+w-1,y+1],[x+w-1,y+h-6],[x+w/2,y+h-2],[x+1,y+h-6]],c.clothDark);s.line(x+1,y+1,x+w-2,y+1,c.goldLight);s.line(x+1,y+2,x+1,y+h-6,c.clothLight);s.line(x+w-1,y+1,x+w-1,y+h-6,c.gold);const xx=x+w/2,yy=y+h/2;s.rect(xx-1,yy-3,3,7,c.gold);s.pixel(xx+1,yy-5,c.goldLight);s.line(xx-1,yy,xx-4,yy-3,c.gold);s.line(xx+1,yy+1,xx+4,yy-1,c.goldLight);s.line(xx,yy+3,xx-3,yy+6,c.gold);s.pixel(xx+3,yy+5,c.goldLight);}
function tower(s,x,y,w,h,c,withRoof=true){masonry(s,x,y,w,h,c);masonry(s,x+w-5,y+3,5,h-3,c,true);s.rect(x+3,y+10,4,10,c.ink);s.rect(x+4,y+11,2,7,c.goldDark);s.pixel(x+4,y+11,c.gold);s.rect(x-1,y+h-4,w+2,4,c.rockDark);s.line(x,y+h-4,x+w,y+h-4,c.rockHighlight);battlements(s,x-2,y-5,w+4,c);if(withRoof)roof(s,x+1,y-23,w-2,20,c);}
export function humanBase(Surface,p,owner,stage){
 const s=new Surface(128,128),c=colors(p,owner);
 // Oblique castle composition on the existing 48/96px logical base. The pixel art is decorative.
 s.ellipse(64,108,54,10,c.earth);s.ellipse(64,107,45,7,c.barkDark);
 poly(s,[[19,93],[71,76],[115,93],[73,113]],c.rockDark);poly(s,[[21,92],[72,78],[111,92],[72,109]],c.rock);
 for(let y=92;y<108;y+=4)s.line(27+(y-92)/2,y,100-(y-92)*1.5,y,c.rockLight);
 if(stage==='foundation'){
  masonry(s,27,81,74,15,c);masonry(s,33,70,39,15,c,true);s.rect(42,83,34,8,c.earth);for(const x of [30,94]){s.rect(x,77,10,19,c.rockDark);s.rect(x+1,78,7,6,c.rockLight);}s.rect(47,97,28,3,c.bark);s.line(48,97,73,97,c.barkLight);s.rect(53,101,14,4,c.barkDark);flag(s,99,66,c);return s;
 }
 // Rear keep and hall first, foreground gatehouse and towers last for coherent occlusion.
 masonry(s,50,47,48,47,c,true);roof(s,51,26,46,24,c);s.rect(92,59,3,32,c.barkLight);s.rect(56,57,5,15,c.ink);s.rect(57,59,2,9,c.goldDark);s.rect(86,61,5,14,c.ink);s.rect(87,63,2,8,c.gold);
 tower(s,40,36,27,53,c,true);flag(s,52,3,c);banner(s,48,43,13,27,c);
 tower(s,94,61,17,39,c,false);
 // Lower timber hall, its blue pitched roof and visible beamwork.
 masonry(s,22,78,37,22,c);s.rect(24,66,33,15,c.barkDark);s.rect(26,68,29,11,c.linenShadow);for(const x of [26,37,49])s.rect(x,67,2,13,c.bark);s.line(26,69,36,78,c.barkLight);s.line(47,69,39,78,c.barkLight);roof(s,20,53,39,18,c);
 masonry(s,44,78,50,24,c);battlements(s,43,73,52,c);
 // Heavy rounded portal with radial arch stones and inset oak gate.
 s.ellipse(68,89,12,12,c.ink);s.rect(56,89,25,14,c.ink);s.ellipse(68,89,9,9,c.barkDark);s.rect(59,89,19,13,c.barkDark);for(let x=60;x<78;x+=4){s.rect(x,87,2,14,c.bark);s.line(x,88,x,99,c.barkLight);}s.line(68,84,68,101,c.ink);s.line(60,92,76,92,c.rockDark);s.line(60,97,76,97,c.rockDark);s.pixel(66,95,c.goldLight);s.pixel(70,95,c.goldLight);
 for(const [x,y] of [[56,89],[57,84],[60,79],[65,76],[71,77],[76,80],[79,85],[80,90]]){s.rect(x,y,4,5,c.rockDark);s.rect(x,y,3,3,c.rockHighlight);s.pixel(x,y,c.metalLight);}
 tower(s,16,72,19,30,c,true);flag(s,24,38,c);tower(s,84,78,22,29,c,true);flag(s,94,40,c);banner(s,88,84,12,20,c);
 // Courtyard stairs, torch brackets, stone caps and tiny material accents.
 for(let n=0;n<3;n++){s.rect(55-n*2,101+n*3,27+n*4,3,c.rockDark);s.line(55-n*2,101+n*3,80+n*2,101+n*3,c.rockHighlight);for(let x=57-n*2;x<80+n*2;x+=6)s.pixel(x,102+n*3,c.rock);}
 for(const x of [50,81]){s.rect(x,90,2,10,c.ink);s.rect(x-1,93,4,2,c.rock);poly(s,[[x-1,91],[x-2,86],[x,81],[x+2,86],[x+3,91]],c.goldDark);s.rect(x,85,2,5,c.gold);s.pixel(x,84,c.goldLight);}
 s.rect(35,101,7,6,c.barkDark);s.rect(36,102,5,4,c.bark);s.line(37,102,37,105,c.barkLight);s.rect(109,96,6,6,c.rockDark);s.line(110,96,113,96,c.rockHighlight);s.pixel(18,105,c.leaf);s.pixel(107,108,c.leafLight);
 if(stage==='building'){
  // Authored construction: open timber scaffolding, unfinished central roof and stone stock.
  for(const x of [38,76]){s.rect(x,32,3,71,c.barkDark);s.line(x,33,x,101,c.barkLight);}for(const y of [43,63,82]){s.rect(35,y,48,3,c.bark);s.line(35,y,81,y,c.barkLight);}s.line(40,65,74,44,c.barkLight);s.line(41,84,74,65,c.barkLight);s.rect(38,12,30,20,c.ink);s.rect(40,14,26,18,c.barkDark);s.line(41,31,52,17,c.barkLight);s.line(52,17,63,31,c.barkLight);s.rect(111,102,8,5,c.rockLight);
 }
 if(stage==='damaged'){
  // Collapse notch follows the roof slope; cracks and rubble don't move the base anchor.
  poly(s,[[51,16],[58,21],[62,30],[52,34],[47,29]],c.ink);s.line(49,23,54,31,c.bark);s.line(51,26,58,32,c.barkLight);s.line(45,60,49,66,c.ink);s.line(49,66,46,71,c.ink);s.line(96,88,92,95,c.ink);for(const [x,y]of [[35,108],[42,111],[104,106]]){s.rect(x,y,5,3,c.rockDark);s.rect(x,y,3,1,c.rockHighlight);}
 }
 return s;
}

// Shared integer-pixel material brushes; Human compositions above remain unchanged.
export const pixelParts={limb,boot,helmet,shield,sword,masonry,battlements,roof,flag,banner,tower};
