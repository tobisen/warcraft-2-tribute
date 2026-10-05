import {maps} from '../config/maps';
import {arenaConfig} from '../config/arena';
import {terrainPatches,bodyFits,overlaps,type WorldMap} from './map';
import type {Footprint} from './placement';
import type {Position} from './movement';
import {findRoute,planRoute,advanceRoute,type RouteState} from './navigation';
export type MovementDomain='land'|'water';
const contains=(r:Footprint,p:Position)=>p.x>=r.x&&p.x<r.x+r.width&&p.y>=r.y&&p.y<r.y+r.height;
const sameRect=(a:Footprint,b:Footprint)=>a.x===b.x&&a.y===b.y&&a.width===b.width&&a.height===b.height;
function terrain(map:WorldMap){return terrainPatches(map).map(p=>({kind:p.kind,x:p.column*arenaConfig.tileSize,y:p.row*arenaConfig.tileSize,width:p.columns*arenaConfig.tileSize,height:p.rows*arenaConfig.tileSize}));}
function dynamicObstacles(map:WorldMap){const patches=terrain(map);return map.obstacles.filter(o=>{const index=patches.findIndex(p=>sameRect(p,o));if(index<0)return true;patches.splice(index,1);return false;});}
/** Partition at terrain boundaries: adjacent water rectangles form a union, not separate islands.
 * Derived adapter only; authoritative map and its revision are never modified or persisted twice. */
export function domainMap(map:WorldMap,domain:MovementDomain):WorldMap {
 if(domain==='land')return map;
 const patches=terrain(map),xs=[...new Set([0,map.width,...patches.flatMap(p=>[p.x,p.x+p.width]).filter(x=>x>0&&x<map.width)])].sort((a,b)=>a-b),ys=[...new Set([0,map.height,...patches.flatMap(p=>[p.y,p.y+p.height]).filter(y=>y>0&&y<map.height)])].sort((a,b)=>a-b);
 const blocked:Footprint[]=[];
 for(let y=0;y<ys.length-1;y++)for(let x=0;x<xs.length-1;x++){
  const point={x:(xs[x]+xs[x+1])/2,y:(ys[y]+ys[y+1])/2};
  if(!patches.some(p=>p.kind==='water'&&contains(p,point))||patches.some(p=>p.kind==='rock'&&contains(p,point)))blocked.push({x:xs[x],y:ys[y],width:xs[x+1]-xs[x],height:ys[y+1]-ys[y]});
 }
 return {...map,obstacles:[...blocked,...dynamicObstacles(map)]};
}
export function domainBodyFits(map:WorldMap,domain:MovementDomain,point:Position,half:number){return bodyFits(domainMap(map,domain),point,half);}
export function findDomainRoute(map:WorldMap,domain:MovementDomain,start:Position,target:Position,half:number){return findRoute({...domainMap(map,domain),bodyHalf:half},start,target,half);}
export function planDomainRoute(map:WorldMap,domain:MovementDomain,start:Position,target:Position,half:number,commandNumber=1){return planRoute({...domainMap(map,domain),bodyHalf:half},start,target,commandNumber);}
export function advanceDomainRoute(map:WorldMap,domain:MovementDomain,position:Position,route:RouteState,half:number,speed:number,delta:number){return advanceRoute({...domainMap(map,domain),bodyHalf:half},position,route,speed,delta);}
/** Coast buildings straddle terrain with positive area on each side; touching an edge is insufficient. */
export function coastalFootprint(map:WorldMap,rect:Footprint):boolean {
 if(![rect.x,rect.y,rect.width,rect.height].every(Number.isFinite)||rect.width<=0||rect.height<=0||rect.x<0||rect.y<0||rect.x+rect.width>map.width||rect.y+rect.height>map.height)return false;
 const patches=terrain(map);if(patches.some(p=>p.kind==='rock'&&overlaps(rect,p))||dynamicObstacles(map).some(p=>overlaps(rect,p)))return false;
 const water=patches.filter(p=>p.kind==='water'&&overlaps(rect,p));
 // Terrain profiles contain non-overlapping water patches; clips count positive intersection area.
 const waterArea=water.reduce((n,p)=>n+Math.max(0,Math.min(rect.x+rect.width,p.x+p.width)-Math.max(rect.x,p.x))*Math.max(0,Math.min(rect.y+rect.height,p.y+p.height)-Math.max(rect.y,p.y)),0);
 return waterArea>0&&waterArea<rect.width*rect.height;
}

/** Marine shots cross water; rocks and actual structures remain physical occluders. */
export function marineFlightMap(map:WorldMap):WorldMap {const water=terrain(map).filter(p=>p.kind==='water');return {...map,obstacles:map.obstacles.filter(o=>{const i=water.findIndex(p=>sameRect(p,o));if(i<0)return true;water.splice(i,1);return false;})};}
