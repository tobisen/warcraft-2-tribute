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
export type EnemyVisibility = (enemy: Enemy, observer: Soldier) => boolean;
export const allEnemiesVisible: EnemyVisibility = () => true;
const distance = (a: {x:number;y:number}, b: {x:number;y:number}) => Math.hypot(a.x-b.x,a.y-b.y);
function reachable(unit: Soldier, enemy: Enemy, map?: WorldMap): boolean {
  if (!map) return true;
  const half=enemySize(enemy)/2;
  return approachRoute({...map,bodyHalf:combatUnitStats(unit).size/2},unit.position,enemy.footprint??{x:enemy.position.x-half,y:enemy.position.y-half,
    width:half*2,height:half*2},(rangedStats(unit)?.range??combatConfig.soldierRange)).status!=='blocked';
}
export function acquireTargets(units: Unit[], enemies: Enemy[], map?: WorldMap,
  visible: EnemyVisibility = allEnemiesVisible): Unit[] {
  return units.map(unit => {
    if(unit.kind!=='soldier'||unit.hp<=0||unit.autoDisabled) return unit;
    if(unit.order.kind==='move'&&!unit.attackMoveTarget) return unit;
    // An explicit attack has priority and is never replaced by proximity targeting.
    if(unit.order.kind==='attack'&&!unit.autoOrigin) return unit;
    const origin=unit.autoOrigin??unit.position;
    const valid=(enemy:Enemy)=>visible(enemy,unit)&&enemy.hp>0
      &&distance(origin,enemy.position)<=(rangedStats(unit)?.aggroRange??combatConfig.soldierAggroRange)
      &&reachable(unit,enemy,map);
    const current=unit.order.kind==='attack'?enemies.find(e=>unit.order.kind==='attack'&&e.id===unit.order.enemyId):undefined;
    if(current&&valid(current))return unit;
    const target=enemies.filter(valid).sort((a,b)=>distance(unit.position,a.position)-distance(unit.position,b.position)
      ||a.id.localeCompare(b.id,'en',{numeric:true}))[0];
    if(target)return {...unit,autoOrigin:{...origin},navigation:undefined,order:{kind:'attack' as const,enemyId:target.id}};
    const destination=unit.attackMoveTarget??origin;
    if((unit.autoOrigin||unit.attackMoveTarget)&&distance(unit.position,destination)>1e-9) {
      if(unit.order.kind==='move')return unit;
      const navigation=map?planRoute({...map,bodyHalf:combatUnitStats(unit).size/2},unit.position,destination):undefined;
      return {...unit,autoOrigin:undefined,target:{...destination},navigation,
        ...(navigation?.status==='blocked'?{attackMoveTarget:undefined}:{}),
        order:{kind:navigation?.status==='blocked'?'idle' as const:'move' as const}};
    }
    return {...unit,autoOrigin:undefined,attackMoveTarget:undefined,...(unit.order.kind==='attack'?{navigation:undefined,order:{kind:'idle' as const}}:{})};
  });
}
