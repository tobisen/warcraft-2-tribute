import {forestRectangles} from './forestTerrain';
import {isAir} from './domains';
import {defenseConfig} from '../config/defenses';
import {buildingAvailability} from './productionPrerequisites';
import {productionFaction} from '../config/factions';
import {text as uiText} from '../text';
import {navyConfig} from '../config/navy';
import { forgeConfig } from '../config/upgrades';
import { combatConfig } from '../config/combat';
import { costs } from '../config/economy';
import { canAfford, payCost } from './economy';
import { arenaConfig } from '../config/arena';
import { waveSchedule } from '../config/waves';
import { canReachFootprint } from './approach';
import { bodyFits, overlaps, replaceObstacles, type WorldMap } from './map';
import { spawnCandidates, hasSpawnExit, unitBody, otherBodySize } from './spawning';
import type { Unit } from './gathering';
import { soldierStats, combatUnitStats, unitStats } from '../config/unit';
import { barracksConfig, farmConfig, worldConfig } from '../config/buildings';
import { gatheringConfig } from '../config/gathering';
import {resourceNodes,type GatheringState} from './gathering';
import type { Position } from './movement';

export interface Footprint extends Position {
  width: number;
  height: number;
}
export interface PlacementContext {
  technology?:import('../config/factions').TechnologyState; map: WorldMap; gathering: GatheringState; enemies: readonly import('./spawning').PositionedBody[];
}
export interface ConstructionJob {remainingSeconds:number;builderId:string|null}
export interface Farm {owner?:'player';hp?:number;id:`farm-${number}`;footprint:Footprint;construction:ConstructionJob}
export interface PlacementState {
  defenses?:import('./towers').Defense[];nextDefenseNumber?:number;
  kind?:'harbor'|'barracks'|'farm'|'forge'|'tower'|'wall'|'gate';
  forge?:{id:'forge';owner:'player';hp:number;footprint:Footprint;construction:ConstructionJob};
  farms?:Farm[];
  nextFarmNumber?:number;
  construction?: ConstructionJob;
  active: boolean;
  barracks: Footprint | null;
  barracksOwner?:'player';
  barracksHP?:number;
}

export function buildingFootprint(point: Position,kind:'harbor'|'barracks'|'farm'|'forge'|'tower'|'wall'|'gate'='barracks'): Footprint {
  if(kind==='tower'||kind==='wall'||kind==='gate')return {x:Math.floor(point.x/32)*32,y:Math.floor(point.y/32)*32,width:kind==='gate'?64:32,height:32};
  const config=kind==='harbor'?navyConfig.harbor:kind==='forge'?forgeConfig:kind==='farm'?farmConfig:barracksConfig;
  const size = config.tileSize * config.footprintTiles;
  return {
    x: Math.floor(point.x / config.tileSize) * config.tileSize,
    y: Math.floor(point.y / config.tileSize) * config.tileSize,
    width: size, height: size,
  };
}

export const barracksFootprint = (point:Position):Footprint=>buildingFootprint(point);

export function placementObstacles(state: GatheringState): Footprint[] {
  const baseSize=state.baseSize??gatheringConfig.baseSize;
  return [
    { x: state.base.x - baseSize / 2, y: state.base.y - baseSize / 2,
      width: baseSize, height: baseSize },
    ...resourceNodes(state).flatMap(node=>[...(!node.grove||node.remaining>0?[{x:node.position.x-gatheringConfig.nodeRadius,y:node.position.y-gatheringConfig.nodeRadius,width:gatheringConfig.nodeRadius*2,height:gatheringConfig.nodeRadius*2}]:[]),...forestRectangles(node)]),
  ];
}

export function beginPlacement(state: PlacementState,kind:'harbor'|'barracks'|'farm'|'forge'|'tower'|'wall'|'gate'='barracks'): PlacementState {
  return kind==='forge'&&state.forge || kind==='barracks'&&state.barracks || kind==='farm'&&(state.farms?.length??0)>=farmConfig.maxCount
    ? state : { ...state, active:true,...(kind!=='barracks'?{kind}: {kind:undefined}) };
}

