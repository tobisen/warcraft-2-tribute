import type { Position } from '../gameplay/movement';

interface Bounds { width: number; height: number }
export interface CameraDrag { screen: Position; scroll: Position }
/** Fixed zoom, one canvas pixel per world pixel. Independent of DOM page position. */
export function clampCamera(scroll: Position, world: Bounds, viewport: Bounds): Position {
  return { x: Math.max(0, Math.min(scroll.x, Math.max(0, world.width - viewport.width))),
    y: Math.max(0, Math.min(scroll.y, Math.max(0, world.height - viewport.height))) };
}
export function dragCamera(drag: CameraDrag, screen: Position, world: Bounds, viewport: Bounds): Position {
  return clampCamera({ x: drag.scroll.x + drag.screen.x - screen.x,
    y: drag.scroll.y + drag.screen.y - screen.y }, world, viewport);
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
