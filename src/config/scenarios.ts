import {text as uiText} from '../text';
import type {MapId} from './maps';
import {difficultyProfiles,type Difficulty} from './difficulty';
export type MatchScenario='tutorial'|'survival'|'skirmish'|'siege-test'|'mission-waves'|'mission-base'|'mission-outpost'|'mission-sea'|'mission-escort'|'mission-rescue'|'mission-capture';
export const enemyBaseConfig={id:'enemy-base',hp:240,footprint:{x:960,y:96,width:96,height:96}};
interface ScenarioDefinition {enemyBase:boolean;waves:boolean;victory:'tutorial'|'waves'|'enemy-base'|'timer'|'operation';label:string;instruction:string;map:MapId;initial:{wood:number;gold:number};holdSeconds?:number;waveSchedule?:readonly {atSeconds:number;count:number}[]}
export const scenarioConfig:Record<MatchScenario,ScenarioDefinition>={
 tutorial:{enemyBase:false,waves:false,victory:'tutorial',label:'Tutorial – First Steps',instruction:'Learn selection, movement, gathering, building, production and manual attack. No enemy pressure while preparing.',map:'arena',initial:{wood:40,gold:10}},
 survival:{enemyBase:false,waves:true,victory:'waves',label:'Wave-survival',instruction:uiText.gatherWoodAndGoldBuildBarracksAndDefeat,map:'arena',initial:{wood:0,gold:0}},
 skirmish:{enemyBase:true,waves:false,victory:'enemy-base',label:uiText.skirmish,instruction:uiText.buildAnArmyAndExploreTheNortheastDestroy,map:'arena',initial:{wood:0,gold:0}},
 'siege-test':{enemyBase:true,waves:true,victory:'waves',label:'Siege test',instruction:uiText.developerFixture,map:'arena',initial:{wood:0,gold:0}},
 'mission-waves':{enemyBase:false,waves:true,victory:'waves',label:uiText.mission1ForestWatch,instruction:uiText.defeatThreeFiniteWavesStartWith20Wood,map:'arena',initial:{wood:20,gold:10}},
 'mission-base':{enemyBase:true,waves:false,victory:'enemy-base',label:uiText.mission2TheSiege,instruction:uiText.destroyTheEnemyBaseInTheNortheastStart,map:'arena',initial:{wood:20,gold:10}},
 'mission-sea':{enemyBase:true,waves:false,victory:'enemy-base',label:uiText.mission4TheCrossing,instruction:uiText.gatherOnTheWesternIslandStartWith20,map:'islands',initial:{wood:20,gold:10}},
 'mission-escort':{enemyBase:false,waves:false,victory:'operation',label:'Ridge Convoy',instruction:'Keep your base and Ridge Courier alive. Defeat both named guards and escort the courier to the marked safe zone (1504,544).',map:'highlands',initial:{wood:40,gold:20}},
 'mission-rescue':{enemyBase:false,waves:false,victory:'operation',label:'Valley Rescue',instruction:'Defeat both named camp guards, then bring a living combat unit to the rescue zone (1088,640). Keep your base alive.',map:'frontier',initial:{wood:40,gold:20}},
 'mission-capture':{enemyBase:false,waves:false,victory:'operation',label:'Coastal Banner',instruction:'Transport troops across the channel. Hold the banner zone (1600,384) uncontested for 30 gameplay seconds with a living land combat unit. Keep your base alive.',map:'coast',initial:{wood:60,gold:30}},
 'mission-outpost':{enemyBase:false,waves:true,victory:'timer',holdSeconds:90,label:uiText.mission3TheOutpost,instruction:uiText.keepYourBaseAliveFor90GameplaySeconds,map:'arena',initial:{wood:40,gold:10},waveSchedule:[{atSeconds:30,count:1},{atSeconds:60,count:2},{atSeconds:80,count:2}]},
};
export const playableScenarios:MatchScenario[]=['tutorial','survival','skirmish','mission-waves','mission-base','mission-outpost','mission-sea','mission-escort','mission-rescue','mission-capture'];
export function initialScenario(value:string|null):MatchScenario{return value&&Object.hasOwn(scenarioConfig,value)?value as MatchScenario:'survival';}
export function scenarioWaves(scenario:MatchScenario,difficulty:Difficulty){const custom=scenarioConfig[scenario].waveSchedule;if(!custom)return difficultyProfiles[difficulty].waves;return custom.map(w=>({atSeconds:w.atSeconds+difficultyProfiles[difficulty].mission.delaySeconds,count:Math.max(1,w.count+difficultyProfiles[difficulty].mission.countAdjustment)}));}

export function scenarioMapAllowed(scenario:MatchScenario,map:MapId):boolean{return scenario==='skirmish'||map===scenarioConfig[scenario].map;}
