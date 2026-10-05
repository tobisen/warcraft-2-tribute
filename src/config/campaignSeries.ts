import {factions,factionIds,type FactionId,type UnitRole,type UpgradeRole} from './factions';
import {campaignMissions,type CampaignMissionId} from './campaign';
import {campaignPlans,type CampaignPlan,type CampaignPhase} from './campaignPhases';
import type {Difficulty} from './difficulty';
export const campaignSeries={
 crown:{id:'human-frontier-v1',title:'The Broken Oath',story:'Rebuild the border garrisons after the coastal alliance collapses. Protect the supply road, recover the courier and raise the allied banner.',enemy:'clans',research:'defense',counts:[1,1,1,1,1,1,1,1]},
 clans:{id:'orcs-exodus-v1',title:'Road of the Exiles',story:'Lead the exiled warbands through occupied forests. Forge an offensive force, break the mountain blockade and claim a new shore.',enemy:'crown',research:'attack',counts:[2,1,1,2,1,2,1,1]},
 elves:{id:'elves-roots-v1',title:'The Severed Roots',story:'Restore contact with the scattered groves. Build a ranged screen, recover the forest prisoners and secure the coast against the invaders.',enemy:'goblins',research:'attack',counts:[1,2,1,2,1,1,2,1]},
 dwarves:{id:'dwarves-road-v1',title:'The Stone Road',story:'Reopen the mountain trade route. Equip a durable escort, recover the lost caravan and establish an armored coastal supply line.',enemy:'goblins',research:'defense',counts:[2,2,1,1,1,2,1,2]},
 goblins:{id:'goblins-contract-v1',title:'The Last Contract',story:'Recover a stolen coastal trade charter. Fund a raiding expedition, escort the negotiator and combine siege, aircraft and ships to seize the port.',enemy:'dwarves',research:'attack',counts:[3,1,1,1,2,2,2,2]},
} as const;
export type CampaignId=typeof campaignSeries[FactionId]['id'];
export interface CampaignIdentity {campaignId:CampaignId;faction:FactionId;difficulty:Difficulty}
export function seriesForId(id:unknown){return factionIds.map(faction=>({faction,...campaignSeries[faction]})).find(s=>s.id===id);}
export function identityFor(faction:FactionId,difficulty:Difficulty):CampaignIdentity{return {campaignId:campaignSeries[faction].id,faction,difficulty};}
export function identityKey(i:CampaignIdentity){return `${i.campaignId}/${i.faction}/${i.difficulty}`;}
export function seriesMissionPlan(id:CampaignMissionId,campaignId:CampaignId):CampaignPlan{
 const series=seriesForId(campaignId)!,index=campaignMissions.findIndex(m=>m.id===id),f=factions[series.faction],count=series.counts[index];
 const role:UnitRole|undefined=({0:'soldier',1:'archer',3:'specialist',5:'catapult',6:'air'} as Record<number,UnitRole>)[index];
 const tactical:CampaignPhase=index===2?{goal:'research',research:series.research as UpgradeRole,text:`Complete ${f.upgrades[series.research].name} to equip this expedition.`}:index===4||index===7?{goal:'fleet',ship:index===4?'transport':'warship',count,text:`Field ${count} living ${index===4?f.naval.units.transport.name:f.naval.units.warship.name}${count>1?' ships':''} for the ${index===4?'evacuation':'coastal blockade'}.`}:{goal:'force',role:role!,count,text:`Field ${count} living ${f.unitNames[role!]}${count>1?' troops':''}. Keep this force alive before the final objective.`};
 const original=campaignPlans[id]??{map:'arena' as const,intro:'Train the first expedition.',phases:[{goal:'tutorial' as const,text:'Complete the selection, movement, gathering, building, training and attack lessons.'}]};
 // Keep preparation/exploration first: finite wave pressure starts after those two phases.
 const phases=[...original.phases];phases.splice(Math.max(0,phases.length-1),0,tactical);
 if(index===0)phases.reverse();
 return {...original,intro:`${series.title}: ${series.story} Operation ${index+1}: ${original.intro}`,phases};
}
