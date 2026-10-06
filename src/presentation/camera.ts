import type { Position } from '../gameplay/movement';
import {cameraZoomConfig} from '../config/camera';

interface Bounds { width: number; height: number }
export interface CameraDrag { screen: Position; scroll: Position }
/** Scroll here means the top-left of the visible world, independent of Phaser's camera origin. */
export function clampCamera(scroll: Position, world: Bounds, viewport: Bounds): Position {
  return { x: Math.max(0, Math.min(scroll.x, Math.max(0, world.width - viewport.width))),
    y: Math.max(0, Math.min(scroll.y, Math.max(0, world.height - viewport.height))) };
}
export function dragCamera(drag: CameraDrag, screen: Position, world: Bounds, viewport: Bounds,zoom=1): Position {
  return clampCamera({ x: drag.scroll.x + (drag.screen.x - screen.x)/zoom,
    y: drag.scroll.y + (drag.screen.y - screen.y)/zoom }, world, {width:viewport.width/zoom,height:viewport.height/zoom});
}
export function visibleCamera(scroll:Position,viewport:Bounds,zoom:number) {
 return {x:scroll.x+viewport.width/2-viewport.width/(2*zoom),y:scroll.y+viewport.height/2-viewport.height/(2*zoom),width:viewport.width/zoom,height:viewport.height/zoom};
}
export function cameraScroll(visible:Position,viewport:Bounds,zoom:number):Position {
 return {x:visible.x-viewport.width/2+viewport.width/(2*zoom),y:visible.y-viewport.height/2+viewport.height/(2*zoom)};
}
/** Keep the same world point under the pointer unless the world edge requires clamping. */
export function zoomCamera(scroll:Position,point:Position,world:Bounds,viewport:Bounds,zoom:number,delta:number) {
 const next=Math.max(cameraZoomConfig.min,Math.min(cameraZoomConfig.max,zoom*Math.exp(-Math.max(-500,Math.min(500,delta))*cameraZoomConfig.wheelSensitivity)));
 return {zoom:next,scroll:clampCamera({x:scroll.x+point.x/zoom-point.x/next,y:scroll.y+point.y/zoom-point.y/next},world,{width:viewport.width/next,height:viewport.height/next})};
}
export function screenToWorld(point: Position, scroll: Position): Position {
  return { x: point.x + scroll.x, y: point.y + scroll.y };
}
/** Keyboard wins over edge hover; normalized diagonals retain configured speed. */
export function cameraDirection(keys:readonly string[],pointer:Position|null,viewport:Bounds,edgePixels:number):Position {
 const arrows=keys.filter(k=>['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(k));let x=0,y=0;
 if(arrows.length){x=Number(arrows.includes('ArrowRight'))-Number(arrows.includes('ArrowLeft'));y=Number(arrows.includes('ArrowDown'))-Number(arrows.includes('ArrowUp'));}
 else if(pointer&&pointer.x>=0&&pointer.y>=0&&pointer.x<viewport.width&&pointer.y<viewport.height){x=pointer.x<edgePixels?-1:pointer.x>=viewport.width-edgePixels?1:0;y=pointer.y<edgePixels?-1:pointer.y>=viewport.height-edgePixels?1:0;}
 const length=Math.hypot(x,y);return length?{x:x/length,y:y/length}:{x:0,y:0};
}
export function panCamera(scroll:Position,direction:Position,world:Bounds,viewport:Bounds,seconds:number,speed:number):Position {
 return clampCamera({x:scroll.x+direction.x*Math.max(0,seconds)*speed,y:scroll.y+direction.y*Math.max(0,seconds)*speed},world,viewport);
}
