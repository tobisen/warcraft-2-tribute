import type {SessionPhase} from '../gameplay/session';
export type ResultPage='summary'|'statistics'|'highscores';
export function resultNavigation(page:ResultPage,action:'statistics'|'highscores'|'back'|'escape'):ResultPage {
 return action==='highscores'?'highscores':action==='statistics'?'statistics':action==='back'||action==='escape'?'summary':page;
}
let phase:SessionPhase='menu',page:ResultPage='summary';
const el=(id:string)=>document.getElementById(id)!;
function syncPage():void {
 const statistics=page==='statistics',scores=page==='highscores';
 el('result-highscores-panel').hidden=!scores;
 const details=el('match-results').querySelector<HTMLElement>('[data-result-statistics]');if(details)details.hidden=!statistics;
 el('result-statistics').hidden=statistics;el('result-highscores').hidden=scores;el('result-back').hidden=page==='summary';
}
export function syncResultScreen(next:SessionPhase):void {
 const entered=phase!=='ended'&&next==='ended';phase=next;
 const ended=phase==='ended';el('result-screen').hidden=!ended;
 if(!ended)return;
 for(const id of ['game','hud','top-bar','bottom-bar','minimap-overlay','game-toolbar','pause-backdrop'])el(id).hidden=true;
 if(el('match-results').parentElement!==el('result-content'))el('result-content').append(el('match-results'));
 if(el('save-controls').parentElement!==el('result-save'))el('result-save').append(el('save-controls'));
 el('match-results').hidden=false;el('save-controls').hidden=false;
 if(entered)page='summary';syncPage();
 if(entered)el(el('result-next-mission').hidden?'result-play-again':'result-next-mission').focus();
}
export function bindResultScreen():void {
 el('result-play-again').addEventListener('click',()=>{if(phase==='ended')el('restart-match').click();});
 el('result-main-menu').addEventListener('click',()=>{if(phase==='ended')el('new-match').click();});
 const navigate=(action:'statistics'|'highscores'|'back'|'escape')=>{if(phase!=='ended')return;page=resultNavigation(page,action);syncPage();el(page==='summary'?'result-statistics':'result-back').focus();};
 el('result-highscores').addEventListener('click',()=>navigate('highscores'));
 el('result-statistics').addEventListener('click',()=>navigate('statistics'));el('result-back').addEventListener('click',()=>navigate('back'));
 window.addEventListener('keydown',event=>{
  if(phase!=='ended'||event.ctrlKey||event.metaKey||event.altKey)return;
  if(event.key==='Escape'){event.preventDefault();navigate('escape');return;}
  if(event.key!=='Tab')return;
  const controls=[...el('result-screen').querySelectorAll<HTMLButtonElement>('button')].filter(b=>!b.disabled&&b.getClientRects().length);
  const first=controls[0],last=controls.at(-1);if(!first||!last)return;
  if(event.shiftKey&&(document.activeElement===first||!el('result-screen').contains(document.activeElement))){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(document.activeElement===last||!el('result-screen').contains(document.activeElement))){event.preventDefault();first.focus();}
 });
}
