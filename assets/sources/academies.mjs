/** Original native-pixel training halls, following the existing upper-left lighting and team banners. */
export function academyFrames(Surface,p,offset){
 const frames=[];
 const profiles={crown:{wall:p.rockLight,side:p.rock,roof:p.teamBlue,trim:p.gold},clans:{wall:p.barkLight,side:p.barkDark,roof:p.teamRed,trim:p.rockLight},elves:{wall:p.barkLight,side:p.bark,roof:p.leaf,trim:p.leafHighlight},dwarves:{wall:p.rockLight,side:p.rockDark,roof:p.rock,trim:p.gold},goblins:{wall:p.bark,side:p.barkDark,roof:p.rockDark,trim:p.teamRedLight}};
 for(const faction of Object.keys(profiles))for(const owner of ['player','enemy'])for(const stage of ['foundation','building','complete','damaged']){
  const s=new Surface(128,128),v=profiles[faction],team=owner==='player'?p.teamBlue:p.teamRed,light=owner==='player'?p.teamBlueLight:p.teamRedLight;
  s.ellipse(66,106,48,10,p.ink);s.ellipse(61,101,44,9,p.earth);
  s.polygon([[22,87],[83,82],[106,96],[43,111]],p.rockDark);s.polygon([[22,83],[82,78],[106,91],[43,106]],p.rock);
  for(let i=0;i<5;i++)s.line(28+i*13,84,48+i*12,100,p.rockLight);
  if(stage==='foundation'){
   s.rect(27,69,47,12,p.rockDark);for(let x=29;x<74;x+=12)s.rect(x,70,10,7,p.rockLight);s.rect(80,80,17,8,p.bark);s.line(82,76,100,91,p.barkLight);s.rect(46,92,15,4,p.barkLight);
  }else{
   const top=stage==='building'?53:40;
   s.rect(28,top,52,43,v.wall);s.polygon([[80,top],[101,top+13],[101,95],[80,83]],v.side);
   for(let y=top+5;y<82;y+=11)for(let x=31+(y%2)*5;x<78;x+=12){s.line(x,y,x+9,y,p.rockHighlight);s.line(x+9,y,x+9,y+5,v.side);}
   s.rect(46,62,20,22,p.ink);s.rect(48,64,16,18,p.barkDark);s.rect(56,64,2,19,p.barkLight);s.rect(29,top+11,9,12,p.ink);s.rect(31,top+12,5,8,light);s.rect(69,top+11,8,12,p.ink);s.rect(71,top+12,4,8,light);
   if(stage==='building'){
    for(const x of [24,42,77,103])s.rect(x,48,3,51,p.barkDark);s.line(25,54,100,82,p.barkLight);s.line(23,76,100,57,p.barkLight);s.rect(38,46,35,8,p.bark);
   }else{
    s.polygon([[21,43],[52,19],[81,39],[106,57],[79,47],[26,51]],p.ink);s.polygon([[25,43],[52,23],[78,40],[80,45],[27,47]],v.roof);s.polygon([[53,23],[82,41],[102,56],[80,46]],v.side);
    for(let i=0;i<3;i++)s.line(33+i*4,40-i*5,74-i*5,42-i*4,v.trim);
    s.line(26,48,78,46,v.trim);s.line(80,47,103,58,p.rockDark);
    // Open-book relief makes the academy distinguishable from houses and production buildings.
    s.rect(47,43,18,14,p.ink);s.polygon([[49,45],[56,47],[56,54],[49,52]],'#e1d5b0');s.polygon([[57,47],[63,45],[63,52],[57,54]],p.goldLight);s.line(56,46,56,56,p.barkDark);
    s.rect(19,51,3,43,p.barkDark);s.rect(22,55,11,16,team);s.rect(22,55,11,3,light);s.rect(96,62,2,38,p.barkDark);s.rect(98,66,10,14,team);s.rect(98,66,10,2,light);
    if(faction==='clans'){s.line(22,42,18,29,p.rockLight);s.line(18,29,24,34,p.rockHighlight);s.line(97,54,104,42,p.rockLight);}
    if(faction==='elves'){s.ellipse(25,66,7,3,p.leaf);s.ellipse(87,35,7,4,p.leafLight);s.line(85,38,101,87,p.leafDark);}
    if(faction==='dwarves'){s.rect(78,23,11,26,p.rockDark);s.rect(79,23,10,5,p.rockHighlight);s.line(42,39,55,29,p.goldLight);s.line(55,29,64,37,p.goldLight);}
    if(faction==='goblins'){s.rect(87,27,8,26,p.rockDark);s.rect(85,25,12,6,p.rockLight);s.rect(72,46,7,8,p.gold);s.rect(74,48,3,4,p.ink);}
    // Courtyard bench and training dummy use the same world-pixel scale as workers.
    s.rect(75,95,19,3,p.barkLight);s.rect(77,98,3,6,p.barkDark);s.rect(88,98,3,6,p.barkDark);s.rect(39,83,3,21,p.barkDark);s.rect(34,82,13,3,p.barkLight);s.ellipse(40,78,4,4,p.goldDark);
    if(stage==='damaged'){s.line(75,52,71,61,p.ink);s.line(71,61,76,69,p.ink);s.rect(67,31,10,8,p.ink);s.rect(82,106,6,3,p.rockLight);s.rect(33,107,9,3,v.side);}
   }
  }
  const slot=offset+frames.length;frames.push({id:`${faction==='crown'?'':faction+'-'}academy-${owner}-${stage}`,image:s,x:slot%8*128,y:Math.floor(slot/8)*128,anchor:{x:64,y:96},kind:'building',faction,owner,buildingType:'academy',stage,logicalFootprint:{width:64,height:64}});
 }
 return frames;
}
