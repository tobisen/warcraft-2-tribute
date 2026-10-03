import {gatheringConfig} from '../config/gathering';
import {canInteract} from './approach';
import {enemyWorker} from './enemyGathering';
import type {ResourceNode} from './gathering';
import type {MatchState} from './match';
import {placementObstacles} from './placement';
import {resourceServices} from './resourceQueue';

/** Own staffing only; shared enemy admission still limits active service. No saved state. */
export function resourceStaffing(m:MatchState,node:ResourceNode):{assigned:number;gathering:number}{
 const workers=m.gathering.units.filter(u=>u.kind==='worker'&&(u.hp??1)>0&&(u.order.kind==='gather'||u.order.kind==='deliver')&&u.order.nodeId===node.id);
 if(node.remaining<=0)return {assigned:workers.length,gathering:0};
 const services=resourceServices({...m.gathering,units:[...m.gathering.units,...m.combat.enemies.flatMap(e=>{const w=enemyWorker(e);return w?[w]:[];})]},m.map,m.waves.elapsedSeconds);
 const map={...m.map,obstacles:[...m.map.obstacles,...placementObstacles(m.gathering)]};
 const radius=gatheringConfig.nodeRadius,rect={x:node.position.x-radius,y:node.position.y-radius,width:radius*2,height:radius*2};
 return {assigned:workers.length,gathering:workers.filter(u=>{
  if(u.order.kind!=='gather'||u.cargo>=gatheringConfig.capacity||u.navigation&&u.navigation.status!=='arrived')return false;
  const service=services.get(u.id);
  if(service&&(!service.working||Math.hypot(u.position.x-service.point.x,u.position.y-service.point.y)>1e-6))return false;
  return canInteract(map,u.position,rect,gatheringConfig.range);
 }).length};
}
