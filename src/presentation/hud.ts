import {text as uiText} from '../text';
import {factionForTeam,productionFaction} from '../config/factions';
import { isVisible } from '../gameplay/fog';
import { canEnqueue, productionJobCount } from '../gameplay/productionQueue';
import { queueConfig } from '../config/production';
import { hasPopulation, populationState, type Population } from '../gameplay/population';
import { costs } from '../config/economy';
import { canAfford, missingCost } from '../gameplay/economy';
import type { RouteError } from '../gameplay/navigation';
import { combatConfig } from '../config/combat';
import { gatheringConfig } from '../config/gathering';
import {scenarioConfig,scenarioWaves} from '../config/scenarios';
import type { GatheringState } from '../gameplay/gathering';
import type { MatchOutcome, MatchState } from '../gameplay/match';
import { canStartProduction, type ProductionBuilding, type ProductionState } from '../gameplay/production';

const routeErrors: Record<RouteError, string> = { 'outside-world': uiText.theDestinationIsOutsideTheWorld,
  'blocked-target': uiText.theDestinationIsBlocked, 'blocked-start': uiText.theStartingPositionIsBlocked,
  unreachable: uiText.noRouteToTheDestination, 'no-space': uiText.noFreeReachableDestination };

export function productionLabel(gathering: GatheringState, production: ProductionState,
  outcome: MatchOutcome, building: ProductionBuilding = { kind: 'base' }, population?:Population): string {
  if (outcome !== 'playing') return uiText.theMatchHasEnded;
  if (building.kind === 'barracks' && !building.footprint) return uiText.buildBarracksFirst;
  if (building.kind === 'barracks' && building.ready === false) return uiText.theBuildingIsUnfinished;
  const count=productionJobCount(production);
  const queueText=production.queue ? ` · queue ${count}/${queueConfig.maxJobs}${count>=queueConfig.maxJobs?' (full)':''}`:'';
  if (production.blockedSpawnKey) return uiText.completeSpawnExitBlocked+queueText;
  if (production.remainingSeconds !== null) return `Producing – ${production.remainingSeconds.toFixed(1)} s remaining${queueText}`;
  if (population && !hasPopulation(population)) return `Population full: ${population.used} + ${population.reserved} / ${population.cap}`;
  const cost = productionFaction(gathering).units[building.kind==='base'?'worker':building.unitType??'soldier'].cost;
  if (!canAfford(gathering,cost)) return `Need ${missingCost(gathering,cost)} more`;
  return canEnqueue(gathering, production, building,population) ? uiText.readyToTrain : uiText.noValidSpawnPosition;
}

export function matchLabels(state: MatchState) {
  const faction=factionForTeam(state,'player');
  const population=populationState(state.gathering,state.placement,[state.production,state.soldierProduction]);
  const waveSchedule=scenarioWaves(state.scenario??'survival',state.difficulty??'normal');
  const definition=scenarioConfig[state.scenario??'survival'];
  const next = waveSchedule[state.waves.nextWave];
  const remaining=(node:{position:{x:number;y:number};remaining:number}|undefined)=>!node?'0.0':!state.fog||isVisible(state.fog,'player',node.position)?node.remaining.toFixed(1):'?';
  return {
    population:`Population: ${population.used} + ${population.reserved} reserved / ${population.cap}`,
    economy: `Wood: ${state.gathering.wood.toFixed(1)} · node: ${remaining(state.gathering.node)} · Gold: ${(state.gathering.goldBalance ?? 0).toFixed(1)} · mine: ${remaining(state.gathering.gold)}`,
    health: `${faction.buildingNames.base}: ${Math.ceil(state.combat.baseHP)} / ${combatConfig.baseHP} HP`,
    wave: definition.victory==='enemy-base'?`${definition.label} – destroy the enemy base`:definition.victory==='timer'?`Outpost: ${Math.max(0,definition.holdSeconds!-state.waves.elapsedSeconds).toFixed(1)} s remaining`: `Wave ${state.waves.nextWave} / ${waveSchedule.length} · ` + (next
      ? `next in ${Math.max(0, next.atSeconds - state.waves.elapsedSeconds).toFixed(1)} s`
      : uiText.allWavesHaveArrived),
    selected: state.gathering.units.filter(u => u.selected).map(u => u.kind === 'worker'
      ? `${u.id} (${faction.unitNames.worker}): ${u.order.kind} · ${u.cargo.toFixed(1)}/${gatheringConfig.capacity} ${u.cargoType ?? 'wood'}${u.navigation?.error ? ` – ${routeErrors[u.navigation.error]}` : ''}`
      : `${u.id} (${faction.unitNames[u.archetype??'soldier']}): ${u.order.kind} · ${Math.ceil(u.hp)} HP${u.navigation?.error ? ` – ${routeErrors[u.navigation.error]}` : ''}`).join(' · ') || uiText.noUnitSelected,
  };
}
