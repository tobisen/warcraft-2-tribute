import {bossDefinitions,bossRules} from '../config/bosses';
import {factions,type FactionId} from '../config/factions';
import {combatConfig} from '../config/combat';
import {forgeConfig} from '../config/upgrades';
import {enemyExpansionConfig} from '../config/enemyExpansion';
import type {Enemy} from './combat';
import type {Soldier} from './gathering';
import {rangedStats} from '../config/unit';

/** Missing role is the pre-141 generic army profile, retained by old saves. */
export function enemyUnitStats(e:Enemy,faction:FactionId='clans'){
 if(e.boss){const b=bossDefinitions[e.boss];return {hp:b.hp,speed:0,size:bossRules.size,range:bossRules.range,aggroRange:bossRules.range,damagePerSecond:0,supply:0};}
 faction=e.faction??faction;
 const profile=e.role?factions[faction].units[e.role]:undefined;
 return {...profile,hp:profile?.hp??combatConfig.enemyHP,speed:profile?.speed??combatConfig.enemySpeed,size:profile?.size??combatConfig.enemySize,range:profile?.range??combatConfig.enemyRange,aggroRange:profile?.aggroRange??combatConfig.enemyAggroRange,damagePerSecond:profile?.damagePerSecond??combatConfig.enemyDamagePerSecond,supply:profile?.supply??1};

}
export function enemySoldier(e:Enemy,faction:FactionId):Soldier{
 return {id:e.id,owner:'player',kind:'soldier',...(e.role&&e.role!=='soldier'?{archetype:e.role}:{}),faction,
  ...(e.mana!==undefined?{mana:e.mana}:{}),...(e.spellCooldowns?{spellCooldowns:e.spellCooldowns}:{}),...(e.spellEffects?{spellEffects:e.spellEffects}:{}),position:e.position,target:e.position,hp:e.hp,cargo:0,selected:false,order:{kind:'idle'},
  ...(e.attackCooldown!==undefined?{attackCooldown:e.attackCooldown}:{}),...(e.ability?{ability:e.ability}:{})};
}
export const enemyRangedStats=(e:Enemy,faction:FactionId)=>e.boss?{range:bossRules.range,damage:bossDefinitions[e.boss].damage,attackInterval:bossDefinitions[e.boss].attackInterval,projectileSpeed:bossRules.projectileSpeed,projectileLifetime:bossRules.projectileLifetime,hitRadius:24,splashRadius:bossDefinitions[e.boss].splashRadius}:e.role?rangedStats(enemySoldier(e,faction),faction):undefined;
export const enemySupply=(e:Enemy,faction:FactionId)=>e.kind==='worker'?1:e.kind==='ship'?factions[e.faction??faction].naval.units[e.navalRole??'transport'].supply:e.footprint?0:enemyUnitStats(e,faction).supply;
export function enemyMaximumHP(e:Enemy,faction:FactionId):number{
 const f=factions[e.faction??faction];
 if(e.kind==='worker')return f.units.worker.hp;
 if(e.kind==='ship')return f.naval.units[e.navalRole??'transport'].hp;
 if(e.kind==='base')return e.legacyProfile?combatConfig.baseHP:f.buildings.base.hp;
 if(e.kind==='building'){
  if(e.buildingType==='outpost')return enemyExpansionConfig.hp;
  if(e.buildingType==='siegeWorks')return f.buildings.siegeWorks.hp;
  if(e.buildingType==='aviary')return f.buildings.aviary.hp;
  if(e.buildingType==='stable')return f.buildings.stable.hp;
  if(e.buildingType==='academy')return f.buildings.academy.hp;
  if(e.buildingType==='harbor')return f.naval.harbor.hp;
  if(e.legacyProfile)return e.buildingType==='farm'?combatConfig.farmHP:e.buildingType==='forge'?forgeConfig.hp:combatConfig.barracksHP;
  return f.buildings[e.buildingType==='farm'?'farm':e.buildingType==='forge'?'forge':'barracks'].hp;
 }
 return enemyUnitStats(e,faction).hp;
}
