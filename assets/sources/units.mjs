import {factionUnit} from './faction-people.mjs';
import {humanUnit} from './humans.mjs';
/** Original miniature people and timber siege engine; eight authored directional poses. */
export const directions=['e','se','s','sw','w','nw','n','ne'];
export const animationSpec={idle:{frames:1,fps:1,loop:true},walk:{frames:4,fps:8,loop:true},attack:{frames:4,fps:8,loop:true},death:{frames:4,fps:8,loop:false},gather:{frames:4,fps:8,loop:true},build:{frames:4,fps:8,loop:true}};
export function unitFrames(Surface,p){const frames=[];
 for(const faction of ['crown','clans','elves','dwarves','goblins'])for(const type of ['worker','soldier','archer','catapult','specialist'])for(const owner of ['player','enemy'])for(let dir=0;dir<8;dir++)for(const state of type==='worker'?Object.keys(animationSpec):['idle','walk','attack','death'])for(let frame=0;frame<animationSpec[state].frames;frame++){
  const elf=faction==='elves',archer=type==='archer'||elf&&type==='specialist',guard=type==='soldier'||type==='specialist'&&!elf,orc=faction==='clans',skin=orc?p.leafHighlight:p.skin;
  const detailed=type==='worker'||type==='soldier',human=faction==='crown'&&detailed,size=type==='catapult'||detailed?64:32,s=new Surface(size,size),cx=size/2,cy=type==='catapult'?40:detailed?44:22,angle=dir*Math.PI/4,dx=Math.round(Math.cos(angle)*3),dy=Math.round(Math.sin(angle)*2),team=owner==='player'?p.teamBlue:p.teamRed,light=owner==='player'?p.teamBlueLight:p.teamRedLight;
  const stride=state==='walk'?[0,2,0,-2][frame]:0,bob=state==='walk'?frame%2:0,swing=['attack','gather','build'].includes(state)?[0,-3,2,4][frame]:0;
  if(type==='catapult'){
   const vx=Math.round(Math.cos(angle)*15),vy=Math.round(Math.sin(angle)*10);s.ellipse(cx,cy+9,22,6,p.earth);
   s.polygon([[cx-vx-8,cy-vy-5],[cx+vx-8,cy+vy-5],[cx+vx+8,cy+vy+5],[cx-vx+8,cy-vy+5]],p.barkDark);s.line(cx-vx,cy-vy,cx+vx,cy+vy,p.barkLight);
   for(const x of [-15,15]){s.ellipse(cx+x,cy+5+stride/2,5,7,p.ink);s.ellipse(cx+x,cy+5+stride/2,3,5,p.bark);s.pixel(cx+x,cy+5,p.rockLight);s.line(cx+x-2,cy+2+stride/2,cx+x+2,cy+8+stride/2,p.barkLight);s.line(cx+x-2,cy+8+stride/2,cx+x+2,cy+2+stride/2,p.barkLight);}
   if(orc){for(const x of [-12,12])s.polygon([[cx+x-3,cy-7],[cx+x,cy-17],[cx+x+3,cy-7]],p.rockHighlight);}
   s.rect(cx-7,cy-10,14,7,team);s.rect(cx-5,cy-9,10,2,light);if(!elf){const lift=state==='attack'?[14,20,4,9][frame]:14;s.line(cx-vx/2,cy-vy/2,cx+vx/2,cy+vy/2-lift,p.barkLight);s.line(cx-vx/2+1,cy-vy/2,cx+vx/2+1,cy+vy/2-lift,p.bark);s.ellipse(cx+vx/2,cy+vy/2-lift,7,3,p.barkDark);if(state!=='attack'||frame<2)s.ellipse(cx+vx/2,cy+vy/2-lift-3,4,4,p.rockLight);}
   s.rect(cx-8,cy-5,16,3,p.bark);s.line(cx-7,cy-5,cx+7,cy-5,p.barkLight);s.rect(cx-4,cy-8,8,3,team);
  }else{
   s.ellipse(cx,cy+5,10,3,p.earth);s.rect(cx-5-stride/2,cy-1,4,6,p.barkDark);s.rect(cx+2+stride/2,cy-1,4,6,p.barkDark);s.rect(cx-6-stride/2,cy+4,5,2,p.ink);s.rect(cx+2+stride/2,cy+4,5,2,p.ink);
   const bodyColor=type==='worker'?p.bark:guard?p.rock:team;s.rect(cx-6,cy-11-bob,12,12,bodyColor);s.rect(cx-4,cy-10-bob,8,6,team);s.rect(cx-3,cy-10-bob,6,2,light);s.rect(cx-6,cy-2,12,2,p.barkDark);s.pixel(cx,cy-2,p.gold);
   s.rect(cx-4+dx,cy-19+dy-bob,8,8,skin);s.rect(cx-4+dx,cy-20+dy-bob,8,3,guard?p.rockLight:p.barkDark);if(guard){s.rect(cx-5+dx,cy-19+dy-bob,10,3,p.rockHighlight);s.rect(cx-4+dx,cy-16+dy-bob,8,2,p.rockDark);s.rect(cx-3+dx,cy-13+dy-bob,6,2,skin);}
   if(orc){s.rect(cx-7+dx,cy-17+dy-bob,3,3,p.leafHighlight);s.rect(cx+4+dx,cy-17+dy-bob,3,3,p.leafHighlight);s.rect(cx-4+dx,cy-13+dy-bob,2,3,p.rockHighlight);s.rect(cx+2+dx,cy-13+dy-bob,2,3,p.rockHighlight);s.rect(cx-8,cy-11-bob,3,7,p.barkDark);s.rect(cx+5,cy-11-bob,3,7,p.barkDark);}
   if(dir<=4){s.pixel(cx+dx+(dx>=0?2:-2),cy-15+dy-bob,p.ink);}else{s.rect(cx-4+dx,cy-17+dy-bob,8,3,type==='archer'?team:p.barkDark);}
   // Native role silhouettes: pack/tool, armor, and a hood/quiver remain distinct.
   if(type==='worker'){
    const bagX=cx+(dx>=0?-7:4);s.rect(bagX,cy-5,5,6,p.barkDark);s.rect(bagX+1,cy-4,3,3,p.goldDark);s.line(cx-4,cy-10,cx+3,cy-3,p.barkLight);
    s.line(cx-5+dx,cy-18+dy-bob,cx+5+dx,cy-18+dy-bob,p.barkLight);
   }
   if(guard){
    s.rect(cx-7,cy-11-bob,3,4,orc?p.rockHighlight:p.rockLight);s.rect(cx+4,cy-11-bob,3,4,orc?p.rockHighlight:p.rockLight);
    if(!orc){s.rect(cx-1+dx,cy-23+dy-bob,3,4,team);s.pixel(cx+dx,cy-23+dy-bob,light);s.line(cx-4,cy-7,cx+3,cy-7,p.rockHighlight);}
   }
   if(archer){
    s.line(cx-5+dx,cy-18+dy-bob,cx-5+dx,cy-13+dy-bob,p.leafDark);s.line(cx+4+dx,cy-18+dy-bob,cx+4+dx,cy-13+dy-bob,p.leafDark);
    s.line(cx-5+dx,cy-19+dy-bob,cx+4+dx,cy-19+dy-bob,team);s.line(cx-7,cy-14,cx-7,cy-4,p.barkLight);
    for(const offset of [-2,1]){s.line(cx-7+offset,cy-17,cx-7+offset,cy-12,p.rockLight);s.pixel(cx-6+offset,cy-17,p.rockHighlight);}
   }
   const handX=cx+dx*2+(dx>=0?5:-5),handY=cy-7+dy*2+swing;s.line(cx+(dx>=0?5:-5),cy-8,handX,handY,skin);
   if(type==='worker'){s.line(handX,handY+3,handX+dx+3,handY-7,p.barkLight);s.rect(handX+dx,handY-8,7,3,state==='build'?p.rockDark:p.rockLight);}
   if(guard&&orc){s.line(handX,handY+2,handX+dx,handY-11+swing,p.barkLight);s.polygon([[handX+dx-6,handY-12+swing],[handX+dx+7,handY-12+swing],[handX+dx+5,handY-5+swing],[handX+dx-4,handY-6+swing]],p.rockHighlight);}
   if(guard&&!orc){s.line(handX,handY,handX+dx*2,handY-11+swing,p.rockHighlight);s.rect(handX-3,handY-1,6,2,p.gold);const shieldX=cx-(dx>=0?10:-6);s.polygon([[shieldX,cy-10],[shieldX+7,cy-10],[shieldX+8,cy-2],[shieldX+4,cy+2],[shieldX-1,cy-2]],p.ink);s.rect(shieldX+1,cy-9,5,7,team);s.pixel(shieldX+3,cy-6,p.goldLight);}
   if(archer){const bowX=handX+dx;s.line(bowX,handY-8,bowX+4,handY,p.barkLight);s.line(bowX+4,handY,bowX,handY+7,p.barkLight);s.line(bowX,handY-8,bowX,handY+7,p.rockLight);if(state==='attack'){const pull=[0,2,4,0][frame];s.line(bowX,handY-8,bowX-pull,handY,p.rockLight);s.line(bowX-pull,handY,bowX,handY+7,p.rockLight);s.line(bowX-pull-3,handY,bowX+8,handY,p.rockHighlight);}s.rect(cx-7,cy-13,3,10,p.barkDark);s.line(cx-6,cy-16,cx-6,cy-10,p.rockHighlight);}
  }
  if(type==='specialist'&&faction==='crown'){
    // Human banner escort: gold plate, broad kite shield and a tall pennant.
    s.rect(cx-6,cy-12-bob,12,3,p.goldDark);s.line(cx-6,cy-12-bob,cx+5,cy-12-bob,p.goldLight);
    s.rect(cx-5+dx,cy-19+dy-bob,10,2,p.gold);s.pixel(cx+dx,cy-20+dy-bob,p.goldLight);
    const shieldX=dx>=0?3:22;
    s.polygon([[shieldX,cy-11],[shieldX+7,cy-11],[shieldX+7,cy-3],[shieldX+3,cy+3],[shieldX,cy-3]],p.goldDark);
    s.polygon([[shieldX+1,cy-10],[shieldX+6,cy-10],[shieldX+6,cy-3],[shieldX+3,cy+1],[shieldX+1,cy-3]],team);
    s.line(shieldX+3,cy-9,shieldX+3,cy-2,p.goldLight);s.line(shieldX+1,cy-6,shieldX+5,cy-6,p.goldLight);
    const poleX=dx>=0?25:6; s.line(poleX,3+bob,poleX,cy+1,p.barkLight);
    const wave=state==='walk'?stride/2:state==='attack'?frame%2:0;
    s.polygon([[poleX+1,3+bob],[poleX+6,4+bob+wave],[poleX+5,9+bob+wave],[poleX+1,8+bob]],team);
    s.line(poleX+2,4+bob,poleX+4,7+bob,p.goldLight);s.pixel(poleX,2+bob,p.gold);
  }
  if(type==='specialist'&&orc){
   // Raider: bare head, light leather and a second axe, distinct from heavy warriors.
   s.rect(cx-5+dx,cy-20+dy-bob,10,8,skin);s.rect(cx-5+dx,cy-20+dy-bob,10,2,p.barkDark);
   s.rect(cx-5,cy-10-bob,10,7,p.bark);s.rect(cx-4,cy-9-bob,8,2,team);s.line(cx-4,cy-3,cx+3,cy-3,p.gold);
   s.rect(cx-7,cy-11-bob,3,4,p.leafDark);s.rect(cx+4,cy-11-bob,3,4,p.leafDark);
   const offX=cx-(dx>=0?9:-8),offY=cy-7-dy+swing/2;
   s.line(offX,offY+4,offX-dx,offY-9-swing,p.barkLight);
   s.polygon([[offX-dx-4,offY-10-swing],[offX-dx+4,offY-10-swing],[offX-dx+3,offY-5-swing],[offX-dx-3,offY-5-swing]],p.rockLight);
   s.line(offX-dx-3,offY-9-swing,offX-dx+3,offY-9-swing,p.rockHighlight);
   s.pixel(cx+dx,cy-15+dy-bob,p.ink);s.rect(cx-3+dx,cy-12+dy-bob,2,2,p.rockHighlight);
  }
  if(elf&&type!=='catapult'){
   // Leaf cloaks, pointed ears and slim equipment distinguish the woodland roster.
   s.rect(cx-7+dx,cy-17+dy-bob,3,2,skin);s.rect(cx+4+dx,cy-17+dy-bob,3,2,skin);
   s.polygon([[cx-5+dx,cy-18+dy-bob],[cx+dx,cy-23+dy-bob],[cx+5+dx,cy-18+dy-bob]],p.leafDark);
   s.rect(cx-4+dx,cy-20+dy-bob,8,2,p.leaf);s.line(cx-4,cy-10-bob,cx+3,cy-10-bob,p.leafHighlight);
   s.polygon([[cx-6,cy-9],[cx-9,cy+2],[cx-4,cy],[cx+5,cy],[cx+8,cy+2],[cx+5,cy-9]],p.leafDark);
   s.rect(cx-3,cy-8,6,5,team);s.pixel(cx,cy-3,p.goldLight);
   if(type==='worker'){s.ellipse(cx-6,cy-3,3,4,p.leaf);s.line(cx-7,cy-5,cx-5,cy-1,p.leafHighlight);}
   if(type==='soldier'){const spearX=cx+dx*2+(dx>=0?6:-6),spearY=cy-7+dy*2+swing;s.line(spearX,spearY+5,spearX+dx,spearY-13,p.barkLight);s.polygon([[spearX+dx-2,spearY-12],[spearX+dx,spearY-17],[spearX+dx+2,spearY-12]],p.rockHighlight);s.ellipse(cx-(dx>=0?8:-7),cy-5,3,5,p.leaf);}
   if(archer){s.line(cx-8,cy-15,cx-8,cy-4,p.barkLight);s.pixel(cx-8,cy-16,p.rockHighlight);}
   if(type==='specialist'){s.rect(cx-5+dx,cy-21+dy-bob,10,2,p.rockHighlight);s.pixel(cx+dx,cy-22+dy-bob,p.gold);s.rect(cx-6,cy-12-bob,3,7,p.goldDark);s.rect(cx+4,cy-12-bob,3,7,p.goldDark);}
  }
  if(elf&&type==='catapult'){
   // A wood-and-vine ballista replaces the stone basket with a wide bow and bolt.
   const vx=Math.round(Math.cos(angle)*16),vy=Math.round(Math.sin(angle)*10);
   s.line(cx-vx,cy-vy-13,cx+vx,cy+vy-13,p.leafDark);s.line(cx-vx+1,cy-vy-13,cx+vx+1,cy+vy-13,p.leafHighlight);
   s.line(cx-vx,cy-vy-13,cx,cy-9,p.rockLight);s.line(cx,cy-9,cx+vx,cy+vy-13,p.rockLight);
   const kick=state==='attack'?[0,3,-5,-2][frame]:0;
   const boltX=cx+vx,boltY=cy-14+vy+kick;s.line(cx-vx/2,cy-14-vy/2+kick,boltX,boltY,p.barkLight);s.ellipse(boltX,boltY,3,2,p.rockHighlight);s.pixel(boltX+Math.sign(vx)*3,boltY+Math.sign(vy),p.goldLight);
   s.ellipse(cx-17,cy+3,4,6,p.leafDark);s.ellipse(cx+17,cy+3,4,6,p.leafDark);s.rect(cx-4,cy-8,8,3,team);
  }
  if(faction==='dwarves'){
   // Original short, broad armor and beard; heavy cannon replaces the stone basket.
   s.data.fill(0);
   if(type==='catapult'){
    const ux=Math.cos(angle),uy=Math.sin(angle),kick=state==='attack'?[0,-3,-5,-1][frame]:0;
    s.ellipse(cx,cy+10,22,6,p.earth);s.rect(cx-15,cy-1,30,9,p.rockDark);s.rect(cx-12,cy,24,3,team);
    for(const x of [-15,15]){s.ellipse(cx+x,cy+6+stride/2,5,7,p.ink);s.ellipse(cx+x,cy+6+stride/2,3,5,p.rock);s.line(cx+x-2,cy+3+stride/2,cx+x+2,cy+9+stride/2,p.goldDark);}
    s.ellipse(cx,cy-7,10,8,p.rockDark);s.ellipse(cx-2,cy-9,7,5,p.rockLight);
    for(let n=-3;n<=3;n++)s.line(cx+ux*2-uy*n,cy-9+uy*2+ux*n,cx+ux*(21+kick)-uy*n,cy-9+uy*(21+kick)+ux*n,p.rock);
    s.line(cx+ux*3,cy-12+uy*3,cx+ux*(20+kick),cy-12+uy*(20+kick),p.rockHighlight);
    const muzzleX=cx+ux*(22+kick),muzzleY=cy-9+uy*(22+kick);s.ellipse(muzzleX,muzzleY,3,3,p.ink);s.pixel(muzzleX+ux*3,muzzleY+uy*3,p.goldDark);
    if(state==='attack'&&frame===0)s.ellipse(muzzleX+ux*5,muzzleY+uy*5,4,3,p.goldLight);
   }else{
    s.ellipse(cx,cy+5,11,3,p.earth);s.rect(cx-7-stride/2,cy,5,5,p.barkDark);s.rect(cx+2+stride/2,cy,5,5,p.barkDark);
    s.rect(cx-8-stride/2,cy+4,6,2,p.ink);s.rect(cx+2+stride/2,cy+4,6,2,p.ink);
    s.rect(cx-8,cy-8-bob,16,10,type==='worker'?p.barkDark:p.rockDark);s.rect(cx-6,cy-7-bob,12,7,type==='specialist'?p.goldDark:p.rock);
    s.rect(cx-4,cy-7-bob,8,4,team);s.line(cx-4,cy-7-bob,cx+3,cy-7-bob,light);s.rect(cx-8,cy+1,16,2,p.goldDark);
    s.rect(cx-5+dx,cy-15+dy-bob,10,7,p.skin);s.rect(cx-6+dx,cy-17+dy-bob,12,4,p.rockDark);s.rect(cx-5+dx,cy-17+dy-bob,10,2,p.rockHighlight);
    s.polygon([[cx-5+dx,cy-10+dy-bob],[cx+5+dx,cy-10+dy-bob],[cx+3+dx,cy-3+dy-bob],[cx+dx,cy],[cx-3+dx,cy-3+dy-bob]],p.goldDark);s.line(cx+dx,cy-9+dy-bob,cx+dx,cy-1+dy-bob,p.gold);
    s.pixel(cx+dx+(dx>=0?2:-2),cy-12+dy-bob,p.ink);
    const hx=cx+dx*2+(dx>=0?7:-7),hy=cy-5+dy*2+swing;
    if(type==='worker'){s.line(hx,hy+6,hx+dx,hy-10,p.barkLight);s.line(hx+dx-5,hy-10,hx+dx+5,hy-10,p.rockHighlight);s.line(hx+dx+5,hy-10,hx+dx+7,hy-7,p.rock);}
    else if(type==='archer'){s.line(hx-6,hy,hx+8,hy,p.barkLight);s.line(hx+3,hy-5,hx+3,hy+5,p.rockLight);s.line(hx-6,hy,hx+3,hy-5,p.barkDark);s.line(hx-6,hy,hx+3,hy+5,p.barkDark);s.pixel(hx+8,hy,p.rockHighlight);}
    else{s.line(hx,hy+3,hx,hy-10,p.barkLight);s.rect(hx-4,hy-12,9,5,type==='specialist'?p.gold:p.rockHighlight);const shield=cx-(dx>=0?11:-5);s.rect(shield,cy-10,8,type==='specialist'?14:10,p.ink);s.rect(shield+1,cy-9,6,type==='specialist'?12:8,team);s.line(shield+1,cy-9,shield+6,cy-9,p.rockHighlight);s.rect(shield+3,cy-6,2,4,p.goldLight);}
    if(type==='specialist'){s.rect(cx-7,cy-10-bob,4,4,p.gold);s.rect(cx+4,cy-10-bob,4,4,p.gold);s.rect(cx-1+dx,cy-20+dy-bob,2,4,team);}
   }
  }
  if(faction==='goblins'){
   // Original small green tinkerers, goggles, scrap weapons and explosive mortar.
   s.data.fill(0);
   if(type==='catapult'){
    const ux=Math.cos(angle),uy=Math.sin(angle),kick=state==='attack'?[0,-2,-6,-3][frame]:0;
    s.ellipse(cx,cy+9,20,5,p.earth);s.rect(cx-15,cy-1,30,8,p.barkDark);s.rect(cx-12,cy,24,3,team);
    for(const x of [-14,14]){s.ellipse(cx+x,cy+5+stride/2,5,6,p.ink);s.ellipse(cx+x,cy+5+stride/2,3,4,p.rockDark);s.line(cx+x-2,cy+2+stride/2,cx+x+2,cy+8+stride/2,p.rockLight);}
    s.ellipse(cx,cy-7,10,7,p.rockDark);s.ellipse(cx-2,cy-9,7,5,p.rock);
    for(let n=-4;n<=4;n++)s.line(cx-uy*n,cy-10+ux*n,cx+ux*(12+kick)-uy*n,cy-18+uy*(12+kick)+ux*n,p.rockLight);
    const mx=cx+ux*(13+kick),my=cy-18+uy*(13+kick);s.ellipse(mx,my,5,3,p.ink);s.line(mx-3,my-2,mx+2,my-2,p.goldDark);
    s.rect(cx-12,cy-10,5,6,p.goldDark);s.rect(cx-11,cy-9,3,4,p.gold);
    if(state==='attack'&&frame<2){s.ellipse(mx+ux*4,my-4+uy*4,5-frame*2,4-frame,p.goldLight);s.pixel(mx+ux*8,my-7+uy*8,p.foam);}
   }else{
    s.ellipse(cx,cy+5,9,3,p.earth);s.rect(cx-5-stride/2,cy,3,5,p.barkDark);s.rect(cx+2+stride/2,cy,3,5,p.barkDark);s.rect(cx-6-stride/2,cy+4,4,2,p.ink);s.rect(cx+2+stride/2,cy+4,4,2,p.ink);
    s.rect(cx-6,cy-8-bob,12,10,p.barkDark);s.rect(cx-4,cy-7-bob,8,5,team);s.line(cx-4,cy-7-bob,cx+3,cy-7-bob,light);s.rect(cx-6,cy,12,2,p.goldDark);
    s.rect(cx-5+dx,cy-17+dy-bob,10,9,p.leafHighlight);s.rect(cx-8+dx,cy-15+dy-bob,3,2,p.leaf);s.rect(cx+5+dx,cy-15+dy-bob,3,2,p.leaf);s.polygon([[cx-2+dx,cy-12+dy-bob],[cx+7+dx,cy-11+dy-bob],[cx+dx,cy-8+dy-bob]],p.leaf);
    s.rect(cx-5+dx,cy-16+dy-bob,10,3,p.rockDark);s.rect(cx-4+dx,cy-16+dy-bob,3,2,p.goldLight);s.rect(cx+1+dx,cy-16+dy-bob,3,2,p.goldLight);s.pixel(cx+dx,cy-9+dy-bob,p.ink);
    const hx=cx+dx*2+(dx>=0?6:-6),hy=cy-5+dy*2+swing;
    if(type==='worker'){s.rect(cx-8,cy-9,4,10,p.rockDark);s.line(cx-7,cy-8,cx-7,cy-2,p.rockLight);s.line(hx,hy+3,hx+dx,hy-9,p.barkLight);s.rect(hx+dx-3,hy-10,7,3,p.rockLight);}
    if(type==='soldier'){s.line(hx,hy+3,hx+dx*2,hy-10,p.rockHighlight);s.rect(hx-2,hy+1,5,2,p.barkLight);s.rect(cx-7,cy-10,3,7,p.rock);s.rect(cx+4,cy-10,3,7,p.rockDark);}
    if(type==='archer'){s.line(hx,hy+5,hx,hy-3,p.barkLight);s.line(hx,hy-3,hx-4,hy-8,p.barkLight);s.line(hx,hy-3,hx+4,hy-8,p.barkLight);const pull=state==='attack'?[0,2,4,1][frame]:0;s.line(hx-4,hy-8,hx-pull,hy-5,p.barkDark);s.line(hx-pull,hy-5,hx+4,hy-8,p.barkDark);s.ellipse(hx-pull,hy-5,2,2,p.rockLight);}
    if(type==='specialist'){s.rect(cx-7,cy-10,4,9,p.goldDark);s.rect(cx+4,cy-10,4,9,p.goldDark);s.rect(cx-4+dx,cy-19+dy-bob,8,3,p.rock);s.ellipse(hx,hy-1,4,4,p.ink);s.ellipse(hx-1,hy-2,2,2,p.rock);s.line(hx+1,hy-5,hx+3,hy-8,p.barkLight);s.pixel(hx+3,hy-8,p.goldLight);}
   }
  }
  if(state==='death'){
   const dead=new Surface(size,size);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4;if(!s.data[i+3]||frame===3&&(x+y)%3===0)continue;const color='#'+[...s.data.subarray(i,i+3)].map(n=>n.toString(16).padStart(2,'0')).join('');const flat=frame/3;dead.pixel(cx+(x-cx)*(1-flat*.25),cy+(y-cy)*(1-flat*.8)+frame*2,color);}s.data=dead.data;
  }
  if(detailed&&!human)s.data=factionUnit(Surface,p,faction,type,owner,dir,state,frame).data;
  if(human)s.data=humanUnit(Surface,p,type,owner,dir,state,frame).data;
  frames.push({id:`${faction==='crown'?'':faction+'-'}${type}-${owner}-${directions[dir]}-${state}-${frame}`,image:s,x:(frames.length%64)*64,y:Math.floor(frames.length/64)*64,anchor:{x:cx,y:cy},kind:'unit',faction,type,owner,direction:directions[dir],state,frame});
 }
 return frames;
}
