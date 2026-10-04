/** Original native-pixel adaptations of the user's Orc/Elf/Dwarf/technician sheets.
 * No imported illustration pixels. Explicit directional anatomy, action and collapse poses.
 */
import {pixelParts as parts} from './humans.mjs';
export function factionColors(p,faction,owner){
 const enemy=owner==='enemy',main=faction==='clans'?p.teamRed:faction==='elves'?p.elfGreen:faction==='goblins'?p.tinkerTeal:p.teamBlue;
 const dark=faction==='clans'?p.humanRedDark:faction==='elves'?p.elfGreenDark:faction==='goblins'?p.tinkerTealDark:p.humanBlueDark;
 const light=faction==='clans'?p.teamRedLight:faction==='elves'?p.elfGreenLight:faction==='goblins'?p.tinkerTealLight:p.humanBlueLight;
 return {...p,cloth:enemy?p.teamRed:main,clothDark:enemy?p.humanRedDark:dark,clothLight:enemy?p.teamRedLight:light,team:enemy?p.teamRed:p.teamBlue,teamLight:enemy?p.teamRedLight:p.teamBlueLight,skin:faction==='clans'?p.orcSkin:p.skin,skinShadow:faction==='clans'?p.orcSkinShadow:p.skinShadow,skinLight:faction==='clans'?p.orcSkinLight:p.skinLight};
}
const poly=(s,points,color)=>s.polygon(points,color);
function band(s,a,b,w,color){for(let i=-Math.floor(w/2);i<=Math.floor(w/2);i++)s.line(a[0]+i,a[1],b[0]+i,b[1],color);}
function crest(s,x,y,c,faction){
 if(faction==='crown'){s.rect(x-1,y-3,3,7,c.gold);s.pixel(x+1,y-5,c.goldLight);s.line(x-1,y,x-4,y-3,c.gold);s.line(x+1,y+1,x+4,y-1,c.goldLight);s.line(x,y+3,x-3,y+6,c.gold);s.pixel(x+3,y+5,c.goldLight);}
 else if(faction==='elves'){s.line(x,y-4,x,y+5,c.gold);for(const dy of [-2,1]){s.line(x,y+dy,x-3,y+dy-3,c.goldLight);s.line(x,y+dy,x+3,y+dy-3,c.gold);}}
 else if(faction==='clans'){s.ellipse(x,y-1,3,3,c.ink);s.rect(x-2,y+1,5,3,c.ink);s.pixel(x-1,y-1,c.teamLight);s.pixel(x+1,y-1,c.teamLight);}
 else {s.ellipse(x,y,4,4,c.gold);s.ellipse(x,y,2,2,c.clothDark);for(const [dx,dy]of [[-5,0],[5,0],[0,-5],[0,5]])s.rect(x+dx-1,y+dy-1,3,3,c.goldLight);}
}
function head(s,x,y,c,faction,guard,back,side){
 const orc=faction==='clans',elf=faction==='elves',dwarf=faction==='dwarves',tech=faction==='goblins',r=orc?8:elf?5:7;
 s.ellipse(x,y,r+1,9,c.ink);s.ellipse(x,y,r,8,c.skinShadow);s.ellipse(x+1,y-2,r-2,6,c.skin);s.rect(x+1,y-4,3,4,c.skinLight);
 if(orc){
  poly(s,[[x-r,y],[x-r-4,y-3],[x-r-3,y+2],[x-r,y+3]],c.skinShadow);poly(s,[[x+r,y],[x+r+4,y-3],[x+r+3,y+2],[x+r,y+3]],c.skin);
  poly(s,[[x-4,y-6],[x-3,y-12],[x+2,y-15],[x+7,y-12],[x+6,y-6]],c.ink);s.line(x,y-12,x+5,y-11,c.rockDark);s.rect(x-3,y-7,8,2,c.cloth);
  if(!back){s.line(x-4,y+4,x+5,y+5,c.ink);poly(s,[[x-4,y+6],[x-5,y+1],[x-2,y+3]],c.linenLight);poly(s,[[x+3,y+6],[x+4,y+1],[x+6,y+4]],c.linenLight);s.rect(x+3,y,4,3,c.skinLight);s.pixel(x+3,y-2,c.ink);s.pixel(x-3,y-2,c.ink);s.line(x-5,y-4,x-1,y-3,c.ink);if(side){s.rect(x-5,y-4,5,5,c.skinShadow);s.rect(x+6,y,3,3,c.skinLight);s.pixel(x+4,y-2,c.ink);}}
  else {s.ellipse(x,y,6,6,c.skinShadow);s.line(x-3,y-4,x-1,y+3,c.skin);s.rect(x-3,y-7,6,5,c.ink);}
 }else if(elf){
  if(guard){parts.helmet(s,x,y+2,back,side,c);poly(s,[[x-7,y+1],[x-12,y-2],[x-9,y+4],[x-7,y+5]],c.skin);}
  else {poly(s,[[x-6,y-5],[x-3,y-9],[x+3,y-9],[x+6,y-5],[x+3,y-2],[x,y-5],[x-4,y]],c.goldDark);s.line(x-4,y-6,x+1,y-7,c.goldLight);s.line(x-4,y-5,x-4,y+5,c.gold);poly(s,[[x-5,y+2],[x-10,y-1],[x-8,y+5],[x-5,y+5]],c.skin);if(!back){s.pixel(x+2+(side?1:0),y,c.ink);if(side)s.rect(x+4,y+2,3,2,c.skinLight);}const hx=x-6;poly(s,[[hx,y-3],[hx-4,y+3],[hx-5,y+15],[hx-9,y+17],[hx-8,y+21],[hx-3,y+18],[hx-1,y+4]],c.goldDark);s.line(hx-2,y+5,hx-4,y+16,c.gold);s.line(hx-3,y+7,hx-4,y+13,c.goldLight);if(back)s.rect(x-4,y-4,8,7,c.gold);}
 }else {
  const beard=dwarf?c.dwarfBeard:c.linenLight,shade=dwarf?c.dwarfBeardShadow:c.linenShadow;
  if(dwarf||guard){poly(s,[[x-8,y-1],[x-8,y-6],[x-4,y-11],[x+3,y-11],[x+8,y-6],[x+9,y]],c.ink);poly(s,[[x-7,y-2],[x-6,y-6],[x-3,y-9],[x+2,y-9],[x+6,y-5],[x+7,y-2]],c.rockDark);s.ellipse(x-2,y-6,4,3,c.rockHighlight);s.pixel(x-3,y-7,c.metalLight);s.line(x-7,y-1,x+7,y-1,c.gold);s.rect(x,y-9,2,9,c.goldDark);s.pixel(x,y-8,c.goldLight);}
  else {poly(s,[[x-8,y-3],[x-5,y-10],[x+2,y-12],[x+7,y-8],[x+8,y-3]],c.ink);poly(s,[[x-7,y-4],[x-4,y-9],[x+2,y-10],[x+6,y-7],[x+7,y-4]],c.humanRedDark);s.line(x-4,y-8,x+2,y-9,c.teamRedLight);}
  if(tech){s.rect(x-8,y-2,16,2,c.barkDark);for(const dx of side?[3]:[-5,3]){s.ellipse(x+dx,y,4,4,c.ink);s.ellipse(x+dx,y,3,3,c.gold);s.ellipse(x+dx,y,2,2,c.clothDark);s.pixel(x+dx-1,y-1,c.clothLight);}s.line(x-1,y,x+1,y,c.goldLight);}
  if(!back){poly(s,[[x-7,y+5],[x-2,y+3],[x+1,y+6],[x+6,y+3],[x+7,y+9],[x+3,y+15],[x-1,y+17],[x-6,y+12]],shade);poly(s,[[x-6,y+5],[x-2,y+5],[x+1,y+7],[x+5,y+5],[x+5,y+9],[x+1,y+14],[x-4,y+11]],beard);s.line(x-3,y+7,x-2,y+11,dwarf?c.gold:c.metalLight);s.line(x+2,y+8,x+1,y+12,dwarf?c.dwarfBeardLight:c.linen);s.rect(x,y+2,4,2,c.skinLight);if(!tech){s.pixel(x+4,y+1,c.ink);if(!side)s.pixel(x-4,y+1,c.ink);else s.rect(x+6,y+2,3,2,c.skinLight);}}
  else {s.rect(x-6,y+2,12,7,dwarf?c.barkDark:c.linenShadow);s.line(x-4,y+3,x-1,y+6,dwarf?c.bark:c.linenLight);}
 }
}
function tool(s,h,t,c,faction,guard,build){
 const [x,y]=t;band(s,[h[0]-12,h[1]-2],t,3,c.ink);band(s,[h[0]-11,h[1]-2],t,1,c.barkLight);
 if(faction==='goblins'&&!guard&&!build){
  poly(s,[[x-5,y+2],[x-7,y-3],[x-6,y-9],[x-2,y-12],[x-2,y-6],[x+2,y-4],[x+5,y-7],[x+4,y-12],[x+8,y-8],[x+8,y-3],[x+4,y+2]],c.ink);poly(s,[[x-4,y],[x-5,y-4],[x-4,y-8],[x-3,y-5],[x+2,y-2],[x+6,y-6],[x+6,y-3],[x+3,y]],c.rockLight);s.line(x-5,y-4,x-4,y-8,c.metalLight);
 }else if(faction==='dwarves'&&!guard&&!build){
  poly(s,[[x-7,y-6],[x-3,y-10],[x+2,y-7],[x+7,y],[x+8,y+9],[x+4,y+5],[x+2,y-1]],c.ink);s.line(x-6,y-6,x-3,y-8,c.metalLight);poly(s,[[x-3,y-8],[x+1,y-6],[x+5,y],[x+6,y+5],[x+3,y],[x,y-4]],c.rockLight);
 }else if(build){s.rect(x-6,y-5,12,7,c.ink);s.rect(x-5,y-4,10,5,c.rock);s.line(x-5,y-4,x+4,y-4,c.metalLight);}
 else {poly(s,[[x-7,y-10],[x-3,y-8],[x+2,y-9],[x+7,y-5],[x+8,y+3],[x+4,y+8],[x,y+5],[x-3,y+4]],c.ink);poly(s,[[x-5,y-8],[x-2,y-6],[x+2,y-7],[x+5,y-4],[x+6,y+2],[x+3,y+5],[x,y+3],[x-2,y+2]],c.rockDark);poly(s,[[x+2,y-7],[x+5,y-4],[x+6,y+2],[x+3,y+5],[x+2,y+1]],c.rockHighlight);s.line(x+3,y-6,x+5,y-3,c.metalLight);s.line(x-4,y-7,x-2,y-5,c.rockLight);}
}
function guardShield(s,x,y,c,faction,back){
 if(faction==='dwarves'||faction==='clans'){
  s.ellipse(x+5,y+8,9,13,c.ink);s.ellipse(x+5,y+8,8,12,faction==='clans'?c.rock:c.goldDark);s.ellipse(x+5,y+8,6,10,c.team);s.line(x-1,y+2,x,y+13,c.teamLight);for(const [dx,dy]of [[0,-10],[7,0],[0,10],[-7,0]])s.pixel(x+5+dx,y+8+dy,c.metalLight);if(faction==='clans')for(const dx of [-7,7])poly(s,[[x+5+dx,y+2],[x+5+dx*1.6,y],[x+5+dx,y+6]],c.rockLight);if(back){s.line(x+1,y+4,x+8,y+12,c.barkLight);}else crest(s,x+5,y+8,c,faction);
 }else {parts.shield(s,x,y,{...c,clothDark:c.team,cloth:c.teamLight},back);if(!back)crest(s,x+7,y+10,c,faction);}
}
export function factionUnit(Surface,p,faction,type,owner,direction,state,frame){
 const s=new Surface(64,64),c=factionColors(p,faction,owner),mirror=[3,4,5].includes(direction),dir=mirror?({3:1,4:0,5:7}[direction]):direction,back=dir>=6,side=dir===0||dir===7,guard=type==='soldier',short=['dwarves','goblins'].includes(faction),orc=faction==='clans',elf=faction==='elves';
 const bob=state==='walk'?[0,-1,0,1][frame]:0,stride=state==='walk'?[-2,1,3,-1][frame]:0,active=['attack','gather','build'].includes(state),lean=active?[0,-1,2,1][frame]:0,x=32+(side?2:dir===1?1:0)+lean,y=(short?35:elf?32:31)+bob,wide=elf?(side?6:7):(side?9:11);
 s.ellipse(32,52,short?17:18,4,c.earth);s.ellipse(31,51,12,2,c.barkDark);
 if(state==='death'&&frame>0){
  const yy=42+frame*2;poly(s,[[16,yy-5],[37,yy-6],[48,yy],[44,yy+6],[19,yy+6],[13,yy]],c.ink);s.rect(21,yy-3,20,7,c.clothDark);s.line(22,yy-3,35,yy-4,c.clothLight);s.rect(40,yy+1,11,5,c.barkDark);s.line(43,yy+1,50,yy+1,c.barkLight);if(guard&&(elf||faction==='goblins')){s.ellipse(18,yy-8,8,6,c.ink);s.ellipse(18,yy-9,7,5,c.rockDark);s.ellipse(16,yy-11,4,2,c.rockLight);s.line(12,yy-7,22,yy-8,c.gold);if(elf){s.line(18,yy-14,27,yy-12,c.clothLight);s.line(20,yy-13,30,yy-11,c.clothDark);}else{s.rect(15,yy-6,6,2,c.linenLight);s.pixel(21,yy-9,c.goldLight);}}else head(s,18,yy-9,c,faction,false,false,true);if(guard)guardShield(s,37,yy-12,c,faction,true);else tool(s,[34,yy+4],[51,yy+2],c,faction,false,false);
 }else {
  const knee=state==='death'?6:0,stepX=side?stride:dir===1?Math.round(stride*.7):0,stepY=(back?-1:1)*(side?Math.round(stride*.4):stride);
  parts.limb(s,[x-5,y+5],[26-stepX,45+stepY],c,short?7:5,guard?c.rockDark:c.linenShadow,guard?c.rockLight:c.linen);parts.limb(s,[x+5,y+5],[39+stepX,45-stepY],c,short?7:5,guard?c.rockDark:c.linenShadow,guard?c.rockLight:c.linen);parts.boot(s,26-stepX,47+stepY,c);parts.boot(s,39+stepX,47-stepY,c);
  poly(s,[[x-wide,y-13+knee],[x+wide-1,y-13+knee],[x+wide+2,y-4+knee],[x+wide-2,y+8],[x-wide+1,y+8],[x-wide-2,y-3+knee]],c.ink);
  poly(s,[[x-wide+1,y-12+knee],[x+wide-2,y-12+knee],[x+wide,y-3+knee],[x+wide-3,y+6],[x-wide+2,y+6],[x-wide,y-3+knee]],guard?c.rockDark:c.clothDark);
  if(guard){s.ellipse(x-3,y-6+knee,6,6,c.rockLight);s.line(x-5,y-10+knee,x+1,y-11+knee,c.metalLight);s.line(x-4,y-5+knee,x+2,y-3+knee,c.rockHighlight);}
  poly(s,[[x-4,y-12+knee],[x+5,y-12+knee],[x+6,y+3],[x+8,y+11],[x,y+8],[x-7,y+11],[x-4,y+2]],c.clothDark);s.rect(x-2,y-9+knee,6,12-knee,c.cloth);s.line(x-2,y-9+knee,x-2,y,c.clothLight);s.line(x-5,y+9,x-1,y+7,c.goldDark);s.line(x+2,y+7,x+6,y+9,c.gold);
  if(!guard){s.line(x-wide+3,y-10+knee,x-4,y-4,c.clothLight);s.line(x+6,y-10+knee,x+wide-3,y-2,c.cloth);if(orc){s.line(x-9,y-12+knee,x-6,y+1,c.teamRedLight);s.line(x+7,y-12+knee,x+5,y,c.teamRedLight);}else if(short){s.rect(x-8,y+1,16,8,c.barkDark);s.rect(x-7,y+2,14,6,c.bark);s.line(x-7,y+2,x+6,y+2,c.barkLight);for(const dx of [-5,2]){s.rect(x+dx,y+3,3,4,c.rock);s.pixel(x+dx,y+3,c.metalLight);}}}
  if(!guard){s.rect(x-3,y-9+knee,7,6,c.team);s.line(x-3,y-9+knee,x+3,y-9+knee,c.teamLight);}
  s.rect(x-wide+2,y+3,wide*2-3,3,c.barkDark);s.rect(x-1,y+3,4,3,c.gold);s.pixel(x,y+3,c.goldLight);
  if(guard)for(const dx of [-wide+1,wide-1]){s.ellipse(x+dx,y-10+knee,6,5,c.ink);s.ellipse(x+dx,y-11+knee,5,4,orc?c.teamRed:c.rock);s.line(x+dx-3,y-13+knee,x+dx+2,y-13+knee,c.rockHighlight);s.line(x+dx-3,y-8+knee,x+dx+2,y-8+knee,c.goldDark);if(orc)poly(s,[[x+dx-1,y-14+knee],[x+dx+1,y-19+knee],[x+dx+3,y-14+knee]],c.metalLight);}
  head(s,x+(side?2:0),y-(short?20:orc?15:guard&&elf?12:20)+knee,c,faction,guard,back,side);
  const swing=active?(guard?[0,-2,8,4]:[0,-9,-3,5])[frame]:0,h=[x+7,y-1+swing],t=[x+18-(swing<-5?7:0),y-2+swing-(swing<-5?5:0)];
  if(guard){const hand=[x-14,y-3+swing/2];parts.limb(s,[x-wide,y-8+knee],hand,c,orc?6:4,c.rockDark,c.rockLight);if(orc||faction==='dwarves')tool(s,hand,[x-18,y-18+swing],c,faction,true,false);else parts.sword(s,hand,active&&frame===2?[x+4,y-11]:[x-19,y-28+swing],c);guardShield(s,x+6+(side?-3:0),y-8,c,faction,back);}
  else {parts.limb(s,[x-wide,y-9+knee],[x-9,y-1],c,orc?7:5,orc?c.skinShadow:c.linenShadow,orc?c.skin:c.linenLight);parts.limb(s,[x-9,y-1],[x-2,y-3+swing],c,orc?6:4,c.skinShadow,c.skin);tool(s,h,t,c,faction,false,state==='build');parts.limb(s,[x+wide,y-8+knee],[x+12,y+swing/2],c,orc?7:5,orc?c.skinShadow:c.linenShadow,orc?c.skinLight:c.linen);parts.limb(s,[x+12,y+swing/2],h,c,4,c.skinShadow,c.skinLight);s.rect(x-3,y-4+swing,3,3,c.skin);}
  if(back){s.rect(x-5,y-11+knee,10,10,c.clothDark);s.line(x-4,y-10+knee,x+3,y-10+knee,c.clothLight);s.line(x-4,y-8,x+3,y,c.barkLight);if(elf)s.line(x-7,y-4,x-11,y+6,c.gold);if(!guard){s.rect(x-4,y-9+knee,8,6,c.team);s.line(x-4,y-9+knee,x+3,y-9+knee,c.teamLight);}}
 }
 if(mirror){const original=s.data.slice();for(let yy=0;yy<64;yy++)for(let xx=0;xx<64;xx++)s.data.set(original.subarray((yy*64+xx)*4,(yy*64+xx)*4+4),(yy*64+63-xx)*4);}
 return s;
}
export {crest};

export const peopleParts={head,band,guardShield};
