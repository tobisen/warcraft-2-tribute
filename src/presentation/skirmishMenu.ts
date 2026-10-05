import {factionDescriptions} from '../config/factionDescriptions';
import {factions,isFactionId} from '../config/factions';
import {maps} from '../config/maps';
import {supportedPlayerCounts} from '../config/players';
import {difficultyDescription} from './matchSettings';
import type {MatchOptions} from '../gameplay/session';
const element=(id:string)=>document.getElementById(id)!;
export function bindSkirmishMenu():void{
 const setup=element('match-setup');
 const human=document.createElement('fieldset');human.id='skirmish-human';human.innerHTML='<legend>Your faction</legend><p id="skirmish-faction-description"></p>';human.prepend(element('faction-select').closest('label')!);setup.append(human);
 const opponents=document.createElement('section');opponents.id='skirmish-opponents';opponents.innerHTML='<h3>Opponents</h3><p id="skirmish-capacity" role="status"></p><fieldset id="skirmish-ai-1"><legend>AI 1</legend><p id="skirmish-ai-1-description"></p></fieldset><fieldset id="skirmish-ai-2"><legend>AI 2</legend><p id="skirmish-ai-2-description"></p></fieldset>';
 opponents.prepend(element('player-count-select').closest('label')!);setup.append(opponents);
 for(const id of ['enemy-faction-select','difficulty-select','ai-profile-select','enemy-team-select'])element('skirmish-ai-1').append(element(id).closest('label')!);
 element('skirmish-ai-1').append(element('ai-profile-description'),element('difficulty-description'));
 element('skirmish-ai-2').append(element('additional-ai-settings'),element('ai-2-team-select').closest('label')!);
 const advanced=document.createElement('details');advanced.id='skirmish-advanced';advanced.innerHTML='<summary>Advanced match settings</summary>';advanced.append(element('team-settings'),element('speed-select').closest('label')!,element('speed-description'));setup.append(advanced);
 setup.append(element('start-match'));
}
export function syncSkirmishMenu(active:boolean,options:MatchOptions):void{
 for(const id of ['skirmish-human','skirmish-opponents','skirmish-advanced'])element(id).hidden=!active;
 if(!active)return;
 const faction=options.faction??'crown',max=Math.max(...supportedPlayerCounts(options.map,options.scenario)),three=options.players?.length===3;
 element('skirmish-faction-description').textContent=factionDescriptions[faction];
 element('skirmish-capacity').textContent=`${maps[options.map].label}: ${max} validated start positions · You + up to ${max-1} AI.${max===2&&options.scenario==='skirmish'?' Choosing two AI opponents switches this map to Plains 96 × 96, which has three start positions.':''}${options.scenario!=='skirmish'?' Survival uses fixed scenario starts.':''}`;
 element('skirmish-ai-2').hidden=!three;
 for(const id of ['player','enemy','ai-2'])element(`${id}-team-select`).closest('label')!.hidden=!three;
 const opponent=options.enemyFaction??(faction==='crown'?'clans':'crown');element('skirmish-ai-1-description').textContent=`${factions[opponent].label}: ${factionDescriptions[opponent]}`;
 const selected=(element('ai-2-faction-select') as HTMLSelectElement).value,second=isFactionId(selected)?selected:'elves';
 element('skirmish-ai-2-description').textContent=`${factions[second].label}: ${factionDescriptions[second]} ${difficultyDescription[options.players?.[2].difficulty??options.difficulty]}`;
 const difficultyLabel=element('difficulty-select').closest('label')!.querySelector('span');if(difficultyLabel&&difficultyLabel.textContent!=='Difficulty')difficultyLabel.textContent='Difficulty';
}
