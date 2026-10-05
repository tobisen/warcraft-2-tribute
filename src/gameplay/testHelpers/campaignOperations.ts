import {canAttackDomain} from '../domains';
import {campaignMissions,campaignPreset,type CampaignMissionId} from '../../config/campaign';
import {operationFor} from '../../config/operations';
import {startCampaignMission} from '../campaign';
import {prepareNavalArmy} from './navalArmy';
import {updateMatch,type MatchState} from '../match';
import {placeHarbor,trainShip,commandShips} from '../navy';
import {loadTransport,unloadTransport} from '../transport';
import {orderUnits} from '../gathering';
import {commandGroupMove} from '../groupMovement';
import {commandAttackMove} from '../attackMove';
import {orderAttack} from '../combat';
import {entityVisible} from '../visibility';
import {useAbility} from '../abilities';
import {encodeSave,decodeSave} from '../save';
/** Paid normal mission commands. Prior completion IDs are only a menu admission fixture. */
export function playCampaignOperation(id:CampaignMissionId){
 const index=campaignMissions.findIndex(m=>m.id===id),mission=campaignMissions[index];
 let m=startCampaignMission({version:1,completed:campaignMissions.slice(0,index).map(m=>m.id)},id,'normal',campaignPreset(id)!)!,saved=false,abilities=0;
 const select=(id:string)=>{m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.id===id}));if(m.navy)m.navy.ships=m.navy.ships.map(s=>({...s,selected:s.id===id}));};
 const until=(goal:(m:MatchState)=>boolean,max=4000)=>{for(let i=0;i<max&&!goal(m)&&m.outcome==='playing';i++)m=updateMatch(m,.1);if(!goal(m))throw Error(`${id} preparation stalled at ${m.waves.elapsedSeconds}/${m.outcome}`);};
 m=prepareNavalArmy(m);
 if(mission.scenario==='mission-sea'||mission.scenario==='mission-capture'){
  select('unit-1');m.placement={...m.placement,active:true,kind:'harbor'};m=placeHarbor(m,{x:672,y:320});if(!m.navy?.harbor)throw Error('Harbor failed');until(m=>m.navy!.harbor!.construction.remainingSeconds===0);m=trainShip(m,'transport');until(m=>m.navy!.ships.length===1);
  select('ship-1');m.navy=commandShips(m,{x:720,y:432});until(m=>m.navy!.ships[0].order.kind==='idle');
  m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.kind==='soldier'}));m.gathering.units=orderUnits(m.gathering.units,{x:688,y:432});until(m=>m.gathering.units.filter(u=>u.kind==='soldier').every(u=>Math.hypot(u.position.x-720,u.position.y-432)<=64));m=loadTransport(m,'ship-1');if(m.navy!.ships[0].passengers?.length!==4)throw Error('Boarding failed');
  const loaded=decodeSave(encodeSave({...m,paused:true},{camera:{x:0,y:0},building:null}));if(!loaded.ok)throw Error(loaded.error);m={...loaded.match,paused:false};saved=true;
  select('ship-1');m.navy=commandShips(m,{x:880,y:432});until(m=>m.navy!.ships[0].order.kind==='idle');m=unloadTransport(m,'ship-1',{x:912,y:432});if(m.navy!.ships[0].passengers?.length)throw Error('Landing failed');
 }
 const operation=operationFor(m.scenario),goal=operation?.zone??{x:944,y:208};
 m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.kind==='soldier'}));m.gathering.units=commandAttackMove(m.gathering.units,goal,m.map);
 for(let i=0;i<5000&&m.outcome==='playing';i++){
  if(i%4===0){
   const visible=m.combat.enemies.filter(e=>e.hp>0&&entityVisible(m.fog!,'player',e));
   for(const unit of m.gathering.units.filter(u=>u.kind==='soldier')){
    select(unit.id);const target=visible.filter(e=>canAttackDomain(unit,e,m.factions!.player)).sort((a,b)=>Number(!!a.footprint)-Number(!!b.footprint)||Math.hypot(a.position.x-unit.position.x,a.position.y-unit.position.y)-Math.hypot(b.position.x-unit.position.x,b.position.y-unit.position.y))[0];
    if(target){if(Math.hypot(target.position.x-unit.position.x,target.position.y-unit.position.y)<80){const result=useAbility(m.gathering);if(result!==m.gathering)abilities++;m.gathering=result;}if(unit.order.kind!=='attack'||unit.order.enemyId!==target.id)m.gathering.units=orderAttack(m.gathering.units,target.id);}
    else if(unit.order.kind==='idle'&&Math.hypot(unit.position.x-goal.x,unit.position.y-goal.y)>32)m.gathering.units=commandAttackMove(m.gathering.units,goal,m.map);
   }
   if(operation?.kind==='escort'&&operation.guards.every(g=>!m.combat.enemies.some(e=>e.id===g.id))){const courier=m.gathering.units.find(u=>u.id===operation.courier.id);if(courier&&Math.hypot(courier.position.x-goal.x,courier.position.y-goal.y)>operation.radius){select(courier.id);if(courier.order.kind!=='move')m.gathering.units=commandGroupMove(m.gathering.units,goal,m.map);}}
  }
  m=updateMatch(m,.1);
  if(!saved&&i>=30){const result=decodeSave(encodeSave({...m,paused:true},{camera:{x:0,y:0},building:null}));if(!result.ok)throw Error(result.error);m={...result.match,paused:false};saved=true;}
 }
 return {match:m,saved,abilities};
}
