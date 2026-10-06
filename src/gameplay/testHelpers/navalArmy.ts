import {canReachFootprint} from '../approach';
import {canAttackDomain} from '../domains';
import {factions} from '../../config/factions';
import {updateMatch,type MatchState} from '../match';
import {resourceNodes,orderUnits} from '../gathering';
import {commandGroupMove} from '../groupMovement';
import {orderAttack} from '../combat';
import {useAbility} from '../abilities';
import {knownResource,entityVisible} from '../visibility';
import {beginPlacement,placeBuilding,placementObstacles} from '../placement';
import {enqueueProduction} from '../productionQueue';
import {matchPopulation} from '../navy';
/** Legal naval preparation: build/training while gathering, guard against actual landing attacks. */
export function prepareNavalArmy(initial:MatchState):MatchState{
 let m=initial;const rally={x:m.map.id==='frontier'?560:600,y:336};const f=factions[m.factions!.player];
 const select=(id:string)=>{m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.id===id}));};
 for(let i=0;i<6000&&m.outcome==='playing';i++){
  const army=m.gathering.units.filter(u=>u.kind==='soldier'),pending=m.soldierProduction.queue?.length??0;
  if(army.length===4&&m.placement.farms?.[0]?.construction.remainingSeconds===0&&m.gathering.wood>=f.naval.harbor.cost.wood+f.naval.units.transport.cost.wood&&(m.gathering.goldBalance??0)>=f.naval.harbor.cost.gold+f.naval.units.transport.cost.gold)return m;
  if(i%4===0){
   const visible=m.combat.enemies.filter(e=>entityVisible(m.fog!,'player',e));
   for(const worker of [...m.gathering.units].filter(u=>u.kind==='worker')){
    if(worker.order.kind==='build')continue;
    const current='nodeId' in worker.order?resourceNodes(m.gathering).find(n=>n.id===('nodeId' in worker.order?worker.order.nodeId:undefined)):undefined;
    const node=worker.id==='unit-3'?m.gathering.gold!:current&&(current.resource??'wood')==='wood'&&current.remaining>0?current:resourceNodes(m.gathering).find(n=>(n.resource??'wood')==='wood'&&n.remaining>0&&knownResource(m.fog!,n.position)&&(!n.tree||canReachFootprint(m.map,worker.position,{x:n.position.x-16,y:n.position.y-16,width:32,height:32},24)))??m.gathering.node;select(worker.id);
    if(!knownResource(m.fog!,node.position)){if(worker.order.kind!=='move')m.gathering.units=commandGroupMove(m.gathering.units,node.resource==='gold'&&m.map.id!=='islands'&&m.map.id!=='coast'?{x:780,y:240}:{x:600,y:220},m.map);}
    else if(!('nodeId' in worker.order)||!resourceNodes(m.gathering).some(n=>n.id===('nodeId' in worker.order?worker.order.nodeId:undefined)&&n.remaining>0&&(n.resource??'wood')===(node.resource??'wood')))m.gathering.units=orderUnits(m.gathering.units,node.position,node);
   }
   const kind=!m.placement.barracks?'barracks':!m.placement.farms?.length&&army.length+pending>=3?'farm':null;
   if(kind&&m.gathering.wood>=f.buildings[kind].cost.wood){
    const builder=m.gathering.units.find(u=>u.kind==='worker'&&u.order.kind!=='build');
    if(builder){select(builder.id);const placed=placeBuilding(beginPlacement(m.placement,kind),kind==='barracks'?{x:512,y:384}:{x:448,y:512},m.gathering.wood,placementObstacles(m.gathering),{map:m.map,gathering:m.gathering,enemies:visible});if(placed.gathering&&placed.map)m={...m,map:placed.map,gathering:placed.gathering,placement:placed.placement};}
   }
   if(m.placement.barracks&&m.placement.construction?.remainingSeconds===0&&army.length+pending<4){const trained=enqueueProduction(m.gathering,m.soldierProduction,{kind:'barracks',footprint:m.placement.barracks},matchPopulation(m));m={...m,gathering:trained.gathering,soldierProduction:trained.production};}
   for(const soldier of army){
    select(soldier.id);
    const target=visible.filter(e=>canAttackDomain(soldier,e,m.factions!.player)&&e.kind==='unit'&&Math.hypot(e.position.x-600,e.position.y-336)<240).sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}))[0];
    if(target){if(Math.hypot(target.position.x-soldier.position.x,target.position.y-soldier.position.y)<80)m.gathering=useAbility(m.gathering);if(soldier.order.kind!=='attack'||soldier.order.enemyId!==target.id)m.gathering.units=orderAttack(m.gathering.units,target.id);}
    else if(soldier.order.kind==='idle'&&Math.hypot(soldier.position.x-rally.x,soldier.position.y-rally.y)>60)m.gathering.units=commandGroupMove(m.gathering.units,rally,m.map);
   }
  }
  m=updateMatch(m,.1);
 }
 throw Error(`Naval preparation failed: ${m.outcome} at ${m.waves.elapsedSeconds}: ${JSON.stringify({wood:m.gathering.wood,gold:m.gathering.goldBalance,units:m.gathering.units,placement:m.placement,queue:m.soldierProduction})}`);
}
