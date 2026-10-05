import {frontierGroves,type GroveId,type ForestCell} from '../config/referenceTerrain';
import type {ResourceNode,GatheringState} from './gathering';
import {replaceObstacles,type WorldMap} from './map';
import type {Footprint} from './placement';
const ranked=new Map<string,ForestCell[]>();
export function forestCells(node:Pick<ResourceNode,'grove'|'remaining'|'position'>):ForestCell[]{
 if(!node.grove||node.remaining<=0)return [];
 const grove=frontierGroves[node.grove],count=Math.ceil(grove.cells.length*Math.min(1,node.remaining/grove.stock)),key=`${node.grove}:${node.position.x},${node.position.y}`;
 let cells=ranked.get(key);if(!cells){cells=[...grove.cells].sort((a,b)=>Math.hypot((a.column+.5)*32-node.position.x,(a.row+.5)*32-node.position.y)-Math.hypot((b.column+.5)*32-node.position.x,(b.row+.5)*32-node.position.y)||a.row-b.row||a.column-b.column);ranked.set(key,cells);}return cells.slice(0,count);
}
export function forestRectangles(node:ResourceNode):Footprint[]{
 const cells=forestCells(node).sort((a,b)=>a.row-b.row||a.column-b.column),runs:Footprint[]=[];
 for(const c of cells){const last=runs.at(-1);if(last&&last.y===c.row*32&&last.x+last.width===c.column*32)last.width+=32;else runs.push({x:c.column*32,y:c.row*32,width:32,height:32});}return runs;
}
export function forestContains(node:ResourceNode,p:{x:number;y:number}):boolean{return forestCells(node).some(c=>p.x>=c.column*32&&p.x<(c.column+1)*32&&p.y>=c.row*32&&p.y<(c.row+1)*32);}
const nodes=(g:GatheringState)=>[g.node,...(g.extraNodes??[])].filter(n=>n.grove);
const bodies=(g:GatheringState)=>nodes(g).flatMap(n=>[...forestRectangles(n),...(n.remaining>0?[{x:n.position.x-20,y:n.position.y-20,width:40,height:40}]:[])]);
const key=(r:Footprint)=>`${r.x},${r.y},${r.width},${r.height}`;
/** Only when a crown disappears: one map revision wakes blocked routes; structures stay untouched. */
export function syncForestObstacles(before:GatheringState,after:GatheringState,map:WorldMap):WorldMap {
 if(!before.node.grove&&!before.extraNodes?.some(n=>n.grove))return map;
 if(nodes(before).every(n=>nodes(after).find(a=>a.id===n.id)?.remaining===n.remaining))return map;
 const old=bodies(before),next=bodies(after);if(old.map(key).join(';')===next.map(key).join(';'))return map;
 const removed=new Set(old.map(key));return replaceObstacles(map,[...map.obstacles.filter(r=>!removed.has(key(r))),...next]);
}
export const isGroveId=(value:unknown):value is GroveId=>value==='frontier-west'||value==='frontier-east';
export const forestCellKey=(grove:GroveId,c:ForestCell)=>`${grove}:${c.column},${c.row}`;
