import { combatConfig } from '../config/combat';
import { combatUnitStats, unitStats } from '../config/unit';
import { baseFootprint } from './buildingSelection';
import { unitBody } from './spawning';
import type { GatheringState } from './gathering';
import type { CombatState } from './combat';
import type { PlacementState, Footprint } from './placement';
export interface PlayerTarget {id:string;kind:'soldier'|'worker'|'base'|'barracks'|'farm'|'forge';owner:'player';hp:number;footprint:Footprint}
export function playerTargets(g:GatheringState,c:CombatState,p?:PlacementState):PlayerTarget[] {
  const targets:PlayerTarget[]=g.units.flatMap(u=>u.hp!==undefined&&u.hp>0 ? [{id:u.id,kind:u.kind,owner:'player',hp:u.hp,
    footprint:unitBody(u.position,u.kind==='soldier'?combatUnitStats(u).size:unitStats.size)}]:[]);
  if(c.baseHP>0)targets.push({id:'base',kind:'base',owner:'player',hp:c.baseHP,footprint:baseFootprint(g.base)});
  if(p?.barracks&&(p.barracksHP??combatConfig.barracksHP)>0)targets.push({id:'barracks',kind:'barracks',owner:'player',hp:p.barracksHP??combatConfig.barracksHP,footprint:p.barracks});
  if(p?.forge&&p.forge.hp>0)targets.push({id:'forge',kind:'forge',owner:'player',hp:p.forge.hp,footprint:p.forge.footprint});
  for(const farm of p?.farms??[])if((farm.hp??combatConfig.farmHP)>0)targets.push({id:farm.id,kind:'farm',owner:'player',hp:farm.hp??combatConfig.farmHP,footprint:farm.footprint});
  return targets;
}
