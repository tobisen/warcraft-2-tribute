import type { Unit } from './gathering';
import { commandGroupMove } from './groupMovement';
import type { WorldMap } from './map';
import type { Position } from './movement';
/** Workers keep their work; only selected soldiers receive distinct group goals. */
export function commandAttackMove(units:Unit[],destination:Position,map:WorldMap,playing=true):Unit[] {
  if(!playing)return units;
  const soldiers=units.filter(u=>u.kind==='soldier');
  const moved=new Map(commandGroupMove(soldiers,destination,map).map(u=>[u.id,u]));
  return units.map(u=>{
    if(u.kind!=='soldier'||!u.selected)return u;
    const next=moved.get(u.id)!;
    return {...next,attackMoveTarget:next.navigation?.status==='moving'?{...next.target}:undefined};
  });
}
