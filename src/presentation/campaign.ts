import {identityFor,campaignSeries,seriesMissionPlan,type CampaignIdentity} from '../config/campaignSeries';
import {isFactionId} from '../config/factions';
import {initialDifficulty} from '../config/difficulty';
import {campaignMissions,campaignDetails,campaignMissionForScenario,campaignMission} from '../config/campaign';
import {campaignMissionStatus,createCampaignStore} from '../gameplay/campaign';
import type {MatchState} from '../gameplay/match';
export const campaignStore=createCampaignStore(()=>window.localStorage);
export function selectedCampaignIdentity():CampaignIdentity{const faction=(document.getElementById('faction-select') as HTMLSelectElement).value;return identityFor(isFactionId(faction)?faction:'crown',initialDifficulty((document.getElementById('difficulty-select') as HTMLSelectElement).value));}
export function syncCampaignMenu(active:boolean,select:HTMLSelectElement):void{
 const overview=document.getElementById('campaign-overview'),briefing=document.getElementById('campaign-briefing');
 if(!overview||!briefing)return;
 overview.hidden=!active;briefing.hidden=!active;
 const identity=selectedCampaignIdentity(),progress=campaignStore.get(identity),series=campaignSeries[identity.faction];
 for(const option of select.options){const mission=campaignMissionForScenario(option.value);option.disabled=active&&!!mission&&campaignMissionStatus(progress,mission.id)==='locked';}
 if(!active){(document.getElementById('start-match') as HTMLButtonElement).disabled=false;return;}
 const signature=JSON.stringify(progress);
 if(overview.dataset.progress!==signature){
  overview.dataset.progress=signature;
  const heading=document.createElement('h3');heading.textContent=`${series.title} · ${identity.difficulty} · ${progress.completed.length}/${campaignMissions.length} completed`;
  const list=document.createElement('ol');
  for(const mission of campaignMissions){const row=document.createElement('li'),button=document.createElement('button'),status=campaignMissionStatus(progress,mission.id);button.type='button';button.dataset.campaignMission=mission.id;button.disabled=status==='locked';button.textContent=`${campaignDetails(mission.id).title} · ${status==='completed'?'Completed · Replay':status==='locked'?'Locked':'Available'}`;button.addEventListener('click',()=>{select.value=mission.scenario;select.dispatchEvent(new Event('change'));});row.append(button);list.append(row);}
  overview.replaceChildren(heading,list);
 }
 const chosen=campaignMissionForScenario(select.value),locked=!chosen||campaignMissionStatus(progress,chosen.id)==='locked';
 (document.getElementById('start-match') as HTMLButtonElement).disabled=locked;
 if(chosen){const d=seriesMissionPlan(chosen.id,identity.campaignId);briefing.textContent=`Briefing: ${d.intro}\nObjectives: ${d.phases.map(p=>p.text).join(' ')}${locked?'\nComplete the previous mission to unlock this operation.':''}`;}else briefing.textContent='Choose a campaign mission.';
 const legacy=campaignStore.get();if(legacy.completed.length)briefing.textContent+='\nOlder mixed-campaign progress is preserved separately; its faction and difficulty were not recorded.';
 const error=campaignStore.error();if(error){const p=document.createElement('span');p.textContent='\n'+error;p.setAttribute('role','status');briefing.append(p);}
}
export function campaignDebrief(match:MatchState):string|null{
 const mission=campaignMission(match.campaignMission);if(!mission)return null;
 if(match.campaignRun?.campaignId)return match.outcome==='victory'?`Operation complete. Progress saved for ${campaignSeries[match.factions!.player].title} / ${match.difficulty}. Completed operations remain replayable.${campaignStore.error()?' '+campaignStore.error():''}`:'The operation failed. No new mission was unlocked. You can retry this mission.';
 return match.outcome==='victory'?`${campaignDetails(mission.id).debriefing}${campaignStore.error()?' '+campaignStore.error():''}`:'The operation failed. No new mission was unlocked. You can retry this mission.';
}
