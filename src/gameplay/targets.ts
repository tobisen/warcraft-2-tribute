import {targetDomain} from './domains';
import type {TargetDomain} from '../config/domains';
import type {NavyState} from './navy';
import {navyConfig} from '../config/navy';
import { combatConfig } from '../config/combat';
import { combatUnitStats, unitStats } from '../config/unit';
import { baseFootprint } from './buildingSelection';
import { unitBody } from './spawning';
import type { GatheringState } from './gathering';
import type { CombatState } from './combat';
import type { PlacementState, Footprint } from './placement';
export interface PlayerTarget {domain?:TargetDomain;id:string;kind:'wall'|'gate'|'tower'|'ship'|'harbor'|'soldier'|'worker'|'base'|'barracks'|'farm'|'forge';owner:'player';hp:number;footprint:Footprint}
export function playerTargets(g:GatheringState,c:CombatState,p?:PlacementState,navy?:NavyState):PlayerTarget[] {
  const targets:PlayerTarget[]=g.units.flatMap(u=>u.hp!==undefined&&u.hp>0 ? [{domain:targetDomain(u),id:u.id,kind:u.kind,owner:'player',hp:u.hp,
    footprint:unitBody(u.position,u.kind==='soldier'?combatUnitStats(u).size:unitStats.size)}]:[]);
  for(const ship of navy?.ships??[])if(ship.hp>0)targets.push({domain:'sea',id:ship.id,kind:'ship',owner:'player',hp:ship.hp,footprint:unitBody(ship.position,navyConfig.ship.size)});
  if(navy?.harbor&&navy.harbor.hp>0)targets.push({id:'harbor',kind:'harbor',owner:'player',hp:navy.harbor.hp,footprint:navy.harbor.footprint});
  for(const b of p?.bases??[])if(b.hp>0)targets.push({id:b.id,kind:'base',owner:'player',hp:b.hp,footprint:b.footprint});
  if(c.baseHP>0)targets.push({id:'base',kind:'base',owner:'player',hp:c.baseHP,footprint:baseFootprint(g.base)});
  if(p?.barracks&&(p.barracksHP??combatConfig.barracksHP)>0)targets.push({id:'barracks',kind:'barracks',owner:'player',hp:p.barracksHP??combatConfig.barracksHP,footprint:p.barracks});
  if(p?.forge&&p.forge.hp>0)targets.push({id:'forge',kind:'forge',owner:'player',hp:p.forge.hp,footprint:p.forge.footprint});
  for(const farm of p?.farms??[])if((farm.hp??combatConfig.farmHP)>0)targets.push({id:farm.id,kind:'farm',owner:'player',hp:farm.hp??combatConfig.farmHP,footprint:farm.footprint});
  for(const t of p?.defenses??[])if(t.hp>0)targets.push({id:t.id,kind:t.kind,owner:t.owner,hp:t.hp,footprint:t.footprint});
  return targets;
}
