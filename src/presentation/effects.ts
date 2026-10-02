import type {Projectile} from '../gameplay/projectiles';
import type {Position} from '../gameplay/movement';
import {effectConfig} from '../config/effects';
export interface Impact {position:Position;kind:'impact'|'splash';since:number}
/** Cosmetic landing flashes, including visible misses; never drive damage or infer hidden HP. */
export function landedEffects(previous:readonly Projectile[],current:readonly Projectile[],delta:number,time:number,visible:(position:Position)=>boolean):Impact[]{if(delta<=0)return [];const ids=new Set(current.map(p=>p.id));return previous.filter(p=>!ids.has(p.id)&&Math.hypot(p.destination.x-p.position.x,p.destination.y-p.position.y)<=p.speed*delta+1e-6&&p.remainingLife>=Math.hypot(p.destination.x-p.position.x,p.destination.y-p.position.y)/p.speed&&visible(p.destination)).map(p=>({position:{...p.destination},kind:p.splashRadius?'splash':'impact',since:time}));}
export function impactFrame(impact:Impact,time:number):string{return `${impact.kind}-${Math.min(3,Math.floor(Math.max(0,time-impact.since)*effectConfig.fps))}`;}
export function impactAlive(impact:Impact,time:number,visible:(position:Position)=>boolean):boolean{return time-impact.since<effectConfig.lifetimeSeconds&&visible(impact.position);}
