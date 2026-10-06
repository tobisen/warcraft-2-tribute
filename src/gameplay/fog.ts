import { fogConfig } from '../config/fog';
import { footprintDistance } from './approach';
import {nearbyObstacles,type WorldMap} from './map';
import { segmentFits } from './navigation';
import type { Position } from './movement';
import type { Footprint } from './placement';
export type Team='player'|'enemy';
export interface VisionObserver {id:string;owner:Team;position:Position;airborne?:true;radius:number;footprint?:Footprint}
export interface FogTeam {visible:boolean[];explored:boolean[]}
export interface FogState {forest?:Record<Team,Record<string,boolean>>;width:number;height:number;tileSize:number;columns:number;rows:number;teams:Record<Team,FogTeam>}
export function createFog(world:{width:number;height:number},tileSize:number=fogConfig.tileSize):FogState {
 const columns=Math.ceil(world.width/tileSize),rows=Math.ceil(world.height/tileSize),team=()=>({visible:Array<boolean>(columns*rows).fill(false),explored:Array<boolean>(columns*rows).fill(false)});
 return {width:world.width,height:world.height,tileSize,columns,rows,teams:{player:team(),enemy:team()}};
}
export function fogIndex(fog:FogState,point:Position):number|null {
 if(!Number.isFinite(point.x)||!Number.isFinite(point.y)||point.x<0||point.y<0||point.x>=fog.width||point.y>=fog.height)return null;
 return Math.floor(point.y/fog.tileSize)*fog.columns+Math.floor(point.x/fog.tileSize);
}
export function isVisible(fog:FogState,team:Team,point:Position):boolean {const i=fogIndex(fog,point);return i!==null&&fog.teams[team].visible[i];}
export function isExplored(fog:FogState,team:Team,point:Position):boolean {const i=fogIndex(fog,point);return i!==null&&fog.teams[team].explored[i];}
/** Rock containing the viewed cell does not hide itself; rock before that cell blocks vision. */
export function visionLine(fog:FogState,from:Position,to:Position,blockers:readonly Footprint[]):boolean {
 const map:WorldMap={width:fog.width,height:fog.height,tileSize:fog.tileSize,revision:0,obstacles:blockers as Footprint[]};
 const obstacles=nearbyObstacles(map,{x:Math.min(from.x,to.x),y:Math.min(from.y,to.y),width:Math.abs(to.x-from.x),height:Math.abs(to.y-from.y)}).filter(r=>!(to.x>=r.x&&to.x<r.x+r.width&&to.y>=r.y&&to.y<r.y+r.height));
 return segmentFits({...map,obstacles,linearCollision:true},from,to,0);
}
const emptyBlockers:readonly Footprint[]=[];
const observerCache=new WeakMap<readonly Footprint[],{length:number;masks:Map<string,{key:string;memo:Int8Array}>}>();
/** Exact observer/terrain LOS results are reused; union-covered cells need no separate ray or update. */
export function updateFog(fog:FogState,observers:readonly VisionObserver[],blockers:readonly Footprint[]=emptyBlockers):FogState {
 const next={...fog,teams:{player:{visible:Array<boolean>(fog.columns*fog.rows).fill(false),explored:fog.teams.player.explored},enemy:{visible:Array<boolean>(fog.columns*fog.rows).fill(false),explored:fog.teams.enemy.explored}}};
 let cache=observerCache.get(blockers);if(!cache||cache.length!==blockers.length){cache={length:blockers.length,masks:new Map()};observerCache.set(blockers,cache);}
 for(const o of observers){
  const rect=o.footprint??{...o.position,width:0,height:0},id=`${o.owner}:${o.id}`;
  const key=`${fog.width}:${fog.height}:${fog.tileSize}:${o.position.x}:${o.position.y}:${o.radius}:${o.airborne}:${rect.x}:${rect.y}:${rect.width}:${rect.height}`;
  const minCol=Math.max(0,Math.floor((rect.x-o.radius)/fog.tileSize)),maxCol=Math.min(fog.columns-1,Math.floor((rect.x+rect.width+o.radius)/fog.tileSize));
  const minRow=Math.max(0,Math.floor((rect.y-o.radius)/fog.tileSize)),maxRow=Math.min(fog.rows-1,Math.floor((rect.y+rect.height+o.radius)/fog.tileSize)),columns=maxCol-minCol+1;
  let mask=cache.masks.get(id);
  if(!mask||mask.key!==key){mask={key,memo:new Int8Array(Math.max(0,columns*(maxRow-minRow+1)))};if(cache.masks.size>=256&&!cache.masks.has(id))cache.masks.delete(cache.masks.keys().next().value!);cache.masks.set(id,mask);}
  const team=next.teams[o.owner];
  for(let row=minRow;row<=maxRow;row++)for(let col=minCol;col<=maxCol;col++){
   const i=row*fog.columns+col;if(team.visible[i])continue;
   const memoIndex=(row-minRow)*columns+col-minCol;let result=mask.memo[memoIndex];
   if(!result){const x=col*fog.tileSize,y=row*fog.tileSize,point={x:x+Math.min(fog.tileSize,fog.width-x)/2,y:y+Math.min(fog.tileSize,fog.height-y)/2};result=footprintDistance(point,rect)<=o.radius+1e-9&&(o.airborne||visionLine(fog,o.position,point,blockers))?1:2;mask.memo[memoIndex]=result;}
   if(result!==1)continue;team.visible[i]=true;if(!team.explored[i]){if(team.explored===fog.teams[o.owner].explored)team.explored=[...team.explored];team.explored[i]=true;}
  }
 }
 return next;
}
