import {forestContains} from './forestTerrain';
import type {OrderState as importOrderState} from './commandOrders';
import type {SpellState} from './spells';
import type {ResourceService} from './resourceQueue';
import type {AbilityState} from './abilities';
import type {FactionId} from '../config/factions';
import { approachRoute, canInteract } from './approach';
import { resourceServices } from './resourceQueue';
import type { GateFor } from './traffic';
import { advanceRoute } from './navigation';
import type {Footprint} from './placement';
import { placementObstacles } from './placement';
import { updateMappedMove, planRoute, type RouteState } from './navigation';
import type { WorldMap } from './map';
import { gatheringConfig } from '../config/gathering';
import { soldierStats, combatUnitStats, unitStats,workerStats } from '../config/unit';
import { moveTowards, type Position } from './movement';
import type { SelectableUnit } from './selection';

export type ResourceType = 'wood' | 'gold';
export type WorkerOrder = {kind:'repair';buildingId:import('./buildingSelection').BuildingSelection&string} |  { kind: 'idle' } | { kind: 'move' }
  | { kind: 'gather' | 'deliver'; nodeId: string } | {kind:'build';buildingId:`wall-${number}`|`gate-${number}`|`tower-${number}`|'harbor'|'outpost'|'barracks'|'forge'|`farm-${number}`};
export interface Worker extends SelectableUnit, importOrderState {
  navigation?: RouteState;
  kind: 'worker';
  owner?:'player';
  hp?:number;
  order: WorkerOrder;
  cargo: number;
  cargoType?: ResourceType;
}
export interface Soldier extends SelectableUnit, SpellState, importOrderState {
  mana?:number;
  ability?:AbilityState;
  faction?:FactionId;
  archetype?: 'archer'|'catapult'|'specialist'|'air';
  attackCooldown?: number;
  autoOrigin?: Position;
  attackMoveTarget?: Position;
  autoDisabled?: boolean;
  navigation?: RouteState;
  kind: 'soldier';
  owner?:'player';
  order: { kind: 'idle' } | { kind: 'move' } | { kind: 'attack'; enemyId: string };
  hp: number;
  cargo: 0;
}
export type Unit = Worker | Soldier;
export interface ResourceNode {
  grove?:import('../config/referenceTerrain').GroveId;
  resource?: ResourceType;
  id: string;
  position: Position;
  remaining: number;
}
export interface GatheringState {
  /** Derived from match ownership; reconstructed on Load rather than serialized. */
  faction?:FactionId;
  baseSize?:number;
  /** Derived live delivery buildings; never persisted independently. */
  dropoffs?:Footprint[];
  units: Unit[];
  node: ResourceNode;
  extraNodes?:ResourceNode[];
  gold?: ResourceNode;
  goldBalance?: number;
  base: Position;
  wood: number;
  lostCargo?:{wood:number;gold:number};
}

export function resourceNodes(state:GatheringState):ResourceNode[]{return [state.node,...(state.gold?[state.gold]:[]),...(state.extraNodes??[])];}

export function isNodeHit(point: Position, node: ResourceNode): boolean {
  if(forestContains(node,point))return true;
  return Math.hypot(point.x - node.position.x, point.y - node.position.y) <= gatheringConfig.nodeRadius;
}

export function orderUnits(units: Unit[], target: Position, node?: ResourceNode): Unit[] {
  return units.map(unit => {
    if (!unit.selected || (node && unit.kind === 'soldier')) return unit;
    if (unit.kind === 'soldier') return { ...unit, attackMoveTarget: undefined, autoOrigin: undefined, autoDisabled: false, commandMode: undefined, orderQueue: undefined, navigation: undefined, target: { ...target }, order: { kind: 'move' } };
    return {
      ...unit,
      commandMode: undefined, orderQueue: undefined, navigation: undefined,
      target: { ...(node ? node.position : target) },
      order: !node ? { kind: 'move' }
        : unit.cargo >= gatheringConfig.capacity || (unit.cargo > 0 && (unit.cargoType ?? 'wood') !== (node.resource ?? 'wood')) || (node.remaining <= 0 && unit.cargo > 0)
          ? { kind: 'deliver', nodeId: node.id }
          : node.remaining > 0 ? { kind: 'gather', nodeId: node.id } : { kind: 'idle' },
    };
  });
}

