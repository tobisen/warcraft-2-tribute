import type {Unit} from './gathering';
import type {Ship} from './navy';
import type {Enemy} from './combat';
import type {WorldMap} from './map';
import type {FactionId} from '../config/factions';
import {combatUnitStats,rangedStats,workerCombatConfig} from '../config/unit';
import {factions} from '../config/factions';
import {navyConfig} from '../config/navy';
import {canAttackDomain,isAir,movementMap,targetDomain} from './domains';
import {canInteract,footprintDistance} from './approach';
import {enemyBody} from './enemyBody';
import {marineFlightMap} from './terrainNavigation';
import {segmentFits} from './navigation';

/** Transient interruption. The actual order and its route remain intact. */
export interface SelfDefense {attackerId:string;order:object}
export function defending(u:{order:object;selfDefense?:SelfDefense}):boolean{return !!u.selfDefense&&u.selfDefense.order===u.order;}
export function defenseTarget(u:Unit|Ship,enemies:readonly Enemy[],faction:FactionId,map?:WorldMap,visible:(e:Enemy)=>boolean=()=>true):Enemy|undefined {
 if(!defending(u))return undefined;
 return enemies.find(e=>e.id===u.selfDefense!.attackerId&&canDefend(u,e,faction,map,visible));
}
/** No pursuit: retaliation is permitted only from the unit's current position. */
export function canDefend(u:Unit|Ship,e:Enemy,faction:FactionId,map?:WorldMap,visible:(e:Enemy)=>boolean=()=>true):boolean {
 if((u.hp??0)<=0||e.hp<=0||u.order.kind==='attack'||!visible(e)||!canAttackDomain(u,e,faction))return false;
 const stats=u.kind==='ship'?u.role==='submarine'?navyConfig.submarine:factions[faction].naval.units.warship:u.kind==='worker'?workerCombatConfig:combatUnitStats(u,faction);
 const ranged=u.kind==='ship'?stats:u.kind==='soldier'?rangedStats(u,faction):null;
 if((ranged?'damage' in ranged?ranged.damage??0:0:'damagePerSecond' in stats?stats.damagePerSecond??0:0)<=0)return false;
 if('damageByDomain' in stats&&((stats.damageByDomain as Partial<Record<import('../config/domains').TargetDomain,number>>)?.[targetDomain(e)]??1)<=0)return false;
 const range=stats.range??16,body=enemyBody(e);
 if(map? !canInteract({...movementMap(map,u),attackAcrossWater:!!ranged&&targetDomain(e)==='sea',ignoreAttackOcclusion:isAir(e)},u.position,body,range):footprintDistance(u.position,body)>range)return false;
 return !ranged||!map||isAir(u)||isAir(e)||segmentFits({...marineFlightMap(map),obstacles:marineFlightMap(map).obstacles.filter(o=>!e.footprint||o.x!==body.x||o.y!==body.y||o.width!==body.width||o.height!==body.height)},u.position,e.position,0);
}

/** Enemy controllers retain their own AI/work order; the same weapon gate applies. */
export function defendingEnemy(e:Enemy):boolean{return !!e.selfDefense&&e.selfDefense.order===(e.work?.order??e.order);}
export function enemyDefender(e:Enemy):Unit|Ship {
 const order=e.work?.order??e.order??{kind:'idle' as const};
 const common={id:e.id,position:e.position,target:e.position,hp:e.hp,selected:false,order:order.kind==='attack-move'?{kind:'attack' as const,enemyId:''}:{kind:'idle' as const}};
 return e.kind==='worker'?{...common,kind:'worker',cargo:e.work?.cargo??0}:e.kind==='ship'?{...common,kind:'ship',role:e.navalRole??'transport',owner:'player'}:{...common,kind:'soldier',archetype:e.role==='soldier'?undefined:e.role,cargo:0};
}
