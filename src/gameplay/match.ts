import {enemyStartingBudget} from '../config/enemyNaval';
import {createEnemyNaval,prepareEnemyNaval,updateEnemyNaval,type EnemyNavalState} from './enemyNaval';
import {updateNavy,type NavyState} from './navy';
import {maps,isMapId,type MapId} from '../config/maps';
import {createEnemyKnowledge,observeEnemyKnowledge,prepareEnemyScout,updateEnemyExploration,enemyAttackDestination,type EnemyKnowledgeState} from './enemyKnowledge';
import {prepareEnemyExpansion,updateEnemyExpansion} from './enemyExpansion';
import {createEnemyRecovery,prepareEnemyRecovery,advanceEnemyRecovery,type EnemyRecoveryState} from './enemyRecovery';
import {createEnemyPolicy,prepareEnemyPolicy,advanceEnemyPolicy,enemyPriority,type EnemyPolicyState} from './enemyPolicy';
import {enemyConstructionConfig} from '../config/enemyConstruction';
import {createEnemyConstruction,prepareEnemyConstruction,updateEnemyConstruction,enemyPopulation,type EnemyConstructionState} from './enemyConstruction';
import {enemyEconomyConfig} from '../config/enemyEconomy';
import {addEnemyWorkers,updateEnemyGathering,prepareEnemyGathering,enemyWorker} from './enemyGathering';
import {resourceServices} from './resourceQueue';
import {advanceAbilities} from './abilities';
import {trafficGates} from './traffic';
import {trafficConfig} from '../config/traffic';
import {defaultFactions,isFactionId,type MatchFactions} from '../config/factions';
import {segmentFits,type RouteState} from './navigation';
import type {Position} from './movement';
import type { ControlGroups } from './controlGroups';
import { separateBodies } from './separation';
import { combatUnitStats, unitStats } from '../config/unit';
import { entityVisible } from './visibility';
import { matchFog } from './matchFog';
import type { FogState } from './fog';
import { createEnemyAI,updateEnemyAI,type EnemyAIState } from './enemyAI';
import { createEnemyProduction,updateEnemyProduction,type EnemyProductionState } from './enemyProduction';
import { scenarioConfig,scenarioMapAllowed,scenarioWaves,enemyBaseConfig,type MatchScenario } from '../config/scenarios';
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
  enemyNaval?:EnemyNavalState;
  navy?:NavyState;
  factions?:MatchFactions;
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
  enemyConstruction?:EnemyConstructionState;
  enemyPolicy?:EnemyPolicyState;
  enemyRecovery?:EnemyRecoveryState;
  enemyKnowledge?:EnemyKnowledgeState;
}

