import {readFileSync,writeFileSync} from 'node:fs';
import {Surface,png} from './pixelArt.mjs';
import {readRGBA} from './read-rgba-png.mjs';
import {reduceSprite} from '../assets/sources/visual-refresh/sample.mjs';
const frames={},atlas=new Surface(384,288);
for(const [row,id]of ['bramblemaw','gravelheart'].entries()){
 const sheet=readRGBA(new URL(`../assets/sources/bosses/${id}.png`,import.meta.url));
 for(let col=0;col<4;col++){
  const x=Math.floor(col*sheet.width/4),right=Math.floor((col+1)*sheet.width/4),sprite=new Surface(96,96);
  // Equal source cells and one shared scale preserve the wind-up's height and the corpse's size.
  const reduced=reduceSprite({sheet,x,y:0,width:right-x,height:sheet.height},72,96);
  for(let y=0;y<96;y++)for(let xx=0;xx<72;xx++)sprite.data.set(reduced.subarray((y*72+xx)*4,(y*72+xx)*4+4),(y*96+xx+12)*4);
  atlas.blit(sprite,col*96,row*96);frames[`${id}-${col}`]={frame:{x:col*96,y:row*96,w:96,h:96},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:96,h:96},sourceSize:{w:96,h:96}};
 }
}
// Original code-native pixel serpent: swimming coils, raised bite and sinking silhouette.
for(let frame=0;frame<4;frame++){
 const sprite=new Surface(96,96),bob=frame===1?2:0;
 sprite.ellipse(48,75,29,5,'#244f65');sprite.line(20,76,36,78,'#63a8ac');sprite.line(59,78,78,75,'#63a8ac');
 if(frame===3){sprite.ellipse(48,76,20,3,'#387a80');sprite.polygon([[38,75],[45,63],[51,75]],'#4b9c8b');}
 else {
  for(const [x,y,rx,ry]of [[30,68,10,9],[48,64,12,12],[64,67,10,9]]){
   sprite.ellipse(x,y+bob,rx+2,ry+2,'#142f35');sprite.ellipse(x,y+bob,rx,ry,'#28796e');sprite.ellipse(x-2,y-3+bob,rx-3,ry-4,'#55ad8a');
   sprite.polygon([[x-5,y-ry+bob],[x,y-ry-7+bob],[x+4,y-ry+bob]],'#d4bc79');
  }
  const y=frame===2?38:46+bob;
  sprite.polygon([[61,70],[62,y+9],[68,y],[80,y+3],[84,y+15],[74,y+21],[75,69]],'#142f35');
  sprite.polygon([[65,69],[66,y+10],[70,y+3],[79,y+6],[80,y+14],[71,y+20],[72,68]],'#3d9d83');
  sprite.rect(73,y+7,4,3,'#f7d77d');sprite.pixel(76,y+8,'#1b2028');
  sprite.polygon([[72,y+16],[83,y+13],[82,y+21],[73,y+23]],'#182b30');
  sprite.rect(76,y+15,2,4,'#eadcb2');sprite.rect(80,y+14,2,4,'#eadcb2');
 }
 atlas.blit(sprite,frame*96,192);frames[`sea-serpent-${frame}`]={frame:{x:frame*96,y:192,w:96,h:96},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:96,h:96},sourceSize:{w:96,h:96}};
}
writeFileSync(new URL('../public/assets/bosses-atlas.png',import.meta.url),png(atlas));writeFileSync(new URL('../public/assets/bosses-atlas.json',import.meta.url),JSON.stringify({frames,meta:{image:'bosses-atlas.png',size:{w:384,h:288},scale:'1'}},null,2)+'\n');

const manifestPath=new URL('../public/assets/manifest.json',import.meta.url),manifest=JSON.parse(readFileSync(manifestPath));manifest.atlases.bosses={image:'assets/bosses-atlas.png',data:'assets/bosses-atlas.json',width:384,height:288,source:'assets/sources/bosses/README.md'};for(const [id,v]of Object.entries(frames))manifest.frames[id]={atlas:'bosses',kind:'boss',width:96,height:96,anchor:{x:48,y:75}};writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
