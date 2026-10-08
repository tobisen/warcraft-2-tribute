import {trainedHealerMana} from '../config/roleResearch';
import {factions,defaultFactions,type FactionId} from '../config/factions';
import type {Unit} from './gathering';
import type {Enemy} from './combat';
import type {MatchState} from './match';
export function manaFor(unit:Unit,faction:FactionId,research?:import('./research').ResearchState){const config= unit.kind==='soldier'?factions[faction].units[unit.archetype??'soldier'].mana:undefined;return config?{...config,max:config.max+trainedHealerMana(unit.kind==='soldier'?unit.archetype:undefined,research?.healerTraining)}:undefined;}
export function currentMana(unit:Unit,faction:FactionId):number|undefined{const config=manaFor(unit,faction);return config&&unit.kind==='soldier'?unit.mana??config.initial:undefined;}
/** Gameplay time only, including embarked specialists; new spawns start at their recipe's initial mana. */
export function advanceMana(m:MatchState,delta:number):MatchState{
 if(m.paused||m.outcome!=='playing'||delta<=0)return m;
 const teams=m.factions??defaultFactions;
 const own=(u:Unit):Unit=>{const config=manaFor(u,teams.player,m.research);return config&&u.kind==='soldier'&&u.hp>0?{...u,mana:Math.min(config.max,(u.mana??config.initial)+config.regenerationPerSecond*delta)}:u;};
 const enemy=(e:Enemy):Enemy=>{const config=e.role?factions[teams.enemy].units[e.role].mana:undefined;return config&&e.hp>0?{...e,mana:Math.min(config.max+trainedHealerMana(e.role,m.enemyPolicy?.research.healerTraining),(e.mana??config.initial)+config.regenerationPerSecond*delta)}:e;};
 return {...m,gathering:{...m.gathering,units:m.gathering.units.map(own)},combat:{...m.combat,enemies:m.combat.enemies.map(enemy)},...(m.navy?{navy:{...m.navy,ships:m.navy.ships.map(s=>s.passengers?{...s,passengers:s.passengers.map(own)}:s)}}:{}),...(m.enemyNaval?{enemyNaval:{...m.enemyNaval,passengers:m.enemyNaval.passengers.map(enemy)}}:{})};
}
