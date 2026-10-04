/** Original 128px architectural compositions against the four user reference sheets. */
import {pixelParts as parts} from './humans.mjs';
import {factionColors,crest} from './faction-people.mjs';
const poly=(s,points,color)=>s.polygon(points,color);
function timber(s,x,y,w,h,c){s.rect(x,y,w,h,c.ink);s.rect(x+1,y+1,w-2,h-2,c.barkDark);for(let dx=2;dx<w-2;dx+=6){s.rect(x+dx,y+2,4,h-4,c.bark);s.line(x+dx,y+2,x+dx,y+h-3,c.barkLight);s.pixel(x+dx+2,y+5,c.barkDark);}s.rect(x,y+5,w,3,c.rockDark);s.line(x+1,y+5,x+w-2,y+5,c.rockLight);for(let dx=3;dx<w;dx+=7)s.pixel(x+dx,y+6,c.metalLight);}
function horn(s,x,y,c,flip=1){poly(s,[[x,y],[x-4*flip,y-5],[x-5*flip,y-13],[x-2*flip,y-22],[x+1*flip,y-14],[x+5*flip,y-6],[x+4*flip,y]],c.ink);poly(s,[[x,y-2],[x-2*flip,y-7],[x-3*flip,y-13],[x-2*flip,y-18],[x,y-13],[x+3*flip,y-6],[x+2*flip,y-2]],c.linenShadow);s.line(x-2*flip,y-12,x,y-4,c.linenLight);}
function roof(s,x,y,w,h,c,orc=false){parts.roof(s,x,y,w,h,c);if(orc){for(let dx=5;dx<w;dx+=8){const yy=y+h-(dx>w/2?w-dx:dx)*h/(w/2);s.line(x+dx,yy+1,x+dx-2,y+h,c.barkLight);for(let n=3;n<h/2;n+=5)s.line(x+dx-2,y+h-n,x+dx+1,y+h-n+1,c.linenShadow);}s.rect(x-1,y+h,w+2,3,c.rockDark);for(let dx=2;dx<w;dx+=7)s.pixel(x+dx,y+h+1,c.metalLight);}}
function banner(s,x,y,w,h,c,faction){parts.banner(s,x,y,w,h,{...c,clothDark:c.team,clothLight:c.teamLight});crest(s,x+w/2,y+h/2,c,faction);}
function torch(s,x,y,c){s.rect(x,y,2,12,c.ink);s.rect(x-1,y+5,4,2,c.rock);poly(s,[[x-2,y+3],[x-2,y-2],[x,y-7],[x+3,y-2],[x+3,y+3]],c.goldDark);s.rect(x,y-3,2,5,c.gold);s.pixel(x,y-4,c.goldLight);}
function entry(s,x,y,c,wood=false){
 s.ellipse(x,y,11,12,c.ink);s.rect(x-11,y,23,17,c.ink);s.ellipse(x,y,8,9,c.barkDark);s.rect(x-8,y,17,15,c.barkDark);for(let dx=-7;dx<8;dx+=4){s.line(x+dx,y-5,x+dx,y+13,c.bark);s.line(x+dx+1,y-4,x+dx+1,y+12,c.barkLight);}s.line(x,y-7,x,y+14,c.ink);for(const dy of [5,11])s.line(x-8,y+dy,x+8,y+dy,c.rockDark);s.pixel(x-2,y+8,c.goldLight);s.pixel(x+2,y+8,c.goldLight);
 for(const [dx,dy]of [[-13,0],[-12,-6],[-8,-12],[-3,-15],[3,-15],[8,-12],[12,-6],[13,0]]){s.rect(x+dx,y+dy,4,6,wood?c.barkDark:c.rockDark);s.rect(x+dx,y+dy,3,4,wood?c.barkLight:c.rockHighlight);s.pixel(x+dx,y+dy,c.metalLight);}
 for(let n=0;n<3;n++){s.rect(x-13-n*2,y+15+n*3,28+n*4,3,c.rockDark);s.line(x-13-n*2,y+15+n*3,x+13+n*2,y+15+n*3,c.rockHighlight);}
}
function window(s,x,y,c){s.rect(x,y,5,12,c.ink);s.rect(x+1,y+1,3,9,c.goldDark);s.line(x+1,y+1,x+1,y+7,c.goldLight);}
function copper(s,x,y,w,h,c){s.rect(x,y,w,h,c.barkDark);s.rect(x+1,y+1,w-2,h-2,c.copper);s.line(x+1,y+1,x+w-2,y+1,c.copperLight);for(const [dx,dy]of [[2,2],[w-3,h-3]]){s.rect(x+dx,y+dy,2,2,c.rockDark);s.pixel(x+dx,y+dy,c.metalLight);}}
function chimney(s,x,y,c){parts.masonry(s,x,y,12,27,c);copper(s,x-1,y-2,14,6,c);s.rect(x+3,y-1,6,2,c.ink);for(const [dx,dy,r]of [[3,-5,4],[6,-10,5],[3,-16,4]]){s.ellipse(x+dx,y+dy,r,3,c.rock);s.ellipse(x+dx-1,y+dy-1,r-1,2,c.rockLight);}}
function greenery(s,x,y,rx,ry,c){s.ellipse(x,y,rx,ry,c.leafDark);s.ellipse(x-1,y-2,rx-2,ry-1,c.leaf);for(let dy=-ry+2;dy<ry-2;dy+=4)for(let dx=-rx+3;dx<rx-3;dx+=5)if((dx/rx)**2+(dy/ry)**2<.85){s.rect(x+dx,y+dy,3,2,((dx+dy)%3)?c.leafLight:c.leafHighlight);s.pixel(x+dx-1,y+dy+1,c.leafDark);}}
export function factionBase(Surface,p,faction,owner,stage){
 const s=new Surface(128,128),c=factionColors(p,faction,owner);s.ellipse(64,108,54,10,c.earth);s.ellipse(64,107,44,7,c.barkDark);poly(s,[[15,95],[69,77],[115,94],[74,116]],c.rockDark);poly(s,[[19,95],[70,80],[110,95],[74,112]],c.rock);for(let y=96;y<111;y+=4)s.line(25+(y-96),y,103-(y-96),y,c.rockLight);
 if(stage==='foundation'){parts.masonry(s,26,83,77,14,c);timber(s,39,72,36,13,c);s.rect(43,85,34,7,c.earth);s.rect(48,98,28,3,c.barkLight);parts.flag(s,101,67,c);return s;}
 if(faction==='clans'){
  timber(s,44,43,50,52,c);roof(s,39,22,60,27,c,true);horn(s,43,50,c);horn(s,94,50,c,-1);parts.flag(s,69,5,c);
  for(const [x,y]of [[17,65],[94,70]]){parts.masonry(s,x,y+12,18,25,c);timber(s,x-1,y,20,20,c);roof(s,x-3,y-18,24,20,c,true);horn(s,x+10,y-14,c);}
  timber(s,30,78,66,23,c);roof(s,31,58,31,22,c,true);roof(s,70,62,27,21,c,true);
  for(const x of [13,107]){timber(s,x,80,8,24,c);horn(s,x+4,81,c,x===13?1:-1);}
  entry(s,65,85,c,true);banner(s,28,80,12,25,c,faction);banner(s,88,86,12,23,c,faction);s.ellipse(65,66,7,5,c.linenShadow);s.ellipse(65,66,5,4,c.linenLight);s.rect(61,68,8,4,c.linenShadow);s.pixel(62,66,c.ink);s.pixel(67,66,c.ink);s.line(64,68,64,71,c.ink);torch(s,46,91,c);torch(s,83,94,c);
 }else if(faction==='elves'){
  // Living trunk and branching canopy behind elegant masonry and gold curved eaves.
  poly(s,[[51,92],[53,31],[45,15],[55,18],[63,32],[69,15],[77,9],[73,35],[78,90]],c.barkDark);s.line(59,84,62,27,c.barkLight);s.line(63,43,45,22,c.bark);s.line(66,35,89,17,c.barkLight);s.line(63,48,32,29,c.barkLight);
  for(const [x,y,rx,ry]of [[62,15,23,11],[39,27,23,12],[83,22,24,12],[96,36,17,10],[25,40,17,10]])greenery(s,x,y,rx,ry,c);
  parts.masonry(s,46,43,43,48,c);roof(s,42,17,51,34,c);s.line(42,51,66,17,c.goldLight);s.line(66,17,94,51,c.gold);s.line(66,17,66,5,c.gold);s.pixel(66,4,c.goldLight);window(s,61,47,c);window(s,77,49,c);
  for(const [x,y,w]of [[18,68,21],[94,73,18]]){parts.masonry(s,x,y,w,34,c);roof(s,x-2,y-31,w+4,33,c);s.line(x+w/2,y-31,x+w/2,y-40,c.gold);s.pixel(x+w/2,y-41,c.goldLight);window(s,x+8,y+7,c);}
  parts.masonry(s,36,80,62,23,c);roof(s,34,58,40,25,c);entry(s,66,85,c);poly(s,[[46,83],[65,63],[86,83],[83,85],[65,69],[49,87]],c.barkLight);s.line(48,83,65,65,c.goldLight);s.line(65,65,83,83,c.gold);
  for(const [x,y,rx,ry]of [[38,80,12,5],[89,70,14,6],[23,94,10,5],[106,98,10,5]])greenery(s,x,y,rx,ry,c);banner(s,31,85,12,23,c,faction);banner(s,91,87,11,21,c,faction);s.line(18,96,12,112,c.barkLight);s.line(110,94,116,111,c.barkLight);torch(s,50,93,c);torch(s,84,93,c);
 }else if(faction==='dwarves'){
  parts.masonry(s,45,24,30,67,c);parts.battlements(s,43,19,34,c);copper(s,44,37,32,7,c);copper(s,44,57,32,7,c);window(s,51,44,c);window(s,67,45,c);banner(s,53,31,16,34,c,faction);
  parts.masonry(s,72,61,35,39,c);roof(s,69,39,41,25,c);copper(s,71,64,38,5,c);chimney(s,86,34,c);
  parts.masonry(s,22,66,29,37,c);roof(s,18,47,36,23,c);chimney(s,23,39,c);copper(s,20,70,32,6,c);
  parts.masonry(s,35,81,62,24,c);parts.battlements(s,33,76,66,c);entry(s,67,87,c);for(const [x,y]of [[15,75],[94,80]]){parts.tower(s,x,y,21,32,c,true);copper(s,x-1,y+5,23,6,c);copper(s,x-1,y+23,23,5,c);banner(s,x+4,y+8,12,23,c,faction);}torch(s,49,96,c);torch(s,85,96,c);
 }else {
  // Brass dome, workshop stonework, turquois tiled roofs, gears and burgundy pennants.
  parts.masonry(s,40,45,48,53,c);s.ellipse(63,43,24,18,c.ink);s.ellipse(63,42,22,16,c.clothDark);s.ellipse(58,39,17,12,c.cloth);s.line(46,39,43,49,c.clothLight);for(const dx of [-13,0,13])s.line(63+dx*.4,27,63+dx,51,c.gold);s.rect(41,50,46,4,c.goldDark);s.line(43,50,84,50,c.goldLight);s.rect(59,21,7,8,c.goldDark);s.rect(60,20,5,6,c.gold);parts.flag(s,91,4,{...c,clothDark:c.humanRedDark,cloth:c.teamRed,clothLight:c.teamRedLight});s.ellipse(91,25,14,10,c.goldDark);s.ellipse(91,25,12,8,c.ink);s.ellipse(91,25,6,6,c.cloth);s.line(79,21,104,29,c.gold);s.line(82,31,100,18,c.goldLight);
  parts.masonry(s,20,69,28,32,c);roof(s,17,47,34,25,c);parts.masonry(s,80,65,29,37,c);roof(s,77,43,36,25,c);copper(s,78,69,33,5,c);chimney(s,33,34,c);
  parts.masonry(s,38,83,62,23,c);parts.battlements(s,36,77,66,c);entry(s,67,88,c);for(const [x,y]of [[15,78],[95,82]]){parts.tower(s,x,y,20,27,c,true);s.rect(x-1,y+6,22,4,c.goldDark);s.line(x,y+6,x+20,y+6,c.goldLight);}
  banner(s,27,84,12,23,{...c,team:c.humanRedDark,teamLight:c.teamRedLight},faction);banner(s,93,88,12,20,c,faction);s.ellipse(65,64,10,10,c.goldDark);s.ellipse(65,64,7,7,c.gold);s.ellipse(65,64,4,4,c.ink);for(const [dx,dy]of [[-10,0],[10,0],[0,-10],[0,10]])s.rect(63+dx,62+dy,4,4,c.gold);torch(s,50,96,c);torch(s,85,95,c);
 }
 for(const [x,y]of [[11,104],[109,105],[42,110]]){s.rect(x,y,6,4,c.rockDark);s.line(x,y,x+4,y,c.rockHighlight);}s.rect(35,102,6,6,c.barkDark);s.line(36,103,39,103,c.barkLight);
 if(stage==='building'){for(const x of [39,78]){s.rect(x,30,3,73,c.barkDark);s.line(x,31,x,100,c.barkLight);}for(const y of [43,66,84]){s.rect(35,y,49,3,c.bark);s.line(36,y,82,y,c.barkLight);}s.line(42,82,77,65,c.barkLight);s.line(42,64,77,45,c.barkLight);s.rect(109,100,8,6,c.rockLight);}
 if(stage==='damaged'){poly(s,[[51,29],[59,32],[65,43],[54,47],[49,40]],c.ink);s.line(52,35,60,43,c.barkLight);s.line(46,74,50,80,c.ink);s.line(50,80,47,86,c.ink);s.line(97,93,92,98,c.ink);for(const x of [38,45,105]){s.rect(x,110,5,3,c.rockDark);s.pixel(x,110,c.rockLight);}}
 return s;
}

export const buildingParts={timber,horn,roof,banner,torch,entry,window,copper,chimney,greenery};
