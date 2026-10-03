import {maps,type MapId} from '../../config/maps';
import {factionsForPlayer,factions,type FactionId} from '../../config/factions';
import {useAbility} from '../abilities';
import { createMatch, updateMatch, type MatchState } from '../match';
import { orderUnits } from '../gathering';
import { orderAttack } from '../combat';
import { commandGroupMove } from '../groupMovement';
import { commandAttackMove } from '../attackMove';
import { beginPlacement, placeBuilding, placementObstacles } from '../placement';
import { barracksReady, resumeConstruction } from '../construction';
import { enqueueProduction } from '../productionQueue';
import { populationState } from '../population';
import { entityVisible, knownResource, placementVisible } from '../visibility';
import { scenarioConfig, type MatchScenario } from '../../config/scenarios';
import type { Difficulty } from '../../config/difficulty';
import { encodeSave, decodeSave } from '../save';

/** Deterministic accelerated release playthrough. Only player commands change state;
 * no injected resources/units/HP, and target decisions use player vision. */
export function releasePlaythrough(scenario: MatchScenario, difficulty: Difficulty, observe?: (match: MatchState) => void,options?:{faction?:FactionId;abilities?:boolean;map?:MapId}) {
  const faction=options?.faction??'crown';
  let match = createMatch(scenario, difficulty,factionsForPlayer(faction),options?.map??'arena'), spentWood = 0, spentGold = 0, saved = false,abilitiesUsed=0;
  const retreatUntil = new Map<string, number>();
  const select = (id: string) => { match.gathering.units = match.gathering.units.map(u => ({ ...u, selected: u.id === id })); };
  for (let frame = 0; frame < 6000 && match.outcome === 'playing'; frame++) {
    if (frame % 4 === 0) {
      const visible = match.combat.enemies.filter(e => entityVisible(match.fog!, 'player', e));
      const army = match.gathering.units.filter(u => u.kind === 'soldier');
      const pending = match.soldierProduction.queue?.length ?? 0;
      const assaultReady=army.length>=3||army.length>=(options?.faction!==undefined?1:2)&&match.waves.elapsedSeconds>=120;
      const goldNeeded = Math.max(0, 4 - army.length - pending) * factions[faction].units.soldier.cost.gold;
      for (const worker of [...match.gathering.units].filter(u => u.kind === 'worker')) {
        select(worker.id);
        const threatened = visible.some(e => e.kind !== 'base' && Math.hypot(e.position.x - worker.position.x, e.position.y - worker.position.y) < 160);
        if (threatened && worker.hp! < (options?.faction!==undefined?24:10) && worker.order.kind !== 'build') retreatUntil.set(worker.id, match.waves.elapsedSeconds + 5);
        if ((retreatUntil.get(worker.id) ?? 0) > match.waves.elapsedSeconds) {
          if (worker.order.kind !== 'move' && Math.hypot(worker.position.x - 250, worker.position.y - 450) > 40)
            match.gathering.units = commandGroupMove(match.gathering.units, { x: 250, y: 450 }, match.map);
          continue;
        }
        if (worker.order.kind === 'build') continue;
        const goldWorker = match.gathering.units.filter(u => u.kind === 'worker').at(-1)?.id;
        const node = (barracksReady(match.placement)||options?.faction!==undefined&&!!match.placement.barracks) && worker.id === goldWorker && (match.gathering.goldBalance ?? 0) < goldNeeded ? match.gathering.gold! : match.gathering.node;
        if (!knownResource(match.fog!, node.position)) {
          if (worker.order.kind !== 'move') match.gathering.units = commandGroupMove(match.gathering.units, node.resource === 'gold' ? { x: 780, y: 240 } : { x: 600, y: 220 }, match.map);
        } else if (!('nodeId' in worker.order) || worker.order.nodeId !== node.id) {
          match.gathering.units = orderUnits(match.gathering.units, node.position, node);
        }
      }
      if (!match.placement.barracks && match.gathering.wood >= 40 && placementVisible(match.fog!, { x: 512, y: 384, width: 64, height: 64 })) {
        const workers=match.gathering.units.filter(u=>u.kind==='worker');
        const builder = options?.faction!==undefined?workers[0]:workers.at(-1);
        if (builder) {
          select(builder.id);
          const placed = placeBuilding(beginPlacement(match.placement), { x: 512, y: 384 }, match.gathering.wood, placementObstacles(match.gathering), { map: match.map, gathering: match.gathering, enemies: visible });
          if (placed.gathering && placed.map) { spentWood += 40; match = { ...match, map: placed.map, gathering: placed.gathering, placement: placed.placement }; }
        }
      }
      if (match.placement.construction && match.placement.construction.remainingSeconds > 0 && !match.gathering.units.some(u => u.order.kind === 'build')) {
        const worker = match.gathering.units.find(u => u.kind === 'worker' && (retreatUntil.get(u.id) ?? 0) <= match.waves.elapsedSeconds);
        if (worker) { select(worker.id); match = { ...match, ...resumeConstruction(match.gathering, match.placement, match.map) }; }
      }
      if (barracksReady(match.placement) && army.length + pending < 4) {
        const queued = enqueueProduction(match.gathering, match.soldierProduction, { kind: 'barracks', footprint: match.placement.barracks }, populationState(match.gathering, match.placement, [match.production, match.soldierProduction]));
        spentWood += match.gathering.wood - queued.gathering.wood; spentGold += (match.gathering.goldBalance ?? 0) - (queued.gathering.goldBalance ?? 0);
        match = { ...match, gathering: queued.gathering, soldierProduction: queued.production };
      }
      for (const soldier of army) {
        select(soldier.id);
        const target = [...visible].filter(e => assaultReady || Math.hypot(e.position.x - match.gathering.base.x, e.position.y - match.gathering.base.y) < 240 || options?.faction!==undefined&&match.gathering.units.some(u=>u.kind==='worker'&&Math.hypot(e.position.x-u.position.x,e.position.y-u.position.y)<140)).sort((a,b) => Number(a.kind === 'base') - Number(b.kind === 'base') || Math.hypot(a.position.x - soldier.position.x,a.position.y - soldier.position.y) - Math.hypot(b.position.x - soldier.position.x,b.position.y - soldier.position.y))[0];
        if(options?.abilities&&target&&Math.hypot(target.position.x-soldier.position.x,target.position.y-soldier.position.y)<80){const next=useAbility(match.gathering);if(next!==match.gathering)abilitiesUsed++;match.gathering=next;}
        if (target && (soldier.order.kind !== 'attack' || soldier.order.enemyId !== target.id)) match.gathering.units = orderAttack(match.gathering.units, target.id);
        else if (!target && assaultReady && scenarioConfig[scenario].victory === 'enemy-base' && soldier.order.kind === 'idle') match.gathering.units = commandAttackMove(match.gathering.units, maps[match.map.id??'arena'].attackEntry??{ x: 896, y: 192 }, match.map);
      }
    }
    match = updateMatch(match, .05);
    if (observe && (frame % 20 === 0 || match.outcome !== 'playing')) observe(match);
    if (!saved && match.waves.elapsedSeconds >= 45) {
      match.paused = true;
      if (updateMatch(match, 100) !== match) throw Error('pause advanced simulation');
      const loaded = decodeSave(encodeSave(match, { camera: { x: 240, y: 180 }, building: 'base' }));
      if (!loaded.ok) throw Error(loaded.error);
      match = loaded.match; match.paused = false; saved = true;
    }
  }
  return { match, spentWood, spentGold, saved,abilitiesUsed };
}
