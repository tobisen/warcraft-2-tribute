import {factions,type FactionId} from '../config/factions';
import type {Position} from '../gameplay/movement';
export type UnitArt='worker'|'soldier'|'archer'|'catapult'|'warship'|'transport'|'specialist'|'air'|'cavalry'|'healer';
export type Action='idle'|'walk'|'attack'|'death'|'gather'|'build';
export const directions=['e','se','s','sw','w','nw','n','ne'] as const;
export type Facing=typeof directions[number];
export interface Motion {position:Position;facing:Facing;action:Action;since:number;type:UnitArt;owner:'player'|'enemy';faction?:FactionId}
export function facing(vector:Position,previous:Facing='s'):Facing{return Math.hypot(vector.x,vector.y)<1e-6?previous:directions[(Math.round(Math.atan2(vector.y,vector.x)/(Math.PI/4))+8)%8]!;}
export function motion(previous:Motion|undefined,position:Position,action:Action,time:number,type:UnitArt,owner:'player'|'enemy',aim?:Position,faction:FactionId='crown'):Motion{
 const vector=previous?{x:position.x-previous.position.x,y:position.y-previous.position.y}:{x:0,y:0};
 const moved=Math.hypot(vector.x,vector.y)>1e-6;
 const nextAction=moved?'walk':action;
 const nextFacing=facing(moved?vector:aim?{x:aim.x-position.x,y:aim.y-position.y}:{x:0,y:0},previous?.facing);
 return {position:{...position},facing:nextFacing,action:nextAction,since:previous?.action===nextAction&&previous.facing===nextFacing?previous.since:time,type,owner,faction};
}
export function unitFrame(m:Motion,time:number):string{if(m.type==='air'){const index=m.action==='death'?Math.min(3,Math.floor(Math.max(0,time-m.since)*8)):Math.floor(Math.max(0,time-m.since)*8)%4;return `${m.faction??'crown'}-air-${m.owner}-${m.facing}-${m.action==='walk'?'walk':m.action==='death'?'death':m.action==='attack'?'attack':'idle'}-${index}`;}const frames=m.action==='idle'?1:4,elapsed=Math.max(0,time-m.since),index=m.action==='death'?Math.min(3,Math.floor(elapsed*8)):Math.floor(elapsed*8)%frames;const type=m.type==='specialist'?factions[m.faction??'crown'].units.specialist.art??'soldier':m.type;return `${factions[m.faction??'crown'].artPrefix}${type}-${m.owner}-${m.facing}-${m.action}-${index}`;}
export function unitOrigin(type:UnitArt){return {x:.5,y:type==='air'?.5:type==='catapult'||type==='warship'||type==='transport'?40/64:22/32};}
export interface DeathEffect {motion:Motion;expires:number}
/** Called only for a logically removed, currently visible unit; fog hiding never creates a death. */
export function deathEffect(previous:Motion,time:number,visible:boolean,removed:boolean):DeathEffect|null{return visible&&removed?{motion:{...previous,action:'death',since:time,position:{...previous.position}},expires:time+.5}:null;}
export function effectAlive(effect:DeathEffect,time:number,visible:boolean):boolean{return visible&&time<effect.expires;}

export function artAtlas(type:UnitArt):'units'|'naval'|'air'|'cavalry'|'healer'{return type==='healer'?'healer':type==='cavalry'?'cavalry': type==='air'?'air':type==='warship'||type==='transport'?'naval':'units';}

/** Labels sit above the detailed land silhouettes, without changing its body or origin. */
export function unitOverlayOffsets(type:UnitArt,faction:FactionId='crown'){
 const detailed=type==='worker'||type==='soldier'||type==='archer'||type==='specialist'||type==='cavalry'||type==='healer';
 return {hp:type==='air'?60:detailed?48:type==='catapult'?48:29,cargo:detailed?68:48};
}
