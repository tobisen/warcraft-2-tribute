/** Repair consumes both resources per actual restored HP, at most three workers per building. */
export const repairConfig={hpPerSecond:4,woodPerHP:.5,goldPerHP:.1,range:24,maxWorkersPerBuilding:3} as const;
export const defenseBalanceConfig={siegeDefenseMultiplier:1.5} as const;
