import type {ResourceCost} from './economy';
/** One finite transport assault, exclusive to fresh Islands matches. Balance is RTS-087. */
export const enemyNavalConfig={bonus:{wood:120,gold:30},harbor:{x:864,y:320,width:64,height:64},
 launchSeconds:{easy:260,normal:220,hard:190},passengers:2,loading:{x:912,y:432},waterStart:{x:880,y:432},waterGoal:{x:720,y:432},landing:{x:688,y:432},landSearch:{x:448,y:480}};
export function enemyStartingBudget(budget:ResourceCost,naval:boolean):ResourceCost{return {wood:budget.wood+(naval?enemyNavalConfig.bonus.wood:0),gold:budget.gold+(naval?enemyNavalConfig.bonus.gold:0)};}
