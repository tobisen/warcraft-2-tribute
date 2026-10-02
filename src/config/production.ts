import { costs } from './economy';
export const productionConfig = {
  workerCost: costs.worker.wood,
  durationSeconds: 5,
  spawnOffset: { x: 60, y: 0 },
};

export const soldierProductionConfig = {
  cost: costs.soldier.wood,
  durationSeconds: 5,
  spawnGap: 8,
};

export const queueConfig = {maxJobs:3,activeRefund:0.5,queuedRefund:1};
