import {clientPoint} from './displayPolicy';
import { cameraIndicator,minimapCamera,minimapContent,minimapSize,worldToMinimap,type MinimapData,type MapSize } from './minimap';
import type { Position } from '../gameplay/movement';
/** DOM canvas owns only camera navigation. Scene shutdown removes its sole listener. */
export function bindMinimap(canvas:HTMLCanvasElement,getView:()=>{data:MinimapData;scroll:Position;viewport:MapSize},setScroll:(point:Position)=>void,canNavigate:()=>boolean=()=>true){
 canvas.width=minimapSize.width;canvas.height=minimapSize.height;
 const context=canvas.getContext('2d')!;
 let pointer:number|undefined,suppressClick=false;
 const consume=(event:Event)=>{event.preventDefault();event.stopPropagation();};
 const navigate=(event:MouseEvent)=>{if(!canNavigate())return;const box=canvas.getBoundingClientRect(),v=getView();
  const point=clientPoint({x:event.clientX,y:event.clientY},box,{width:canvas.width,height:canvas.height});
  setScroll(minimapCamera(point,v.data.world,v.viewport));render();
 };
 const click=(event:MouseEvent)=>{consume(event);if(suppressClick){suppressClick=false;return;}if(event.button===0)navigate(event);};
 const down=(event:PointerEvent)=>{consume(event);if(event.button!==0||!canNavigate())return;pointer=event.pointerId;suppressClick=true;canvas.setPointerCapture?.(pointer);navigate(event);};
 const move=(event:PointerEvent)=>{consume(event);if(pointer===event.pointerId)navigate(event);};
 const end=(event:PointerEvent)=>{consume(event);if(pointer!==event.pointerId)return;const id=pointer;pointer=undefined;if(canvas.hasPointerCapture?.(id))canvas.releasePointerCapture(id);};
 const lost=()=>{pointer=undefined;};
 const contextMenu=(event:Event)=>consume(event);
 canvas.addEventListener('click',click);canvas.addEventListener('contextmenu',contextMenu);
 canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',lost);
 canvas.addEventListener('wheel',contextMenu,{passive:false});
 function render(){const {data,scroll,viewport}=getView();context.fillStyle='#050805';context.fillRect(0,0,canvas.width,canvas.height);const area=minimapContent(data.world);context.save();context.beginPath();context.rect(area.x,area.y,area.width,area.height);context.clip();context.fillStyle='#263929';context.fillRect(area.x,area.y,area.width,area.height);
  const rectangle=(r:{x:number;y:number;width:number;height:number})=>{const p=worldToMinimap(r,data.world);context.fillRect(p.x,p.y,r.width/data.world.width*area.width,r.height/data.world.height*area.height);};
  context.fillStyle='#535d65';for(const r of data.terrain)rectangle(r);for(const r of data.scenery??[]){context.fillStyle=r.color;rectangle(r);}
  if(data.fog){const f=data.fog;for(let row=0;row<f.rows;row++)for(let col=0;col<f.columns;col++){const i=row*f.columns+col;if(f.visible[i])continue;context.fillStyle=f.explored[i]?'rgba(0,0,0,.55)':'#050805';rectangle({x:col*f.tileSize,y:row*f.tileSize,width:Math.min(f.tileSize,data.world.width-col*f.tileSize),height:Math.min(f.tileSize,data.world.height-row*f.tileSize)});}}
  for(const marker of data.markers){context.fillStyle=marker.color;if(marker.footprint)rectangle(marker.footprint);else{const p=worldToMinimap(marker.position,data.world);context.fillRect(p.x-2,p.y-2,4,4);}}
  const r=cameraIndicator(scroll,data.world,viewport);context.strokeStyle='#ffffff';context.lineWidth=1;context.strokeRect(r.x+.5,r.y+.5,Math.max(0,r.width-1),Math.max(0,r.height-1));context.restore();
 }
 render();return {render,destroy:()=>{canvas.removeEventListener('click',click);canvas.removeEventListener('contextmenu',contextMenu);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',end);canvas.removeEventListener('pointercancel',end);canvas.removeEventListener('lostpointercapture',lost);canvas.removeEventListener('wheel',contextMenu);if(pointer!==undefined&&canvas.hasPointerCapture?.(pointer))canvas.releasePointerCapture(pointer);pointer=undefined;}};
}
