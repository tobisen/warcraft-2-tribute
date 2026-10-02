import type { ControlGroups } from './controlGroups';
import { separateBodies } from './separation';
import { combatUnitStats, unitStats } from '../config/unit';
import { entityVisible } from './visibility';
import { matchFog } from './matchFog';
import type { FogState } from './fog';
import { createEnemyAI,updateEnemyAI,type EnemyAIState } from './enemyAI';
import { createEnemyProduction,updateEnemyProduction,type EnemyProductionState } from './enemyProduction';
import { scenarioConfig,scenarioWaves,enemyBaseConfig,type MatchScenario } from '../config/scenarios';
import { createResearch,updateResearch,type ResearchState } from './research';
import { cleanDestroyed } from './destruction';
import { updateConstruction, barracksReady } from './construction';
import { arenaConfig } from '../config/arena';
import { createMap, type WorldMap } from './map';
import { gatheringConfig, goldConfig } from '../config/gathering';
import { combatConfig } from '../config/combat';
import { difficultyProfiles,type Difficulty } from '../config/difficulty';
import { updateCombat, type CombatState } from './combat';
import { updateGathering, type GatheringState } from './gathering';
import { placementObstacles, type PlacementState } from './placement';
import type { ProductionState } from './production';
import { updateQueuedProduction } from './productionQueue';
import { updateWaves, type WaveState } from './waves';

export type MatchOutcome = 'playing' | 'defeat' | 'victory';
export interface MatchState {
  map: WorldMap;
  fog?:FogState;
  controlGroups?:ControlGroups;
  gathering: GatheringState;
  combat: CombatState;
  placement: PlacementState;
  production: ProductionState;
  soldierProduction: ProductionState;
  waves: WaveState;
  outcome: MatchOutcome;
  paused?:boolean;
  research?:ResearchState;
  scenario?:MatchScenario;
  difficulty?:Difficulty;
  enemyProduction?:EnemyProductionState;
  enemyAI?:EnemyAIState;
}

/** A fresh state owns every mutable position/array; restart never reuses a previous match. */
export function createMatch(scenario:MatchScenario='survival',difficulty:Difficulty='normal'): MatchState {
  const state: MatchState = {
    outcome: 'playing',paused:false,controlGroups:{},scenario,difficulty,research:createResearch(),
    map: createMap(),
    gathering: {
      units: arenaConfig.workers.map((position, index) => ({
        kind: 'worker',owner:'player',hp:combatConfig.workerHP, id: `unit-${index + 1}`, position: { ...position }, target: { ...position },
        selected: false, order: { kind: 'idle' }, cargo: 0,
      })),
      gold: {id:'gold-1',resource:goldConfig.resource,position:{...goldConfig.position},remaining:goldConfig.initialAmount},
      goldBalance:scenarioConfig[scenario].initial.gold,
      node: { resource:'wood', id: 'wood-1', position: { ...gatheringConfig.nodePosition }, remaining: gatheringConfig.initialWood },
      lostCargo:{wood:0,gold:0},wood: scenarioConfig[scenario].initial.wood, base: { ...gatheringConfig.basePosition },
    },
    combat: {baseOwner:'player', baseHP: combatConfig.baseHP, enemies: [] },
    waves: { elapsedSeconds: 0, nextWave: 0, nextEnemyNumber: 1 },
    placement: { active: false, barracks: null,farms:[],nextFarmNumber:1 },
    production: { remainingSeconds: null, nextUnitNumber: 4 },
    soldierProduction: { remainingSeconds: null, nextUnitNumber: 4 },
  };
  if(scenarioConfig[scenario].enemyBase){state.enemyProduction=createEnemyProduction(difficultyProfiles[difficulty]);state.enemyAI=createEnemyAI();const footprint={...enemyBaseConfig.footprint};state.combat.enemies.push({id:enemyBaseConfig.id,kind:'base',owner:'enemy',hp:enemyBaseConfig.hp,footprint,position:{x:footprint.x+footprint.width/2,y:footprint.y+footprint.height/2}});state.map.obstacles.push(footprint);}
  state.map.obstacles.push(...placementObstacles(state.gathering));
  state.fog=matchFog(state);
  return state;
}

function resolveOutcome(state: MatchState): MatchState {
  const definition=scenarioConfig[state.scenario??'survival'];
  const victory=definition.victory==='enemy-base'? !state.combat.enemies.some(e=>e.kind==='base'&&e.hp>0)
    :definition.victory==='timer'?state.waves.elapsedSeconds+1e-10>=definition.holdSeconds!
    :state.waves.nextWave===scenarioWaves(state.scenario??'survival',state.difficulty??'normal').length&&state.combat.enemies.every(e=>e.kind==='base');
  const outcome:MatchOutcome=state.combat.baseHP<=0?'defeat':victory?'victory':'playing';
  return outcome === 'playing' ? state
    : { ...state, outcome, placement: { ...state.placement, active: false } };
}

