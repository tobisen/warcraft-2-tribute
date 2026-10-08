import {canHarm} from './players';
import {canInteract} from './approach';
import {enemyBody} from './enemyBody';
import {canAttackDomain,movementMap,isAir,targetDomain} from './domains';
import type {FactionId} from '../config/factions';
import {enemySize} from './enemyBody';
import { combatUnitStats,rangedStats } from '../config/unit';
import { archerConfig } from '../config/archer';
import { combatConfig } from '../config/combat';
import { approachRoute } from './approach';
import type { Enemy } from './combat';
import type { Soldier, Unit } from './gathering';
import type { WorldMap } from './map';
import { planRoute } from './navigation';

/** Later fog can supply this predicate; the current map is fully visible. */
export type EnemyVisibility = (enemy: Enemy, observer: Unit) => boolean;
export const allEnemiesVisible: EnemyVisibility = () => true;
const distance = (a: {x:number;y:number}, b: {x:number;y:number}) => Math.hypot(a.x-b.x,a.y-b.y);
function reachable(unit: Soldier, enemy: Enemy, map?: WorldMap,faction?:FactionId): boolean {
  if (!map) return true;
  map=movementMap(map,unit);
  const half=enemySize(enemy)/2;
  return approachRoute({...map,ignoreAttackOcclusion:isAir(enemy),attackAcrossWater:!!rangedStats(unit,faction)&&targetDomain(enemy)==='sea',bodyHalf:combatUnitStats(unit,faction).size/2},unit.position,enemy.footprint??{x:enemy.position.x-half,y:enemy.position.y-half,
    width:half*2,height:half*2},(rangedStats(unit,faction)?.range??combatUnitStats(unit,faction).range??combatConfig.soldierRange)).status!=='blocked';
}
export function acquireTargets(units: Unit[], enemies: Enemy[], map?: WorldMap,
  visible: EnemyVisibility = allEnemiesVisible,faction?:FactionId): Unit[] {
  return units.map(unit => {
    if(unit.kind!=='soldier'||unit.hp<=0||unit.autoDisabled||unit.order.kind==='hunt') return unit;
    if(unit.order.kind==='move'&&!unit.attackMoveTarget) return unit;
    // An explicit attack has priority and is never replaced by proximity targeting.
    if(unit.order.kind==='attack'&&!unit.autoOrigin&&unit.commandMode?.kind!=='hold') return unit;
    const origin=unit.autoOrigin??unit.position;
    const valid=(enemy:Enemy)=>canHarm('player',enemy.playerId??'enemy')&&visible(enemy,unit)&&enemy.hp>0&&canAttackDomain(unit,enemy,faction??'crown')
      &&distance(origin,enemy.position)<=(rangedStats(unit,faction)?.aggroRange??combatUnitStats(unit,faction).aggroRange??combatConfig.soldierAggroRange)
      &&(unit.commandMode?.kind==='hold'?(map?canInteract({...movementMap(map,unit),ignoreAttackOcclusion:isAir(enemy),attackAcrossWater:!!rangedStats(unit,faction)&&targetDomain(enemy)==='sea'},unit.position,enemyBody(enemy),rangedStats(unit,faction)?.range??combatUnitStats(unit,faction).range??combatConfig.soldierRange):distance(unit.position,enemy.position)<=(rangedStats(unit,faction)?.range??combatUnitStats(unit,faction).range??combatConfig.soldierRange)):reachable(unit,enemy,map,faction));
    const current=unit.order.kind==='attack'?enemies.find(e=>unit.order.kind==='attack'&&e.id===unit.order.enemyId):undefined;
    if(current&&valid(current))return unit;
    const target=enemies.filter(valid).sort((a,b)=>distance(unit.position,a.position)-distance(unit.position,b.position)
      ||a.id.localeCompare(b.id,'en',{numeric:true}))[0];
    if(target)return {...unit,autoOrigin:{...origin},navigation:undefined,order:{kind:'attack' as const,enemyId:target.id}};
    if(unit.commandMode?.kind==='hold')return {...unit,autoOrigin:undefined,navigation:undefined,order:{kind:'idle' as const}};
    const destination=unit.attackMoveTarget??origin;
    if((unit.autoOrigin||unit.attackMoveTarget)&&distance(unit.position,destination)>1e-9) {
      if(unit.order.kind==='move')return unit;
      const navigation=map?planRoute({...movementMap(map,unit),bodyHalf:combatUnitStats(unit,faction).size/2},unit.position,destination):undefined;
      return {...unit,autoOrigin:undefined,target:{...destination},navigation,
        ...(navigation?.status==='blocked'?{attackMoveTarget:undefined}:{}),
        order:{kind:navigation?.status==='blocked'?'idle' as const:'move' as const}};
    }
    return {...unit,autoOrigin:undefined,attackMoveTarget:undefined,...(unit.order.kind==='attack'?{navigation:undefined,order:{kind:'idle' as const}}:{})};
  });
}
