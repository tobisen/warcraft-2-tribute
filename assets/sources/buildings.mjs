/** Original masonry, timber and heraldry; native pixels, shared team variants. */
export function buildingFrames(Surface,p){
 const frames=[];
 for(const owner of ['player','enemy'])for(const kind of ['base','barracks','farm','forge'])for(const stage of ['foundation','building','complete']){
  const size=kind==='farm'?64:128,s=new Surface(size,size),cx=size/2,ground=kind==='farm'?48:96,team=owner==='player'?p.teamBlue:p.teamRed,light=owner==='player'?p.teamBlueLight:p.teamRedLight;
  const width=kind==='farm'?48:kind==='base'?56:64,left=cx-width/2,top=ground-24;
  s.ellipse(cx,ground+14,width/2+4,7,p.earth);s.rect(left,top,width,38,p.rockDark);
  for(let row=0;row<3;row++)for(let col=0;col<width/12;col++){const x=left+col*12+(row%2?4:0);s.rect(x,top+row*11,10,9,row%2?p.rock:p.rockLight);}
  if(stage==='foundation'){s.rect(left+4,top+4,width-8,26,p.earth);s.rect(left-3,ground+4,20,4,p.bark);s.line(cx-4,ground-5,cx+8,ground+7,p.barkLight);}
  else{
   s.rect(left+4,top-20,width-8,44,p.barkDark);s.rect(left+7,top-17,width-14,38,p.bark);for(let x=left+9;x<left+width-6;x+=10)s.rect(x,top-17,2,38,p.barkLight);
   s.rect(cx-8,ground-15,16,27,p.ink);s.rect(cx-6,ground-13,12,24,p.barkDark);s.pixel(cx+3,ground-1,p.gold);
   if(stage==='building'){for(const x of [left-3,left+width]){s.rect(x,top-38,3,60,p.barkLight);s.line(x,top-18,x+10,ground+10,p.bark);}s.rect(left-4,top-30,width+10,3,p.barkLight);s.rect(left-4,top-5,width+10,3,p.barkLight);}
   else{
    const roofTop=top-(kind==='base'?43:kind==='farm'?26:32);s.polygon([[left-7,top-13],[cx,roofTop],[left+width+7,top-13],[left+width+3,top-5],[left-3,top-5]],p.ink);s.polygon([[left-4,top-14],[cx,roofTop+3],[left+width+4,top-14],[left+width,top-9],[left,top-9]],team);for(let y=roofTop+10;y<top-10;y+=6)s.line(cx-(y-roofTop),y,cx+(y-roofTop),y,light);
    for(const x of [left+10,left+width-18]){s.rect(x,top-8,8,11,p.ink);s.rect(x+2,top-6,4,7,p.goldDark);}
    if(kind==='base'){for(const x of [left-5,left+width-10]){s.rect(x,top-32,15,55,p.rockDark);s.rect(x+2,top-30,11,51,p.rock);for(let y=top-28;y<ground;y+=10)s.rect(x+3,y,7,2,p.rockLight);s.rect(x-1,top-38,17,8,team);for(let dx=0;dx<17;dx+=6)s.rect(x-1+dx,top-43,4,7,p.rockLight);}}
    if(kind==='barracks'){s.line(left+10,top+1,left+22,ground-8,p.rockHighlight);s.line(left+22,top+1,left+10,ground-8,p.rockHighlight);s.rect(left+9,ground-5,15,2,p.gold);}
    if(kind==='forge'){s.rect(left+width-17,roofTop-10,11,27,p.rockDark);s.rect(left+width-15,roofTop-8,7,21,p.rock);s.rect(cx-6,ground-9,12,17,p.goldDark);s.rect(cx-3,ground-7,6,13,p.goldLight);s.rect(left+8,ground-1,17,4,p.rockHighlight);s.rect(left+13,ground+3,7,7,p.rockDark);}
    if(kind==='farm'){s.rect(left+3,ground+12,width-6,3,p.barkLight);for(let x=left+4;x<left+width-4;x+=9)s.rect(x,ground+7,3,13,p.bark);s.rect(left+4,ground+4,8,5,p.gold);}
    s.rect(cx+width/2+3,top-35,2,36,p.barkLight);s.polygon([[cx+width/2+5,top-34],[cx+width/2+20,top-31],[cx+width/2+5,top-23]],team);s.pixel(cx+width/2+8,top-29,light);
   }
  }
  frames.push({id:`${kind}-${owner}-${stage}`,image:s,x:(frames.length%8)*128,y:Math.floor(frames.length/8)*128,anchor:{x:cx,y:ground},kind:'building',owner,buildingType:kind,stage,logicalFootprint:{width:kind==='base'?(owner==='player'?48:96):64,height:kind==='base'?(owner==='player'?48:96):64}});
 }
 return frames;
}
