import {resourceSprite} from './visual-refresh/resources.mjs';
/** Original pixel brushes, authored in this repository; reference images are never sampled. */
export const colors={grass:'#426b35',grassDark:'#3d6331',grassLight:'#487239',earth:'#77613a',sand:'#afa16b',foam:'#91b4ad',shallow:'#487f90',water:'#30667f',deep:'#26566f',rock:'#787d78',rockDark:'#444f49',rockLight:'#a1a49a',leaf:'#285b34',leafDark:'#173d2a',leafLight:'#407948',leafHighlight:'#66925a',bark:'#765336'};
export function referenceFrames(Surface){
 const p=colors,frames=[],add=(id,image)=>frames.push({id,image});
 for(const kind of ['grass','earth','sand','shallow','water','deep','rock'])for(let v=0;v<4;v++){
  const s=new Surface(32,32);s.rect(0,0,32,32,p[kind]);
  for(let n=0;n<36;n++){const h=(Math.imul(n+v*97+1,2654435761)^Math.imul(n*n+31,1597334677))>>>0,x=h%32,y=(h>>>12)%32;s.pixel(x,y,kind==='grass'?(n%3?p.grassDark:p.grassLight):kind==='rock'?(n%3?p.rockDark:p.rockLight):kind==='earth'?p.bark:kind==='sand'?p.earth:kind==='deep'?p.water:p.shallow);}
  if(kind==='rock'){
   s.rect(0,0,32,32,'#74776e');
   // Irregular broad strata; no line marking the bottom of every tile.
   for(let n=0;n<8;n++){const x=(n*13+v*7)%32,y=(n*9+v*3)%32;
    s.polygon([[x-5,y],[x+3,y-3],[x+9,y+1],[x+4,y+6],[x-5,y+5]],n%3?'#82857a':'#939488');
    s.line(x-5,y+5,x+4,y+6,'#535c53');s.line(x+4,y+6,x+9,y+1,'#626b60');
    s.line(x-4,y,x+2,y-2,'#adb09a');
   }
  }
  add(`${kind}-${v}`,s);
 }
 for(const kind of ['shore','earth'])for(const side of ['n','e','s','w']){
  const s=new Surface(32,32);for(let i=0;i<32;i++){const depth=9+Math.round(Math.sin(i*Math.PI/31)*3);for(let d=0;d<depth;d++){const color=kind==='shore'?(d<3?p.grassDark:d<6?p.sand:d===depth-1?p.foam:p.shallow):kind==='earth'?(d<depth-2?p.earth:p.grassDark):(side==='s'||side==='e'?d<2?p.rockLight:d<depth-1?p.rockDark:p.leafDark:d<2?p.rockLight:p.rock);s.pixel(side==='w'?d:side==='e'?31-d:i,side==='n'?d:side==='s'?31-d:i,color);}}add(`${kind}-${side}`,s);
 }
 // Elevated plateau rims with long vertical south/east walls and cast shadows.
 for(let v=0;v<4;v++)for(const side of ['n','e','s','w']){
  const s=new Surface(32,side==='s'?48:32);
  for(let i=0;i<32;i++){
   const ridge=3+Math.round(1.5*Math.sin((i+v*8)*.26));
   if(side==='s'){
    const lip=11+ridge,drop=16+(i*7+v)%4;
    for(let y=lip;y<lip+drop;y++)s.pixel(i,y,y>lip+drop-4?'#243e2b':(Math.floor(i/5)+v)%3===0?'#424c43':'#596257');
    s.pixel(i,lip,'#b0b09a');s.pixel(i,lip+1,'#8d917d');
    if((i+v)%6===0)s.line(i,lip+3,i-2,lip+drop-5,'#333e36');
    if((i+v)%7===2)s.line(i,lip+3,i,lip+drop-5,'#7b806b');
   }else for(let d=0;d<ridge+3;d++){
    const color=side==='e'?(d<2?'#313e34':d<4?'#505b4e':'#b0b09a'):d<2?'#b0b09a':'#898e7b';
    s.pixel(side==='w'?d:side==='e'?31-d:i,side==='n'?d:i,color);
   }
  }
  add(`cliff-${side}-${v}`,s);
 }
 for(const corner of ['nw','ne','se','sw']){const s=new Surface(32,32);for(let y=0;y<15;y++)for(let x=0;x<15;x++){const d=Math.hypot(x,y);if(d>15)continue;s.pixel(corner.includes('e')?31-x:x,corner.includes('s')?31-y:y,d<8?p.grassDark:d<12?p.sand:p.shallow);}add(`shore-cap-${corner}`,s);}
 for(const corner of ['nw','ne','se','sw']){const s=new Surface(32,32);for(let y=0;y<11;y++)for(let x=0;x<11;x++){const d=Math.hypot(x,y);if(d>10)continue;s.pixel(corner.includes('e')?31-x:x,corner.includes('s')?31-y:y,d<7?p.grassDark:'#a3a78e');}add(`cliff-${corner}`,s);}
 for(const kind of ['sand','shallow','water','earth'])for(const side of ['n','e','s','w']){const s=new Surface(32,32);for(let i=0;i<32;i++)for(let d=0;d<8;d++)if(d<3||(i*13+d*7)%9<8-d)s.pixel(side==='w'?d:side==='e'?31-d:i,side==='n'?d:side==='s'?31-d:i,p[kind]);add(`blend-${kind}-${side}`,s);}
 for(const corner of ['nw','ne','se','sw']){const s=new Surface(32,32);for(let y=0;y<8;y++)for(let x=0;x<8;x++){const d=Math.hypot(x,y);if(d<8)s.pixel(corner.includes('e')?31-x:x,corner.includes('s')?31-y:y,d<3?p.sand:d<6?p.shallow:p.foam);}add(`shore-${corner}`,s);}
 for(let v=0;v<4;v++){
  const s=new Surface(48,48);s.ellipse(25,40,20,6,p.leafDark);
  for(const [x,y] of [[11+v%3,39],[34-v%2,40],[22+v%2,31+v%3]]){s.rect(x-2,y-10,4,11,p.bark);for(let k=0;k<4;k++){const top=y-37+k*7,wide=5+k*3;s.polygon([[x,top],[x+wide,top+13],[x+wide-3,top+16],[x-wide,top+14]],p.leafDark);s.polygon([[x-1,top+2],[x+wide-3,top+12],[x-2,top+12],[x-wide+2,top+13]],p.leaf);s.line(x-2,top+4,x-wide+3,top+11,p.leafLight);for(let j=0;j<3;j++)s.pixel(x-4+j*3+(v%2),top+10+j,p.leafHighlight);}}
  add(`forest-${v}`,s);
 }
 for(let v=0;v<4;v++){
  const s=new Surface(48,48),x=23+v%2;s.ellipse(27,41,18,5,'#243e29');
  s.rect(x-2,25,5,17,p.bark);s.line(x-1,29,x-1,42,'#a0844e');s.line(x-2,42,x-8,44,p.bark);
  const lobes=[[16,15,10,9],[29,15,10,10],[12,24,10,9],[25,26,13,12],[35,25,9,10],[22,9,10,8]];
  for(const [lx,ly,rx,ry]of lobes){s.ellipse(lx+v%2,ly,rx,ry,'#183c28');s.ellipse(lx-2,ly-2,rx-2,ry-2,'#2f6036');s.ellipse(lx-3,ly-4,rx-4,ry-4,'#477b40');}
  for(let n=0;n<62;n++){const a=n*2.399,vary=(n*13+v*17)%15,r=4+vary*.7,px=23+Math.cos(a)*r,py=21+Math.sin(a)*r*.8;s.rect(px,py,2+(n%2),1,n%3?'#538648':'#699453');}
  add(`tree-${v}`,s);
 }
 // Overlapping rock crests build a continuous ridge with upper-left lighting.
 for(let v=0;v<4;v++){
  const s=new Surface(64,80),top=5+v*3;
  s.ellipse(35,70,29,7,'#293e2d');
  s.polygon([[2,54],[9,30],[24,top+8],[38,top],[53,25],[62,52],[57,70],[34,76],[10,67]],'#414c43');
  s.polygon([[9,30],[24,top+8],[38,top],[53,25],[39,38],[23,43]],'#a3a48c');
  s.polygon([[2,54],[9,30],[23,43],[39,38],[34,76],[10,67]],'#767d6b');
  s.polygon([[39,38],[53,25],[62,52],[57,70],[34,76]],'#515e4e');
  s.polygon([[8,48],[18,35],[26,44],[24,59],[13,64]],'#919780');
  s.polygon([[28,52],[37,42],[44,51],[41,67],[31,71]],'#69765f');
  s.line(9,30,24,top+8,'#c0bda0');s.line(24,top+8,38,top,'#c0bda0');
  s.line(23,43,39,38,'#bac0a0');s.line(10,67,24,59,'#454f43');
  s.line(31,18+v,29,28,'#5b6857');s.line(29,28,39,38,'#5b6857');
  s.line(48,35,45,49,'#313f34');s.line(45,49,51,62,'#313f34');
  for(let n=0;n<27;n++){const x=10+(n*17+v*7)%42,y=34+(n*11)%28;s.line(x,y,x+3,y-1,n%3?'#87917a':'#acb294');}
  add(`crag-${v}`,s);
 }
 for(const depleted of [false,true]){const s=new Surface(96,96);s.ellipse(50,86,42,7,p.leafDark);s.polygon([[8,79],[12,49],[27,23],[48,10],[70,23],[86,47],[89,80],[72,88],[24,88]],p.rockDark);s.polygon([[12,49],[27,23],[48,10],[70,23],[78,43],[55,54],[32,48]],p.rockLight);s.polygon([[12,49],[32,48],[55,54],[44,76],[24,88],[8,79]],p.rock);s.polygon([[55,54],[78,43],[86,47],[89,80],[72,88],[44,76]],p.rockDark);for(let n=0;n<36;n++){const x=18+(n*17)%60,y=34+(n*11)%39;s.line(x,y,x+4,y-2,n%3?p.rock:p.rockLight);s.pixel(x+4,y,p.rockDark);}s.line(27,23,48,10,p.sand);s.line(48,10,70,23,p.sand);s.line(25,29,37,41,p.rockDark);s.line(37,41,32,48,p.rockDark);s.line(69,28,64,44,p.rockDark);s.line(77,57,83,78,p.leafDark);s.rect(34,59,29,27,p.leafDark);s.polygon([[34,62],[42,55],[56,55],[63,62],[63,85],[34,85]],p.leafDark);s.rect(33,62,5,24,p.bark);s.rect(60,62,5,24,p.bark);s.rect(34,58,30,5,p.bark);s.line(34,58,63,58,p.sand);s.line(34,63,34,82,p.sand);s.rect(36,83,27,3,p.earth);s.line(42,83,41,94,p.rockDark);s.line(54,83,58,94,p.rockDark);for(let y=85;y<94;y+=3)s.line(40,y,58,y,p.bark);for(const [x,y]of [[23,69],[69,75],[17,78]]){s.rect(x,y,7,4,depleted?p.rock:p.sand);s.pixel(x+2,y,depleted?p.rockLight:'#e2c56f');}s.rect(66,81,13,7,p.bark);s.line(66,82,78,82,p.sand);s.pixel(70,90,p.rockLight);add(depleted?'mine-empty':'mine-full',s);}
 const stump=new Surface(48,48);stump.ellipse(24,40,10,3,p.earth);stump.rect(21,32,7,9,p.bark);stump.ellipse(24,32,4,2,p.sand);stump.pixel(24,32,p.bark);add('stump',stump);
 for(const f of frames){if(f.id.startsWith('tree-')||f.id.startsWith('forest-'))f.image=resourceSprite('tree',48,48,Number(f.id.split('-')[1]));else if(f.id==='stump'||f.id.startsWith('mine-'))f.image=resourceSprite(f.id,f.image.width,f.image.height);}
 for(const kind of ['chest-closed','chest-open'])add(kind,resourceSprite(kind,32,32));
 return frames;
}
