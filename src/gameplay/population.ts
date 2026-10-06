import {factions,productionFaction} from '../config/factions';
import { farmConfig, populationConfig } from '../config/buildings';
import type { GatheringState } from './gathering';
import type { PlacementState } from './placement';
import type { ProductionState } from './production';
export interface Population {cap:number;used:number;reserved:number}
export function populationState(gathering:GatheringState,placement:PlacementState,jobs:ProductionState[]):Population {
  return {cap:(gathering.primaryDropoff===false?0:productionFaction(gathering).buildings.base.populationCapacity)+ (placement.bases??[]).filter(b=>b.hp>0&&b.construction.remainingSeconds===0).length*productionFaction(gathering).buildings.base.populationCapacity+(placement.farms??[]).filter(f=>f.construction.remainingSeconds===0).length*productionFaction(gathering).buildings.farm.populationCapacity,
    used:gathering.units.reduce((n,u)=>n+(u.kind==='soldier'?factions[gathering.faction??u.faction??'crown'].units[u.archetype??'soldier'].supply:productionFaction(gathering).units.worker.supply),0)*populationConfig.unitSupply,
    reserved:jobs.reduce((sum,j)=>sum+(j.queue?.reduce((n,job)=>n+(job.supply??1),0)??(j.remainingSeconds!==null?1:0)),0)*populationConfig.unitSupply};
}
export function hasPopulation(pop:Population,supply=populationConfig.unitSupply):boolean {
  return pop.used+pop.reserved+supply<=pop.cap;
}
