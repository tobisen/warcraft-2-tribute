import {movementMap,isAir} from './domains';
import { combatUnitStats,unitStats } from '../config/unit';
import { navigationConfig } from '../config/navigation';
import type { Unit } from './gathering';
import { bodyFits, worldTile, type WorldMap } from './map';
import { findRoute, planRoute, type RouteState } from './navigation';
import type { Position } from './movement';

export function groupCandidates(destination: Position): Position[] {
  const points: {point:Position;distance:number;row:number;column:number}[]=[];
  const radius=navigationConfig.groupRadius;
  for(let row=-radius;row<=radius;row++)for(let column=-radius;column<=radius;column++) {
    points.push({point:{x:destination.x+column*navigationConfig.groupSpacing,
      y:destination.y+row*navigationConfig.groupSpacing},distance:row*row+column*column,row,column});
  }
  return points.sort((a,b)=>a.distance-b.distance || a.row-b.row || a.column-b.column).map(p=>p.point);
}

export function commandGroupMove(units: Unit[], destination: Position, map: WorldMap): Unit[] {
  const result=new Map<string,RouteState>();
  const selected=units.filter(u=>u.selected).sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}));
  const used=new Set<string>();
  const validClick=worldTile(map,destination)!==null && bodyFits(map,destination,navigationConfig.halfBody);
  const candidates=validClick?groupCandidates(destination).filter(p=>bodyFits(map,p,navigationConfig.halfBody)):[];
  for(const unit of selected) {
    const unitMap={...movementMap(map,unit),bodyHalf:(unit.kind==='worker'?unitStats:combatUnitStats(unit)).size/2};
    const number=(unit.navigation?.commandNumber??0)+1;
    const unitClick=isAir(unit)?bodyFits(unitMap,destination,unitMap.bodyHalf):validClick;
    const unitCandidates=isAir(unit)&&unitClick?groupCandidates(destination).filter(p=>bodyFits(unitMap,p,unitMap.bodyHalf)):candidates;
    if(!unitClick&&isAir(unit))continue;
    if(!unitClick){result.set(unit.id,planRoute(unitMap,unit.position,destination,number));continue;}
    let allocated=false;
    for(const point of unitCandidates) {
      if(!bodyFits(unitMap,point,unitMap.bodyHalf))continue;
      const key=`${isAir(unit)?'air':'land'}:${point.x}:${point.y}`;
      if(used.has(key))continue;
      const route=findRoute(unitMap,unit.position,point);if(!route.ok)continue;
      result.set(unit.id,{commandNumber:number,destination:{...point},waypoints:route.waypoints,
        revision:map.revision,status:route.waypoints.length?'moving':'arrived'});
      used.add(key);allocated=true;break;
    }
    if(!allocated)result.set(unit.id,{commandNumber:number,destination:{...destination},waypoints:[],
      revision:map.revision,status:'blocked',error:'no-space'});
  }
  return units.map(unit=>{
    const navigation=result.get(unit.id);if(!navigation)return unit;
    return {...unit,...(unit.kind==='soldier'?{attackMoveTarget:undefined,autoOrigin:undefined,autoDisabled:false}:{}),navigation,target:{...navigation.destination},
      order:{kind:navigation.status==='moving'?'move':'idle'}};
  });
}