function advance(state: MatchState, delta: number): MatchState {
  state=cleanDestroyed(state);
  let gathering = updateGathering(state.gathering, delta, state.map);
  const building = updateConstruction(gathering,state.placement,state.map,delta);
  const combat=state.research&&(state.research.attack||state.research.defense||state.combat.upgrades)?{...state.combat,upgrades:{attack:state.research.attack,defense:state.research.defense}}:state.combat;
  const vision=state.fog?matchFog({...state,gathering:building.gathering,combat,placement:building.placement}):undefined;
  const fight=updateCombat(building.gathering,combat,delta,state.map,building.placement,vision?(e=>entityVisible(vision,'player',e)):undefined,vision?((t)=>entityVisible(vision,'enemy',{position:{x:t.footprint.x+t.footprint.width/2,y:t.footprint.y+t.footprint.height/2},...(t.kind==='worker'||t.kind==='soldier'?{}:{footprint:t.footprint})})):undefined,vision?(e=>entityVisible(vision,'player',e)):undefined);
  const cleaned=cleanDestroyed({...state,gathering:fight.gathering,combat:fight.combat,placement:fight.placement??building.placement});
  const research=updateResearch(cleaned.research??createResearch(),cleaned.placement,delta);
  const worker=cleaned.combat.baseHP>0?updateQueuedProduction(cleaned.gathering,cleaned.production,delta,{kind:'base'},
    {map:cleaned.map,enemies:cleaned.combat.enemies}):{gathering:cleaned.gathering,production:cleaned.production};
  const soldier=cleaned.combat.baseHP>0?updateQueuedProduction(worker.gathering,cleaned.soldierProduction,delta,
    {kind:'barracks',footprint:cleaned.placement.barracks,ready:barracksReady(cleaned.placement)},
    {map:cleaned.map,enemies:cleaned.combat.enemies}):{gathering:worker.gathering,production:cleaned.soldierProduction};
  const nextUnitNumber=Math.max(worker.production.nextUnitNumber,soldier.production.nextUnitNumber);
  const enemy=cleaned.enemyProduction?updateEnemyProduction(cleaned.enemyProduction,cleaned.combat,soldier.gathering,cleaned.map,delta):{combat:cleaned.combat,state:undefined};
  const ai=cleaned.enemyAI?updateEnemyAI(cleaned.enemyAI,enemy.combat,cleaned.map,soldier.gathering.base,delta,soldier.gathering.units,difficultyProfiles[cleaned.difficulty??'normal'].ai,vision?((u)=>entityVisible(vision,'enemy',u)):undefined):{combat:enemy.combat,state:undefined};
  const incoming=scenarioConfig[cleaned.scenario??'survival'].waves?updateWaves(cleaned.waves,ai.combat,delta,scenarioWaves(cleaned.scenario??'survival',cleaned.difficulty??'normal')):{combat:ai.combat,waves:{...cleaned.waves,elapsedSeconds:cleaned.waves.elapsedSeconds+delta}};
  const updated:MatchState={...cleaned,...(vision?{fog:vision}:{}),research,...(enemy.state?{enemyProduction:enemy.state}:{}),...(ai.state?{enemyAI:ai.state}:{}),gathering:soldier.gathering,combat:incoming.combat,waves:incoming.waves,
    production:{...worker.production,nextUnitNumber},soldierProduction:{...soldier.production,nextUnitNumber}};
  const separated=separateBodies(updated.map,[...updated.gathering.units.map(u=>({id:`player:${u.id}`,position:u.position,half:(u.kind==='worker'?unitStats:combatUnitStats(u)).size/2})),...updated.combat.enemies.filter(e=>e.kind!=='base').map(e=>({id:`enemy:${e.id}`,position:e.position,half:combatConfig.enemySize/2}))],delta);
  if(separated.size){updated.gathering={...updated.gathering,units:updated.gathering.units.map(u=>{const position=separated.get(`player:${u.id}`);return position?{...u,position,navigation:u.navigation?.status==='blocked'?u.navigation:undefined}:u;})};updated.combat={...updated.combat,enemies:updated.combat.enemies.map(e=>{const position=separated.get(`enemy:${e.id}`);return position?{...e,position,navigation:e.navigation?.status==='blocked'?e.navigation:undefined}:e;})};}
  updated.fog=matchFog(updated);return resolveOutcome(updated);
}

/** Split only at wave boundaries, retaining delta-based gameplay rather than a fixed timestep. */
export function updateMatch(state: MatchState, deltaSeconds: number): MatchState {
  if (state.paused||state.outcome !== 'playing') return state;
  const cleaned=cleanDestroyed(state);
  let current = resolveOutcome(cleaned);
  if(cleaned.fog&&(deltaSeconds<=0||current.outcome!=='playing'))current={...current,fog:matchFog(cleaned)};
  let remaining = Math.max(0, deltaSeconds);
  while (remaining > 0 && current.outcome === 'playing') {
    const next = scenarioConfig[current.scenario??'survival'].waves?scenarioWaves(current.scenario??'survival',current.difficulty??'normal')[current.waves.nextWave]:undefined;
    const untilWave = next ? Math.max(0, next.atSeconds - current.waves.elapsedSeconds) : Infinity;
    if (untilWave === 0) {
      const incoming = updateWaves(current.waves, current.combat, 0,scenarioWaves(current.scenario??'survival',current.difficulty??'normal'));
      current = { ...current, ...incoming };
      continue;
    }
    const definition=scenarioConfig[current.scenario??'survival'];
    const untilObjective=definition.victory==='timer'?Math.max(0,definition.holdSeconds!-current.waves.elapsedSeconds):Infinity;
    const step = Math.min(remaining, untilWave,untilObjective,current.research?.job?.remainingSeconds??Infinity);
    current = advance(current, step);
    remaining = Math.max(0, remaining - step);
  }
  return current;
}
