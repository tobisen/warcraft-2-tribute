import { acquireTargets, type EnemyVisibility } from './acquisition';
import { playerTargets } from './targets';
import { removeDeadUnits } from './destruction';
import { navigationConfig } from '../config/navigation';
import { gatheringConfig } from '../config/gathering';
import { approachRoute, canInteract } from './approach';
import { advanceRoute, updateMappedMove, segmentFits, type RouteState } from './navigation';
import type { WorldMap } from './map';
import type { Footprint, PlacementState } from './placement';
import { combatConfig } from '../config/combat';
import { soldierStats } from '../config/unit';
import type { GatheringState, Unit } from './gathering';
import { moveTowards, type Position } from './movement';

export interface Enemy { owner?:'enemy'; id: string; position: Position; hp: number; navigation?: RouteState }
export interface CombatState { baseOwner?:'player'; enemies: Enemy[]; baseHP: number }

export function enemyAt(enemies: Enemy[], point: Position): Enemy | undefined {
  return [...enemies].reverse().find(e => Math.abs(e.position.x - point.x) <= combatConfig.enemySize / 2
    && Math.abs(e.position.y - point.y) <= combatConfig.enemySize / 2);
}

export function orderAttack(units: Unit[], enemyId: string): Unit[] {
  return units.map(unit => unit.kind === 'soldier' && unit.selected
    ? { ...unit, attackMoveTarget: undefined, autoOrigin: undefined, autoDisabled: false, navigation: undefined, order: { kind: 'attack', enemyId } } : unit);
}

/** Consume travel time before melee damage; positions/ranges use centre distances. */
function approach(position: Position, target: Position, speed: number, range: number, delta: number): {position:Position;attackSeconds:number;navigation?:RouteState} {
  const distance = Math.hypot(target.x - position.x, target.y - position.y);
  const travel = Math.max(0, distance - range) / speed;
  return {
    position: moveTowards(position, target, speed, Math.min(delta, travel)),
    attackSeconds: Math.max(0, delta - travel),
  };
}

function combatApproach(map: WorldMap, position: Position, target: Footprint, targetId: string,
  speed: number, range: number, delta: number, cached?: RouteState) {
  const center={x:target.x+target.width/2,y:target.y+target.height/2};
  const goalKey=`attack:${targetId}:${center.x}:${center.y}`;
  const retryAfter=Math.max(0,(cached?.retryAfter??0)-delta);
  if(canInteract(map,position,target,range))return {position:{...position},attackSeconds:delta,
    navigation:{commandNumber:cached?.commandNumber??1,destination:{...position},waypoints:[],
      revision:map.revision,status:'arrived' as const,goalKey,targetId,retryAfter}};
  const targetMap={...map,obstacles:[...map.obstacles,target]};
  if(cached?.targetId && cached.targetId!==targetId && retryAfter>0 && cached.revision===map.revision) {
    return {position:{...position},attackSeconds:0,navigation:{...cached,targetId,goalKey,
      waypoints:[],status:'arrived' as const,retryAfter}};
  }
  const needsPlan=!cached || cached.revision!==map.revision
    || retryAfter===0 && (cached.goalKey!==goalKey || cached.status==='arrived');
  const route=needsPlan?{...approachRoute(targetMap,position,target,range,cached?.commandNumber??1),
    goalKey,targetId,retryAfter:navigationConfig.pursuitReplanSeconds}:{...cached!,retryAfter};
  // A moving target may invalidate the current connector. Stop until its bounded replan trigger.
  if(route.waypoints[0] && !segmentFits(targetMap,position,route.waypoints[0])) {
    return {position:{...position},attackSeconds:0,navigation:{...route,waypoints:[],status:'arrived' as const}};
  }
  const step=advanceRoute(targetMap,position,route,speed,delta);
  return {position:step.position,attackSeconds:step.route.status==='arrived'
    && canInteract(map,step.position,target,range)?step.remaining:0,
    navigation:{...step.route,goalKey:route.goalKey,retryAfter:route.retryAfter}};
}

const unitFootprint=(position:Position,size:number):Footprint=>({x:position.x-size/2,
  y:position.y-size/2,width:size,height:size});

