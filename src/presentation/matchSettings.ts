import {text as uiText} from '../text';
import {maps,mapResourceTotals} from '../config/maps';
import {factions,defaultFactions} from '../config/factions';
import {abilityConfig} from '../config/abilities';
import {difficultyProfiles} from '../config/difficulty';
import {scenarioConfig} from '../config/scenarios';
import type {MatchOptions} from '../gameplay/session';
export const difficultyDescription={beginner:'Long preparation, smaller attacks, slower enemy training and a smaller enemy army. Combat stats and game speed stay equal.',easy:uiText.lowerEnemyPressureAndLaterAttacks,normal:uiText.standardEnemyPressureAndAttackTiming,hard:uiText.higherEnemyPressureWithEarlierLargerAttacks};
export function matchSettingsSummary(o:MatchOptions):string {
 const totals=mapResourceTotals(o.map),map=maps[o.map],faction=factions[o.faction??defaultFactions.player],ability=abilityConfig[faction.id];
 return `${scenarioConfig[o.scenario].label} · ${map.label} · ${faction.label} · ${difficultyProfiles[o.difficulty].label} · ${o.speed??1}×. Resources: ${totals.wood} wood / ${totals.gold} gold. ${ability.label}: ${ability.description}. ${difficultyDescription[o.difficulty]}`;
}

export const mapDescriptions={highlands:"Mountain highlands with three land crossings and four finite wood/gold deposits per type. The enemy occupies the northeast.",plains96:'Open size-test plains, 96 × 96 tiles. Familiar starting zones in the northwest.',plains128:'Open size-test plains, 128 × 128 tiles. Familiar starting zones in the northwest.',frontier:'Frontier Valley is larger: a north flank, central dry crossing and southern route surround the river. Two finite resource nodes support an eastern foothold.',arena:uiText.anOpenBattlefieldWithRockAndWaterA,forest:uiText.forestPassHasNarrowPassagesMoreWoodAnd,river:uiText.riverBendDividesTheBattlefieldWithWaterPlan,islands:uiText.twoIslandsWithoutALandConnectionAHarbor};
export function matchSettingDetails(o:MatchOptions){return {map:mapDescriptions[o.map]+(o.scenario==='skirmish'?'':uiText.theMapIsFixedForThisScenario),difficulty:difficultyDescription[o.difficulty],speed:o.speed??1};}
