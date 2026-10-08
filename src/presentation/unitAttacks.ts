import {factionForTeam} from '../config/factions';
import {workerCombatConfig,combatUnitStats,rangedStats} from '../config/unit';
import {upgradeMultiplier} from '../config/upgrades';
import {attackTargets} from '../gameplay/domains';
import {abilityEffects} from '../gameplay/abilities';
import {spellModifiers} from '../gameplay/spells';
import type {MatchState} from '../gameplay/match';
import type {Unit} from '../gameplay/gathering';
import type {Ship} from '../gameplay/navy';
const number=(n:number)=>Number(n.toFixed(2)).toString();
/** Outgoing damage before target armor/counters; reads the combat recipes and live buffs. */
export function unitAttacks(m:MatchState,u:Unit|Ship):string[]{
 const f=factionForTeam(m,'player'),tech=upgradeMultiplier(f.upgrades.attack.multiplier,m.research?.attack);
 const labels={land:'ground',sea:'ships',air:'air',building:'buildings'};
 if(u.kind==='worker')return [`Attack: Melee · ${workerCombatConfig.damagePerSecond} damage/s · ${workerCombatConfig.range}px · continuous · ground, buildings`];
 const role=u.kind==='ship'?u.role??'warship':u.archetype??'soldier';
 if(role==='transport'||role==='scout')return ['Attack: None'];
 const cfg=u.kind==='ship'?f.naval.units[role as 'warship'|'submarine']:combatUnitStats(u,f.id);
 const ranged=u.kind==='ship'?f.naval.units[role as 'warship'|'submarine']:rangedStats(u,f.id);
 const multiplier=tech*(u.kind==='ship'?1:abilityEffects(m.gathering,u).attackMultiplier*spellModifiers(u).attack);
 const targets=u.kind==='ship'?f.naval.units[role as 'warship'|'submarine'].targets:attackTargets(u,f.id);
 const name=role==='submarine'?'Torpedo':role==='warship'?'Cannon':ranged?'Projectile':'Melee';
 const damage=(ranged?.damage??('damagePerSecond' in cfg?cfg.damagePerSecond??0:0))*multiplier;
 const attacks=targets.map(domain=>{const modifier=('damageByDomain' in cfg?(cfg.damageByDomain as Partial<Record<import('../config/domains').TargetDomain,number>>|undefined)?.[domain]??1:1)*(domain==='building'&&'buildingDamageMultiplier' in cfg?cfg.buildingDamageMultiplier??1:1);return `Attack: ${name} (${labels[domain]}) · ${number(damage*modifier)} ${ranged?'damage/hit':'damage/s'} · ${cfg.range}px · ${ranged?`${ranged.attackInterval}s cooldown`:'continuous'}`;});
 return [...attacks,...(ranged?[`Attack cooldown remaining: ${number(u.attackCooldown??0)}s`]:[]),'Damage before target armor; target counters apply.'];
}
