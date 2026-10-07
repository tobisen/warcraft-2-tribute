import {enemyBase} from '../enemyBases';
import {approachRoute} from '../approach';
import {orderUnits} from '../gathering';
import {campaignMissions,campaignPreset,type CampaignMissionId} from '../../config/campaign';
import {operationFor} from '../../config/operations';
import {canAttackDomain} from '../domains';
import {startCampaignMission} from '../campaign';
import {campaignPhase} from '../campaignPhases';
import {prepareNavalArmy} from './navalArmy';
import {updateMatch,type MatchState} from '../match';
import {entityVisible} from '../visibility';
import {commandGroupMove} from '../groupMovement';
import {commandAttackMove} from '../attackMove';
import {orderAttack} from '../combat';
import {useAbility} from '../abilities';
import {placeHarbor,trainShip,commandShips} from '../navy';
import {loadTransport,unloadTransport} from '../transport';
import {encodeSave,decodeSave} from '../save';
import type {Difficulty} from '../../config/difficulty';
/** Real paid commands. This controller measures completion, not human duration/difficulty. */
export function playExpandedCampaign(id:CampaignMissionId,difficulty:Difficulty='normal'){
 const prior=campaignMissions.slice(0,campaignMissions.findIndex(m=>m.id===id)).map(m=>m.id);
 let m=startCampaignMission({version:1,completed:prior},id,difficulty,campaignPreset(id)!)!,abilities=0,saved=false;
 m=prepareNavalArmy(m);
 const select=(predicate:(id:string,kind:string)=>boolean)=>{m.gathering.units=m.gathering.units.map(u=>({...u,selected:predicate(u.id,u.kind)}));if(m.navy)m.navy.ships=m.navy.ships.map(s=>({...s,selected:predicate(s.id,s.kind)}));};
 let destination:{x:number;y:number}|undefined,combatEnabled=true;
 const tick=()=>{
  if(campaignPhase(m)?.goal==='base'){const base=enemyBase(m.combat,m.map);if(base)destination={...base.position};}
  const visible=m.combat.enemies.filter(e=>combatEnabled&&entityVisible(m.fog!,'player',e));
  for(const unit of m.gathering.units.filter(u=>u.kind==='soldier')){
   const target=visible.filter(e=>canAttackDomain(unit,e,m.factions!.player)&&Math.hypot(e.position.x-unit.position.x,e.position.y-unit.position.y)<160&&approachRoute(m.map,unit.position,e.footprint??{...e.position,width:0,height:0},24).status!=='blocked').sort((a,b)=>Math.hypot(a.position.x-unit.position.x,a.position.y-unit.position.y)-Math.hypot(b.position.x-unit.position.x,b.position.y-unit.position.y))[0];
   if(target){select(id=>id===unit.id);if(unit.order.kind!=='attack'||unit.order.enemyId!==target.id)m.gathering.units=orderAttack(m.gathering.units,target.id);const used=Math.hypot(target.position.x-unit.position.x,target.position.y-unit.position.y)<80?useAbility(m.gathering):m.gathering;if(used!==m.gathering){m.gathering=used;abilities++;}}
  }
  for(const unit of m.gathering.units.filter(u=>u.kind==='soldier'&&u.order.kind==='idle'))if(destination&&Math.hypot(unit.position.x-destination.x,unit.position.y-destination.y)>48){select(id=>id===unit.id);m.gathering.units=commandAttackMove(m.gathering.units,destination,m.map);}
  m=updateMatch(m,.1);
 };
 const until=(goal:()=>boolean,max=6000)=>{for(let i=0;i<max&&!goal()&&m.outcome==='playing';i++)tick();if(!goal())throw Error(`${id}/${difficulty} stalled at phase ${m.campaignRun?.phase}, ${m.waves.elapsedSeconds}s, ${m.outcome}, army ${JSON.stringify(m.gathering.units.filter(u=>u.kind==='soldier').map(u=>({p:u.position,o:u.order,error:u.navigation?.error})))}`);};
 const group=(point:{x:number;y:number},attack=true)=>{destination={...point};select((_,kind)=>kind==='soldier');m.gathering.units=attack?commandAttackMove(m.gathering.units,point,m.map):commandGroupMove(m.gathering.units,point,m.map);};
 if(m.scenario==='mission-sea'||m.scenario==='mission-capture'){
  select(id=>id==='unit-1');m.placement={...m.placement,active:true,kind:'harbor'};m=placeHarbor(m,{x:672,y:320});if(!m.navy?.harbor)throw Error(`${id}: harbor failed`);
  until(()=>m.navy!.harbor!.construction.remainingSeconds===0);m=trainShip(m,'transport');until(()=>m.navy!.ships.length===1);
  combatEnabled=false;select((_,kind)=>kind==='ship');m.navy=commandShips(m,{x:720,y:432});until(()=>m.navy!.ships[0].order.kind==='idle');destination=undefined;select((_,kind)=>kind==='soldier');m.gathering.units=orderUnits(m.gathering.units,{x:688,y:432});until(()=>{select((_,kind)=>kind==='soldier');m=loadTransport(m,'ship-1');if(m.gathering.units.some(u=>u.kind==='soldier'))m.gathering.units=orderUnits(m.gathering.units,{x:688,y:432});return m.navy!.ships[0].passengers?.length===4;});
  m=loadTransport(m,'ship-1');if(m.navy!.ships[0].passengers?.length!==4)throw Error(`${id}: load failed`);
  select((_,kind)=>kind==='ship');m.navy=commandShips(m,{x:880,y:432});until(()=>m.navy!.ships[0].order.kind==='idle');m=unloadTransport(m,'ship-1',{x:912,y:432});if(m.navy!.ships[0].passengers?.length)throw Error(`${id}: landing failed`);combatEnabled=true;
 }
 while(m.outcome==='playing'){
  const phase=m.campaignRun!.phase,p=campaignPhase(m);if(!p)break;
  if(p.goal==='explore')for(const point of p.points!){group(point);until(()=>m.campaignRun!.phase!==phase||!!m.fog?.teams.player.explored[Math.floor(point.y/m.fog.tileSize)*m.fog.columns+Math.floor(point.x/m.fog.tileSize)]);}
  else if(p.goal==='waves'){group({x:560,y:400});until(()=>m.campaignRun!.phase!==phase||m.outcome!=='playing');}
  else if(p.goal==='position'){group(p.points![0]);until(()=>m.campaignRun!.phase!==phase);}
  else if(p.goal==='guards'||p.goal==='operation'){
   const operation=operationFor(m.scenario)!;group(operation.zone);
   if(operation.kind==='escort'&&p.goal==='operation'){select(id=>id===operation.courier.id);m.gathering.units=commandGroupMove(m.gathering.units,operation.zone,m.map);}
   until(()=>m.campaignRun!.phase!==phase||m.outcome!=='playing');
  }else if(p.goal==='base'){
   for(let attempt=0;attempt<4&&m.campaignRun!.phase===phase&&m.outcome==='playing';attempt++){
    const target=enemyBase(m.combat,m.map);if(target)group(target.position);
    until(()=>m.campaignRun!.phase!==phase||m.outcome!=='playing'||!m.gathering.units.some(u=>u.kind==='soldier'));
    if(m.campaignRun!.phase!==phase||m.outcome!=='playing')break;
    // Recover losses through the same paid preparation, without free units or HP.
    m=prepareNavalArmy(m);if(m.scenario!=='mission-sea')continue;
    // Naval reinforcements also need another real ferry trip.
    combatEnabled=false;destination=undefined;select((_,kind)=>kind==='ship');m.navy=commandShips(m,{x:720,y:432});until(()=>m.navy!.ships[0].order.kind==='idle');
    select((_,kind)=>kind==='soldier');m.gathering.units=orderUnits(m.gathering.units,{x:688,y:432});until(()=>{select((_,kind)=>kind==='soldier');m=loadTransport(m,'ship-1');if(m.gathering.units.some(u=>u.kind==='soldier'))m.gathering.units=orderUnits(m.gathering.units,{x:688,y:432});return m.navy!.ships[0].passengers?.length===4;});
    select((_,kind)=>kind==='ship');m.navy=commandShips(m,{x:880,y:432});until(()=>m.navy!.ships[0].order.kind==='idle');m=unloadTransport(m,'ship-1',{x:912,y:432});if(m.navy!.ships[0].passengers?.length)throw Error(`${id}: reinforcement landing failed`);combatEnabled=true;
   }
   if(m.campaignRun!.phase===phase&&m.outcome==='playing')throw Error(`${id}: paid assaults did not finish the base`);
  }
  else until(()=>m.campaignRun!.phase!==phase||m.outcome!=='playing');
  const loaded=decodeSave(encodeSave({...m,paused:true},{camera:{x:0,y:0},building:null}));if(!loaded.ok)throw Error(`${id}: save ${loaded.error}`);m={...loaded.match,paused:false};saved=true;
 }
 return {match:m,saved,abilities};
}
