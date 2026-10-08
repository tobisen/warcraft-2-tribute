import {marineFlightMap} from './terrainNavigation';
import {seaMonsterStep} from './bosses';
import {cavalryArmorMultiplier} from '../config/roleResearch';
import {cavalryRules} from '../config/cavalry';
import {bossRules,bossDamageProfile,bossIncoming} from '../config/bosses';
import {upgradeMultiplier} from '../config/upgrades';
import type {PlayerId} from '../config/players';
import {airPresentation} from '../config/air';
import {attackTargets,canAttackDomain,isAir,movementMap,targetDomain} from './domains';
import {spellModifiers,type SpellState} from './spells';
import {defenseBalanceConfig} from '../config/repair';
import {enemyNavigationMap} from './map';
import {towerShots} from './towers';
import {enemyUnitStats,enemyRangedStats,enemySoldier} from './enemyUnits';
import {factions,type FactionId} from '../config/factions';
import {enemyBody,enemySize} from './enemyBody';
import {prepareNavalCombat,prepareEnemySubmarines} from './navalCombat';
import type {NavyState} from './navy';
import {abilityEffects} from './abilities';
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
import { soldierStats, combatUnitStats, rangedStats,workerStats,workerCombatConfig } from '../config/unit';
import type { GatheringState, Unit,WorkerOrder,ResourceType } from './gathering';
import { moveTowards, type Position } from './movement';

export interface EnemyWork {cargo:number;cargoType?:ResourceType;target:Position;order:WorkerOrder}
export interface Enemy extends SpellState {seaMonster?:{id:string;patrolIndex:number;active?:boolean};navalRole?:'submarine';scouting?:import('./scouting').ScoutState;healFlash?:number;healAutocast?:boolean;boss?:import('../config/bosses').BossId;playerId?:PlayerId;faction?:FactionId;mana?:number;role?:'soldier'|'archer'|'catapult'|'ballista'|'specialist'|'air'|'cavalry'|'healer'|'giant'|'scout';attackCooldown?:number;ability?:import('./abilities').AbilityState;legacyProfile?:true; owner?:'enemy'; kind?:'ship'|'unit'|'base'|'worker'|'building';navalLanding?:true;buildingType?:'siegeWorks'|'aviary'|'stable'|'academy'|'harbor'|'outpost'|'barracks'|'farm'|'forge';construction?:import('./placement').ConstructionJob;work?:EnemyWork; order?:{kind:'idle'}|{kind:'defend';targetId:string}|{kind:'muster'|'attack-move';destination:Position}; id: string; position: Position; hp: number; footprint?:Footprint; navigation?: RouteState }
export interface CombatState {baseDevelopment?:import('../config/baseUpgrade').BaseDevelopment; baseOwner?:'player'; enemies: Enemy[]; baseHP: number; projectiles?:Projectile[]; nextProjectileNumber?:number; destroyedEnemyFootprints?:Footprint[]; enemyUpgrades?:{cavalryArmor?:number;attack:number;defense:number};upgrades?:{cavalryArmor?:number;attack:number;defense:number} }

export function enemyAt(enemies: Enemy[], point: Position): Enemy | undefined {
  return [...enemies].reverse().find(e=>e.footprint?point.x>=e.footprint.x&&point.x<=e.footprint.x+e.footprint.width&&point.y>=e.footprint.y&&point.y<=e.footprint.y+e.footprint.height:Math.abs(e.position.x-point.x)<=enemySize(e)/2&&Math.abs(e.position.y-(isAir(e)?airPresentation.height:0)-point.y)<=enemySize(e)/2);
}

