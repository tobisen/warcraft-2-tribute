/** Original miniature people and timber siege engine; eight authored directional poses. */
export const directions=['e','se','s','sw','w','nw','n','ne'];
export const animationSpec={idle:{frames:1,fps:1,loop:true},walk:{frames:4,fps:8,loop:true},attack:{frames:4,fps:8,loop:true},death:{frames:4,fps:8,loop:false},gather:{frames:4,fps:8,loop:true},build:{frames:4,fps:8,loop:true}};
export function unitFrames(Surface,p){const frames=[];
 for(const faction of ['crown','clans'])for(const type of ['worker','soldier','archer','catapult'])for(const owner of ['player','enemy'])for(let dir=0;dir<8;dir++)for(const state of type==='worker'?Object.keys(animationSpec):['idle','walk','attack','death'])for(let frame=0;frame<animationSpec[state].frames;frame++){
  const orc=faction==='clans',skin=orc?p.leafHighlight:p.skin;
  const size=type==='catapult'?64:32,s=new Surface(size,size),cx=size/2,cy=type==='catapult'?40:22,angle=dir*Math.PI/4,dx=Math.round(Math.cos(angle)*3),dy=Math.round(Math.sin(angle)*2),team=owner==='player'?p.teamBlue:p.teamRed,light=owner==='player'?p.teamBlueLight:p.teamRedLight;
  const stride=state==='walk'?[0,2,0,-2][frame]:0,bob=state==='walk'?frame%2:0,swing=['attack','gather','build'].includes(state)?[0,-3,2,4][frame]:0;
  if(type==='catapult'){
   const vx=Math.round(Math.cos(angle)*15),vy=Math.round(Math.sin(angle)*10);s.ellipse(cx,cy+9,22,6,p.earth);
   s.polygon([[cx-vx-8,cy-vy-5],[cx+vx-8,cy+vy-5],[cx+vx+8,cy+vy+5],[cx-vx+8,cy-vy+5]],p.barkDark);s.line(cx-vx,cy-vy,cx+vx,cy+vy,p.barkLight);
   for(const x of [-15,15]){s.ellipse(cx+x,cy+5+stride/2,5,7,p.ink);s.ellipse(cx+x,cy+5+stride/2,3,5,p.bark);s.pixel(cx+x,cy+5,p.rockLight);s.line(cx+x-2,cy+2+stride/2,cx+x+2,cy+8+stride/2,p.barkLight);s.line(cx+x-2,cy+8+stride/2,cx+x+2,cy+2+stride/2,p.barkLight);}
   if(orc){for(const x of [-12,12])s.polygon([[cx+x-3,cy-7],[cx+x,cy-17],[cx+x+3,cy-7]],p.rockHighlight);}
   s.rect(cx-7,cy-10,14,7,team);s.rect(cx-5,cy-9,10,2,light);const lift=state==='attack'?[14,20,4,9][frame]:14;s.line(cx-vx/2,cy-vy/2,cx+vx/2,cy+vy/2-lift,p.barkLight);s.line(cx-vx/2+1,cy-vy/2,cx+vx/2+1,cy+vy/2-lift,p.bark);s.ellipse(cx+vx/2,cy+vy/2-lift,7,3,p.barkDark);if(state!=='attack'||frame<2)s.ellipse(cx+vx/2,cy+vy/2-lift-3,4,4,p.rockLight);
   s.rect(cx-8,cy-5,16,3,p.bark);s.line(cx-7,cy-5,cx+7,cy-5,p.barkLight);s.rect(cx-4,cy-8,8,3,team);
  }else{
   s.ellipse(cx,cy+5,10,3,p.earth);s.rect(cx-5-stride/2,cy-1,4,6,p.barkDark);s.rect(cx+2+stride/2,cy-1,4,6,p.barkDark);s.rect(cx-6-stride/2,cy+4,5,2,p.ink);s.rect(cx+2+stride/2,cy+4,5,2,p.ink);
   const bodyColor=type==='worker'?p.bark:type==='soldier'?p.rock:team;s.rect(cx-6,cy-11-bob,12,12,bodyColor);s.rect(cx-4,cy-10-bob,8,6,team);s.rect(cx-3,cy-10-bob,6,2,light);s.rect(cx-6,cy-2,12,2,p.barkDark);s.pixel(cx,cy-2,p.gold);
   s.rect(cx-4+dx,cy-19+dy-bob,8,8,skin);s.rect(cx-4+dx,cy-20+dy-bob,8,3,type==='soldier'?p.rockLight:p.barkDark);if(type==='soldier'){s.rect(cx-5+dx,cy-19+dy-bob,10,3,p.rockHighlight);s.rect(cx-4+dx,cy-16+dy-bob,8,2,p.rockDark);s.rect(cx-3+dx,cy-13+dy-bob,6,2,skin);}
   if(orc){s.rect(cx-7+dx,cy-17+dy-bob,3,3,p.leafHighlight);s.rect(cx+4+dx,cy-17+dy-bob,3,3,p.leafHighlight);s.rect(cx-4+dx,cy-13+dy-bob,2,3,p.rockHighlight);s.rect(cx+2+dx,cy-13+dy-bob,2,3,p.rockHighlight);s.rect(cx-8,cy-11-bob,3,7,p.barkDark);s.rect(cx+5,cy-11-bob,3,7,p.barkDark);}
   if(dir<=4){s.pixel(cx+dx+(dx>=0?2:-2),cy-15+dy-bob,p.ink);}else{s.rect(cx-4+dx,cy-17+dy-bob,8,3,type==='archer'?team:p.barkDark);}
   // Native role silhouettes: pack/tool, armor, and a hood/quiver remain distinct.
   if(type==='worker'){
    const bagX=cx+(dx>=0?-7:4);s.rect(bagX,cy-5,5,6,p.barkDark);s.rect(bagX+1,cy-4,3,3,p.goldDark);s.line(cx-4,cy-10,cx+3,cy-3,p.barkLight);
    s.line(cx-5+dx,cy-18+dy-bob,cx+5+dx,cy-18+dy-bob,p.barkLight);
   }
   if(type==='soldier'){
    s.rect(cx-7,cy-11-bob,3,4,orc?p.rockHighlight:p.rockLight);s.rect(cx+4,cy-11-bob,3,4,orc?p.rockHighlight:p.rockLight);
    if(!orc){s.rect(cx-1+dx,cy-23+dy-bob,3,4,team);s.pixel(cx+dx,cy-23+dy-bob,light);s.line(cx-4,cy-7,cx+3,cy-7,p.rockHighlight);}
   }
   if(type==='archer'){
    s.line(cx-5+dx,cy-18+dy-bob,cx-5+dx,cy-13+dy-bob,p.leafDark);s.line(cx+4+dx,cy-18+dy-bob,cx+4+dx,cy-13+dy-bob,p.leafDark);
    s.line(cx-5+dx,cy-19+dy-bob,cx+4+dx,cy-19+dy-bob,team);s.line(cx-7,cy-14,cx-7,cy-4,p.barkLight);
    for(const offset of [-2,1]){s.line(cx-7+offset,cy-17,cx-7+offset,cy-12,p.rockLight);s.pixel(cx-6+offset,cy-17,p.rockHighlight);}
   }
   const handX=cx+dx*2+(dx>=0?5:-5),handY=cy-7+dy*2+swing;s.line(cx+(dx>=0?5:-5),cy-8,handX,handY,skin);
   if(type==='worker'){s.line(handX,handY+3,handX+dx+3,handY-7,p.barkLight);s.rect(handX+dx,handY-8,7,3,state==='build'?p.rockDark:p.rockLight);}
   if(type==='soldier'&&orc){s.line(handX,handY+2,handX+dx,handY-11+swing,p.barkLight);s.polygon([[handX+dx-6,handY-12+swing],[handX+dx+7,handY-12+swing],[handX+dx+5,handY-5+swing],[handX+dx-4,handY-6+swing]],p.rockHighlight);}
   if(type==='soldier'&&!orc){s.line(handX,handY,handX+dx*2,handY-11+swing,p.rockHighlight);s.rect(handX-3,handY-1,6,2,p.gold);const shieldX=cx-(dx>=0?10:-6);s.polygon([[shieldX,cy-10],[shieldX+7,cy-10],[shieldX+8,cy-2],[shieldX+4,cy+2],[shieldX-1,cy-2]],p.ink);s.rect(shieldX+1,cy-9,5,7,team);s.pixel(shieldX+3,cy-6,p.goldLight);}
   if(type==='archer'){const bowX=handX+dx;s.line(bowX,handY-8,bowX+4,handY,p.barkLight);s.line(bowX+4,handY,bowX,handY+7,p.barkLight);s.line(bowX,handY-8,bowX,handY+7,p.rockLight);if(state==='attack'){const pull=[0,2,4,0][frame];s.line(bowX,handY-8,bowX-pull,handY,p.rockLight);s.line(bowX-pull,handY,bowX,handY+7,p.rockLight);s.line(bowX-pull-3,handY,bowX+8,handY,p.rockHighlight);}s.rect(cx-7,cy-13,3,10,p.barkDark);s.line(cx-6,cy-16,cx-6,cy-10,p.rockHighlight);}
  }
  if(state==='death'){
   const dead=new Surface(size,size);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4;if(!s.data[i+3]||frame===3&&(x+y)%3===0)continue;const color='#'+[...s.data.subarray(i,i+3)].map(n=>n.toString(16).padStart(2,'0')).join('');const flat=frame/3;dead.pixel(cx+(x-cx)*(1-flat*.25),cy+(y-cy)*(1-flat*.8)+frame*2,color);}s.data=dead.data;
  }
  frames.push({id:`${orc?'clans-':''}${type}-${owner}-${directions[dir]}-${state}-${frame}`,image:s,x:(frames.length%32)*64,y:Math.floor(frames.length/32)*64,anchor:{x:cx,y:cy},kind:'unit',faction,type,owner,direction:directions[dir],state,frame});
 }
 return frames;
}
