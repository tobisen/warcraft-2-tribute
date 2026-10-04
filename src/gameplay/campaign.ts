import {campaignMissions,campaignMission,campaignPreset,type CampaignMissionId} from '../config/campaign';
import {scenarioConfig} from '../config/scenarios';
import {createMatch,type MatchState} from './match';
import type {Difficulty} from '../config/difficulty';
import type {MatchFactions} from '../config/factions';
import type {GameSpeed} from '../config/gameSpeed';
export interface CampaignProgress {version:1;completed:CampaignMissionId[]}
export const campaignProgressKey='warcraft-2-tribute.campaign.v1';
export const freshCampaignProgress=():CampaignProgress=>({version:1,completed:[]});
export function validateCampaignProgress(value:unknown):CampaignProgress{
 if(!value||typeof value!=='object'||Array.isArray(value))return freshCampaignProgress();
 const v=value as Record<string,unknown>;
 if(Object.keys(v).some(k=>!['version','completed'].includes(k))||v.version!==1||!Array.isArray(v.completed)||v.completed.length>campaignMissions.length||v.completed.some(id=>!campaignMission(id))||new Set(v.completed).size!==v.completed.length)return freshCampaignProgress();
 const completed=v.completed;return {version:1,completed:campaignMissions.filter(m=>completed.includes(m.id)).map(m=>m.id)};
}
export function campaignMissionStatus(progress:CampaignProgress,id:CampaignMissionId):'locked'|'available'|'completed'{
 if(progress.completed.includes(id))return 'completed';
 const index=campaignMissions.findIndex(m=>m.id===id);
 return index===0||index>0&&progress.completed.includes(campaignMissions[index-1].id)?'available':'locked';
}
export function completeCampaignMission(progress:CampaignProgress,match:MatchState):CampaignProgress{
 const mission=campaignMission(match.campaignMission);
 if(match.outcome!=='victory'||!mission||mission.scenario!==match.scenario||progress.completed.includes(mission.id))return progress;
 // A resumed campaign save can earn its own completion even on a new browser.
 // It never fabricates completion for any earlier missions.
 return validateCampaignProgress({version:1,completed:[...progress.completed,mission.id]});
}
export function startCampaignMission(progress:CampaignProgress,id:CampaignMissionId,difficulty:Difficulty,factions:MatchFactions,speed:GameSpeed=1):MatchState|null{
 const mission=campaignMission(id);
 if(!mission||campaignMissionStatus(progress,id)==='locked')return null;
 return {...createMatch(mission.scenario,difficulty,campaignPreset(id)??factions,scenarioConfig[mission.scenario].map,speed),campaignMission:id};
}
export interface CampaignStorage {getItem(key:string):string|null;setItem(key:string,value:string):void}
export function createCampaignStore(storage:()=>CampaignStorage){
 let progress=freshCampaignProgress(),error:string|null=null;
 return {
  load(){try{const raw=storage().getItem(campaignProgressKey);progress=raw?validateCampaignProgress(JSON.parse(raw)):freshCampaignProgress();error=null;}catch{progress=freshCampaignProgress();error='Campaign progress could not be read.';}return this.get();},
  get(){return {...progress,completed:[...progress.completed]};},
  error(){return error;},
  record(match:MatchState){const next=completeCampaignMission(progress,match);if(next===progress)return this.get();progress=next;try{storage().setItem(campaignProgressKey,JSON.stringify(progress));error=null;}catch{error='Campaign progress could not be stored. It is available for this session only.';}return this.get();},
 };
}
