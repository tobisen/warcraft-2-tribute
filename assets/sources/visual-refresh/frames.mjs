import {resourceSprite} from './resources.mjs';
import {readFileSync} from 'node:fs';
import {reduceSprite} from './sample.mjs';
import {Surface} from '../../../scripts/pixelArt.mjs';
import {readRGBA} from '../../../scripts/read-rgba-png.mjs';
const root=new URL('../../../',import.meta.url),dir=new URL('assets/sources/visual-refresh/',root),output=new URL('public/assets/',root);
const factions=['crown','clans','elves','dwarves','goblins'],roles=['worker','soldier','archer','specialist','catapult'];
const sheets=Object.fromEntries([...factions,'air','buildings','naval','wildlife','fortifications-205'].map(id=>[id,readRGBA(new URL(`${id}.png`,dir))]));
// Reviewed source row boundaries: generated banner poses need taller cells.
const rowFractions={crown:[0,.2,.395,.583,.825,1],clans:[0,.2,.4,.6,.8,1],elves:[0,.185,.375,.575,.8,1],dwarves:[0,.21,.4,.585,.79,1],goblins:[0,.2,.4,.59,.79,1]};
export function cell(sheet,col,row,columns,rows,fractions,name){
 const columnBounds=name==='buildings'?[0,246/1374,472/1374,710/1374,958/1374,1216/1374,1]:name==='fortifications-205'?[0,.285,.48,.745,1]:null;
 const x0=Math.floor((columnBounds?.[col]??col/columns)*sheet.width),x1=Math.floor((columnBounds?.[col+1]??(col+1)/columns)*sheet.width),y0=Math.floor((fractions?.[row]??row/rows)*sheet.height),y1=Math.floor((fractions?.[row+1]??(row+1)/rows)*sheet.height);
 const width=x1-x0,height=y1-y0,mask=new Uint8Array(width*height),visited=new Uint8Array(width*height),components=[];
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)mask[y*width+x]=sheet.data[((y+y0)*sheet.width+x+x0)*4+3]>=96?1:0;
 for(let at=0;at<mask.length;at++)if(mask[at]&&!visited[at]){
  const queue=[at],component={points:queue,left:width,top:height,right:0,bottom:0};visited[at]=1;
  for(let n=0;n<queue.length;n++){const point=queue[n],x=point%width,y=Math.floor(point/width);component.left=Math.min(component.left,x);component.right=Math.max(component.right,x);component.top=Math.min(component.top,y);component.bottom=Math.max(component.bottom,y);
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy,next=yy*width+xx;if(xx>=0&&yy>=0&&xx<width&&yy<height&&mask[next]&&!visited[next]){visited[next]=1;queue.push(next);}}
  }components.push(component);
 }
 components.sort((a,b)=>b.points.length-a.points.length);const main=components[0];if(!main)throw new Error('Empty source cell');
 // Ignore disconnected scraps from adjacent generated cells, keep the subject
 // and its internal details/large flag/smoke components.
 const clean=new Surface(width,height);let left=width,top=height,right=0,bottom=0;
 for(const component of components){const cx=(component.left+component.right)/2,cy=(component.top+component.bottom)/2;if(component.points.length<main.points.length*.015&&!(cx>=main.left&&cx<=main.right&&cy>=main.top&&cy<=main.bottom))continue;
  for(const at of component.points){const x=at%width,y=Math.floor(at/width),i=((y+y0)*sheet.width+x+x0)*4;clean.data.set(sheet.data.subarray(i,i+4),at*4);left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
 }
 return {sheet:clean,x:left,y:top,width:right-left+1,height:bottom-top+1};
}
const sourceCache=new Map();function source(name,col,row,columns=4,rows=5){const key=`${name}/${col}/${row}`;if(!sourceCache.has(key))sourceCache.set(key,cell(sheets[name],col,row,columns,rows,(name==='wildlife'?[0,.42,.7,1]:name==='naval'?[0,.203,.408,.638,.809,1]:rowFractions[name]),name));return sourceCache.get(key);}
/** Pack source poses at native scale; preserve alpha, anchors and logical bodies. */
export function draw(src,w,h,{bottom=h*.7,maxWidth=w-6,maxHeight=h-8,flip=false,owner='player',state='idle',index=0,direction='s',level=1,clanBanner=false,teamBand=true,nativeWildlife=false}={}){
 let teamPixels=0;const out=new Surface(w,h),scale=Math.min(maxWidth/src.width,maxHeight/src.height),dw=Math.round(src.width*scale),dh=Math.round(src.height*scale),left=Math.round((w-dw)/2),top=Math.round(bottom-dh),collapse=state==='death'?Math.max(.25,1-index*.22):1;
 const key=`${dw}/${dh}/${nativeWildlife}`;src.reduced??=new Map();if(!src.reduced.has(key))src.reduced.set(key,reduceSprite(src,dw,dh));if(nativeWildlife){const native=new Uint8Array(dw*dh*4);for(let y=0;y<dh;y++)for(let x=0;x<dw;x++){const i=((src.y+Math.min(src.height-1,Math.floor(y/scale)))*src.sheet.width+src.x+Math.min(src.width-1,Math.floor(x/scale)))*4;native.set(src.sheet.data.subarray(i,i+4),(y*dw+x)*4);}src.reduced.set(key,native);}const pixels=src.reduced.get(key);
 for(let y=0;y<dh*collapse;y++)for(let x=0;x<dw;x++){const sx=flip?dw-1-x:x,sy=Math.min(dh-1,Math.floor(y/collapse)),i=(sy*dw+sx)*4,dy=state==='death'?Math.round(bottom-dh*collapse+y):top+y+(state==='walk'?[0,1,0,-1][index]:['attack','gather','build'].includes(state)?[0,1,2,0][index]:0),dx=left+x;if(dy<0||dy>=h||dx<0||dx>=w)continue;let [r,g,b,a]=pixels.subarray(i,i+4);if(a<96)continue;
  // Preserve cloth's highlights and shadows; recolor only saturated blue cloth.
  const cloth=b>r*1.2&&b>g*1.1;const clothValue=b;
  if(cloth&&owner==='enemy'){const blue=b;[r,g,b]=[blue,Math.round(g*.65),Math.round(r*.7)];}
  const shade=state==='damaged'?.65:direction.includes('n')?.86:1;r*=shade;g*=shade;b*=shade;
  if(cloth&&(nativeWildlife||clothValue>=70&&clothValue<=175)){[r,g,b]=owner==='enemy'?[150,62,66]:[63,105,158];teamPixels++;}
  const j=(dy*w+dx)*4;out.data.set([r,g,b,state==='death'?Math.round(a*(1-index*.16)):a],j);
 }
 if(teamBand&&teamPixels===0&&state!=='death'){const x=Math.round(w/2),y=Math.round(bottom-dh*.45);out.rect(x-1,y,3,3,owner==='enemy'?'#963e42':'#3f699e');out.rect(x-1,y,3,1,owner==='enemy'?'#cf7770':'#7398c1');}
 if(state==='damaged'){out.line(w*.35,bottom-dh*.65,w*.53,bottom-dh*.3,'#241b17');out.line(w*.53,bottom-dh*.3,w*.46,bottom,'#241b17');}
 if(clanBanner){const y=Math.round(bottom-dh*.55),x=Math.round(left+dw*.13);out.rect(x,y-7,1,16,'#927045');out.rect(x+1,y-7,6,7,owner==='enemy'?'#963e42':'#3f699e');out.rect(x+1,y-7,6,1,owner==='enemy'?'#dd8170':'#82b3d4');}
 if(level>1){out.rect(w*.5-2,bottom-dh+3,4,4,'#edc765');if(level>2)out.rect(w*.5+4,bottom-dh+3,4,4,'#edc765');}
 return out;
}

