import {text as uiText} from '../text';
import type {SessionPhase} from '../gameplay/session';
export type HomePage='home'|'campaign'|'skirmish'|'load'|'settings';
export const homeScenarios={campaign:['mission-waves','mission-base','mission-outpost','mission-sea'],skirmish:['skirmish','survival']} as const;
let current:HomePage='home',phase:SessionPhase='menu';
const element=(id:string)=>document.getElementById(id)!;
export function syncHomeMenu(nextPhase:SessionPhase):void{
 if(nextPhase==='menu'&&phase!=='menu')current='home';phase=nextPhase;
 const menu=phase==='menu',setup=current==='campaign'||current==='skirmish';
 document.body.dataset.phase=phase;document.body.dataset.homePage=current;
 element('match-menu').hidden=!menu;element('game-toolbar').hidden=menu||phase==='playing';element('top-bar').hidden=menu;element('bottom-bar').hidden=menu;element('match-menu-button').setAttribute('aria-expanded',String(phase==='paused'||phase==='ended'));
 for(const id of ['pause-match','resume-match','new-match','restart-match','save-controls','audio-controls','mission-instruction','session-status','match-results']){const target=element(menu?'home-content':'game-toolbar');if(element(id).parentElement!==target)target.append(element(id));}
 element('home-brand').hidden=!menu;element('home-navigation').hidden=!menu||current!=='home';
 element('home-content').hidden=menu&&current==='home';element('menu-back').hidden=!menu||current==='home';
 element('home-heading').hidden=!menu;element('home-heading').textContent=current==='campaign'?uiText.campaignChooseAMission:current==='skirmish'?uiText.skirmishChooseYourBattle:current==='load'?uiText.loadGame:uiText.settings;
 element('match-setup').hidden=!menu||!setup;element('audio-controls').hidden=menu&&current!=='settings';
 if(menu&&current==='settings')(element('audio-controls') as HTMLDetailsElement).open=true;
 element('save-controls').hidden=menu&&current!=='load';element('save-match').hidden=menu;
 for(const id of ['match-options-summary','mission-instruction','session-status'])element(id).hidden=menu&&!setup;
 const select=element('scenario-select') as HTMLSelectElement;
 for(const option of select.options)option.hidden=menu&&setup&&!homeScenarios[current as 'campaign'|'skirmish'].includes(option.value as never);
}
export function bindHomeMenu():void{
 const open=(page:HomePage)=>{if(phase!=='menu')return;current=page;if(page==='campaign'||page==='skirmish'){const select=element('scenario-select') as HTMLSelectElement;if(!homeScenarios[page].includes(select.value as never)){select.value=homeScenarios[page][0];select.dispatchEvent(new Event('change'));}}syncHomeMenu(phase);(page==='home'?element('menu-campaign'):element('menu-back')).focus();};
 for(const page of ['campaign','skirmish','load','settings'] as const)element(`menu-${page}`).addEventListener('click',()=>open(page));
 element('match-menu-button').addEventListener('click',()=>{if(phase==='playing')element('pause-match').click();else if(phase==='paused')element('resume-match').click();});
 element('menu-back').addEventListener('click',()=>open('home'));
 window.addEventListener('keydown',event=>{if(event.key==='Escape'&&phase==='menu'&&current!=='home'){event.preventDefault();open('home');}});
}
