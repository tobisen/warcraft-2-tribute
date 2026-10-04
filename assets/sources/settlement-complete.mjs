/** Original native settlement sprites. Barracks includes the reference ranged-training wing. */
import {pixelParts as stone} from './humans.mjs';
import {buildingParts as b} from './faction-bases.mjs';
import {factionColors,crest} from './faction-people.mjs';
const poly=(s,v,c)=>s.polygon(v,c);
function fence(s,x,y,w,c){s.rect(x,y+7,w,2,c.barkDark);s.rect(x,y+14,w,2,c.bark);for(let dx=0;dx<w;dx+=8){poly(s,[[x+dx,y+18],[x+dx,y+3],[x+dx+2,y],[x+dx+4,y+3],[x+dx+4,y+18]],c.ink);s.rect(x+dx+1,y+3,2,14,c.barkLight);}}
function gear(s,x,y,r,c){s.ellipse(x,y,r,r,c.ink);s.ellipse(x,y,r-1,r-1,c.goldDark);s.ellipse(x,y,r-3,r-3,c.gold);s.ellipse(x,y,r-5,r-5,c.ink);for(const [dx,dy]of [[-r,0],[r,0],[0,-r],[0,r]]){s.rect(x+dx-2,y+dy-2,4,4,c.gold);s.pixel(x+dx-1,y+dy-2,c.goldLight);}s.rect(x-2,y-2,4,4,c.rockDark);s.pixel(x-1,y-1,c.metalLight);}
function target(s,x,y,c){s.ellipse(x,y,5,7,c.ink);s.ellipse(x,y,4,6,c.linen);s.ellipse(x,y,3,4,c.teamRed);s.ellipse(x,y,1,2,c.linenLight);s.line(x-2,y+7,x-4,y+13,c.barkLight);s.line(x+2,y+7,x+4,y+13,c.bark);}
function weapons(s,x,y,c,faction){s.rect(x-2,y+14,20,3,c.barkDark);for(let n=0;n<3;n++){const xx=x+n*6;s.line(xx,y+17,xx+2,y,c.barkLight);poly(s,[[xx,y],[xx+2,y-5],[xx+4,y]],c.rockHighlight);}s.rect(x+15,y+5,10,13,c.goldDark);s.rect(x+16,y+6,8,10,c.team);crest(s,x+20,y+11,c,faction);}
function foundation(s,c,size){const base=size===64?48:96;stone.masonry(s,size*.2,base-12,size*.6,18,c);s.rect(size*.3,base-8,size*.3,11,c.earth);s.rect(size*.24,base+9,size*.3,3,c.barkLight);}
function farm(Surface,c,faction,stage){
 const s=new Surface(64,64);s.ellipse(32,55,28,5,c.earth);if(stage==='foundation'){foundation(s,c,64);return s;}
 const orc=faction==='clans',elf=faction==='elves',tech=faction==='goblins',dwarf=faction==='dwarves';
 stone.masonry(s,20,33,33,20,c);b.timber(s,22,30,28,19,c);s.rect(35,41,8,13,c.ink);s.rect(36,43,6,10,c.barkDark);s.pixel(40,48,c.gold);
 if(orc){s.ellipse(35,28,23,16,c.ink);s.ellipse(35,28,21,14,c.clothDark);s.ellipse(30,25,14,9,c.cloth);for(let x=17;x<52;x+=7)s.line(x,28,x+3,40,c.linenShadow);poly(s,[[16,37],[11,25],[15,17],[16,30],[20,38]],c.linenLight);poly(s,[[51,37],[56,24],[52,17],[52,30],[48,38]],c.linenShadow);s.rect(22,39,28,3,c.rockDark);}
 else if(tech){s.ellipse(34,27,22,15,c.ink);s.ellipse(34,27,20,13,c.clothDark);s.ellipse(31,25,16,10,c.cloth);for(const x of [22,34,46])s.line(x,19,x-1,38,c.gold);s.line(16,29,51,29,c.gold);s.rect(17,39,35,3,c.goldDark);s.pixel(22,22,c.clothLight);}
 else {b.roof(s,16,15,41,21,c);if(faction==='crown'){for(let x=18;x<56;x+=3)s.line(x,29,x+1,36,c.gold);s.line(18,29,54,29,c.goldLight);}if(elf){b.greenery(s,22,17,14,7,c);s.line(16,37,35,16,c.goldLight);}}
 if(faction==='crown'||tech){const x=18,y=24;stone.masonry(s,9,30,12,22,c);s.line(x,y-18,x,y+26,c.barkDark);s.line(x-16,y,x+16,y,c.barkDark);for(const [dx,dy]of [[-13,-13],[3,-13],[-13,3],[3,3]]){poly(s,[[x+dx,y+dy],[x+dx+9,y+dy],[x+dx+8,y+dy+9],[x+dx+1,y+dy+9]],c.barkDark);s.rect(x+dx+2,y+dy+1,5,7,c.linen);s.line(x+dx+2,y+dy+1,x+dx+6,y+dy+1,c.linenLight);}s.ellipse(x,y,3,3,c.barkDark);s.pixel(x-1,y-1,c.gold);}
 if(dwarf){b.copper(s,19,31,36,4,c);s.line(49,14,59,12,c.barkLight);s.line(59,12,59,39,c.rock);s.rect(54,37,8,8,c.barkDark);s.rect(55,38,6,5,c.gold);s.line(59,12,49,24,c.barkDark);}
 if(!orc&&!tech){stone.masonry(s,45,12,7,15,c);s.rect(46,11,5,2,c.ink);s.ellipse(47,7,3,2,c.rock);s.ellipse(50,4,3,2,c.rockLight);}
 s.rect(26,40,6,8,c.ink);s.rect(27,41,4,6,c.team);s.pixel(27,41,c.teamLight);
 fence(s,3,42,14,c);fence(s,46,44,15,c);for(const x of [5,10,15]){s.line(x,54,x+1,46,elf||tech?c.leaf:c.goldDark);s.pixel(x+1,46,elf||tech?c.teamRedLight:c.goldLight);s.pixel(x,48,elf||tech?c.leafHighlight:c.gold);}s.rect(44,52,8,5,c.barkDark);s.line(45,52,50,52,c.barkLight);
 if(stage==='building'){s.rect(18,12,2,43,c.barkLight);s.rect(53,15,2,40,c.bark);s.line(17,22,56,22,c.barkLight);s.line(20,41,52,24,c.barkLight);}
 if(stage==='damaged'){poly(s,[[31,23],[36,24],[40,34],[31,34]],c.ink);s.line(32,25,37,32,c.barkLight);s.rect(25,56,5,2,c.rockDark);}
 return s;
}
export function settlement(Surface,p,faction,kind,owner,stage){
 const c=factionColors(p,faction,owner);if(kind==='farm')return farm(Surface,c,faction,stage);
 const s=new Surface(128,128),orc=faction==='clans',elf=faction==='elves',dwarf=faction==='dwarves',tech=faction==='goblins';s.ellipse(64,110,53,8,c.earth);poly(s,[[14,100],[56,85],[115,101],[73,117]],c.rockDark);for(let y=100;y<114;y+=4)s.line(22+(y-100),y,110-(y-100),y,c.rockLight);
 if(stage==='foundation'){foundation(s,c,128);stone.flag(s,96,61,c);return s;}
 stone.masonry(s,30,69,66,35,c);b.timber(s,33,51,60,25,c);b.roof(s,26,27,73,32,c,orc);for(const x of [32,57,86]){s.rect(x,57,3,24,c.barkDark);s.line(x,58,x,79,c.barkLight);}s.line(32,60,57,77,c.barkLight);s.line(58,77,85,58,c.barkLight);
 if(elf){s.line(27,61,63,28,c.goldLight);s.line(63,28,97,61,c.gold);b.greenery(s,36,36,18,7,c);b.greenery(s,91,57,14,7,c);}
 if(dwarf||tech){b.copper(s,29,68,69,6,c);b.copper(s,34,52,57,4,c);}
 stone.flag(s,62,13,c);b.banner(s,81,76,13,26,c,faction);b.window(s,66,61,c);
 if(kind==='barracks'){
  b.entry(s,48,85,c,orc);b.torch(s,31,92,c);b.torch(s,65,92,c);weapons(s,17,83,c,faction);
  // Both reference buildings are visible: main barracks and the ranged-training wing.
  stone.masonry(s,91,74,22,28,c);b.roof(s,85,57,33,19,c,orc);b.timber(s,94,69,16,11,c);for(const [x,y]of [[90,102],[102,99],[114,96]])target(s,x,y,c);s.line(109,53,109,81,c.barkLight);s.line(109,53,116,54,c.gold);
  if(orc){for(const x of [27,90])b.horn(s,x,61,c,x===27?1:-1);s.ellipse(49,68,6,4,c.linenLight);s.pixel(47,68,c.ink);s.pixel(51,68,c.ink);}
  else if(tech){stone.tower(s,80,49,24,35,c,false);s.ellipse(92,39,16,12,c.ink);s.ellipse(92,39,14,10,c.cloth);s.line(80,39,103,39,c.gold);s.line(92,28,92,49,c.gold);gear(s,62,69,8,c);s.rect(109,57,5,13,c.goldDark);}
  else {stone.tower(s,84,56,18,25,c,true);if(dwarf){b.copper(s,83,61,20,5,c);b.chimney(s,29,34,c);}else if(elf)b.greenery(s,19,76,12,6,c);}
 }else {
  // Reference furnaces, anvils, forge wheels, crystals and workshop machinery.
  stone.masonry(s,44,81,28,25,c);s.ellipse(58,91,12,12,c.ink);s.rect(47,91,22,13,c.ink);s.ellipse(58,92,9,8,c.goldDark);s.ellipse(58,95,6,5,c.teamRed);poly(s,[[52,100],[52,93],[57,87],[57,95],[61,90],[65,96],[63,101]],c.gold);s.rect(56,95,4,6,c.goldLight);s.line(45,103,71,103,c.rockLight);
  b.chimney(s,88,30,c);s.rect(20,96,19,4,c.rockDark);poly(s,[[17,92],[39,92],[35,96],[26,96],[24,100],[21,100],[22,96]],c.rockHighlight);s.line(19,92,36,92,c.metalLight);b.torch(s,38,86,c);
  if(orc){gear(s,86,88,18,c);for(const x of [28,96])b.horn(s,x,63,c,x===28?1:-1);b.timber(s,80,80,6,27,c);s.rect(78,108,16,3,c.barkLight);}
  if(elf){poly(s,[[65,15],[75,30],[73,51],[64,65],[55,48],[55,29]],c.goldDark);poly(s,[[65,19],[71,30],[69,49],[64,60],[58,47],[59,30]],c.humanBlueDark);poly(s,[[65,22],[68,32],[65,52],[61,46],[62,30]],c.humanBlueLight);s.line(65,23,65,46,c.metalLight);s.line(55,29,48,47,c.gold);s.line(48,47,59,59,c.goldLight);b.greenery(s,88,75,15,7,c);}
  if(dwarf){b.copper(s,40,79,36,6,c);b.copper(s,40,102,36,5,c);gear(s,82,86,9,c);}
  if(tech){s.rect(76,58,19,43,c.ink);s.rect(77,59,17,40,c.clothDark);s.rect(79,61,7,36,c.cloth);s.line(78,60,78,94,c.clothLight);for(const y of [61,77,94])s.rect(76,y,19,3,c.gold);s.ellipse(35,55,14,9,c.goldDark);s.ellipse(35,53,12,7,c.gold);s.rect(31,40,7,16,c.goldDark);s.line(32,41,32,51,c.goldLight);s.line(33,59,33,79,c.gold);s.line(33,79,45,79,c.gold);gear(s,86,58,9,c);s.line(16,34,29,31,c.barkLight);s.line(16,34,16,89,c.barkDark);s.line(16,34,29,53,c.barkLight);s.rect(10,86,12,10,c.rockDark);s.rect(12,88,8,5,c.goldDark);}
 }
 s.rect(34,76,7,12,c.team);s.line(34,76,40,76,c.teamLight);
 fence(s,13,98,21,c);s.rect(100,107,10,6,c.barkDark);s.line(101,108,108,108,c.barkLight);s.ellipse(24,106,5,6,c.barkDark);s.line(20,105,27,105,c.rockLight);
 if(stage==='building'){for(const x of [27,100]){s.rect(x,27,3,82,c.barkDark);s.line(x,28,x,108,c.barkLight);}for(const y of [41,63,84])s.line(25,y,105,y,c.barkLight);s.line(30,83,98,63,c.barkLight);}
 if(stage==='damaged'){poly(s,[[49,37],[59,42],[63,55],[50,60]],c.ink);s.line(51,42,58,55,c.barkLight);s.line(94,88,89,99,c.ink);s.rect(72,110,6,3,c.rockDark);}
 return s;
}
