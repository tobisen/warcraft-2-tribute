import {navyConfig} from './navy';
import {text as uiText} from '../text';
import {unitStats,soldierStats} from './unitDefaults';
import {combatConfig} from './combat';
import {archerConfig} from './archer';
import {catapultConfig} from './catapult';
import {gatheringConfig} from './gathering';
import {costs,type ResourceCost} from './economy';
import {productionConfig,soldierProductionConfig} from './production';
import {barracksConfig,farmConfig,populationConfig} from './buildings';
import {forgeConfig,upgradeConfig} from './upgrades';

// Stable identity is independent of team ownership and presentation.
export const factionIds=['crown','clans'] as const;
export type FactionId=typeof factionIds[number];
export type UnitRole='worker'|'soldier'|'archer'|'catapult'|'specialist';
export type BuildingRole='base'|'barracks'|'farm'|'forge';
export type UpgradeRole='attack'|'defense';
export interface MatchFactions {player:FactionId;enemy:FactionId}
export const defaultFactions:Readonly<MatchFactions>={player:'crown',enemy:'clans'};
export const isFactionId=(value:unknown):value is FactionId=>factionIds.some(id=>id===value);

export interface TechnologyState {buildings:readonly BuildingRole[];research:Partial<Record<UpgradeRole,number>>}
export interface UnitPrerequisites {buildings?:readonly BuildingRole[];research?:Partial<Record<UpgradeRole,number>>}
interface UnitData {
  combatMode?:'melee'|'projectile';
  art?:'worker'|'soldier'|'archer'|'catapult';
  prerequisites?:UnitPrerequisites;
  role:UnitRole;cost:ResourceCost;durationSeconds:number;supply:number;
  trainedAt:'base'|'barracks';hp:number;speed:number;size:number;
  range?:number;aggroRange?:number;damagePerSecond?:number;damage?:number;
  attackInterval?:number;projectileSpeed?:number;projectileLifetime?:number;
  hitRadius?:number;splashRadius?:number;
  capacity?:number;gatherPerSecond?:number;
}
interface BuildingData {
  role:BuildingRole;cost:ResourceCost;hp:number;size:number;placeable:boolean;
  constructionSeconds:number;constructionRange:number;populationCapacity:number;
}
interface UpgradeData {
  name:string;role:UpgradeRole;cost:ResourceCost;durationSeconds:number;maxLevel:number;multiplier:number;
}
export type UnitDefinition=UnitData&{id:`${FactionId}:unit:${UnitRole}`;faction:FactionId};
export type BuildingDefinition=BuildingData&{id:`${FactionId}:building:${BuildingRole}`;faction:FactionId};
export type UpgradeDefinition=UpgradeData&{id:`${FactionId}:upgrade:${UpgradeRole}`;faction:FactionId};
export interface FactionNaval {harbor:typeof navyConfig.harbor&{name:string};units: {warship:typeof navyConfig.ship&{id:string;name:string;role:'warship'};transport:typeof navyConfig.ship&typeof navyConfig.transport&{id:string;name:string;role:'transport'}}}
export interface FactionDefinition {
  id:FactionId;label:string;artPrefix:string;roster:readonly UnitRole[];unitNames:Record<UnitRole,string>;buildingNames:Record<BuildingRole,string>;units:Record<UnitRole,UnitDefinition>;
  naval:FactionNaval;
  buildings:Record<BuildingRole,BuildingDefinition>;upgrades:Record<UpgradeRole,UpgradeDefinition>;
}

