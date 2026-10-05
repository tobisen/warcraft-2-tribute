import {additionalStarts,playerColors,type PlayerDefinition,type PlayerId} from '../config/players';
import {defaultFactions,type MatchFactions} from '../config/factions';
import type {AIProfileId} from '../config/aiProfiles';
import {enemyBaseConfig} from '../config/scenarios';
import {gatheringConfig} from '../config/gathering';
import {maps,type MapId} from '../config/maps';
import {bodyFits,createMap,overlaps} from './map';
import {baseFootprint} from './buildingSelection';
import {spawnCandidates,hasSpawnExit} from './spawning';
import type {Position} from './movement';

export interface PlayerOwned {playerId?:PlayerId}
export function ownerOf(entity:PlayerOwned&{owner?:string}):PlayerId{return entity.playerId??(entity.owner==='enemy'?'enemy':'player');}
export function playerTeam(id:PlayerId,roster?:readonly PlayerDefinition[]):number{return roster?.find(p=>p.id===id)?.teamId??({'player':1,enemy:2,'ai-2':3} as const)[id];}
export function playerRelation(a:PlayerId,b:PlayerId,roster?:readonly PlayerDefinition[]):'own'|'ally'|'enemy'{return a===b?'own':playerTeam(a,roster)===playerTeam(b,roster)?'ally':'enemy';}
export const canControl=(actor:PlayerId,target:PlayerId)=>actor===target;
export const canHarm=(actor:PlayerId,target:PlayerId,roster?:readonly PlayerDefinition[])=>playerRelation(actor,target,roster)==='enemy';
export const canSupport=(actor:PlayerId,target:PlayerId,roster?:readonly PlayerDefinition[])=>playerRelation(actor,target,roster)!=='enemy';
export function matchPlayers(factions:MatchFactions=defaultFactions,profile:AIProfileId='balanced',count=2):PlayerDefinition[]{
 if(count!==2&&count!==3)throw Error('Unsupported player count');
 return [{teamId:1,id:'player',controller:'human',faction:factions.player,color:playerColors[0],profile},
  {teamId:2,id:'enemy',controller:'ai',faction:factions.enemy,color:playerColors[1],profile},
  ...(count===3?[{teamId:3,id:'ai-2' as const,controller:'ai' as const,faction:'elves' as const,color:playerColors[2],profile}]:[])];
}
export function playerStart(map:MapId,id:PlayerId):Position{
 if(id==='player')return {...gatheringConfig.basePosition};
 if(id==='ai-2'){const p=additionalStarts[map];if(!p)throw Error('Map has no third start');return {...p};}
 const rect=maps[map].enemyBase??enemyBaseConfig.footprint;return {x:rect.x+rect.width/2,y:rect.y+rect.height/2};
}
/** Validate physical footprint and a reachable worker exit before offering a slot. */
export function validatePlayerStarts(mapId:MapId,players:readonly PlayerDefinition[]):boolean{
 try{
 const map=createMap(mapId),rects=players.map(p=>p.id==='player'?baseFootprint(playerStart(mapId,p.id)):{x:playerStart(mapId,p.id).x-48,y:playerStart(mapId,p.id).y-48,width:96,height:96});
 if(new Set(players.map(p=>p.id)).size!==players.length)return false;
 if(rects.some((r,i)=>!bodyFits(map,{x:r.x+r.width/2,y:r.y+r.height/2},r.width/2)||rects.some((other,j)=>j!==i&&overlaps(r,other))))return false;
 const occupied={...map,obstacles:[...map.obstacles,...rects]};
 return rects.every(r=>spawnCandidates(occupied,r,'base').some(p=>hasSpawnExit(occupied,p)));
 }catch{return false;}
}
