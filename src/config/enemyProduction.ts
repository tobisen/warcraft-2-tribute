import { costs } from './economy';
import { soldierProductionConfig } from './production';
/** One unit type, finite initial budget, shared queue/cost/time rules. */
export const enemyProductionConfig={budget:{wood:80,gold:20},cap:6,
 unitType:'soldier' as const,cost:costs.soldier,durationSeconds:soldierProductionConfig.durationSeconds};
