import type { ResourceCost } from '../config/economy';
interface Balance { wood:number; goldBalance?:number }
export function canAfford(balance:Balance,cost:ResourceCost):boolean {
  return balance.wood>=cost.wood && (balance.goldBalance??0)>=cost.gold;
}
/** Either debit both resources once, or return the exact unchanged balance. */
export function payCost<T extends Balance>(balance:T,cost:ResourceCost):T {
  if (!canAfford(balance,cost)) return balance;
  return {...balance,wood:balance.wood-cost.wood,
    ...(balance.goldBalance!==undefined || cost.gold>0 ? {goldBalance:(balance.goldBalance??0)-cost.gold}: {})};
}
export function costLabel(cost:ResourceCost):string {
  return [cost.wood>0?`${cost.wood} wood`:'',cost.gold>0?`${cost.gold} gold`:''].filter(Boolean).join(' + ') || 'Gratis';
}
export function missingCost(balance:Balance,cost:ResourceCost):string {
  return costLabel({wood:Math.max(0,cost.wood-balance.wood),gold:Math.max(0,cost.gold-(balance.goldBalance??0))});
}
