import {seriesForId} from '../config/campaignSeries';
import {aiProfiles} from '../config/aiProfiles';
import {createHighscoreStore,resultScore,rankedScores,filteredScores,scorePartition,type Highscore} from '../gameplay/highscores';
import {campaignDetails,campaignMission} from '../config/campaign';
import {maps,type MapId} from '../config/maps';
import {factions,type FactionId} from '../config/factions';
import type {MatchState} from '../gameplay/match';
export const highscoreStore=createHighscoreStore(()=>window.localStorage);
export function scoreHeading(s:Highscore):string{return `${s.campaignId?seriesForId(s.campaignId)!.title+' · ':s.kind==='campaign'?'Legacy mixed campaign · ':''}${s.kind==='campaign'?campaignDetails(s.goal as NonNullable<ReturnType<typeof campaignMission>>['id']).title:maps[s.map as MapId].label} · ${s.difficulty}${s.aiProfile?` · ${aiProfiles[s.aiProfile].label} AI`:""} · ${s.speed}× · ${factions[s.player as FactionId].label} vs ${factions[s.enemy as FactionId].label} · ${s.config} · scoring v${s.model}`;}
function render(target:HTMLElement,entries:Highscore[],message:string){
 const previous={kind:target.querySelector<HTMLSelectElement>('[data-score-filter="kind"]')?.value,map:target.querySelector<HTMLSelectElement>('[data-score-filter="map"]')?.value,difficulty:target.querySelector<HTMLSelectElement>('[data-score-filter="difficulty"]')?.value};
 target.replaceChildren();
 const intro=document.createElement('p');intro.textContent='Victory: 10000 + max(0, 3600 − whole gameplay seconds). Defeat: 0. Ranked separately by rules group: score descending, time ascending, then stable match ID.';target.append(intro);
 const controls=document.createElement('div');controls.className='score-filters';
 const select=(key:string,label:string,options:[string,string][],value?:string)=>{const wrap=document.createElement('label'),input=document.createElement('select');wrap.append(label+' ');input.dataset.scoreFilter=key;for(const [id,text] of options){const o=document.createElement('option');o.value=id;o.textContent=text;input.append(o);}if(options.some(o=>o[0]===value))input.value=value!;wrap.append(input);controls.append(wrap);return input;};
 const kind=select('kind','Mode',[['skirmish','Skirmish'],['campaign','Campaign']],previous.kind??entries[0]?.kind);
 const map=select('map','Map',Object.entries(maps).map(([id,m])=>[id,m.label]),previous.map??entries[0]?.map);
 const difficulty=select('difficulty','Difficulty',[['beginner','Beginner'],['easy','Easy'],['normal','Normal'],['hard','Hard']],previous.difficulty??entries[0]?.difficulty);
 const results=document.createElement('div');results.className='score-tables';target.append(controls,results);
 const update=()=>{
  results.replaceChildren();const filtered=filteredScores(entries,{kind:kind.value as Highscore['kind'],map:map.value,difficulty:difficulty.value});
  const groups=new Map<string,Highscore[]>();for(const s of filtered){const key=scorePartition(s);groups.set(key,[...(groups.get(key)??[]),s]);}
  for(const list of groups.values()){
   const table=document.createElement('table'),caption=document.createElement('caption'),head=document.createElement('thead'),body=document.createElement('tbody'),row=document.createElement('tr');caption.textContent=scoreHeading(list[0]);
   for(const label of ['Rank','Score','Faction','Result','Game time','Date','Rules version']){const th=document.createElement('th');th.scope='col';th.textContent=label;row.append(th);}head.append(row);
   for(const [index,s] of list.slice(0,10).entries()){const tr=document.createElement('tr');tr.dataset.matchId=s.id;for(const value of [String(index+1),String(s.score),factions[s.player as FactionId].label,s.outcome,`${Math.floor(s.seconds/60)}:${String(Math.floor(s.seconds%60)).padStart(2,'0')}`,s.recordedAt?new Date(s.recordedAt).toLocaleDateString('en-GB'):'Unknown (older result)',`${s.config} / scoring ${s.model}`]){const td=document.createElement('td');td.textContent=value;tr.append(td);}body.append(tr);}table.append(caption,head,body);results.append(table);
  }
  const status=document.createElement('p');status.setAttribute('role','status');status.textContent=message||(!filtered.length?'No results for this mode, map and difficulty.':'Top 10 per comparable rules group. Older records keep their known metadata; missing dates remain unknown.');results.append(status);
 };
 for(const input of [kind,map,difficulty])input.addEventListener('change',update);update();
}
export function renderHighscorePanels(m:MatchState,ended:boolean){
 const result=resultScore(m),signature=highscoreStore.signature(),home=document.getElementById('home-highscores')!,panel=document.getElementById('result-highscores-panel')!;
 if(!home.hidden&&home.dataset.scores!==signature){render(home,highscoreStore.get(),highscoreStore.error()??'');home.dataset.scores=signature;}
 const partition=result?scorePartition(result):'',key=signature+partition+(m.matchId??'legacy');
 if(ended&&panel.dataset.scores!==key){render(panel,result?rankedScores(highscoreStore.get(),partition):[],highscoreStore.error()??(!m.matchId?'This older save has no match ID and cannot register a highscore. Start a new match to register results.':!result?'Only campaign and Skirmish matches register highscores.':''));panel.dataset.scores=key;}
}
