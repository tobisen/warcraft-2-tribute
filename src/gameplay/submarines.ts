import {canSupport} from './players';
import {isVisible,type FogState,type VisionObserver} from './fog';
import type {MatchState} from './match';
import type {Position} from './movement';
/** Concealment is derived from the current fog snapshot; never grants or saves vision. */
export function concealSubmarines(m:MatchState,fog:FogState,observers:readonly VisionObserver[]):FogState{
 const visible=(side:'player'|'enemy',position:Position)=>isVisible(fog,side,position)&&observers.some(o=>o.owner===side&&(o.detectorRadius??0)>0&&Math.hypot(o.position.x-position.x,o.position.y-position.y)<=o.detectorRadius!);
 const friendly=(id:string)=>m.aiContext?.friendlyEntityIds?.includes(id)??false;
 const enemies=m.combat.enemies.filter(e=>e.hp>0&&e.navalRole==='submarine');
 const player=enemies.filter(e=>!friendly(e.id)&&!(m.multiplePlayers&&canSupport('player',e.playerId??'enemy',m.multiplePlayers.roster))&&!visible('player',e.position)).map(e=>e.id);
 const targets=[...(m.navy?.ships.filter(s=>s.hp>0&&s.role==='submarine')??[]),...(m.aiContext?.concealedTargets??[])];
 if(!enemies.length&&!targets.length){if(!fog.concealedIds)return fog;const {concealedIds:_cache,...unconcealed}=fog;return unconcealed;}
 return {...fog,concealedIds:{player,enemy:targets.filter(s=>!visible('enemy',s.position)).map(s=>s.id)}};
}
