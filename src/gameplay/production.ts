import { productionConfig } from '../config/production';
import type { GatheringState, Worker } from './gathering';

export interface ProductionState {
  remainingSeconds: number | null;
  nextWorkerNumber: number;
}

export function canStartProduction(gathering: GatheringState, production: ProductionState): boolean {
  return production.remainingSeconds === null && gathering.wood >= productionConfig.workerCost;
}

export function startProduction(gathering: GatheringState, production: ProductionState) {
  if (!canStartProduction(gathering, production)) return { gathering, production };
  return {
    gathering: { ...gathering, wood: gathering.wood - productionConfig.workerCost },
    production: { ...production, remainingSeconds: productionConfig.durationSeconds },
  };
}

export function updateProduction(gathering: GatheringState, production: ProductionState, deltaSeconds: number) {
  if (production.remainingSeconds === null) return { gathering, production };
  const remainingSeconds = Math.max(0, production.remainingSeconds - Math.max(0, deltaSeconds));
  // Small rounding error from repeated fractional deltas must not delay completion.
  if (remainingSeconds > 1e-10) {
    return { gathering, production: { ...production, remainingSeconds } };
  }
  let number = production.nextWorkerNumber;
  while (gathering.workers.some(worker => worker.id === `unit-${number}`)) number++;
  const position = {
    x: gathering.base.x + productionConfig.spawnOffset.x,
    y: gathering.base.y + productionConfig.spawnOffset.y,
  };
  const worker: Worker = {
    id: `unit-${number}`, position, target: { ...position },
    selected: false, cargo: 0, order: { kind: 'idle' },
  };
  return {
    gathering: { ...gathering, workers: [...gathering.workers, worker] },
    production: { remainingSeconds: null, nextWorkerNumber: number + 1 },
  };
}
