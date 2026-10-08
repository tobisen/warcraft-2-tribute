import {playerTargets} from './targets';
import {bossDefinitions,bossRules,mapBosses,bossEnemyId,type BossId} from '../config/bosses';
import type {MatchState} from './match';
import type {Enemy,CombatState} from './combat';
import {isVisible} from './fog';
import {segmentFits,planRoute} from './navigation';
import {enemyNavigationMap} from './map';
export interface BossRecord {hp:number;attackCooldown:number;claimed:boolean;claimedBy?:'player'|'enemy';engaged:boolean}
export interface BossState {version:1;guardians:Partial<Record<BossId,BossRecord>>}
export function createBosses(map:MatchState['map']):BossState|undefined {
 const definitions=map.design==='regions'?mapBosses(map.id??'arena'):[];
 return definitions.length?{version:1,guardians:Object.fromEntries(definitions.map(b=>[b.id,{hp:b.hp,attackCooldown:0,claimed:false,engaged:false}]))}:undefined;
}
export function bossEnemies(m:Pick<MatchState,'bosses'>,includeDead=false):Enemy[]{
 return Object.entries(m.bosses?.guardians??{}).filter(([,v])=>includeDead||v.hp>0).map(([id,v])=>{const b=bossDefinitions[id as BossId];return {id:bossEnemyId(b.id),boss:b.id,kind:'unit',owner:'enemy',position:{...b.position},hp:v.hp,attackCooldown:v.attackCooldown,...(!v.engaged?{order:{kind:'idle' as const}}:{})};});
}
export const battleEnemies=(m:Pick<MatchState,'bosses'|'combat'>)=>[...m.combat.enemies,...bossEnemies(m)];
export const bossLootPosition=(id:BossId)=>({x:bossDefinitions[id].position.x,y:bossDefinitions[id].position.y+bossRules.lootOffset});
/** Old claimed saves belong to player. Reward income is separate from harvested resources. */
export function bossBonus(m:Pick<MatchState,'bosses'>,owner:'player'|'enemy'='player'){const bonus={wood:0,gold:0};for(const [id,v]of Object.entries(m.bosses?.guardians??{}))if(v.claimed&&(v.claimedBy??'player')===owner){const r=bossDefinitions[id as BossId].reward;bonus.wood+=r.wood;bonus.gold+=r.gold;}return bonus;}
/** Combat-only neutral projection. Guardians never join a player's victory/army roster. */
export function prepareBossCombat(m:MatchState,combat:CombatState):CombatState {
 if(!m.bosses)return combat;
 return {...combat,enemies:[...combat.enemies,...bossEnemies(m).map(e=>{
  const near=(p:{x:number;y:number})=>Math.hypot(p.x-e.position.x,p.y-e.position.y)<=bossRules.range;
  const human=playerTargets(m.gathering,combat,m.placement,m.navy).some(t=>t.hp>0&&near({x:t.footprint.x+t.footprint.width/2,y:t.footprint.y+t.footprint.height/2})),ai=combat.enemies.some(t=>!t.boss&&t.hp>0&&near(t.position));
  if(!human&&!ai)return {...e,hp:bossDefinitions[e.boss!].hp,attackCooldown:0,order:{kind:'idle' as const}};
  const discovered=!!m.fog&&(human&&isVisible(m.fog,'player',e.position)||ai&&isVisible(m.fog,'enemy',e.position));
  return {...e,order:m.bosses!.guardians[e.boss!]!.engaged||discovered?undefined:{kind:'idle' as const}};
 })]};
}
export function finishBossCombat(m:MatchState,combat:CombatState):Pick<MatchState,'bosses'|'combat'> {
 if(!m.bosses)return {combat};
 const guardians={...m.bosses.guardians};
 for(const [id,value]of Object.entries(guardians)){if(value.hp<=0)continue;const survivor=combat.enemies.find(e=>e.boss===id);guardians[id as BossId]={...value,hp:survivor?.hp??0,attackCooldown:survivor?.attackCooldown??0,engaged:!!survivor&&survivor.order?.kind!=='idle'};}
 const alive=new Set(Object.entries(guardians).filter(([,v])=>v.hp>0).map(([id])=>bossEnemyId(id as BossId)));
 return {bosses:{version:1,guardians},combat:{...combat,enemies:combat.enemies.filter(e=>!e.boss).map(e=>e.order?.kind==='defend'&&e.order.targetId.startsWith('enemy-boss-')&&!alive.has(e.order.targetId)?{...e,navigation:undefined,order:{kind:'idle' as const}}:e)}};
}
export function isBossLootGoal(m:Pick<MatchState,'bosses'>,enemy:Enemy):boolean{return Object.entries(m.bosses?.guardians??{}).some(([id,v])=>{const p=bossLootPosition(id as BossId);return v.hp===0&&!v.claimed&&enemy.work?.order.kind==='move'&&enemy.work.target.x===p.x&&enemy.work.target.y===p.y;});}
/** AI searches only currently seen unclaimed hoards, using one reachable empty non-builder. */
export function prepareEnemyBossLoot(m:MatchState):MatchState{
 if(!m.bosses||!m.fog||!m.enemyProduction||m.paused||m.outcome!=='playing')return m;
 for(const [id,v]of Object.entries(m.bosses.guardians)){
  const p=bossLootPosition(id as BossId);if(v.hp>0||v.claimed||!isVisible(m.fog,'enemy',p))continue;
  if(m.combat.enemies.some(e=>e.hp>0&&isBossLootGoal(m,e)))continue;
  const workers=m.combat.enemies.filter(e=>e.kind==='worker'&&e.hp>0&&e.work?.cargo===0&&['idle','move','gather'].includes(e.work.order.kind)).sort((a,b)=>Math.hypot(a.position.x-p.x,a.position.y-p.y)-Math.hypot(b.position.x-p.x,b.position.y-p.y)||a.id.localeCompare(b.id));
  for(const w of workers){const navigation=planRoute(enemyNavigationMap(m.map),w.position,p);if(navigation.status==='blocked')continue;return {...m,combat:{...m.combat,enemies:m.combat.enemies.map(e=>e===w?{...e,navigation,work:{...e.work!,target:p,order:{kind:'move'}}}:e)}};}
 }
 return m;
}
/** A distance/ID ordered worker race commits one finite reward to exactly its owner. */
export function updateBossRewards(m:MatchState):MatchState {
 if(!m.bosses||m.paused||m.outcome!=='playing'||!m.fog)return m;
 let next=m;
 for(const [id,v]of Object.entries(m.bosses.guardians)){if(v.hp>0||v.claimed)continue;const b=bossDefinitions[id as BossId],p=bossLootPosition(b.id);
  const candidates=[...m.gathering.units.filter(u=>u.kind==='worker'&&(u.hp??0)>0).map(u=>({id:u.id,owner:'player' as const,position:u.position})),...m.combat.enemies.filter(e=>e.kind==='worker'&&e.hp>0&&e.work&&!!m.enemyProduction).map(e=>({id:e.id,owner:'enemy' as const,position:e.position}))].filter(u=>isVisible(m.fog!,u.owner,p)&&Math.hypot(u.position.x-p.x,u.position.y-p.y)<=bossRules.collectRange&&segmentFits(u.owner==='enemy'?enemyNavigationMap(m.map):m.map,u.position,p,12)).sort((a,b)=>Math.hypot(a.position.x-p.x,a.position.y-p.y)-Math.hypot(b.position.x-p.x,b.position.y-p.y)||a.id.localeCompare(b.id));
  const worker=candidates[0];if(!worker)continue;
  next={...next,bosses:{version:1,guardians:{...next.bosses!.guardians,[id]:{...v,claimed:true,claimedBy:worker.owner}}},...(worker.owner==='player'?{gathering:{...next.gathering,wood:next.gathering.wood+b.reward.wood,goldBalance:(next.gathering.goldBalance??0)+b.reward.gold}}:{enemyProduction:{...next.enemyProduction!,wood:next.enemyProduction!.wood+b.reward.wood,gold:next.enemyProduction!.gold+b.reward.gold}})};
 }
 return next;
}