/** A fresh state owns every mutable position/array; restart never reuses a previous match. */
export function createMatch(scenario:MatchScenario='survival',difficulty:Difficulty='normal',factions:MatchFactions={...defaultFactions},mapId:MapId=scenarioConfig[scenario].map): MatchState {
  if(!isMapId(mapId)||!scenarioMapAllowed(scenario,mapId))throw Error('Unknown or unsupported map');
  if(!isFactionId(factions.player)||!isFactionId(factions.enemy))throw Error('Unknown faction');
  const state: MatchState = {
    factions:{...factions},
    outcome: 'playing',paused:false,controlGroups:{},scenario,difficulty,research:createResearch(),
    map: createMap(mapId),
    gathering: {
      faction:factions.player,
      units: arenaConfig.workers.map((position, index) => ({
        kind: 'worker',owner:'player',hp:combatConfig.workerHP, id: `unit-${index + 1}`, position: { ...position }, target: { ...position },
        selected: false, order: { kind: 'idle' }, cargo: 0,
      })),
      gold: {id:'gold-1',resource:goldConfig.resource,position:{...(maps[mapId].goldPosition??goldConfig.position)},remaining:maps[mapId].gold},
      goldBalance:scenarioConfig[scenario].initial.gold,
      node: { resource:'wood', id: 'wood-1', position: { ...gatheringConfig.nodePosition }, remaining: maps[mapId].wood },
      lostCargo:{wood:0,gold:0},wood: scenarioConfig[scenario].initial.wood, base: { ...gatheringConfig.basePosition },
    },
    combat: {baseOwner:'player', baseHP: combatConfig.baseHP, enemies: [] },
    waves: { elapsedSeconds: 0, nextWave: 0, nextEnemyNumber: 1 },
    placement: { active: false, barracks: null,farms:[],nextFarmNumber:1 },
    production: { remainingSeconds: null, nextUnitNumber: 4 },
    soldierProduction: { remainingSeconds: null, nextUnitNumber: 4 },
  };
  if(scenarioConfig[scenario].enemyBase){state.enemyProduction=createEnemyProduction({...difficultyProfiles[difficulty],budget:enemyStartingBudget(difficultyProfiles[difficulty].budget,mapId==='islands')});if(mapId==='islands')state.enemyNaval=createEnemyNaval();state.enemyAI=createEnemyAI();const footprint={...enemyBaseConfig.footprint};state.combat.enemies.push({id:enemyBaseConfig.id,kind:'base',owner:'enemy',hp:enemyBaseConfig.hp,footprint,position:{x:footprint.x+footprint.width/2,y:footprint.y+footprint.height/2}});state.map.obstacles.push(footprint);}
  state.map.obstacles.push(...placementObstacles(state.gathering));
  if(scenarioConfig[scenario].enemyBase&&scenario!=='siege-test'){addEnemyWorkers(state);state.enemyConstruction=createEnemyConstruction();state.enemyPolicy=createEnemyPolicy();state.enemyRecovery=createEnemyRecovery();state.enemyKnowledge=createEnemyKnowledge();}
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

/** A local correction need not discard a still-clear route and trigger another BFS. */
function correctedNavigation(map:WorldMap,position:Position,half:number,route?:RouteState):RouteState|undefined {
  if(!route||route.status==='blocked')return route;
  if(route.revision!==map.revision)return undefined;
  if(route.status==='arrived')return position.x===route.destination.x&&position.y===route.destination.y?route:undefined;
  return route.waypoints[0]&&segmentFits(map,position,route.waypoints[0],half)?route:undefined;
}

function advance(state: MatchState, delta: number): MatchState {
  state=cleanDestroyed(state);
  state=observeEnemyKnowledge(state);
  state=prepareEnemyNaval(state);
  state=prepareEnemyRecovery(state);
  state=prepareEnemyPolicy(state);
  state=prepareEnemyExpansion(state);
  state=prepareEnemyConstruction(state);
  state=prepareEnemyGathering(state);
  state=prepareEnemyScout(state);
  const gateFor=trafficGates(state.map,[...state.gathering.units.map(u=>({id:`player:${u.id}`,position:u.position,half:(u.kind==='worker'?unitStats:combatUnitStats(u)).size/2,speed:(u.kind==='worker'?unitStats:combatUnitStats(u)).speed,active:u.order.kind!=='idle',waypoints:u.navigation?.waypoints??[u.target]})),...state.combat.enemies.filter(e=>e.kind!=='ship'&&e.kind!=='base'&&e.hp>0).map(e=>({id:`enemy:${e.id}`,position:e.position,half:combatConfig.enemySize/2,speed:e.kind==='worker'?unitStats.speed:combatConfig.enemySpeed,active:e.work?e.work.order.kind!=='idle':e.order?.kind!=='idle',waypoints:e.navigation?.waypoints??(e.work?[e.work.target]:undefined)??(e.order?.kind==='muster'||e.order?.kind==='attack-move'?[e.order.destination]:[])}))],state.waves.elapsedSeconds,delta);
  const services=resourceServices({...state.gathering,units:[...state.gathering.units,...state.combat.enemies.flatMap(e=>{const worker=enemyWorker(e);return worker?[worker]:[];})]},state.map,state.waves.elapsedSeconds);
  let gathering = updateGathering(state.gathering, delta, state.map,{elapsedSeconds:state.waves.elapsedSeconds,gateFor,services});
  state=updateEnemyGathering({...state,gathering},delta,gateFor,services);const enemyBuilding=updateEnemyConstruction(state,delta,gateFor);state=enemyBuilding.match;gathering=state.gathering;
  state=updateEnemyExpansion(state,delta,gateFor);gathering=state.gathering;
  state=updateEnemyNaval(state,delta);gathering=state.gathering;
  const building = updateConstruction(gathering,state.placement,state.map,delta,gateFor);
  let combat=state.research&&(state.research.attack||state.research.defense||state.combat.upgrades)?{...state.combat,upgrades:{attack:state.research.attack,defense:state.research.defense}}:state.combat;
  if(state.enemyPolicy&&(state.enemyPolicy.research.attack||state.enemyPolicy.research.defense||combat.enemyUpgrades))combat={...combat,enemyUpgrades:{attack:state.enemyPolicy.research.attack,defense:state.enemyPolicy.research.defense}};
  const vision=state.fog?matchFog({...state,gathering:building.gathering,combat,placement:building.placement}):undefined;
  const fight=updateCombat(building.gathering,combat,delta,state.map,building.placement,vision?(e=>entityVisible(vision,'player',e)):undefined,vision?((t)=>entityVisible(vision,'enemy',{position:{x:t.footprint.x+t.footprint.width/2,y:t.footprint.y+t.footprint.height/2},...(t.kind==='ship'||t.kind==='worker'||t.kind==='soldier'?{}:{footprint:t.footprint})})):undefined,vision?(e=>entityVisible(vision,'player',e)):undefined,gateFor,state.navy,vision?(e=>entityVisible(vision,'player',e)):undefined);
  let cleaned=cleanDestroyed({...state,...(fight.navy?{navy:fight.navy}:{}),gathering:fight.gathering,combat:fight.combat,placement:fight.placement??building.placement});
  cleaned=advanceEnemyRecovery(cleaned,delta);
  const enemyPolicy=advanceEnemyPolicy(cleaned,delta);
  const research=updateResearch(cleaned.research??createResearch(),cleaned.placement,delta);
  const worker=cleaned.combat.baseHP>0?updateQueuedProduction(cleaned.gathering,cleaned.production,delta,{kind:'base'},
    {map:cleaned.map,enemies:cleaned.combat.enemies}):{gathering:cleaned.gathering,production:cleaned.production};
  const soldier=cleaned.combat.baseHP>0?updateQueuedProduction(worker.gathering,cleaned.soldierProduction,delta,
    {kind:'barracks',footprint:cleaned.placement.barracks,ready:barracksReady(cleaned.placement)},
    {map:cleaned.map,enemies:cleaned.combat.enemies}):{gathering:worker.gathering,production:cleaned.soldierProduction};
  const nextUnitNumber=Math.max(worker.production.nextUnitNumber,soldier.production.nextUnitNumber);
  const enemy=cleaned.enemyProduction?updateEnemyProduction(cleaned.enemyProduction,cleaned.combat,soldier.gathering,cleaned.map,enemyBuilding.productionDelta,(cleaned.factions??defaultFactions).enemy,cleaned.enemyConstruction?{site:cleaned.combat.enemies.find(e=>e.buildingType==='barracks'),population:enemyPopulation(cleaned),maxArmy:cleaned.enemyNaval?2:undefined,embarked:cleaned.enemyNaval?.passengers.length??0,workerReservations:cleaned.enemyRecovery?.production.queue?.reduce((n,j)=>n+(j.supply??1),0)??0,startAllowed:!cleaned.enemyPolicy||enemyPriority(cleaned)==='army',reserveForFarm:cleaned.combat.enemies.some(e=>e.buildingType==='farm'&&e.construction?.remainingSeconds===0)?undefined:enemyConstructionConfig.supplyMargin}:undefined):{combat:cleaned.combat,state:undefined};
  const ai=cleaned.enemyAI?updateEnemyAI(cleaned.enemyAI,enemy.combat,cleaned.map,cleaned.enemyKnowledge?enemyAttackDestination(cleaned):soldier.gathering.base,delta,soldier.gathering.units,{...difficultyProfiles[cleaned.difficulty??'normal'].ai,firstAttackSeconds:difficultyProfiles[cleaned.difficulty??'normal'].ai.firstAttackSeconds+(cleaned.enemyProduction?.extracted?enemyEconomyConfig.attackGraceSeconds:0)},vision?((u)=>entityVisible(vision,'enemy',u)):undefined):{combat:enemy.combat,state:undefined};
  const incoming=scenarioConfig[cleaned.scenario??'survival'].waves?updateWaves(cleaned.waves,ai.combat,delta,scenarioWaves(cleaned.scenario??'survival',cleaned.difficulty??'normal')):{combat:ai.combat,waves:{...cleaned.waves,elapsedSeconds:cleaned.waves.elapsedSeconds+delta}};
  let updated:MatchState={...cleaned,...(enemyPolicy?{enemyPolicy}:{}),...(vision?{fog:vision}:{}),research,...(enemy.state?{enemyProduction:enemy.state}:{}),...(ai.state?{enemyAI:ai.state}:{}),gathering:soldier.gathering,combat:incoming.combat,waves:incoming.waves,
    production:{...worker.production,nextUnitNumber},soldierProduction:{...soldier.production,nextUnitNumber}};
  updated=updateNavy(updated,delta);
  updated=updateEnemyExploration(updated);
  const separated=separateBodies(updated.map,[...updated.gathering.units.map(u=>({id:`player:${u.id}`,position:u.position,half:(u.kind==='worker'?unitStats:combatUnitStats(u)).size/2})),...updated.combat.enemies.filter(e=>e.kind!=='ship'&&e.kind!=='base').map(e=>({id:`enemy:${e.id}`,position:e.position,half:combatConfig.enemySize/2}))],delta);
  if(separated.size){updated.gathering={...updated.gathering,units:updated.gathering.units.map(u=>{const position=separated.get(`player:${u.id}`);return position?{...u,position,navigation:correctedNavigation(updated.map,position,(u.kind==='worker'?unitStats:combatUnitStats(u)).size/2,u.navigation)}:u;})};updated.combat={...updated.combat,enemies:updated.combat.enemies.map(e=>{const position=separated.get(`enemy:${e.id}`);return position?{...e,position,navigation:correctedNavigation(updated.map,position,combatConfig.enemySize/2,e.navigation)}:e;})};}
  updated.gathering=advanceAbilities(updated.gathering,delta);updated.fog=matchFog(updated);return resolveOutcome(updated);
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
    const untilService=(Math.floor((current.waves.elapsedSeconds+1e-9)/trafficConfig.resourceWindowSeconds)+1)*trafficConfig.resourceWindowSeconds-current.waves.elapsedSeconds;
    const untilAbility=Math.min(Infinity,...current.gathering.units.flatMap(u=>u.kind==='soldier'&&(u.ability?.activeSeconds??0)>1e-9?[u.ability!.activeSeconds]:[]));
    const step = Math.min(current.enemyPolicy?.research.job?.remainingSeconds??Infinity,untilAbility,remaining, untilWave,untilObjective,untilService,current.research?.job?.remainingSeconds??Infinity);
    current = advance(current, step);
    remaining = Math.max(0, remaining - step);
  }
  return current;
}
