import type {MapId} from './maps';
import {difficultyProfiles,type Difficulty} from './difficulty';
export type MatchScenario='survival'|'skirmish'|'siege-test'|'mission-waves'|'mission-base'|'mission-outpost'|'mission-sea';
export const enemyBaseConfig={id:'enemy-base',hp:240,footprint:{x:960,y:96,width:96,height:96}};
interface ScenarioDefinition {enemyBase:boolean;waves:boolean;victory:'waves'|'enemy-base'|'timer';label:string;instruction:string;map:MapId;initial:{wood:number;gold:number};holdSeconds?:number;waveSchedule?:readonly {atSeconds:number;count:number}[]}
export const scenarioConfig:Record<MatchScenario,ScenarioDefinition>={
 survival:{enemyBase:false,waves:true,victory:'waves',label:'Wave-survival',instruction:'Samla wood och gold, bygg barracks och besegra alla tre vågor. Skydda basen.',map:'arena',initial:{wood:0,gold:0}},
 skirmish:{enemyBase:true,waves:false,victory:'enemy-base',label:'Skirmish',instruction:'Bygg en armé och utforska nordöstra hörnet. Förstör fiendebasen; skydda din egen.',map:'arena',initial:{wood:0,gold:0}},
 'siege-test':{enemyBase:true,waves:true,victory:'waves',label:'Siege test',instruction:'Utvecklarfixture',map:'arena',initial:{wood:0,gold:0}},
 'mission-waves':{enemyBase:false,waves:true,victory:'waves',label:'Uppdrag 1 – Skogsvakten',instruction:'Besegra tre ändliga vågor. Du börjar med 20 wood och 10 gold. Leverera resurser och bygg en blandad armé.',map:'arena',initial:{wood:20,gold:10}},
 'mission-base':{enemyBase:true,waves:false,victory:'enemy-base',label:'Uppdrag 2 – Belägringen',instruction:'Förstör fiendebasen i nordost. Du börjar med 20 wood och 10 gold. Din bas måste överleva.',map:'arena',initial:{wood:20,gold:10}},
 'mission-sea':{enemyBase:true,waves:false,victory:'enemy-base',label:'Uppdrag 4 – Överfarten',instruction:'Samla på västra ön. Du börjar med 20 wood och 10 gold. Bygg hamn och transport, landsätt en betald armé och förstör fiendebasen. Skydda din bas från fiendens landstigning.',map:'islands',initial:{wood:20,gold:10}},
 'mission-outpost':{enemyBase:false,waves:true,victory:'timer',holdSeconds:90,label:'Uppdrag 3 – Utposten',instruction:'Håll basen vid liv i 90 gameplay-sekunder. Du börjar med 40 wood och 10 gold. Fiender kan finnas kvar när tiden går ut.',map:'arena',initial:{wood:40,gold:10},waveSchedule:[{atSeconds:30,count:1},{atSeconds:60,count:2},{atSeconds:80,count:2}]},
};
export const playableScenarios:MatchScenario[]=['survival','skirmish','mission-waves','mission-base','mission-outpost','mission-sea'];
export function initialScenario(value:string|null):MatchScenario{return value&&Object.hasOwn(scenarioConfig,value)?value as MatchScenario:'survival';}
export function scenarioWaves(scenario:MatchScenario,difficulty:Difficulty){const custom=scenarioConfig[scenario].waveSchedule;if(!custom)return difficultyProfiles[difficulty].waves;return custom.map(w=>({atSeconds:w.atSeconds+(difficulty==='easy'?10:difficulty==='hard'?-5:0),count:Math.max(1,w.count+(difficulty==='easy'?-1:difficulty==='hard'?1:0))}));}

export function scenarioMapAllowed(scenario:MatchScenario,map:MapId):boolean{return scenario==='skirmish'||map===scenarioConfig[scenario].map;}
