import {organicTerrain,organicWorld,type TerrainDesign} from '../config/organicTerrain';
import {expandedWorld,extensionTerrain} from '../config/mapExtensions';
import {mapExtensionTerrain,maps,type MapId,type TerrainPatch} from '../config/maps';
import { arenaConfig } from '../config/arena';
import { worldConfig } from '../config/buildings';
import type { Position } from './movement';
import type { Footprint } from './placement';

export interface Tile { column: number; row: number }
export interface WorldMap {
  ignoreAttackOcclusion?:boolean;enemyPassageBlocks?:Footprint[];bodyHalf?:number;
  linearCollision?:true;
  interactionTarget?:Footprint;
  design?:TerrainDesign;
  worldLayout?:'expanded';
  resourceLayout?:'trees';
  terrainLayout?:'reference'|'legacy';
  id?:MapId;
  width: number; height: number; tileSize: number;
  revision: number;
  obstacles: Footprint[];
}

const terrainCache=new Map<string,readonly TerrainPatch[]>();
export function terrainPatches(map:Pick<WorldMap,'id'|'terrainLayout'|'worldLayout'|'design'>):readonly TerrainPatch[]{const id=map.id??'arena',key=`${id}:${map.terrainLayout}:${map.worldLayout}:${map.design}`,cached=terrainCache.get(key);if(cached)return cached;if(map.design){const patches=organicTerrain(id,map.design);terrainCache.set(key,patches);return patches;}const m=maps[id],base=map.terrainLayout==='reference'?m.referenceTerrain??(id==='forest'?m.terrain.filter(p=>!(p.kind==='rock'&&p.column===5&&p.row===4)):m.terrain):m.terrain;const patches=map.worldLayout==='expanded'?[...base,...mapExtensionTerrain(id)]:base;terrainCache.set(key,patches);return patches;}
export function createMap(id:MapId='arena',layout?:WorldMap['terrainLayout'],resources:'trees'|'groves'='trees',world:'expanded'|'original'='expanded',design?:TerrainDesign): WorldMap {
 const terrainLayout=layout??'reference',worldLayout=world==='expanded'&&terrainLayout==='reference'&&resources==='trees'?'expanded' as const:undefined;
 return {id,...(design?{design}:{}),...(worldLayout?{worldLayout}:{}),...(terrainLayout==='reference'&&resources==='trees'?{resourceLayout:'trees' as const}:{}),terrainLayout,...(design?organicWorld(id):worldLayout?expandedWorld:maps[id].world??worldConfig),tileSize:arenaConfig.tileSize,revision:0,
  obstacles:terrainPatches({id,terrainLayout,worldLayout,design}).map(p=>({x:p.column*32,y:p.row*32,width:p.columns*32,height:p.rows*32}))};
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

const collisionIndex=new WeakMap<Footprint[],{revision:number;length:number;cells:Map<string,Footprint[]>}>();
/** Shared spatial lookup for immutable obstacle snapshots; initialization push is detected by length. */
export function nearbyObstacles(map:WorldMap,area:Footprint):readonly Footprint[]{
 const left=Math.floor(area.x/32),top=Math.floor(area.y/32),right=Math.floor((area.x+area.width)/32),bottom=Math.floor((area.y+area.height)/32);
 const skip=(obstacles:readonly Footprint[])=>map.interactionTarget?obstacles.filter(o=>{const t=map.interactionTarget!;return o.x!==t.x||o.y!==t.y||o.width!==t.width||o.height!==t.height;}):obstacles;
 if(map.linearCollision||map.obstacles.length<32||(right-left+1)*(bottom-top+1)>map.obstacles.length*2)return skip(map.obstacles);
 let index=collisionIndex.get(map.obstacles);if(!index||index.revision!==map.revision||index.length!==map.obstacles.length){const cells=new Map<string,Footprint[]>();for(const o of map.obstacles)for(let r=Math.floor(o.y/32);r<=Math.floor((o.y+o.height)/32);r++)for(let c=Math.floor(o.x/32);c<=Math.floor((o.x+o.width)/32);c++){const key=`${c},${r}`,list=cells.get(key)??[];list.push(o);cells.set(key,list);}index={revision:map.revision,length:map.obstacles.length,cells};collisionIndex.set(map.obstacles,index);}
 const result=new Set<Footprint>();for(let r=top;r<=bottom;r++)for(let c=left;c<=right;c++)for(const o of index.cells.get(`${c},${r}`)??[])result.add(o);return skip([...result]);
}
export function bodyFits(map: WorldMap, point: Position, halfSize = 0): boolean {
  if (!worldTile(map, point) || halfSize < 0 || !Number.isFinite(halfSize)) return false;
  const body = { x: point.x - halfSize, y: point.y - halfSize, width: halfSize * 2, height: halfSize * 2 };
  if (body.x < 0 || body.y < 0 || point.x + halfSize > map.width || point.y + halfSize > map.height) return false;
  return !nearbyObstacles(map,body).some(o => halfSize === 0
    ? point.x >= o.x && point.x < o.x + o.width && point.y >= o.y && point.y < o.y + o.height
    : overlaps(body, o));
}

/** Immutable obstacle replacement; revision invalidates routes in subsequent slices. */
export function replaceObstacles(map: WorldMap, obstacles: Footprint[]): WorldMap {
  return { ...map, revision: map.revision + 1, obstacles: obstacles.map(o => ({ ...o })) };
}

/** Open own gates remain impassable to the opposing team. */
export function enemyNavigationMap(map:WorldMap):WorldMap{return map.enemyPassageBlocks?.length?{...map,enemyPassageBlocks:undefined,obstacles:[...map.obstacles,...map.enemyPassageBlocks]}:map;}
