export type MatchScenario='survival'|'skirmish'|'siege-test';
export const enemyBaseConfig={id:'enemy-base',hp:240,footprint:{x:960,y:96,width:96,height:96}};
export const scenarioConfig={
 survival:{enemyBase:false,waves:true,victory:'waves'},
 skirmish:{enemyBase:true,waves:false,victory:'enemy-base'},
 'siege-test':{enemyBase:true,waves:true,victory:'waves'},
} as const;
export function initialScenario(value:string|null):MatchScenario{return value==='skirmish'||value==='siege-test'?value:'survival';}
