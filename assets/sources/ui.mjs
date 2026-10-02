/** Original brass/wood UI ornaments and transient sparks, sharing the world palette. */
export function uiFrames(Surface,p){const frames=[];
 const names=['wood','gold','worker','attack','building','shield','bow','siege'];
 names.forEach((id,n)=>{const s=new Surface(32,32);s.ellipse(16,26,12,3,p.earth);
 if(id==='wood'){s.rect(8,7,15,20,p.barkDark);s.rect(11,8,10,18,p.bark);s.line(13,9,13,24,p.barkLight);s.ellipse(16,7,8,3,p.barkLight);s.ellipse(16,7,5,1,p.barkDark);}
 if(id==='gold'){for(const [x,y] of [[6,16],[15,6],[16,20]]){s.polygon([[x,y],[x+6,y-4],[x+11,y+2],[x+7,y+8],[x,y+5]],p.goldDark);s.rect(x+2,y,6,4,p.gold);s.pixel(x+3,y,p.goldLight);}}
 if(id==='worker'){s.ellipse(16,9,5,6,p.skin);s.rect(9,15,14,11,p.teamBlue);s.rect(10,16,12,2,p.teamBlueLight);s.rect(10,3,12,4,p.barkDark);}
 if(id==='attack'){s.polygon([[8,24],[22,5],[26,4],[25,9],[11,26]],p.rockHighlight);s.line(8,20,15,26,p.gold);s.line(5,27,10,22,p.barkLight);}
 if(id==='building'){s.rect(6,14,20,13,p.rock);s.polygon([[3,14],[16,4],[29,14]],p.teamBlue);s.line(8,11,16,6,p.teamBlueLight);s.rect(12,20,7,7,p.ink);}
 if(id==='shield'){s.polygon([[6,6],[26,6],[25,22],[16,29],[7,22]],p.goldDark);s.polygon([[9,9],[23,9],[22,20],[16,25],[10,20]],p.teamBlue);s.rect(14,11,4,10,p.gold);s.rect(11,14,10,3,p.goldLight);}
 if(id==='bow'){s.line(9,4,21,15,p.barkLight);s.line(21,15,9,28,p.barkLight);s.line(9,4,9,28,p.rockLight);s.line(5,16,26,16,p.rockHighlight);s.polygon([[25,13],[30,16],[25,19]],p.rockLight);}
 if(id==='siege'){s.rect(4,18,24,7,p.bark);s.ellipse(7,25,4,4,p.ink);s.ellipse(25,25,4,4,p.ink);s.line(10,19,22,5,p.barkLight);s.ellipse(23,5,5,3,p.rockLight);}
 frames.push({id:`icon-${id}`,image:s,x:n*32,y:0,anchor:{x:0,y:0},kind:'icon'});});
 const panel=new Surface(48,48);panel.rect(0,0,48,48,p.barkDark);panel.rect(5,5,38,38,p.ink);panel.rect(1,1,46,2,p.goldDark);panel.rect(1,45,46,2,p.goldDark);panel.rect(1,1,2,46,p.goldDark);panel.rect(45,1,2,46,p.goldDark);for(const [x,y] of [[8,8],[39,8],[8,39],[39,39]]){panel.polygon([[x,y-4],[x+4,y],[x,y+4],[x-4,y]],p.gold);panel.pixel(x,y,p.goldLight);}frames.push({id:'panel',image:panel,x:320,y:0,anchor:{x:0,y:0},kind:'panel',border:16});
 for(const kind of ['impact','splash'])for(let n=0;n<4;n++){const size=kind==='splash'?64:32,s=new Surface(size,size),cx=size/2,radius=3+n*(kind==='splash'?7:3);for(let a=0;a<8;a++){const angle=a*Math.PI/4,x=cx+Math.cos(angle)*radius,y=cx+Math.sin(angle)*radius;s.line(x,y,x+Math.cos(angle)*3,y+Math.sin(angle)*3,n<2?p.goldLight:p.goldDark);}if(n<3){s.ellipse(cx,cx,5-n,5-n,p.gold);s.ellipse(cx,cx,2,2,p.goldLight);}frames.push({id:`${kind}-${n}`,image:s,x:(kind==='splash'?0:256)+n*size,y:64,anchor:{x:cx,y:cx},kind:'effect'});}
 return frames;
}
