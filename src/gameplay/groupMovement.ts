import {movementMap,isAir} from './domains';
import {combatUnitStats,workerStats} from '../config/unit';
import type {Unit} from './gathering';
import type {WorldMap} from './map';
import type {Position} from './movement';
import {allocateFormation,formationCandidates} from './formations';
export const groupCandidates=formationCandidates;
export function commandGroupMove(units:Unit[],destination:Position,map:WorldMap):Unit[]{
 const result=allocateFormation(units.filter(u=>u.selected).map(u=>({id:u.id,position:u.position,half:(u.kind==='worker'?workerStats():combatUnitStats(u)).size/2,domain:isAir(u)?'air':'land',map:movementMap(map,u),commandNumber:(u.navigation?.commandNumber??0)+1})),destination);
 return units.map(unit=>{const navigation=result.get(unit.id);if(!navigation)return unit;return {...unit,commandMode:undefined,orderQueue:undefined,...(unit.kind==='soldier'?{attackMoveTarget:undefined,autoOrigin:undefined,autoDisabled:false}:{}),navigation,target:{...navigation.destination},order:{kind:navigation.status==='moving'?'move':'idle'}};});
}
