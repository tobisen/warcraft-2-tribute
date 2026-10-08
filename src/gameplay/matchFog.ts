import {scoutDetectorRadius} from '../config/roleResearch';
import {concealSubmarines} from './submarines';
import {factions,defaultFactions} from '../config/factions';
import {playerEliminated} from './teamResults';
import {canSupport} from './players';
import {observeForest} from './forestFog';
import {terrainPatches} from './map';
import {isAir} from './domains';
import {maps} from '../config/maps';
import { fogConfig } from '../config/fog';
import { arenaConfig } from '../config/arena';
import { baseFootprint } from './buildingSelection';
import type { MatchState } from './match';
import { createFog,updateFog,type VisionObserver } from './fog';
export function visionObservers(state:MatchState):VisionObserver[]{
 const observers:VisionObserver[]=state.gathering.units.filter(u=>(u.hp??1)>0).map(u=>({...(isAir(u)?{airborne:true as const}:{}),detectorRadius:scoutDetectorRadius(u.kind==='soldier'?u.archetype:undefined,state.research?.scoutOptics),id:u.id,owner:'player',position:{...u.position},radius:u.kind==='worker'?fogConfig.workerRadius:factions[(state.factions??defaultFactions).player].units[u.archetype??'soldier'].visionRadius??fogConfig.combatRadius}));
 const building=(id:string,footprint:{x:number;y:number;width:number;height:number},radius:number)=>observers.push({id,owner:'player',footprint,position:{x:footprint.x+footprint.width/2,y:footprint.y+footprint.height/2},radius});
 for(const ship of state.navy?.ships??[])if(ship.hp>0)observers.push({detectorRadius:ship.role==='transport'||ship.role==='submarine'?0:96,id:ship.id,owner:'player',position:{...ship.position},radius:fogConfig.combatRadius});
 const harbor=state.navy?.harbor;if(harbor&&harbor.hp>0&&harbor.construction.remainingSeconds===0)building('harbor',harbor.footprint,fogConfig.barracksRadius);
 for(const b of state.placement.producers??[])if(b.hp>0&&b.construction.remainingSeconds===0)building(b.id,b.footprint,fogConfig.forgeRadius);
 for(const b of state.placement.bases??[])if(b.hp>0&&b.construction.remainingSeconds===0)building(b.id,b.footprint,fogConfig.baseRadius);
 if(state.combat.baseHP>0)building('base',baseFootprint(state.gathering.base),fogConfig.baseRadius);
 if(state.placement.barracks&&(state.placement.barracksHP??1)>0&&state.placement.construction?.remainingSeconds===0)building('barracks',state.placement.barracks,fogConfig.barracksRadius);
 const siegeWorks=state.placement.siegeWorks;if(siegeWorks&&siegeWorks.hp>0&&siegeWorks.construction.remainingSeconds===0)building('siegeWorks',siegeWorks.footprint,fogConfig.forgeRadius);
 const aviary=state.placement.aviary;if(aviary&&aviary.hp>0&&aviary.construction.remainingSeconds===0)building('aviary',aviary.footprint,fogConfig.forgeRadius);
 const stable=state.placement.stable;if(stable&&stable.hp>0&&stable.construction.remainingSeconds===0)building('stable',stable.footprint,fogConfig.forgeRadius);
 const academy=state.placement.academy;if(academy&&academy.hp>0&&academy.construction.remainingSeconds===0)building('academy',academy.footprint,fogConfig.forgeRadius);
 const forge=state.placement.forge;if(forge&&forge.hp>0&&forge.construction.remainingSeconds===0)building('forge',forge.footprint,fogConfig.forgeRadius);
 for(const t of state.placement.defenses??[])if(t.hp>0&&t.construction.remainingSeconds===0)building(t.id,t.footprint,t.kind==='tower'?208:48);
 for(const farm of state.placement.farms??[])if((farm.hp??1)>0&&farm.construction.remainingSeconds===0)building(farm.id,farm.footprint,fogConfig.farmRadius);
 for(const enemy of state.combat.enemies)if(enemy.hp>0)observers.push({...(isAir(enemy)?{airborne:true as const}:{}),detectorRadius:scoutDetectorRadius(enemy.role,(state.multiplePlayers?.ai.find(bot=>bot.id===(enemy.playerId??'enemy'))?.state.enemyPolicy??state.enemyPolicy)?.research.scoutOptics),id:enemy.id,owner:'enemy',position:{...enemy.position},footprint:enemy.footprint,radius:enemy.kind==='base'||enemy.buildingType==='outpost'?fogConfig.baseRadius:enemy.kind==='worker'?fogConfig.workerRadius:enemy.buildingType==='barracks'?fogConfig.barracksRadius:enemy.buildingType==='forge'?fogConfig.forgeRadius:enemy.buildingType==='farm'?fogConfig.farmRadius:enemy.role?factions[enemy.faction??(state.factions??defaultFactions).enemy].units[enemy.role].visionRadius??fogConfig.combatRadius:fogConfig.combatRadius});
 return observers;
}
const blockerCache=new WeakMap<object,{x:number;y:number;width:number;height:number}[]>();
export function matchFog(state:MatchState){
 const patches=terrainPatches(state.map);let blockers=blockerCache.get(patches);if(!blockers){blockers=patches.filter(t=>t.kind==='rock').map(t=>({x:t.column*arenaConfig.tileSize,y:t.row*arenaConfig.tileSize,width:t.columns*arenaConfig.tileSize,height:t.rows*arenaConfig.tileSize}));blockerCache.set(patches,blockers);}
 const observers:VisionObserver[]=[...visionObservers(state).filter(o=>!state.multiplePlayers||!playerEliminated(state,o.owner==='player'?'player':state.combat.enemies.find(e=>e.id===o.id)?.playerId??'enemy')),...(state.multiplePlayers?.ai.filter(bot=>!playerEliminated(state,bot.id)&&canSupport('player',bot.id,state.multiplePlayers!.roster)).flatMap(bot=>visionObservers(bot.state).filter(o=>o.owner==='enemy').map(o=>({...o,owner:'player' as const})))??[]),...(state.aiContext?.sharedObservers??[]).map(o=>({...o,owner:state.aiContext?.visionSide??'enemy'}))];
 const fog=observeForest(updateFog(state.fog??createFog(state.map),observers,blockers),state.gathering);
 return concealSubmarines(state,fog,observers);
}
