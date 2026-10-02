import type { MovementGate, GateFor } from './traffic';
import { upgradeConfig } from '../config/upgrades';
import { archerConfig } from '../config/archer';
import { advanceProjectiles, type Projectile } from './projectiles';
import { acquireTargets, type EnemyVisibility } from './acquisition';
import { arenaConfig } from '../config/arena';
import { baseFootprint } from './buildingSelection';
import { type PlayerTarget, playerTargets } from './targets';
import { removeDeadUnits } from './destruction';
import { navigationConfig } from '../config/navigation';
import { gatheringConfig } from '../config/gathering';
import { approachRoute, canInteract } from './approach';
import { advanceRoute, planRoute, updateMappedMove, segmentFits, type RouteState } from './navigation';
import type { WorldMap } from './map';
import type { Footprint, PlacementState } from './placement';
import { combatConfig } from '../config/combat';
import { soldierStats, combatUnitStats, rangedStats } from '../config/unit';
import type { GatheringState, Unit } from './gathering';
import { moveTowards, type Position } from './movement';

export interface Enemy { owner?:'enemy'; kind?:'unit'|'base'; order?:{kind:'idle'}|{kind:'defend';targetId:string}|{kind:'muster'|'attack-move';destination:Position}; id: string; position: Position; hp: number; footprint?:Footprint; navigation?: RouteState }
export interface CombatState { baseOwner?:'player'; enemies: Enemy[]; baseHP: number; projectiles?:Projectile[]; nextProjectileNumber?:number; destroyedEnemyFootprints?:Footprint[]; upgrades?:{attack:number;defense:number} }

export function enemyAt(enemies: Enemy[], point: Position): Enemy | undefined {
  return [...enemies].reverse().find(e=>e.footprint?point.x>=e.footprint.x&&point.x<=e.footprint.x+e.footprint.width&&point.y>=e.footprint.y&&point.y<=e.footprint.y+e.footprint.height:Math.abs(e.position.x-point.x)<=combatConfig.enemySize/2&&Math.abs(e.position.y-point.y)<=combatConfig.enemySize/2);
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
  speed: number, range: number, delta: number, cached?: RouteState, gate?:MovementGate) {
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
  const step=advanceRoute(targetMap,position,route,speed,delta,gate);
  return {position:step.position,attackSeconds:step.route.status==='arrived'
    && canInteract(map,step.position,target,range)?step.remaining:0,
    navigation:{...step.route,goalKey:route.goalKey,retryAfter:route.retryAfter}};
}

const unitFootprint=(position:Position,size:number):Footprint=>({x:position.x-size/2,
  y:position.y-size/2,width:size,height:size});

