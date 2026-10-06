import {enemyBase} from './enemyBases';
import {canAttackDomain,movementMap,isAir} from './domains';
import {enemyUnitStats} from './enemyUnits';
import type {FactionId} from '../config/factions';
import type { EnemyAIState,Defender } from './enemyAI';
import type { EnemyAISettings } from '../config/enemyAI';
import type { CombatState,Enemy } from './combat';
import type { Unit } from './gathering';
import type { WorldMap } from './map';
import type { Position } from './movement';
import { footprintDistance,approachRoute } from './approach';
import { bodyFits } from './map';
import { planRoute } from './navigation';
import { combatUnitStats } from '../config/unit';
import { combatConfig } from '../config/combat';
export type PlayerVisibility=(unit:Unit,observer:Enemy)=>boolean;
export function updateEnemyDefense(state:EnemyAIState,combat:CombatState,map:WorldMap,playerBase:Position,
 player:Unit[],settings:EnemyAISettings,visible:PlayerVisibility=()=>true,faction:FactionId='clans'){
 let enemies=combat.enemies,groups=state.groups;
 const base=enemyBase(combat,map),alive=new Set(enemies.filter(e=>e.hp>0).map(e=>e.id));
 let reserve=base?state.reserve.filter(id=>alive.has(id)):[],defenders=state.defenders.filter(d=>alive.has(d.id));
 const produced=enemies.filter(e=>e.hp>0&&e.id.startsWith('enemy-produced-')&&!e.navalLanding);
 if(base)for(const e of [...produced].sort((a,b)=>Math.hypot(a.position.x-base.position.x,a.position.y-base.position.y)-Math.hypot(b.position.x-base.position.x,b.position.y-base.position.y)||a.id.localeCompare(b.id,'en',{numeric:true}))){
  if(reserve.length>=settings.reserveCount)break;if(!reserve.includes(e.id))reserve.push(e.id);
 }
 const dangerDistance=(u:Unit)=>Math.min(base?.footprint?footprintDistance(u.position,base.footprint):Infinity,...(settings.helpBases??[]).map(f=>footprintDistance(u.position,f)));
 const threats=base?.footprint?player.filter(u=>u.kind==='soldier'&&u.hp>0&&visible(u,base)&&dangerDistance(u)<=settings.defenseRange)
  .sort((a,b)=>dangerDistance(a)-dangerDistance(b)||a.id.localeCompare(b.id,'en',{numeric:true})):[];
 const reachableThreats=threats.filter(u=>{const size=u.kind==='soldier'?combatUnitStats(u).size:24,foot={x:u.position.x-size/2,y:u.position.y-size/2,width:size,height:size};return produced.some(e=>canAttackDomain(e,u,faction)&&approachRoute({...movementMap(map,e),ignoreAttackOcclusion:isAir(u),bodyHalf:enemyUnitStats(e,faction).size/2},e.position,foot,enemyUnitStats(e,faction).range).status!=='blocked');});
 const threat=reachableThreats.find(u=>u.id===state.threatId)??reachableThreats[0];
 const release=(d:Defender)=>{
  const e=enemies.find(e=>e.id===d.id);if(!e||reserve.includes(d.id))return;
  const group=groups.find(g=>g.id===d.groupId&&g.members.length<settings.groupSize);
  if(group){const destination=d.destination??settings.muster;
   groups=groups.map(g=>g.id===group.id?{...g,members:[...g.members,e.id],destinations:{...g.destinations,[e.id]:destination}}:g);
   enemies=enemies.map(u=>u.id===e.id?{...u,navigation:group.status==='attack'?undefined:planRoute({...movementMap(map,u),bodyHalf:enemyUnitStats(u,faction).size/2},u.position,destination),order:{kind:group.status==='attack'?'attack-move':'muster',destination:group.status==='attack'?{...playerBase}:{...destination}}}:u);
  }else enemies=enemies.map(u=>u.id===e.id?{...u,navigation:undefined,order:{kind:'idle'}}:u);
 };
 if(threat){
  const size=threat.kind==='soldier'?combatUnitStats(threat).size:24;
  const footprint={x:threat.position.x-size/2,y:threat.position.y-size/2,width:size,height:size};
  const candidates=produced.filter(e=>canAttackDomain(e,threat,faction)&&approachRoute({...movementMap(map,e),ignoreAttackOcclusion:isAir(threat),bodyHalf:enemyUnitStats(e,faction).size/2},e.position,footprint,enemyUnitStats(e,faction).range).status!=='blocked')
   .sort((a,b)=>Number(reserve.includes(b.id))-Number(reserve.includes(a.id))||Number(defenders.some(d=>d.id===b.id))-Number(defenders.some(d=>d.id===a.id))
    ||Math.hypot(a.position.x-threat.position.x,a.position.y-threat.position.y)-Math.hypot(b.position.x-threat.position.x,b.position.y-threat.position.y)||a.id.localeCompare(b.id,'en',{numeric:true}));
  const chosen=candidates.slice(0,settings.maxDefenders);
  for(const d of defenders.filter(d=>!chosen.some(e=>e.id===d.id)))release(d);
  defenders=chosen.map(e=>defenders.find(d=>d.id===e.id)??(()=>{const g=groups.find(g=>g.members.includes(e.id));return {id:e.id,...(g?{groupId:g.id,destination:g.destinations[e.id]}:{})};})());
  enemies=enemies.map(e=>chosen.some(u=>u.id===e.id)&&!(e.order?.kind==='defend'&&e.order.targetId===threat.id)?{...e,navigation:undefined,order:{kind:'defend',targetId:threat.id}}:e);
 }else{for(const d of defenders)release(d);defenders=[];}
 const protectedIds=new Set([...reserve,...defenders.map(d=>d.id)]);
 groups=groups.map(g=>({...g,members:g.members.filter(id=>!protectedIds.has(id)),destinations:Object.fromEntries(Object.entries(g.destinations).filter(([id])=>!protectedIds.has(id)))})).filter(g=>g.members.length);
 if(base?.footprint){const home={x:base.footprint.x-32,y:base.position.y};
  for(const id of reserve.filter(id=>!defenders.some(d=>d.id===id))){enemies=enemies.map(e=>{
   if(e.id!==id)return e;if(e.order?.kind==='muster'&&e.order.destination.x===home.x&&e.order.destination.y===home.y)return e;
   return bodyFits(movementMap(map,e),home,enemyUnitStats(e,faction).size/2)?{...e,navigation:planRoute({...movementMap(map,e),bodyHalf:enemyUnitStats(e,faction).size/2},e.position,home),order:{kind:'muster',destination:home}}:{...e,navigation:undefined,order:{kind:'idle'}};
  });}
 }
 defenders=defenders.map(d=>d.groupId&&!groups.some(g=>g.id===d.groupId)?{id:d.id}:d);
 return {combat:{...combat,enemies},state:{...state,groups,reserve,defenders,threatId:threat?.id??null},protectedIds,threat:!!threat};
}
