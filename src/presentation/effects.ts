import type Phaser from 'phaser';
import type {Projectile} from '../gameplay/projectiles';
import type {Position} from '../gameplay/movement';
import {effectConfig} from '../config/effects';
export interface Impact {position:Position;kind:'impact'|'splash'|'dust';since:number}
/** Cosmetic landing flashes, including visible misses; never drive damage or infer hidden HP. */
export function landedEffects(previous:readonly Projectile[],current:readonly Projectile[],delta:number,time:number,visible:(position:Position)=>boolean):Impact[]{if(delta<=0)return [];const ids=new Set(current.map(p=>p.id));return previous.filter(p=>!ids.has(p.id)&&Math.hypot(p.destination.x-p.position.x,p.destination.y-p.position.y)<=p.speed*delta+1e-6&&p.remainingLife>=Math.hypot(p.destination.x-p.position.x,p.destination.y-p.position.y)/p.speed&&visible(p.destination)).map(p=>({position:{...p.destination},kind:p.splashRadius?'splash':'impact',since:time}));}
export function impactFrame(impact:Impact,time:number):string{return `${impact.kind}-${Math.min(3,Math.floor(Math.max(0,time-impact.since)*effectConfig.fps))}`;}
export function impactAlive(impact:Impact,time:number,visible:(position:Position)=>boolean):boolean{return time-impact.since<effectConfig.lifetimeSeconds&&visible(impact.position);}

export interface HealthSample {id:string;hp:number;position:Position}
/** Samples are already public/visible; reveal, spawn and removal are not hit events. */
export function hitEffects(previous:readonly HealthSample[]|undefined,current:readonly HealthSample[],time:number,playing:boolean):Impact[]{
 if(!playing||!previous)return [];
 const old=new Map(previous.map(p=>[p.id,p.hp]));
 return current.filter(p=>p.hp>0&&old.has(p.id)&&p.hp<old.get(p.id)!).map(p=>({kind:'impact',position:{...p.position},since:time}));
}
export function canAddImpact(active:readonly Impact[],next:Impact):boolean {
 return active.length<effectConfig.maxCount&&!active.some(p=>p.kind===next.kind&&next.since-p.since<effectConfig.hitCooldownSeconds&&Math.hypot(p.position.x-next.position.x,p.position.y-next.position.y)<=effectConfig.mergeRadius);
}
export function projectileAppearance(shot:Projectile):{kind:'arrow'|'stone'|'cannonball';rotation:number}{
 return {kind:shot.marine?'cannonball':shot.splashRadius?'stone':'arrow',rotation:Math.atan2(shot.destination.y-shot.position.y,shot.destination.x-shot.position.x)};
}
/** Pixel-sized primitives, no gameplay mutation or animation callbacks. */
export function drawProjectile(graphics:Phaser.GameObjects.Graphics,shot:Projectile):void {
 const style=projectileAppearance(shot);graphics.clear().setPosition(shot.position.x,shot.position.y).setRotation(style.rotation);
 if(style.kind==='arrow')graphics.lineStyle(2,0xac8052).lineBetween(-effectConfig.arrowLength,0,-3,0).lineStyle(1,0xbac3bc).lineBetween(-5,-3,0,0).lineBetween(0,0,-5,3).lineStyle(1,0xf4d87a).lineBetween(-effectConfig.arrowLength,-2,-effectConfig.arrowLength+3,0).lineBetween(-effectConfig.arrowLength,2,-effectConfig.arrowLength+3,0);
 else {
  const r=style.kind==='stone'?effectConfig.stoneRadius:effectConfig.cannonRadius;
  graphics.lineStyle(1,0x8a999e,.5).lineBetween(-r-effectConfig.trailLength,0,-r-1,0).fillStyle(style.kind==='stone'?0x647078:0x172422).fillCircle(0,0,r).lineStyle(1,0x8a999e).strokeCircle(0,0,r).fillStyle(0xbac3bc).fillRect(-r+1,-r+1,2,1);
 }
}
