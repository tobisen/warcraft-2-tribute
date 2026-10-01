import { combatConfig } from '../config/combat';
import { soldierStats } from '../config/unit';
import type { GatheringState, Unit } from './gathering';
import { moveTowards, type Position } from './movement';

export interface Enemy { id: string; position: Position; hp: number }
export interface CombatState { enemies: Enemy[]; baseHP: number }

export function enemyAt(enemies: Enemy[], point: Position): Enemy | undefined {
  return [...enemies].reverse().find(e => Math.abs(e.position.x - point.x) <= combatConfig.enemySize / 2
    && Math.abs(e.position.y - point.y) <= combatConfig.enemySize / 2);
}

export function orderAttack(units: Unit[], enemyId: string): Unit[] {
  return units.map(unit => unit.kind === 'soldier' && unit.selected
    ? { ...unit, order: { kind: 'attack', enemyId } } : unit);
}

/** Consume travel time before melee damage; positions/ranges use centre distances. */
function approach(position: Position, target: Position, speed: number, range: number, delta: number) {
  const distance = Math.hypot(target.x - position.x, target.y - position.y);
  const travel = Math.max(0, distance - range) / speed;
  return {
    position: moveTowards(position, target, speed, Math.min(delta, travel)),
    attackSeconds: Math.max(0, delta - travel),
  };
}

export function updateCombat(gathering: GatheringState, combat: CombatState, deltaSeconds: number) {
  const delta = Math.max(0, deltaSeconds);
  const damage = new Map<string, number>();
  let units = gathering.units.map(unit => {
    if (unit.kind !== 'soldier' || unit.hp <= 0 || unit.order.kind !== 'attack') return unit;
    const enemy = combat.enemies.find(e => e.id === (unit.order.kind === 'attack' ? unit.order.enemyId : '') && e.hp > 0);
    if (!enemy) return { ...unit, order: { kind: 'idle' as const } };
    const step = approach(unit.position, enemy.position, soldierStats.speed, combatConfig.soldierRange, delta);
    damage.set(enemy.id, (damage.get(enemy.id) ?? 0) + step.attackSeconds * combatConfig.soldierDamagePerSecond);
    return { ...unit, position: step.position };
  });
  // Both sides attack from the same live snapshot, so lethal blows are simultaneous.
  const soldierDamage = new Map<string, number>();
  let baseDamage = 0;
  const movingEnemies = combat.enemies.filter(e => e.hp > 0).map(enemy => {
    const soldiers = gathering.units.filter(unit => unit.kind === 'soldier' && unit.hp > 0);
    let target: typeof soldiers[number] | undefined;
    let closest = combatConfig.enemyAggroRange;
    for (const soldier of soldiers) {
      const distance = Math.hypot(soldier.position.x - enemy.position.x, soldier.position.y - enemy.position.y);
      if (distance <= closest && (!target || distance < closest)) { target = soldier; closest = distance; }
    }
    const step = approach(enemy.position, target?.position ?? gathering.base,
      combatConfig.enemySpeed, combatConfig.enemyRange, delta);
    const amount = step.attackSeconds * combatConfig.enemyDamagePerSecond;
    if (target) soldierDamage.set(target.id, (soldierDamage.get(target.id) ?? 0) + amount);
    else baseDamage += amount;
    return { ...enemy, position: step.position };
  });
  units = units.map(unit => unit.kind === 'soldier'
    ? { ...unit, hp: Math.max(0, unit.hp - (soldierDamage.get(unit.id) ?? 0)) } : unit)
    .filter(unit => unit.kind !== 'soldier' || unit.hp > 0);
  const enemies = movingEnemies.map(enemy => ({ ...enemy, hp: Math.max(0, enemy.hp - (damage.get(enemy.id) ?? 0)) })).filter(e => e.hp > 0);
  units = units.map(unit => unit.kind === 'soldier' && unit.order.kind === 'attack'
    && !enemies.some(e => e.id === (unit.order.kind === 'attack' ? unit.order.enemyId : ''))
    ? { ...unit, order: { kind: 'idle' as const } } : unit);
  return { gathering: { ...gathering, units }, combat: { ...combat, enemies, baseHP: Math.max(0, combat.baseHP - baseDamage) } };
}
