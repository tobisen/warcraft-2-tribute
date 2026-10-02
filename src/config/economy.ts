export interface ResourceCost { wood:number; gold:number }
export const costs = {
  worker:{wood:20,gold:0},
  soldier:{wood:20,gold:5},
  barracks:{wood:40,gold:0},
  farm:{wood:20,gold:0},
} satisfies Record<string, ResourceCost>;
