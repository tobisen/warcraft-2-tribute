import {createBosses,prepareBossCombat,finishBossCombat,updateBossRewards,type BossState} from './bosses';
import {regionDefinition} from '../config/mapRegions';
import {hasEnemyBase} from './enemyBases';
import {hasMainBase,syncDropoffs,updateExtraBaseProduction} from './extraBases';
import {createDiscoveries,updateDiscoveries,type DiscoveryState} from './discoveries';
import {updateTransportTransfers} from './autoTransport';
import {mapResources} from '../config/maps';
import {campaignMission} from '../config/campaign';
import {campaignPlans} from '../config/campaignPhases';
import {advanceCampaignPhases,campaignWaveSchedule,campaignPlan,campaignPhase,type CampaignRun} from './campaignPhases';
import {initializeMultiplePlayers,updateMultiplePlayers,type MultiplePlayers,type AIContext} from './multiplePlayers';
import type {PlayerDefinition} from '../config/players';
import type {CombatScope} from './combat';
import {updateWildlife,type WildlifeState} from './wildlife';
import {groveForNode} from '../config/referenceTerrain';
import {syncForestObstacles} from './forestTerrain';
import {prepareArmyPlan,type ArmyPlan} from './combinedArmy';
import {combinedArmyConfig} from '../config/combinedArmy';
import {isAIProfile,profileAISettings,type AIProfileId} from '../config/aiProfiles';
import {prepareOrders} from './commandOrders';
import {isAir} from './domains';
import {prepareEnemySpells,untilSpellBoundary} from './enemySpells';
import {advanceSpells} from './spells';
import {advanceMana} from './mana';
import {updateRepair} from './repair';
import {withGateRules} from './gates';import {enemyNavigationMap} from './map';
import {updateTowers} from './towers';
import {advanceBaseUpgrade} from './baseUpgrade';
import {initializeOperation,operationOutcome,advanceCapture,controlsCapture,type CaptureState} from './operations';
import {operationFor} from '../config/operations';
import {prepareEnemyAbilities,advanceEnemyAbilities} from './enemyAbilities';
import {enemyUnitStats} from './enemyUnits';
import {enemySize} from './enemyBody';
import {technologyFor} from './productionPrerequisites';
import {createStatLedger,readyBuildings,recordCompletions,type StatLedger} from './statLedger';
import {createTutorial,updateTutorial,type TutorialState} from './tutorial';
import {enemyStartingBudget} from '../config/enemyNaval';
import {isGameSpeed,type GameSpeed} from '../config/gameSpeed';
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
import {factions as factionDefinitions,defaultFactions,isFactionId,type MatchFactions} from '../config/factions';
import {segmentFits,type RouteState} from './navigation';
import type {Position} from './movement';
import type { ControlGroups } from './controlGroups';
import { separateBodies } from './separation';
import { combatUnitStats, unitStats,workerStats } from '../config/unit';
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
 bosses?:BossState;
 discoveries?:DiscoveryState;
 multiplePlayers?:MultiplePlayers;
 aiContext?:AIContext;
 wildlife?:WildlifeState;
  aiProfile?:AIProfileId;
  armyPlan?:ArmyPlan;
  matchId?:string;
  capture?:CaptureState;
  campaignRun?:CampaignRun;
  campaignMission?:import('../config/campaign').CampaignMissionId;
  statLedger?:StatLedger;
  speed?:GameSpeed;
  tutorial?:TutorialState;
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
export function createMatch(scenario:MatchScenario='survival',difficulty:Difficulty='normal',factions:MatchFactions={...defaultFactions},mapId:MapId=scenarioConfig[scenario].map,speed:GameSpeed=1,aiProfile:AIProfileId='balanced',players?:PlayerDefinition[],campaignId?:import('../config/campaign').CampaignMissionId,world:'current'|'classic'='current'): MatchState {
  difficulty=players?.[1]?.difficulty??difficulty;
  if(campaignId&&campaignMission(campaignId)?.scenario!==scenario)throw Error('Invalid campaign scenario');
  if(campaignId&&players)throw Error('Campaign player configuration is fixed');
  if(!isGameSpeed(speed))throw Error('Invalid game speed');
  if(!isMapId(mapId)||!(campaignId&&campaignPlans[campaignId]?campaignPlans[campaignId]!.map===mapId:scenarioMapAllowed(scenario,mapId)))throw Error('Unknown or unsupported map');
  if(!isFactionId(factions.player)||!isFactionId(factions.enemy))throw Error('Unknown faction');
  if(!isAIProfile(aiProfile))throw Error('Unknown AI profile');
  const state: MatchState = {wildlife:{},
    ...(scenario==='skirmish'||campaignId?{discoveries:createDiscoveries()}:{}),
    ...(campaignId?{campaignMission:campaignId,...(campaignPlans[campaignId]?{campaignRun:{version:1 as const,phase:0}}:{})}:{}),
    ...(aiProfile!=='balanced'?{aiProfile}:{}),
    statLedger:createStatLedger(),
    speed,
    factions:{...factions},
    outcome: 'playing',paused:false,controlGroups:{},scenario,difficulty,research:createResearch(),
    map: createMap(mapId,undefined,'trees','expanded',world==='classic'||scenario==='siege-test'?undefined:'regions'),
    gathering: {
      faction:factions.player,
      units: arenaConfig.workers.map((position, index) => ({
        kind: 'worker',owner:'player',hp:factionDefinitions[factions.player].units.worker.hp, id: `unit-${index + 1}`, position: { ...position }, target: { ...position },
        selected: false, order: { kind: 'idle' }, cargo: 0,
      })),
      gold: {id:'gold-1',resource:goldConfig.resource,position:{...(maps[mapId].goldPosition??goldConfig.position)},remaining:maps[mapId].gold},
      goldBalance:scenarioConfig[scenario].initial.gold,
      node: { resource:'wood', id: 'wood-1', position: { ...gatheringConfig.nodePosition }, remaining: maps[mapId].wood },
      ...(maps[mapId].extraResources?{extraNodes:maps[mapId].extraResources!.map(n=>({id:n.id,resource:n.resource,position:{...n.position},remaining:n.amount}))}:{}),
      lostCargo:{wood:0,gold:0},wood: scenarioConfig[scenario].initial.wood, base: { ...gatheringConfig.basePosition },
    },
    combat: {baseOwner:'player', baseHP: factionDefinitions[factions.player].buildings.base.hp, enemies: [] },
    waves: { elapsedSeconds: 0, nextWave: 0, nextEnemyNumber: 1 },
    placement: { active: false, barracks: null,farms:[],nextFarmNumber:1 },
    production: { remainingSeconds: null, nextUnitNumber: 4 },
    soldierProduction: { remainingSeconds: null, nextUnitNumber: 4 },
  };
  if(scenarioConfig[scenario].enemyBase){state.enemyProduction=createEnemyProduction({...difficultyProfiles[difficulty],budget:enemyStartingBudget(difficultyProfiles[difficulty].budget,maps[mapId].enemyNaval===true)},scenario!=='siege-test');if(maps[mapId].enemyNaval===true)state.enemyNaval=createEnemyNaval();state.enemyAI=createEnemyAI();const footprint={...(regionDefinition(mapId,maps[mapId],state.map.design).enemyBase??enemyBaseConfig.footprint)};state.combat.enemies.push({id:enemyBaseConfig.id,kind:'base',owner:'enemy',hp:scenario==='siege-test'?enemyBaseConfig.hp:factionDefinitions[factions.enemy].buildings.base.hp,...(scenario==='siege-test'?{legacyProfile:true as const}:{}),footprint,position:{x:footprint.x+footprint.width/2,y:footprint.y+footprint.height/2}});state.map.obstacles.push(footprint);}
  if(scenario==='tutorial')state.tutorial=createTutorial();
  if(state.map.resourceLayout==='trees'){const nodes=mapResources(mapId,'trees',state.map.worldLayout,state.map.design).map(n=>({id:n.id,resource:n.resource,mine:n.mine,tree:n.tree,position:{...n.position},remaining:n.amount}));state.gathering.node=nodes[0];state.gathering.gold=nodes[1];if(nodes.length>2)state.gathering.extraNodes=nodes.slice(2);else delete state.gathering.extraNodes;}
  if(state.map.terrainLayout==='reference'&&!state.map.resourceLayout)for(const node of [state.gathering.node,...(state.gathering.extraNodes??[])])node.grove=groveForNode(node.id);
  state.map.obstacles.push(...placementObstacles(state.gathering));
  if(scenarioConfig[scenario].enemyBase&&scenario!=='siege-test'){addEnemyWorkers(state);state.enemyConstruction=createEnemyConstruction();state.enemyPolicy=createEnemyPolicy();state.enemyRecovery=createEnemyRecovery();state.enemyKnowledge=createEnemyKnowledge();}
  if(!players&&(scenario==='skirmish'||campaignId))state.bosses=createBosses(state.map);
  initializeOperation(state);
  state.fog=matchFog(state);
  return players?initializeMultiplePlayers(state,players):state;
}

