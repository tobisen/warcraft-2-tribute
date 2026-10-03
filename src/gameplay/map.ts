import {maps,type MapId} from '../config/maps';
import { arenaConfig } from '../config/arena';
import { worldConfig } from '../config/buildings';
import type { Position } from './movement';
import type { Footprint } from './placement';

export interface Tile { column: number; row: number }
export interface WorldMap {
  bodyHalf?:number;
  id?:MapId;
  width: number; height: number; tileSize: number;
  revision: number;
  obstacles: Footprint[];
}

export function createMap(id:MapId='arena'): WorldMap {
  return {id, ...(maps[id].world??worldConfig), tileSize: arenaConfig.tileSize, revision: 0,
    obstacles: maps[id].terrain.map(p => ({ x: p.column * arenaConfig.tileSize,
      y: p.row * arenaConfig.tileSize, width: p.columns * arenaConfig.tileSize,
      height: p.rows * arenaConfig.tileSize })) };
}

export function worldTile(map: WorldMap, point: Position): Tile | null {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y) || point.x < 0 || point.y < 0
    || point.x >= map.width || point.y >= map.height) return null;
  return { column: Math.floor(point.x / map.tileSize), row: Math.floor(point.y / map.tileSize) };
}

/** The last row/column is clipped to world bounds, never padded outside the world. */
export function tileFootprint(map: WorldMap, tile: Tile): Footprint | null {
  if (!Number.isInteger(tile.column) || !Number.isInteger(tile.row) || tile.column < 0 || tile.row < 0
    || tile.column >= Math.ceil(map.width / map.tileSize) || tile.row >= Math.ceil(map.height / map.tileSize)) return null;
  const x = tile.column * map.tileSize, y = tile.row * map.tileSize;
  return { x, y, width: Math.min(map.tileSize, map.width - x), height: Math.min(map.tileSize, map.height - y) };
}

export function tileCenter(map: WorldMap, tile: Tile): Position | null {
  const rect = tileFootprint(map, tile);
  return rect ? { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 } : null;
}

export function overlaps(a: Footprint, b: Footprint): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function blockedTile(map: WorldMap, tile: Tile): boolean {
  const rect = tileFootprint(map, tile);
  return !rect || map.obstacles.some(obstacle => overlaps(rect, obstacle));
}

export function bodyFits(map: WorldMap, point: Position, halfSize = 0): boolean {
  if (!worldTile(map, point) || halfSize < 0 || !Number.isFinite(halfSize)) return false;
  const body = { x: point.x - halfSize, y: point.y - halfSize, width: halfSize * 2, height: halfSize * 2 };
  if (body.x < 0 || body.y < 0 || point.x + halfSize > map.width || point.y + halfSize > map.height) return false;
  return !map.obstacles.some(o => halfSize === 0
    ? point.x >= o.x && point.x < o.x + o.width && point.y >= o.y && point.y < o.y + o.height
    : overlaps(body, o));
}

/** Immutable obstacle replacement; revision invalidates routes in subsequent slices. */
export function replaceObstacles(map: WorldMap, obstacles: Footprint[]): WorldMap {
  return { ...map, revision: map.revision + 1, obstacles: obstacles.map(o => ({ ...o })) };
}
