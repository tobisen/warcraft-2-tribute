import {factionDescriptions} from '../config/factionDescriptions';
import {isFactionId} from '../config/factions';
import {difficultyDescription} from './matchSettings';
import {initialDifficulty} from '../config/difficulty';
type Step='faction'|'difficulty'|'mission'|'briefing';
let step:Step='faction',wasActive=false;
const slots=new Map<HTMLElement,Comment>();
const element=(id:string)=>document.getElementById(id)!;
export function bindCampaignFlow():void{
 const flow=document.createElement('section');flow.id='campaign-flow';flow.hidden=true;
 flow.innerHTML='<p id="campaign-step" role="status"></p><button id="campaign-step-back" type="button">Previous step</button><section data-campaign-step="faction"><h3>Choose your faction</h3><p id="campaign-faction-description"></p><button id="campaign-next-faction" type="button">Choose difficulty →</button></section><section data-campaign-step="difficulty"><h3>Choose difficulty</h3><p id="campaign-difficulty-description"></p><button id="campaign-next-difficulty" type="button">Continue / Start campaign →</button></section><section data-campaign-step="mission"><button id="campaign-continue" type="button">Continue campaign →</button></section><section data-campaign-step="briefing"><h3>Mission briefing</h3></section>';
 element('match-setup').prepend(flow);
 const next=(s:Step)=>{step=s;syncCampaignFlow(true);};
 element('campaign-next-faction').addEventListener('click',()=>next('difficulty'));
 element('campaign-next-difficulty').addEventListener('click',()=>{next('mission');element('scenario-select').dispatchEvent(new Event('change'));});
 element('campaign-continue').addEventListener('click',()=>{const button=document.querySelector<HTMLButtonElement>('[data-campaign-mission][data-current="true"]');button?.click();});
 element('campaign-step-back').addEventListener('click',()=>next(step==='briefing'?'mission':step==='mission'?'difficulty':'faction'));
}
export function showCampaignBriefing(){step='briefing';syncCampaignFlow(true);}
export function syncCampaignFlow(active:boolean):void{
 const flow=document.getElementById('campaign-flow');if(!flow)return;
 if(active&&!wasActive)step='faction';wasActive=active;flow.hidden=!active;
 const moves:[[HTMLElement,Step],[HTMLElement,Step],[HTMLElement,Step],[HTMLElement,Step],[HTMLElement,Step]]=[[(element('faction-select') as HTMLSelectElement).closest('label')!,'faction'],[(element('difficulty-select') as HTMLSelectElement).closest('label')!,'difficulty'],[element('campaign-overview'),'mission'],[element('campaign-briefing'),'briefing'],[element('start-match'),'briefing']];
 for(const [node,stage] of moves){if(active){if(!slots.has(node)){const marker=document.createComment('campaign flow origin');node.before(marker);slots.set(node,marker);}const target=flow.querySelector(`[data-campaign-step="${stage}"]`)!;if(stage==='briefing')target.append(node);else target.prepend(node);}else{const marker=slots.get(node);if(marker){marker.replaceWith(node);slots.delete(node);}}}
 for(const child of element('match-setup').children)if(child!==flow)(child as HTMLElement).style.display=active?'none':'';
 if(!active)return;
 for(const node of flow.querySelectorAll<HTMLElement>('[data-campaign-step]'))node.hidden=node.dataset.campaignStep!==step;
 element('campaign-step').textContent=`Faction → Difficulty → Campaign → Briefing · ${step}`;
 element('campaign-step-back').hidden=step==='faction';
 const faction=(element('faction-select') as HTMLSelectElement).value;
 element('campaign-faction-description').textContent=factionDescriptions[isFactionId(faction)?faction:'crown'];
 element('campaign-difficulty-description').textContent=difficultyDescription[initialDifficulty((element('difficulty-select') as HTMLSelectElement).value)];
}