export function orderAttack(units: Unit[], enemyId: string): Unit[] {
  return units.map(unit => unit.selected
    ? { ...unit, commandMode: undefined, orderQueue: undefined, ...(unit.kind==='soldier'?{attackMoveTarget: undefined, autoOrigin: undefined, autoDisabled: false}:{}), navigation: undefined, order: { kind: 'attack', enemyId } } : unit);
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

// Shared attackers must not rebuild the whole terrain index for an identical target body.
// Geometry, terrain revision and initialization length invalidate this bounded derived cache.
const targetObstacleCache=new WeakMap<WorldMap['obstacles'],{revision:number;length:number;targets:Map<string,Footprint[]>}>();
function combatObstacles(map:WorldMap,target:Footprint):Footprint[]{
 if(map.ignoreAttackOcclusion)return map.obstacles;
 let cache=targetObstacleCache.get(map.obstacles);
 if(!cache||cache.revision!==map.revision||cache.length!==map.obstacles.length){cache={revision:map.revision,length:map.obstacles.length,targets:new Map()};targetObstacleCache.set(map.obstacles,cache);}
 const key=`${target.x},${target.y},${target.width},${target.height}`,cached=cache.targets.get(key);if(cached)return cached;
 const obstacles=[...map.obstacles,{...target}];if(cache.targets.size>=16)cache.targets.delete(cache.targets.keys().next().value!);cache.targets.set(key,obstacles);return obstacles;
}

export function combatApproach(map: WorldMap, position: Position, target: Footprint, targetId: string,
  speed: number, range: number, delta: number, cached?: RouteState, gate?:MovementGate) {
  const center={x:target.x+target.width/2,y:target.y+target.height/2};
  const goalKey=`attack:${targetId}:${center.x}:${center.y}`;
  const retryAfter=Math.max(0,(cached?.retryAfter??0)-delta);
  if(canInteract(map,position,target,range))return {position:{...position},attackSeconds:delta,
    navigation:{commandNumber:cached?.commandNumber??1,destination:{...position},waypoints:[],
      revision:map.revision,status:'arrived' as const,goalKey,targetId,retryAfter}};
  const targetMap={...map,obstacles:combatObstacles(map,target)};
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

export interface CombatScope {side:'player'|'enemy';canTarget?:(enemy:Enemy)=>boolean;targets?:PlayerTarget[];onDamage?:(damage:Map<string,number>)=>void}

export function updateCombat(gathering: GatheringState, combat: CombatState, deltaSeconds: number, map?: WorldMap, placement?:PlacementState, visible?:EnemyVisibility,playerVisible:(target:PlayerTarget,enemy:Enemy)=>boolean=()=>true,projectileVisible?:(enemy:Enemy,projectile:Projectile)=>boolean,gateFor?:GateFor,navy?:NavyState,navalVisible:(enemy:Enemy)=>boolean=()=>true,enemyFaction:FactionId='clans',towerVisible:(e:Enemy)=>boolean=()=>!visible,scope?:CombatScope) {
  const delta = Math.max(0, deltaSeconds);
  const damage = new Map<string, number>();
  const attackableEnemies=combat.enemies.filter(e=>!scope?.canTarget||scope.canTarget(e));
  const player=factions[gathering.faction??'crown'],opponent=factions[enemyFaction];
  const attackMultiplier=upgradeMultiplier(player.upgrades.attack.multiplier,combat.upgrades?.attack);
  const defenseMultiplier=upgradeMultiplier(player.upgrades.defense.multiplier,combat.upgrades?.defense);
  let nextProjectileNumber=combat.nextProjectileNumber??1;
  const naval=prepareNavalCombat(navy,attackableEnemies,scope?.side==='enemy'?0:delta,map,nextProjectileNumber,attackMultiplier,navalVisible,player.naval.units.warship);nextProjectileNumber=naval.nextProjectileNumber;
  const towers=towerShots(placement,attackableEnemies,scope?.side==='enemy'?0:delta,nextProjectileNumber,towerVisible);placement=towers.placement;nextProjectileNumber=towers.next;
  const shots:{projectile:Projectile;time:number}[]=[...naval.shots,...towers.shots];
  let units = (scope?.side==='enemy'?gathering.units:delta>0?acquireTargets(gathering.units,attackableEnemies,map,visible,gathering.faction):gathering.units).map(unit => {
    if(scope?.side==='enemy')return unit;
    if(unit.kind==='soldier'&&unit.attackMoveTarget&&unit.order.kind==='move') {
      const moved=map?updateMappedMove(unit,map,delta,gateFor?.(`player:${unit.id}`),gathering.faction):{...unit,position:moveTowards(unit.position,unit.target,combatUnitStats(unit,gathering.faction).speed,delta)};
      const arrived=moved.position.x===unit.target.x&&moved.position.y===unit.target.y;
      return {...moved,...(rangedStats(unit,gathering.faction)?{attackCooldown:Math.max(0,(unit.attackCooldown??0)-delta)}:{}),...(arrived||moved.navigation?.status==='blocked'?{attackMoveTarget:undefined,autoOrigin:undefined,order:{kind:'idle' as const}}:{})};
    }
    if(unit.kind==='soldier'&&unit.order.kind==='hunt')return unit;
    if (unit.hp!==undefined&&unit.hp <= 0 || unit.order.kind !== 'attack') return unit.kind==='soldier'&&rangedStats(unit,gathering.faction)?{...unit,attackCooldown:Math.max(0,(unit.attackCooldown??0)-delta)}:unit;
    const enemy = attackableEnemies.find(e => e.id === (unit.order.kind === 'attack' ? unit.order.enemyId : '') && e.hp > 0);
    if (!enemy||!canAttackDomain(unit,enemy,gathering.faction??'crown')||visible&&!visible(enemy,unit)) return { ...unit, autoOrigin:undefined,navigation: undefined, order: { kind: 'idle' as const } };
    const stats=unit.kind==='worker'?{...workerStats(gathering.faction),...workerCombatConfig}:combatUnitStats(unit,gathering.faction);
    const ranged=unit.kind==='soldier'?rangedStats(unit,gathering.faction):null;
    const range=ranged?.range??stats.range??combatConfig.soldierRange;
    const speed=stats.speed;
    const step = unit.commandMode?.kind==='hold' ? {position:{...unit.position},attackSeconds:(map?canInteract({...movementMap(map,unit),attackAcrossWater:!!ranged&&targetDomain(enemy)==='sea',ignoreAttackOcclusion:isAir(enemy)},unit.position,enemyBody(enemy),range):Math.hypot(unit.position.x-enemy.position.x,unit.position.y-enemy.position.y)<=range)?delta:0,navigation:undefined} : map ? combatApproach({...movementMap(map,unit),attackAcrossWater:!!ranged&&targetDomain(enemy)==='sea',ignoreAttackOcclusion:isAir(enemy),bodyHalf:stats.size/2},unit.position,enemyBody(enemy),
      enemy.id,speed,range,delta,unit.navigation,gateFor?.(`player:${unit.id}`))
      : approach(unit.position, enemy.position, speed, range, delta);
    if(ranged&&unit.kind==='soldier') {
      let cooldown=Math.max(0,(unit.attackCooldown??0)-(delta-step.attackSeconds)),time=step.attackSeconds;
      const canFire=(!visible||visible(enemy,unit))&&(!map||isAir(unit)||isAir(enemy)||segmentFits(enemy.footprint?{...marineFlightMap(map),obstacles:map.obstacles.filter(o=>!(o.x===enemy.footprint!.x&&o.y===enemy.footprint!.y&&o.width===enemy.footprint!.width&&o.height===enemy.footprint!.height))}:marineFlightMap(map),step.position,enemy.position,0));
      while(canFire&&time>0&&time+1e-9>=cooldown) {
        time=Math.max(0,time-cooldown);
        shots.push({projectile:{bossProfile:bossDamageProfile(unit.kind==='soldier'?unit.archetype:undefined,true),id:`arrow-${nextProjectileNumber++}`,shooterId:unit.id,targetId:enemy.id,
          position:{...step.position},destination:{...enemy.position},speed:ranged.projectileSpeed,
          targets:attackTargets(unit,gathering.faction??'crown'),...(isAir(unit)||isAir(enemy)?{airborne:true as const}:{}),...(combatUnitStats(unit,gathering.faction).damageByDomain?{damageByDomain:combatUnitStats(unit,gathering.faction).damageByDomain}:{}),...(unit.archetype==='catapult'?{defenseMultiplier:defenseBalanceConfig.siegeDefenseMultiplier}:{}),remainingLife:ranged.projectileLifetime,damage:ranged.damage*(enemy.footprint?stats.buildingDamageMultiplier??1:1)*attackMultiplier*abilityEffects(gathering,unit,delta-time).attackMultiplier*spellModifiers(unit,delta-time).attack,hitRadius:'hitRadius' in ranged?ranged.hitRadius:0,
          ...(enemy.footprint?{targetFootprint:{...enemy.footprint}}:{}),
          ...('splashRadius' in ranged?{splashRadius:ranged.splashRadius}:{})},time});
        cooldown=ranged.attackInterval;
      }
      cooldown=Math.max(0,cooldown-time);
      return {...unit,position:step.position,attackCooldown:cooldown,...(step.navigation?{navigation:step.navigation}:{})};
    }
    damage.set(enemy.id, (damage.get(enemy.id) ?? 0) + (enemy.boss?bossIncoming(enemy.boss,bossDamageProfile(unit.kind==='soldier'?unit.archetype:undefined)):1)*step.attackSeconds * (stats.damagePerSecond??combatConfig.soldierDamagePerSecond)*(enemy.footprint?stats.buildingDamageMultiplier??1:1)*(unit.kind==='soldier'&&!unit.archetype&&enemy.role==='cavalry'?cavalryRules.infantryDamageMultiplier:1)*(unit.kind==='worker'?1:attackMultiplier*abilityEffects(gathering,unit).attackMultiplier*spellModifiers(unit).attack));
    return { ...unit, position: step.position, ...(step.navigation ? {navigation:step.navigation}: {}) };
  });
  // Both sides attack from the same live snapshot, so lethal blows are simultaneous.
  const playerDamage = new Map<string, number>();
  const neutralTargets:PlayerTarget[]=combat.enemies.filter(e=>(e.boss||e.seaMonster)&&e.hp>0).map(e=>({id:e.id,boss:e.boss,domain:e.seaMonster?'sea':'land',kind:e.seaMonster?'ship':'soldier',owner:'player',hp:e.hp,footprint:enemyBody(e)}));
  const originalTargets=[...(scope?.targets??playerTargets(gathering,combat,placement,navy)),...neutralTargets];
  const bossTargets:PlayerTarget[]=neutralTargets.length||combat.projectiles?.some(p=>p.shooterId?.startsWith('enemy-boss-'))?[...originalTargets.filter(t=>!t.boss&&!t.id.startsWith('enemy-sea-monster-')),...combat.enemies.filter(e=>!e.boss&&e.hp>0).map(e=>({id:e.id,domain:targetDomain(e),kind:e.kind==='ship'?'ship' as const:e.kind==='worker'?'worker' as const:e.footprint?'barracks' as const:'soldier' as const,owner:'player' as const,hp:e.hp,footprint:enemyBody(e)}))]:[];
  const bossTargetIds=new Set(bossTargets.map(t=>t.id));
  const enemyNavy=prepareEnemySubmarines(combat.enemies,originalTargets,scope?.side==='player'?0:delta,map,nextProjectileNumber,enemyFaction,upgradeMultiplier(opponent.upgrades.attack.multiplier,combat.enemyUpgrades?.attack),playerVisible);nextProjectileNumber=enemyNavy.next;shots.push(...enemyNavy.shots);
  const priority={siegeWorks:7,aviary:7,stable:5,academy:2,wall:2,gate:2,tower:2,ship:0,harbor:2,soldier:0,worker:1,barracks:2,farm:2,forge:2,base:3};
  const enemyGathering={...gathering,faction:enemyFaction};
  const movingEnemies = enemyNavy.enemies.filter(e => e.hp > 0).map(enemy => {
    if(enemy.seaMonster&&map){if(scope?.side==='enemy')return enemy;const result=seaMonsterStep(enemy,playerTargets({...gathering,units},combat,placement,naval.navy),map,delta);if(result.target)playerDamage.set(result.target.id,(playerDamage.get(result.target.id)??0)+result.damage);return result.enemy;}
    if(scope?.side==='player'||enemy.kind==='ship')return enemy;
    const stats=enemyUnitStats(enemy,enemyFaction),ranged=enemyRangedStats(enemy,enemyFaction);
    const cooling={...enemy,...(ranged?{attackCooldown:Math.max(0,(enemy.attackCooldown??0)-delta)}:{})};
    const enemyMap=map?{...movementMap(enemyNavigationMap(map),enemy),bodyHalf:stats.size/2}:undefined;
    if(enemy.kind==='worker'||enemy.footprint||enemy.order?.kind==='idle')return cooling;
    if(enemy.order?.kind==='muster'){
      const route=enemy.navigation??(map?planRoute(enemyMap!,enemy.position,enemy.order.destination):undefined);
      const step=map&&route?advanceRoute(enemyMap!,enemy.position,route,stats.speed,delta,gateFor?.(`enemy:${enemy.id}`)):{position:moveTowards(enemy.position,enemy.order.destination,stats.speed,delta),route:undefined};
      return {...cooling,position:step.position,...(step.route?{navigation:step.route}:{})};
    }

    const knownTargets=(enemy.boss?bossTargets:originalTargets).filter(t=>(enemy.boss?Math.hypot(t.footprint.x+t.footprint.width/2-enemy.position.x,t.footprint.y+t.footprint.height/2-enemy.position.y)<=bossRules.range:playerVisible(t,enemy))&&canAttackDomain(enemy,t,enemyFaction));
    const nearby=knownTargets.filter(t=>t.kind!=='base').map(t=>({target:t,
      distance:Math.hypot(t.footprint.x+t.footprint.width/2-enemy.position.x,t.footprint.y+t.footprint.height/2-enemy.position.y)}))
      .filter(t=>t.distance<=stats.aggroRange).sort((a,b)=>a.distance-b.distance
        ||priority[a.target.kind]-priority[b.target.kind]||a.target.id.localeCompare(b.target.id,'en',{numeric:true}));
    const siegeDefense=enemy.role==='catapult'?knownTargets.filter(t=>['tower','wall','gate'].includes(t.kind)&&Math.hypot(t.footprint.x+t.footprint.width/2-enemy.position.x,t.footprint.y+t.footprint.height/2-enemy.position.y)<=stats.aggroRange).sort((a,b)=>Math.hypot(a.footprint.x+a.footprint.width/2-enemy.position.x,a.footprint.y+a.footprint.height/2-enemy.position.y)-Math.hypot(b.footprint.x+b.footprint.width/2-enemy.position.x,b.footprint.y+b.footprint.height/2-enemy.position.y)||a.id.localeCompare(b.id))[0]:undefined;
    const target=enemy.order?.kind==='defend'?knownTargets.find(t=>enemy.order?.kind==='defend'&&t.id===enemy.order.targetId):siegeDefense??nearby[0]?.target??knownTargets.find(t=>t.kind==='base');
    if(!target){
      if(enemy.boss)return cooling;
      if(enemy.order?.kind==='defend')return {...enemy,navigation:undefined,order:{kind:'idle' as const}};
      const goal=enemy.order?.kind==='attack-move'?enemy.order.destination:arenaConfig.base;
      const step=map?combatApproach(enemyMap!,enemy.position,baseFootprint(goal),'explore-goal',stats.speed,stats.range,delta,enemy.navigation?.targetId==='explore-goal'?enemy.navigation:undefined,gateFor?.(`enemy:${enemy.id}`)):approach(enemy.position,goal,stats.speed,stats.range,delta);
      return {...cooling,position:step.position,...(step.navigation?{navigation:step.navigation}:{})};
    }
    const moved=units.find(u=>u.id===target.id)??naval.navy?.ships.find(s=>s.id===target.id);
    const footprint=map&&moved?unitFootprint(moved.position,target.footprint.width):target.footprint;
    if(!enemy.boss&&!playerVisible({...target,footprint},enemy))return {...enemy,navigation:undefined};
    const center={x:footprint.x+footprint.width/2,y:footprint.y+footprint.height/2};
    const step=enemy.boss?{position:{...enemy.position},attackSeconds:delta,navigation:undefined}:map?combatApproach({...enemyMap!,attackAcrossWater:!!ranged&&target.domain==='sea',ignoreAttackOcclusion:target.domain==='air'},enemy.position,footprint,target.id,stats.speed,stats.range,delta,enemy.navigation,gateFor?.(`enemy:${enemy.id}`))
      :approach(enemy.position,center,stats.speed,stats.range,delta);
    const multiplier=enemy.boss?1:upgradeMultiplier(opponent.upgrades.attack.multiplier,combat.enemyUpgrades?.attack);
    const soldier=enemySoldier(enemy,enemyFaction);
    if(ranged){
      let cooldown=Math.max(0,(enemy.attackCooldown??0)-(delta-step.attackSeconds)),time=step.attackSeconds;
      const canFire=!!enemy.boss||!map||isAir(enemy)||target.domain==='air'||segmentFits({...marineFlightMap(map),obstacles:marineFlightMap(map).obstacles.filter(o=>!(o.x===footprint.x&&o.y===footprint.y&&o.width===footprint.width&&o.height===footprint.height))},step.position,center,0);
      while(canFire&&time>0&&time+1e-9>=cooldown){
        time=Math.max(0,time-cooldown);
        shots.push({projectile:{bossProfile:bossDamageProfile(enemy.role,true),owner:'enemy',id:`enemy-arrow-${nextProjectileNumber++}`,shooterId:enemy.id,targetId:target.id,
          position:{...step.position},destination:{...center},speed:ranged.projectileSpeed,remainingLife:ranged.projectileLifetime,
          targets:attackTargets(enemy,enemyFaction),...(enemy.boss||isAir(enemy)||target.domain==='air'?{airborne:true as const}:{}),...(stats.damageByDomain?{damageByDomain:stats.damageByDomain}:{}),...(enemy.role==='catapult'?{defenseMultiplier:defenseBalanceConfig.siegeDefenseMultiplier}:{}),damage:ranged.damage*(!['soldier','worker','ship'].includes(target.kind)?stats.buildingDamageMultiplier??1:1)*multiplier*abilityEffects(enemyGathering,soldier,delta-time).attackMultiplier*spellModifiers(soldier,delta-time).attack,
          hitRadius:'hitRadius' in ranged?ranged.hitRadius:0,targetFootprint:{...footprint},
          ...('splashRadius' in ranged?{splashRadius:ranged.splashRadius}:{})},time});
        cooldown=ranged.attackInterval;
      }
      return {...enemy,position:step.position,attackCooldown:Math.max(0,cooldown-time),...(step.navigation?{navigation:step.navigation}:{})};
    }
    playerDamage.set(target.id,(playerDamage.get(target.id)??0)+(target.boss?bossIncoming(target.boss,bossDamageProfile(enemy.role)):1)*step.attackSeconds*stats.damagePerSecond*(!['soldier','worker','ship'].includes(target.kind)?opponent.units[enemy.role??'soldier'].buildingDamageMultiplier??1:1)*(enemy.role==='soldier'&&gathering.units.some(u=>u.id===target.id&&u.kind==='soldier'&&u.archetype==='cavalry')?cavalryRules.infantryDamageMultiplier:1)*multiplier*abilityEffects(enemyGathering,soldier).attackMultiplier*spellModifiers(soldier).attack);
    return {...cooling,position:step.position,...(step.navigation?{navigation:step.navigation}:{})};
  });
  const visibleProjectile=(enemy:Enemy,p:Projectile)=>projectileVisible?projectileVisible(enemy,p):!visible||units.some(u=>u.id===p.shooterId&&u.kind==='soldier'&&visible(enemy,u));
  const targetBody=(t:PlayerTarget,includeEnemies=false)=>{const moved=units.find(u=>u.id===t.id)??naval.navy?.ships.find(u=>u.id===t.id)??(includeEnemies?movingEnemies.find(e=>e.id===t.id):undefined);const f=moved?unitFootprint(moved.position,t.footprint.width):t.footprint;return {id:t.id,hp:t.hp,...(t.boss?{boss:t.boss}:{}),...(t.domain==='air'?{role:'air' as const}:{}),...(t.kind==='ship'?{kind:'ship' as const}:{}),...(t.kind==='tower'||t.kind==='wall'||t.kind==='gate'?{fortification:true as const}:{}),position:{x:f.x+f.width/2,y:f.y+f.height/2},...(t.kind==='soldier'||t.kind==='worker'||t.kind==='ship'?{}:{footprint:f})};};
  const ownBodies=originalTargets.map(t=>targetBody(t)),bossBodies=bossTargets.map(t=>targetBody(t,true));
  const enemyProjectileVisible=(body:Enemy,p:Projectile)=>{if(p.shooterId?.startsWith('enemy-boss-'))return Math.hypot(body.position.x-p.destination.x,body.position.y-p.destination.y)<=100;const target=originalTargets.find(t=>t.id===body.id),shooter=movingEnemies.find(e=>e.id===p.shooterId)??combat.enemies.find(e=>e.id===p.shooterId)??{id:p.shooterId??'historical-shooter',position:p.position,hp:1};return !!target&&playerVisible({...target,footprint:body.footprint??unitFootprint(body.position,target.footprint.width)},shooter);};
  const projectiles:Projectile[]=[];
  const advanceShot=(list:Projectile[],time:number,owner?:'enemy')=>{
    const advanced=advanceProjectiles(list,owner&&list[0]?.shooterId?.startsWith('enemy-boss-')?bossBodies:owner?ownBodies:movingEnemies.filter(e=>!scope?.canTarget||scope.canTarget(e)),time,map,owner?enemyProjectileVisible:visibleProjectile);
    projectiles.push(...advanced.projectiles);const amounts=owner?playerDamage:damage;
    for(const [id,amount] of advanced.damage)amounts.set(id,(amounts.get(id)??0)+amount);
  };
  advanceShot((combat.projectiles??[]).filter(p=>!p.owner),delta);
  for(const p of (combat.projectiles??[]).filter(p=>p.owner==='enemy'))advanceShot([p],delta,'enemy');
  for(const shot of shots)advanceShot([shot.projectile],shot.time,shot.projectile.owner);
  scope?.onDamage?.(scope.side==='player'?damage:playerDamage);
  if(scope?.side==='enemy')playerDamage.clear();
  units=units.map(unit=>unit.hp!==undefined?{...unit,hp:Math.max(0,unit.hp-(playerDamage.get(unit.id)??0)*(unit.kind==='soldier'?defenseMultiplier*cavalryArmorMultiplier(unit.archetype,combat.upgrades?.cavalryArmor)*abilityEffects(gathering,unit).defenseMultiplier*spellModifiers(unit).defense:1))}:unit);
  const surviving=removeDeadUnits({...gathering,units});units=surviving.units;
  const nextPlacement=placement?{...placement,...(placement.aviary?{aviary:{...placement.aviary,hp:Math.max(0,placement.aviary.hp-(playerDamage.get('aviary')??0))}}:{}),...(placement.stable?{stable:{...placement.stable,hp:Math.max(0,placement.stable.hp-(playerDamage.get('stable')??0))}}:{}),...(placement.academy?{academy:{...placement.academy,hp:Math.max(0,placement.academy.hp-(playerDamage.get('academy')??0))}}:{}),...(placement.bases?{bases:placement.bases.map(b=>({...b,hp:Math.max(0,b.hp-(playerDamage.get(b.id)??0))}))}:{}),...(placement.defenses?{defenses:placement.defenses.map(t=>({...t,hp:Math.max(0,t.hp-(playerDamage.get(t.id)??0))}))}:{}),
    ...(placement.forge?{forge:{...placement.forge,hp:Math.max(0,placement.forge.hp-(playerDamage.get('forge')??0))}}:{}),
    ...(placement.barracks?{barracksHP:Math.max(0,(placement.barracksHP??combatConfig.barracksHP)-(playerDamage.get('barracks')??0))}:{}),
    ...(placement.farms?{farms:placement.farms.map(f=>({...f,hp:Math.max(0,(f.hp??combatConfig.farmHP)-(playerDamage.get(f.id)??0))}))}:{})}:undefined;
  const nextNavy=naval.navy?{...naval.navy,ships:naval.navy.ships.map(s=>({...s,hp:Math.max(0,s.hp-(playerDamage.get(s.id)??0)*defenseMultiplier)})),harbor:naval.navy.harbor?{...naval.navy.harbor,hp:Math.max(0,naval.navy.harbor.hp-(playerDamage.get('harbor')??0))}:null}:undefined;
  const nextCombat={...combat,baseHP:Math.max(0,combat.baseHP-(playerDamage.get('base')??0))};
  const aliveTargets=new Set([...(scope?.targets??playerTargets(surviving,nextCombat,nextPlacement,nextNavy)).filter(t=>t.hp>0).map(t=>t.id),...movingEnemies.filter(e=>(e.boss||e.seaMonster)&&e.hp-(damage.get(e.id)??0)-(playerDamage.get(e.id)??0)>0).map(e=>e.id)]);
  const enemies = movingEnemies.map(enemy => ({ ...enemy, hp: Math.max(0, enemy.hp - ((damage.get(enemy.id) ?? 0)+(enemy.boss||enemy.seaMonster||bossTargetIds.has(enemy.id)?playerDamage.get(enemy.id)??0:0))*(!enemy.footprint&&enemy.kind!=='worker'?(enemy.boss||enemy.seaMonster?1:upgradeMultiplier(opponent.upgrades.defense.multiplier,combat.enemyUpgrades?.defense))*cavalryArmorMultiplier(enemy.role,combat.enemyUpgrades?.cavalryArmor)*abilityEffects(enemyGathering,enemySoldier(enemy,enemyFaction)).defenseMultiplier*spellModifiers(enemy).defense:1)) }))
    .filter(e => e.hp > 0 || e.kind==='worker').map(enemy => enemy.navigation?.targetId && enemy.navigation.targetId!=='explore-goal' && !aliveTargets.has(enemy.navigation.targetId) ? {...enemy,navigation:undefined} : enemy);
  const destroyedEnemyFootprints=movingEnemies.filter(e=>e.footprint&&e.hp-(damage.get(e.id)??0)-(bossTargetIds.has(e.id)?playerDamage.get(e.id)??0:0)<=0).map(e=>e.footprint!);
  units = units.map(unit => unit.order.kind === 'attack'
    && !enemies.some(e => e.id === (unit.order.kind === 'attack' ? unit.order.enemyId : ''))
    ? { ...unit, navigation: undefined, order: { kind: 'idle' as const } } : unit);
  const finishedNavy=nextNavy?{...nextNavy,ships:nextNavy.ships.map(ship=>ship.order.kind==='attack'&&!enemies.some(e=>e.hp>0&&ship.order.kind==='attack'&&e.id===ship.order.enemyId)?{...ship,navigation:undefined,order:{kind:'idle' as const}}:ship)}:undefined;
  return {...(finishedNavy?{navy:finishedNavy}:{}), gathering: { ...surviving, units }, combat: {...nextCombat,enemies,...(destroyedEnemyFootprints.length?{destroyedEnemyFootprints}:{}),...(combat.projectiles||shots.length?{projectiles:projectiles.filter(p=>p.splashRadius||(p.owner==='enemy'?aliveTargets.has(p.targetId):enemies.some(e=>e.hp>0&&e.id===p.targetId))),nextProjectileNumber}:{})},...(nextPlacement?{placement:nextPlacement}:{}) };
}
