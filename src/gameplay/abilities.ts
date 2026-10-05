import {isAir} from './domains';
import {text as uiText} from '../text';
import {abilityConfig} from '../config/abilities';
import type {GatheringState,Unit,Soldier} from './gathering';
export interface AbilityState {activeSeconds:number;cooldownSeconds:number}
export function abilityFor(g:GatheringState){return abilityConfig[g.faction??'crown'];}
export function abilityReady(unit:Unit):boolean {return unit.kind==='soldier'&&!isAir(unit)&&unit.hp>0&&(unit.ability?.cooldownSeconds??0)<=1e-9;}
/** Self-buff only: never reads enemies/hidden targets and keeps orders/selection. */
export function useAbility(g:GatheringState,playing=true):GatheringState {
 if(!playing||!g.units.some(u=>u.selected&&abilityReady(u)))return g;
 const config=abilityFor(g);
 return {...g,units:g.units.map(u=>u.kind==='soldier'&&u.selected&&abilityReady(u)?{...u,ability:{activeSeconds:config.durationSeconds,cooldownSeconds:config.cooldownSeconds}}:u)};
}
const remaining=(value:number,delta:number)=>value-delta>1e-9?value-delta:0;
export function advanceAbilities(g:GatheringState,delta:number):GatheringState {
 if(delta<=0||!g.units.some(u=>u.kind==='soldier'&&u.ability&&(u.ability.cooldownSeconds>0||u.ability.activeSeconds>0)))return g;
 return {...g,units:g.units.map(u=>u.kind==='soldier'&&u.ability?{...u,ability:{activeSeconds:remaining(u.ability.activeSeconds,delta),cooldownSeconds:remaining(u.ability.cooldownSeconds,delta)}}:u)};
}
export function abilityEffects(g:GatheringState,u:Unit,elapsed=0){return u.kind==='soldier'&&(u.ability?.activeSeconds??0)-elapsed>1e-9?abilityFor(g):{attackMultiplier:1,defenseMultiplier:1};}
export function abilityStatus(g:GatheringState):string {
 const selected=g.units.filter((u):u is Soldier=>u.selected&&u.kind==='soldier');
 return selected.length?selected.map(u=>`${u.id}: ${(u.ability?.activeSeconds??0)>0?`active ${u.ability!.activeSeconds.toFixed(1)} s`:abilityReady(u)?'ready':'cooldown'}${(u.ability?.cooldownSeconds??0)>0?` · ${u.ability!.cooldownSeconds.toFixed(1)} s until ready`:''}`).join(' · '):uiText.selectCombatUnitsToUseTheAbility;
}
