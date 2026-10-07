import { arenaConfig } from './arena';
export const gatheringConfig = {
  initialWood: 400,
  range: 24,
  woodPerSecond: 1,
  nodeRadius: 20,
  nodePosition: arenaConfig.node,
  capacity: 5,
  deliveryRange: 24,
  basePosition: arenaConfig.base,
  baseSize: 48,
};

export const goldConfig = { initialAmount:3000,stockMultiplier:10, position:{x:850,y:220}, resource:'gold' as const };
