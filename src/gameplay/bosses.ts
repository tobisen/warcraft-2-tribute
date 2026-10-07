import {playerTargets} from './targets';
import {bossDefinitions,bossRules,mapBosses,bossEnemyId,type BossId} from '../config/bosses';
import type {MatchState} from './match';
import type {Enemy,CombatState} from './combat';
import {isAir} from './domains';
import {isVisible} from './fog';
import {segmentFits} from './navigation';
export interface BossRecord {hp:number;attackCooldown:number;claimed:boolean;engaged:boolean}
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
export function bossBonus(m:Pick<MatchState,'bosses'>){const bonus={wood:0,gold:0};for(const [id,v]of Object.entries(m.bosses?.guardians??{}))if(v.claimed){const r=bossDefinitions[id as BossId].reward;bonus.wood+=r.wood;bonus.gold+=r.gold;}return bonus;}
/** Start a combat-only projection: campaign/AI/outcome state never sees the guardians as troops. */
export function prepareBossCombat(m:MatchState,combat:CombatState):CombatState {
 if(!m.bosses)return combat;
 return {...combat,enemies:[...combat.enemies,...bossEnemies(m).map(e=>playerTargets(m.gathering,combat,m.placement,m.navy).some(t=>t.hp>0&&Math.hypot(t.footprint.x+t.footprint.width/2-e.position.x,t.footprint.y+t.footprint.height/2-e.position.y)<=bossRules.range)?{...e,order:m.bosses!.guardians[e.boss!]!.engaged||!!m.fog&&isVisible(m.fog,'player',e.position)?undefined:{kind:'idle' as const}}:{...e,hp:bossDefinitions[e.boss!].hp,attackCooldown:0,order:{kind:'idle' as const}})]};
}
export function finishBossCombat(m:MatchState,combat:CombatState):Pick<MatchState,'bosses'|'combat'> {
 if(!m.bosses)return {combat};
 const guardians={...m.bosses.guardians};
 for(const [id,value]of Object.entries(guardians)){if(value.hp<=0)continue;const survivor=combat.enemies.find(e=>e.boss===id);guardians[id as BossId]={...value,hp:survivor?.hp??0,attackCooldown:survivor?.attackCooldown??0,engaged:!!survivor&&survivor.order?.kind!=='idle'};}
 return {bosses:{version:1,guardians},combat:{...combat,enemies:combat.enemies.filter(e=>!e.boss)}};
}
export function updateBossRewards(m:MatchState):MatchState {
 if(!m.bosses||m.paused||m.outcome!=='playing'||!m.fog)return m;
 let next=m;
 for(const [id,v]of Object.entries(m.bosses.guardians)){if(v.hp>0||v.claimed)continue;const b=bossDefinitions[id as BossId],p=bossLootPosition(b.id);
  if(!isVisible(m.fog,'player',p)||!m.gathering.units.some(u=>!isAir(u)&&(u.hp??1)>0&&Math.hypot(u.position.x-p.x,u.position.y-p.y)<=bossRules.collectRange&&segmentFits(m.map,u.position,p,12)))continue;
  next={...next,bosses:{version:1,guardians:{...next.bosses!.guardians,[id]:{...v,claimed:true}}},gathering:{...next.gathering,wood:next.gathering.wood+b.reward.wood,goldBalance:(next.gathering.goldBalance??0)+b.reward.gold}};
 }
 return next;
}
