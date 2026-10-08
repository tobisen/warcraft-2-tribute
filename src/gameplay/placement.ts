import {contentReason} from '../config/campaignContent';
import {academyConfig} from '../config/upgrades';
import {extraBaseConfig} from '../config/extraBases';
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
import { barracksConfig, farmConfig, farmLimit, worldConfig } from '../config/buildings';
import { gatheringConfig } from '../config/gathering';
import {nodeRadius,resourceNodes,type GatheringState} from './gathering';
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
export interface ExtraBase {id:`base-${number}`;owner:'player';hp:number;footprint:Footprint;construction:ConstructionJob;production:import('./production').ProductionState}
export type ProducerKind='barracks'|'stable'|'academy'|'aviary'|'siegeWorks'|'harbor';
export type ProducerId=`producer-${number}`;
export interface ExtraProducer {id:ProducerId;kind:ProducerKind;owner:'player';hp:number;footprint:Footprint;construction:ConstructionJob;production:import('./production').ProductionState}
export interface PlacementState {
  producers?:ExtraProducer[];nextProducerNumber?:number;
  bases?:ExtraBase[];nextBaseNumber?:number;
  defenses?:import('./towers').Defense[];nextDefenseNumber?:number;
  kind?:'siegeWorks'|'aviary'|'stable'|'academy'|'base'|'harbor'|'barracks'|'farm'|'forge'|'tower'|'wall'|'gate';
  siegeWorks?:{id:'siegeWorks';owner:'player';hp:number;footprint:Footprint;construction:ConstructionJob;production:import('./production').ProductionState};
  aviary?:{id:'aviary';owner:'player';hp:number;footprint:Footprint;construction:ConstructionJob;production:import('./production').ProductionState};
  stable?:{id:'stable';owner:'player';hp:number;footprint:Footprint;construction:ConstructionJob;production:import('./production').ProductionState};
  academy?:{id:'academy';owner:'player';hp:number;footprint:Footprint;construction:ConstructionJob;production?:import('./production').ProductionState};
  forge?:{id:'forge';owner:'player';hp:number;footprint:Footprint;construction:ConstructionJob};
  farms?:Farm[];
  nextFarmNumber?:number;
  construction?: ConstructionJob;
  active: boolean;
  barracks: Footprint | null;
  barracksOwner?:'player';
  barracksHP?:number;
}

export function buildingFootprint(point: Position,kind:'siegeWorks'|'aviary'|'stable'|'academy'|'base'|'harbor'|'barracks'|'farm'|'forge'|'tower'|'wall'|'gate'='barracks'): Footprint {
  if(kind==='tower'||kind==='wall'||kind==='gate')return {x:Math.floor(point.x/32)*32,y:Math.floor(point.y/32)*32,width:defenseConfig[kind].size,height:32};
  const config=kind==='siegeWorks'||kind==='aviary'||kind==='academy'||kind==='stable'?academyConfig:kind==='base'?extraBaseConfig:kind==='harbor'?navyConfig.harbor:kind==='forge'?forgeConfig:kind==='farm'?farmConfig:barracksConfig;
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
    ...resourceNodes(state).flatMap(node=>[...(!(node.grove||node.tree)||node.remaining>0?[{x:node.position.x-nodeRadius(node),y:node.position.y-nodeRadius(node),width:nodeRadius(node)*2,height:nodeRadius(node)*2}]:[]),...forestRectangles(node)]),
  ];
}

export function beginPlacement(state: PlacementState,kind:'siegeWorks'|'aviary'|'stable'|'academy'|'base'|'harbor'|'barracks'|'farm'|'forge'|'tower'|'wall'|'gate'='barracks',world:{width:number;height:number}=worldConfig): PlacementState {
  return kind==='base'&&(state.bases?.length??0)>=extraBaseConfig.maxCount || kind==='forge'&&state.forge || kind==='farm'&&(state.farms?.length??0)>=farmLimit(world)
    ? state : { ...state, active:true,...(kind!=='barracks'?{kind}: {kind:undefined}) };
}

export function cancelPlacement(state: PlacementState): PlacementState {
  return { ...state, active: false };
}

