import {tutorialDeliveredWood} from '../gameplay/tutorial';
import {tutorialConfig} from '../config/tutorial';
import {tutorialInstructions,tutorialSteps} from '../config/tutorial';
import type {MatchState} from '../gameplay/match';
export function tutorialMessage(m:MatchState):string {
 if(m.scenario!=='tutorial'||!m.tutorial)return '';
 const step=m.tutorial.step;
 if(step===6)return 'Tutorial complete · All 6 steps completed.';
 const completed=step?`Completed: ${tutorialSteps.slice(0,step).join(' · ')}. `:'';
 const blocked=step===4&&m.gathering.units.some(u=>u.kind==='soldier')?'Move a unit aside near barracks to make room for the training target.':tutorialInstructions[step];
 const progress=step===2?` Delivered ${Math.min(tutorialConfig.deliveredWood,Math.floor(tutorialDeliveredWood(m)+1e-8))}/${tutorialConfig.deliveredWood} wood.`:'';
 return `Step ${step+1}/6 · ${tutorialSteps[step]}. ${completed}${blocked}${progress}`;
}
export function renderTutorial(m:MatchState):void {const el=document.getElementById('tutorial-objective')!,message=tutorialMessage(m);if(el.textContent!==message)el.textContent=message;el.hidden=!message;document.getElementById('match-status')!.hidden=!!message;}
