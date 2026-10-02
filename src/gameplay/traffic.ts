import {unitStats} from '../config/unit';
import {trafficConfig as config} from '../config/traffic';
import {bodyFits,tileCenter,type WorldMap} from './map';
import type {Position} from './movement';
import type {RouteState} from './navigation';
export type MovementGate=(position:Position,route:RouteState,speed:number,delta:number)=>number;
export type GateFor=(id:string)=>MovementGate;
export interface TrafficBody {id:string;position:Position;half:number;speed:number;active:boolean;waypoints:readonly Position[]}
const cache=new WeakMap<WorldMap,{signature:string;zones:Map<string,number>}>();
function passageZones(map:WorldMap):Map<string,number>{
 const signature=`${map.revision}:${map.width}:${map.height}:${map.tileSize}:`+map.obstacles.map(o=>`${o.x},${o.y},${o.width},${o.height}`).join(';'),old=cache.get(map);if(old?.signature===signature)return old.zones;
 const free=new Set<string>(),narrow=new Set<string>(),key=(x:number,y:number)=>`${x},${y}`;
 for(let y=0;y<Math.ceil(map.height/map.tileSize);y++)for(let x=0;x<Math.ceil(map.width/map.tileSize);x++){const p=tileCenter(map,{column:x,row:y});if(p&&bodyFits(map,p,unitStats.size/2))free.add(key(x,y));}
 for(const k of free){const [x,y]=k.split(',').map(Number);if([[0,-1],[1,0],[0,1],[-1,0]].filter(([dx,dy])=>free.has(key(x+dx,y+dy))).length<=2)narrow.add(k);}
 const zones=new Map<string,number>();let number=0;
 for(const first of narrow){if(zones.has(first))continue;const queue=[first];zones.set(first,number);for(let i=0;i<queue.length;i++){const [x,y]=queue[i].split(',').map(Number);for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]){const n=key(x+dx,y+dy);if(narrow.has(n)&&!zones.has(n)){zones.set(n,number);queue.push(n);}}}number++;}
 cache.set(map,{signature,zones});return zones;
}
/** Admission is per simulation step, derived from live bodies. Idle bodies never retain a lock. */
export function trafficGates(map:WorldMap,bodies:readonly TrafficBody[],elapsed:number,delta:number):GateFor{
 const zones=passageZones(map);
 if(!zones.size)return ()=> (_p,_r,_s,d)=>d;
 const hits=(p:Position,half:number)=>{const found=new Set<number>();for(let y=Math.floor((p.y-half+1e-6)/map.tileSize);y<=Math.floor((p.y+half-1e-6)/map.tileSize);y++)for(let x=Math.floor((p.x-half+1e-6)/map.tileSize);x<=Math.floor((p.x+half-1e-6)/map.tileSize);x++){const zone=zones.get(`${x},${y}`);if(zone!==undefined)found.add(zone);}return found;};
 const trace=(position:Position,points:readonly Position[],half:number,distanceLimit:number)=>{const entries=new Map<number,number>();let previous=position,walked=0;
  for(const end of points){const length=Math.hypot(end.x-previous.x,end.y-previous.y);if(length===0){previous=end;continue;}const distance=Math.min(length,Math.max(0,distanceLimit-walked));let sampled=0;
   while(sampled<distance){const next=Math.min(distance,sampled+config.traceSpacing),p={x:previous.x+(end.x-previous.x)*next/length,y:previous.y+(end.y-previous.y)*next/length};for(const zone of hits(p,half))if(!entries.has(zone))entries.set(zone,walked+sampled);sampled=next;}
   walked+=distance;if(walked>=distanceLimit)break;previous=end;
  }return entries;};
 const sorted=[...bodies].sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true})),owners=new Map<number,string>(),candidates=new Map<number,string[]>();
 for(const b of sorted){if(!b.active)continue;for(const zone of hits(b.position,b.half))if(!owners.has(zone))owners.set(zone,b.id);for(const zone of trace(b.position,b.waypoints,b.half,b.speed*delta+config.traceSpacing).keys()){const list=candidates.get(zone)??[];list.push(b.id);candidates.set(zone,list);}}
 const winners=new Map<number,string>();for(const [zone,ids] of candidates)winners.set(zone,ids[Math.floor((elapsed+1e-9)/config.passageWindowSeconds)%ids.length]);
 const byId=new Map(sorted.map(b=>[b.id,b]));
 return id=>(position,route,speed,time)=>{if(route.status!=='moving'||speed<=0||time<=0)return time;const b=byId.get(id);if(!b)return time;let allowed=time;
  for(const [zone,distance] of trace(position,route.waypoints,b.half,speed*time)){const owner=owners.get(zone),winner=winners.get(zone)??id;if(owner!==undefined&&owner!==id||owner===undefined&&winner!==id){allowed=Math.min(allowed,distance/speed);break;}owners.set(zone,id);}
  return allowed;
 };
}
