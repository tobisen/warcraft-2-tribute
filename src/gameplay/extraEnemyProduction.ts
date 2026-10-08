import {productionTimeAfterConstruction} from './construction';
import {enemyPopulation} from './enemyConstruction';
import {enemyBase,hasEnemyBase} from './enemyBases';
import {enemySoldier} from './enemyUnits';
import {enqueueProduction,updateQueuedProduction} from './productionQueue';
import {technologyFor,unitAvailability} from './productionPrerequisites';
import {factionForTeam,type UnitRole} from '../config/factions';
import type {MatchState} from './match';
import type {GatheringState} from './gathering';
export function updateExtraEnemyProduction(m:MatchState,delta:number):MatchState{
 if(!m.enemyProduction||!hasEnemyBase(m.combat,m.map))return m;
 const f=factionForTeam(m,'enemy');
 for(const original of m.combat.enemies.filter(e=>e.id.startsWith('enemy-producer-')&&e.buildingType!=='harbor'&&e.hp>0&&e.construction?.remainingSeconds===0&&e.production)){
  const site=m.combat.enemies.find(e=>e.id===original.id)!,bank=m.enemyProduction!,base=enemyBase(m.combat,m.map)!,units=m.combat.enemies.filter(e=>!e.footprint&&e.kind!=='worker'&&e.kind!=='ship').map(e=>enemySoldier(e,f.id));
  let g:GatheringState={faction:f.id,units,wood:bank.wood,goldBalance:bank.gold,base:base.position,node:m.gathering.node};
  const tech=technologyFor(m,'enemy'),roles=f.roster.filter((r):r is Exclude<UnitRole,'worker'>=>r!=='worker'&&f.units[r].trainedAt===site.buildingType&&(!m.enemyNaval||r==='air'||r==='scout'||m.combat.enemies.filter(e=>!e.footprint&&e.kind!=='ship'&&e.kind!=='worker'&&e.role!=='air'&&e.role!=='scout').reduce((n,e)=>n+f.units[e.role??'soldier'].supply,0)+(m.enemyNaval.passengers.length??0)+f.units[r].supply<=2)&&!unitAvailability(f,r,tech));
  let p={...site.production!,nextUnitNumber:bank.production.nextUnitNumber};let accepted=bank.acceptedJobs;
  const descriptor=(role:Exclude<UnitRole,'worker'>)=>({kind:'barracks' as const,producer:site.buildingType as 'barracks',footprint:site.footprint!,unitType:role,technology:tech,bounds:m.map,ready:true});
  const role=roles[accepted%Math.max(1,roles.length)];
  if(role){const result=enqueueProduction(g,p,descriptor(role),enemyPopulation(m));g=result.gathering;if(result.production!==p)accepted++;p=result.production;}
  const head=(p.queue?.[0]?.kind??role) as Exclude<UnitRole,'worker'>|undefined;
  const result=head?updateQueuedProduction(g,p,productionTimeAfterConstruction(site.construction!,delta),descriptor(head),{map:m.map,enemies:m.gathering.units}):{gathering:g,production:p};
  const spawned=result.gathering.units.slice(units.length).map(u=>({id:`enemy-produced-${u.id.slice(5)}`,kind:'unit' as const,owner:'enemy' as const,role:u.kind==='soldier'?u.archetype??'soldier' as const:'soldier' as const,hp:u.hp!,position:u.position,...(u.kind==='soldier'&&u.archetype==='healer'?{healAutocast:true}:{}),...(u.kind==='soldier'&&u.archetype==='scout'?{scouting:{mode:'auto' as const,waypoints:[],index:0,nextPlanSeconds:0}}:{}),order:{kind:'idle' as const},...(u.kind==='soldier'&&u.mana!==undefined?{mana:u.mana}:{})}));
  const spent={wood:(bank.spent?.wood??0)+bank.wood-result.gathering.wood,gold:(bank.spent?.gold??0)+bank.gold-(result.gathering.goldBalance??0)},nextUnitNumber=result.production.nextUnitNumber;
  m={...m,enemyProduction:{...bank,wood:result.gathering.wood,gold:result.gathering.goldBalance??0,acceptedJobs:accepted,spent,production:{...bank.production,nextUnitNumber}},combat:{...m.combat,enemies:[...m.combat.enemies.map(e=>e.id===site.id?{...e,production:result.production}:e),...spawned]}};
 }
 return m;
}
