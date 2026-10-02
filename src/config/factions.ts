import {unitStats,soldierStats} from './unit';
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
export type UnitRole='worker'|'soldier'|'archer'|'catapult';
export type BuildingRole='base'|'barracks'|'farm'|'forge';
export type UpgradeRole='attack'|'defense';
export interface MatchFactions {player:FactionId;enemy:FactionId}
export const defaultFactions:Readonly<MatchFactions>={player:'crown',enemy:'clans'};
export const isFactionId=(value:unknown):value is FactionId=>factionIds.some(id=>id===value);

interface UnitData {
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
  role:UpgradeRole;cost:ResourceCost;durationSeconds:number;maxLevel:number;multiplier:number;
}
export type UnitDefinition=UnitData&{id:`${FactionId}:unit:${UnitRole}`;faction:FactionId};
export type BuildingDefinition=BuildingData&{id:`${FactionId}:building:${BuildingRole}`;faction:FactionId};
export type UpgradeDefinition=UpgradeData&{id:`${FactionId}:upgrade:${UpgradeRole}`;faction:FactionId};
export interface FactionDefinition {
  id:FactionId;label:string;unitNames:Record<UnitRole,string>;buildingNames:Record<BuildingRole,string>;units:Record<UnitRole,UnitDefinition>;
  buildings:Record<BuildingRole,BuildingDefinition>;upgrades:Record<UpgradeRole,UpgradeDefinition>;
}

// Baseline comes from existing config; this task introduces identity, not new balance.
const {color:_archerColor,...archerData}=archerConfig;
const {color:_catapultColor,...catapultData}=catapultConfig;
const units:Record<UnitRole,UnitData>={
  worker:{role:'worker',cost:costs.worker,durationSeconds:productionConfig.durationSeconds,
    supply:1,trainedAt:'base',hp:combatConfig.workerHP,speed:unitStats.speed,size:unitStats.size,
    capacity:gatheringConfig.capacity,gatherPerSecond:gatheringConfig.woodPerSecond},
  soldier:{role:'soldier',cost:costs.soldier,durationSeconds:soldierProductionConfig.durationSeconds,
    supply:1,trainedAt:'barracks',hp:combatConfig.soldierHP,speed:soldierStats.speed,size:soldierStats.size,
    range:combatConfig.soldierRange,aggroRange:combatConfig.soldierAggroRange,damagePerSecond:combatConfig.soldierDamagePerSecond},
  archer:{role:'archer',trainedAt:'barracks',...archerData},
  catapult:{role:'catapult',trainedAt:'barracks',...catapultData},
};
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
  attack:{role:'attack',cost:upgradeConfig.cost,durationSeconds:upgradeConfig.durationSeconds,
    maxLevel:upgradeConfig.maxLevel,multiplier:upgradeConfig.attackMultiplier},
  defense:{role:'defense',cost:upgradeConfig.cost,durationSeconds:upgradeConfig.durationSeconds,
    maxLevel:upgradeConfig.maxLevel,multiplier:upgradeConfig.defenseMultiplier},
};
const factionNames={crown:{label:'Kronförbundet',unitNames:{worker:'Arbetare',soldier:'Soldat',archer:'Bågskytt',catapult:'Katapult'},buildingNames:{base:'Borg',barracks:'Kasern',farm:'Gård',forge:'Smedja'}},clans:{label:'Järnklanen',unitNames:{worker:'Klansarbetare',soldier:'Yxkrigare',archer:'Jägare',catapult:'Stenkastare'},buildingNames:{base:'Fäste',barracks:'Krigshydda',farm:'Boskapshägn',forge:'Ässja'}}};
function defineFaction(id:FactionId):FactionDefinition {
  return {id,...factionNames[id],
    units:Object.fromEntries(Object.entries(units).map(([role,data])=>[role,{...data,cost:{...data.cost},id:`${id}:unit:${role}`,faction:id}])) as FactionDefinition['units'],
    buildings:Object.fromEntries(Object.entries(buildings).map(([role,data])=>[role,{...data,cost:{...data.cost},id:`${id}:building:${role}`,faction:id}])) as FactionDefinition['buildings'],
    upgrades:Object.fromEntries(Object.entries(upgrades).map(([role,data])=>[role,{...data,cost:{...data.cost},id:`${id}:upgrade:${role}`,faction:id}])) as FactionDefinition['upgrades'],
  };
}
export const factions:Record<FactionId,FactionDefinition>={crown:defineFaction('crown'),clans:defineFaction('clans')};
export function factionForTeam(match:{factions?:MatchFactions},team:keyof MatchFactions):FactionDefinition {
  return factions[(match.factions??defaultFactions)[team]];
}

export function factionsForPlayer(player:FactionId):MatchFactions {return {player,enemy:player==='crown'?'clans':'crown'};}
