import {factions,type FactionId} from '../config/factions';
import {shipTargets,type TargetDomain} from '../config/domains';
import type {WorldMap} from './map';
type Body={id?:string;kind?:string;role?:string;archetype?:string;footprint?:unknown;domain?:TargetDomain};
export function targetDomain(e:Body):TargetDomain{return e.domain??(e.footprint||['base','building','barracks','farm','forge','harbor','tower','wall','gate'].includes(e.kind??'')?'building':e.kind==='ship'?'sea':e.role==='air'||e.archetype==='air'?'air':'land');}
export const isAir=(e:Body)=>targetDomain(e)==='air';
export function attackTargets(e:Body,faction:FactionId){return e.kind==='ship'?e.role==='transport'?[]:shipTargets:factions[faction].units[(e.archetype??e.role??'soldier') as 'soldier'|'archer'|'catapult'|'specialist'|'air'].targets??['land','building'];}
export function canAttackDomain(attacker:Body,target:Body,faction:FactionId):boolean{return attackTargets(attacker,faction).includes(targetDomain(target));}
export function airMap(map:WorldMap):WorldMap{return {...map,obstacles:[],enemyPassageBlocks:undefined};}
export function movementMap(map:WorldMap,e:Body):WorldMap{return isAir(e)?airMap(map):map;}
