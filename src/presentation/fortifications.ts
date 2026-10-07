import Phaser from 'phaser';
import type {Defense} from '../gameplay/towers';
import type {FactionId} from '../config/factions';
import {buildingFrame} from './assets';
import {defenseConfig} from '../config/defenses';
/** Native-pixel masonry uses connected roof planes and continuous brick faces. */
function wallCell(ctx:CanvasRenderingContext2D,x:number,y:number,mask:number,damaged:boolean):void {
 const rects:{x:number;y:number;w:number;h:number}[]=[];
 if(mask&10||!mask)rects.push({x,y:y+8,w:32,h:16});
 if(mask&5)rects.push({x:x+8,y,w:16,h:32});
 if(!rects.length)rects.push({x,y:y+8,w:32,h:16});
 // Draw all extruded faces before the connected top, so corners have no seams.
 for(const r of rects){ctx.fillStyle='#222b2c';ctx.fillRect(r.x,r.y,r.w,r.h+20);
  for(let row=0;row<Math.ceil((r.h+20)/5);row++)for(let col=-1;col<r.w/8;col++){
   const l=Math.max(r.x,r.x+col*8+(row%2?4:0)),right=Math.min(r.x+r.w,r.x+col*8+(row%2?4:0)+7),yy=r.y+row*5;
   if(right<=l)continue;ctx.fillStyle=(row+col)%3?'#8b938d':'#adb4a6';ctx.fillRect(l,yy,right-l,4);ctx.fillStyle='#c0c8b4';ctx.fillRect(l,yy,right-l,1);
  }
 }
 for(const r of rects){ctx.fillStyle='#3c4645';ctx.fillRect(r.x,r.y,r.w,r.h);ctx.fillStyle='#adb4a6';ctx.fillRect(r.x,r.y+1,r.w,r.h-2);ctx.fillStyle='#d2d4bb';ctx.fillRect(r.x,r.y,r.w,2);}
 // Crenellations follow the wall direction instead of placing posts at every cell end.
 if(mask&10||!mask)for(let dx=0;dx<32;dx+=8){ctx.fillStyle='#313b39';ctx.fillRect(x+dx,y+5,5,7);ctx.fillStyle='#c0c8b4';ctx.fillRect(x+dx+1,y+5,3,4);}
 if(mask&5)for(let dy=0;dy<32;dy+=8){ctx.fillStyle='#313b39';ctx.fillRect(x+6,y+dy,5,5);ctx.fillStyle='#c0c8b4';ctx.fillRect(x+7,y+dy,3,3);}
 if(damaged){ctx.fillStyle='#222b2c';ctx.fillRect(x+15,y+17,2,12);ctx.fillRect(x+17,y+27,5,2);}
}
/** Retain the existing gate art; connected wall arms join its pillars/arch. */
export function fortificationTexture(scene:Phaser.Scene,t:Defense,masks:readonly number[],faction:FactionId):string {
 const source=t.kind==='gate'&&t.open?`${faction==='crown'?'':faction+'-'}gate-player-open`:buildingFrame(t.kind,'player',t.construction.remainingSeconds,defenseConfig[t.kind].seconds,faction,t.hp,t.level);
 const key=`connected-${source}-${masks.join('-')}`;
 if(scene.textures.exists(key))return key;
 const texture=scene.textures.createCanvas(key,128,128)!;texture.setFilter(Phaser.Textures.FilterMode.NEAREST);const ctx=texture.context;
 if(t.kind==='wall'&&t.construction.remainingSeconds===0)wallCell(ctx,48,48,masks[0]??0,source.endsWith('-damaged'));
 else{
  if(t.kind==='gate'&&t.construction.remainingSeconds===0)for(let i=0;i<masks.length;i++)if(masks[i]&5)wallCell(ctx,64-t.footprint.width/2+i*32,48,masks[i]&5,false);
  const frame=scene.textures.getFrame('buildings',source);ctx.drawImage(frame.source.image as CanvasImageSource,frame.cutX,frame.cutY,frame.cutWidth,frame.cutHeight,t.kind==='gate'&&t.footprint.width===32?32:0,0,t.kind==='gate'&&t.footprint.width===32?64:128,128);
 }
 texture.refresh();return key;
}
