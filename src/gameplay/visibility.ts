import { isExplored,isVisible,type FogState,type Team } from './fog';
import type { Footprint } from './placement';
import type { Position } from './movement';
export interface VisibleEntity {id?:string;position:Position;footprint?:Footprint}
/** Units require a visible center; seeing any building cell reveals that complete object. */
export function entityVisible(fog:FogState,team:Team,entity:VisibleEntity):boolean {
 if(entity.id&&fog.concealedIds?.[team].includes(entity.id))return false;
 if(!entity.footprint)return isVisible(fog,team,entity.position);
 const r=entity.footprint;
 for(let row=Math.max(0,Math.floor(r.y/fog.tileSize));row<Math.min(fog.rows,Math.ceil((r.y+r.height)/fog.tileSize));row++)for(let col=Math.max(0,Math.floor(r.x/fog.tileSize));col<Math.min(fog.columns,Math.ceil((r.x+r.width)/fog.tileSize));col++)if(fog.teams[team].visible[row*fog.columns+col])return true;
 return false;
}
export function knownResource(fog:FogState,position:Position):boolean{return isExplored(fog,'player',position);}

/** Placement requires current vision over its whole footprint; failure reveals no hidden occupants. */
export function placementVisible(fog:FogState,r:Footprint):boolean {
 if(r.x<0||r.y<0||r.x+r.width>fog.width||r.y+r.height>fog.height)return false;
 for(let row=Math.floor(r.y/fog.tileSize);row<Math.ceil((r.y+r.height)/fog.tileSize);row++)for(let col=Math.floor(r.x/fog.tileSize);col<Math.ceil((r.x+r.width)/fog.tileSize);col++)if(!fog.teams.player.visible[row*fog.columns+col])return false;
 return true;
}
