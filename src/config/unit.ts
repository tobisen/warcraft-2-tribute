import { catapultConfig } from './catapult';
import { archerConfig } from './archer';
export const unitStats = {
  speed: 160,
  size: 24,
  color: 0x7bd389,
};

export const soldierStats = {
  speed: 160,
  size: 24,
  color: 0xf0a44b,
};

export function combatUnitStats(unit:{archetype?:'archer'|'catapult'}) {return unit.archetype==='catapult'?catapultConfig:unit.archetype==='archer'?archerConfig:soldierStats;}

export function rangedStats(unit:{archetype?:'archer'|'catapult'}){return unit.archetype==='catapult'?catapultConfig:unit.archetype==='archer'?archerConfig:null;}
