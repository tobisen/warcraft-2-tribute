import {text as uiText} from '../text';
import type {MapId} from './maps';
import {difficultyProfiles,type Difficulty} from './difficulty';
export type MatchScenario='survival'|'skirmish'|'siege-test'|'mission-waves'|'mission-base'|'mission-outpost'|'mission-sea';
export const enemyBaseConfig={id:'enemy-base',hp:240,footprint:{x:960,y:96,width:96,height:96}};
interface ScenarioDefinition {enemyBase:boolean;waves:boolean;victory:'waves'|'enemy-base'|'timer';label:string;instruction:string;map:MapId;initial:{wood:number;gold:number};holdSeconds?:number;waveSchedule?:readonly {atSeconds:number;count:number}[]}
export const scenarioConfig:Record<MatchScenario,ScenarioDefinition>={
 survival:{enemyBase:false,waves:true,victory:'waves',label:'Wave-survival',instruction:uiText.gatherWoodAndGoldBuildBarracksAndDefeat,map:'arena',initial:{wood:0,gold:0}},
 skirmish:{enemyBase:true,waves:false,victory:'enemy-base',label:uiText.skirmish,instruction:uiText.buildAnArmyAndExploreTheNortheastDestroy,map:'arena',initial:{wood:0,gold:0}},
 'siege-test':{enemyBase:true,waves:true,victory:'waves',label:'Siege test',instruction:uiText.developerFixture,map:'arena',initial:{wood:0,gold:0}},
 'mission-waves':{enemyBase:false,waves:true,victory:'waves',label:uiText.mission1ForestWatch,instruction:uiText.defeatThreeFiniteWavesStartWith20Wood,map:'arena',initial:{wood:20,gold:10}},
 'mission-base':{enemyBase:true,waves:false,victory:'enemy-base',label:uiText.mission2TheSiege,instruction:uiText.destroyTheEnemyBaseInTheNortheastStart,map:'arena',initial:{wood:20,gold:10}},
 'mission-sea':{enemyBase:true,waves:false,victory:'enemy-base',label:uiText.mission4TheCrossing,instruction:uiText.gatherOnTheWesternIslandStartWith20,map:'islands',initial:{wood:20,gold:10}},
 'mission-outpost':{enemyBase:false,waves:true,victory:'timer',holdSeconds:90,label:uiText.mission3TheOutpost,instruction:uiText.keepYourBaseAliveFor90GameplaySeconds,map:'arena',initial:{wood:40,gold:10},waveSchedule:[{atSeconds:30,count:1},{atSeconds:60,count:2},{atSeconds:80,count:2}]},
};
export const playableScenarios:MatchScenario[]=['survival','skirmish','mission-waves','mission-base','mission-outpost','mission-sea'];
export function initialScenario(value:string|null):MatchScenario{return value&&Object.hasOwn(scenarioConfig,value)?value as MatchScenario:'survival';}
export function scenarioWaves(scenario:MatchScenario,difficulty:Difficulty){const custom=scenarioConfig[scenario].waveSchedule;if(!custom)return difficultyProfiles[difficulty].waves;return custom.map(w=>({atSeconds:w.atSeconds+difficultyProfiles[difficulty].mission.delaySeconds,count:Math.max(1,w.count+difficultyProfiles[difficulty].mission.countAdjustment)}));}

export function scenarioMapAllowed(scenario:MatchScenario,map:MapId):boolean{return scenario==='skirmish'||map===scenarioConfig[scenario].map;}
