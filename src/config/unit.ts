import {factions,type FactionId} from './factions';
import {soldierStats,unitStats} from './unitDefaults';
export {soldierStats,unitStats} from './unitDefaults';
import {catapultConfig} from './catapult';
import {archerConfig} from './archer';
type CombatProfile={faction?:FactionId;archetype?:'archer'|'catapult'|'specialist'|'air'};
export function combatUnitStats(unit:CombatProfile,faction?:FactionId){
 const role=unit.archetype??'soldier',baseline=role==='catapult'?catapultConfig:role==='archer'?archerConfig:soldierStats;
 return {...baseline,...factions[faction??unit.faction??'crown'].units[role]};
}
export function rangedStats(unit:CombatProfile,faction?:FactionId){
 const role=unit.archetype??'soldier',profile=factions[faction??unit.faction??'crown'].units[role];
 if(role==='specialist'&&profile.combatMode!=='projectile'||role==='soldier')return null;
 const baseline=role==='catapult'?catapultConfig:archerConfig;
 return {...baseline,...profile} as typeof archerConfig|typeof catapultConfig;
}
export const workerStats=(faction:FactionId='crown')=>({...unitStats,...factions[faction].units.worker});

export const workerCombatConfig={damagePerSecond:2,range:16,targets:['land','building'] as const};
