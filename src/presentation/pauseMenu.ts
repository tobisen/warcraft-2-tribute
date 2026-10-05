import {text as uiText} from '../text';
import type {SessionPhase} from '../gameplay/session';
export type PausePage='main'|'settings'|'quit'|'tech'|'mission';
export function pauseNavigation(page:PausePage,action:'settings'|'quit'|'tech'|'mission'|'back'|'escape'):{page:PausePage;resume:boolean}{return action==='escape'?{page:'main',resume:page==='main'}:{page:action==='back'?'main':action,resume:false};}
let page:PausePage='main',phase:SessionPhase='menu';
const el=(id:string)=>document.getElementById(id)!;
export function syncPauseMenu(nextPhase:SessionPhase):void{
 const changed=phase!==nextPhase;if(changed)page='main';phase=nextPhase;const open=phase==='paused',settings=open&&page==='settings',quit=open&&page==='quit',tech=open&&page==='tech',mission=open&&page==='mission';
 el('pause-backdrop').hidden=!open;el('game-toolbar').dataset.pausePage=page;
 el('pause-heading').textContent=tech?'Tech tree & commands':mission?'Mission':settings?uiText.settings:quit?uiText.quitToMainMenu:phase==='ended'?uiText.matchComplete:uiText.paused;
 el('pause-settings-button').hidden=!open||page!=='main';el('quit-request').hidden=!open||page!=='main';el('pause-back-button').hidden=!(settings||tech||mission);el('pause-tech-button').hidden=!open||page!=='main';el('pause-tech-panel').hidden=!tech;el('pause-mission-panel').hidden=!mission;el('quit-confirm').hidden=!quit;
 if(!open)return;
 for(const id of ['resume-match','restart-match','save-controls','session-status','match-results'])el(id).hidden=page!=='main'||id==='resume-match'&&phase!=='paused'||id==='match-results'&&phase!=='ended';
 for(const id of ['audio-controls','camera-controls','display-controls']){el(id).hidden=!settings;if(settings)(el(id) as HTMLDetailsElement).open=true;}
 const confirm=el('new-match');if(confirm.parentElement!==el('quit-confirm'))el('quit-confirm').append(confirm);confirm.hidden=!quit;confirm.textContent=uiText.confirmQuit;
 if(changed){for(const id of ['pause-heading','resume-match','save-controls','pause-settings-button','pause-tech-button','pause-tech-panel','pause-mission-panel','quit-request','restart-match','match-results','session-status','audio-controls','camera-controls','display-controls','pause-back-button','quit-confirm'])el('game-toolbar').append(el(id));(phase==='paused'?el('resume-match'):el('restart-match')).focus();}
}
export function bindPauseMenu():void{
 const navigate=(action:'settings'|'quit'|'tech'|'mission'|'back')=>{if(phase!=='paused')return;page=pauseNavigation(page,action).page;syncPauseMenu(phase);(page==='settings'||page==='tech'||page==='mission'?el('pause-back-button'):page==='quit'?el('quit-cancel'):phase==='paused'?el('resume-match'):el('restart-match')).focus();};
 for(const id of ['tech-tree','command-guide'])el('pause-tech-panel').append(el(id));(el('tech-tree') as HTMLDetailsElement).open=true;(el('command-guide') as HTMLDetailsElement).open=true;
 for(const id of ['mission-instruction','tutorial-objective','operation-objective','match-status','match-overview'])el('pause-mission-panel').append(el(id));
 for(const id of ['command-feedback','attack-warning'])el('top-bar').append(el(id));
 el('pause-tech-button').addEventListener('click',()=>navigate('tech'));
 el('mission-button').addEventListener('click',()=>{if(phase==='playing')el('pause-match').click();navigate('mission');});
 el('pause-settings-button').addEventListener('click',()=>navigate('settings'));el('quit-request').addEventListener('click',()=>navigate('quit'));el('pause-back-button').addEventListener('click',()=>navigate('back'));el('quit-cancel').addEventListener('click',()=>navigate('back'));
 window.addEventListener('keydown',event=>{if(phase!=='paused')return;if(event.ctrlKey||event.metaKey||event.altKey||event.repeat)return;if(event.key.toLowerCase()==='p'&&event.target instanceof HTMLElement&&(['INPUT','SELECT','TEXTAREA'].includes(event.target.tagName)||event.target.isContentEditable))return;
  if(event.key==='Escape'||event.key.toLowerCase()==='p'&&phase==='paused'){event.preventDefault();event.stopImmediatePropagation();const next=pauseNavigation(page,'escape');page=next.page;if(next.resume&&phase==='paused'){el('resume-match').click();document.querySelector<HTMLCanvasElement>('#game canvas')?.focus();}else navigate('back');return;}
  if(event.key!=='Tab')return;const controls=[...el('game-toolbar').querySelectorAll<HTMLElement>('button,input,select,summary,a,[tabindex]')].filter(e=>e.getClientRects().length&&e.tabIndex>=0&&!('disabled' in e&&(e as HTMLButtonElement).disabled));if(!controls.length)return;const first=controls[0]!,last=controls.at(-1)!;if(event.shiftKey&&(document.activeElement===first||!el('game-toolbar').contains(document.activeElement))){event.preventDefault();last.focus();}else if(!event.shiftKey&&(document.activeElement===last||!el('game-toolbar').contains(document.activeElement))){event.preventDefault();first.focus();}
 });
}
