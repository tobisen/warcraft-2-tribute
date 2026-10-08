import {airMap,isAir} from './domains';
import {unitAvailability} from './productionPrerequisites';
import {productionFaction,type TechnologyState} from '../config/factions';
import type { ProductionJob } from './productionQueue';
import { hasPopulation, type Population } from './population';
import { type ResourceCost } from '../config/economy';
import { canAfford, payCost } from './economy';
import { commandMappedMove } from './navigation';
import { chooseSpawn } from './spawning';
import { gatheringConfig } from '../config/gathering';
import type { WorldMap } from './map';
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
export type ProductionBuilding = { kind: 'base';footprint?:Footprint;ready?:boolean } | { kind: 'barracks'; footprint: Footprint | null; ready?:boolean;bounds?:Pick<WorldMap,'width'|'height'>;technology?:TechnologyState;producer?:'barracks'|'stable'|'academy';unitType?:'soldier'|'archer'|'catapult'|'specialist'|'air'|'cavalry'|'healer';jobCost?:ResourceCost;durationSeconds?:number };
const base: ProductionBuilding = { kind: 'base' };

export function soldierSpawn(footprint: Footprint,size=soldierStats.size,bounds:Pick<WorldMap,'width'|'height'>=worldConfig): Position | null {
  const half = size / 2;
  const offset = half + soldierProductionConfig.spawnGap;
  const candidates = [
    { x: footprint.x + footprint.width + offset, y: footprint.y + footprint.height / 2 },
    { x: footprint.x - offset, y: footprint.y + footprint.height / 2 },
    { x: footprint.x + footprint.width / 2, y: footprint.y + footprint.height + offset },
    { x: footprint.x + footprint.width / 2, y: footprint.y - offset },
  ];
  return candidates.find(p => p.x - half >= 0 && p.y - half >= 0
    && p.x + half <= bounds.width && p.y + half <= bounds.height) ?? null;
}

export function canStartProduction(gathering: GatheringState, production: ProductionState, building: ProductionBuilding = base, population?:Population): boolean {
  const recipe=productionRecipe(gathering,building),cost=recipe.cost;
  return (building.kind==='base'||(building.producer??'barracks')===recipe.trainedAt) && building.ready!==false && unitAvailability(productionFaction(gathering),building.kind==='base'?'worker':building.unitType??'soldier',building.kind==='base'?undefined:building.technology,gathering.campaignContent)===null && (!population || hasPopulation(population,recipe.supply)) && production.remainingSeconds === null && canAfford(gathering,cost)
    && (building.kind === 'base' || (building.footprint !== null && soldierSpawn(building.footprint,recipe.size,building.bounds) !== null));
}

export function startProduction(gathering: GatheringState, production: ProductionState, building: ProductionBuilding = base, population?:Population) {
  if (!canStartProduction(gathering, production, building,population)) return { gathering, production };
  const recipe=productionRecipe(gathering,building),cost=recipe.cost;
  const duration = recipe.durationSeconds;
  return {
    gathering: payCost(gathering,cost),
    production: { ...production, remainingSeconds: duration },
  };
}

export function updateProduction(gathering: GatheringState, production: ProductionState, deltaSeconds: number, building: ProductionBuilding = base, context?: {map:WorldMap;enemies:readonly {id:string;position:Position;kind?:string;role?:string}[]}) {
  if (building.ready===false) return {gathering,production};
  if (production.remainingSeconds === null) return { gathering, production };
  const remainingSeconds = Math.max(0, production.remainingSeconds - Math.max(0, deltaSeconds));
  if (remainingSeconds > 1e-10) return { gathering, production: { ...production, remainingSeconds } };
  const spawnKey=context ? `${context.map.revision}:${building.kind}:`
    + gathering.units.map(u=>`${u.id}:${u.position.x}:${u.position.y}`).join('|')
    + ':'+context.enemies.map(e=>`${e.id}:${e.position.x}:${e.position.y}`).join('|') : undefined;
  if(production.remainingSeconds===0 && production.blockedSpawnKey===spawnKey && context)return {gathering,production};
  const baseSize=gathering.baseSize??gatheringConfig.baseSize;
  const footprint=building.kind==='base'?building.footprint??{x:gathering.base.x-baseSize/2,
    y:gathering.base.y-baseSize/2,width:baseSize,height:baseSize}:building.footprint;
  const recipe=productionRecipe(gathering,building);
  const position = context ? footprint?chooseSpawn(recipe.domain==='air'?airMap(context.map):context.map,footprint,building.kind,gathering.units.filter(u=>isAir(u)===(recipe.domain==='air')),context.enemies.filter(e=>isAir(e)===(recipe.domain==='air')),recipe.size):null
    : building.kind === 'base' ? {
    x: gathering.base.x + productionConfig.spawnOffset.x,
    y: gathering.base.y + productionConfig.spawnOffset.y,
  } : building.footprint ? soldierSpawn(building.footprint,recipe.size,building.bounds) : null;
  if (!position) return { gathering, production: context?{...production,remainingSeconds:0,blockedSpawnKey:spawnKey}:production };
  let number = production.nextUnitNumber;
  while (gathering.units.some(unit => unit.id === `unit-${number}`)) number++;
  const common = { owner:'player' as const, id: `unit-${number}`, position, target: { ...position }, selected: false };
  const unit: Unit = building.kind === 'base'
    ? { ...common, kind: 'worker', hp:recipe.hp, cargo: 0, order: { kind: 'idle' } }
    : { ...common, kind: 'soldier',...(building.kind==='barracks'&&building.unitType==='healer'?{healAutocast:false,autoDisabled:true}:{}), ...(recipe.mana?{mana:recipe.mana.initial}:{}), ...(building.kind==='barracks'&&building.unitType&&building.unitType!=='soldier'?{archetype:building.unitType,...(building.unitType==='specialist'||building.unitType==='air'||building.unitType==='cavalry'||building.unitType==='healer'?{faction:gathering.faction??'crown'}:{})}:{}), cargo: 0, hp:recipe.hp, order: { kind: 'idle' } };
  return {
    gathering: { ...gathering, units: [...gathering.units, context && production.rally
      ? {...commandMappedMove([{...unit,selected:true}],production.rally,context.map)[0],selected:false} : unit] },
    production: { ...production, blockedSpawnKey:undefined, remainingSeconds: null, nextUnitNumber: number + 1 },
  };
}

export function productionRecipe(g:GatheringState,b:ProductionBuilding=base){
 const kind=b.kind==='base'?'worker':b.unitType??'soldier',recipe=productionFaction(g).units[kind];
 return {...recipe,cost:b.kind==='barracks'?b.jobCost??recipe.cost:recipe.cost,durationSeconds:b.kind==='barracks'?b.durationSeconds??recipe.durationSeconds:recipe.durationSeconds};
}
