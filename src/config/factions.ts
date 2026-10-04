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
export const factionIds=['crown','clans','elves','dwarves','goblins'] as const;
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
const factionNames={crown:{label:uiText.crownAlliance,unitNames:{worker:uiText.worker,soldier:uiText.guard,archer:uiText.archer,catapult:uiText.catapult,specialist:'Banner Guard'},buildingNames:{base:uiText.keep,barracks:uiText.barracks,farm:uiText.farm,forge:uiText.forge}},clans:{label:uiText.ironClan,unitNames:{worker:uiText.clanWorker,soldier:uiText.axeWarrior,archer:uiText.hunter,catapult:uiText.stoneThrower,specialist:'Raider'},buildingNames:{base:uiText.stronghold,barracks:uiText.warHut,farm:uiText.cattlePen,forge:uiText.smithy}},elves:{label:'Elves',unitNames:{worker:'Grove Tender',soldier:'Warden',archer:'Longbow',catapult:'Ballista',specialist:'Marksman'},buildingNames:{base:'Grove Hall',barracks:'Ranger Lodge',farm:'Garden',forge:'Moon Workshop'}},dwarves:{label:'Dwarves',unitNames:{worker:'Miner',soldier:'Iron Guard',archer:'Crossbow',catapult:'Cannon',specialist:'Bulwark'},buildingNames:{base:'Stone Hold',barracks:'Guard Hall',farm:'Storehouse',forge:'Foundry'}},goblins:{label:'Goblins',unitNames:{worker:'Tinkerer',soldier:'Scrapper',archer:'Slinger',catapult:'Mortar',specialist:'Grenadier'},buildingNames:{base:'Workshop Hall',barracks:'Scrap Yard',farm:'Supply Shack',forge:'Lab'}}};
function defineFaction(id:FactionId):FactionDefinition {
  return {id,...factionNames[id],artPrefix:id==='crown'?'':`${id}-`,naval:{harbor:{...navyConfig.harbor,cost:{...navyConfig.harbor.cost},name:'Harbor'},units:{warship:{...navyConfig.ship,cost:{...navyConfig.ship.cost},id:`${id}:naval:warship`,role:'warship',name:'Warship'},transport:{...navyConfig.ship,...navyConfig.transport,cost:{...navyConfig.transport.cost},id:`${id}:naval:transport`,role:'transport',name:'Transport'}}},roster:['worker','soldier','archer','catapult'],
    units:Object.fromEntries(Object.entries(units).map(([role,data])=>[role,{...data,cost:{...data.cost},id:`${id}:unit:${role}`,faction:id}])) as FactionDefinition['units'],
    buildings:Object.fromEntries(Object.entries(buildings).map(([role,data])=>[role,{...data,cost:{...data.cost},id:`${id}:building:${role}`,faction:id}])) as FactionDefinition['buildings'],
    upgrades:Object.fromEntries(Object.entries(upgrades).map(([role,data])=>[role,{...data,cost:{...data.cost},id:`${id}:upgrade:${role}`,faction:id}])) as FactionDefinition['upgrades'],
  };
}
export const factions:Record<FactionId,FactionDefinition>={crown:defineFaction('crown'),clans:defineFaction('clans'),elves:defineFaction('elves'),dwarves:defineFaction('dwarves'),goblins:defineFaction('goblins')};
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
// RTS-139: armored slow roster, siege and defensive self-buff.
factions.dwarves.roster=['worker','soldier','archer','catapult','specialist'];
factions.dwarves.units.worker={...factions.dwarves.units.worker,cost:{wood:22,gold:0},durationSeconds:6,hp:40,speed:140};
factions.dwarves.units.soldier={...factions.dwarves.units.soldier,cost:{wood:24,gold:5},durationSeconds:6,hp:85,speed:120,damagePerSecond:17};
factions.dwarves.units.archer={...factions.dwarves.units.archer,cost:{wood:24,gold:10},durationSeconds:7,hp:55,speed:115,range:160,aggroRange:200,damage:16,attackInterval:1.2};
factions.dwarves.units.catapult={...factions.dwarves.units.catapult,cost:{wood:45,gold:25},durationSeconds:12,hp:110,speed:60,range:240,aggroRange:280,damage:30,attackInterval:2,hitRadius:16,prerequisites:{buildings:['forge']}};
factions.dwarves.units.specialist={...factions.dwarves.units.specialist,art:'specialist',cost:{wood:45,gold:20},durationSeconds:10,hp:140,speed:100,damagePerSecond:14};
factions.dwarves.buildings.base={...factions.dwarves.buildings.base,hp:300};
factions.dwarves.buildings.barracks={...factions.dwarves.buildings.barracks,cost:{wood:45,gold:0},hp:160};
factions.dwarves.buildings.farm={...factions.dwarves.buildings.farm,cost:{wood:22,gold:0},hp:110};
factions.dwarves.buildings.forge={...factions.dwarves.buildings.forge,cost:{wood:45,gold:15},hp:160};
factions.dwarves.upgrades.attack={...factions.dwarves.upgrades.attack,name:'Forged Shot',cost:{wood:45,gold:15},durationSeconds:10};
factions.dwarves.upgrades.defense={...factions.dwarves.upgrades.defense,name:'Stone Plates',cost:{wood:45,gold:15},durationSeconds:10,multiplier:.65};
factions.dwarves.naval.harbor={...factions.dwarves.naval.harbor,name:'Stone Dock',cost:{wood:45,gold:10},hp:200};
factions.dwarves.naval.units.warship={...factions.dwarves.naval.units.warship,name:'Ironclad',cost:{wood:50,gold:15},durationSeconds:10,hp:120,speed:85};
factions.dwarves.naval.units.transport={...factions.dwarves.naval.units.transport,name:'Heavy Ferry',cost:{wood:45,gold:10},hp:120,speed:85};
// RTS-140: fast production and explosive fragile roster.
factions.goblins.roster=['worker','soldier','archer','catapult','specialist'];
factions.goblins.units.worker={...factions.goblins.units.worker,cost:{wood:18,gold:0},durationSeconds:4,hp:24,speed:180};
factions.goblins.units.soldier={...factions.goblins.units.soldier,cost:{wood:16,gold:4},durationSeconds:4,hp:40,speed:180,damagePerSecond:16};
factions.goblins.units.archer={...factions.goblins.units.archer,cost:{wood:18,gold:8},durationSeconds:5,hp:30,speed:175,range:144,aggroRange:184,damage:10,attackInterval:.8};
factions.goblins.units.catapult={...factions.goblins.units.catapult,cost:{wood:35,gold:25},durationSeconds:8,hp:55,speed:95,range:208,aggroRange:248,damage:26,attackInterval:1.6,hitRadius:16,splashRadius:64,prerequisites:{buildings:['forge']}};
factions.goblins.units.specialist={...factions.goblins.units.specialist,combatMode:'projectile',art:'specialist',cost:{wood:25,gold:25},durationSeconds:7,hp:35,speed:170,range:128,aggroRange:168,damagePerSecond:undefined,damage:20,attackInterval:1.5,projectileSpeed:180,projectileLifetime:3,hitRadius:16,splashRadius:32,prerequisites:{buildings:['forge'],research:{attack:1}}};
factions.goblins.buildings.base={...factions.goblins.buildings.base,hp:200};
factions.goblins.buildings.barracks={...factions.goblins.buildings.barracks,cost:{wood:35,gold:0},hp:90};
factions.goblins.buildings.farm={...factions.goblins.buildings.farm,cost:{wood:18,gold:0},hp:60};
factions.goblins.buildings.forge={...factions.goblins.buildings.forge,cost:{wood:35,gold:15},hp:90};
factions.goblins.upgrades.attack={...factions.goblins.upgrades.attack,name:'Hot Powder',cost:{wood:30,gold:20},durationSeconds:6,multiplier:1.3};
factions.goblins.upgrades.defense={...factions.goblins.upgrades.defense,name:'Scrap Plating',cost:{wood:30,gold:15},durationSeconds:6,multiplier:.85};
factions.goblins.naval.harbor={...factions.goblins.naval.harbor,name:'Junk Dock',cost:{wood:35,gold:10},hp:130};
factions.goblins.naval.units.warship={...factions.goblins.naval.units.warship,name:'Powder Boat',cost:{wood:35,gold:20},durationSeconds:6,hp:65,speed:135};
factions.goblins.naval.units.transport={...factions.goblins.naval.units.transport,name:'Junk Ferry',cost:{wood:35,gold:10},hp:65,speed:135};
export function productionFaction(g:{faction?:FactionId}):FactionDefinition {return factions[g.faction??defaultFactions.player];}

export function factionForTeam(match:{factions?:MatchFactions},team:keyof MatchFactions):FactionDefinition {
  return factions[(match.factions??defaultFactions)[team]];
}

export function factionsForPlayer(player:FactionId,enemy?:FactionId):MatchFactions {return {player,enemy:enemy??(player==='crown'?'clans':'crown')};}
