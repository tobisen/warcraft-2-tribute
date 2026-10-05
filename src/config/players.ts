import type {FactionId} from './factions';
import type {AIProfileId} from './aiProfiles';
import type {MapId} from './maps';
import type {Position} from '../gameplay/movement';

export type PlayerId='player'|'enemy'|'ai-2';
export interface PlayerDefinition {teamId?:number;id:PlayerId;controller:'human'|'ai';faction:FactionId;color:string;profile:AIProfileId}
export const playerColors=['#5fa9df','#ec7770','#e5bf55'] as const;
/** Authored slots, never random coordinates in unexplored terrain. */
export const additionalStarts:Partial<Record<MapId,Position>>={plains96:{x:1664,y:384},plains128:{x:1664,y:384}};
export function supportedPlayerCounts(map:MapId,scenario:string):readonly number[]{return scenario==='skirmish'&&additionalStarts[map]?[2,3]:[2];}
