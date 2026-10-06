import type {CombatState,Enemy} from './combat';
import type {WorldMap} from './map';
export function enemyBase(combat:CombatState,map:Pick<WorldMap,'design'>):Enemy|undefined{return combat.enemies.find(e=>e.kind==='base'&&e.hp>0)??(map.design==='regions'?combat.enemies.find(e=>e.buildingType==='outpost'&&e.hp>0&&e.construction?.remainingSeconds===0):undefined);}
export const hasEnemyBase=(combat:CombatState,map:Pick<WorldMap,'design'>)=>!!enemyBase(combat,map);
