import type {CampaignMissionId} from './campaign';
import type {MapId} from './maps';
export type CampaignGoal='prepare'|'explore'|'waves'|'position'|'base'|'transport'|'guards'|'operation';
export interface CampaignPhase {goal:CampaignGoal;text:string;points?:readonly {x:number;y:number}[]}
export interface CampaignPlan {map:MapId;intro:string;phases:readonly CampaignPhase[]}
const prepare:CampaignPhase={goal:'prepare',text:'Build your barracks and field two living land combatants. Gather wood and gold; add supply before training more troops.'};
const east:CampaignPhase={goal:'explore',text:'Scout the eastern grove (1216,896) and mine (1184,640). Secure the resource route; workers still deliver to your original base.',points:[{x:1216,y:896},{x:1184,y:640}]};
const west:CampaignPhase={goal:'explore',text:'Scout the western expansion grove (960,736) and mine (896,864). Secure these finite resources for reinforcements.',points:[{x:960,y:736},{x:896,y:864}]};
const waves:CampaignPhase={goal:'waves',text:'Repel all three finite raider groups. Keep your base alive and rebuild losses.'};
const crossing:CampaignPhase={goal:'position',text:'Secure the eastern crossing (1088,640) with a living land combatant.',points:[{x:1088,y:640}]};
const transport:CampaignPhase={goal:'transport',text:'Build your dock and a living transport. Load your troops and use a clear shoreline to unload.'};
const base:CampaignPhase={goal:'base',text:'Destroy the enemy base. Explore before attacking; enemy production uses its own paid economy.'};
const guards:CampaignPhase={goal:'guards',text:'Defeat both named guards. Scout to reveal them; dead or missing guards remain cleared.'};
export const campaignPlans:Partial<Record<CampaignMissionId,CampaignPlan>>={
 'forest-watch':{map:'frontier',intro:'Secure the forest route.',phases:[prepare,east,waves,crossing]},
 'the-siege':{map:'highlands',intro:'Break the mountain stronghold.',phases:[prepare,west,{goal:'position',text:'Bring a living land combatant through the northern pass (1504,544).',points:[{x:1504,y:544}]},base]},
 'the-outpost':{map:'frontier',intro:'Open a forward route through the valley.',phases:[prepare,east,waves,crossing]},
 'the-crossing':{map:'islands',intro:'Take the far shore.',phases:[prepare,transport,{goal:'position',text:'Land a living combatant on the eastern island (960,480). Passengers and ships do not count.',points:[{x:960,y:480}]},base]},
 'ridge-convoy':{map:'highlands',intro:'Bring Ridge Courier safely through the pass. Losing the courier ends the mission.',phases:[prepare,west,guards,{goal:'operation',text:'Escort the living Ridge Courier into the safe zone (1504,544). Keep the courier and your base alive.'}]},
 'valley-rescue':{map:'frontier',intro:'Reach the occupied camp. The rescue does not grant free troops.',phases:[prepare,east,guards,{goal:'operation',text:'Bring a living land combatant into the rescue camp (1088,640). Workers cannot complete the rescue.'}]},
 'coastal-banner':{map:'coast',intro:'Secure the coastal banner.',phases:[prepare,transport,{goal:'explore',text:'Scout the eastern coastal grove (1600,300) and mine (1728,448).',points:[{x:1600,y:300},{x:1728,y:448}]},guards,{goal:'operation',text:'Hold the banner (1600,384) uncontested for 30 continuous seconds. Absence or enemy combatants reset the timer; ships, workers and passengers do not hold it.'}]},
};
