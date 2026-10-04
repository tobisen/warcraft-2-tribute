/** Original small woodland animals: no reference raster, placeholder geometry or gameplay entity. */
export function wildlifeFrames(Surface,p){const frames=[];
 const add=(id,image)=>frames.push({id,image,x:(frames.length%8)*32,y:224+Math.floor(frames.length/8)*32,anchor:{x:16,y:24},kind:'wildlife'});
 for(const type of ['deer','rabbit','fox'])for(const action of ['idle','walk'])for(let frame=0;frame<(action==='idle'?2:4);frame++){
  const s=new Surface(32,32),stride=action==='walk'?[0,2,0,-2][frame]:0,bob=action==='walk'?frame%2:0;
  s.ellipse(15,26,12,3,p.earth);
  if(type==='deer'){
   for(const [x,y]of [[9,20],[17,20],[12,19],[21,19]]){s.line(x,y,x+stride,y+6,p.barkDark);s.pixel(x+stride,y+6,p.ink);}
   s.ellipse(15,17+bob,10,5,p.barkDark);s.ellipse(15,16+bob,9,4,p.bark);s.line(8,14+bob,20,14+bob,p.barkLight);
   s.polygon([[19,18],[19,10+bob],[23,7+bob],[28,10+bob],[27,14+bob],[24,15+bob],[24,19]],p.bark);s.rect(24,10+bob,5,3,p.barkLight);s.pixel(28,12+bob,p.ink);s.pixel(24,9+bob,p.ink);
   s.line(22,8+bob,20,3+bob,p.barkDark);s.line(21,5+bob,17,4+bob,p.barkLight);s.line(26,8+bob,27,2+bob,p.barkLight);s.line(27,5+bob,30,3+bob,p.barkLight);s.rect(19,7+bob,3,2,p.linen);s.rect(5,16+bob,3,3,p.linen);
  }else if(type==='rabbit'){
   s.ellipse(13,21+bob,7,5,p.linenShadow);s.ellipse(14,20+bob,6,4,p.linen);s.ellipse(20,18+bob,5,4,p.linen);s.line(18,16+bob,17,8+bob,p.linenShadow);s.line(21,15+bob,23,8+bob,p.linen);s.line(21,14+bob,23,9+bob,p.skinShadow);s.ellipse(6,20+bob,3,3,p.linenLight);s.rect(10+stride,24,5,2,p.linenShadow);s.rect(19-stride,23,5,2,p.linen);s.pixel(23,18+bob,p.ink);s.pixel(25,20+bob,p.skinShadow);
  }else{
   s.polygon([[4,20],[2,15],[6,17],[10,19],[10,23],[6,24]],p.copper);s.polygon([[2,15],[5,16],[4,19]],p.linenLight);s.ellipse(16,20+bob,8,4,p.copper);s.line(11,17+bob,22,17+bob,p.copperLight);s.rect(10+stride,23,3,3,p.barkDark);s.rect(20-stride,23,3,3,p.barkDark);s.polygon([[21,21+bob],[22,14+bob],[24,10+bob],[25,14+bob],[28,12+bob],[28,17+bob],[30,20+bob],[25,22+bob]],p.copper);s.polygon([[23,21+bob],[28,18+bob],[30,20+bob],[26,22+bob]],p.linenLight);s.pixel(27,16+bob,p.ink);s.pixel(30,20+bob,p.ink);
  }
  if(action==='idle'&&frame===1)s.pixel(type==='deer'?24:type==='rabbit'?23:27,type==='deer'?9:type==='rabbit'?18:16,type==='rabbit'?p.linenShadow:p.bark);
  add(`critter-${type}-${action}-${frame}`,s);
 }
 const log=new Surface(32,32);log.ellipse(16,25,13,3,p.earth);log.polygon([[4,19],[8,16],[27,20],[26,25],[5,24]],p.barkDark);log.line(8,17,24,21,p.barkLight);log.line(5,21,25,23,p.bark);log.ellipse(27,22,3,4,p.barkLight);log.ellipse(27,22,2,3,p.ink);add('detail-log',log);
 const mushrooms=new Surface(32,32);for(const [x,y]of [[11,22],[20,24]]){mushrooms.rect(x,y-3,2,5,p.linen);mushrooms.ellipse(x+1,y-4,4,2,p.teamRed);mushrooms.pixel(x,y-5,p.linenLight);}add('detail-mushrooms',mushrooms);
 const reeds=new Surface(32,32);for(let n=0;n<5;n++){reeds.line(12+n*2,27,10+n*3,12+n%3,p.leafLight);reeds.rect(9+n*3,10+n%3,2,5,p.bark);}add('detail-reeds',reeds);
 return frames;
}
