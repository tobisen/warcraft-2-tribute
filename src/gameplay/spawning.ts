import {navyConfig} from '../config/navy';
import { productionConfig, soldierProductionConfig } from '../config/production';
import { soldierStats, combatUnitStats, unitStats } from '../config/unit';
import { bodyFits, overlaps, tileCenter, type WorldMap } from './map';
import { findRoute } from './navigation';
import type { Position } from './movement';
import type { Footprint } from './placement';
import type { Unit } from './gathering';

export interface PositionedBody {position:Position;kind?:string;role?:string;archetype?:string}
export function otherBodySize(body:PositionedBody):number {
  return body.kind==='ship'?navyConfig.ship.size:body.role==='catapult'||body.archetype==='catapult'?combatUnitStats({archetype:'catapult'}).size:soldierStats.size;
}

export function unitBody(position:Position,size:number):Footprint {
  return {x:position.x-size/2,y:position.y-size/2,width:size,height:size};
}

export function spawnCandidates(map:WorldMap,footprint:Footprint,kind:'base'|'barracks',size=kind==='base'?unitStats.size:soldierStats.size):Position[] {
  const half=size/2;
  const offset=half+soldierProductionConfig.spawnGap;
  const center={x:footprint.x+footprint.width/2,y:footprint.y+footprint.height/2};
  const points:Position[]=kind==='base'?[{x:center.x+productionConfig.spawnOffset.x,y:center.y+productionConfig.spawnOffset.y}]:[];
  points.push({x:footprint.x+footprint.width+offset,y:center.y},{x:footprint.x-offset,y:center.y},
    {x:center.x,y:footprint.y+footprint.height+offset},{x:center.x,y:footprint.y-offset});
  for(let row=Math.floor(footprint.y/map.tileSize)-2;row<=Math.floor((footprint.y+footprint.height)/map.tileSize)+2;row++) {
    for(let column=Math.floor(footprint.x/map.tileSize)-2;column<=Math.floor((footprint.x+footprint.width)/map.tileSize)+2;column++) {
      const point=tileCenter(map,{column,row});if(point)points.push(point);
    }
  }
  const used=new Set<string>();
  return points.filter(p=>{
    const key=`${p.x}:${p.y}`;
    if(used.has(key) || overlaps(unitBody(p,half*2),footprint) || !bodyFits(map,p,half))return false;
    used.add(key);return true;
  });
}

export function hasSpawnExit(map:WorldMap,point:Position):boolean {
  return [[0,-1],[1,0],[0,1],[-1,0]].some(([dx,dy])=>findRoute(map,point,
    {x:point.x+dx*map.tileSize,y:point.y+dy*map.tileSize}).ok);
}

export function chooseSpawn(map:WorldMap,footprint:Footprint,kind:'base'|'barracks',
  units:Unit[],enemies:readonly PositionedBody[],size=kind==='base'?unitStats.size:soldierStats.size):Position|null {
  const mapWithBuilding={...map,bodyHalf:size/2,obstacles:[...map.obstacles,footprint]};
  return spawnCandidates(mapWithBuilding,footprint,kind,size).find(p=>hasSpawnExit(mapWithBuilding,p)
    && !units.some(u=>overlaps(unitBody(p,size),unitBody(u.position,u.kind==='worker'?unitStats.size:combatUnitStats(u).size)))
    && !enemies.some(e=>overlaps(unitBody(p,size),unitBody(e.position,otherBodySize(e)))))??null;
}
