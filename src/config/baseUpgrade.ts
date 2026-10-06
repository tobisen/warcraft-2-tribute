/** Shared level costs; upgrading pauses training in every main building, not barracks/naval jobs. */
export const baseUpgradeConfig={2:{cost:{wood:80,gold:60},seconds:20},3:{cost:{wood:120,gold:100},seconds:30}} as const;
export interface BaseDevelopment {level:1|2|3;remainingSeconds:number|null}