export function updateCombat(gathering: GatheringState, combat: CombatState, deltaSeconds: number, map?: WorldMap, placement?:PlacementState, visible?:EnemyVisibility,playerVisible:(target:PlayerTarget,enemy:Enemy)=>boolean=()=>true,projectileVisible?:(enemy:Enemy,projectile:Projectile)=>boolean,gateFor?:GateFor) {
  const delta = Math.max(0, deltaSeconds);
  const damage = new Map<string, number>();
  const attackMultiplier=combat.upgrades?.attack?upgradeConfig.attackMultiplier:1;
  const defenseMultiplier=combat.upgrades?.defense?upgradeConfig.defenseMultiplier:1;
  let nextProjectileNumber=combat.nextProjectileNumber??1;
  const shots:{projectile:Projectile;time:number}[]=[];
  let units = (delta>0?acquireTargets(gathering.units,combat.enemies,map,visible):gathering.units).map(unit => {
    if(unit.kind==='soldier'&&unit.attackMoveTarget&&unit.order.kind==='move') {
      const moved=map?updateMappedMove(unit,map,delta,gateFor?.(`player:${unit.id}`)):{...unit,position:moveTowards(unit.position,unit.target,combatUnitStats(unit).speed,delta)};
      const arrived=moved.position.x===unit.target.x&&moved.position.y===unit.target.y;
      return {...moved,...(rangedStats(unit)?{attackCooldown:Math.max(0,(unit.attackCooldown??0)-delta)}:{}),...(arrived||moved.navigation?.status==='blocked'?{attackMoveTarget:undefined,autoOrigin:undefined,order:{kind:'idle' as const}}:{})};
    }
    if (unit.kind !== 'soldier' || unit.hp <= 0 || unit.order.kind !== 'attack') return unit.kind==='soldier'&&rangedStats(unit)?{...unit,attackCooldown:Math.max(0,(unit.attackCooldown??0)-delta)}:unit;
    const enemy = combat.enemies.find(e => e.id === (unit.order.kind === 'attack' ? unit.order.enemyId : '') && e.hp > 0);
    if (!enemy||visible&&!visible(enemy,unit)) return { ...unit, autoOrigin:undefined,navigation: undefined, order: { kind: 'idle' as const } };
    const ranged=rangedStats(unit);
    const range=ranged?.range??combatConfig.soldierRange;
    const speed=combatUnitStats(unit).speed;
    const step = map ? combatApproach({...map,bodyHalf:combatUnitStats(unit).size/2},unit.position,enemy.footprint??unitFootprint(enemy.position,combatConfig.enemySize),
      enemy.id,speed,range,delta,unit.navigation,gateFor?.(`player:${unit.id}`))
      : approach(unit.position, enemy.position, speed, range, delta);
    if(ranged) {
      let cooldown=Math.max(0,(unit.attackCooldown??0)-(delta-step.attackSeconds)),time=step.attackSeconds;
      const canFire=(!visible||visible(enemy,unit))&&(!map||segmentFits(enemy.footprint?{...map,obstacles:map.obstacles.filter(o=>!(o.x===enemy.footprint!.x&&o.y===enemy.footprint!.y&&o.width===enemy.footprint!.width&&o.height===enemy.footprint!.height))}:map,step.position,enemy.position,0));
      while(canFire&&time>0&&time+1e-9>=cooldown) {
        time=Math.max(0,time-cooldown);
        shots.push({projectile:{id:`arrow-${nextProjectileNumber++}`,shooterId:unit.id,targetId:enemy.id,
          position:{...step.position},destination:{...enemy.position},speed:ranged.projectileSpeed,
          remainingLife:ranged.projectileLifetime,damage:ranged.damage*attackMultiplier,hitRadius:unit.archetype==='archer'?archerConfig.hitRadius:0,
          ...(enemy.footprint?{targetFootprint:{...enemy.footprint}}:{}),
          ...('splashRadius' in ranged?{splashRadius:ranged.splashRadius}:{})},time});
        cooldown=ranged.attackInterval;
      }
      cooldown=Math.max(0,cooldown-time);
      return {...unit,position:step.position,attackCooldown:cooldown,...(step.navigation?{navigation:step.navigation}:{})};
    }
    damage.set(enemy.id, (damage.get(enemy.id) ?? 0) + step.attackSeconds * combatConfig.soldierDamagePerSecond*attackMultiplier);
    return { ...unit, position: step.position, ...(step.navigation ? {navigation:step.navigation}: {}) };
  });
  // Both sides attack from the same live snapshot, so lethal blows are simultaneous.
  const playerDamage = new Map<string, number>();
  const originalTargets=playerTargets(gathering,combat,placement);
  const priority={soldier:0,worker:1,barracks:2,farm:2,forge:2,base:3};
  const movingEnemies = combat.enemies.filter(e => e.hp > 0).map(enemy => {
    if(enemy.footprint||enemy.order?.kind==='idle')return enemy;
    if(enemy.order?.kind==='muster'){
      const route=enemy.navigation??(map?planRoute(map,enemy.position,enemy.order.destination):undefined);
      const step=map&&route?advanceRoute(map,enemy.position,route,combatConfig.enemySpeed,delta,gateFor?.(`enemy:${enemy.id}`)):{position:moveTowards(enemy.position,enemy.order.destination,combatConfig.enemySpeed,delta),route:undefined};
      return {...enemy,position:step.position,...(step.route?{navigation:step.route}:{})};
    }

    const knownTargets=originalTargets.filter(t=>playerVisible(t,enemy));
    const nearby=knownTargets.filter(t=>t.kind!=='base').map(t=>({target:t,
      distance:Math.hypot(t.footprint.x+t.footprint.width/2-enemy.position.x,t.footprint.y+t.footprint.height/2-enemy.position.y)}))
      .filter(t=>t.distance<=combatConfig.enemyAggroRange).sort((a,b)=>a.distance-b.distance
        ||priority[a.target.kind]-priority[b.target.kind]||a.target.id.localeCompare(b.target.id,'en',{numeric:true}));
    const target=enemy.order?.kind==='defend'?knownTargets.find(t=>enemy.order?.kind==='defend'&&t.id===enemy.order.targetId):nearby[0]?.target??knownTargets.find(t=>t.kind==='base');
    if(!target){
      if(enemy.order?.kind==='defend')return {...enemy,navigation:undefined,order:{kind:'idle' as const}};
      const goal=enemy.order?.kind==='attack-move'?enemy.order.destination:arenaConfig.base;
      const step=map?combatApproach(map,enemy.position,baseFootprint(goal),'explore-goal',combatConfig.enemySpeed,combatConfig.enemyRange,delta,enemy.navigation?.targetId==='explore-goal'?enemy.navigation:undefined,gateFor?.(`enemy:${enemy.id}`)):approach(enemy.position,goal,combatConfig.enemySpeed,combatConfig.enemyRange,delta);
      return {...enemy,position:step.position,...(step.navigation?{navigation:step.navigation}:{})};
    }
    const moved=units.find(u=>u.id===target.id);
    const footprint=map&&moved?unitFootprint(moved.position,target.footprint.width):target.footprint;
    if(!playerVisible({...target,footprint},enemy))return {...enemy,navigation:undefined};
    const center={x:footprint.x+footprint.width/2,y:footprint.y+footprint.height/2};
    const step=map?combatApproach(map,enemy.position,footprint,target.id,combatConfig.enemySpeed,combatConfig.enemyRange,delta,enemy.navigation,gateFor?.(`enemy:${enemy.id}`))
      :approach(enemy.position,center,combatConfig.enemySpeed,combatConfig.enemyRange,delta);
    playerDamage.set(target.id,(playerDamage.get(target.id)??0)+step.attackSeconds*combatConfig.enemyDamagePerSecond);
    return {...enemy,position:step.position,...(step.navigation?{navigation:step.navigation}:{})};
  });
  const visibleProjectile=(enemy:Enemy,p:Projectile)=>projectileVisible?projectileVisible(enemy,p):!visible||units.some(u=>u.id===p.shooterId&&u.kind==='soldier'&&visible(enemy,u));
  const existing=advanceProjectiles(combat.projectiles??[],movingEnemies,delta,map,visibleProjectile);
  const projectiles=[...existing.projectiles];
  for(const [id,amount] of existing.damage)damage.set(id,(damage.get(id)??0)+amount);
  for(const shot of shots){const advanced=advanceProjectiles([shot.projectile],movingEnemies,shot.time,map,visibleProjectile);
    projectiles.push(...advanced.projectiles);for(const [id,amount] of advanced.damage)damage.set(id,(damage.get(id)??0)+amount);}
  units=units.map(unit=>unit.hp!==undefined?{...unit,hp:Math.max(0,unit.hp-(playerDamage.get(unit.id)??0)*(unit.kind==='soldier'?defenseMultiplier:1))}:unit);
  const surviving=removeDeadUnits({...gathering,units});units=surviving.units;
  const nextPlacement=placement?{...placement,
    ...(placement.forge?{forge:{...placement.forge,hp:Math.max(0,placement.forge.hp-(playerDamage.get('forge')??0))}}:{}),
    ...(placement.barracks?{barracksHP:Math.max(0,(placement.barracksHP??combatConfig.barracksHP)-(playerDamage.get('barracks')??0))}:{}),
    ...(placement.farms?{farms:placement.farms.map(f=>({...f,hp:Math.max(0,(f.hp??combatConfig.farmHP)-(playerDamage.get(f.id)??0))}))}:{})}:undefined;
  const nextCombat={...combat,baseHP:Math.max(0,combat.baseHP-(playerDamage.get('base')??0))};
  const aliveTargets=new Set(playerTargets(surviving,nextCombat,nextPlacement).map(t=>t.id));
  const enemies = movingEnemies.map(enemy => ({ ...enemy, hp: Math.max(0, enemy.hp - (damage.get(enemy.id) ?? 0)) }))
    .filter(e => e.hp > 0).map(enemy => enemy.navigation?.targetId && enemy.navigation.targetId!=='explore-goal' && !aliveTargets.has(enemy.navigation.targetId) ? {...enemy,navigation:undefined} : enemy);
  const destroyedEnemyFootprints=movingEnemies.filter(e=>e.footprint&&e.hp-(damage.get(e.id)??0)<=0).map(e=>e.footprint!);
  units = units.map(unit => unit.kind === 'soldier' && unit.order.kind === 'attack'
    && !enemies.some(e => e.id === (unit.order.kind === 'attack' ? unit.order.enemyId : ''))
    ? { ...unit, navigation: undefined, order: { kind: 'idle' as const } } : unit);
  return { gathering: { ...surviving, units }, combat: {...nextCombat,enemies,...(destroyedEnemyFootprints.length?{destroyedEnemyFootprints}:{}),...(combat.projectiles||shots.length?{projectiles:projectiles.filter(p=>p.splashRadius||enemies.some(e=>e.id===p.targetId)),nextProjectileNumber}:{})},...(nextPlacement?{placement:nextPlacement}:{}) };
}
