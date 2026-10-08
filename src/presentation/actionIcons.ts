import {type FactionId} from '../config/factions';
import {buildingFrame,type BuildingKind} from './assets';
import {unitFrame,motion,artAtlas,type UnitArt} from './animation';
import {actionIds,type ActionId} from './actionPanel';
export interface ActionIcon {atlas?:string;frame?:string;glyph?:string;badge?:'research'|'upgrade'}
const glyphs:Partial<Record<ActionId,string>>={'scout-route':'route','auto-scout':'explore','autocast-heal':'autocast','cast-heal':'heal','cast-ward':'ward','cast-hex':'hex','repair-building':'repair','attack-move':'advance','unit-ability':'ability','unload-transport':'unload','hold-position':'hold','patrol-units':'patrol','stop-units':'stop','dismiss-units':'dismiss'};
export function actionIcon(id:ActionId,faction:FactionId):ActionIcon {
 if(id.startsWith('build-'))return {atlas:id==='build-siegeWorks'?'siegeWorks':id==='build-aviary'?'aviary':id==='build-stable'?'cavalry':'buildings',frame:buildingFrame(id.slice(6) as BuildingKind,'player',0,5,faction)};
 if(id.startsWith('train-')){const type=(id==='train-ship'?'warship':id.slice(6)) as UnitArt;return {atlas:artAtlas(type),frame:unitFrame(motion(undefined,{x:0,y:0},'idle',0,type,'player',undefined,faction),0)};}
 if(id==='upgrade-tower'||id==='upgrade-tower-air')return {atlas:'tower-specializations',frame:`${faction==='crown'?'':faction+'-'}tower-${id==='upgrade-tower'?'ground':'air'}-player-complete`,badge:'upgrade'};
 if(id==='upgrade-base')return {atlas:'buildings',frame:buildingFrame(id==='upgrade-base'?'base':'tower','player',0,5,faction,undefined,2),badge:'upgrade'};
 if(id==='research-cavalryArmor')return {...actionIcon('train-cavalry',faction),badge:'research'};
 if(id==='research-healerTraining')return {...actionIcon('train-healer',faction),badge:'research'};
 if(id==='research-scoutOptics')return {...actionIcon('train-scout',faction),badge:'research'};
 if(id==='research-workerTools')return {...actionIcon('train-worker',faction),badge:'research'};
 if(id.startsWith('research-'))return {atlas:'ui',frame:id==='research-attack'?'icon-attack':'icon-shield',badge:'research'};
 return {glyph:glyphs[id]};
}
export interface IconSource {image:CanvasImageSource;x:number;y:number;width:number;height:number}
const cache=new Map<string,string>();
function drawGlyph(c:CanvasRenderingContext2D,glyph:string){
 const rect=(x:number,y:number,w:number,h:number,color='#e9d295')=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
 const line=(x:number,y:number,tx:number,ty:number,color='#e9d295')=>{const steps=Math.max(Math.abs(tx-x),Math.abs(ty-y));for(let i=0;i<=steps;i++)rect(Math.round(x+(tx-x)*i/steps),Math.round(y+(ty-y)*i/steps),2,2,color);};
 const arrow=(x:number,y:number,tx:number,ty:number)=>{line(x,y,tx,ty);if(x!==tx){const d=tx>x?-1:1;line(tx,ty,tx+d*5,ty-4);line(tx,ty,tx+d*5,ty+4);}else{const d=ty>y?-1:1;line(tx,ty,tx-4,ty+d*5);line(tx,ty,tx+4,ty+d*5);}};
 if(glyph==='route'){for(const [x,y] of [[5,7],[25,7],[16,25]])rect(x-2,y-2,5,5,'#82c889');arrow(7,7,23,7);line(25,9,16,23);line(14,23,5,9);}
 else if(glyph==='explore'){line(16,3,16,28,'#86dbe6');line(3,16,28,16,'#86dbe6');rect(11,11,10,10,'#82c889');rect(14,14,4,4,'#ffe8a3');}
 else if(glyph==='autocast'){arrow(4,5,26,5);arrow(26,26,4,26);rect(13,9,5,15,'#82c889');rect(8,14,15,5,'#82c889');}
 else if(glyph==='heal'){rect(12,5,7,22,'#d3eee2');rect(5,12,22,7,'#d3eee2');rect(14,8,3,16,'#82c889');}
 else if(glyph==='ward'||glyph==='hold'){line(6,6,25,6);line(6,6,8,21);line(25,6,23,21);line(8,21,16,27);line(23,21,16,27);rect(12,10,8,10,glyph==='ward'?'#86dbe6':'#e0ac53');if(glyph==='hold'){rect(2,9,2,13);rect(28,9,2,13);}}
 else if(glyph==='hex'){line(4,16,13,7,'#c18ce5');line(13,7,27,16,'#c18ce5');line(4,16,16,25,'#c18ce5');line(16,25,27,16,'#c18ce5');rect(14,12,4,9,'#d6a4f0');}
 else if(glyph==='repair'){line(9,26,22,9,'#c79965');rect(13,4,14,6,'#afbbc8');rect(12,8,5,5,'#afbbc8');}
 else if(glyph==='gate'){rect(4,5,4,23,'#aebcaf');rect(24,5,4,23,'#aebcaf');line(8,6,20,11,'#c79965');line(20,11,20,25,'#c79965');arrow(9,19,25,19);}
 else if(glyph==='advance'){line(7,26,24,9,'#d8e1e7');line(6,19,14,27);arrow(6,5,26,5);}
 else if(glyph==='ability'){for(const [x,y] of [[16,3],[29,16],[16,29],[3,16]])line(16,16,x,y,'#e0ac53');rect(12,12,9,9,'#ffe8a3');}
 else if(glyph==='unload'){line(4,20,8,26,'#7398c1');line(8,26,25,26,'#7398c1');line(25,26,29,20,'#7398c1');arrow(16,3,16,22);}
 else if(glyph==='patrol'){arrow(5,8,26,8);arrow(26,23,5,23);line(5,8,5,16);line(26,23,26,15);}
 else if(glyph==='stop'){rect(7,5,18,22,'#ce7770');rect(5,7,22,18,'#ce7770');rect(10,14,12,4,'#f6dfbc');}
 else if(glyph==='dismiss'){rect(9,5,12,8,'#92a6ad');rect(7,14,17,12,'#92a6ad');line(5,5,26,26,'#e78f83');line(26,5,5,26,'#e78f83');}
}
/** Original command glyphs and tight crops of the approved game sprites, cached once per faction. */
export function renderActionIcons(faction:FactionId,source:(atlas:string,frame:string)=>IconSource):void {
 for(const id of actionIds){const icon=actionIcon(id,faction),key=`${faction}:${id}`;let url=cache.get(key);
  if(!url){const canvas=document.createElement('canvas');canvas.width=canvas.height=40;const c=canvas.getContext('2d')!;c.imageSmoothingEnabled=false;
   if(icon.atlas&&icon.frame){const f=source(icon.atlas,icon.frame),crop=document.createElement('canvas');crop.width=f.width;crop.height=f.height;const cc=crop.getContext('2d')!;cc.drawImage(f.image,f.x,f.y,f.width,f.height,0,0,f.width,f.height);const data=cc.getImageData(0,0,f.width,f.height).data;let minX=f.width,minY=f.height,maxX=-1,maxY=-1;for(let y=0;y<f.height;y++)for(let x=0;x<f.width;x++)if(data[(y*f.width+x)*4+3]>32){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}if(maxX>=0){const w=maxX-minX+1,h=maxY-minY+1,scale=Math.min(36/w,36/h),dw=Math.max(1,Math.floor(w*scale)),dh=Math.max(1,Math.floor(h*scale));c.drawImage(crop,minX,minY,w,h,Math.floor((40-dw)/2),Math.floor((40-dh)/2),dw,dh);}}
   if(icon.glyph){c.save();c.translate(4,4);drawGlyph(c,icon.glyph);c.restore();}
   if(icon.badge){c.save();c.translate(8,8);c.fillStyle='#172422';c.fillRect(20,20,12,12);c.fillStyle='#ffe8a3';if(icon.badge==='research'){c.fillRect(23,23,7,2);c.fillRect(25,21,2,7);}else{c.fillRect(24,25,3,6);c.fillRect(22,23,7,2);c.fillRect(24,21,3,2);}c.restore();}
   url=canvas.toDataURL();cache.set(key,url);
  }
  const button=document.getElementById(id)!;if(button.dataset.actionIcon!==key){button.dataset.actionIcon=key;button.style.setProperty('--action-icon',`url("${url}")`);}
 }
}
