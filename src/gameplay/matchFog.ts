import {maps} from '../config/maps';
import { fogConfig } from '../config/fog';
import { arenaConfig } from '../config/arena';
import { baseFootprint } from './buildingSelection';
import type { MatchState } from './match';
import { createFog,updateFog,type VisionObserver } from './fog';
export function visionObservers(state:MatchState):VisionObserver[]{
 const observers:VisionObserver[]=state.gathering.units.filter(u=>(u.hp??1)>0).map(u=>({id:u.id,owner:'player',position:{...u.position},radius:u.kind==='worker'?fogConfig.workerRadius:fogConfig.combatRadius}));
 const building=(id:string,footprint:{x:number;y:number;width:number;height:number},radius:number)=>observers.push({id,owner:'player',footprint,position:{x:footprint.x+footprint.width/2,y:footprint.y+footprint.height/2},radius});
 for(const ship of state.navy?.ships??[])if(ship.hp>0)observers.push({id:ship.id,owner:'player',position:{...ship.position},radius:fogConfig.combatRadius});
 const harbor=state.navy?.harbor;if(harbor&&harbor.hp>0&&harbor.construction.remainingSeconds===0)building('harbor',harbor.footprint,fogConfig.barracksRadius);
 if(state.combat.baseHP>0)building('base',baseFootprint(state.gathering.base),fogConfig.baseRadius);
 if(state.placement.barracks&&(state.placement.barracksHP??1)>0&&state.placement.construction?.remainingSeconds===0)building('barracks',state.placement.barracks,fogConfig.barracksRadius);
 const forge=state.placement.forge;if(forge&&forge.hp>0&&forge.construction.remainingSeconds===0)building('forge',forge.footprint,fogConfig.forgeRadius);
 for(const t of state.placement.defenses??[])if(t.hp>0&&t.construction.remainingSeconds===0)building(t.id,t.footprint,t.kind==='tower'?208:48);
 for(const farm of state.placement.farms??[])if((farm.hp??1)>0&&farm.construction.remainingSeconds===0)building(farm.id,farm.footprint,fogConfig.farmRadius);
 for(const enemy of state.combat.enemies)if(enemy.hp>0)observers.push({id:enemy.id,owner:'enemy',position:{...enemy.position},footprint:enemy.footprint,radius:enemy.kind==='base'||enemy.buildingType==='outpost'?fogConfig.baseRadius:enemy.kind==='worker'?fogConfig.workerRadius:enemy.buildingType==='barracks'?fogConfig.barracksRadius:enemy.buildingType==='forge'?fogConfig.forgeRadius:enemy.buildingType==='farm'?fogConfig.farmRadius:fogConfig.combatRadius});
 return observers;
}
export function matchFog(state:MatchState){
 const blockers=maps[state.map.id??'arena'].terrain.filter(t=>t.kind==='rock').map(t=>({x:t.column*arenaConfig.tileSize,y:t.row*arenaConfig.tileSize,width:t.columns*arenaConfig.tileSize,height:t.rows*arenaConfig.tileSize}));
 return updateFog(state.fog??createFog(state.map),visionObservers(state),blockers);
}
