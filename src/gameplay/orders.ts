import type { Unit } from './gathering';
/** Clear every continuing order/route while retaining cargo, selection and HP. */
export function stopSelected(units:Unit[], playing:boolean):Unit[] {
  if (!playing) return units;
  return units.map(unit=>unit.selected ? {...unit,scouting:undefined,commandMode:undefined,orderQueue:undefined,...(unit.kind==='soldier'?{attackMoveTarget:undefined,autoOrigin:undefined,autoDisabled:true}:{}),order:{kind:'idle'},target:{...unit.position},navigation:undefined} : unit);
}
