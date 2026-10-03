import {navyConfig} from '../config/navy';
import {navigationConfig} from '../config/navigation';
import {footprintDistance} from './approach';
import {bodyFits,tileCenter,type WorldMap} from './map';
import {domainMap,marineFlightMap} from './terrainNavigation';
import {findRoute,advanceRoute,segmentFits,type RouteState} from './navigation';
import {unitBody} from './spawning';
import {combatConfig} from '../config/combat';
import type {Enemy} from './combat';
import type {NavyState,Ship} from './navy';
import type {Projectile} from './projectiles';
import type {Footprint} from './placement';
import type {Position} from './movement';
const cfg=navyConfig.ship;
function canShoot(map:WorldMap|undefined,point:Position,enemy:Enemy){
 const foot=enemy.footprint??unitBody(enemy.position,combatConfig.enemySize);
 if(footprintDistance(point,foot)>cfg.range+1e-9)return false;
 if(!map)return true;const flight=marineFlightMap(map);return segmentFits({...flight,obstacles:flight.obstacles.filter(o=>!enemy.footprint||o.x!==foot.x||o.y!==foot.y||o.width!==foot.width||o.height!==foot.height)},point,enemy.position,0);
}
function firingRoute(map:WorldMap,ship:Ship,enemy:Enemy):RouteState {
 const water={...domainMap(map,'water'),bodyHalf:cfg.size/2},foot:Footprint=enemy.footprint??unitBody(enemy.position,combatConfig.enemySize),candidates:{point:Position;bound:number;index:number}[]=[];
 for(let row=Math.max(0,Math.floor((foot.y-cfg.range)/map.tileSize));row<=Math.floor((foot.y+foot.height+cfg.range)/map.tileSize);row++)for(let column=Math.max(0,Math.floor((foot.x-cfg.range)/map.tileSize));column<=Math.floor((foot.x+foot.width+cfg.range)/map.tileSize);column++){
  const point=tileCenter(map,{column,row});if(point&&bodyFits(water,point,cfg.size/2)&&canShoot(map,point,enemy))candidates.push({point,bound:Math.hypot(point.x-ship.position.x,point.y-ship.position.y),index:candidates.length});
 }
 candidates.sort((a,b)=>a.bound-b.bound||a.index-b.index);let best:{point:Position;waypoints:Position[];length:number}|undefined;
 for(const c of candidates){if(best&&c.bound>best.length+1e-9)break;const route=findRoute(water,ship.position,c.point);if(!route.ok)continue;let previous=ship.position,length=0;for(const point of route.waypoints){length+=Math.hypot(point.x-previous.x,point.y-previous.y);previous=point;}if(!best||length<best.length-1e-9)best={point:c.point,waypoints:route.waypoints,length};}
 return {commandNumber:(ship.navigation?.commandNumber??0)+1,destination:best?.point??ship.position,waypoints:best?.waypoints??[],revision:map.revision,status:best?(best.waypoints.length?'moving':'arrived'):'blocked',...(!best?{error:'unreachable' as const}:{}),targetId:enemy.id,goalKey:`naval:${enemy.id}:${enemy.position.x}:${enemy.position.y}`,retryAfter:navigationConfig.pursuitReplanSeconds};
}
function attackStep(ship:Ship,enemy:Enemy,delta:number,map?:WorldMap){
 if(canShoot(map,ship.position,enemy))return {position:ship.position,navigation:{commandNumber:ship.navigation?.commandNumber??1,destination:{...ship.position},waypoints:[],revision:map?.revision??0,status:'arrived' as const,targetId:enemy.id,goalKey:`naval:${enemy.id}:${enemy.position.x}:${enemy.position.y}`},attackSeconds:delta};
 if(!map)return {position:ship.position,navigation:ship.navigation,attackSeconds:0};
 const cached=ship.navigation,retryAfter=Math.max(0,(cached?.retryAfter??0)-delta);
 const route=cached&&cached.targetId===enemy.id&&cached.revision===map.revision&&retryAfter>0?{...cached,retryAfter}:firingRoute(map,ship,enemy);
 const step=advanceRoute({...domainMap(map,'water'),bodyHalf:cfg.size/2},ship.position,route,cfg.speed,delta);
 return {position:step.position,navigation:{...step.route,targetId:enemy.id,retryAfter:route.retryAfter},attackSeconds:step.route.status==='arrived'&&canShoot(map,step.position,enemy)?step.remaining:0};
}
/** Prepare movement/shots from the same live snapshot as land combat; damage applies afterwards. */
export function prepareNavalCombat(navy:NavyState|undefined,enemies:readonly Enemy[],delta:number,map:WorldMap|undefined,nextProjectileNumber:number,attackMultiplier=1,visible:(e:Enemy)=>boolean=()=>true){
 const shots:{projectile:Projectile;time:number}[]=[];if(!navy||delta<=0)return {navy,shots,nextProjectileNumber};
 const ships=navy.ships.map(ship=>{
  if(ship.hp<=0||ship.order.kind!=='attack')return {...ship,attackCooldown:Math.max(0,(ship.attackCooldown??0)-delta)};
  const enemy=enemies.find(e=>ship.order.kind==='attack'&&e.id===ship.order.enemyId&&e.hp>0);
  if(!enemy||!visible(enemy))return {...ship,navigation:undefined,attackCooldown:Math.max(0,(ship.attackCooldown??0)-delta),order:{kind:'idle' as const}};
  const step=attackStep(ship,enemy,delta,map);let cooldown=Math.max(0,(ship.attackCooldown??0)-(delta-step.attackSeconds)),time=step.attackSeconds;
  while(time>0&&time+1e-9>=cooldown){time=Math.max(0,time-cooldown);shots.push({projectile:{marine:true,id:`arrow-${nextProjectileNumber++}`,shooterId:ship.id,targetId:enemy.id,position:{...step.position},destination:{...enemy.position},speed:cfg.projectileSpeed,remainingLife:cfg.projectileLifetime,damage:cfg.damage*attackMultiplier,hitRadius:cfg.hitRadius,...(enemy.footprint?{targetFootprint:{...enemy.footprint}}:{})},time});cooldown=cfg.attackInterval;}
  return {...ship,position:step.position,navigation:step.navigation,attackCooldown:Math.max(0,cooldown-time)};
 });return {navy:{...navy,ships},shots,nextProjectileNumber};
}
