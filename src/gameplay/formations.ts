import {navigationConfig} from '../config/navigation';
import type {Position} from './movement';
import type {WorldMap} from './map';
import {bodyFits,worldTile} from './map';
import {findFormationRoute,planRoute,type RouteState} from './navigation';
export interface FormationMember {id:string;position:Position;half:number;domain:'land'|'water'|'air';map:WorldMap;commandNumber:number}
export function formationCandidates(destination:Position,spacing=navigationConfig.groupSpacing,radius=navigationConfig.groupRadius):Position[]{
 const points:{point:Position;distance:number;row:number;column:number}[]=[];
 for(let row=-radius;row<=radius;row++)for(let column=-radius;column<=radius;column++)points.push({point:{x:destination.x+column*spacing,y:destination.y+row*spacing},distance:row*row+column*column,row,column});
 return points.sort((a,b)=>a.distance-b.distance||a.row-b.row||a.column-b.column).map(p=>p.point);
}
/** Stable assignments on command only. Existing traffic/separation handles narrow passages en route. */
export function allocateFormation(members:readonly FormationMember[],destination:Position):Map<string,RouteState>{
 const result=new Map<string,RouteState>(),placed:{point:Position;half:number;domain:string}[]=[];
 const sorted=[...members].sort((a,b)=>b.half-a.half||a.id.localeCompare(b.id,'en',{numeric:true}));
 const spacing=Math.max(navigationConfig.groupSpacing,...members.map(u=>u.half*2+4));
 const radius=Math.min(8,Math.max(navigationConfig.groupRadius,Math.ceil(Math.sqrt(members.length))));
 const points=formationCandidates(destination,spacing,radius);
 for(const member of sorted){
  if(!worldTile(member.map,destination)){result.set(member.id,planRoute({...member.map,bodyHalf:member.half},member.position,destination,member.commandNumber));continue;}
  const candidates=points.filter(point=>bodyFits(member.map,point,member.half)&&!placed.some(p=>p.domain===member.domain&&Math.abs(p.point.x-point.x)<p.half+member.half+2&&Math.abs(p.point.y-point.y)<p.half+member.half+2));
  const route=findFormationRoute(member.map,member.position,candidates,member.half);
  if(route){placed.push({point:route.destination,half:member.half,domain:member.domain});result.set(member.id,{commandNumber:member.commandNumber,destination:{...route.destination},waypoints:route.waypoints,revision:member.map.revision,status:route.waypoints.length?'moving':'arrived'});}
  else result.set(member.id,{commandNumber:member.commandNumber,destination:{...member.position},waypoints:[],revision:member.map.revision,status:'blocked',error:'no-space'});
 }
 return result;
}