const candidateMaps=new WeakMap<WorldMap,{obstacles:WorldMap['obstacles'];length:number;revision:number;rect:Footprint;map:WorldMap}>();
/** Share one proposed terrain snapshot across placement and fortification checks. */
export function placementMap(map:WorldMap,rect:Footprint):WorldMap{
 const cached=candidateMaps.get(map);
 if(cached&&cached.obstacles===map.obstacles&&cached.length===map.obstacles.length&&cached.revision===map.revision&&cached.map.width===map.width&&cached.map.height===map.height&&cached.map.tileSize===map.tileSize&&cached.map.bodyHalf===map.bodyHalf&&cached.map.interactionTarget===map.interactionTarget&&cached.map.enemyPassageBlocks===map.enemyPassageBlocks&&cached.map.ignoreAttackOcclusion===map.ignoreAttackOcclusion&&cached.rect.x===rect.x&&cached.rect.y===rect.y&&cached.rect.width===rect.width&&cached.rect.height===rect.height)return cached.map;
 const proposed=replaceObstacles(map,[...map.obstacles,rect]);
 candidateMaps.set(map,{obstacles:map.obstacles,length:map.obstacles.length,revision:map.revision,rect:{...rect},map:proposed});return proposed;
}

function checkPlacement(state: PlacementState, point: Position, wood: number, obstacles: Footprint[], context?: PlacementContext, preview=false): string | null {
  const kind=state.kind??'barracks';
  const locked=contentReason(context?.gathering.campaignContent,'buildings',kind);if(locked)return locked;
  if(context?.technology){const locked=buildingAvailability(productionFaction(context.gathering),kind==='tower'||kind==='wall'||kind==='gate'?'base':kind,context.technology);if(locked)return locked;}
  if(kind==='base'&&(state.bases?.length??0)>=extraBaseConfig.maxCount)return 'Maximum three main buildings';
  if(kind==='harbor')return uiText.harborUsesCoastRules;
  if(kind==='forge'&&state.forge)return uiText.forgeExists;
  if (kind==='farm'&&(state.farms?.length??0)>=farmLimit(context?.map)) return uiText.farmLimit;
  const rect = buildingFootprint(point,kind);
  if (rect.x < 0 || rect.y < 0 || rect.x + rect.width > (context?.map.width??worldConfig.width) || rect.y + rect.height > (context?.map.height??worldConfig.height)) {
    return uiText.outsideTheWorld;
  }
  if (obstacles.some(other => rect.x < other.x + other.width && rect.x + rect.width > other.x
    && rect.y < other.y + other.height && rect.y + rect.height > other.y)) {
    return uiText.overlapsTheBaseOrAResourceNode;
  }
  if (!canAfford({wood,goldBalance:context?.gathering.goldBalance},(kind==='base'?extraBaseConfig.cost:kind==='tower'||kind==='wall'||kind==='gate'?defenseConfig[kind].cost:context?productionFaction(context.gathering).buildings[kind].cost:kind==='academy'?academyConfig.cost:kind==='siegeWorks'?{wood:90,gold:50}:kind==='aviary'?{wood:80,gold:40}:kind==='stable'?{wood:70,gold:30}:costs[kind]))) return uiText.notEnoughWoodOrGold;
  if (context) {
    if([...context.map.obstacles,...(context.map.enemyPassageBlocks??[])].some(o=>overlaps(rect,o)))return uiText.overlapsTerrainOrABuilding;
    if(context.gathering.units.some(u=>!isAir(u)&&overlaps(rect,unitBody(u.position,u.kind==='worker'?unitStats.size:combatUnitStats(u).size)))
      || context.enemies.some(e=>!isAir(e)&&overlaps(rect,unitBody(e.position,otherBodySize(e)))))return uiText.overlapsAUnit;
    if(preview)return context.gathering.units.some(u=>u.kind==='worker'&&u.selected)?null:uiText.selectAWorkerToBuild;
    const after=placementMap(context.map,rect);
    const [base]=placementObstacles(context.gathering);
    for(const worker of context.gathering.units.filter((u):u is Extract<Unit,{kind:'worker'}>=>u.kind==='worker')) {
      const nodes=workerResourceTargets(context.gathering,worker);
      for(const [target,range] of [...(context.gathering.primaryDropoff===false?[]:[[base,gatheringConfig.deliveryRange] as const]),...(state.bases??[]).filter(b=>b.hp>0&&b.construction.remainingSeconds===0).map(b=>[b.footprint,gatheringConfig.deliveryRange] as const),...nodes.map(node=>[{x:node.position.x-nodeRadius(node),y:node.position.y-nodeRadius(node),width:nodeRadius(node)*2,height:nodeRadius(node)*2},gatheringConfig.range] as const)] as const) {
        if(canReachFootprint(context.map,worker.position,target,range)
          && !canReachFootprint(after,worker.position,target,range))return uiText.blocksAWorkerRouteToTheBaseOr;
      }
    }
    const sites=[...(state.siegeWorks&&state.siegeWorks.construction.remainingSeconds>0?[{footprint:state.siegeWorks.footprint,job:state.siegeWorks.construction}]:[]),...(state.aviary&&state.aviary.construction.remainingSeconds>0?[{footprint:state.aviary.footprint,job:state.aviary.construction}]:[]),...(state.stable&&state.stable.construction.remainingSeconds>0?[{footprint:state.stable.footprint,job:state.stable.construction}]:[]),...(state.academy&&state.academy.construction.remainingSeconds>0?[{footprint:state.academy.footprint,job:state.academy.construction}]:[]),...(state.bases??[]).filter(b=>b.construction.remainingSeconds>0).map(b=>({footprint:b.footprint,job:b.construction})),...(state.forge&&state.forge.construction.remainingSeconds>0?[{footprint:state.forge.footprint,job:state.forge.construction}]:[]),...(state.barracks&&state.construction&&state.construction.remainingSeconds>0
      ? [{footprint:state.barracks,job:state.construction}]:[]),
      ...(state.farms??[]).filter(f=>f.construction.remainingSeconds>0).map(f=>({footprint:f.footprint,job:f.construction}))];
    for(const site of sites) {
      const builder=context.gathering.units.find(u=>u.id===site.job.builderId&&u.kind==='worker');
      if(builder && canReachFootprint(context.map,builder.position,site.footprint,barracksConfig.constructionRange)
        && !canReachFootprint(after,builder.position,site.footprint,barracksConfig.constructionRange))return uiText.blocksTheBuilderRoute;
    }
    const exit=(map:WorldMap,foot:Footprint,kind:'base'|'barracks')=>spawnCandidates(map,foot,kind).some(p=>hasSpawnExit(map,p));
    if((state.producers??[]).some(b=>b.kind!=='harbor'&&exit(context.map,b.footprint,'barracks')&&!exit(after,b.footprint,'barracks')))return uiText.blocksAProductionExit;
    if(state.siegeWorks&&exit(context.map,state.siegeWorks.footprint,'barracks')&&!exit(after,state.siegeWorks.footprint,'barracks')||kind==='siegeWorks'&&!exit(after,rect,'barracks'))return uiText.blocksAProductionExit;
    if(state.stable&&exit(context.map,state.stable.footprint,'barracks')&&!exit(after,state.stable.footprint,'barracks')||kind==='stable'&&!exit(after,rect,'barracks'))return uiText.blocksAProductionExit;
    if((state.bases??[]).some(b=>exit(context.map,b.footprint,'base')&&!exit(after,b.footprint,'base'))||kind==='base'&&!exit(after,rect,'base'))return uiText.blocksAProductionExit;
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
    const after=placementMap(context.map,rect);
    if (!canReachFootprint(after,builder.position,rect,barracksConfig.constructionRange)) return uiText.theBuildingSiteCannotBeReached;
  }
  return null;
}

