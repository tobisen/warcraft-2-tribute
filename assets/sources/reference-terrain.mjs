/** Original pixel brushes, authored in this repository; reference images are never sampled. */
export const colors={grass:'#426b35',grassDark:'#3d6331',grassLight:'#487239',earth:'#77613a',sand:'#afa16b',foam:'#91b4ad',shallow:'#487f90',water:'#30667f',deep:'#26566f',rock:'#787d78',rockDark:'#444f49',rockLight:'#a1a49a',leaf:'#285b34',leafDark:'#173d2a',leafLight:'#407948',leafHighlight:'#66925a',bark:'#765336'};
export function referenceFrames(Surface){
 const p=colors,frames=[],add=(id,image)=>frames.push({id,image});
 for(const kind of ['grass','earth','sand','shallow','water','deep','rock'])for(let v=0;v<4;v++){
  const s=new Surface(32,32);s.rect(0,0,32,32,p[kind]);
  for(let n=0;n<36;n++){const h=(Math.imul(n+v*97+1,2654435761)^Math.imul(n*n+31,1597334677))>>>0,x=h%32,y=(h>>>12)%32;s.pixel(x,y,kind==='grass'?(n%3?p.grassDark:p.grassLight):kind==='rock'?(n%3?p.rockDark:p.rockLight):kind==='earth'?p.bark:kind==='sand'?p.earth:kind==='deep'?p.water:p.shallow);}
  if(kind==='rock'){s.rect(0,0,32,32,p.rock);for(let n=0;n<7;n++){const x=(n*13+v*7)%32,y=(n*9+v*3)%32;s.line(x,y,x+7,y-2,p.rockLight);s.line(x+7,y-2,x+10,y+4,p.rockDark);s.pixel(x+1,y+1,p.rockDark);}s.line(0,29,32,29,p.rockDark);}
  add(`${kind}-${v}`,s);
 }
 for(const kind of ['shore','earth','cliff'])for(const side of ['n','e','s','w']){
  const s=new Surface(32,32);for(let i=0;i<32;i++){const depth=5+Math.round(Math.sin(i*Math.PI/31)*2);for(let d=0;d<depth;d++){const color=kind==='shore'?(d<2?p.sand:d===depth-1?p.foam:p.shallow):kind==='earth'?(d<depth-2?p.earth:p.grassDark):(side==='s'||side==='e'?d<2?p.rockLight:d<depth-1?p.rockDark:p.leafDark:d<2?p.rockLight:p.rock);s.pixel(side==='w'?d:side==='e'?31-d:i,side==='n'?d:side==='s'?31-d:i,color);}}add(`${kind}-${side}`,s);
 }
 for(const kind of ['sand','shallow','water','earth'])for(const side of ['n','e','s','w']){const s=new Surface(32,32);for(let i=0;i<32;i++)for(let d=0;d<8;d++)if(d<3||(i*13+d*7)%9<8-d)s.pixel(side==='w'?d:side==='e'?31-d:i,side==='n'?d:side==='s'?31-d:i,p[kind]);add(`blend-${kind}-${side}`,s);}
 for(const corner of ['nw','ne','se','sw']){const s=new Surface(32,32);for(let y=0;y<8;y++)for(let x=0;x<8;x++){const d=Math.hypot(x,y);if(d<8)s.pixel(corner.includes('e')?31-x:x,corner.includes('s')?31-y:y,d<3?p.sand:d<6?p.shallow:p.foam);}add(`shore-${corner}`,s);}
 for(let v=0;v<4;v++){
  const s=new Surface(48,48);s.ellipse(25,40,20,6,p.leafDark);
  for(const [x,y] of [[11+v%3,39],[34-v%2,40],[22+v%2,31+v%3]]){s.rect(x-2,y-10,4,11,p.bark);for(let k=0;k<4;k++){const top=y-37+k*7,wide=5+k*3;s.polygon([[x,top],[x+wide,top+13],[x+wide-3,top+16],[x-wide,top+14]],p.leafDark);s.polygon([[x-1,top+2],[x+wide-3,top+12],[x-2,top+12],[x-wide+2,top+13]],p.leaf);s.line(x-2,top+4,x-wide+3,top+11,p.leafLight);for(let j=0;j<3;j++)s.pixel(x-4+j*3+(v%2),top+10+j,p.leafHighlight);}}
  add(`forest-${v}`,s);
 }
 for(let v=0;v<4;v++){const s=new Surface(48,48),x=23+v%2;s.ellipse(26,42,14,4,p.leafDark);s.rect(x-2,29,5,14,p.bark);s.line(x-1,30,x-1,42,p.sand);for(let k=0;k<5;k++){const top=2+k*6,wide=6+k*3;s.polygon([[x,top],[x+wide,top+13],[x+wide-3,top+17],[x-wide,top+15]],p.leafDark);s.polygon([[x-1,top+1],[x+wide-4,top+12],[x-3,top+13],[x-wide+2,top+13]],p.leaf);s.line(x-2,top+4,x-wide+3,top+12,p.leafLight);s.pixel(x-4,top+8,p.leafHighlight);}add(`tree-${v}`,s);}
 for(const depleted of [false,true]){const s=new Surface(96,96);s.ellipse(50,86,42,7,p.leafDark);s.polygon([[8,79],[12,49],[27,23],[48,10],[70,23],[86,47],[89,80],[72,88],[24,88]],p.rockDark);s.polygon([[12,49],[27,23],[48,10],[70,23],[78,43],[55,54],[32,48]],p.rockLight);s.polygon([[12,49],[32,48],[55,54],[44,76],[24,88],[8,79]],p.rock);s.polygon([[55,54],[78,43],[86,47],[89,80],[72,88],[44,76]],p.rockDark);for(let n=0;n<36;n++){const x=18+(n*17)%60,y=34+(n*11)%39;s.line(x,y,x+4,y-2,n%3?p.rock:p.rockLight);s.pixel(x+4,y,p.rockDark);}s.line(27,23,48,10,p.sand);s.line(48,10,70,23,p.sand);s.line(25,29,37,41,p.rockDark);s.line(37,41,32,48,p.rockDark);s.line(69,28,64,44,p.rockDark);s.line(77,57,83,78,p.leafDark);s.rect(34,59,29,27,p.leafDark);s.polygon([[34,62],[42,55],[56,55],[63,62],[63,85],[34,85]],p.leafDark);s.rect(33,62,5,24,p.bark);s.rect(60,62,5,24,p.bark);s.rect(34,58,30,5,p.bark);s.line(34,58,63,58,p.sand);s.line(34,63,34,82,p.sand);s.rect(36,83,27,3,p.earth);s.line(42,83,41,94,p.rockDark);s.line(54,83,58,94,p.rockDark);for(let y=85;y<94;y+=3)s.line(40,y,58,y,p.bark);for(const [x,y]of [[23,69],[69,75],[17,78]]){s.rect(x,y,7,4,depleted?p.rock:p.sand);s.pixel(x+2,y,depleted?p.rockLight:'#e2c56f');}s.rect(66,81,13,7,p.bark);s.line(66,82,78,82,p.sand);s.pixel(70,90,p.rockLight);add(depleted?'mine-empty':'mine-full',s);}
 const stump=new Surface(48,48);stump.ellipse(24,40,10,3,p.earth);stump.rect(21,32,7,9,p.bark);stump.ellipse(24,32,4,2,p.sand);stump.pixel(24,32,p.bark);add('stump',stump);
 return frames;
}