function resolveOutcome(state: MatchState): MatchState {
  state=advanceCampaignPhases(state);
  const definition=scenarioConfig[state.scenario??'survival'];
  const operation=operationOutcome(state);
  const plan=campaignPlan(state);
  const victory=plan?state.campaignRun!.phase===plan.phases.length:definition.victory==='operation'?operation==='victory':definition.victory==='tutorial'?state.tutorial?.step===6:definition.victory==='enemy-base'? !hasEnemyBase(state.combat,state.map)
    :definition.victory==='timer'?state.waves.elapsedSeconds+1e-10>=definition.holdSeconds!
    :state.waves.nextWave===scenarioWaves(state.scenario??'survival',state.difficulty??'normal').length&&state.combat.enemies.every(e=>e.kind==='base');
  const outcome:MatchOutcome=(state.campaignRun||state.campaignMission?state.combat.baseHP<=0:!hasMainBase(state))||operation==='defeat'?'defeat':victory?'victory':'playing';
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

function advance(state: MatchState, delta: number, scope?:CombatScope): MatchState {
  const ownDelta=scope?.side==='enemy'?0:delta;
  state=prepareOrders(withGateRules(cleanDestroyed(state)));
  const readyBefore=readyBuildings(state);
  state=advanceMana(state,delta);
  state=updateRepair(state,ownDelta);
  state=prepareArmyPlan(observeEnemyKnowledge(state));
  state=prepareEnemyNaval(state);
  state=prepareEnemyRecovery(state);
  state=prepareEnemyPolicy(state);
  state=prepareEnemyExpansion(state);
  state=prepareEnemyConstruction(state);
  state=prepareEnemyGathering(state);
  state=prepareEnemyScout(state);
  const gateFor=trafficGates(state.map,[...state.gathering.units.filter(u=>!isAir(u)).map(u=>({id:`player:${u.id}`,position:u.position,fixed:u.commandMode?.kind==='hold'||u.order.kind==='idle'&&u.navigation?.status==='arrived',half:(u.kind==='worker'?workerStats(state.gathering.faction):combatUnitStats(u,state.gathering.faction)).size/2,speed:(u.kind==='worker'?workerStats(state.gathering.faction):combatUnitStats(u,state.gathering.faction)).speed,active:u.order.kind!=='idle',waypoints:u.navigation?.waypoints??[u.target]})),...state.combat.enemies.filter(e=>!isAir(e)&&e.kind!=='ship'&&!e.footprint&&e.hp>0).map(e=>({id:`enemy:${e.id}`,position:e.position,half:enemySize(e)/2,speed:e.kind==='worker'?workerStats(state.factions?.enemy??defaultFactions.enemy).speed:enemyUnitStats(e,state.factions?.enemy).speed,active:e.work?e.work.order.kind!=='idle':e.order?.kind!=='idle',waypoints:e.navigation?.waypoints??(e.work?[e.work.target]:undefined)??(e.order?.kind==='muster'||e.order?.kind==='attack-move'?[e.order.destination]:[])}))],state.waves.elapsedSeconds,delta);
  const services=resourceServices({...state.gathering,units:[...state.gathering.units,...state.combat.enemies.flatMap(e=>{const worker=enemyWorker(e);return worker?[worker]:[];})]},state.map,state.waves.elapsedSeconds);
  state=syncDropoffs(state);
  const forestBefore=state.gathering;
  let gathering = updateGathering({...state.gathering,...(state.research?.workerTools?{workerToolsLevel:state.research.workerTools}:{})}, ownDelta, state.map,{elapsedSeconds:state.waves.elapsedSeconds,gateFor,services});
  state=updateEnemyGathering({...state,gathering},delta,gateFor,services);state={...state,map:syncForestObstacles(forestBefore,state.gathering,state.map)};const enemyBuilding=updateEnemyConstruction(state,delta,gateFor);state=enemyBuilding.match;gathering=state.gathering;
  state=updateEnemyExpansion(state,delta,gateFor);gathering=state.gathering;
  state=updateEnemyNaval(state,delta);gathering=state.gathering;
  state=updateTowers(state,ownDelta);gathering=state.gathering;
  const building = updateConstruction(gathering,state.placement,state.map,ownDelta,gateFor);
  state={...state,statLedger:recordCompletions(readyBefore,{...state,gathering:building.gathering,placement:building.placement})};
  let combat=state.research&&(state.research.attack||state.research.defense||state.combat.upgrades)?{...state.combat,upgrades:{attack:state.research.attack,defense:state.research.defense}}:state.combat;
  if(state.enemyPolicy&&(state.enemyPolicy.research.attack||state.enemyPolicy.research.defense||combat.enemyUpgrades))combat={...combat,enemyUpgrades:{attack:state.enemyPolicy.research.attack,defense:state.enemyPolicy.research.defense}};
  const vision=state.fog?matchFog({...state,gathering:building.gathering,combat,placement:building.placement}):undefined;
  const fight=updateCombat(building.gathering,prepareBossCombat({...state,gathering:building.gathering,fog:vision},combat),delta,state.map,building.placement,vision?(e=>entityVisible(vision,'player',e)):undefined,vision?((t)=>entityVisible(vision,'enemy',{position:{x:t.footprint.x+t.footprint.width/2,y:t.footprint.y+t.footprint.height/2},...(t.kind==='ship'||t.kind==='worker'||t.kind==='soldier'?{}:{footprint:t.footprint})})):undefined,vision?(e=>entityVisible(vision,'player',e)):undefined,gateFor,state.navy,vision?(e=>entityVisible(vision,'player',e)):undefined,state.factions?.enemy??defaultFactions.enemy,vision?e=>entityVisible(vision,'player',e):undefined,scope);
  let cleaned=cleanDestroyed({...state,...(fight.navy?{navy:fight.navy}:{}),gathering:fight.gathering,...finishBossCombat(state,fight.combat),placement:fight.placement??building.placement});
  cleaned=advanceEnemyRecovery(cleaned,delta);
  const enemyPolicy=advanceEnemyPolicy(cleaned,delta);
  const research=updateResearch(cleaned.research??createResearch(),cleaned.placement,ownDelta,true,cleaned.factions?.player??defaultFactions.player,hasMainBase(cleaned));
  const baseStep=advanceBaseUpgrade(cleaned,ownDelta);cleaned=baseStep.match;
  const worker=cleaned.combat.baseHP>0?updateQueuedProduction(cleaned.gathering,cleaned.production,baseStep.productionSeconds,{kind:'base'},
    {map:cleaned.map,enemies:cleaned.combat.enemies}):{gathering:cleaned.gathering,production:cleaned.production};
  const soldier=hasMainBase(cleaned)?updateQueuedProduction(worker.gathering,cleaned.soldierProduction,ownDelta,
    {kind:'barracks',bounds:cleaned.map,footprint:cleaned.placement.barracks,ready:barracksReady(cleaned.placement)},
    {map:cleaned.map,enemies:cleaned.combat.enemies}):{gathering:worker.gathering,production:cleaned.soldierProduction};
  const nextUnitNumber=Math.max(worker.production.nextUnitNumber,soldier.production.nextUnitNumber);
  const enemy=cleaned.enemyProduction?updateEnemyProduction(cleaned.enemyProduction,cleaned.combat,soldier.gathering,enemyNavigationMap(cleaned.map),enemyBuilding.productionDelta,(cleaned.factions??defaultFactions).enemy,cleaned.enemyConstruction?{armyPlan:cleaned.armyPlan,airThreat:cleaned.gathering.units.some(u=>isAir(u)&&u.hp!>0&&!!cleaned.fog&&entityVisible(cleaned.fog,'enemy',u)),technology:technologyFor(cleaned,'enemy'),site:cleaned.combat.enemies.find(e=>e.buildingType==='barracks'),population:enemyPopulation(cleaned),maxArmy:cleaned.enemyNaval?2:undefined,embarked:cleaned.enemyNaval?.passengers.length??0,workerReservations:cleaned.enemyRecovery?.production.queue?.reduce((n,j)=>n+(j.supply??1),0)??0,startAllowed:!cleaned.enemyPolicy||enemyPriority(cleaned)==='army',reserveForFarm:cleaned.combat.enemies.some(e=>e.buildingType==='farm'&&e.construction?.remainingSeconds===0)?undefined:enemyConstructionConfig.supplyMargin}:undefined):{combat:cleaned.combat,state:undefined};
  const ai=cleaned.enemyAI?updateEnemyAI(cleaned.enemyAI,enemy.combat,enemyNavigationMap(cleaned.map),cleaned.enemyKnowledge?enemyAttackDestination(cleaned):soldier.gathering.base,delta,soldier.gathering.units,profileAISettings({...difficultyProfiles[cleaned.difficulty??'normal'].ai,...(cleaned.aiContext?{muster:cleaned.aiContext.muster,helpBases:cleaned.aiContext.helpBases}:{}),...(!cleaned.aiContext&&regionDefinition(cleaned.map.id??'arena',maps[cleaned.map.id??'arena'],cleaned.map.design).enemyMuster?{muster:regionDefinition(cleaned.map.id??'arena',maps[cleaned.map.id??'arena'],cleaned.map.design).enemyMuster!}:{}),firstAttackSeconds:(cleaned.map.design==='regions'?90:0)+difficultyProfiles[cleaned.difficulty??'normal'].ai.firstAttackSeconds+(cleaned.enemyProduction?.extracted?(cleaned.enemyProduction.roster?enemyEconomyConfig.rosterAttackGraceSeconds:enemyEconomyConfig.attackGraceSeconds):0),...((cleaned.armyPlan&&technologyFor(cleaned,'enemy').buildings.includes('forge'))?{groupSize:Math.max(difficultyProfiles[cleaned.difficulty??'normal'].ai.groupSize,combinedArmyConfig.groupSize),musterTimeout:combinedArmyConfig.musterTimeout}:{}),regroup:!!cleaned.armyPlan,...(cleaned.map.design==='regions'?{helpBases:[...(cleaned.aiContext?.helpBases??[]),...cleaned.combat.enemies.filter(e=>e.buildingType==='outpost'&&e.construction?.remainingSeconds===0).map(e=>e.footprint!)]}:{})},cleaned.aiProfile),vision?((u)=>entityVisible(vision,'enemy',u)):undefined,(cleaned.factions??defaultFactions).enemy):{combat:enemy.combat,state:undefined};
  const incoming=scenarioConfig[cleaned.scenario??'survival'].waves?updateWaves(cleaned.waves,ai.combat,delta,campaignWaveSchedule(cleaned),cleaned.campaignRun&&cleaned.map.id==='frontier'?{x:1248,y:144,spacing:32}:undefined):{combat:ai.combat,waves:{...cleaned.waves,elapsedSeconds:cleaned.waves.elapsedSeconds+delta}};
  let updated:MatchState={...cleaned,...(enemyPolicy?{enemyPolicy}:{}),...(vision?{fog:vision}:{}),research,...(enemy.state?{enemyProduction:enemy.state}:{}),...(ai.state?{enemyAI:ai.state}:{}),gathering:soldier.gathering,combat:incoming.combat,waves:incoming.waves,
    production:{...worker.production,nextUnitNumber},soldierProduction:{...soldier.production,nextUnitNumber}};
  if(scope?.side!=='enemy')updated=updateExtraBaseProduction(updated,baseStep.productionSeconds);
  const beforeNavyCompletion=readyBuildings(updated);
  updated=updateTransportTransfers(updateNavy(updated,ownDelta),ownDelta);
  updated={...updated,statLedger:recordCompletions(beforeNavyCompletion,updated)};
  updated=updateEnemyExploration(updated);updated=updateWildlife(updated,ownDelta);
  const separated=separateBodies(updated.map,[...updated.gathering.units.filter(u=>!isAir(u)).map(u=>({id:`player:${u.id}`,position:u.position,fixed:u.commandMode?.kind==='hold'||u.order.kind==='idle'&&u.navigation?.status==='arrived',half:(u.kind==='worker'?workerStats(state.gathering.faction):combatUnitStats(u,state.gathering.faction)).size/2})),...updated.combat.enemies.filter(e=>!isAir(e)&&e.kind!=='ship'&&!e.footprint).map(e=>({id:`enemy:${e.id}`,position:e.position,half:enemySize(e)/2}))],delta);
  if(separated.size){updated.gathering={...updated.gathering,units:updated.gathering.units.map(u=>{const position=separated.get(`player:${u.id}`);return position?{...u,position,navigation:correctedNavigation(updated.map,position,(u.kind==='worker'?workerStats(state.gathering.faction):combatUnitStats(u,state.gathering.faction)).size/2,u.navigation)}:u;})};updated.combat={...updated.combat,enemies:updated.combat.enemies.map(e=>{const position=separated.get(`enemy:${e.id}`);return position?{...e,position,navigation:correctedNavigation(updated.map,position,enemySize(e)/2,e.navigation)}:e;})};}
  updated=advanceSpells(updated,delta);updated=advanceEnemyAbilities(updated,delta);updated.gathering=advanceAbilities(updated.gathering,delta);updated.fog=matchFog(updated);if(scope?.side!=='enemy')updated=updateBossRewards(updateDiscoveries(updated));const taught=updateTutorial(updated);if(taught!==updated){updated=taught;updated.fog=matchFog(updated);}return scope?updated:resolveOutcome(updated.campaignRun&&campaignPhase(updated)?.goal!=='operation'?{...updated,...(updated.capture?{capture:{holdSeconds:0}}:{})}:advanceCapture(state,updated,delta));
}

/** Split at existing gameplay and spell/AI boundaries, retaining delta-based gameplay rather than a fixed timestep. */
export function updateMatch(state: MatchState, deltaSeconds: number, scope?:CombatScope): MatchState {
  if(state.multiplePlayers&&!scope)return updateMultiplePlayers(state,deltaSeconds);
  if (state.paused||state.outcome !== 'playing') return state;
  const cleaned=advanceCapture(state,updateTutorial(cleanDestroyed(state)),0);
  let current = scope?cleaned:resolveOutcome(cleaned);
  if(cleaned.fog&&(deltaSeconds<=0||current.outcome!=='playing'))current={...current,fog:matchFog(cleaned)};
  let remaining = Math.max(0, deltaSeconds);
  while (remaining > 0 && current.outcome === 'playing') {
    const next = scenarioConfig[current.scenario??'survival'].waves?campaignWaveSchedule(current)[current.waves.nextWave]:undefined;
    const untilWave = next ? Math.max(0, next.atSeconds - current.waves.elapsedSeconds) : Infinity;
    if (untilWave === 0) {
      const incoming = updateWaves(current.waves, current.combat, 0,campaignWaveSchedule(current),current.campaignRun&&current.map.id==='frontier'?{x:1248,y:144,spacing:32}:undefined);
      current = { ...current, ...incoming };
      continue;
    }
    const definition=scenarioConfig[current.scenario??'survival'];
    const capture=operationFor(current.scenario);
    const untilObjective=!current.campaignRun&&definition.victory==='timer'?Math.max(0,definition.holdSeconds!-current.waves.elapsedSeconds):capture?.kind==='capture'&&(!current.campaignRun||campaignPhase(current)?.goal==='operation')&&controlsCapture(current)?Math.max(0,capture.holdSeconds-(current.capture?.holdSeconds??0)):Infinity;
    const untilService=(Math.floor((current.waves.elapsedSeconds+1e-9)/trafficConfig.resourceWindowSeconds)+1)*trafficConfig.resourceWindowSeconds-current.waves.elapsedSeconds;
    if(scope?.side!=='player'){current=prepareEnemySpells(current);current=prepareEnemyAbilities(current);}
    const untilAbility=Math.min(Infinity,...current.combat.enemies.flatMap(e=>[e.ability?.activeSeconds??0,e.ability?.cooldownSeconds??0].filter(t=>t>1e-9)),...current.gathering.units.flatMap(u=>u.kind==='soldier'&&(u.ability?.activeSeconds??0)>1e-9?[u.ability!.activeSeconds]:[]));
    const step = Math.min(untilSpellBoundary(current),current.enemyPolicy?.research.job?.remainingSeconds??Infinity,untilAbility,remaining, untilWave,untilObjective,untilService,current.research?.job?.remainingSeconds??Infinity);
    current = advance(current, step,scope);
    remaining = Math.max(0, remaining - step);
  }
  return current;
}
