import { gatheringConfig } from '../config/gathering';
import { soldierStats, unitStats } from '../config/unit';
import { moveTowards, type Position } from './movement';
import type { SelectableUnit } from './selection';

export type WorkerOrder = { kind: 'idle' } | { kind: 'move' }
  | { kind: 'gather' | 'deliver'; nodeId: string };
export interface Worker extends SelectableUnit {
  kind: 'worker';
  order: WorkerOrder;
  cargo: number;
}
export interface Soldier extends SelectableUnit {
  kind: 'soldier';
  order: { kind: 'idle' } | { kind: 'move' } | { kind: 'attack'; enemyId: string };
  hp: number;
  cargo: 0;
}
export type Unit = Worker | Soldier;
export interface ResourceNode {
  id: string;
  position: Position;
  remaining: number;
}
export interface GatheringState {
  units: Unit[];
  node: ResourceNode;
  base: Position;
  wood: number;
}

export function isNodeHit(point: Position, node: ResourceNode): boolean {
  return Math.hypot(point.x - node.position.x, point.y - node.position.y) <= gatheringConfig.nodeRadius;
}

export function orderUnits(units: Unit[], target: Position, node?: ResourceNode): Unit[] {
  return units.map(unit => {
    if (!unit.selected || (node && unit.kind === 'soldier')) return unit;
    if (unit.kind === 'soldier') return { ...unit, target: { ...target }, order: { kind: 'move' } };
    return {
      ...unit,
      target: { ...(node ? node.position : target) },
      order: !node ? { kind: 'move' }
        : unit.cargo >= gatheringConfig.capacity || (node.remaining <= 0 && unit.cargo > 0)
          ? { kind: 'deliver', nodeId: node.id }
          : node.remaining > 0 ? { kind: 'gather', nodeId: node.id } : { kind: 'idle' },
    };
  });
}

/** Spend delta across approach, gathering, delivery and return without losing time. */
export function updateGathering(state: GatheringState, deltaSeconds: number): GatheringState {
  let remaining = state.node.remaining;
  let wood = state.wood;
  const units = state.units.map(original => {
    if (original.kind === 'soldier') {
      if (original.order.kind !== 'move') return original;
      const position = moveTowards(original.position, original.target, soldierStats.speed, Math.max(0, deltaSeconds));
      return { ...original, position, order: position.x === original.target.x && position.y === original.target.y
        ? { kind: 'idle' as const } : original.order };
    }
    let worker: Worker = { ...original, position: { ...original.position } };
    let time = Math.max(0, deltaSeconds);
    while (worker.order.kind !== 'idle') {
      if (worker.order.kind === 'move') {
        worker.position = moveTowards(worker.position, worker.target, unitStats.speed, time);
        if (worker.position.x === worker.target.x && worker.position.y === worker.target.y) {
          worker.order = { kind: 'idle' };
        }
        break;
      }
      const nodeId = worker.order.nodeId;
      if (worker.order.kind === 'gather' && (remaining <= 0 || worker.cargo >= gatheringConfig.capacity)) {
        worker.order = worker.cargo > 0 ? { kind: 'deliver', nodeId } : { kind: 'idle' };
        continue;
      }
      const delivering = worker.order.kind === 'deliver';
      const destination = delivering ? state.base : state.node.position;
      const range = delivering ? gatheringConfig.deliveryRange : gatheringConfig.range;
      const distance = Math.hypot(worker.position.x - destination.x, worker.position.y - destination.y);
      const travel = Math.max(0, distance - range) / unitStats.speed;
      worker.position = moveTowards(worker.position, destination, unitStats.speed, Math.min(time, travel));
      if (travel > time) break;
      time = Math.max(0, time - travel);
      if (delivering) {
        wood += worker.cargo;
        worker.cargo = 0;
        worker.order = remaining > 0 ? { kind: 'gather', nodeId } : { kind: 'idle' };
        continue;
      }
      const amount = Math.min(remaining, gatheringConfig.capacity - worker.cargo,
        gatheringConfig.woodPerSecond * time);
      worker.cargo += amount;
      remaining -= amount;
      time = Math.max(0, time - amount / gatheringConfig.woodPerSecond);
      if (remaining <= 0 || worker.cargo >= gatheringConfig.capacity) {
        worker.order = { kind: 'deliver', nodeId };
      } else {
        break;
      }
    }
    return worker;
  });
  // Depletion also redirects units already processed in this step.
  return {
    ...state,
    units: remaining === 0 ? units.map(worker => worker.kind === 'worker' && worker.order.kind === 'gather'
      ? { ...worker, order: worker.cargo > 0
        ? { kind: 'deliver', nodeId: worker.order.nodeId } : { kind: 'idle' } } : worker) : units,
    node: { ...state.node, remaining }, wood,
  };
}
