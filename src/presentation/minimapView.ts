import { cameraIndicator,minimapCamera,minimapSize,worldToMinimap,type MinimapData,type MapSize } from './minimap';
import type { Position } from '../gameplay/movement';
/** DOM canvas owns only camera navigation. Scene shutdown removes its sole listener. */
export function bindMinimap(canvas:HTMLCanvasElement,getView:()=>{data:MinimapData;scroll:Position;viewport:MapSize},setScroll:(point:Position)=>void){
 canvas.width=minimapSize.width;canvas.height=minimapSize.height;
 const context=canvas.getContext('2d')!;
 const click=(event:MouseEvent)=>{const box=canvas.getBoundingClientRect(),v=getView();
  const point={x:(event.clientX-box.left-canvas.clientLeft)*canvas.width/canvas.clientWidth,y:(event.clientY-box.top-canvas.clientTop)*canvas.height/canvas.clientHeight};
  setScroll(minimapCamera(point,v.data.world,v.viewport));render();
 };
 canvas.addEventListener('click',click);
 function render(){const {data,scroll,viewport}=getView();context.fillStyle='#263929';context.fillRect(0,0,canvas.width,canvas.height);
  const rectangle=(r:{x:number;y:number;width:number;height:number})=>{const p=worldToMinimap(r,data.world);context.fillRect(p.x,p.y,r.width/data.world.width*canvas.width,r.height/data.world.height*canvas.height);};
  context.fillStyle='#535d65';for(const r of data.terrain)rectangle(r);
  if(data.fog){const f=data.fog;for(let row=0;row<f.rows;row++)for(let col=0;col<f.columns;col++){const i=row*f.columns+col;if(f.visible[i])continue;context.fillStyle=f.explored[i]?'rgba(0,0,0,.55)':'#050805';rectangle({x:col*f.tileSize,y:row*f.tileSize,width:Math.min(f.tileSize,data.world.width-col*f.tileSize),height:Math.min(f.tileSize,data.world.height-row*f.tileSize)});}}
  for(const marker of data.markers){context.fillStyle=marker.color;if(marker.footprint)rectangle(marker.footprint);else{const p=worldToMinimap(marker.position,data.world);context.fillRect(p.x-2,p.y-2,4,4);}}
  const r=cameraIndicator(scroll,data.world,viewport);context.strokeStyle='#ffffff';context.lineWidth=1;context.strokeRect(r.x+.5,r.y+.5,Math.max(0,r.width-1),Math.max(0,r.height-1));
 }
 render();return {render,destroy:()=>canvas.removeEventListener('click',click)};
}
