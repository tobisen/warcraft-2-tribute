import {text as uiText} from '../text';
import {maps} from '../config/maps';
import {factions,defaultFactions} from '../config/factions';
import {abilityConfig} from '../config/abilities';
import {difficultyProfiles} from '../config/difficulty';
import {scenarioConfig} from '../config/scenarios';
import type {MatchOptions} from '../gameplay/session';
export const difficultyDescription={beginner:'Long preparation, smaller attacks, slower enemy training and a smaller enemy army. Combat stats and game speed stay equal.',easy:uiText.lowerEnemyPressureAndLaterAttacks,normal:uiText.standardEnemyPressureAndAttackTiming,hard:uiText.higherEnemyPressureWithEarlierLargerAttacks};
export function matchSettingsSummary(o:MatchOptions):string {
 const map=maps[o.map],faction=factions[o.faction??defaultFactions.player],ability=abilityConfig[faction.id];
 return `${scenarioConfig[o.scenario].label} · ${map.label} · ${faction.label} · ${difficultyProfiles[o.difficulty].label} · ${o.speed??1}×. Resources: ${map.wood} wood / ${map.gold} gold. ${ability.label}: ${ability.description}. ${difficultyDescription[o.difficulty]}`;
}

export const mapDescriptions={arena:uiText.anOpenBattlefieldWithRockAndWaterA,forest:uiText.forestPassHasNarrowPassagesMoreWoodAnd,river:uiText.riverBendDividesTheBattlefieldWithWaterPlan,islands:uiText.twoIslandsWithoutALandConnectionAHarbor};
export function matchSettingDetails(o:MatchOptions){return {map:mapDescriptions[o.map]+(o.scenario==='skirmish'?'':uiText.theMapIsFixedForThisScenario),difficulty:difficultyDescription[o.difficulty],speed:o.speed??1};}
