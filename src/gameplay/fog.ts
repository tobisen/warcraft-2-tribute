import { fogConfig } from '../config/fog';
import { footprintDistance } from './approach';
import { segmentFits } from './navigation';
import type { Position } from './movement';
import type { Footprint } from './placement';
export type Team='player'|'enemy';
export interface VisionObserver {id:string;owner:Team;position:Position;radius:number;footprint?:Footprint}
export interface FogTeam {visible:boolean[];explored:boolean[]}
export interface FogState {width:number;height:number;tileSize:number;columns:number;rows:number;teams:Record<Team,FogTeam>}
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
 const obstacles=blockers.filter(r=>!(to.x>=r.x&&to.x<r.x+r.width&&to.y>=r.y&&to.y<r.y+r.height));
 return segmentFits({width:fog.width,height:fog.height,tileSize:fog.tileSize,revision:0,obstacles},from,to,0);
}
export function updateFog(fog:FogState,observers:readonly VisionObserver[],blockers:readonly Footprint[]=[]):FogState {
 const next={...fog,teams:{player:{visible:Array<boolean>(fog.columns*fog.rows).fill(false),explored:[...fog.teams.player.explored]},enemy:{visible:Array<boolean>(fog.columns*fog.rows).fill(false),explored:[...fog.teams.enemy.explored]}}};
 for(const o of observers){
  const rect=o.footprint??{...o.position,width:0,height:0};
  const minCol=Math.max(0,Math.floor((rect.x-o.radius)/fog.tileSize)),maxCol=Math.min(fog.columns-1,Math.floor((rect.x+rect.width+o.radius)/fog.tileSize));
  const minRow=Math.max(0,Math.floor((rect.y-o.radius)/fog.tileSize)),maxRow=Math.min(fog.rows-1,Math.floor((rect.y+rect.height+o.radius)/fog.tileSize));
  for(let row=minRow;row<=maxRow;row++)for(let col=minCol;col<=maxCol;col++){
   const x=col*fog.tileSize,y=row*fog.tileSize,point={x:x+Math.min(fog.tileSize,fog.width-x)/2,y:y+Math.min(fog.tileSize,fog.height-y)/2};
   if(footprintDistance(point,rect)>o.radius+1e-9||!visionLine(fog,o.position,point,blockers))continue;
   const i=row*fog.columns+col;next.teams[o.owner].visible[i]=true;next.teams[o.owner].explored[i]=true;
  }
 }
 return next;
}
