import {maps} from '../config/maps';
import {factions,defaultFactions} from '../config/factions';
import {abilityConfig} from '../config/abilities';
import {difficultyProfiles} from '../config/difficulty';
import {scenarioConfig} from '../config/scenarios';
import type {MatchOptions} from '../gameplay/session';
export const difficultyDescription={easy:'Lägre fiendetryck och senare anfall.',normal:'Normalt fiendetryck och anfallstakt.',hard:'Högre fiendetryck och tidigare, större anfall.'};
export function matchSettingsSummary(o:MatchOptions):string {
 const map=maps[o.map],faction=factions[o.faction??defaultFactions.player],ability=abilityConfig[faction.id];
 return `${scenarioConfig[o.scenario].label} · ${map.label} · ${faction.label} · ${difficultyProfiles[o.difficulty].label}. Resurser: ${map.wood} wood / ${map.gold} gold. ${ability.label}: ${ability.description}. ${difficultyDescription[o.difficulty]}`;
}

export const mapDescriptions={arena:'Öppen handgjord arena med sten och vatten. Balanserad utgångspunkt för landstrid.',forest:'Skogspasset har smala passager, mer wood och mindre gold. Hitta alternativa vägar runt hinder.',river:'Flodkröken delar delar av slagfältet med vatten. Planera landvägar och skydda passager.',islands:'Två öar utan landförbindelse. Hamn och transport behövs för landstigning.'};
export function matchSettingDetails(o:MatchOptions){return {map:mapDescriptions[o.map]+(o.scenario==='skirmish'?'':' Kartan är fast för detta scenario.'),difficulty:difficultyDescription[o.difficulty],speed:1};}
