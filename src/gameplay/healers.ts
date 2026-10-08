import {factions,defaultFactions,type FactionId} from '../config/factions';
import {spells,spellAIConfig} from '../config/spells';
import {campaignActionReason} from '../config/campaignContent';
import {canSupport,ownerOf} from './players';
import {playerEliminated} from './teamResults';
import {entityVisible} from './visibility';
import {syncProjectedCombat} from './multiplePlayers';
import {enqueueProduction,updateQueuedProduction} from './productionQueue';

import {technologyFor} from './productionPrerequisites';
import {matchPopulation} from './navy';
import {hasMainBase} from './extraBases';
import type {MatchState} from './match';
import type {Unit,Soldier} from './gathering';
import type {Enemy} from './combat';
import type {Position} from './movement';
type Body=Unit|Enemy;
const role=(u:Body)=>u.kind==='worker'?'worker':u.kind==='soldier'?u.archetype??'soldier':'role'in u?u.role??'soldier':'soldier';
const faction=(m:MatchState,u:Body):FactionId=>('faction'in u?u.faction:undefined)??(m.factions??defaultFactions)[m.gathering.units.some(x=>x.id===u.id)?'player':'enemy'];
const owner=(m:MatchState,u:Body)=>m.gathering.units.some(x=>x.id===u.id)?'player':ownerOf(u as Enemy);
function bodies(m:MatchState):Body[]{return [...m.gathering.units,...m.combat.enemies];}
export function isHealer(u:Body|undefined):u is Soldier|Enemy{return !!u&&role(u)==='healer';}
export function healerMaximumHP(m:MatchState,u:Body):number{return factions[faction(m,u)].units[role(u)].hp;}
function visible(m:MatchState,caster:Body,target:Body):boolean{if(!m.fog)return true;const id=owner(m,caster);const bot=m.multiplePlayers?.ai.find(b=>b.id===id);return entityVisible(bot?{...m.fog,teams:{...m.fog.teams,enemy:bot.vision}}:m.fog,id==='player'?'player':'enemy',target);}
export function healerCasterReason(m:MatchState,casterId:string):string|null{
 const caster=bodies(m).find(u=>u.id===casterId);if(!isHealer(caster)||caster.hp!<=0)return 'Select a living healer';
 if(m.paused||m.outcome!=='playing')return 'Match is paused or ended';
 if(m.multiplePlayers&&playerEliminated(m,owner(m,caster)))return 'Player eliminated';
 if(owner(m,caster)==='player'){const locked=campaignActionReason(m,'cast-heal');if(locked)return locked;}
 if((caster.spellCooldowns?.heal??0)>1e-9)return `Cooldown ${caster.spellCooldowns!.heal!.toFixed(1)}s`;
 if((caster.mana??factions[faction(m,caster)].units.healer.mana!.initial)+1e-9<spells.heal.manaCost)return `Needs ${spells.heal.manaCost} mana`;
 return null;
}
export function healerTargetReason(m:MatchState,casterId:string,targetId:string):string|null{
 const reason=healerCasterReason(m,casterId);if(reason)return reason;
 const caster=bodies(m).find(u=>u.id===casterId)!,target=bodies(m).find(u=>u.id===targetId);
 if(!target||target.hp!<=0||'footprint'in target&&!!target.footprint||!['worker','soldier','unit',undefined].includes(target.kind))return 'Choose a living biological unit';
 if(casterId===targetId)return 'Cannot heal self';
 if(factions[faction(m,target)].units[role(target)].healable===false)return 'Mechanical units cannot be healed';
 if(m.multiplePlayers){if(playerEliminated(m,owner(m,target))||!canSupport(owner(m,caster),owner(m,target),m.multiplePlayers.roster))return 'Choose an allied unit';}else if(owner(m,caster)!==owner(m,target))return 'Choose an allied unit';
 if(!visible(m,caster,target))return 'Target outside current vision';
 if(Math.hypot(target.position.x-caster.position.x,target.position.y-caster.position.y)>spells.heal.range+1e-9)return `Target outside ${spells.heal.range}px range`;
 if(target.hp!>=healerMaximumHP(m,target))return 'Target at full HP';
 return null;
}
export function castHeal(m:MatchState,casterId:string,targetId:string):{match:MatchState;reason:string|null}{
 const reason=healerTargetReason(m,casterId,targetId);if(reason)return {match:m,reason};
 const change=<T extends Body>(u:T):T=>u.id===casterId?{...u,healFlash:m.waves.elapsedSeconds+.6,mana:((u as Soldier|Enemy).mana??factions[faction(m,u)].units.healer.mana!.initial)-spells.heal.manaCost,spellCooldowns:{...(u as Soldier|Enemy).spellCooldowns,heal:spells.heal.cooldown}}:u.id===targetId?{...u,hp:Math.min(healerMaximumHP(m,u),u.hp!+spells.heal.healHP!),healFlash:m.waves.elapsedSeconds+.6}:u;
 return {reason:null,match:syncProjectedCombat({...m,gathering:{...m.gathering,units:m.gathering.units.map(change)},combat:{...m.combat,enemies:m.combat.enemies.map(change)}})};
}
export function healerTargetAt(m:MatchState,casterId:string,p:Position){return bodies(m).find(u=>Math.abs(u.position.x-p.x)<=16&&Math.abs(u.position.y-p.y)<=16&&!healerTargetReason(m,casterId,u.id))?.id;}
export function toggleHealAutocast(m:MatchState):MatchState{if(m.paused||m.outcome!=='playing')return m;const selected=m.gathering.units.filter(u=>u.selected&&isHealer(u));const enabled=!selected.every(u=>(u as Soldier).healAutocast);return {...m,gathering:{...m.gathering,units:m.gathering.units.map(u=>u.selected&&isHealer(u)?{...u,healAutocast:enabled}:u)}};}
/** Fresh HP after every cast, twice per gameplay second. Avoid topping off a target already healed in this decision. */
export function prepareHealers(m:MatchState):MatchState{if(m.paused||m.outcome!=='playing'||Math.abs(m.waves.elapsedSeconds/spellAIConfig.decisionSeconds-Math.round(m.waves.elapsedSeconds/spellAIConfig.decisionSeconds))>1e-7)return m;const healed=new Set<string>(),casters=bodies(m).filter(u=>isHealer(u)&&u.hp!>0&&(u.healAutocast??owner(m,u)!=='player')).map(u=>u.id).sort();
 for(const id of casters){if(healerCasterReason(m,id))continue;const targets=bodies(m).filter(u=>!healerTargetReason(m,id,u.id)&&(!healed.has(u.id)||healerMaximumHP(m,u)-u.hp!>=spells.heal.healHP!)).sort((a,b)=>(healerMaximumHP(m,b)-b.hp!)-(healerMaximumHP(m,a)-a.hp!)||a.id.localeCompare(b.id));if(targets[0]){m=castHeal(m,id,targets[0].id).match;healed.add(targets[0].id);}}
 return m;}