export function cancelPlacement(state: PlacementState): PlacementState {
  return { ...state, active: false };
}

export function placementError(state: PlacementState, point: Position, wood: number, obstacles: Footprint[], context?: PlacementContext): string | null {
  const kind=state.kind??'barracks';
  if(context?.technology){const locked=buildingAvailability(productionFaction(context.gathering),kind==='tower'||kind==='wall'||kind==='gate'?'base':kind,context.technology);if(locked)return locked;}
  if(kind==='harbor')return uiText.harborUsesCoastRules;
  if(kind==='forge'&&state.forge)return uiText.forgeExists;
  if (kind==='barracks'&&state.barracks) return uiText.barracksExists;
  if (kind==='farm'&&(state.farms?.length??0)>=farmConfig.maxCount) return uiText.farmLimit;
  const rect = buildingFootprint(point,kind);
  if (rect.x < 0 || rect.y < 0 || rect.x + rect.width > (context?.map.width??worldConfig.width) || rect.y + rect.height > (context?.map.height??worldConfig.height)) {
    return uiText.outsideTheWorld;
  }
  if (obstacles.some(other => rect.x < other.x + other.width && rect.x + rect.width > other.x
    && rect.y < other.y + other.height && rect.y + rect.height > other.y)) {
    return uiText.overlapsTheBaseOrAResourceNode;
  }
  if (!canAfford({wood,goldBalance:context?.gathering.goldBalance},(kind==='tower'||kind==='wall'||kind==='gate'?defenseConfig[kind].cost:context?productionFaction(context.gathering).buildings[kind].cost:costs[kind]))) return uiText.notEnoughWoodOrGold;
  if (context) {
    if([...context.map.obstacles,...(context.map.enemyPassageBlocks??[])].some(o=>overlaps(rect,o)))return uiText.overlapsTerrainOrABuilding;
    if(context.gathering.units.some(u=>!isAir(u)&&overlaps(rect,unitBody(u.position,u.kind==='worker'?unitStats.size:combatUnitStats(u).size)))
      || context.enemies.some(e=>!isAir(e)&&overlaps(rect,unitBody(e.position,otherBodySize(e)))))return uiText.overlapsAUnit;
    const after=replaceObstacles(context.map,[...context.map.obstacles,rect]);
    const [base]=placementObstacles(context.gathering);const nodes=resourceNodes(context.gathering).map(node=>({x:node.position.x-20,y:node.position.y-20,width:40,height:40}));
    for(const worker of context.gathering.units.filter((u):u is Extract<Unit,{kind:'worker'}>=>u.kind==='worker')) {
      for(const [target,range] of [[base,gatheringConfig.deliveryRange],
        ...nodes.flatMap((node,i)=>resourceNodes(context.gathering)[i].remaining>0?[[node,gatheringConfig.range] as const]:[])] as const) {
        if(canReachFootprint(context.map,worker.position,target,range)
          && !canReachFootprint(after,worker.position,target,range))return uiText.blocksAWorkerRouteToTheBaseOr;
      }
    }
    const sites=[...(state.forge&&state.forge.construction.remainingSeconds>0?[{footprint:state.forge.footprint,job:state.forge.construction}]:[]),...(state.barracks&&state.construction&&state.construction.remainingSeconds>0
      ? [{footprint:state.barracks,job:state.construction}]:[]),
      ...(state.farms??[]).filter(f=>f.construction.remainingSeconds>0).map(f=>({footprint:f.footprint,job:f.construction}))];
    for(const site of sites) {
      const builder=context.gathering.units.find(u=>u.id===site.job.builderId&&u.kind==='worker');
      if(builder && canReachFootprint(context.map,builder.position,site.footprint,barracksConfig.constructionRange)
        && !canReachFootprint(after,builder.position,site.footprint,barracksConfig.constructionRange))return uiText.blocksTheBuilderRoute;
    }
    const exit=(map:WorldMap,foot:Footprint,kind:'base'|'barracks')=>spawnCandidates(map,foot,kind).some(p=>hasSpawnExit(map,p));
    if(exit(context.map,base,'base') && !exit(after,base,'base') || kind==='barracks' && !exit(after,rect,'barracks')
      || state.barracks && exit(context.map,state.barracks,'barracks') && !exit(after,state.barracks,'barracks'))return uiText.blocksAProductionExit;
    for(let i=0;i<Math.max(...waveSchedule.map(w=>w.count));i++) {
      const entry={x:arenaConfig.enemyEntry.x,y:arenaConfig.enemyEntry.y+i*arenaConfig.enemyEntry.spacing};
      if(bodyFits(context.map,entry,12) && canReachFootprint(context.map,entry,base,32)
        && (!bodyFits(after,entry,12) || !canReachFootprint(after,entry,base,32)))return uiText.blocksTheEnemyWaveRouteToTheBase;
    }
  }
  if (context) {
    const builder=context.gathering.units.filter(u=>u.kind==='worker' && u.selected)
      .sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}))[0];
    if (!builder) return uiText.selectAWorkerToBuild;
    const after=replaceObstacles(context.map,[...context.map.obstacles,rect]);
    if (!canReachFootprint(after,builder.position,rect,barracksConfig.constructionRange)) return uiText.theBuildingSiteCannotBeReached;
  }
  return null;
}

