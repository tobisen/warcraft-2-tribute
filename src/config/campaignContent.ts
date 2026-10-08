import {campaignMissions,type CampaignMissionId} from './campaign';
import {factions,type UnitRole,type UpgradeRole} from './factions';
import {campaignSeries,seriesForId} from './campaignSeries';
import type {MatchState} from '../gameplay/match';
export interface CampaignContent {units:readonly UnitRole[];buildings:readonly string[];research:readonly (UpgradeRole|import('./roleResearch').RoleResearchKind)[];ships:readonly string[];abilities:boolean;spells:boolean;baseUpgrades:boolean}
export function missionContent(id:CampaignMissionId):CampaignContent{
 const level=campaignMissions.findIndex(m=>m.id===id)+1;
 return {units:['worker','soldier',...(level>=2?['archer' as const]:[]),...(level>=3?['cavalry' as const,'scout' as const]:[]),...(level>=4?['specialist' as const]:[]),...(level>=6?['ballista' as const,'catapult' as const,'healer' as const]:[]),...(level>=7?['air' as const,'giant' as const]:[])],buildings:['base','barracks','farm',...(level>=2?['tower','wall','gate']:[]),...(level>=3?['forge','stable','aviary']:[]),...(level>=5?['harbor']:[]),...(level>=6?['academy','siegeWorks']:[])],research:level>=3?['attack','defense','cavalryArmor','scoutOptics',...(level>=6?['healerTraining' as const]:[])]:[],ships:level>=5?['transport',...(level>=8?['warship']:[])]:[],abilities:level>=2,spells:level>=4,baseUpgrades:level>=3};
}
export function campaignContentFor(m:Pick<MatchState,'campaignMission'|'campaignRun'>):CampaignContent|undefined{return m.campaignMission&&seriesForId(m.campaignRun?.campaignId)?missionContent(m.campaignMission):undefined;}
export function contentReason(content:CampaignContent|undefined,category:'units'|'buildings'|'research'|'ships'|'abilities'|'spells'|'baseUpgrades',item=''):string|null{
 if(!content)return null;const allowed=content[category];return (typeof allowed==='boolean'?allowed:(allowed as readonly string[]).includes(item))?null:'Locked for this campaign mission';
}
/** Advanced technology must also respect legacy story missions without a series identity. */
export function academyCampaignReason(m:Pick<MatchState,'campaignMission'>):string|null{return m.campaignMission?contentReason(missionContent(m.campaignMission),'buildings','academy'):null;}
export function campaignActionReason(m:MatchState,id:string):string|null{
 if(id==='research-workerTools')return null;
 if(id==='build-academy'&&academyCampaignReason(m))return academyCampaignReason(m);
 const c=campaignContentFor(m);
 if(id.startsWith('train-'))return contentReason(c,id==='train-ship'||id==='train-transport'?'ships':'units',id==='train-ship'?'warship':id.slice(6));
 if(id.startsWith('build-'))return contentReason(c,'buildings',id.slice(6));
 if(id.startsWith('research-'))return contentReason(c,'research',id.slice(9));
 if(id.startsWith('cast-'))return contentReason(c,'spells');
 if(id==='unit-ability')return contentReason(c,'abilities');
 if(id==='upgrade-base'||id==='upgrade-tower'||id==='upgrade-tower-air')return contentReason(c,'baseUpgrades');
 return null;
}
export function missionIntroduction(id:CampaignMissionId,faction:keyof typeof campaignSeries):string{
 const f=factions[faction],index=campaignMissions.findIndex(m=>m.id===id);
 return [ `Selection, gathering, ${f.buildingNames.barracks}, supply and ${f.unitNames.soldier}`,`${f.unitNames.archer}, fortifications and the faction combat ability`,`${f.buildingNames.forge}, ${f.upgrades.attack.name}, ${f.upgrades.defense.name} and base upgrades`,`${f.unitNames.specialist}, mana and faction spells`,`${f.naval.harbor.name}, ${f.naval.units.transport.name} and landing troops`,`${f.unitNames.catapult} and siege combat`,`${f.unitNames.air} and air/anti-air combat`,`${f.naval.units.warship.name} and combined land/sea/air operations` ][index];
}
