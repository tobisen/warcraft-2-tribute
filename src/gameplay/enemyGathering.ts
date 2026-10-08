import {defendingEnemy} from './selfDefense';
import {enemyBase,hasEnemyBase} from './enemyBases';
import {canReachFootprint} from './approach';
import {enemyNavigationMap} from './map';
import {factionForTeam} from '../config/factions';
import {isVisible} from './fog';
import {knownEnemyNode} from './enemyKnowledge';
import {enemyEconomyConfig} from '../config/enemyEconomy';
import {combatConfig} from '../config/combat';
import {defaultFactions} from '../config/factions';
import {chooseSpawn} from './spawning';
import {orderUnits,updateGathering,resourceNodes,type GatheringState,type Worker} from './gathering';
import type {Enemy,EnemyWork} from './combat';
import type {MatchState} from './match';
import type {ResourceService} from './resourceQueue';
import type {GateFor} from './traffic';
export function enemyWorker(e:Enemy):Worker|null {return e.kind==='worker'&&e.work?{id:e.id,owner:'player',kind:'worker',hp:e.hp,selected:false,position:e.position,target:e.work.target,cargo:e.work.cargo,cargoType:e.work.cargoType,selfDefense:e.selfDefense,order:e.work.order,navigation:e.navigation}:null;}
export function addEnemyWorkers(m:MatchState):void {
 const base=enemyBase(m.combat,m.map);if(!base?.footprint||!m.enemyProduction)return;
 for(let i=0;i<enemyEconomyConfig.workerCount;i++){
  const position=chooseSpawn(enemyNavigationMap(m.map),base.footprint,'barracks',m.gathering.units,m.combat.enemies);if(!position)throw Error('No enemy worker spawn');
  m.combat.enemies.push({id:`enemy-worker-${i+1}`,owner:'enemy',kind:'worker',hp:factionForTeam(m,'enemy').units.worker.hp,position,work:{target:{...position},cargo:0,order:{kind:'idle'}}});
 }
 m.enemyProduction={...m.enemyProduction,extracted:{wood:0,gold:0},spent:{wood:0,gold:0},lostCargo:{wood:0,gold:0}};
}
export function knownResourceFor(m:MatchState,type:'wood'|'gold',position?:{x:number;y:number}){
 return resourceNodes(m.gathering).filter(n=>(n.resource??'wood')===type).map(n=>knownEnemyNode(m,n)).filter((n):n is NonNullable<typeof n>=>!!n&&n.remaining>0).sort((a,b)=>position?Math.hypot(a.position.x-position.x,a.position.y-position.y)-Math.hypot(b.position.x-position.x,b.position.y-position.y):0).find(n=>(!n.tree||!position||canReachFootprint(enemyNavigationMap(m.map),position,{x:n.position.x-16,y:n.position.y-16,width:32,height:32},24)));
}
/** Assign jobs before the shared queue and passage scheduler take their snapshot. */
export function prepareEnemyGathering(m:MatchState):MatchState {
 if(!hasEnemyBase(m.combat,m.map))return m;
 return {...m,combat:{...m.combat,enemies:m.combat.enemies.map(e=>{
  if(defendingEnemy(e)||!e.work||e.hp<=0||e.work.order.kind!=='idle')return e;
  const resource=enemyEconomyConfig.resources[(Number(e.id.split('-').at(-1))-1)%enemyEconomyConfig.resources.length],node=knownResourceFor(m,resource,e.position);
  if(!node||node.remaining<=0)return e;
  const u=orderUnits([{...enemyWorker(e)!,selected:true}],node.position,node)[0] as Worker;
  return {...e,work:{...e.work,target:u.target,order:u.order as EnemyWork['order']}};
 })}};
}
/** Temporary view reuses gathering; enemy workers remain authoritative combat entities. */
export function updateEnemyGathering(m:MatchState,delta:number,gateFor?:GateFor,services?:Map<string,ResourceService>):MatchState {
 const workers=m.combat.enemies.flatMap(e=>{const worker=enemyWorker(e);return worker?[worker]:[];}),bank=m.enemyProduction;
 if(!workers.length||!bank)return m;
 const base=enemyBase(m.combat,m.map);
 if(!base?.footprint)return {...m,combat:{...m.combat,enemies:m.combat.enemies.map(e=>e.work?{...e,navigation:undefined,work:{...e.work,order:{kind:'idle'}}}:e)}};
 let g:GatheringState={workerToolsLevel:m.enemyPolicy?.research.workerTools??0,units:workers,wood:bank.wood,goldBalance:bank.gold,base:base.position,baseSize:base.footprint.width,dropoffs:m.combat.enemies.filter(e=>e.buildingType==='outpost'&&e.hp>0&&e.construction?.remainingSeconds===0).map(e=>e.footprint!),faction:(m.factions??defaultFactions).enemy,node:m.gathering.node,gold:m.gathering.gold,extraNodes:m.gathering.extraNodes};
 for(const worker of workers){if(worker.selfDefense&&worker.selfDefense.order===worker.order||worker.order.kind!=='idle')continue;const index=Number(worker.id.split('-').at(-1))-1,resource=enemyEconomyConfig.resources[index%enemyEconomyConfig.resources.length],node=knownResourceFor(m,resource,worker.position);if(node&&node.remaining>0)g.units=orderUnits(g.units.map(u=>({...u,selected:u.id===worker.id})),node.position,node);}
 g=updateGathering(g,delta,enemyNavigationMap(m.map),{elapsedSeconds:m.waves.elapsedSeconds,gateFor,team:'enemy',services,...(m.enemyKnowledge&&m.fog?{nodeVisible:(node:import('./gathering').ResourceNode)=>isVisible(m.fog!,'enemy',node.position),knownRemaining:(node:import('./gathering').ResourceNode)=>knownEnemyNode(m,node)?.remaining??0}:{})});
 const byId=new Map(g.units.map(u=>[u.id,u as Worker]));
 return {...m,gathering:{...m.gathering,node:g.node,...(g.gold?{gold:g.gold}:{}),...(g.extraNodes?{extraNodes:g.extraNodes}:{})},enemyProduction:{...bank,wood:g.wood,gold:g.goldBalance??0,extracted:{wood:(bank.extracted?.wood??0)+resourceNodes(m.gathering).filter(n=>(n.resource??'wood')==='wood').reduce((sum,n)=>sum+n.remaining,0)-resourceNodes(g).filter(n=>(n.resource??'wood')==='wood').reduce((sum,n)=>sum+n.remaining,0),gold:(bank.extracted?.gold??0)+resourceNodes(m.gathering).filter(n=>n.resource==='gold').reduce((sum,n)=>sum+n.remaining,0)-resourceNodes(g).filter(n=>n.resource==='gold').reduce((sum,n)=>sum+n.remaining,0)}},combat:{...m.combat,enemies:m.combat.enemies.map(e=>{const u=byId.get(e.id);return u?{...e,position:u.position,navigation:u.navigation,work:{cargo:u.cargo,cargoType:u.cargoType,target:u.target,order:u.order as EnemyWork['order']}}:e;})}};
}
