import type {Position} from './movement';
import type {MatchState} from './match';
import {placeTower,towerPlacementError} from './towers';
/** A connected grid line, bounded by the existing 32-fortification cap. */
export function wallLine(start:Position,end:Position):Position[]{
 let x=Math.floor(start.x/32),y=Math.floor(start.y/32);
 const tx=Math.floor(end.x/32),ty=Math.floor(end.y/32),dx=Math.abs(tx-x),dy=Math.abs(ty-y),sx=Math.sign(tx-x),sy=Math.sign(ty-y);
 const points:Position[]=[];let ix=0,iy=0;
 while(points.length<32){points.push({x:x*32,y:y*32});if(x===tx&&y===ty)break;
  if(x!==tx&&(y===ty||(1+2*ix)*dy<=(1+2*iy)*dx)){x+=sx;ix++;}else{y+=sy;iy++;}
 }
 return points;
}
/** Pay and validate each segment against preceding sites. Stop at the first rejected site. */
export function placeWallLine(m:MatchState,points:Position[]){
 if(!m.placement.active||m.placement.kind!=='wall')return {match:m,count:0,reason:null};
 let next=m,first:MatchState|undefined,count=0,reason:string|null=null;
 const ids=new Set<string>();
 for(const p of points.slice(0,32)){
  const active={...next,placement:{...next.placement,active:true,kind:'wall' as const}};
  reason=towerPlacementError(active,p);if(reason)break;
  const placed=placeTower(active,p);if(!first)first=placed;next=placed;count++;ids.add(placed.placement.defenses!.at(-1)!.id);
 }
 if(first){const worker=first.gathering.units.find(u=>u.kind==='worker'&&u.order.kind==='build'&&ids.has(u.order.buildingId))!;
  next={...next,gathering:{...next.gathering,units:next.gathering.units.map(u=>u.id===worker.id?worker:u)},placement:{...next.placement,defenses:next.placement.defenses!.map(t=>ids.has(t.id)?{...t,construction:{...t.construction,builderId:worker.id}}:t)}};
 }
 return {match:next,count,reason};
}