export function updateCombat(gathering: GatheringState, combat: CombatState, deltaSeconds: number, map?: WorldMap, placement?:PlacementState, visible?:EnemyVisibility) {
  const delta = Math.max(0, deltaSeconds);
  const damage = new Map<string, number>();
  let units = (delta>0?acquireTargets(gathering.units,combat.enemies,map,visible):gathering.units).map(unit => {
    if(unit.kind==='soldier'&&unit.attackMoveTarget&&unit.order.kind==='move') {
      const moved=map?updateMappedMove(unit,map,delta):{...unit,position:moveTowards(unit.position,unit.target,soldierStats.speed,delta)};
      const arrived=moved.position.x===unit.target.x&&moved.position.y===unit.target.y;
      return {...moved,...(arrived||moved.navigation?.status==='blocked'?{attackMoveTarget:undefined,autoOrigin:undefined,order:{kind:'idle' as const}}:{})};
    }
    if (unit.kind !== 'soldier' || unit.hp <= 0 || unit.order.kind !== 'attack') return unit;
    const enemy = combat.enemies.find(e => e.id === (unit.order.kind === 'attack' ? unit.order.enemyId : '') && e.hp > 0);
    if (!enemy) return { ...unit, navigation: undefined, order: { kind: 'idle' as const } };
    const step = map ? combatApproach(map,unit.position,unitFootprint(enemy.position,combatConfig.enemySize),
      enemy.id,soldierStats.speed,combatConfig.soldierRange,delta,unit.navigation)
      : approach(unit.position, enemy.position, soldierStats.speed, combatConfig.soldierRange, delta);
    damage.set(enemy.id, (damage.get(enemy.id) ?? 0) + step.attackSeconds * combatConfig.soldierDamagePerSecond);
    return { ...unit, position: step.position, ...(step.navigation ? {navigation:step.navigation}: {}) };
  });
  // Both sides attack from the same live snapshot, so lethal blows are simultaneous.
  const playerDamage = new Map<string, number>();
  const originalTargets=playerTargets(gathering,combat,placement);
  const priority={soldier:0,worker:1,barracks:2,farm:2,base:3};
  const movingEnemies = combat.enemies.filter(e => e.hp > 0).map(enemy => {
    const nearby=originalTargets.filter(t=>t.kind!=='base').map(t=>({target:t,
      distance:Math.hypot(t.footprint.x+t.footprint.width/2-enemy.position.x,t.footprint.y+t.footprint.height/2-enemy.position.y)}))
      .filter(t=>t.distance<=combatConfig.enemyAggroRange).sort((a,b)=>a.distance-b.distance
        ||priority[a.target.kind]-priority[b.target.kind]||a.target.id.localeCompare(b.target.id,'en',{numeric:true}));
    const target=nearby[0]?.target??originalTargets.find(t=>t.kind==='base');
    if(!target)return {...enemy,navigation:undefined};
    const moved=units.find(u=>u.id===target.id);
    const footprint=map&&moved?unitFootprint(moved.position,target.footprint.width):target.footprint;
    const center={x:footprint.x+footprint.width/2,y:footprint.y+footprint.height/2};
    const step=map?combatApproach(map,enemy.position,footprint,target.id,combatConfig.enemySpeed,combatConfig.enemyRange,delta,enemy.navigation)
      :approach(enemy.position,center,combatConfig.enemySpeed,combatConfig.enemyRange,delta);
    playerDamage.set(target.id,(playerDamage.get(target.id)??0)+step.attackSeconds*combatConfig.enemyDamagePerSecond);
    return {...enemy,position:step.position,...(step.navigation?{navigation:step.navigation}:{})};
  });
  units=units.map(unit=>unit.hp!==undefined?{...unit,hp:Math.max(0,unit.hp-(playerDamage.get(unit.id)??0))}:unit);
  const surviving=removeDeadUnits({...gathering,units});units=surviving.units;
  const nextPlacement=placement?{...placement,
    ...(placement.barracks?{barracksHP:Math.max(0,(placement.barracksHP??combatConfig.barracksHP)-(playerDamage.get('barracks')??0))}:{}),
    ...(placement.farms?{farms:placement.farms.map(f=>({...f,hp:Math.max(0,(f.hp??combatConfig.farmHP)-(playerDamage.get(f.id)??0))}))}:{})}:undefined;
  const nextCombat={...combat,baseHP:Math.max(0,combat.baseHP-(playerDamage.get('base')??0))};
  const aliveTargets=new Set(playerTargets(surviving,nextCombat,nextPlacement).map(t=>t.id));
  const enemies = movingEnemies.map(enemy => ({ ...enemy, hp: Math.max(0, enemy.hp - (damage.get(enemy.id) ?? 0)) }))
    .filter(e => e.hp > 0).map(enemy => enemy.navigation?.targetId && !aliveTargets.has(enemy.navigation.targetId) ? {...enemy,navigation:undefined} : enemy);
  units = units.map(unit => unit.kind === 'soldier' && unit.order.kind === 'attack'
    && !enemies.some(e => e.id === (unit.order.kind === 'attack' ? unit.order.enemyId : ''))
    ? { ...unit, navigation: undefined, order: { kind: 'idle' as const } } : unit);
  return { gathering: { ...surviving, units }, combat: {...nextCombat,enemies},...(nextPlacement?{placement:nextPlacement}:{}) };
}
