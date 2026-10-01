import { gatheringConfig } from '../config/gathering';
import { unitStats } from '../config/unit';
import { moveTowards, type Position } from './movement';
import type { SelectableUnit } from './selection';

export type WorkerOrder = { kind: 'idle' } | { kind: 'move' } | { kind: 'gather'; nodeId: string };
export interface Worker extends SelectableUnit {
  order: WorkerOrder;
}
export interface ResourceNode {
  id: string;
  position: Position;
  remaining: number;
}
export interface GatheringState {
  workers: Worker[];
  node: ResourceNode;
  wood: number;
}

export function isNodeHit(point: Position, node: ResourceNode): boolean {
  return Math.hypot(point.x - node.position.x, point.y - node.position.y) <= gatheringConfig.nodeRadius;
}

export function orderWorkers(workers: Worker[], target: Position, node?: ResourceNode): Worker[] {
  return workers.map(worker => worker.selected ? {
    ...worker,
    target: { ...(node ? node.position : target) },
    order: node && node.remaining > 0
      ? { kind: 'gather', nodeId: node.id }
      : node ? { kind: 'idle' } : { kind: 'move' },
  } : worker);
}

/** Continuous wood transfer; include only the part of delta spent in range. */
export function updateGathering(state: GatheringState, deltaSeconds: number): GatheringState {
  const delta = Math.max(0, deltaSeconds);
  let remaining = state.node.remaining;
  let collected = 0;
  const workers = state.workers.map(worker => {
    if (worker.order.kind === 'idle') return worker;
    if (worker.order.kind === 'move') {
      const position = moveTowards(worker.position, worker.target, unitStats.speed, delta);
      return {
        ...worker, position,
        order: position.x === worker.target.x && position.y === worker.target.y
          ? { kind: 'idle' as const } : worker.order,
      };
    }
    if (worker.order.nodeId !== state.node.id || remaining <= 0) {
      return { ...worker, order: { kind: 'idle' as const } };
    }
    const distance = Math.hypot(worker.position.x - state.node.position.x, worker.position.y - state.node.position.y);
    const approachSeconds = Math.max(0, distance - gatheringConfig.range) / unitStats.speed;
    const position = moveTowards(worker.position, state.node.position, unitStats.speed, Math.min(delta, approachSeconds));
    const amount = Math.min(remaining, gatheringConfig.woodPerSecond * Math.max(0, delta - approachSeconds));
    remaining -= amount;
    collected += amount;
    return { ...worker, position };
  });
  // Every order aimed at this depleted node ends, including workers still approaching.
  return {
    workers: remaining === 0 ? workers.map(worker => worker.order.kind === 'gather'
      && worker.order.nodeId === state.node.id ? { ...worker, order: { kind: 'idle' } } : worker) : workers,
    node: { ...state.node, remaining },
    wood: state.wood + collected,
  };
}
