import {readFileSync} from 'node:fs';
import {Surface} from '../../../scripts/pixelArt.mjs';
import {readRGBA} from '../../../scripts/read-rgba-png.mjs';
const root=new URL('../../../',import.meta.url),dir=new URL('assets/sources/visual-refresh/',root),output=new URL('public/assets/',root);
const factions=['crown','clans','elves','dwarves','goblins'],roles=['worker','soldier','archer','specialist','catapult'];
const sheets=Object.fromEntries([...factions,'air','buildings','naval'].map(id=>[id,readRGBA(new URL(`${id}.png`,dir))]));
// Reviewed source row boundaries: generated banner poses need taller cells.
const rowFractions={crown:[0,.2,.395,.583,.825,1],clans:[0,.2,.4,.6,.8,1],elves:[0,.185,.375,.575,.8,1],dwarves:[0,.21,.4,.585,.79,1],goblins:[0,.2,.4,.59,.79,1]};
function cell(sheet,col,row,columns,rows,fractions,name){
 const columnBounds=name==='buildings'?[0,246/1374,472/1374,710/1374,958/1374,1216/1374,1]:null;
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
const sourceCache=new Map();function source(name,col,row,columns=4,rows=5){const key=`${name}/${col}/${row}`;if(!sourceCache.has(key))sourceCache.set(key,cell(sheets[name],col,row,columns,rows,(name==='naval'?[0,.203,.408,.638,.809,1]:rowFractions[name]),name));return sourceCache.get(key);}
/** Pack source poses at native scale; preserve alpha, anchors and logical bodies. */
function draw(src,w,h,{bottom=h*.7,maxWidth=w-6,maxHeight=h-8,flip=false,owner='player',state='idle',index=0,direction='s',level=1}={}){
 const out=new Surface(w,h),scale=Math.min(maxWidth/src.width,maxHeight/src.height),dw=Math.round(src.width*scale),dh=Math.round(src.height*scale),left=Math.round((w-dw)/2),top=Math.round(bottom-dh),collapse=state==='death'?Math.max(.25,1-index*.22):1;
 for(let y=0;y<dh*collapse;y++)for(let x=0;x<dw;x++){const sx=src.x+Math.min(src.width-1,Math.floor((flip?dw-1-x:x)/scale)),sy=src.y+Math.min(src.height-1,Math.floor(y/scale/collapse)),i=(sy*src.sheet.width+sx)*4,dy=state==='death'?Math.round(bottom-dh*collapse+y):top+y+(state==='walk'?[0,1,0,-1][index]:['attack','gather','build'].includes(state)?[0,1,2,0][index]:0),dx=left+x;if(dy<0||dy>=h||dx<0||dx>=w)continue;let [r,g,b,a]=src.sheet.data.subarray(i,i+4);if(a<96)continue;
  // Team-cloth remap only: skin/wood/metal retain the source palette.
  if(owner==='enemy'&&b>r*1.2&&b>g*1.1){[r,g,b]=[b,Math.round(g*.62),Math.round(r*.6)];}
  const shade=direction.includes('n')?.86:1;if(state==='damaged'){r*=.65;g*=.65;b*=.65;}else{r*=shade;g*=shade;b*=shade;}
  if(src.sheet.data[i+2]>src.sheet.data[i]*1.2&&src.sheet.data[i+2]>src.sheet.data[i+1]*1.1){[r,g,b]=owner==='enemy'?[150,62,66]:[63,105,158];}
  const j=(dy*w+dx)*4;out.data.set([r,g,b,state==='death'?Math.round(a*(1-index*.16)):a],j);
 }
 if(state==='damaged'){out.line(w*.35,bottom-dh*.65,w*.53,bottom-dh*.3,'#241b17');out.line(w*.53,bottom-dh*.3,w*.46,bottom,'#241b17');}
 if(level>1){out.rect(w*.5-2,bottom-dh+3,4,4,'#edc765');if(level>2)out.rect(w*.5+4,bottom-dh+3,4,4,'#edc765');}
 return out;
}

export function refreshedFrame(atlas,m,id,w,h){
 let src,options;
 if(atlas==='units'&&roles.includes(m.type)){
 const faction=m.faction??'crown',pose=m.state==='walk'?[1,0,2,0][m.frame]:['attack','build','gather'].includes(m.state)?[0,3,3,0][m.frame]:0;
 src=source(faction,pose,roles.indexOf(m.type));options={bottom:m.type==='catapult'?40:44,maxHeight:m.type==='catapult'?38:42,maxWidth:60,owner:m.owner,state:m.state,index:m.frame,direction:m.direction,flip:['w','sw','nw'].includes(m.direction)};
 }else if(atlas==='buildings'&&['base','barracks','farm','forge','harbor','tower'].includes(m.buildingType)&&['complete','damaged'].includes(m.stage)){
 src=source('buildings',['base','barracks','farm','forge','harbor','tower'].indexOf(m.buildingType),factions.indexOf(m.faction??'crown'),6,5);options={bottom:h*.75,maxHeight:h*.72,maxWidth:w-10,owner:m.owner,state:m.stage,level:Number(id.match(/level(\d)/)?.[1]??1)};
 }else if(atlas==='naval'&&['warship','transport'].includes(m.role)){
 const pose=m.role==='warship'?(m.state==='attack'&&m.frame===2?1:0):(m.state==='walk'&&m.frame%2?3:2);
 src=source('naval',pose,factions.indexOf(m.faction??'crown'));options={bottom:40,maxHeight:38,maxWidth:58,owner:m.owner,state:m.state,index:m.frame,direction:m.direction,flip:['w','sw','nw'].includes(m.direction)};
 }else if(atlas==='air'){
 const [,faction,owner,direction,state,index]=id.match(/^(\w+)-air-(player|enemy)-(\w+)-(\w+)-(\d)$/);
 src=source('air',Number(index),factions.indexOf(faction));options={bottom:58,maxWidth:60,maxHeight:54,owner,state,index:Number(index),direction,flip:['w','sw','nw'].includes(direction)};
 }
 return src?draw(src,w,h,options):null;
}
