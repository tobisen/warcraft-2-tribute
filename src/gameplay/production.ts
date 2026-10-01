import { combatConfig } from '../config/combat';
import { productionConfig, soldierProductionConfig } from '../config/production';
import { soldierStats } from '../config/unit';
import { worldConfig } from '../config/buildings';
import type { GatheringState, Unit } from './gathering';
import type { Footprint } from './placement';
import type { Position } from './movement';

export interface ProductionState {
  remainingSeconds: number | null;
  nextUnitNumber: number;
}
export type ProductionBuilding = { kind: 'base' } | { kind: 'barracks'; footprint: Footprint | null };
const base: ProductionBuilding = { kind: 'base' };

export function soldierSpawn(footprint: Footprint): Position | null {
  const half = soldierStats.size / 2;
  const offset = half + soldierProductionConfig.spawnGap;
  const candidates = [
    { x: footprint.x + footprint.width + offset, y: footprint.y + footprint.height / 2 },
    { x: footprint.x - offset, y: footprint.y + footprint.height / 2 },
    { x: footprint.x + footprint.width / 2, y: footprint.y + footprint.height + offset },
    { x: footprint.x + footprint.width / 2, y: footprint.y - offset },
  ];
  return candidates.find(p => p.x - half >= 0 && p.y - half >= 0
    && p.x + half <= worldConfig.width && p.y + half <= worldConfig.height) ?? null;
}

export function canStartProduction(gathering: GatheringState, production: ProductionState, building: ProductionBuilding = base): boolean {
  const cost = building.kind === 'base' ? productionConfig.workerCost : soldierProductionConfig.cost;
  return production.remainingSeconds === null && gathering.wood >= cost
    && (building.kind === 'base' || (building.footprint !== null && soldierSpawn(building.footprint) !== null));
}

export function startProduction(gathering: GatheringState, production: ProductionState, building: ProductionBuilding = base) {
  if (!canStartProduction(gathering, production, building)) return { gathering, production };
  const cost = building.kind === 'base' ? productionConfig.workerCost : soldierProductionConfig.cost;
  const duration = building.kind === 'base' ? productionConfig.durationSeconds : soldierProductionConfig.durationSeconds;
  return {
    gathering: { ...gathering, wood: gathering.wood - cost },
    production: { ...production, remainingSeconds: duration },
  };
}

export function updateProduction(gathering: GatheringState, production: ProductionState, deltaSeconds: number, building: ProductionBuilding = base) {
  if (production.remainingSeconds === null) return { gathering, production };
  const remainingSeconds = Math.max(0, production.remainingSeconds - Math.max(0, deltaSeconds));
  if (remainingSeconds > 1e-10) return { gathering, production: { ...production, remainingSeconds } };
  const position = building.kind === 'base' ? {
    x: gathering.base.x + productionConfig.spawnOffset.x,
    y: gathering.base.y + productionConfig.spawnOffset.y,
  } : building.footprint ? soldierSpawn(building.footprint) : null;
  if (!position) return { gathering, production }; // Cannot occur for a placed barracks; no demolition exists.
  let number = production.nextUnitNumber;
  while (gathering.units.some(unit => unit.id === `unit-${number}`)) number++;
  const common = { id: `unit-${number}`, position, target: { ...position }, selected: false };
  const unit: Unit = building.kind === 'base'
    ? { ...common, kind: 'worker', cargo: 0, order: { kind: 'idle' } }
    : { ...common, kind: 'soldier', cargo: 0, hp: combatConfig.soldierHP, order: { kind: 'idle' } };
  return {
    gathering: { ...gathering, units: [...gathering.units, unit] },
    production: { remainingSeconds: null, nextUnitNumber: number + 1 },
  };
}
