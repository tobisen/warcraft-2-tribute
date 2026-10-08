import {baseDevelopment} from '../gameplay/baseUpgrade';
import type {MatchState} from '../gameplay/match';
export interface UpgradeMarker {id:string;x:number;y:number;label:string;color:string}
/** Pure presentation: actual completed levels only; never modifies geometry. */
export function buildingUpgradeMarkers(m:MatchState):UpgradeMarker[]{
 const level=baseDevelopment(m).level,label=['I','II','III'][level-1]!;
 const markers:UpgradeMarker[]=m.combat.baseHP>0?[{id:'base',x:m.gathering.base.x,y:m.gathering.base.y-48,label,color:'#f3d47a'}]:[];
 for(const b of m.placement.bases??[])if(b.hp>0&&b.construction.remainingSeconds===0)markers.push({id:b.id,x:b.footprint.x+b.footprint.width/2,y:b.footprint.y+b.footprint.height/2-48,label,color:'#f3d47a'});
 for(const t of m.placement.defenses??[])if(t.kind==='tower'&&t.hp>0&&t.construction.remainingSeconds===0)markers.push({id:t.id,x:t.footprint.x+16,y:t.footprint.y-28,label:t.level===1?'I':t.specialization==='air'?'II ↑ AIR':'II ◆ GROUND',color:t.level===2&&t.specialization==='air'?'#89dbea':'#f3d47a'});
 return markers;
}