export function placementError(state:PlacementState,point:Position,wood:number,obstacles:Footprint[],context?:PlacementContext):string|null{return checkPlacement(state,point,wood,obstacles,context);}
/** Geometry/stock preview only; placementError remains the mandatory admission check. */
export function placementPreviewError(state:PlacementState,point:Position,wood:number,obstacles:Footprint[],context?:PlacementContext):string|null{return checkPlacement(state,point,wood,obstacles,context,true);}

export function placeBuilding(state: PlacementState, point: Position, wood: number, obstacles: Footprint[], context?: PlacementContext):
  {placement:PlacementState;wood:number;map?:WorldMap;gathering?:GatheringState} {
  const producerKind=state.kind??'barracks';
  if(!context&&['barracks','stable','academy','aviary','siegeWorks'].includes(producerKind)&&(producerKind==='barracks'?state.barracks:state[producerKind as 'stable']))return {placement:state,wood};
  if(state.active&&context&&['barracks','stable','academy','aviary','siegeWorks'].includes(producerKind)&&(producerKind==='barracks'?state.barracks:state[producerKind as 'stable'])){
    const kind=producerKind as Exclude<ProducerKind,'harbor'>,number=state.nextProducerNumber??1,id=`producer-${number}` as const;
    const temporary=kind==='barracks'?{...state,barracks:null,construction:undefined,barracksHP:undefined}:{...state,[kind]:undefined};
    const result=placeBuilding(temporary,point,wood,obstacles,context);
    if(!result.gathering||result.wood===wood)return {...result,placement:state};
    const built=kind==='barracks'?{hp:result.placement.barracksHP!,footprint:result.placement.barracks!,construction:result.placement.construction!}:result.placement[kind]!;
    const site:ExtraProducer={...built,id,kind,owner:'player',production:{remainingSeconds:null,queue:[],nextUnitNumber:Math.max(4,...result.gathering.units.map(u=>Number(u.id.slice(5))+1))}};
    return {...result,placement:{...state,active:false,kind:undefined,nextProducerNumber:number+1,producers:[...(state.producers??[]),site]},gathering:{...result.gathering,units:result.gathering.units.map(u=>u.kind==='worker'&&u.order.kind==='build'&&u.order.buildingId===kind&&u.id===site.construction.builderId?{...u,order:{kind:'build',buildingId:id}}:u)}};
  }
  if (state.kind==='harbor'||state.kind==='tower'||state.kind==='wall'||state.kind==='gate'||!state.active || placementError(state, point, wood, obstacles, context)) return { placement: state, wood, ...(context?{map:context.map}:{}) };
  const kind=state.kind??'barracks';
  const rect=buildingFootprint(point,kind);
  const id: `base-${number}`|'siegeWorks'|'aviary'|'stable'|'academy'|'barracks'|'forge'|`farm-${number}` = kind==='siegeWorks'?'siegeWorks':kind==='aviary'?'aviary':kind==='stable'?'stable':kind==='academy'?'academy':kind==='base'?`base-${state.nextBaseNumber??1}`:kind==='forge'?'forge':kind==='barracks'?'barracks':`farm-${state.nextFarmNumber??1}`;
  const builder=context?.gathering.units.filter(u=>u.kind==='worker'&&u.selected)
    .sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}))[0];
  const factionRecipe=productionFaction(context?.gathering??{}).buildings[kind];
  const recipe=kind==='base'?{...factionRecipe,cost:extraBaseConfig.cost,constructionSeconds:extraBaseConfig.constructionSeconds}:factionRecipe;
  const paid=payCost({...context?.gathering,wood},recipe.cost);
  return {
    placement: kind==='siegeWorks'?{...state,active:false,kind:undefined,siegeWorks:{id:'siegeWorks',owner:'player',hp:recipe.hp,footprint:rect,production:{remainingSeconds:null,queue:[],nextUnitNumber:Math.max(4,...(context?.gathering.units??[]).map(u=>Number(u.id.slice(5))+1))},construction:{remainingSeconds:recipe.constructionSeconds,builderId:builder?.id??null}}}:kind==='aviary'?{...state,active:false,kind:undefined,aviary:{id:'aviary',owner:'player',hp:recipe.hp,footprint:rect,production:{remainingSeconds:null,queue:[],nextUnitNumber:Math.max(4,...(context?.gathering.units??[]).map(u=>Number(u.id.slice(5))+1))},construction:{remainingSeconds:recipe.constructionSeconds,builderId:builder?.id??null}}}:kind==='stable'?{...state,active:false,kind:undefined,stable:{id:'stable',owner:'player',hp:recipe.hp,footprint:rect,production:{remainingSeconds:null,queue:[],nextUnitNumber:Math.max(4,...(context?.gathering.units??[]).map(u=>Number(u.id.slice(5))+1))},construction:{remainingSeconds:recipe.constructionSeconds,builderId:builder?.id??null}}}:kind==='academy'?{...state,active:false,kind:undefined,academy:{id:'academy',owner:'player',hp:recipe.hp,footprint:rect,construction:{remainingSeconds:recipe.constructionSeconds,builderId:builder?.id??null}}}:kind==='base'?{...state,active:false,kind:undefined,nextBaseNumber:(state.nextBaseNumber??1)+1,bases:[...(state.bases??[]),{id:id as `base-${number}`,owner:'player',hp:recipe.hp,footprint:rect,construction:{remainingSeconds:recipe.constructionSeconds,builderId:builder?.id??null},production:{remainingSeconds:null,queue:[],nextJobNumber:1,nextUnitNumber:Math.max(4,...(context?.gathering.units??[]).map(u=>Number(u.id.slice(5))+1))}}]}:kind==='forge'?{...state,active:false,kind:undefined,forge:{id:'forge',owner:'player',hp:recipe.hp,footprint:rect,construction:{remainingSeconds:recipe.constructionSeconds,builderId:builder?.id??null}}}:kind==='barracks'
      ? {...state,active:false,kind:undefined,barracks:rect,barracksOwner:'player',barracksHP:recipe.hp,...(builder?{construction:{remainingSeconds:recipe.constructionSeconds,builderId:builder.id}}:{})}
      : {...state,active:false,kind:undefined,nextFarmNumber:(state.nextFarmNumber??1)+1,
        farms:[...(state.farms??[]),{owner:'player',hp:recipe.hp,id:id as `farm-${number}`,footprint:rect,construction:{remainingSeconds:recipe.constructionSeconds,builderId:builder?.id??null}}]},
    wood:paid.wood,
    ...(context && builder ? {map:placementMap(context.map,rect),
      gathering:{...payCost({...context.gathering,wood},recipe.cost),units:context.gathering.units.map((u):Unit=>
        u.id===builder.id&&u.kind==='worker'?{...u,commandMode:undefined,orderQueue:undefined,navigation:undefined,order:{kind:'build',buildingId:id}}:u)}}:{}),
  };
}