/** Spend delta across approach, gathering, delivery and return without losing time. */
export function updateGathering(state: GatheringState, deltaSeconds: number, map?: WorldMap,queue?:{elapsedSeconds:number;gateFor?:GateFor;team?:'player'|'enemy';services?:Map<string,ResourceService>;nodeVisible?:(node:ResourceNode)=>boolean;knownRemaining?:(node:ResourceNode)=>number}): GatheringState {
  const services=queue?.services??(map&&queue?resourceServices(state,map,queue.elapsedSeconds):undefined);
  const nodes = resourceNodes(state).map(node=>({...node}));
  let goldBalance = state.goldBalance ?? 0;
  let wood = state.wood;
  const units = state.units.map(original => {
    if(original.kind==='soldier'&&original.attackMoveTarget)return original;
    if (map && (original.order.kind === 'move' || original.order.kind === 'idle' && original.navigation?.status === 'blocked'
      && original.navigation.error !== 'no-space' && original.navigation.revision !== map.revision)) return updateMappedMove(original, map, deltaSeconds,queue?.gateFor?.(`${queue?.team??'player'}:${original.id}`),state.faction);
    if (original.order.kind === 'build'||original.order.kind==='repair') return original;
    if (original.kind === 'soldier') {
      if (original.attackMoveTarget) return original;
      if (original.order.kind !== 'move') return original;
      const position = moveTowards(original.position, original.target, combatUnitStats(original,state.faction).speed, Math.max(0, deltaSeconds));
      return { ...original, position, order: position.x === original.target.x && position.y === original.target.y
        ? { kind: 'idle' as const } : original.order };
    }
    let worker: Worker = { ...original, position: { ...original.position } };
    let time = Math.max(0, deltaSeconds);
    while (worker.order.kind !== 'idle' && worker.order.kind !== 'build'&&worker.order.kind!=='repair') {
      if (worker.order.kind === 'move') {
        worker.position = moveTowards(worker.position, worker.target, workerStats(state.faction).speed, time);
        if (worker.position.x === worker.target.x && worker.position.y === worker.target.y) {
          worker.order = { kind: 'idle' };
        }
        break;
      }
      const nodeId = worker.order.nodeId;
      const node = nodes.find(n=>n.id===nodeId);
      if (!node) { worker.order={kind:'idle'};worker.navigation=undefined;break; }
      const resource = node.resource ?? 'wood';
      let remaining = node.remaining;
      if (worker.order.kind === 'gather' && (remaining <= 0 && (!queue?.nodeVisible||queue.nodeVisible(node)) || worker.cargo >= gatheringConfig.capacity)) {
        worker.order = worker.cargo > 0 ? { kind: 'deliver', nodeId } : { kind: 'idle' };
        continue;
      }
      const delivering = worker.order.kind === 'deliver';
      const deliveryRects=[placementObstacles(state)[0],...(delivering?state.dropoffs??[]:[])].sort((a,b)=>Math.hypot(worker.position.x-a.x-a.width/2,worker.position.y-a.y-a.height/2)-Math.hypot(worker.position.x-b.x-b.width/2,worker.position.y-b.y-b.height/2));
      const cachedDelivery=worker.navigation?.revision===map?.revision?deliveryRects.find(rect=>worker.navigation?.goalKey===`deliver:${nodeId}:${rect.x}:${rect.y}`):undefined;
      const deliveryRect=delivering&&map&&state.dropoffs?.length?(cachedDelivery??deliveryRects.find(rect=>approachRoute(map,worker.position,rect,gatheringConfig.deliveryRange).status!=='blocked')??deliveryRects[0]):deliveryRects[0];
      const destination = delivering ? {x:deliveryRect.x+deliveryRect.width/2,y:deliveryRect.y+deliveryRect.height/2} : node.position;
      const range = delivering ? gatheringConfig.deliveryRange : gatheringConfig.range;
      if (map) {
        const workMap = { ...map, obstacles: [...map.obstacles, ...placementObstacles(state)] };
        const rect = delivering ? deliveryRect : {
          x:node.position.x-gatheringConfig.nodeRadius, y:node.position.y-gatheringConfig.nodeRadius,
          width:gatheringConfig.nodeRadius*2, height:gatheringConfig.nodeRadius*2 };
        const service=!delivering?services?.get(worker.id):undefined;
        const goalKey = `${worker.order.kind}:${nodeId}:${rect.x}:${rect.y}${service?`:service:${service.point.x}:${service.point.y}:${service.working}`:''}`;
        const cached = worker.navigation;
        const route = cached?.goalKey === goalKey && cached.revision === map.revision ? cached
          : { ...(service?planRoute(workMap,worker.position,service.point,cached?.commandNumber??1):approachRoute(workMap, worker.position, rect, range, cached?.commandNumber ?? 1)), goalKey };
        const step = advanceRoute(workMap, worker.position, route, workerStats(state.faction).speed, time,queue?.gateFor?.(`${queue?.team??'player'}:${worker.id}`));
        worker.position = step.position;
        worker.navigation = { ...step.route, goalKey };
        time = step.remaining;
        if (step.route.status !== 'arrived' || service&&!service.working || !canInteract(workMap, worker.position, rect, range)) break;
      } else {
        const distance = Math.hypot(worker.position.x - destination.x, worker.position.y - destination.y);
        const travel = Math.max(0, distance - range) / workerStats(state.faction).speed;
        worker.position = moveTowards(worker.position, destination, workerStats(state.faction).speed, Math.min(time, travel));
        if (travel > time) break;
        time = Math.max(0, time - travel);
      }
      if (delivering) {
        if ((worker.cargoType ?? 'wood') === 'gold') goldBalance += worker.cargo;
        else wood += worker.cargo;
        worker.cargoType = undefined;
        worker.cargo = 0;
        const returnRemaining=queue?.nodeVisible&&!queue.nodeVisible(node)?queue.knownRemaining?.(node)??remaining:remaining;
        worker.order = returnRemaining > 0 ? { kind: 'gather', nodeId } : { kind: 'idle' };
        continue;
      }
      if(remaining<=0){worker.order=worker.cargo>0?{kind:'deliver',nodeId}:{kind:'idle'};continue;}
      const amount = Math.min(remaining, gatheringConfig.capacity - worker.cargo,
        gatheringConfig.woodPerSecond * time);
      worker.cargoType = resource;
      worker.cargo += amount;
      remaining -= amount;
      node.remaining = remaining;
      time = Math.max(0, time - amount / gatheringConfig.woodPerSecond);
      if (remaining <= 0 || worker.cargo >= gatheringConfig.capacity) {
        worker.order = { kind: 'deliver', nodeId };
      } else {
        break;
      }
    }
    return worker;
  });
  // Depletion also redirects units already processed in this step.
  return {
    ...state,
    units: units.map(worker => worker.kind === 'worker' && worker.order.kind === 'gather'
      && nodes.find(n=>worker.order.kind==='gather' && n.id===worker.order.nodeId&&(!queue?.nodeVisible||queue.nodeVisible(n)))?.remaining === 0
      ? { ...worker, order: worker.cargo > 0
        ? { kind: 'deliver', nodeId: worker.order.nodeId } : { kind: 'idle' } } : worker),
    node: nodes[0], wood,
    ...(state.extraNodes?{extraNodes:nodes.slice(state.gold?2:1)}:{}),
    ...(state.gold ? {gold:nodes[1],goldBalance} : {}),
  };
}
