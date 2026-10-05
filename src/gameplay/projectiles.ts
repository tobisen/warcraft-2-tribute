import {targetDomain,airMap} from './domains';
import type {TargetDomain} from '../config/domains';
import {marineFlightMap} from './terrainNavigation';
import { footprintDistance } from './approach';
import { moveTowards, type Position } from './movement';
import type { Enemy } from './combat';
import type { Footprint } from './placement';
import type { WorldMap } from './map';
import { segmentFits } from './navigation';
export interface Projectile {
 targets?:readonly TargetDomain[];damageByDomain?:Partial<Record<TargetDomain,number>>;airborne?:true;owner?:'enemy';marine?:true;id:string; shooterId?:string; targetId:string; position:Position; destination:Position;
 defenseMultiplier?:number;shooterFootprint?:Footprint;splashRadius?:number;targetFootprint?:Footprint;
 speed:number; remainingLife:number; damage:number; hitRadius:number;
}
/** Fixed aim point: no homing. Impact consumes the projectile even on a miss. */
export function advanceProjectiles(projectiles:readonly Projectile[], enemies:readonly (Enemy&{fortification?:true})[], delta:number,
 map?:WorldMap, visible:(enemy:Enemy,projectile:Projectile)=>boolean=()=>true) {
 const alive:Projectile[]=[], damage=new Map<string,number>();
 for(const p of projectiles){
  const target=enemies.find(e=>e.id===p.targetId);
  const enemy=target&&(p.targets??['land','sea','building']).includes(targetDomain(target))&&visible(target,p)&&target.hp>0?target:undefined;
  if(!enemy&&!p.splashRadius)continue;
  const travel=Math.hypot(p.destination.x-p.position.x,p.destination.y-p.position.y)/p.speed;
  const time=Math.min(Math.max(0,delta),p.remainingLife);
  const position=moveTowards(p.position,p.destination,p.speed,time);
  const footprint=p.targetFootprint??enemy?.footprint;
  const shotMap=map&&p.airborne?airMap(map):map&&p.marine?marineFlightMap(map):map;
  const flightMap=shotMap&&(footprint||p.shooterFootprint)?{...shotMap,obstacles:shotMap.obstacles.filter(o=>![footprint,p.shooterFootprint].some(f=>f&&o.x===f.x&&o.y===f.y&&o.width===f.width&&o.height===f.height))}:shotMap;
  if(flightMap&&!segmentFits(flightMap,p.position,position,0))continue;
  if(travel<=time+1e-9){
   if(p.splashRadius){
    for(const victim of enemies){
      if(!visible(victim,p)||victim.hp<=0||!(p.targets??['land','sea','building']).includes(targetDomain(victim)))continue;
      const distance=victim.footprint?footprintDistance(p.destination,victim.footprint):Math.hypot(victim.position.x-p.destination.x,victim.position.y-p.destination.y);
      if(distance<=p.splashRadius)damage.set(victim.id,(damage.get(victim.id)??0)+p.damage*(p.damageByDomain?.[targetDomain(victim)]??1)*(victim.fortification?p.defenseMultiplier??1:1));
    }
   }else if(enemy&&Math.hypot(enemy.position.x-p.destination.x,enemy.position.y-p.destination.y)<=p.hitRadius)
    damage.set(enemy.id,(damage.get(enemy.id)??0)+p.damage*(p.damageByDomain?.[targetDomain(enemy)]??1)*(enemy.fortification?p.defenseMultiplier??1:1));
  }else if(p.remainingLife>time)alive.push({...p,position,remainingLife:p.remainingLife-time});
 }
 return {projectiles:alive,damage};
}
