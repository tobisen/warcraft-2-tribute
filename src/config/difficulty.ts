import { enemyAIConfig } from './enemyAI';
import { enemyProductionConfig } from './enemyProduction';
import { waveSchedule } from './waves';
export type Difficulty='beginner'|'easy'|'normal'|'hard';
/** Only enemy budget/cap/time/group pressure and wave schedules vary. Combat and costs stay equal. */
export const difficultyProfiles={
 beginner:{label:'Beginner',budget:{wood:20,gold:5},cap:3,durationSeconds:12,ai:{...enemyAIConfig,groupSize:1,reserveCount:0,maxDefenders:1,firstAttackSeconds:120,dispatchGapSeconds:30},mission:{delaySeconds:30,countAdjustment:-1},waves:[{atSeconds:120,count:1},{atSeconds:180,count:1},{atSeconds:240,count:1}]},
 easy:{label:'Easy',mission:{delaySeconds:10,countAdjustment:-1},budget:{wood:40,gold:10},cap:4,durationSeconds:7,ai:{...enemyAIConfig,firstAttackSeconds:75,dispatchGapSeconds:20},waves:[{atSeconds:75,count:1},{atSeconds:110,count:1},{atSeconds:145,count:2}]},
 normal:{label:'Normal',mission:{delaySeconds:0,countAdjustment:0},budget:{...enemyProductionConfig.budget},cap:enemyProductionConfig.cap,durationSeconds:enemyProductionConfig.durationSeconds,ai:{...enemyAIConfig},waves:waveSchedule},
 hard:{label:'Hard',mission:{delaySeconds:-5,countAdjustment:1},budget:{wood:120,gold:30},cap:8,durationSeconds:4,ai:{...enemyAIConfig,groupSize:3,firstAttackSeconds:50,dispatchGapSeconds:12},waves:[{atSeconds:50,count:2},{atSeconds:80,count:3},{atSeconds:110,count:4}]},
} as const;
export function initialDifficulty(value:string|null):Difficulty{return value==='beginner'||value==='easy'||value==='hard'?value:'normal';}
