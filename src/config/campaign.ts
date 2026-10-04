import type {MatchFactions} from './factions';
import {scenarioConfig} from './scenarios';

/** The existing playable missions, in order. New missions belong to RTS-143–145. */
export const campaignMissions=[
 {id:'first-steps',factions:{player:'crown',enemy:'clans'},scenario:'tutorial',briefing:'Command the Human garrison. Learn selection and movement, deliver wood, build Barracks and train a Guard. Right-click the practice target with your selected Guard; no enemy pressure while learning.',debriefing:'The garrison is ready. Forest Watch is now available.'},
 {id:'forest-watch',factions:{player:'clans',enemy:'crown'},scenario:'mission-waves',briefing:'The Orcs hold Forest Watch. Gather wood and gold, build a War Hut and train Axe Warriors before the three finite raider waves. Select your army and press E for Fury in close combat. Keep your Stronghold alive.',debriefing:'The watch holds. Take the fight to the enemy stronghold in The Siege.'},
 {id:'the-siege',factions:{player:'elves',enemy:'goblins'},scenario:'mission-base',briefing:'Elven Wardens must remove a Goblin stronghold. Deliver wood and gold, build a Ranger Lodge and enough supply for a larger army. Explore the northeast, use True Shot [E], and destroy the Workshop Hall. Longbows and Moon Workshop research are optional tactical choices.',debriefing:'The stronghold has fallen. Establish a defensive foothold in The Outpost.'},
 {id:'the-outpost',factions:{player:'dwarves',enemy:'goblins'},scenario:'mission-outpost',briefing:'The Dwarves hold the foothold for 90 gameplay seconds. Gather resources, build a Guard Hall and train Iron Guards before the incoming raiders. Brace [E] reduces incoming damage; keep the Stone Hold alive until reinforcements arrive.',debriefing:'The foothold is secure. The Crossing is now available.'},
 {id:'the-crossing',scenario:'mission-sea',briefing:'The enemy waits beyond the water. Gather on the western island, build a harbor and carry your army across.',debriefing:'The crossing is secured. This is the final operation in the current campaign.'},
] as const;
export type CampaignMissionId=typeof campaignMissions[number]['id'];
export function campaignMission(id:unknown){return campaignMissions.find(m=>m.id===id);}
export function campaignMissionForScenario(scenario:unknown){return campaignMissions.find(m=>m.scenario===scenario);}
export function campaignDetails(id:CampaignMissionId){const m=campaignMission(id)!;return {...m,title:scenarioConfig[m.scenario].label,goal:scenarioConfig[m.scenario].instruction};}

/** Presets only constrain new campaign starts; loaded match factions remain authoritative. */
export function campaignPreset(id:unknown):MatchFactions|undefined {const mission=campaignMission(id);return mission&&'factions' in mission?{...mission.factions}:undefined;}
