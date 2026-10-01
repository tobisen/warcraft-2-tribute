import { gatheringConfig } from '../config/gathering';
import { combatConfig } from '../config/combat';
import { waveSchedule } from '../config/waves';
import { updateCombat, type CombatState } from './combat';
import { updateGathering, type GatheringState } from './gathering';
import type { PlacementState } from './placement';
import { updateProduction, type ProductionState } from './production';
import { updateWaves, type WaveState } from './waves';

export type MatchOutcome = 'playing' | 'defeat' | 'victory';
export interface MatchState {
  gathering: GatheringState;
  combat: CombatState;
  placement: PlacementState;
  production: ProductionState;
  soldierProduction: ProductionState;
  waves: WaveState;
  outcome: MatchOutcome;
}

/** A fresh state owns every mutable position/array; restart never reuses a previous match. */
export function createMatch(): MatchState {
  return {
    outcome: 'playing',
    gathering: {
      units: [280, 400, 520].map((x, index) => ({
        kind: 'worker', id: `unit-${index + 1}`, position: { x, y: 300 }, target: { x, y: 300 },
        selected: false, order: { kind: 'idle' }, cargo: 0,
      })),
      node: { id: 'wood-1', position: { ...gatheringConfig.nodePosition }, remaining: gatheringConfig.initialWood },
      wood: 0, base: { ...gatheringConfig.basePosition },
    },
    combat: { baseHP: combatConfig.baseHP, enemies: [] },
    waves: { elapsedSeconds: 0, nextWave: 0, nextEnemyNumber: 1 },
    placement: { active: false, barracks: null },
    production: { remainingSeconds: null, nextUnitNumber: 4 },
    soldierProduction: { remainingSeconds: null, nextUnitNumber: 4 },
  };
}

function resolveOutcome(state: MatchState): MatchState {
  const outcome: MatchOutcome = state.combat.baseHP <= 0 ? 'defeat'
    : state.waves.nextWave === waveSchedule.length && state.combat.enemies.length === 0 ? 'victory' : 'playing';
  return outcome === 'playing' ? state
    : { ...state, outcome, placement: { ...state.placement, active: false } };
}

function advance(state: MatchState, delta: number): MatchState {
  let gathering = updateGathering(state.gathering, delta);
  const worker = updateProduction(gathering, state.production, delta);
  const soldier = updateProduction(worker.gathering, state.soldierProduction, delta,
    { kind: 'barracks', footprint: state.placement.barracks });
  gathering = soldier.gathering;
  const nextUnitNumber = Math.max(worker.production.nextUnitNumber, soldier.production.nextUnitNumber);
  const fight = updateCombat(gathering, state.combat, delta);
  // Advance the clock/spawn after combat: a newborn enemy gets no time before its wave.
  const incoming = updateWaves(state.waves, fight.combat, delta);
  return resolveOutcome({
    ...state, gathering: fight.gathering, combat: incoming.combat, waves: incoming.waves,
    production: { ...worker.production, nextUnitNumber },
    soldierProduction: { ...soldier.production, nextUnitNumber },
  });
}

/** Split only at wave boundaries, retaining delta-based gameplay rather than a fixed timestep. */
export function updateMatch(state: MatchState, deltaSeconds: number): MatchState {
  if (state.outcome !== 'playing') return state;
  let current = resolveOutcome(state);
  let remaining = Math.max(0, deltaSeconds);
  while (remaining > 0 && current.outcome === 'playing') {
    const next = waveSchedule[current.waves.nextWave];
    const untilWave = next ? Math.max(0, next.atSeconds - current.waves.elapsedSeconds) : Infinity;
    if (untilWave === 0) {
      const incoming = updateWaves(current.waves, current.combat, 0);
      current = { ...current, ...incoming };
      continue;
    }
    const step = Math.min(remaining, untilWave);
    current = advance(current, step);
    remaining = Math.max(0, remaining - step);
  }
  return current;
}