// Shared baseline, with the small RTS-068 recipe override below.
const {color:_archerColor,...archerData}=archerConfig;
const {color:_catapultColor,...catapultData}=catapultConfig;
const units={
  worker:{role:'worker',cost:costs.worker,durationSeconds:productionConfig.durationSeconds,
    supply:1,trainedAt:'base',hp:combatConfig.workerHP,speed:unitStats.speed,size:unitStats.size,
    capacity:gatheringConfig.capacity,gatherPerSecond:gatheringConfig.woodPerSecond},
  soldier:{role:'soldier',cost:costs.soldier,durationSeconds:soldierProductionConfig.durationSeconds,
    supply:1,trainedAt:'barracks',hp:combatConfig.soldierHP,speed:soldierStats.speed,size:soldierStats.size,
    range:combatConfig.soldierRange,aggroRange:combatConfig.soldierAggroRange,damagePerSecond:combatConfig.soldierDamagePerSecond},
  archer:{role:'archer',trainedAt:'barracks',...archerData},
  catapult:{role:'catapult',trainedAt:'barracks',...catapultData},
 specialist:{role:'specialist',combatMode:'melee',art:'soldier',trainedAt:'barracks',cost:{wood:30,gold:15},durationSeconds:8,supply:2,hp:100,speed:130,size:24,range:32,aggroRange:140,damagePerSecond:14,prerequisites:{buildings:['forge'],research:{defense:1}}},
} satisfies Record<UnitRole,UnitData>;
const buildings:Record<BuildingRole,BuildingData>={
  base:{role:'base',cost:{wood:0,gold:0},hp:combatConfig.baseHP,size:gatheringConfig.baseSize,
    placeable:false,constructionSeconds:0,constructionRange:0,populationCapacity:populationConfig.baseCap},
  barracks:{role:'barracks',cost:costs.barracks,hp:combatConfig.barracksHP,
    size:barracksConfig.tileSize*barracksConfig.footprintTiles,placeable:true,
    constructionSeconds:barracksConfig.constructionSeconds,constructionRange:barracksConfig.constructionRange,populationCapacity:0},
  farm:{role:'farm',cost:costs.farm,hp:combatConfig.farmHP,size:farmConfig.tileSize*farmConfig.footprintTiles,
    placeable:true,constructionSeconds:farmConfig.constructionSeconds,constructionRange:farmConfig.constructionRange,populationCapacity:farmConfig.supply},
  forge:{role:'forge',cost:costs.forge,hp:forgeConfig.hp,size:forgeConfig.tileSize*forgeConfig.footprintTiles,
    placeable:true,constructionSeconds:forgeConfig.constructionSeconds,constructionRange:forgeConfig.constructionRange,populationCapacity:0},
};
const upgrades:Record<UpgradeRole,UpgradeData>={
  attack:{name:'Attack +25 %',role:'attack',cost:upgradeConfig.cost,durationSeconds:upgradeConfig.durationSeconds,
    maxLevel:upgradeConfig.maxLevel,multiplier:upgradeConfig.attackMultiplier},
  defense:{name:'Defense −25 %',role:'defense',cost:upgradeConfig.cost,durationSeconds:upgradeConfig.durationSeconds,
    maxLevel:upgradeConfig.maxLevel,multiplier:upgradeConfig.defenseMultiplier},
};
const factionNames={crown:{label:uiText.crownAlliance,unitNames:{worker:uiText.worker,soldier:uiText.guard,archer:uiText.archer,catapult:uiText.catapult,specialist:'Banner Guard'},buildingNames:{base:uiText.keep,barracks:uiText.barracks,farm:uiText.farm,forge:uiText.forge}},clans:{label:uiText.ironClan,unitNames:{worker:uiText.clanWorker,soldier:uiText.axeWarrior,archer:uiText.hunter,catapult:uiText.stoneThrower,specialist:'Raider'},buildingNames:{base:uiText.stronghold,barracks:uiText.warHut,farm:uiText.cattlePen,forge:uiText.smithy}}};
function defineFaction(id:FactionId):FactionDefinition {
  return {id,...factionNames[id],artPrefix:id==='clans'?'clans-':'',naval:{harbor:{...navyConfig.harbor,cost:{...navyConfig.harbor.cost},name:'Harbor'},units:{warship:{...navyConfig.ship,cost:{...navyConfig.ship.cost},id:`${id}:naval:warship`,role:'warship',name:'Warship'},transport:{...navyConfig.ship,...navyConfig.transport,cost:{...navyConfig.transport.cost},id:`${id}:naval:transport`,role:'transport',name:'Transport'}}},roster:['worker','soldier','archer','catapult'],
    units:Object.fromEntries(Object.entries(units).map(([role,data])=>[role,{...data,cost:{...data.cost},id:`${id}:unit:${role}`,faction:id}])) as FactionDefinition['units'],
    buildings:Object.fromEntries(Object.entries(buildings).map(([role,data])=>[role,{...data,cost:{...data.cost},id:`${id}:building:${role}`,faction:id}])) as FactionDefinition['buildings'],
    upgrades:Object.fromEntries(Object.entries(upgrades).map(([role,data])=>[role,{...data,cost:{...data.cost},id:`${id}:upgrade:${role}`,faction:id}])) as FactionDefinition['upgrades'],
  };
}
export const factions:Record<FactionId,FactionDefinition>={crown:defineFaction('crown'),clans:defineFaction('clans')};
factions.clans.units.soldier={...factions.clans.units.soldier,hp:66,cost:{wood:18,gold:6},durationSeconds:6};
factions.clans.units.specialist={...factions.clans.units.specialist,cost:{wood:26,gold:12},durationSeconds:7,hp:80,speed:175,damagePerSecond:24,prerequisites:{buildings:['forge'],research:{attack:1}}};
export function productionFaction(g:{faction?:FactionId}):FactionDefinition {return factions[g.faction??defaultFactions.player];}

export function factionForTeam(match:{factions?:MatchFactions},team:keyof MatchFactions):FactionDefinition {
  return factions[(match.factions??defaultFactions)[team]];
}

export function factionsForPlayer(player:FactionId):MatchFactions {return {player,enemy:player==='crown'?'clans':'crown'};}
