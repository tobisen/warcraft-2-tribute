import {factionForTeam} from '../config/factions';
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

const routeErrors: Record<RouteError, string> = { 'outside-world': 'Målet ligger utanför världen',
  'blocked-target': 'Målet är blockerat', 'blocked-start': 'Startpositionen är blockerad',
  unreachable: 'Ingen väg till målet', 'no-space': 'Ingen ledig nåbar målposition' };

export function productionLabel(gathering: GatheringState, production: ProductionState,
  outcome: MatchOutcome, building: ProductionBuilding = { kind: 'base' }, population?:Population): string {
  if (outcome !== 'playing') return 'Matchen är avslutad';
  if (building.kind === 'barracks' && !building.footprint) return 'Bygg barracks först';
  if (building.kind === 'barracks' && building.ready === false) return 'Byggnaden är ofärdig';
  const count=productionJobCount(production);
  const queueText=production.queue ? ` · kö ${count}/${queueConfig.maxJobs}${count>=queueConfig.maxJobs?' (full)':''}`:'';
  if (production.blockedSpawnKey) return 'Färdig – spawn-utgång blockerad'+queueText;
  if (production.remainingSeconds !== null) return `Producerar – ${production.remainingSeconds.toFixed(1)} s kvar${queueText}`;
  if (population && !hasPopulation(population)) return `Population full: ${population.used} + ${population.reserved} / ${population.cap}`;
  const cost = building.kind === 'base' ? costs.worker : costs.soldier;
  if (!canAfford(gathering,cost)) return `Behöver ${missingCost(gathering,cost)} till`;
  return canEnqueue(gathering, production, building,population) ? 'Redo att träna' : 'Ingen giltig spawn-position';
}

export function matchLabels(state: MatchState) {
  const faction=factionForTeam(state,'player');
  const population=populationState(state.gathering,state.placement,[state.production,state.soldierProduction]);
  const waveSchedule=scenarioWaves(state.scenario??'survival',state.difficulty??'normal');
  const definition=scenarioConfig[state.scenario??'survival'];
  const next = waveSchedule[state.waves.nextWave];
  const remaining=(node:{position:{x:number;y:number};remaining:number}|undefined)=>!node?'0.0':!state.fog||isVisible(state.fog,'player',node.position)?node.remaining.toFixed(1):'?';
  return {
    population:`Population: ${population.used} + ${population.reserved} reserverade / ${population.cap}`,
    economy: `Wood: ${state.gathering.wood.toFixed(1)} · nod: ${remaining(state.gathering.node)} · Gold: ${(state.gathering.goldBalance ?? 0).toFixed(1)} · gruva: ${remaining(state.gathering.gold)}`,
    health: `${faction.buildingNames.base}: ${Math.ceil(state.combat.baseHP)} / ${combatConfig.baseHP} HP`,
    wave: definition.victory==='enemy-base'?`${definition.label} – förstör fiendebasen`:definition.victory==='timer'?`Utposten: ${Math.max(0,definition.holdSeconds!-state.waves.elapsedSeconds).toFixed(1)} s kvar`: `Våg ${state.waves.nextWave} / ${waveSchedule.length} · ` + (next
      ? `nästa om ${Math.max(0, next.atSeconds - state.waves.elapsedSeconds).toFixed(1)} s`
      : 'alla vågor har anlänt'),
    selected: state.gathering.units.filter(u => u.selected).map(u => u.kind === 'worker'
      ? `${u.id} (${faction.unitNames.worker}): ${u.order.kind} · ${u.cargo.toFixed(1)}/${gatheringConfig.capacity} ${u.cargoType ?? 'wood'}${u.navigation?.error ? ` – ${routeErrors[u.navigation.error]}` : ''}`
      : `${u.id} (${faction.unitNames[u.archetype??'soldier']}): ${u.order.kind} · ${Math.ceil(u.hp)} HP${u.navigation?.error ? ` – ${routeErrors[u.navigation.error]}` : ''}`).join(' · ') || 'Ingen enhet markerad',
  };
}
