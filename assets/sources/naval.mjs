/** Original repo-local timber ships, heraldic sails and integer-pixel wakes. */
export const navalDirections=['e','se','s','sw','w','nw','n','ne'];
export function navalFrames(Surface,p){
 const frames=[];
 for(const faction of ['crown','clans','elves'])for(const owner of ['player','enemy'])for(const role of ['warship','transport'])for(let d=0;d<8;d++)for(const state of ['idle','walk','attack','death'])for(let frame=0;frame<(state==='idle'?1:4);frame++){
  const s=new Surface(64,64),angle=d*Math.PI/4,team=owner==='player'?p.teamBlue:p.teamRed,light=owner==='player'?p.teamBlueLight:p.teamRedLight;
  const recoil=state==='attack'&&role==='warship'?[0,-1,-3,-1][frame]:0;
  const pt=(x,y)=>[Math.round(32+x*Math.cos(angle)-y*Math.sin(angle)),Math.round(40+(x*Math.sin(angle)+y*Math.cos(angle))*.65)];
  const poly=(points,c)=>s.polygon(points.map(([x,y])=>pt(x,y)),c),line=(x,y,a,b,c)=>s.line(...pt(x,y),...pt(a,b),c);
  if(state==='walk'){for(let i=0;i<3;i++)line(-22-i*3,(-8+i*3)+([0,1,2,1][frame]),-22-i*3,8-i*3,p.foam);}
  if(state==='death'){s.ellipse(32,43,18+frame*2,3,p.waterLight);s.ellipse(32,43,16+frame,2,p.foam);}
  if(state!=='death'||frame<3){
   poly([[-20,-7],[-13,-11],[13,-9],[23,0],[13,9],[-13,11],[-20,7]],p.ink);
   poly([[-18,-6],[-12,-9],[12,-7],[20,0],[12,7],[-12,9],[-18,6]],faction==='clans'?p.barkDark:p.bark);
   poly([[-15,-5],[-11,-7],[11,-5],[17,0],[11,5],[-11,7],[-15,5]],p.barkLight);
   for(let x=-12;x<13;x+=4)line(x,-6,x,6,p.bark);
   line(-17,-7,15,-6,team);line(-17,7,15,6,team);
   // Bow and stern details identify faction/role while preserving native geometry.
   if(faction==='clans'){poly([[15,-6],[24,0],[15,6]],p.barkDark);line(18,-4,24,-2,p.rockHighlight);line(18,4,24,2,p.rockHighlight);}
   else {line(16,-5,21,0,p.goldDark);line(21,0,16,5,p.gold);}
   if(role==='transport'){line(-16,3,-5,3,p.barkDark);line(-16,-3,-5,-3,p.barkLight);}
   if(role==='transport'){for(const [x,y] of [[-10,-3],[-10,3],[10,-3]]){const a=pt(x,y);s.rect(a[0]-3,a[1]-3,6,5,p.goldDark);s.line(a[0]-2,a[1]-3,a[0]+2,a[1]+1,p.gold);}}
   else {line(10+recoil,0,23+recoil,0,p.ink);line(10+recoil,1,21+recoil,1,p.rockLight);const a=pt(-10,0);s.rect(a[0]-4,a[1]-3,8,6,p.rockDark);s.rect(a[0]-2,a[1]-2,4,4,p.rockLight);}
   if(state!=='death'||frame===0){s.rect(31,17,2,25,p.barkDark);s.rect(32,17,1,23,p.barkLight);const flutter=state==='walk'?frame%2:0;
    s.polygon([[30,18],[17+flutter,23],[20,34],[30,36]],p.rockHighlight);s.polygon([[34,18],[47-flutter,23],[44,34],[34,36]],team);
    s.line(34,20,43,24,light);s.rect(26,22,3,8,p.gold);if(faction==='clans'){s.rect(37,24,6,4,p.rockHighlight);s.rect(39,28,2,3,p.rockHighlight);}else{s.rect(37,25,6,2,p.gold);s.rect(39,23,2,6,p.gold);}
    s.polygon([[33,17],[44,13],[43,19],[33,21]],team);
   }
   if(faction==='elves'){
    // Slender carved prow and leaf sails; owner heraldry remains blue/red.
    poly([[12,-6],[27,0],[12,6]],p.leafDark);line(17,-4,26,0,p.leafHighlight);line(26,0,17,4,p.leaf);
    line(-18,-8,-8,-10,p.goldDark);line(-18,8,-8,10,p.gold);
    if(state!=='death'||frame===0){const flutter=state==='walk'?frame%2:0;s.polygon([[32,16],[20+flutter,22],[22,32],[31,36]],p.leafDark);s.polygon([[34,16],[45-flutter,22],[42,32],[34,36]],team);s.line(34,19,42,25,p.goldLight);s.line(22,24,29,32,p.leafHighlight);s.polygon([[34,12],[40,15],[34,18],[28,15]],p.leaf);}
    if(role==='transport'){poly([[-10,-5],[-5,-8],[0,-5],[-5,-2]],p.leaf);poly([[-10,5],[-5,8],[0,5],[-5,2]],p.leaf);}
   }
   if(state==='attack'&&role==='warship'&&frame<2){const a=pt(24,0);s.ellipse(a[0],a[1],frame===0?5:3,3,p.goldLight);s.pixel(a[0]+2,a[1],p.gold);}
   if(state==='death'&&frame>0){const limit=40-frame*3;for(let y=0;y<limit;y++)for(let x=0;x<64;x++)s.data[(y*64+x)*4+3]=0;}
  }
  frames.push({id:`${faction==='crown'?'':faction+'-'}${role}-${owner}-${navalDirections[d]}-${state}-${frame}`,image:s,x:frames.length%16*64,y:Math.floor(frames.length/16)*64,anchor:{x:32,y:40},kind:'ship',faction,owner,role,direction:navalDirections[d],state,frame});
 }
 return frames;
}