export function healerBuilding(m:MatchState){const a=m.placement.academy;return {kind:'barracks' as const,producer:'academy' as const,unitType:'healer' as const,bounds:m.map,technology:technologyFor(m,'player'),footprint:a?.footprint??null,ready:!!a&&a.hp>0&&a.construction.remainingSeconds===0};}
export function trainHealer(m:MatchState):MatchState{const a=m.placement.academy;if(!a||m.paused||m.outcome!=='playing'||!hasMainBase(m))return m;const p=a.production??{remainingSeconds:null,queue:[],nextUnitNumber:Math.max(m.production.nextUnitNumber,m.soldierProduction.nextUnitNumber)};const r=enqueueProduction(m.gathering,p,healerBuilding(m),matchPopulation(m));return {...m,gathering:r.gathering,placement:{...m.placement,academy:{...a,production:r.production}}};}
export function updateHealerProduction(m:MatchState,delta:number):MatchState{const a=m.placement.academy;if(!a?.production)return m;const counter=Math.max(m.production.nextUnitNumber,m.soldierProduction.nextUnitNumber,a.production.nextUnitNumber,m.placement.stable?.production.nextUnitNumber??0,...(m.placement.bases??[]).map(b=>b.production.nextUnitNumber));const r=updateQueuedProduction(m.gathering,{...a.production,nextUnitNumber:counter},hasMainBase(m)?delta:0,healerBuilding(m),{map:m.map,enemies:m.combat.enemies});const nextUnitNumber=r.production.nextUnitNumber;return {...m,gathering:r.gathering,production:{...m.production,nextUnitNumber},soldierProduction:{...m.soldierProduction,nextUnitNumber},placement:{...m.placement,academy:{...a,production:r.production},...(m.placement.stable?{stable:{...m.placement.stable,production:{...m.placement.stable.production,nextUnitNumber}}}:{}),bases:m.placement.bases?.map(b=>({...b,production:{...b.production,nextUnitNumber}}))}};}
