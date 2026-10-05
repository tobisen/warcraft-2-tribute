import {frontierGroves} from '../config/referenceTerrain';
import {createMap,bodyFits,type WorldMap} from '../gameplay/map';
import type {Position} from '../gameplay/movement';
import {terrainDetails} from './assets';
export interface Habitat {id:string;type:'deer'|'rabbit'|'fox';home:Position;phase:number}
/** Immutable habitats, capped even on the largest map. Animals never enter gameplay occupancy/vision. */
export function wildlifeHabitats(map:WorldMap):Habitat[]{
 const habitatMap=createMap(map.id,map.terrainLayout),homes:Habitat[]=[],candidates=[[11,10],[18,12],[10,8]];
 for(let row=2;row<map.height/map.tileSize-2;row++)for(let column=2;column<map.width/map.tileSize-2;column++)if(((Math.imul(column+7,73856093)^Math.imul(row+19,19349663))>>>0)%97===0)candidates.push([column,row]);
 for(const [column,row]of candidates){const home={x:(column+.5)*map.tileSize,y:(row+.5)*map.tileSize};if(homes.length>=48)break;
  if(map.terrainLayout==='reference'&&Object.values(frontierGroves).some(g=>g.cells.some(c=>Math.abs(home.x-(c.column+.5)*32)<41&&Math.abs(home.y-(c.row+.5)*32)<41)))continue;
  if(!bodyFits(habitatMap,home,25)||Math.hypot(home.x-400,home.y-450)<105||terrainDetails(column,row,map.id).some(d=>d.startsWith('road')))continue;
  const index=homes.length;homes.push({id:`wildlife-${column}-${row}`,type:(['deer','rabbit','fox'] as const)[index%3],home,phase:index*.71});
 }
 return homes;
}
/** Pure absolute-time wander: Save's existing elapsedSeconds reproduces positions/frames exactly. */
export function wildlifePose(h:Habitat,seconds:number){
 const t=Math.max(0,Number.isFinite(seconds)?seconds:0)+h.phase,cycle=t%12,walking=cycle>=4&&cycle<10;
 const amount=cycle<4?0:cycle<7?(cycle-4)/3:cycle<10?(10-cycle)/3:0;
 const angle=(h.phase*2.3+Math.floor(t/12)*2.4),dx=Math.cos(angle)*18,dy=Math.sin(angle)*12;
 return {id:h.id,position:{x:h.home.x+amount*dx,y:h.home.y+amount*dy},flipX:(cycle>=7?-dx:dx)<0,frame:`critter-${h.type}-${walking?'walk':'idle'}-${walking?Math.floor(t*6)%4:Math.floor(t*.5)%2}`,action:walking?'walk':'idle'};
}
export function visibleWildlife(homes:readonly Habitat[],seconds:number,map:WorldMap,seen:(p:Position)=>boolean){
 return homes.map(h=>wildlifePose(h,seconds)).filter(p=>bodyFits(map,p.position,10)&&seen(p.position));
}
/** Environment props: never blockers, resources, minimap markers, click targets or vision observers. */
export function wildlifeDetails(column:number,row:number,map:WorldMap):string|undefined{
 const home={x:(column+.5)*map.tileSize,y:(row+.5)*map.tileSize};if(!bodyFits(map,home,12)||terrainDetails(column,row,map.id).some(d=>d.startsWith('road')))return;
 const hash=(Math.imul(column+13,73856093)^Math.imul(row+17,19349663))>>>0;
 return hash%137===0?'detail-log':hash%113===0?'detail-mushrooms':hash%79===0?'detail-reeds':undefined;
}