export function placeBuilding(state: PlacementState, point: Position, wood: number, obstacles: Footprint[], context?: PlacementContext):
  {placement:PlacementState;wood:number;map?:WorldMap;gathering?:GatheringState} {
  if (state.kind==='harbor'||state.kind==='tower'||state.kind==='wall'||state.kind==='gate'||!state.active || placementError(state, point, wood, obstacles, context)) return { placement: state, wood, ...(context?{map:context.map}:{}) };
  const kind=state.kind??'barracks';
  const rect=buildingFootprint(point,kind);
  const id: 'barracks'|'forge'|`farm-${number}` = kind==='forge'?'forge':kind==='barracks'?'barracks':`farm-${state.nextFarmNumber??1}`;
  const builder=context?.gathering.units.filter(u=>u.kind==='worker'&&u.selected)
    .sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}))[0];
  const recipe=productionFaction(context?.gathering??{}).buildings[kind];
  const paid=payCost({...context?.gathering,wood},recipe.cost);
  return {
    placement: kind==='forge'?{...state,active:false,kind:undefined,forge:{id:'forge',owner:'player',hp:recipe.hp,footprint:rect,construction:{remainingSeconds:recipe.constructionSeconds,builderId:builder?.id??null}}}:kind==='barracks'
      ? {...state,active:false,kind:undefined,barracks:rect,barracksOwner:'player',barracksHP:recipe.hp,...(builder?{construction:{remainingSeconds:recipe.constructionSeconds,builderId:builder.id}}:{})}
      : {...state,active:false,kind:undefined,nextFarmNumber:(state.nextFarmNumber??1)+1,
        farms:[...(state.farms??[]),{owner:'player',hp:recipe.hp,id:id as `farm-${number}`,footprint:rect,construction:{remainingSeconds:recipe.constructionSeconds,builderId:builder?.id??null}}]},
    wood:paid.wood,
    ...(context && builder ? {map:replaceObstacles(context.map,[...context.map.obstacles,rect]),
      gathering:{...payCost({...context.gathering,wood},recipe.cost),units:context.gathering.units.map((u):Unit=>
        u.id===builder.id&&u.kind==='worker'?{...u,commandMode:undefined,orderQueue:undefined,navigation:undefined,order:{kind:'build',buildingId:id}}:u)}}:{}),
  };
}

export const placeBarracks = placeBuilding;
