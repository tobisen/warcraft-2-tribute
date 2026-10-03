import {maps} from '../config/maps';
import {factions,defaultFactions} from '../config/factions';
import {abilityConfig} from '../config/abilities';
import {difficultyProfiles} from '../config/difficulty';
import {scenarioConfig} from '../config/scenarios';
import type {MatchOptions} from '../gameplay/session';
const difficultyDescription={easy:'Lägre fiendetryck och senare anfall.',normal:'Normalt fiendetryck och anfallstakt.',hard:'Högre fiendetryck och tidigare, större anfall.'};
export function matchSettingsSummary(o:MatchOptions):string {
 const map=maps[o.map],faction=factions[o.faction??defaultFactions.player],ability=abilityConfig[faction.id];
 return `${scenarioConfig[o.scenario].label} · ${map.label} · ${faction.label} · ${difficultyProfiles[o.difficulty].label}. Resurser: ${map.wood} wood / ${map.gold} gold. ${ability.label}: ${ability.description}. ${difficultyDescription[o.difficulty]}`;
}
