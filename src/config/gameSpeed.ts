export const gameSpeeds=[.75,1] as const;
export type GameSpeed=typeof gameSpeeds[number];
export function isGameSpeed(value:unknown):value is GameSpeed{return value===.75||value===1;}
export function initialGameSpeed(value:unknown):GameSpeed{return isGameSpeed(value)?value:1;}
