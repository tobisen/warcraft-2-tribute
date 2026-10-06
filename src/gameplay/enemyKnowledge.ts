import {canInteract} from './approach';
import {baseFootprint} from './buildingSelection';
import {enemyUnitStats} from './enemyUnits';
import {expansionSites} from '../config/mapExtensions';
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
export function searchWaypoints(m:MatchState,kind:'resource'|'attack'){if(kind==='attack'&&m.aiContext)return m.aiContext.attackWaypoints;const map=maps[m.map.id??'arena'];const base=(m.map.terrainLayout==='reference'?(kind==='resource'?map.referenceResourceWaypoints:map.referenceAttackWaypoints):undefined)??(kind==='resource'?map.enemyResourceWaypoints??config.resourceWaypoints:map.enemyAttackWaypoints??config.attackWaypoints);return kind==='resource'&&m.map.worldLayout==='expanded'?[...base,...expansionSites(m.map.id??'arena').map(s=>({x:(s.column+10.5)*32,y:(s.row+5.5)*32}))]:base;}
export const createEnemyKnowledge=():EnemyKnowledgeState=>({nodes:[],playerBase:null,resourceScoutIndex:0,attackScoutIndex:0});
export function knownEnemyNode(m:MatchState,node:ResourceNode|undefined):ResourceNode|undefined {return node?(m.enemyKnowledge?m.enemyKnowledge.nodes.find(n=>n.id===node.id):node):undefined;}
export function observeEnemyKnowledge(m:MatchState):MatchState {
 if(!m.enemyKnowledge||!m.fog)return m;
 const byId=new Map(m.enemyKnowledge.nodes.map(n=>[n.id,n]));for(const node of resourceNodes(m.gathering))if(node&&isVisible(m.fog,'enemy',node.position))byId.set(node.id,{...node,position:{...node.position}});
 const visibleExpansion=m.placement.bases?.find(b=>b.hp>0&&b.construction.remainingSeconds===0&&isVisible(m.fog!,'enemy',{x:b.footprint.x+b.footprint.width/2,y:b.footprint.y+b.footprint.height/2}));
 const remembered=m.enemyKnowledge.playerBase,retired=!m.aiContext&&remembered&&isVisible(m.fog,'enemy',remembered)&&!(m.combat.baseHP>0&&remembered.x===m.gathering.base.x&&remembered.y===m.gathering.base.y)&&!(m.placement.bases??[]).some(b=>b.hp>0&&remembered.x===b.footprint.x+b.footprint.width/2&&remembered.y===b.footprint.y+b.footprint.height/2);
 const playerBase=m.aiContext?.humanHostile!==false&&m.combat.baseHP>0&&isVisible(m.fog,'enemy',m.gathering.base)?{...m.gathering.base}:m.aiContext?.humanHostile!==false&&visibleExpansion?{x:visibleExpansion.footprint.x+visibleExpansion.footprint.width/2,y:visibleExpansion.footprint.y+visibleExpansion.footprint.height/2}:retired?null:m.enemyKnowledge.playerBase;
 return {...m,enemyKnowledge:{...m.enemyKnowledge,nodes:[...byId.values()],playerBase}};
}
export function enemyAttackDestination(m:MatchState):Position {return m.enemyKnowledge?.playerBase??searchWaypoints(m,'attack')[m.enemyKnowledge?.attackScoutIndex??0];}
/** At most one empty non-builder worker searches; loaded work is never discarded. */
export function prepareEnemyScout(m:MatchState):MatchState {
 if(!m.enemyKnowledge||resourceNodes(m.gathering).filter(Boolean).every(node=>knownEnemyNode(m,node)))return m;
 const supplied=['wood','gold'].every(type=>m.enemyKnowledge!.nodes.some(n=>(n.resource??'wood')===type&&n.remaining>0));
 if(supplied)return {...m,combat:{...m.combat,enemies:m.combat.enemies.map(e=>e.kind==='worker'&&e.work?.order.kind==='move'?{...e,navigation:undefined,work:{...e.work,order:{kind:'idle' as const}}}:e)}};
 const workers=m.combat.enemies.filter(e=>e.kind==='worker'&&e.hp>0&&e.work!.cargo===0&&['idle','move','gather'].includes(e.work!.order.kind)).sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}));const scout=workers.find(e=>e.work!.order.kind==='move')??workers[0];if(!scout)return m;
 const waypoints=searchWaypoints(m,'resource');let index=m.enemyKnowledge.resourceScoutIndex;const goal=waypoints[index];if(Math.hypot(scout.position.x-goal.x,scout.position.y-goal.y)<=config.arrivalRange||scout.navigation?.status==='blocked')index=Math.min(index+1,waypoints.length-1);
 const target=waypoints[index];if(scout.work!.order.kind==='move'&&scout.work!.target.x===target.x&&scout.work!.target.y===target.y)return {...m,enemyKnowledge:{...m.enemyKnowledge,resourceScoutIndex:index}};
 const worker=commandMappedMove([{...enemyWorker(scout)!,selected:true}],target,enemyNavigationMap(m.map))[0] as Worker;
 return {...m,enemyKnowledge:{...m.enemyKnowledge,resourceScoutIndex:index},combat:{...m.combat,enemies:m.combat.enemies.map(e=>e.id===scout.id?{...e,navigation:worker.navigation,work:{...e.work!,target:worker.target,order:worker.order}}:e)}};
}
export function updateEnemyExploration(m:MatchState):MatchState {
 if(!m.enemyKnowledge)return m;
 const waypoints=searchWaypoints(m,'attack');const goal=enemyAttackDestination(m);const reached=m.combat.enemies.some(e=>e.order?.kind==='attack-move'&&Math.hypot(e.position.x-goal.x,e.position.y-goal.y)<=config.attackArrivalRange||e.order?.kind==='attack-move'&&e.navigation?.targetId==='explore-goal'&&e.navigation.status==='arrived'&&canInteract({...enemyNavigationMap(m.map),bodyHalf:enemyUnitStats(e,m.factions?.enemy).size/2},e.position,baseFootprint(goal),enemyUnitStats(e,m.factions?.enemy).range));
 const attackScoutIndex=m.enemyKnowledge.playerBase?m.enemyKnowledge.attackScoutIndex:reached?Math.min(m.enemyKnowledge.attackScoutIndex+1,waypoints.length-1):m.enemyKnowledge.attackScoutIndex;
 const destination=m.enemyKnowledge.playerBase??waypoints[attackScoutIndex];
 const oldDestination=[{x:704,y:400},{x:448,y:528},{x:208,y:320}][m.enemyKnowledge.attackScoutIndex];
 const needsRetarget=(e:typeof m.combat.enemies[number])=>e.order?.kind==='attack-move'&&(!e.navalLanding||!!m.enemyKnowledge!.playerBase)&&(e.order.destination.x!==destination.x||e.order.destination.y!==destination.y)&&(!!m.enemyKnowledge!.playerBase||attackScoutIndex!==m.enemyKnowledge!.attackScoutIndex||e.order.destination.x===oldDestination.x&&e.order.destination.y===oldDestination.y);
 if(attackScoutIndex===m.enemyKnowledge.attackScoutIndex&&!m.combat.enemies.some(needsRetarget))return m;
 return {...m,enemyKnowledge:{...m.enemyKnowledge,attackScoutIndex},combat:{...m.combat,enemies:m.combat.enemies.map(e=>needsRetarget(e)?{...e,navigation:undefined,order:{kind:'attack-move',destination:{...destination}}}:e)}};
}
