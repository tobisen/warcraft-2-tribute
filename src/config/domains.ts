export const targetDomains=['land','sea','air','building'] as const;
export type TargetDomain=typeof targetDomains[number];
export interface AttackDomains {targets:readonly TargetDomain[];damageByDomain?:Partial<Record<TargetDomain,number>>}
export const groundMeleeTargets=['land','building'] as const;
export const bowTargets=['land','sea','air','building'] as const;
export const siegeTargets=['land','sea','air','building'] as const;
export const shipTargets=['land','sea','air','building'] as const;
export const towerTargets=['land'] as const;
