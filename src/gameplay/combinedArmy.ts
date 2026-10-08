import {armyRoles,combinedArmyConfig,type ArmyRole} from '../config/combinedArmy';
import {factions,defaultFactions} from '../config/factions';
import {unitAvailability} from './productionPrerequisites';
import type {TechnologyState} from '../config/factions';
import {entityVisible} from './visibility';
import {isAir} from './domains';
import type {MatchState} from './match';
import type {CombatState} from './combat';
import type {ProductionState} from './production';
export interface ArmyPlan {nextDecisionSeconds:number;weights:Record<ArmyRole,number>}
/** Own composition/tech and current fog observations only; no enemy bank or hidden entity reads. */
export function prepareArmyPlan(m:MatchState):MatchState {
 if(!m.enemyProduction?.roster||m.paused||m.outcome!=='playing'||m.waves.elapsedSeconds+1e-9<(m.armyPlan?.nextDecisionSeconds??0))return m;
 const weights={...combinedArmyConfig.weights};
 if(m.aiProfile==='offensive'){weights.soldier=4;weights.catapult=2;}else if(m.aiProfile==='defensive'){weights.archer=3;weights.specialist=2;}else if(m.aiProfile==='economic')weights.soldier=2;
 const visibleUnits=m.gathering.units.filter(u=>(u.hp??0)>0&&(!m.fog||entityVisible(m.fog,'enemy',u)));
 if(visibleUnits.some(isAir))weights.archer=Math.max(weights.archer,4);
 if(visibleUnits.filter(u=>u.kind==='soldier'&&u.archetype!=='archer'&&!isAir(u)).length>=4){weights.archer=Math.max(weights.archer,3);weights.specialist=2;}
 const visibleDefense=m.aiContext?.humanHostile!==false&&m.placement.defenses?.some(t=>t.hp>0&&(!m.fog||entityVisible(m.fog,'enemy',{position:{x:t.footprint.x+t.footprint.width/2,y:t.footprint.y+t.footprint.height/2},footprint:t.footprint})));
 if(visibleDefense)weights.catapult=3;
 return {...m,armyPlan:{weights,nextDecisionSeconds:m.waves.elapsedSeconds+combinedArmyConfig.decisionSeconds}};
}
/** Ratios include accepted reservations; never change an already paid job or bypass prerequisites. */
export function compositionRole(plan:ArmyPlan,combat:CombatState,production:ProductionState,faction:keyof typeof factions=defaultFactions.enemy,technology?:TechnologyState,maxArmy?:number,embarked=0,acceptedJobs=0):ArmyRole|undefined {
 const committed=combat.enemies.filter(e=>e.hp>0&&!e.footprint&&e.kind!=='worker'&&e.kind!=='ship'&&!isAir(e)).reduce((n,e)=>n+factions[faction].units[e.role??'soldier'].supply,embarked)+(production.queue??[]).filter(j=>j.kind!=='air'&&j.kind!=='scout').reduce((n,j)=>n+(j.supply??1),0);
 const available=armyRoles.filter(role=>!unitAvailability(factions[faction],role,technology)&&(maxArmy!==2||role==='air'||role==='scout'||factions[faction].units[role].supply===1)&&(role==='air'||role==='scout'||committed+factions[faction].units[role].supply<=(maxArmy??Infinity)));
 const count=(role:ArmyRole)=>combat.enemies.filter(e=>e.hp>0&&!e.footprint&&e.kind!=='worker'&&(e.role??'soldier')===role).length+(production.queue??[]).filter(j=>j.kind===role).length+(role==='soldier'?embarked:0);
 return available.sort((a,b)=>count(a)/plan.weights[a]-count(b)/plan.weights[b]||(armyRoles.indexOf(a)-acceptedJobs%armyRoles.length+armyRoles.length)%armyRoles.length-(armyRoles.indexOf(b)-acceptedJobs%armyRoles.length+armyRoles.length)%armyRoles.length)[0];
}
