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
 for(const [key,label] of [['added',uiText.unitsCreated],['lost',uiText.unitsLost],['killed',uiText.unitsDefeated]] as const)rows.push({label,player:number.format(stats.player[key]),enemy:number.format(stats.enemy[key])});return rows;
}
export function renderMatchResults(element:HTMLElement,m:MatchState,show:boolean):void {
 element.hidden=!show||m.outcome==='playing';if(element.hidden){if(element.childElementCount)element.replaceChildren();delete element.dataset.resultSignature;return;}
 const stats=matchStats(m),signature=JSON.stringify([m.outcome,m.scenario,m.map.id,m.difficulty,m.speed,m.factions,stats]);if(element.dataset.resultSignature===signature)return;element.dataset.resultSignature=signature;
 const seconds=Math.floor(stats.seconds),title=document.createElement('h2');title.textContent=`${m.outcome==='victory'?'Victory':'Defeat'} · ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
 const context=document.createElement('p');context.textContent=`${scenarioConfig[m.scenario??'survival'].label} · ${maps[m.map.id??'arena'].label} · ${difficultyProfiles[m.difficulty??'normal'].label} · ${m.speed??1}×`;
 const table=document.createElement('table'),head=document.createElement('thead'),header=document.createElement('tr');for(const name of [uiText.statistics,factions[(m.factions??defaultFactions).player].label,factions[(m.factions??defaultFactions).enemy].label+uiText.enemy]){const th=document.createElement('th');th.scope='col';th.textContent=name;header.append(th);}head.append(header);table.append(head);const body=document.createElement('tbody');for(const row of resultRows(stats)){const tr=document.createElement('tr'),label=document.createElement('th');label.scope='row';label.textContent=row.label;tr.append(label);for(const value of [row.player,row.enemy]){const td=document.createElement('td');td.textContent=value;tr.append(td);}body.append(tr);}table.append(body);
 const note=document.createElement('p');note.textContent=uiText.netSpentIsPaidCostsMinusRefundsIncluding;element.replaceChildren(title,context,table,note);
}
