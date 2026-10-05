import {aiProfiles} from '../config/aiProfiles';
import {createHighscoreStore,resultScore,rankedScores,scorePartition,type Highscore} from '../gameplay/highscores';
import {campaignDetails,campaignMission} from '../config/campaign';
import {maps,type MapId} from '../config/maps';
import {factions,type FactionId} from '../config/factions';
import type {MatchState} from '../gameplay/match';
export const highscoreStore=createHighscoreStore(()=>window.localStorage);
export function scoreHeading(s:Highscore):string{return `${s.kind==='campaign'?campaignDetails(s.goal as NonNullable<ReturnType<typeof campaignMission>>['id']).title:maps[s.map as MapId].label} · ${s.difficulty}${s.aiProfile?` · ${aiProfiles[s.aiProfile].label} AI`:""} · ${s.speed}× · ${factions[s.player as FactionId].label} vs ${factions[s.enemy as FactionId].label} · ${s.config} · scoring v${s.model}`;}
function render(target:HTMLElement,entries:Highscore[],message:string){
 target.replaceChildren();const intro=document.createElement('p');intro.textContent='Local results. Victory: 10000 + max(0, 3600 − whole gameplay seconds). Defeat: 0. Groups separate difficulty, speed, factions and rules version.';target.append(intro);
 const groups=new Map<string,Highscore[]>();for(const s of rankedScores(entries)){const key=scorePartition(s);groups.set(key,[...(groups.get(key)??[]),s]);}
 for(const list of groups.values()){const h=document.createElement('h3'),rows=document.createElement('ol');h.textContent=scoreHeading(list[0]);for(const s of list.slice(0,10)){const li=document.createElement('li');li.textContent=`${s.score} · ${s.outcome} · ${s.seconds.toFixed(1)} gameplay s · Produced ${s.stats.player.added}, lost ${s.stats.player.lost}, removed ${s.stats.player.removed}, kills ${s.stats.player.killed} · Wood delivered ${s.stats.player.wood.delivered.toFixed(1)}, gold ${s.stats.player.gold.delivered.toFixed(1)}`;rows.append(li);}target.append(h,rows);}
 const status=document.createElement('p');status.setAttribute('role','status');status.textContent=message||(!entries.length?'No registered results yet.':'Top 10 per rules group; all match IDs retained to prevent duplicate results.');target.append(status);
}
export function renderHighscorePanels(m:MatchState,ended:boolean){
 const result=resultScore(m),signature=highscoreStore.signature(),home=document.getElementById('home-highscores')!,panel=document.getElementById('result-highscores-panel')!;
 if(!home.hidden&&home.dataset.scores!==signature){render(home,highscoreStore.get(),highscoreStore.error()??'');home.dataset.scores=signature;}
 const partition=result?scorePartition(result):'',key=signature+partition+(m.matchId??'legacy');
 if(ended&&panel.dataset.scores!==key){render(panel,result?rankedScores(highscoreStore.get(),partition):[],highscoreStore.error()??(!m.matchId?'This older save has no match ID and cannot register a highscore. Start a new match to register results.':!result?'Only campaign and Skirmish matches register highscores.':''));panel.dataset.scores=key;}
}
