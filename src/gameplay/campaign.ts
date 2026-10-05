import {identityKey,seriesForId,seriesMissionPlan,type CampaignIdentity} from '../config/campaignSeries';
import {campaignPlans} from '../config/campaignPhases';
import {campaignMissions,campaignMission,campaignPreset,type CampaignMissionId} from '../config/campaign';
import {scenarioConfig} from '../config/scenarios';
import {createMatch,type MatchState} from './match';
import type {Difficulty} from '../config/difficulty';
import type {MatchFactions} from '../config/factions';
import type {GameSpeed} from '../config/gameSpeed';
export interface CampaignProgress {version:1;completed:CampaignMissionId[];identity?:CampaignIdentity}
export const campaignProgressKey='warcraft-2-tribute.campaign.v1';
export const freshCampaignProgress=():CampaignProgress=>({version:1,completed:[]});
export function validateCampaignProgress(value:unknown):CampaignProgress{
 if(!value||typeof value!=='object'||Array.isArray(value))return freshCampaignProgress();
 const v=value as Record<string,unknown>;
 if(Object.keys(v).some(k=>!['version','completed','identity'].includes(k))||v.version!==1||!Array.isArray(v.completed)||v.completed.length>campaignMissions.length||v.completed.some(id=>!campaignMission(id))||new Set(v.completed).size!==v.completed.length)return freshCampaignProgress();
 if(v.identity){const i=v.identity as CampaignIdentity;if(seriesForId(i.campaignId)?.faction!==i.faction||!['beginner','easy','normal','hard'].includes(i.difficulty))return freshCampaignProgress();}
 const completed=v.completed;return {version:1,...(v.identity?{identity:{...v.identity as CampaignIdentity}}:{}),completed:campaignMissions.filter(m=>completed.includes(m.id)).map(m=>m.id)};
}
export function campaignMissionStatus(progress:CampaignProgress,id:CampaignMissionId):'locked'|'available'|'completed'{
 if(progress.completed.includes(id))return 'completed';
 const index=campaignMissions.findIndex(m=>m.id===id);
 return index===0||index>0&&progress.completed.includes(campaignMissions[index-1].id)?'available':'locked';
}
export function completeCampaignMission(progress:CampaignProgress,match:MatchState):CampaignProgress{
 const mission=campaignMission(match.campaignMission);
 if(progress.identity&&(match.campaignRun?.campaignId!==progress.identity.campaignId||match.factions?.player!==progress.identity.faction||match.difficulty!==progress.identity.difficulty))return progress;
 if(match.outcome!=='victory'||!mission||mission.scenario!==match.scenario||progress.completed.includes(mission.id))return progress;
 // A resumed campaign save can earn its own completion even on a new browser.
 // It never fabricates completion for any earlier missions.
 return validateCampaignProgress({version:1,...(progress.identity?{identity:progress.identity}:{}),completed:[...progress.completed,mission.id]});
}
export function startCampaignMission(progress:CampaignProgress,id:CampaignMissionId,difficulty:Difficulty,factions:MatchFactions,speed:GameSpeed=1):MatchState|null{
 const mission=campaignMission(id);
 if(!mission||campaignMissionStatus(progress,id)==='locked'||progress.identity&&(progress.identity.faction!==factions.player||progress.identity.difficulty!==difficulty))return null;
 if(progress.identity){const identity=progress.identity,series=seriesForId(identity.campaignId)!;return {...createMatch(mission.scenario,difficulty,{player:identity.faction,enemy:series.enemy},seriesMissionPlan(id,identity.campaignId).map,speed,'balanced',undefined,id),campaignMission:id,campaignRun:{version:1,phase:0,campaignId:identity.campaignId}};}
 return {...createMatch(mission.scenario,difficulty,campaignPreset(id)??factions,campaignPlans[id]?.map??scenarioConfig[mission.scenario].map,speed,'balanced',undefined,id),campaignMission:id};
}
export interface CampaignStorage {getItem(key:string):string|null;setItem(key:string,value:string):void}
export const scopedCampaignProgressKey='warcraft-2-tribute.campaign.v2';
export function createCampaignStore(storage:()=>CampaignStorage){
 let progress=freshCampaignProgress(),scoped:Record<string,CampaignMissionId[]>={},error:string|null=null;
 const scopedProgress=(identity:CampaignIdentity):CampaignProgress=>({version:1,identity:{...identity},completed:[...(scoped[identityKey(identity)]??[])]});
 return {
  load(){try{const host=storage(),raw=host.getItem(campaignProgressKey);progress=raw?validateCampaignProgress(JSON.parse(raw)):freshCampaignProgress();scoped={};const data=host.getItem(scopedCampaignProgressKey);if(data){const v=JSON.parse(data);if(v.version!==2||!v.campaigns||Object.keys(v).sort().join()!=='campaigns,version')throw Error('invalid');for(const [key,completed] of Object.entries(v.campaigns)){const [campaignId,faction,difficulty]=key.split('/'),i={campaignId,faction,difficulty} as CampaignIdentity,p=validateCampaignProgress({version:1,identity:i,completed});if(!p.identity||identityKey(p.identity)!==key||JSON.stringify(p.completed)!==JSON.stringify(completed))throw Error('invalid');scoped[key]=p.completed;}}error=null;}catch{progress=freshCampaignProgress();scoped={};error='Campaign progress could not be read. Stored data has not been overwritten.';}return this.get();},
  get(identity?:CampaignIdentity){return identity?scopedProgress(identity):{...progress,completed:[...progress.completed]};},
  error(){return error;},
  record(match:MatchState){const series=seriesForId(match.campaignRun?.campaignId),identity=series&&match.difficulty?{campaignId:series.id,faction:series.faction,difficulty:match.difficulty}:undefined;
   if(match.campaignRun?.campaignId&&!series)return this.get();
   const before=identity?scopedProgress(identity):progress,next=completeCampaignMission(before,match);if(next===before)return this.get(identity);
   if(identity)scoped[identityKey(identity)]=next.completed;else progress=next;
   try{storage().setItem(identity?scopedCampaignProgressKey:campaignProgressKey,JSON.stringify(identity?{version:2,campaigns:scoped}:progress));error=null;}catch{error='Campaign progress could not be stored. It is available for this session only.';}return this.get(identity);
  },
 };
}
