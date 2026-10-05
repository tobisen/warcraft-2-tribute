export const enemyAIConfig={muster:{x:896,y:320},groupSize:2,musterTimeout:15,
 firstAttackSeconds:60,dispatchGapSeconds:15,reserveCount:1,maxDefenders:2,defenseRange:256};

export type EnemyAISettings=typeof enemyAIConfig & {regroup?:boolean};
