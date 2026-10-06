import {hasMainBase} from './extraBases';
import {nodeRadius} from './gathering';
import {isAir} from './domains';
import {enemySize} from './enemyBody';
import type {MatchState} from './match';import type {Footprint} from './placement';import {placementObstacles,workerResourceTargets} from './placement';import {replaceObstacles,overlaps,enemyNavigationMap} from './map';import {canReachFootprint} from './approach';import {spawnCandidates,hasSpawnExit,unitBody} from './spawning';import {combatUnitStats,unitStats} from '../config/unit';
const same=(a:Footprint,b:Footprint)=>a.x===b.x&&a.y===b.y&&a.width===b.width&&a.height===b.height;
/** Team-specific navigation cache; authoritative obstacles describe the physical open state. */
export function withGateRules(m:MatchState):MatchState{const blocks=(m.aiContext?.gateFriendly?[]:m.placement.defenses??[]).filter(t=>t.kind==='gate'&&t.open).map(t=>t.footprint);return blocks.length?{...m,map:{...m.map,enemyPassageBlocks:blocks}}:m.map.enemyPassageBlocks?{...m,map:{...m.map,enemyPassageBlocks:undefined}}:m;}
export function fortificationSafety(m:MatchState,rect:Footprint):string|null{
 const after=replaceObstacles(m.map,[...m.map.obstacles,rect]),anchors=[placementObstacles(m.gathering)[0],...(m.placement.barracks?[m.placement.barracks]:[]),...(m.placement.forge?[m.placement.forge.footprint]:[]),...(m.placement.farms??[]).map(f=>f.footprint),...(m.navy?.harbor?[m.navy.harbor.footprint]:[]),...m.combat.enemies.filter(e=>e.footprint).map(e=>e.footprint!)];
 const actors=[...m.gathering.units.filter(u=>!isAir(u)).map(u=>({position:u.position,half:(u.kind==='worker'?unitStats.size:combatUnitStats(u).size)/2,enemy:false})),...m.combat.enemies.filter(e=>!isAir(e)&&!e.footprint&&e.kind!=='ship').map(e=>({position:e.position,half:enemySize(e)/2,enemy:true}))];
 for(const u of actors){if(overlaps(rect,unitBody(u.position,u.half*2)))return 'Overlaps a unit';const beforeMap=u.enemy?enemyNavigationMap(m.map):m.map,afterMap=u.enemy?enemyNavigationMap(after):after;
  const resourceAnchors=u.enemy?[]:m.gathering.units.filter(w=>w.kind==='worker'&&w.position.x===u.position.x&&w.position.y===u.position.y).flatMap(w=>w.kind==='worker'?workerResourceTargets(m.gathering,w).map(n=>({x:n.position.x-nodeRadius(n),y:n.position.y-nodeRadius(n),width:nodeRadius(n)*2,height:nodeRadius(n)*2})):[]);
  for(const anchor of [...anchors,...resourceAnchors])if(canReachFootprint({...beforeMap,bodyHalf:u.half},u.position,anchor,24)&&!canReachFootprint({...afterMap,bodyHalf:u.half},u.position,anchor,24))return 'Would trap a unit or block a required delivery route';
 }
 for(const [foot,kind]of [[placementObstacles(m.gathering)[0],'base'],...(m.placement.barracks?[[m.placement.barracks,'barracks'] as const]:[])] as const){const exit=(map:typeof after)=>spawnCandidates(map,foot,kind).some(p=>hasSpawnExit(map,p));if(exit(m.map)&&!exit(after))return 'Blocks a production exit';}
 for(const e of m.combat.enemies.filter(e=>e.footprint&&(e.kind==='base'||e.buildingType==='barracks'||e.buildingType==='outpost'))){const exit=(map:typeof after)=>spawnCandidates(enemyNavigationMap(map),e.footprint!,'barracks').some(p=>hasSpawnExit(enemyNavigationMap(map),p));if(exit(m.map)&&!exit(after))return 'Blocks an enemy production exit';}
 return null;
}
export function gateToggleReason(m:MatchState,id:string):string|null{const t=m.placement.defenses?.find(t=>t.id===id&&t.kind==='gate');if(!t||t.hp<=0)return 'Gate missing';if(m.paused||m.outcome!=='playing'||!!m.multiplePlayers&&!hasMainBase(m))return 'Match is paused or ended';if(t.construction.remainingSeconds>0)return 'Construction unfinished';if(!t.open)return null;return fortificationSafety(m,t.footprint);}
export function toggleGate(m:MatchState,id:string):MatchState{if(gateToggleReason(m,id))return m;const t=m.placement.defenses!.find(t=>t.id===id)!;const obstacles=t.open?[...m.map.obstacles,t.footprint]:m.map.obstacles.filter(o=>!same(o,t.footprint));return withGateRules({...m,map:replaceObstacles(m.map,obstacles),placement:{...m.placement,defenses:m.placement.defenses!.map(x=>x===t?{...x,open:!t.open}:x)}});}
