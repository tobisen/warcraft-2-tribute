import {enemySoldier} from './enemyUnits';
import type {FactionId} from '../config/factions';
import { updateEnemyDefense,type PlayerVisibility } from './enemyDefense';
import { enemyAIConfig,type EnemyAISettings } from '../config/enemyAI';
import { commandGroupMove } from './groupMovement';
import type { CombatState,Enemy } from './combat';
import type { Unit } from './gathering';
import type { WorldMap } from './map';
import type { Position } from './movement';
export interface EnemyGroup {id:string;status:'muster'|'ready'|'attack';members:string[];destinations:Record<string,Position>;startedAt:number;dispatchedAt?:number}
export interface Defender {id:string;groupId?:string;destination?:Position}
export interface EnemyAIState {reserve:string[];defenders:Defender[];threatId:string|null;elapsedSeconds:number;nextGroupNumber:number;groups:EnemyGroup[];lastDispatchSeconds:number|null}
export const createEnemyAI=():EnemyAIState=>({reserve:[],defenders:[],threatId:null,elapsedSeconds:0,nextGroupNumber:1,groups:[],lastDispatchSeconds:null});
export function updateEnemyAI(state:EnemyAIState,combat:CombatState,map:WorldMap,playerBase:Position,delta:number,playerUnits:Unit[]=[],settings:EnemyAISettings=enemyAIConfig,visible?:PlayerVisibility,faction:FactionId='clans'){
 const elapsedSeconds=state.elapsedSeconds+Math.max(0,delta),alive=new Set(combat.enemies.filter(e=>e.hp>0&&e.kind!=='base').map(e=>e.id));
 let groups=state.groups.map(g=>({...g,members:g.members.filter(id=>alive.has(id)),destinations:Object.fromEntries(Object.entries(g.destinations).filter(([id])=>alive.has(id)))})).filter(g=>g.members.length);
 const defense=updateEnemyDefense({...state,groups},combat,map,playerBase,playerUnits,settings,visible,faction);groups=defense.state.groups;
 let enemies=defense.combat.enemies,nextGroupNumber=state.nextGroupNumber,lastDispatchSeconds=state.lastDispatchSeconds;
 const assigned=new Set([...groups.flatMap(g=>g.members),...defense.protectedIds]);
 const recruits=enemies.filter(e=>e.hp>0&&e.id.startsWith('enemy-produced-')&&!e.navalLanding&&!assigned.has(e.id)).sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}));
 for(const recruit of recruits){
  let group=groups.find(g=>g.status==='muster'&&g.members.length<settings.groupSize);
  if(!group){group={id:`enemy-group-${nextGroupNumber++}`,status:'muster',members:[],destinations:{},startedAt:elapsedSeconds};groups.push(group);}
  const members=[...group.members,recruit.id];
  const units:Unit[]=members.map(id=>{const e=enemies.find(e=>e.id===id)!;return {...enemySoldier(e,faction),selected:true};});
  const orders=commandGroupMove(units,settings.muster,map);
  const destinations=Object.fromEntries(orders.map(u=>[u.id,{...u.target}]));
  enemies=enemies.map(e=>{const u=orders.find(u=>u.id===e.id);return u?{...e,navigation:u.navigation,order:{kind:'muster' as const,destination:{...u.target}}}:e;});
  groups=groups.map(g=>g.id===group!.id?{...g,members,destinations}:g);
 }
 groups=groups.map(g=>{
  if(g.status==='muster'){
   const arrived=g.members.every(id=>{const e=enemies.find(e=>e.id===id)!,p=g.destinations[id];return Math.hypot(e.position.x-p.x,e.position.y-p.y)<1e-6;});
   if(g.members.length>=settings.groupSize&&arrived||elapsedSeconds-g.startedAt+1e-9>=settings.musterTimeout)g={...g,status:'ready'};
  }
  if(!defense.threat&&g.status==='ready'&&elapsedSeconds+1e-9>=settings.firstAttackSeconds&&(lastDispatchSeconds===null||elapsedSeconds-lastDispatchSeconds+1e-9>=settings.dispatchGapSeconds)){
   enemies=enemies.map(e=>g.members.includes(e.id)?{...e,navigation:undefined,order:{kind:'attack-move' as const,destination:{...playerBase}}}:e);
   lastDispatchSeconds=elapsedSeconds;return {...g,status:'attack',dispatchedAt:elapsedSeconds};
  }
  return g;
 });
 return {combat:{...combat,enemies},state:{...defense.state,elapsedSeconds,nextGroupNumber,groups,lastDispatchSeconds}};
}
