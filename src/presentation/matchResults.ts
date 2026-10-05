import {playerEliminated} from '../gameplay/teamResults';
import {playerTeam} from '../gameplay/players';
import {campaignDebrief} from './campaign';
import {text as uiText} from '../text';
import {matchStats,type MatchStats} from '../gameplay/matchStats';
import {scenarioConfig} from '../config/scenarios';
import {maps} from '../config/maps';
import {factions,defaultFactions} from '../config/factions';
import {difficultyProfiles} from '../config/difficulty';
import type {MatchState} from '../gameplay/match';
export interface ResultRow {label:string;player:string;enemy:string}
const number=new Intl.NumberFormat('en-US',{maximumFractionDigits:1});
export function resultRows(stats:MatchStats):ResultRow[]{
 const rows:ResultRow[]=[];for(const resource of ['wood','gold'] as const)for(const [key,label] of [['gathered',uiText.gathered],['delivered',uiText.delivered],['spent',uiText.netSpent]] as const)rows.push({label:`${label} ${resource}`,player:number.format(stats.player[resource][key]),enemy:number.format(stats.enemy[resource][key])});
 for(const [key,label] of [['added',uiText.unitsCreated],['lost',uiText.unitsLost],['killed',uiText.unitsDefeated],['removed','Units removed by owner'],['built','Buildings completed'],['destroyed','Buildings destroyed']] as const)rows.push({label,player:number.format(stats.player[key]),enemy:number.format(stats.enemy[key])});return rows;
}
export function renderMatchResults(element:HTMLElement,m:MatchState,show:boolean):void {
 element.hidden=!show||m.outcome==='playing';if(element.hidden){if(element.childElementCount)element.replaceChildren();delete element.dataset.resultSignature;return;}
 const stats=matchStats(m),signature=JSON.stringify([m.campaignMission,m.outcome,m.scenario,m.map.id,m.difficulty,m.speed,m.factions,stats]);if(element.dataset.resultSignature===signature)return;element.dataset.resultSignature=signature;
 const seconds=Math.floor(stats.seconds),title=document.createElement('h2');title.textContent=`${m.outcome==='victory'?'Victory':'Defeat'} · ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
 const context=document.createElement('p');context.textContent=`${scenarioConfig[m.scenario??'survival'].label} · ${maps[m.map.id??'arena'].label} · ${difficultyProfiles[m.difficulty??'normal'].label} · ${m.speed??1}× · ${factions[(m.factions??defaultFactions).player].label}`;
 const table=document.createElement('table'),head=document.createElement('thead'),header=document.createElement('tr');for(const name of [uiText.statistics,factions[(m.factions??defaultFactions).player].label,factions[(m.factions??defaultFactions).enemy].label+uiText.enemy]){const th=document.createElement('th');th.scope='col';th.textContent=name;header.append(th);}head.append(header);table.append(head);const body=document.createElement('tbody');for(const row of resultRows(stats)){const tr=document.createElement('tr'),label=document.createElement('th');label.scope='row';label.textContent=row.label;tr.append(label);for(const value of [row.player,row.enemy]){const td=document.createElement('td');td.textContent=value;tr.append(td);}body.append(tr);}table.append(body);
 const note=document.createElement('p');note.textContent='Net spent is paid costs minus refunds, including unfinished jobs. Units produced exclude starting units. Buildings completed exclude starting bases; destruction includes unfinished sites.'+(m.statLedger?.legacy?' Building and owner-removal history before this legacy save was loaded is unavailable; these counters start at migration.':'');const summary=document.createElement('div'),details=document.createElement('div');summary.dataset.resultSummary='';details.dataset.resultStatistics='';summary.append(title,context);const debrief=campaignDebrief(m);if(debrief){const p=document.createElement('p');p.dataset.campaignDebrief='';p.textContent=debrief;summary.append(p);}if(stats.players&&m.multiplePlayers){
  const perPlayer=document.createElement('table'),heading=document.createElement('tr');
  for(const text of ['Player','Kills','Losses','Dismissals','Wood delivered','Gold delivered']){const th=document.createElement('th');th.textContent=text;heading.append(th);}perPlayer.append(heading);
  for(const p of m.multiplePlayers.roster){const stat=stats.players[p.id]!;const row=document.createElement('tr');row.style.color=p.color;for(const value of [`${p.id} · Team ${playerTeam(p.id,m.multiplePlayers.roster)} · ${factions[p.faction].label} · ${playerEliminated(m,p.id)?'Eliminated':'Active'}`,stat.killed,stat.lost,stat.removed,stat.wood.delivered,stat.gold.delivered]){const cell=document.createElement('td');cell.textContent=typeof value==='number'?number.format(value):value;row.append(cell);}perPlayer.append(row);}details.append(perPlayer);
  const teamTable=document.createElement('table');teamTable.dataset.teamResults='';
  const headings=document.createElement('tr');for(const label of ['Team','Kills','Losses','Dismissals','Wood delivered','Gold delivered']){const cell=document.createElement('th');cell.textContent=label;headings.append(cell);}teamTable.append(headings);
  for(const [team,stat] of Object.entries(stats.teams!)){const eliminated=m.multiplePlayers.roster.filter(p=>playerTeam(p.id,m.multiplePlayers!.roster)===Number(team)).every(p=>playerEliminated(m,p.id)),row=document.createElement('tr');for(const value of [`Team ${team} · ${eliminated?'Eliminated':'Active'}`,stat.killed,stat.lost,stat.removed,stat.wood.delivered,stat.gold.delivered]){const cell=document.createElement('td');cell.textContent=typeof value==='number'?number.format(value):value;row.append(cell);}teamTable.append(row);}details.append(teamTable);
 }
 if(!stats.players)details.append(table);details.append(note);element.replaceChildren(summary,details);
}
