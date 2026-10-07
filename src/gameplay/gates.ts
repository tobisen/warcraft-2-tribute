import {footprintDistance} from './approach';
import {canSupport} from './players';
import {hasMainBase} from './extraBases';
import {nodeRadius} from './gathering';
import {isAir} from './domains';
import {enemySize} from './enemyBody';
import type {MatchState} from './match';import type {Footprint} from './placement';import {placementObstacles,workerResourceTargets} from './placement';import {replaceObstacles,overlaps,enemyNavigationMap} from './map';import {canReachFootprint} from './approach';import {spawnCandidates,hasSpawnExit,unitBody} from './spawning';import {combatUnitStats,unitStats} from '../config/unit';
const same=(a:Footprint,b:Footprint)=>a.x===b.x&&a.y===b.y&&a.width===b.width&&a.height===b.height;
/** Completed friendly gates are passable even while their visual doors are closed. */
export function withGateRules(m:MatchState):MatchState {
 const gates=(m.placement.defenses??[]).filter(t=>t.kind==='gate'&&t.hp>0&&t.construction.remainingSeconds===0);
 const obstacles=m.map.obstacles.filter(o=>!gates.some(t=>same(o,t.footprint)));
 const map=obstacles.length===m.map.obstacles.length?m.map:replaceObstacles(m.map,obstacles);
 const blocks=m.aiContext?.gateFriendly?[]:gates.map(t=>t.footprint);
 return {...m,map:{...map,enemyPassageBlocks:blocks.length?blocks:undefined}};
}
/** Door animation follows friendly proximity; routing never waits for the door animation. */
export function updateAutomaticGates(m:MatchState):MatchState {
 const friendly=[...m.gathering.units.filter(u=>(u.hp??1)>0&&!isAir(u)),...m.combat.enemies.filter(e=>e.hp>0&&!e.footprint&&!isAir(e)&&e.kind!=='ship'&&(m.aiContext?.visionSide==='enemy'&&m.aiContext.gateFriendly||e.playerId&&m.multiplePlayers&&canSupport('player',e.playerId,m.multiplePlayers.roster)))];
 let changed=false;
 const defenses=m.placement.defenses?.map(t=>{if(t.kind!=='gate')return t;const open=t.hp>0&&t.construction.remainingSeconds===0&&friendly.some(u=>footprintDistance(u.position,t.footprint)<=48);if(open===t.open)return t;changed=true;return {...t,open};});
 return withGateRules(changed?{...m,placement:{...m.placement,defenses}}:m);
}
export function fortificationSafety(m:MatchState,rect:Footprint,friendlyPassage=false):string|null{
 const after=replaceObstacles(m.map,[...m.map.obstacles,rect]),anchors=[placementObstacles(m.gathering)[0],...(m.placement.barracks?[m.placement.barracks]:[]),...(m.placement.forge?[m.placement.forge.footprint]:[]),...(m.placement.farms??[]).map(f=>f.footprint),...(m.navy?.harbor?[m.navy.harbor.footprint]:[]),...m.combat.enemies.filter(e=>e.footprint).map(e=>e.footprint!)];
 const actors=[...m.gathering.units.filter(u=>!isAir(u)).map(u=>({position:u.position,half:(u.kind==='worker'?unitStats.size:combatUnitStats(u).size)/2,enemy:false})),...m.combat.enemies.filter(e=>!isAir(e)&&!e.footprint&&e.kind!=='ship').map(e=>({position:e.position,half:enemySize(e)/2,enemy:true}))];
 for(const u of actors){if(overlaps(rect,unitBody(u.position,u.half*2)))return 'Overlaps a unit';const beforeMap=u.enemy?enemyNavigationMap(m.map):m.map,afterMap=u.enemy?enemyNavigationMap(after):friendlyPassage?m.map:after;
  const resourceAnchors=u.enemy?[]:m.gathering.units.filter(w=>w.kind==='worker'&&w.position.x===u.position.x&&w.position.y===u.position.y).flatMap(w=>w.kind==='worker'?workerResourceTargets(m.gathering,w).map(n=>({x:n.position.x-nodeRadius(n),y:n.position.y-nodeRadius(n),width:nodeRadius(n)*2,height:nodeRadius(n)*2})):[]);
  for(const anchor of [...anchors,...resourceAnchors])if(canReachFootprint({...beforeMap,bodyHalf:u.half},u.position,anchor,24)&&!canReachFootprint({...afterMap,bodyHalf:u.half},u.position,anchor,24))return 'Would trap a unit or block a required delivery route';
 }
 for(const [foot,kind]of [[placementObstacles(m.gathering)[0],'base'],...(m.placement.barracks?[[m.placement.barracks,'barracks'] as const]:[])] as const){const exit=(map:typeof after)=>spawnCandidates(map,foot,kind).some(p=>hasSpawnExit(map,p));if(exit(m.map)&&!exit(friendlyPassage?m.map:after))return 'Blocks a production exit';}
 for(const e of m.combat.enemies.filter(e=>e.footprint&&(e.kind==='base'||e.buildingType==='barracks'||e.buildingType==='outpost'))){const exit=(map:typeof after)=>spawnCandidates(enemyNavigationMap(map),e.footprint!,'barracks').some(p=>hasSpawnExit(enemyNavigationMap(map),p));if(exit(m.map)&&!exit(friendlyPassage?m.map:after))return 'Blocks an enemy production exit';}
 return null;
}
export function gateToggleReason(m:MatchState,id:string):string|null{const t=m.placement.defenses?.find(t=>t.id===id&&t.kind==='gate');if(!t||t.hp<=0)return 'Gate missing';if(m.paused||m.outcome!=='playing'||!!m.multiplePlayers&&!hasMainBase(m))return 'Match is paused or ended';if(t.construction.remainingSeconds>0)return 'Construction unfinished';if(!t.open)return null;return fortificationSafety(m,t.footprint);}
export function toggleGate(m:MatchState,id:string):MatchState{if(gateToggleReason(m,id))return m;const t=m.placement.defenses!.find(t=>t.id===id)!;const obstacles=t.open?[...m.map.obstacles,t.footprint]:m.map.obstacles.filter(o=>!same(o,t.footprint));return withGateRules({...m,map:replaceObstacles(m.map,obstacles),placement:{...m.placement,defenses:m.placement.defenses!.map(x=>x===t?{...x,open:!t.open}:x)}});}