export function refreshedFrame(atlas,m,id,w,h){
 if(atlas==='world'&&/^(wood|gold)-(available|depleted)$/.test(id))return resourceSprite(id.startsWith('wood')?id.endsWith('depleted')?'stump':'tree':id.endsWith('depleted')?'mine-empty':'mine-full',w,h);
 let src,options;
 if(atlas==='units'&&roles.includes(m.type)){
 const faction=m.faction??'crown',pose=m.state==='walk'?[1,0,2,0][m.frame]:['attack','build','gather'].includes(m.state)?[0,3,3,0][m.frame]:0;
 src=source(faction,pose,roles.indexOf(m.type));options={bottom:m.type==='catapult'?40:44,maxHeight:m.type==='catapult'?38:42,maxWidth:60,owner:m.owner,state:m.state,index:m.frame,direction:m.direction,flip:['w','sw','nw'].includes(m.direction)};
 }else if(atlas==='buildings'&&['base','barracks','farm','forge','harbor','tower'].includes(m.buildingType)&&['complete','damaged'].includes(m.stage)){
 src=source('buildings',['base','barracks','farm','forge','harbor','tower'].indexOf(m.buildingType),factions.indexOf(m.faction??'crown'),6,5);options={bottom:h*.75,maxHeight:h*.72,maxWidth:w-10,owner:m.owner,state:m.stage,level:Number(id.match(/level(\d)/)?.[1]??1)};
 }else if(atlas==='buildings'&&['academy','wall','gate'].includes(m.buildingType)&&['complete','damaged','open'].includes(m.stage)){
 const col=m.buildingType==='academy'?0:m.buildingType==='wall'?1:m.stage==='open'?3:2;
 src=source('fortifications-205',col,factions.indexOf(m.faction??'crown'));options={bottom:96,maxHeight:m.buildingType==='wall'?36:m.buildingType==='gate'?58:92,maxWidth:m.buildingType==='wall'?36:m.buildingType==='gate'?72:118,owner:m.owner,state:m.stage,clanBanner:m.faction==='clans'};
 }else if(atlas==='naval'&&['warship','transport'].includes(m.role)){
 const pose=m.role==='warship'?(m.state==='attack'&&m.frame===2?1:0):(m.state==='walk'&&m.frame%2?3:2);
 src=source('naval',pose,factions.indexOf(m.faction??'crown'));options={bottom:40,maxHeight:38,maxWidth:58,owner:m.owner,state:m.state,index:m.frame,direction:m.direction,flip:['w','sw','nw'].includes(m.direction)};
 }else if(atlas==='world'&&id.startsWith('critter-')){
 const [,animal,action,index]=id.match(/^critter-(deer|rabbit|fox)-(idle|walk)-(\d)$/),row=['deer','rabbit','fox'].indexOf(animal);
 src=source('wildlife',Number(index)+(action==='walk'?2:0),row,6,3);options={bottom:24,maxWidth:animal==='rabbit'?22:28,maxHeight:animal==='deer'?22:animal==='rabbit'?18:20,teamBand:false,nativeWildlife:true};
 }else if(atlas==='air'){
 const [,faction,owner,direction,state,index]=id.match(/^(\w+)-air-(player|enemy)-(\w+)-(\w+)-(\d)$/);
 src=source('air',Number(index),factions.indexOf(faction));options={bottom:58,maxWidth:60,maxHeight:54,owner,state,index:Number(index),direction,flip:['w','sw','nw'].includes(direction)};
 }
 return src?draw(src,w,h,options):null;
}
