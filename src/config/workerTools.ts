/** Gathering duration relative to the base; levels replace, never compound. */
export const workerToolsConfig=[
 {name:'Worker Tools I',cost:{wood:60,gold:30},durationSeconds:15,timeMultiplier:.9},
 {name:'Worker Tools II',cost:{wood:100,gold:60},durationSeconds:20,timeMultiplier:.8},
 {name:'Worker Tools III',cost:{wood:140,gold:100},durationSeconds:30,timeMultiplier:.7},
] as const;
export const workerToolsTimeMultiplier=(level=0)=>level<=0?1:workerToolsConfig[Math.min(3,level)-1]!.timeMultiplier;
