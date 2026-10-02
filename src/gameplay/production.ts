import { catapultConfig } from '../config/catapult';
import { archerConfig } from '../config/archer';
import type { ProductionJob } from './productionQueue';
import { hasPopulation, type Population } from './population';
import { costs,type ResourceCost } from '../config/economy';
import { canAfford, payCost } from './economy';
import { commandMappedMove } from './navigation';
import { chooseSpawn } from './spawning';
import { gatheringConfig } from '../config/gathering';
import type { WorldMap } from './map';
import { combatConfig } from '../config/combat';
import { productionConfig, soldierProductionConfig } from '../config/production';
import { soldierStats } from '../config/unit';
import { worldConfig } from '../config/buildings';
import type { GatheringState, Unit } from './gathering';
import type { Footprint } from './placement';
import type { Position } from './movement';

export interface ProductionState {
  remainingSeconds: number | null;
  queue?:ProductionJob[];
  nextJobNumber?:number;
  rally?: Position;
  rallyError?: string;
  blockedSpawnKey?: string;
  nextUnitNumber: number;
}
export type ProductionBuilding = { kind: 'base' } | { kind: 'barracks'; footprint: Footprint | null; ready?:boolean;unitType?:'soldier'|'archer'|'catapult';jobCost?:ResourceCost;durationSeconds?:number };
const base: ProductionBuilding = { kind: 'base' };

export function soldierSpawn(footprint: Footprint,size=soldierStats.size): Position | null {
  const half = size / 2;
  const offset = half + soldierProductionConfig.spawnGap;
  const candidates = [
    { x: footprint.x + footprint.width + offset, y: footprint.y + footprint.height / 2 },
    { x: footprint.x - offset, y: footprint.y + footprint.height / 2 },
    { x: footprint.x + footprint.width / 2, y: footprint.y + footprint.height + offset },
    { x: footprint.x + footprint.width / 2, y: footprint.y - offset },
  ];
  return candidates.find(p => p.x - half >= 0 && p.y - half >= 0
    && p.x + half <= worldConfig.width && p.y + half <= worldConfig.height) ?? null;
}

export function canStartProduction(gathering: GatheringState, production: ProductionState, building: ProductionBuilding = base, population?:Population): boolean {
  const cost = building.kind === 'base' ? costs.worker : (building.jobCost??costs[building.unitType??'soldier']);
  return (!population || hasPopulation(population,building.kind==='barracks'&&building.unitType==='catapult'?catapultConfig.supply:1)) && production.remainingSeconds === null && canAfford(gathering,cost)
    && (building.kind === 'base' || (building.ready !== false && building.footprint !== null && soldierSpawn(building.footprint) !== null));
}

export function startProduction(gathering: GatheringState, production: ProductionState, building: ProductionBuilding = base, population?:Population) {
  if (!canStartProduction(gathering, production, building,population)) return { gathering, production };
  const cost = building.kind === 'base' ? costs.worker : (building.jobCost??costs[building.unitType??'soldier']);
  const duration = building.kind === 'barracks'&&building.durationSeconds!==undefined?building.durationSeconds:building.kind === 'base' ? productionConfig.durationSeconds : building.unitType==='catapult'?catapultConfig.durationSeconds:building.unitType==='archer'?archerConfig.durationSeconds:soldierProductionConfig.durationSeconds;
  return {
    gathering: payCost(gathering,cost),
    production: { ...production, remainingSeconds: duration },
  };
}

export function updateProduction(gathering: GatheringState, production: ProductionState, deltaSeconds: number, building: ProductionBuilding = base, context?: {map:WorldMap;enemies:readonly {id:string;position:Position}[]}) {
  if (building.kind==='barracks' && building.ready===false) return {gathering,production};
  if (production.remainingSeconds === null) return { gathering, production };
  const remainingSeconds = Math.max(0, production.remainingSeconds - Math.max(0, deltaSeconds));
  if (remainingSeconds > 1e-10) return { gathering, production: { ...production, remainingSeconds } };
  const spawnKey=context ? `${context.map.revision}:${building.kind}:`
    + gathering.units.map(u=>`${u.id}:${u.position.x}:${u.position.y}`).join('|')
    + ':'+context.enemies.map(e=>`${e.id}:${e.position.x}:${e.position.y}`).join('|') : undefined;
  if(production.remainingSeconds===0 && production.blockedSpawnKey===spawnKey && context)return {gathering,production};
  const footprint=building.kind==='base'?{x:gathering.base.x-gatheringConfig.baseSize/2,
    y:gathering.base.y-gatheringConfig.baseSize/2,width:gatheringConfig.baseSize,height:gatheringConfig.baseSize}:building.footprint;
  const variant=building.kind==='barracks'?(building.unitType==='catapult'?catapultConfig:building.unitType==='archer'?archerConfig:null):null;
  const position = context ? footprint?chooseSpawn(context.map,footprint,building.kind,gathering.units,context.enemies,variant?.size):null
    : building.kind === 'base' ? {
    x: gathering.base.x + productionConfig.spawnOffset.x,
    y: gathering.base.y + productionConfig.spawnOffset.y,
  } : building.footprint ? soldierSpawn(building.footprint,variant?.size) : null;
  if (!position) return { gathering, production: context?{...production,remainingSeconds:0,blockedSpawnKey:spawnKey}:production };
  let number = production.nextUnitNumber;
  while (gathering.units.some(unit => unit.id === `unit-${number}`)) number++;
  const common = { owner:'player' as const, id: `unit-${number}`, position, target: { ...position }, selected: false };
  const unit: Unit = building.kind === 'base'
    ? { ...common, kind: 'worker', hp:combatConfig.workerHP, cargo: 0, order: { kind: 'idle' } }
    : { ...common, kind: 'soldier', ...(building.kind==='barracks'&&building.unitType&&building.unitType!=='soldier'?{archetype:building.unitType}:{}), cargo: 0, hp: variant?.hp??combatConfig.soldierHP, order: { kind: 'idle' } };
  return {
    gathering: { ...gathering, units: [...gathering.units, context && production.rally
      ? {...commandMappedMove([{...unit,selected:true}],production.rally,context.map)[0],selected:false} : unit] },
    production: { ...production, blockedSpawnKey:undefined, remainingSeconds: null, nextUnitNumber: number + 1 },
  };
}
