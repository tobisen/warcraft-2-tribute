import {enemyBase} from './enemyBases';
import {enemyWorker} from './enemyGathering';
import {enemyPopulation,enemyBuildingView} from './enemyConstruction';
import {factionForTeam} from '../config/factions';
import {placeHarbor,trainShip,updateNavy,type Ship} from './navy';
import {productionTimeAfterConstruction} from './construction';
import type {MatchState} from './match';
import type {Enemy} from './combat';
function projection(m:MatchState,site:Enemy):MatchState{
 const bank=m.enemyProduction!,base=enemyBase(m.combat,m.map)!,f=factionForTeam(m,'enemy'),pop=enemyPopulation(m);
 const ships=m.combat.enemies.filter(e=>e.kind==='ship').map(e=>({id:e.id,kind:'ship' as const,owner:'player' as const,role:e.navalRole??'transport',hp:e.hp,position:e.position,selected:false,order:{kind:'idle' as const}}));
 return {...m,campaignMission:undefined,factions:{...m.factions!,player:f.id},combat:{...m.combat,baseHP:base.hp,enemies:[...m.combat.enemies.filter(e=>!e.footprint&&e.kind!=='worker'&&e.kind!=='ship'),...m.gathering.units.map(u=>({id:u.id,position:u.position,hp:u.hp??1,kind:'unit' as const}))]},gathering:{...m.gathering,campaignContent:undefined,faction:f.id,base:base.position,primaryDropoff:undefined,units:m.combat.enemies.flatMap(e=>{const w=enemyWorker(e);return w?[w]:[];}),wood:bank.wood,goldBalance:bank.gold},placement:{active:false,barracks:null,farms:enemyBuildingView(m).farms,producers:[],nextProducerNumber:Math.max(1,...m.combat.enemies.filter(e=>e.id.startsWith('enemy-producer-')).map(e=>Number(e.id.slice(15))+1))},research:{attack:0,defense:0,job:null,submarineDesign:m.enemyPolicy?.research.submarineDesign},navy:{harbor:{owner:'player',hp:site.hp,footprint:site.footprint!,construction:site.construction!},ships:ships as Ship[],production:site.production??{remainingSeconds:null,nextUnitNumber:m.enemyNaval!.production.nextUnitNumber}},fog:m.fog?{...m.fog,teams:{...m.fog.teams,player:m.fog.teams.enemy}}:undefined,
 // The adapter checks the actual enemy population before every enqueue; its own capacity
 // is only a projection and must not reject an already authorized reservation.
 ...(pop.cap>0?{}:{outcome:'defeat' as const})};
}
function bankAfter(m:MatchState,result:MatchState){const bank=m.enemyProduction!;return {...bank,wood:result.gathering.wood,gold:result.gathering.goldBalance??0,spent:{wood:(bank.spent?.wood??0)+bank.wood-result.gathering.wood,gold:(bank.spent?.gold??0)+bank.gold-(result.gathering.goldBalance??0)}};}
/** Reuse the paid harbor placement and queue; the authored transport assault stays finite. */
export function prepareExtraEnemyHarbor(m:MatchState):MatchState{
 if(!m.enemyNaval||!m.enemyProduction||m.campaignMission||m.scenario!=='skirmish'||m.enemyProduction.wood<200||m.enemyProduction.gold<100)return m;
 const harbors=m.combat.enemies.filter(e=>e.buildingType==='harbor'&&e.hp>0),original=harbors[0];if(!original||harbors.length>=2||original.construction?.remainingSeconds!==0||!enemyBase(m.combat,m.map))return m;
 const p=projection(m,original),workers=p.gathering.units.filter(u=>u.kind==='worker'&&u.order.kind!=='build');
 for(const worker of workers)for(const offset of [-64,64,-96,96,-128,128])for(const axis of ['x','y'] as const){const point={x:original.footprint!.x,y:original.footprint!.y};point[axis]+=offset;
 const result=placeHarbor({...p,placement:{...p.placement,active:true,kind:'harbor'},gathering:{...p.gathering,units:p.gathering.units.map(u=>({...u,selected:u.id===worker.id}))}},point),extra=result.placement.producers?.[0];if(!extra)continue;
 const byId=new Map(result.gathering.units.map(u=>[u.id,u]));return {...m,map:result.map,enemyProduction:bankAfter(m,result),combat:{...m.combat,enemies:[...m.combat.enemies.map(e=>{const u=byId.get(e.id);return u&&u.kind==='worker'?{...e,navigation:u.navigation,work:{...e.work!,target:u.target,order:u.order}}:e;}),{id:'enemy-'+extra.id,kind:'building',owner:'enemy',buildingType:'harbor',hp:extra.hp,position:{x:extra.footprint.x+32,y:extra.footprint.y+32},footprint:extra.footprint,construction:extra.construction,production:extra.production}]}};
 }
 return m;
}
export function updateExtraEnemyHarbors(m:MatchState,delta:number):MatchState{
 if(!m.enemyNaval||!m.enemyProduction||!enemyBase(m.combat,m.map))return m;
 for(const site of m.combat.enemies.filter(e=>e.id.startsWith('enemy-producer-')&&e.buildingType==='harbor'&&e.hp>0&&e.construction?.remainingSeconds===0)){
  let projected=projection(m,site);const recipe=factionForTeam(m,'enemy').naval.units.submarine,pop=enemyPopulation(m);
  if(m.enemyNaval!.production.nextUnitNumber>1&&m.enemyPolicy?.research.submarineDesign&&!site.production?.queue?.length&&pop.used+pop.reserved+recipe.supply<=pop.cap)projected=trainShip(projected,'submarine');
  const count=projected.navy!.ships.length,result=updateNavy({...projected,navy:{...projected.navy!,production:{...projected.navy!.production,nextUnitNumber:m.enemyNaval!.production.nextUnitNumber}}},productionTimeAfterConstruction(site.construction!,delta));
  const spawned=result.navy!.ships.slice(count).map(s=>({id:`enemy-ship-${s.id.slice(5)}`,kind:'ship' as const,owner:'enemy' as const,navalRole:'submarine' as const,hp:s.hp,position:s.position,order:{kind:'idle' as const}}));
  m={...m,enemyProduction:bankAfter(m,result),enemyNaval:{...m.enemyNaval!,production:{...m.enemyNaval!.production,nextUnitNumber:result.navy!.production.nextUnitNumber}},combat:{...m.combat,enemies:[...m.combat.enemies.map(e=>e.id===site.id?{...e,production:result.navy!.production}:e),...spawned]}};
 }
 return m;
}
