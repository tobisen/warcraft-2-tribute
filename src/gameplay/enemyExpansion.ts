import {enemyNavigationMap} from './map';
import {knownEnemyNode} from './enemyKnowledge';
import {barracksConfig} from '../config/buildings';
import {enemyExpansionConfig as config} from '../config/enemyExpansion';
import {enemyPolicyConfig} from '../config/enemyPolicy';
import {upgradeConfig} from '../config/upgrades';
import {unitStats,combatUnitStats} from '../config/unit';
import {canAfford} from './economy';
import {enemyWorker} from './enemyGathering';
import {approachRoute} from './approach';
import {updateSite} from './construction';
import {overlaps,replaceObstacles} from './map';
import {hasSpawnExit,spawnCandidates,unitBody} from './spawning';
import type {GatheringState,Worker} from './gathering';
import type {MatchState} from './match';
import type {GateFor} from './traffic';
import type {Footprint} from './placement';
export function wantsEnemyExpansion(m:MatchState):boolean {
 return !!m.enemyRecovery&&!!m.enemyPolicy&&m.combat.enemies.some(e=>e.buildingType==='barracks'&&e.hp>0&&e.construction?.remainingSeconds===0)&&m.enemyPolicy.research.attack===upgradeConfig.maxLevel&&m.enemyPolicy.research.defense===upgradeConfig.maxLevel&&!m.combat.enemies.some(e=>e.buildingType==='outpost')&&m.combat.enemies.filter(e=>e.kind==='worker'&&e.hp>0).length>=2&&m.combat.enemies.filter(e=>!e.footprint&&e.kind!=='worker'&&e.hp>0).length>=enemyPolicyConfig.minLiveArmy&&((knownEnemyNode(m,m.gathering.node)?.remaining??0)>0||(knownEnemyNode(m,m.gathering.gold)?.remaining??0)>0);
}
function builderFor(m:MatchState,rect:Footprint){return m.combat.enemies.filter(e=>e.kind==='worker'&&e.hp>0&&e.work?.order.kind!=='build').sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true})).find(e=>approachRoute(enemyNavigationMap(m.map),e.position,rect,barracksConfig.constructionRange).status!=='blocked');}
export function prepareEnemyExpansion(m:MatchState):MatchState {
 if(!m.enemyRecovery||!m.enemyProduction||!m.combat.enemies.some(e=>e.kind==='base'&&e.hp>0))return m;
 const site=m.combat.enemies.find(e=>e.buildingType==='outpost');
 if(site?.construction?.remainingSeconds===0)return m;
 if(site){const current=m.combat.enemies.find(e=>e.id===site.construction!.builderId&&e.hp>0&&e.work?.order.kind==='build'&&e.work.order.buildingId==='outpost');if(current&&current.navigation?.status!=='blocked')return m;}
 if(m.waves.elapsedSeconds+1e-9<m.enemyRecovery.nextExpansionAttemptSeconds)return m;
 if(!site&&!wantsEnemyExpansion(m))return m;
 m={...m,enemyRecovery:{...m.enemyRecovery,nextExpansionAttemptSeconds:m.waves.elapsedSeconds+config.retrySeconds}};
 if(site){const builder=builderFor(m,site.footprint!);if(!builder)return m;return {...m,combat:{...m.combat,enemies:m.combat.enemies.map(e=>e.id===site.id?{...e,construction:{...e.construction!,builderId:builder.id}}:e.id===builder.id?{...e,navigation:undefined,work:{...e.work!,order:{kind:'build',buildingId:'outpost'}}}:e)}};}
 if(m.combat.enemies.some(e=>e.construction&&e.construction.remainingSeconds>0)||!canAfford({wood:m.enemyProduction!.wood,goldBalance:m.enemyProduction!.gold},config.cost))return m;
 for(const point of config.candidates){const rect={...point,width:config.size,height:config.size};
  if(rect.x<0||rect.y<0||rect.x+rect.width>m.map.width||rect.y+rect.height>m.map.height||m.map.obstacles.some(o=>overlaps(rect,o)))continue;
  if(m.gathering.units.some(u=>overlaps(rect,unitBody(u.position,(u.kind==='worker'?unitStats:combatUnitStats(u)).size)))||m.combat.enemies.filter(e=>!e.footprint).some(e=>overlaps(rect,unitBody(e.position,unitStats.size))))continue;
  const builder=builderFor(m,rect);if(!builder)continue;
  const map=replaceObstacles(m.map,[...m.map.obstacles,rect]);if(!spawnCandidates(map,rect,'base').some(p=>hasSpawnExit(map,p)))continue;
  const bank=m.enemyProduction!;return {...m,map,enemyProduction:{...bank,wood:bank.wood-config.cost.wood,gold:bank.gold-config.cost.gold,spent:{wood:(bank.spent?.wood??0)+config.cost.wood,gold:(bank.spent?.gold??0)+config.cost.gold}},combat:{...m.combat,enemies:[...m.combat.enemies.map(e=>e.id===builder.id?{...e,navigation:undefined,work:{...e.work!,order:{kind:'build' as const,buildingId:'outpost' as const}}}:e),{id:'enemy-outpost',owner:'enemy',kind:'building',buildingType:'outpost',hp:config.hp,position:{x:rect.x+config.size/2,y:rect.y+config.size/2},footprint:rect,construction:{remainingSeconds:config.constructionSeconds,builderId:builder.id}}]}};
 }
 return m;
}
export function updateEnemyExpansion(m:MatchState,delta:number,gateFor?:GateFor):MatchState {
 const site=m.combat.enemies.find(e=>e.buildingType==='outpost'),base=m.combat.enemies.find(e=>e.kind==='base'&&e.hp>0);if(!site?.construction||!base||site.construction.remainingSeconds===0)return m;
 const g:GatheringState={...m.gathering,base:base.position,baseSize:base.footprint!.width,units:m.combat.enemies.flatMap(e=>{const w=enemyWorker(e);return w?[w]:[];})};
 const result=updateSite(g,site.construction,site.footprint!,'outpost',enemyNavigationMap(m.map),delta,gateFor?(id=>gateFor(id.replace(/^player:/,'enemy:'))):undefined);const byId=new Map(result.gathering.units.map(u=>[u.id,u as Worker]));
 return {...m,combat:{...m.combat,enemies:m.combat.enemies.map(e=>{if(e.id===site.id)return {...e,construction:result.job};const u=byId.get(e.id);return u?{...e,position:u.position,navigation:u.navigation,work:{cargo:u.cargo,cargoType:u.cargoType,target:u.target,order:u.order}}:e;})}};
}
