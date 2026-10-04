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
export const factionIds=['crown','clans','elves'] as const;
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
  art?:'worker'|'soldier'|'archer'|'catapult'|'specialist';
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
const factionNames={crown:{label:uiText.crownAlliance,unitNames:{worker:uiText.worker,soldier:uiText.guard,archer:uiText.archer,catapult:uiText.catapult,specialist:'Banner Guard'},buildingNames:{base:uiText.keep,barracks:uiText.barracks,farm:uiText.farm,forge:uiText.forge}},clans:{label:uiText.ironClan,unitNames:{worker:uiText.clanWorker,soldier:uiText.axeWarrior,archer:uiText.hunter,catapult:uiText.stoneThrower,specialist:'Raider'},buildingNames:{base:uiText.stronghold,barracks:uiText.warHut,farm:uiText.cattlePen,forge:uiText.smithy}},elves:{label:'Elves',unitNames:{worker:'Grove Tender',soldier:'Warden',archer:'Longbow',catapult:'Ballista',specialist:'Marksman'},buildingNames:{base:'Grove Hall',barracks:'Ranger Lodge',farm:'Garden',forge:'Moon Workshop'}}};
function defineFaction(id:FactionId):FactionDefinition {
  return {id,...factionNames[id],artPrefix:id==='crown'?'':`${id}-`,naval:{harbor:{...navyConfig.harbor,cost:{...navyConfig.harbor.cost},name:'Harbor'},units:{warship:{...navyConfig.ship,cost:{...navyConfig.ship.cost},id:`${id}:naval:warship`,role:'warship',name:'Warship'},transport:{...navyConfig.ship,...navyConfig.transport,cost:{...navyConfig.transport.cost},id:`${id}:naval:transport`,role:'transport',name:'Transport'}}},roster:['worker','soldier','archer','catapult'],
    units:Object.fromEntries(Object.entries(units).map(([role,data])=>[role,{...data,cost:{...data.cost},id:`${id}:unit:${role}`,faction:id}])) as FactionDefinition['units'],
    buildings:Object.fromEntries(Object.entries(buildings).map(([role,data])=>[role,{...data,cost:{...data.cost},id:`${id}:building:${role}`,faction:id}])) as FactionDefinition['buildings'],
    upgrades:Object.fromEntries(Object.entries(upgrades).map(([role,data])=>[role,{...data,cost:{...data.cost},id:`${id}:upgrade:${role}`,faction:id}])) as FactionDefinition['upgrades'],
  };
}
export const factions:Record<FactionId,FactionDefinition>={crown:defineFaction('crown'),clans:defineFaction('clans'),elves:defineFaction('elves')};
factions.clans.units.soldier={...factions.clans.units.soldier,hp:66,cost:{wood:18,gold:6},durationSeconds:6};
factions.clans.units.specialist={...factions.clans.units.specialist,cost:{wood:26,gold:12},durationSeconds:7,hp:80,speed:175,damagePerSecond:24,prerequisites:{buildings:['forge'],research:{attack:1}}};
// RTS-136: completed Human roster, stable crown identity.
factions.crown.label='Humans · Crown Alliance';
factions.crown.roster=['worker','soldier','archer','catapult','specialist'];
factions.crown.units.specialist={...factions.crown.units.specialist,art:'specialist'};
factions.crown.units.catapult={...factions.crown.units.catapult,aggroRange:264,prerequisites:{buildings:['forge']}};
factions.crown.upgrades.attack.name='Tempered Arms';
factions.crown.upgrades.defense.name='Plate Craft';
factions.crown.naval.units.warship.name='Cutter';
// RTS-137: offensive Orc roster with unchanged clans identities.
factions.clans.label='Orcs · Iron Clan';
factions.clans.roster=['worker','soldier','archer','catapult','specialist'];
factions.clans.unitNames.worker='Peon';
factions.clans.units.worker={...factions.clans.units.worker,hp:35,speed:155};
factions.clans.units.soldier={...factions.clans.units.soldier,damagePerSecond:20};
factions.clans.units.archer={...factions.clans.units.archer,hp:45,speed:135,range:144,aggroRange:184,attackInterval:1.1};
factions.clans.units.catapult={...factions.clans.units.catapult,hp:90,speed:75,durationSeconds:11,range:208,aggroRange:248,damage:26,attackInterval:2.1,prerequisites:{buildings:['forge']}};
factions.clans.units.specialist={...factions.clans.units.specialist,art:'specialist'};
factions.clans.buildings.base={...factions.clans.buildings.base,hp:260};
factions.clans.buildings.barracks={...factions.clans.buildings.barracks,hp:130};
factions.clans.buildings.farm={...factions.clans.buildings.farm,hp:90};
factions.clans.buildings.forge={...factions.clans.buildings.forge,hp:130};
factions.clans.upgrades.attack={...factions.clans.upgrades.attack,name:'War Blades',cost:{wood:35,gold:15},multiplier:1.3};
factions.clans.upgrades.defense={...factions.clans.upgrades.defense,name:'Hide Armor',multiplier:.8};
factions.clans.naval.harbor={...factions.clans.naval.harbor,name:'War Dock',hp:170};
factions.clans.naval.units.warship={...factions.clans.naval.units.warship,name:'War Barge',hp:100,speed:105};
factions.clans.naval.units.transport={...factions.clans.naval.units.transport,name:'Raft',hp:100,speed:105};
// RTS-138: mobile woodland faction with ranged specialist and shared systems.
factions.elves.roster=['worker','soldier','archer','catapult','specialist'];
factions.elves.units.worker={...factions.elves.units.worker,hp:28,speed:170};
factions.elves.units.soldier={...factions.elves.units.soldier,cost:{wood:20,gold:6},hp:50,speed:175,damagePerSecond:16};
factions.elves.units.archer={...factions.elves.units.archer,cost:{wood:22,gold:12},hp:45,speed:170,range:192,aggroRange:232,damage:14,attackInterval:.9};
factions.elves.units.catapult={...factions.elves.units.catapult,cost:{wood:45,gold:25},hp:60,speed:100,range:256,aggroRange:296,damage:18,attackInterval:1.8,hitRadius:16,splashRadius:32,prerequisites:{buildings:['forge']}};
factions.elves.units.specialist={...factions.elves.units.specialist,combatMode:'projectile',art:'specialist',cost:{wood:30,gold:20},hp:50,speed:170,range:200,aggroRange:240,damagePerSecond:undefined,damage:16,attackInterval:1,projectileSpeed:300,projectileLifetime:2,hitRadius:16,prerequisites:{buildings:['forge'],research:{attack:1}}};
factions.elves.buildings.base={...factions.elves.buildings.base,hp:220};
factions.elves.buildings.barracks={...factions.elves.buildings.barracks,hp:110};
factions.elves.buildings.farm={...factions.elves.buildings.farm,hp:70};
factions.elves.buildings.forge={...factions.elves.buildings.forge,cost:{wood:45,gold:10},hp:110};
factions.elves.upgrades.attack={...factions.elves.upgrades.attack,name:'True Aim',cost:{wood:40,gold:15},multiplier:1.25};
factions.elves.upgrades.defense={...factions.elves.upgrades.defense,name:'Woven Guard',cost:{wood:35,gold:15},multiplier:.8};
factions.elves.naval.harbor={...factions.elves.naval.harbor,name:'River Dock',hp:140};
factions.elves.naval.units.warship={...factions.elves.naval.units.warship,name:'Swift Sail',cost:{wood:45,gold:15},hp:80,speed:125};
factions.elves.naval.units.transport={...factions.elves.naval.units.transport,name:'Grove Ferry',hp:80,speed:125};
export function productionFaction(g:{faction?:FactionId}):FactionDefinition {return factions[g.faction??defaultFactions.player];}

export function factionForTeam(match:{factions?:MatchFactions},team:keyof MatchFactions):FactionDefinition {
  return factions[(match.factions??defaultFactions)[team]];
}

export function factionsForPlayer(player:FactionId):MatchFactions {return {player,enemy:player==='crown'?'clans':'crown'};}
