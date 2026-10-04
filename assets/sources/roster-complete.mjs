/** Native 64px original roster compositions from the five approved concept sheets. */
import {pixelParts as body} from './humans.mjs';
import {factionColors,peopleParts as people,crest} from './faction-people.mjs';
const poly=(s,v,c)=>s.polygon(v,c);
function colors(p,faction,owner){return factionColors(p,faction,owner);}
function mirror(s){const d=s.data.slice();for(let y=0;y<64;y++)for(let x=0;x<64;x++)s.data.set(d.subarray((y*64+x)*4,(y*64+x)*4+4),(y*64+63-x)*4);}
function bow(s,x,y,c,pull,crossbow=false){
 const ends=[[x+5,y-10],[x+9,y],[x+5,y+10]];people.band(s,ends[0],ends[1],3,c.ink);people.band(s,ends[1],ends[2],3,c.ink);s.line(x+5,y-9,x+8,y,c.barkLight);s.line(x+8,y,x+5,y+9,c.barkLight);s.line(x+5,y-9,x-pull,y,c.linenLight);s.line(x-pull,y,x+5,y+9,c.linenLight);s.line(x-pull-5,y,x+15,y,c.barkLight);s.line(x-pull-5,y-1,x+12,y-1,c.rockLight);poly(s,[[x+13,y-3],[x+18,y],[x+13,y+2]],c.rockHighlight);
 if(crossbow){s.rect(x-10,y,15,4,c.ink);s.rect(x-9,y+1,13,2,c.bark);s.line(x-8,y,x+2,y,c.barkLight);s.rect(x-4,y-3,3,4,c.rock);s.pixel(x-4,y-3,c.metalLight);}
}
function gun(s,x,y,c,recoil=0){
 x+=recoil;s.rect(x-11,y-2,13,7,c.ink);s.rect(x-10,y-1,10,4,c.bark);s.line(x-9,y-1,x-2,y-1,c.barkLight);s.rect(x-1,y-4,19,7,c.ink);s.rect(x,y-3,17,5,c.rockDark);s.line(x,y-3,x+15,y-3,c.rockLight);for(const dx of [2,10,16]){s.rect(x+dx,y-4,2,7,c.goldDark);s.pixel(x+dx,y-4,c.goldLight);}s.rect(x+18,y-3,3,5,c.ink);s.line(x+19,y-3,x+19,y+1,c.gold);s.rect(x-4,y+4,5,2,c.goldDark);
}
function spear(s,x,y,c,lift){people.band(s,[x-10,y+lift],[x+18,y-3+lift],3,c.ink);s.line(x-10,y+lift,x+18,y-3+lift,c.barkLight);poly(s,[[x+16,y-7+lift],[x+25,y-4+lift],[x+17,y+1+lift]],c.ink);poly(s,[[x+17,y-6+lift],[x+22,y-4+lift],[x+18,y-1+lift]],c.rockLight);s.line(x+18,y-5+lift,x+22,y-4+lift,c.metalLight);}
function wrench(s,x,y,c){people.band(s,[x,y+11],[x,y-4],3,c.ink);s.line(x,y+10,x,y-4,c.rockLight);poly(s,[[x-5,y],[x-7,y-7],[x-3,y-12],[x-2,y-5],[x+2,y-3],[x+5,y-6],[x+3,y-12],[x+8,y-8],[x+7,y-1],[x+3,y+3]],c.ink);poly(s,[[x-4,y],[x-5,y-6],[x-3,y-8],[x-3,y-4],[x+2,y-1],[x+6,y-5],[x+5,y],[x+2,y+1]],c.rockLight);s.line(x-5,y-6,x-3,y-8,c.metalLight);}
function bomb(s,x,y,c){s.ellipse(x,y,5,5,c.ink);s.ellipse(x-1,y-1,3,3,c.rockDark);s.pixel(x-2,y-2,c.rockLight);s.line(x+1,y-4,x+3,y-8,c.barkLight);s.pixel(x+3,y-8,c.goldLight);}
function hood(s,x,y,c,back,side){poly(s,[[x-8,y+6],[x-8,y-3],[x-3,y-10],[x+3,y-11],[x+8,y-5],[x+9,y+5],[x+5,y+10],[x-5,y+10]],c.ink);poly(s,[[x-7,y+4],[x-6,y-3],[x-2,y-8],[x+3,y-9],[x+6,y-4],[x+7,y+5],[x+3,y+8],[x-4,y+7]],c.clothDark);s.line(x-5,y-3,x-2,y-7,c.clothLight);s.line(x-2,y-7,x+2,y-8,c.goldDark);if(!back){s.ellipse(x+(side?2:0),y+2,4,5,c.skinShadow);s.rect(x+1,y-1,3,5,c.skin);s.pixel(x+2+(side?1:0),y+1,c.ink);s.rect(x+3,y+3,2,2,c.skinLight);s.line(x-4,y+7,x+3,y+8,c.gold);}else{s.line(x-4,y-2,x+1,y+6,c.cloth);s.line(x+2,y-5,x+4,y+3,c.clothLight);}}
function backpack(s,x,y,c){s.rect(x-7,y-7,14,19,c.ink);s.rect(x-6,y-6,12,17,c.barkDark);s.rect(x-4,y-5,8,14,c.goldDark);s.rect(x-2,y-4,4,11,c.gold);s.line(x-2,y-4,x-2,y+6,c.goldLight);for(const dx of [-7,5]){s.rect(x+dx,y-8,3,17,c.rockDark);s.line(x+dx,y-8,x+dx,y+7,c.rockHighlight);}s.rect(x+5,y-11,3,6,c.gold);s.pixel(x+5,y-11,c.goldLight);}
export function rosterUnit(Surface,p,faction,type,owner,direction,state,frame){
 if(type==='catapult')return siege(Surface,p,faction,owner,direction,state,frame);
 const s=new Surface(64,64),c=colors(p,faction,owner),mirrored=[3,4,5].includes(direction),dir=mirrored?({3:1,4:0,5:7}[direction]):direction,side=dir===0||dir===7,back=dir>=6,special=type==='specialist',orc=faction==='clans',tech=faction==='goblins',dwarf=faction==='dwarves',elf=faction==='elves',ranged=!special||elf||tech;
 const step=state==='walk'?[-2,1,3,-1][frame]:0,bob=state==='walk'?[0,-1,0,1][frame]:0,attack=state==='attack',x=30+(side?2:dir===1?1:0)+(attack?[0,-1,1,0][frame]:0),y=(dwarf||tech?35:34)+bob,w=elf?8:11;
 s.ellipse(32,53,20,4,c.earth);
 if(state==='death'&&frame>0){const yy=43+frame*2;poly(s,[[14,yy-3],[35,yy-6],[46,yy],[44,yy+6],[18,yy+5]],c.ink);s.rect(19,yy-3,22,7,c.clothDark);s.line(20,yy-3,36,yy-5,c.clothLight);s.rect(40,yy,12,5,c.barkDark);s.ellipse(16,yy-7,7,6,special&&!ranged?c.rockDark:c.clothDark);s.ellipse(14,yy-9,4,2,special&&!ranged?c.rockLight:c.clothLight);if(dwarf){s.rect(15,yy-5,7,4,c.dwarfBeard);}if(tech){s.rect(13,yy-6,7,3,c.linenLight);s.pixel(18,yy-8,c.goldLight);}if(ranged){if(tech)gun(s,37,yy+6,c);else bow(s,35,yy+2,c,0,dwarf);}else{body.sword(s,[28,54],[7,47],c);body.shield(s,39,yy-13,{...c,clothDark:c.team},true);}}
 else {
  const sx=side?step:Math.round(step*.5),sy=side?Math.round(step*.4):step;
  body.limb(s,[x-5,y+5],[26-sx,46+sy],c,dwarf?7:5,special?c.rockDark:c.linenShadow,special?c.rockLight:c.linen);body.limb(s,[x+5,y+5],[38+sx,46-sy],c,dwarf?7:5,special?c.rockDark:c.linenShadow,special?c.rockLight:c.linen);body.boot(s,26-sx,48+sy,c);body.boot(s,38+sx,48-sy,c);
  if(special){poly(s,[[x-w,y-15],[x+w,y-14],[x+w+7,y+12],[x+4,y+10],[x,y+14],[x-w-6,y+10]],c.ink);poly(s,[[x-w+1,y-13],[x+w-1,y-12],[x+w+5,y+10],[x+3,y+8],[x,y+12],[x-w-4,y+8]],c.clothDark);s.line(x+w-1,y-10,x+w+3,y+7,c.clothLight);s.line(x-w+1,y-11,x-w-2,y+6,c.cloth);}
  poly(s,[[x-w,y-13],[x+w,y-13],[x+w+2,y-4],[x+w-2,y+7],[x-w+1,y+7],[x-w-1,y-3]],c.ink);s.rect(x-w+1,y-12,w*2-2,17,special?c.rockDark:c.clothDark);s.rect(x-4,y-10,9,15,c.team);s.line(x-4,y-10,x-4,y+2,c.teamLight);s.rect(x-w+1,y+3,w*2-2,3,c.barkDark);s.rect(x-1,y+3,4,3,c.gold);s.pixel(x,y+3,c.goldLight);
  if(special&&!tech){for(const dx of [-w,w]){s.ellipse(x+dx,y-10,6,5,c.ink);s.ellipse(x+dx,y-11,5,4,c.rockDark);s.ellipse(x+dx-1,y-12,3,2,c.rockHighlight);s.line(x+dx-4,y-8,x+dx+3,y-8,c.gold);s.pixel(x+dx-2,y-13,c.metalLight);}s.rect(x-7,y-8,13,7,c.rockLight);s.line(x-5,y-7,x+3,y-6,c.metalLight);s.rect(x-3,y-6,7,9,c.team);crest(s,x,y-3,c,faction);}
  if(!special&&(faction==='crown'||elf))hood(s,x+(side?2:0),y-22,c,back,side);
  else if(special&&(faction==='crown'||elf))body.helmet(s,x+(side?2:0),y-12,back,side,c);
  else {people.head(s,x+(side?2:0),y-(orc?15:21),c,faction,special&&!tech,back,side);if(orc&&special){for(const dx of [-8,8])poly(s,[[x+dx,y-17],[x+dx*1.3,y-25],[x+dx+Math.sign(dx)*4,y-18]],c.linenLight);s.rect(x-6,y-19,12,3,c.rockDark);s.pixel(x+4,y-19,c.metalLight);}}
  // Reference equipment remains consistent with each existing ranged/melee gameplay role.
  if(!special&&!tech){s.rect(x-12,y-19,5,18,c.ink);s.rect(x-11,y-17,3,14,c.bark);for(const dx of [-2,1,4]){s.line(x-11+dx,y-24,x-11+dx,y-14,c.linenShadow);poly(s,[[x-13+dx,y-24],[x-11+dx,y-28],[x-9+dx,y-24]],c.rockHighlight);}}
  if(tech&&special)backpack(s,x-12,y-13,c);
  const hand=[x+4,y-5],pull=attack?[0,3,5,0][frame]:0;
  if(ranged){body.limb(s,[x-10,y-9],[x-6-pull,y-4],c,5,c.skinShadow,c.skin);body.limb(s,[x+9,y-10],hand,c,5,c.skinShadow,c.skinLight);if(orc)spear(s,x+3,y-4,c,attack?[0,-3,-5,2][frame]:0);else if(tech&&!special){gun(s,x+7,y-4,c,attack?[0,-2,-4,-1][frame]:0);if(attack&&frame===2){s.pixel(59,y-5,c.goldLight);s.pixel(58,y-4,c.gold);}}else if(tech){if(attack)bomb(s,x+14+(frame===2?3:0),y-7-[0,5,8,1][frame],c);else wrench(s,x+18,y-15,c);}else bow(s,x+8,y-5,c,pull,dwarf);}
  else {const swing=attack?[0,-2,9,4][frame]:0,h=[x-14,y-1+swing/2];body.limb(s,[x-10,y-8],h,c,5,c.rockDark,c.rockLight);if(dwarf){people.band(s,h,[x-18,y-17+swing],3,c.barkLight);s.rect(x-24,y-22+swing,13,10,c.ink);s.rect(x-23,y-21+swing,11,8,c.rockDark);s.line(x-22,y-21+swing,x-14,y-21+swing,c.metalLight);s.rect(x-20,y-19+swing,5,4,c.gold);crest(s,x-18,y-17+swing,c,faction);}else body.sword(s,h,attack&&frame===2?[x+5,y-9]:[x-20,y-26+swing],c);body.shield(s,x+8,y-9,{...c,clothDark:c.team,cloth:c.teamLight},back);}
  if(back){s.rect(x-5,y-12,10,12,c.clothDark);s.line(x-4,y-11,x+3,y-11,c.clothLight);s.rect(x-4,y-8,8,6,c.team);if(!special&&!tech)s.line(x-8,y-11,x+5,y+1,c.barkLight);if(tech&&special)backpack(s,x,y-10,c);}
 }
 if(mirrored)mirror(s);return s;
}
function crew(s,x,y,c,faction,helmet=true){s.rect(x-4,y,8,9,c.ink);s.rect(x-3,y+1,6,7,c.team);s.line(x-3,y+1,x+2,y+1,c.teamLight);s.ellipse(x,y-4,5,5,c.ink);s.ellipse(x,y-4,4,4,c.skin);if(helmet){s.ellipse(x,y-7,5,3,c.rockDark);s.ellipse(x-1,y-8,3,2,c.rockLight);}else{s.rect(x-4,y-9,8,3,faction==='goblins'?c.humanRedDark:c.clothDark);}if(faction==='dwarves')s.rect(x-2,y-1,4,4,c.dwarfBeard);if(faction==='goblins'){s.rect(x-3,y-6,6,2,c.gold);s.rect(x-2,y-1,5,3,c.linenLight);}s.line(x+3,y+2,x+7,y+5,c.skinShadow);s.pixel(x+7,y+5,c.skinLight);}
function siege(Surface,p,faction,owner,direction,state,frame){
 const s=new Surface(64,64),c=colors(p,faction,owner),a=direction*Math.PI/4,ux=Math.cos(a),uy=Math.sin(a),step=state==='walk'?[-1,1,0,-1][frame]:0,kick=state==='attack'?[0,-2,-5,-1][frame]:0,dead=state==='death'?frame:0;
 s.ellipse(32,52,27,5,c.earth);const front=[32+ux*17,37+uy*10],rear=[32-ux*17,37-uy*10];
 crew(s,rear[0]-uy*9,rear[1]+ux*5-3+step,c,faction,faction==='crown'||faction==='dwarves');
 poly(s,[[16,34],[37,28],[52,38],[33,49]],c.ink);poly(s,[[18,35],[37,30],[49,38],[33,46]],c.barkDark);s.line(20,35,33,43,c.barkLight);s.line(33,43,48,38,c.bark);s.rect(18,39,29,9,c.barkDark);s.line(19,39,45,39,c.barkLight);
 for(const x of [15,47]){s.ellipse(x,47+step,7,9,c.ink);s.ellipse(x,47+step,5,7,c.bark);s.ellipse(x,47+step,4,6,c.rockDark);s.line(x-3,43+step,x+3,51+step,c.rockLight);s.line(x-3,51+step,x+3,43+step,c.rockLight);s.ellipse(x,47+step,2,2,c.gold);}
 const tx=front[0]+ux*kick,ty=front[1]+uy*kick;
 if(faction==='dwarves'||faction==='goblins'){
  const lift=faction==='goblins'?7:0;for(let n=-5;n<=5;n++){s.line(rear[0]-uy*n,rear[1]-13+ux*n,tx-uy*n,ty-13-lift+ux*n,c.ink);}for(let n=-4;n<=4;n++)s.line(rear[0]-uy*n,rear[1]-13+ux*n,tx-uy*n,ty-13-lift+ux*n,c.rockDark);s.line(rear[0]-2,rear[1]-17,tx-2,ty-17-lift,c.rockHighlight);for(const t of [.2,.75]){const xx=rear[0]+(tx-rear[0])*t,yy=rear[1]+(ty-rear[1]-lift)*t-13;s.line(xx-uy*5,yy+ux*5,xx+uy*5,yy-ux*5,c.goldDark);}s.ellipse(tx,ty-13-lift,6,5,c.goldDark);s.ellipse(tx,ty-13-lift,4,3,c.ink);s.pixel(tx-2,ty-15-lift,c.rockLight);if(state==='attack'&&frame===2){s.ellipse(tx+ux*4,ty-15-lift+uy*4,3,2,c.gold);s.pixel(tx+ux*6,ty-17-lift+uy*6,c.goldLight);}
 }else if(faction==='elves'){
  const cx=32+ux*kick,cy=25+uy*kick;for(const sign of [-1,1]){people.band(s,[cx-uy*19*sign,cy+ux*10*sign],[cx+ux*7,cy+uy*4],3,c.ink);s.line(cx-uy*18*sign,cy+ux*9*sign,cx+ux*6,cy+uy*3,c.barkLight);s.line(cx-uy*18*sign,cy+ux*9*sign,cx-ux*6,cy-uy*3,c.linenLight);}people.band(s,[cx-ux*15,cy-uy*10],[cx+ux*18,cy+uy*10],3,c.ink);s.line(cx-ux*15,cy-uy*10,cx+ux*18,cy+uy*10,c.barkLight);s.ellipse(cx+ux*19,cy+uy*10,4,2,c.rockHighlight);s.pixel(cx+ux*22,cy+uy*11,c.metalLight);
 }else {const lift=state==='attack'?[14,15,7,11][frame]:14;people.band(s,[rear[0],rear[1]-3],[front[0],front[1]-lift+dead*3],5,c.ink);people.band(s,[rear[0],rear[1]-3],[front[0],front[1]-lift+dead*3],3,c.bark);s.line(rear[0]-1,rear[1]-4,front[0]-1,front[1]-lift-1+dead*3,c.barkLight);s.ellipse(front[0],front[1]-lift+dead*3,8,4,c.barkDark);s.line(front[0]-6,front[1]-lift-1+dead*3,front[0]+5,front[1]-lift-1+dead*3,c.barkLight);if(state!=='attack'||frame<2){s.ellipse(front[0],front[1]-lift-5+dead*3,6,6,c.rockDark);s.ellipse(front[0]-2,front[1]-lift-7+dead*3,3,3,c.rockLight);s.pixel(front[0]-3,front[1]-lift-8+dead*3,c.metalLight);}}
 s.rect(25,38,14,13,c.ink);s.rect(26,39,12,10,c.team);s.line(26,39,37,39,c.gold);crest(s,32,45,c,faction);crew(s,front[0]-uy*7,front[1]+ux*5+5+step,c,faction,faction==='crown'||faction==='dwarves');
 if(dead){poly(s,[[23,39],[34,34+dead],[48,44],[40,50],[29,48]],c.barkDark);s.line(24,40,43,48,c.barkLight);s.line(30,37,35,50,c.ink);for(let i=0;i<dead;i++)s.rect(20+i*9,53+i%2,5,2,c.rockLight);}
 return s;
}
