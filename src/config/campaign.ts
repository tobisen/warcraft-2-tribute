import {scenarioConfig} from './scenarios';

/** The existing playable missions, in order. New missions belong to RTS-143–145. */
export const campaignMissions=[
 {id:'first-steps',scenario:'tutorial',briefing:'A new garrison needs your command. Learn to move, gather, build and train before facing the practice target.',debriefing:'The garrison is ready. Forest Watch is now available.'},
 {id:'forest-watch',scenario:'mission-waves',briefing:'Raiders are approaching the forest watch. Turn the nearby resources into a force that can withstand every wave.',debriefing:'The watch holds. Take the fight to the enemy stronghold in The Siege.'},
 {id:'the-siege',scenario:'mission-base',briefing:'An enemy stronghold threatens the frontier. Build your army, explore the northeast and destroy its base.',debriefing:'The stronghold has fallen. Establish a defensive foothold in The Outpost.'},
 {id:'the-outpost',scenario:'mission-outpost',briefing:'Hold the outpost while reinforcements approach. Keep your base alive for the full defensive operation.',debriefing:'The foothold is secure. The Crossing is now available.'},
 {id:'the-crossing',scenario:'mission-sea',briefing:'The enemy waits beyond the water. Gather on the western island, build a harbor and carry your army across.',debriefing:'The crossing is secured. This is the final operation in the current campaign.'},
] as const;
export type CampaignMissionId=typeof campaignMissions[number]['id'];
export function campaignMission(id:unknown){return campaignMissions.find(m=>m.id===id);}
export function campaignMissionForScenario(scenario:unknown){return campaignMissions.find(m=>m.scenario===scenario);}
export function campaignDetails(id:CampaignMissionId){const m=campaignMission(id)!;return {...m,title:scenarioConfig[m.scenario].label,goal:scenarioConfig[m.scenario].instruction};}
