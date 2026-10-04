import {enemyNavigationMap} from './map';
import {maps} from '../config/maps';
import {enemyKnowledgeConfig as config} from '../config/enemyKnowledge';
import {isVisible} from './fog';
import {commandMappedMove} from './navigation';
import {enemyWorker} from './enemyGathering';
import {resourceNodes,type ResourceNode,type Worker} from './gathering';
import type {Position} from './movement';
import type {MatchState} from './match';
export interface EnemyKnowledgeState {nodes:ResourceNode[];playerBase:Position|null;resourceScoutIndex:number;attackScoutIndex:number}
export const createEnemyKnowledge=():EnemyKnowledgeState=>({nodes:[],playerBase:null,resourceScoutIndex:0,attackScoutIndex:0});
export function knownEnemyNode(m:MatchState,node:ResourceNode|undefined):ResourceNode|undefined {return node?(m.enemyKnowledge?m.enemyKnowledge.nodes.find(n=>n.id===node.id):node):undefined;}
export function observeEnemyKnowledge(m:MatchState):MatchState {
 if(!m.enemyKnowledge||!m.fog)return m;
 const byId=new Map(m.enemyKnowledge.nodes.map(n=>[n.id,n]));for(const node of resourceNodes(m.gathering))if(node&&isVisible(m.fog,'enemy',node.position))byId.set(node.id,{...node,position:{...node.position}});
 const playerBase=m.combat.baseHP>0&&isVisible(m.fog,'enemy',m.gathering.base)?{...m.gathering.base}:m.enemyKnowledge.playerBase;
 return {...m,enemyKnowledge:{...m.enemyKnowledge,nodes:[...byId.values()],playerBase}};
}
export function enemyAttackDestination(m:MatchState):Position {return m.enemyKnowledge?.playerBase??(maps[m.map.id??'arena'].enemyAttackWaypoints??config.attackWaypoints)[m.enemyKnowledge?.attackScoutIndex??0];}
/** At most one empty non-builder worker searches; loaded work is never discarded. */
export function prepareEnemyScout(m:MatchState):MatchState {
 if(!m.enemyKnowledge||resourceNodes(m.gathering).filter(Boolean).every(node=>knownEnemyNode(m,node)))return m;
 const workers=m.combat.enemies.filter(e=>e.kind==='worker'&&e.hp>0&&e.work!.cargo===0&&['idle','move','gather'].includes(e.work!.order.kind)).sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}));const scout=workers.find(e=>e.work!.order.kind==='move')??workers[0];if(!scout)return m;
 const waypoints=maps[m.map.id??'arena'].enemyResourceWaypoints??config.resourceWaypoints;let index=m.enemyKnowledge.resourceScoutIndex;const goal=waypoints[index];if(Math.hypot(scout.position.x-goal.x,scout.position.y-goal.y)<=config.arrivalRange||scout.navigation?.status==='blocked')index=Math.min(index+1,waypoints.length-1);
 const target=waypoints[index];if(scout.work!.order.kind==='move'&&scout.work!.target.x===target.x&&scout.work!.target.y===target.y)return {...m,enemyKnowledge:{...m.enemyKnowledge,resourceScoutIndex:index}};
 const worker=commandMappedMove([{...enemyWorker(scout)!,selected:true}],target,enemyNavigationMap(m.map))[0] as Worker;
 return {...m,enemyKnowledge:{...m.enemyKnowledge,resourceScoutIndex:index},combat:{...m.combat,enemies:m.combat.enemies.map(e=>e.id===scout.id?{...e,navigation:worker.navigation,work:{...e.work!,target:worker.target,order:worker.order}}:e)}};
}
export function updateEnemyExploration(m:MatchState):MatchState {
 if(!m.enemyKnowledge)return m;
 const waypoints=maps[m.map.id??'arena'].enemyAttackWaypoints??config.attackWaypoints;const goal=enemyAttackDestination(m);const reached=m.combat.enemies.some(e=>e.order?.kind==='attack-move'&&Math.hypot(e.position.x-goal.x,e.position.y-goal.y)<=config.attackArrivalRange);
 const attackScoutIndex=m.enemyKnowledge.playerBase?m.enemyKnowledge.attackScoutIndex:reached?Math.min(m.enemyKnowledge.attackScoutIndex+1,waypoints.length-1):m.enemyKnowledge.attackScoutIndex;
 const destination=m.enemyKnowledge.playerBase??waypoints[attackScoutIndex];
 const oldDestination=[{x:704,y:400},{x:448,y:528},{x:208,y:320}][m.enemyKnowledge.attackScoutIndex];
 const needsRetarget=(e:typeof m.combat.enemies[number])=>e.order?.kind==='attack-move'&&(!e.navalLanding||!!m.enemyKnowledge!.playerBase)&&(e.order.destination.x!==destination.x||e.order.destination.y!==destination.y)&&(!!m.enemyKnowledge!.playerBase||attackScoutIndex!==m.enemyKnowledge!.attackScoutIndex||e.order.destination.x===oldDestination.x&&e.order.destination.y===oldDestination.y);
 if(attackScoutIndex===m.enemyKnowledge.attackScoutIndex&&!m.combat.enemies.some(needsRetarget))return m;
 return {...m,enemyKnowledge:{...m.enemyKnowledge,attackScoutIndex},combat:{...m.combat,enemies:m.combat.enemies.map(e=>needsRetarget(e)?{...e,navigation:undefined,order:{kind:'attack-move',destination:{...destination}}}:e)}};
}
