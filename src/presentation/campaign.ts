import {syncCampaignFlow,showCampaignBriefing} from './campaignFlow';
import {missionIntroduction} from '../config/campaignContent';
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
 overview.hidden=!active;briefing.hidden=!active;syncCampaignFlow(active);
 const identity=selectedCampaignIdentity(),progress=campaignStore.get(identity),series=campaignSeries[identity.faction];
 for(const option of select.options){const mission=campaignMissionForScenario(option.value);option.disabled=active&&!!mission&&campaignMissionStatus(progress,mission.id)==='locked';if(active&&mission)option.hidden=option.disabled;}
 if(!active){(document.getElementById('start-match') as HTMLButtonElement).disabled=false;return;}
 const current=campaignMissions.find(m=>campaignMissionStatus(progress,m.id)==='available')??campaignMissions.at(-1)!;
 if(campaignMissionStatus(progress,campaignMissionForScenario(select.value)?.id??'first-steps')==='locked'){select.value=current.scenario;select.dispatchEvent(new Event('change'));}
 document.getElementById('campaign-continue')!.textContent=`${progress.completed.length?'Continue':'Start'} campaign · ${campaignDetails(current.id).title} →`;
 const signature=JSON.stringify(progress);
 if(overview.dataset.progress!==signature){
  overview.dataset.progress=signature;
  const heading=document.createElement('h3');heading.textContent=`${series.title} · ${identity.difficulty} · ${progress.completed.length}/${campaignMissions.length} completed`;
  const list=document.createElement('ol');
  for(const mission of campaignMissions){const row=document.createElement('li'),button=document.createElement('button'),status=campaignMissionStatus(progress,mission.id);if(status==='locked')continue;button.type='button';button.dataset.campaignMission=mission.id;button.dataset.current=String(mission.id===current.id);button.disabled=false;button.textContent=`${campaignDetails(mission.id).title} · ${status==='completed'?'Completed · Replay':'Current mission'}`;button.addEventListener('click',()=>{select.value=mission.scenario;select.dispatchEvent(new Event('change'));showCampaignBriefing();});row.append(button);list.append(row);}
  overview.replaceChildren(heading,list);
 }
 const chosen=campaignMissionForScenario(select.value),locked=!chosen||campaignMissionStatus(progress,chosen.id)==='locked';
 (document.getElementById('start-match') as HTMLButtonElement).disabled=locked;
 if(chosen){const d=seriesMissionPlan(chosen.id,identity.campaignId),index=campaignMissions.findIndex(m=>m.id===chosen.id);briefing.textContent=`Briefing: ${d.intro}\nObjectives: ${d.phases.map(p=>p.text).join(' ')}\nIntroduces: ${missionIntroduction(chosen.id,identity.faction)}\nVictory unlocks: ${campaignMissions[index+1]?campaignDetails(campaignMissions[index+1].id).title+' — '+missionIntroduction(campaignMissions[index+1].id,identity.faction):'Campaign complete; all operations can be replayed.'}${locked?'\nComplete the previous mission to unlock this operation.':''}`;}else briefing.textContent='Choose a campaign mission.';
 const legacy=campaignStore.get();if(legacy.completed.length)briefing.textContent+='\nOlder mixed-campaign progress is preserved separately; its faction and difficulty were not recorded.';
 const error=campaignStore.error();if(error){const p=document.createElement('span');p.textContent='\n'+error;p.setAttribute('role','status');briefing.append(p);}
}
export function campaignDebrief(match:MatchState):string|null{
 const mission=campaignMission(match.campaignMission);if(!mission)return null;
 if(match.campaignRun?.campaignId)return match.outcome==='victory'?`Operation complete. Progress saved for ${campaignSeries[match.factions!.player].title} / ${match.difficulty}. Completed operations remain replayable.${campaignStore.error()?' '+campaignStore.error():''}`:'The operation failed. No new mission was unlocked. You can retry this mission.';
 return match.outcome==='victory'?`${campaignDetails(mission.id).debriefing}${campaignStore.error()?' '+campaignStore.error():''}`:'The operation failed. No new mission was unlocked. You can retry this mission.';
}
