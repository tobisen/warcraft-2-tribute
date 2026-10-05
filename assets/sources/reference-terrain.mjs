/** Original pixel brushes, authored in this repository; reference images are never sampled. */
export const colors={grass:'#426b35',grassDark:'#3d6331',grassLight:'#487239',earth:'#77613a',sand:'#afa16b',foam:'#91b4ad',shallow:'#487f90',water:'#30667f',deep:'#26566f',rock:'#787d78',rockDark:'#444f49',rockLight:'#a1a49a',leaf:'#285b34',leafDark:'#173d2a',leafLight:'#407948',leafHighlight:'#66925a',bark:'#765336'};
export function referenceFrames(Surface){
 const p=colors,frames=[],add=(id,image)=>frames.push({id,image});
 for(const kind of ['grass','earth','sand','shallow','water','deep','rock'])for(let v=0;v<4;v++){
  const s=new Surface(32,32);s.rect(0,0,32,32,p[kind]);
  for(let n=0;n<36;n++){const h=(Math.imul(n+v*97+1,2654435761)^Math.imul(n*n+31,1597334677))>>>0,x=h%32,y=(h>>>12)%32;s.pixel(x,y,kind==='grass'?(n%3?p.grassDark:p.grassLight):kind==='rock'?(n%3?p.rockDark:p.rockLight):kind==='earth'?p.bark:kind==='sand'?p.earth:kind==='deep'?p.water:p.shallow);}
  if(kind==='rock')for(const [x,y]of [[1,2],[18,0],[8,17]]){s.polygon([[x,y+5],[x+5,y],[x+13,y+2],[x+15,y+11],[x+4,y+14]],p.rockDark);s.polygon([[x+1,y+5],[x+5,y+1],[x+12,y+3],[x+11,y+9],[x+4,y+11]],p.rock);s.line(x+5,y+1,x+11,y+3,p.rockLight);}
  add(`${kind}-${v}`,s);
 }
 for(const kind of ['shore','earth','cliff'])for(const side of ['n','e','s','w']){
  const s=new Surface(32,32);for(let i=0;i<32;i++){const depth=5+Math.round(Math.sin(i*Math.PI/31)*2);for(let d=0;d<depth;d++){const color=kind==='shore'?(d<2?p.sand:d===depth-1?p.foam:p.shallow):kind==='earth'?(d<depth-2?p.earth:p.grassDark):(d<2?p.rockDark:d<4?p.rock:p.rockLight);s.pixel(side==='w'?d:side==='e'?31-d:i,side==='n'?d:side==='s'?31-d:i,color);}}add(`${kind}-${side}`,s);
 }
 for(const kind of ['sand','shallow','water','earth'])for(const side of ['n','e','s','w']){const s=new Surface(32,32);for(let i=0;i<32;i++)for(let d=0;d<8;d++)if(d<3||(i*13+d*7)%9<8-d)s.pixel(side==='w'?d:side==='e'?31-d:i,side==='n'?d:side==='s'?31-d:i,p[kind]);add(`blend-${kind}-${side}`,s);}
 for(const corner of ['nw','ne','se','sw']){const s=new Surface(32,32);for(let y=0;y<8;y++)for(let x=0;x<8;x++){const d=Math.hypot(x,y);if(d<8)s.pixel(corner.includes('e')?31-x:x,corner.includes('s')?31-y:y,d<3?p.sand:d<6?p.shallow:p.foam);}add(`shore-${corner}`,s);}
 for(let v=0;v<4;v++){
  const s=new Surface(48,48);s.ellipse(25,40,20,6,p.leafDark);
  for(const [x,y] of [[11+v%3,39],[34-v%2,40],[22+v%2,31+v%3]]){s.rect(x-2,y-10,4,11,p.bark);for(let k=0;k<4;k++){const top=y-37+k*7,wide=5+k*3;s.polygon([[x,top],[x+wide,top+13],[x+wide-3,top+16],[x-wide,top+14]],p.leafDark);s.polygon([[x-1,top+2],[x+wide-3,top+12],[x-2,top+12],[x-wide+2,top+13]],p.leaf);s.line(x-2,top+4,x-wide+3,top+11,p.leafLight);for(let j=0;j<3;j++)s.pixel(x-4+j*3+(v%2),top+10+j,p.leafHighlight);}}
  add(`forest-${v}`,s);
 }
 const stump=new Surface(48,48);stump.ellipse(24,40,10,3,p.earth);stump.rect(21,32,7,9,p.bark);stump.ellipse(24,32,4,2,p.sand);stump.pixel(24,32,p.bark);add('stump',stump);
 return frames;
}