export const placeBarracks = placeBuilding;

/** Actual Match maps already carry resource bodies; standalone work fixtures add only missing bodies. */
const verifiedWorkMaps=new WeakMap<Footprint[],Map<string,{length:number;revision:number;nodes:{x:number;y:number;radius:number;alive:boolean}[]}>>();
export function resourceWorkMap(map:WorldMap,state:GatheringState):WorldMap {
 const nodes=resourceNodes(state),baseKey=`${state.primaryDropoff}:${state.base.x}:${state.base.y}:${state.baseSize??gatheringConfig.baseSize}`;
 let cache=verifiedWorkMaps.get(map.obstacles);const entry=cache?.get(baseKey),verified=entry?.nodes;
 const simple=!nodes.some(n=>n.grove);
 if(simple&&entry?.length===map.obstacles.length&&entry.revision===map.revision&&verified?.length===nodes.length&&nodes.every((n,i)=>verified[i].x===n.position.x&&verified[i].y===n.position.y&&verified[i].radius===nodeRadius(n)&&verified[i].alive===(!n.tree||n.remaining>0)))return map;
 const bodies=placementObstacles(state).slice(state.primaryDropoff===false?1:0),keys=new Set(map.obstacles.map(o=>`${o.x},${o.y},${o.width},${o.height}`));
 const missing=bodies.filter(o=>!keys.has(`${o.x},${o.y},${o.width},${o.height}`));
 if(!missing.length&&simple){if(!cache){cache=new Map();verifiedWorkMaps.set(map.obstacles,cache);}cache.set(baseKey,{length:map.obstacles.length,revision:map.revision,nodes:nodes.map(n=>({x:n.position.x,y:n.position.y,radius:nodeRadius(n),alive:!n.tree||n.remaining>0}))});}
 return missing.length?{...map,obstacles:[...map.obstacles,...missing]}:map;
}

/** Current/queued jobs and the local economy share one admission policy for land and harbor placement. */
export function workerResourceTargets(state:GatheringState,worker:Extract<Unit,{kind:'worker'}>):import('./gathering').ResourceNode[]{
 const nodeId=worker.order.kind==='gather'||worker.order.kind==='deliver'?worker.order.nodeId:undefined;
 return resourceNodes(state).filter((node,i)=>node.remaining>0&&(i<2||node.id===nodeId||worker.orderQueue?.some(o=>o.kind==='gather'&&o.nodeId===node.id)||Math.hypot(node.position.x-worker.position.x,node.position.y-worker.position.y)<=384));
}
