import { cleanDestroyed } from './destruction';
import { updateConstruction, barracksReady } from './construction';
import { arenaConfig } from '../config/arena';
import { createMap, type WorldMap } from './map';
import { gatheringConfig, goldConfig } from '../config/gathering';
import { combatConfig } from '../config/combat';
import { waveSchedule } from '../config/waves';
import { updateCombat, type CombatState } from './combat';
import { updateGathering, type GatheringState } from './gathering';
import { placementObstacles, type PlacementState } from './placement';
import type { ProductionState } from './production';
import { updateQueuedProduction } from './productionQueue';
import { updateWaves, type WaveState } from './waves';

export type MatchOutcome = 'playing' | 'defeat' | 'victory';
export interface MatchState {
  map: WorldMap;
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
  const state: MatchState = {
    outcome: 'playing',
    map: createMap(),
    gathering: {
      units: arenaConfig.workers.map((position, index) => ({
        kind: 'worker',owner:'player',hp:combatConfig.workerHP, id: `unit-${index + 1}`, position: { ...position }, target: { ...position },
        selected: false, order: { kind: 'idle' }, cargo: 0,
      })),
      gold: {id:'gold-1',resource:goldConfig.resource,position:{...goldConfig.position},remaining:goldConfig.initialAmount},
      goldBalance:0,
      node: { resource:'wood', id: 'wood-1', position: { ...gatheringConfig.nodePosition }, remaining: gatheringConfig.initialWood },
      lostCargo:{wood:0,gold:0},wood: 0, base: { ...gatheringConfig.basePosition },
    },
    combat: {baseOwner:'player', baseHP: combatConfig.baseHP, enemies: [] },
    waves: { elapsedSeconds: 0, nextWave: 0, nextEnemyNumber: 1 },
    placement: { active: false, barracks: null,farms:[],nextFarmNumber:1 },
    production: { remainingSeconds: null, nextUnitNumber: 4 },
    soldierProduction: { remainingSeconds: null, nextUnitNumber: 4 },
  };
  state.map.obstacles.push(...placementObstacles(state.gathering));
  return state;
}

function resolveOutcome(state: MatchState): MatchState {
  const outcome: MatchOutcome = state.combat.baseHP <= 0 ? 'defeat'
    : state.waves.nextWave === waveSchedule.length && state.combat.enemies.length === 0 ? 'victory' : 'playing';
  return outcome === 'playing' ? state
    : { ...state, outcome, placement: { ...state.placement, active: false } };
}

function advance(state: MatchState, delta: number): MatchState {
  state=cleanDestroyed(state);
  let gathering = updateGathering(state.gathering, delta, state.map);
  const building = updateConstruction(gathering,state.placement,state.map,delta);
  const fight=updateCombat(building.gathering,state.combat,delta,state.map,building.placement);
  const cleaned=cleanDestroyed({...state,gathering:fight.gathering,combat:fight.combat,placement:fight.placement??building.placement});
  const worker=cleaned.combat.baseHP>0?updateQueuedProduction(cleaned.gathering,cleaned.production,delta,{kind:'base'},
    {map:cleaned.map,enemies:cleaned.combat.enemies}):{gathering:cleaned.gathering,production:cleaned.production};
  const soldier=cleaned.combat.baseHP>0?updateQueuedProduction(worker.gathering,cleaned.soldierProduction,delta,
    {kind:'barracks',footprint:cleaned.placement.barracks,ready:barracksReady(cleaned.placement)},
    {map:cleaned.map,enemies:cleaned.combat.enemies}):{gathering:worker.gathering,production:cleaned.soldierProduction};
  const nextUnitNumber=Math.max(worker.production.nextUnitNumber,soldier.production.nextUnitNumber);
  const incoming=updateWaves(cleaned.waves,cleaned.combat,delta);
  return resolveOutcome({...cleaned,gathering:soldier.gathering,combat:incoming.combat,waves:incoming.waves,
    production:{...worker.production,nextUnitNumber},soldierProduction:{...soldier.production,nextUnitNumber}});
}

/** Split only at wave boundaries, retaining delta-based gameplay rather than a fixed timestep. */
export function updateMatch(state: MatchState, deltaSeconds: number): MatchState {
  if (state.outcome !== 'playing') return state;
  let current = resolveOutcome(cleanDestroyed(state));
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
