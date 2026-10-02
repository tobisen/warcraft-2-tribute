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
