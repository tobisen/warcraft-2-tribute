import {maps,type SeaMonsterArea} from '../config/maps';
import type {Difficulty} from '../config/difficulty';
import {seaMonsterRules,seaMonsterCounts,seaMonsterEnemyId} from '../config/bosses';
import {domainMap} from './terrainNavigation';
import {bodyFits,terrainPatches,type WorldMap} from './map';
import {footprintDistance} from './approach';
import {advanceRoute} from './navigation';
import {attackStep} from './navalCombat';
import {navyConfig} from '../config/navy';
import type {PlayerTarget} from './targets';
import {playerTargets} from './targets';
import {bossDefinitions,bossRules,mapBosses,bossEnemyId,type BossId} from '../config/bosses';
import type {MatchState} from './match';
import type {Enemy,CombatState} from './combat';
import {isVisible} from './fog';
import {segmentFits,planRoute} from './navigation';
import {enemyNavigationMap} from './map';
export interface BossRecord {hp:number;attackCooldown:number;claimed:boolean;claimedBy?:'player'|'enemy';engaged:boolean}
export interface SeaMonsterRecord {id:string;hp:number;position:{x:number;y:number};attackCooldown:number;patrolIndex:number}
export interface BossState {sea?:SeaMonsterRecord[];version:1;guardians:Partial<Record<BossId,BossRecord>>}
export function createBosses(map:MatchState['map'],difficulty?:Difficulty):BossState|undefined {
 const definitions=map.design==='regions'?mapBosses(map.id??'arena'):[];
 const sea=difficulty?createSeaMonsters(map,difficulty):[];
 return definitions.length||sea.length?{...(sea.length?{sea}:{}),version:1,guardians:Object.fromEntries(definitions.map(b=>[b.id,{hp:b.hp,attackCooldown:0,claimed:false,engaged:false}]))}:undefined;
}
export function bossEnemies(m:Pick<MatchState,'bosses'>,includeDead=false):Enemy[]{
 return [...seaMonsterEnemies(m,includeDead),...Object.entries(m.bosses?.guardians??{}).filter(([,v])=>includeDead||v.hp>0).map(([id,v])=>{const b=bossDefinitions[id as BossId];return {id:bossEnemyId(b.id),boss:b.id,kind:'unit' as const,owner:'enemy' as const,position:{...b.position},hp:v.hp,attackCooldown:v.attackCooldown,...(!v.engaged?{order:{kind:'idle' as const}}:{})};})];
}
export const battleEnemies=(m:Pick<MatchState,'bosses'|'combat'>)=>[...m.combat.enemies,...bossEnemies(m)];
export const bossLootPosition=(id:BossId)=>({x:bossDefinitions[id].position.x,y:bossDefinitions[id].position.y+bossRules.lootOffset});
/** Old claimed saves belong to player. Reward income is separate from harvested resources. */
export function bossBonus(m:Pick<MatchState,'bosses'>,owner:'player'|'enemy'='player'){const bonus={wood:0,gold:0};for(const [id,v]of Object.entries(m.bosses?.guardians??{}))if(v.claimed&&(v.claimedBy??'player')===owner){const r=bossDefinitions[id as BossId].reward;bonus.wood+=r.wood;bonus.gold+=r.gold;}return bonus;}
/** Combat-only neutral projection. Guardians never join a player's victory/army roster. */
export function prepareBossCombat(m:MatchState,combat:CombatState):CombatState {
 if(!m.bosses)return combat;
 return {...combat,enemies:[...combat.enemies,...bossEnemies(m).map(e=>{
  if(e.seaMonster)return {...e,seaMonster:{...e.seaMonster,active:!!m.fog&&isVisible(m.fog,'player',e.position)}};
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
 const sea=m.bosses.sea?.map(v=>{const survivor=combat.enemies.find(e=>e.id===seaMonsterEnemyId(v.id));return {...v,hp:survivor?.hp??0,position:survivor?.position??v.position,attackCooldown:survivor?.attackCooldown??0,patrolIndex:survivor?.seaMonster?.patrolIndex??v.patrolIndex};});
 for(const v of sea??[])if(v.hp>0)alive.add(seaMonsterEnemyId(v.id));
 return {bosses:{...(sea?{sea}:{}),version:1,guardians},combat:{...combat,enemies:combat.enemies.filter(e=>!e.boss&&!e.seaMonster).map(e=>e.order?.kind==='defend'&&(e.order.targetId.startsWith('enemy-boss-')||e.order.targetId.startsWith('enemy-sea-monster-'))&&!alive.has(e.order.targetId)?{...e,navigation:undefined,order:{kind:'idle' as const}}:e)}};
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

// Keep obstacle identity stable so shared collision/goal-tree caches survive ordinary patrol steps.
const seaWaterCache=new WeakMap<WorldMap['obstacles'],Map<string,WorldMap['obstacles']>>();
/** Author-defined areas are clipped by actual terrain and dynamic obstacles, never by guessed tiles. */
export function seaMonsterWater(map:WorldMap,zone:SeaMonsterArea):WorldMap {
 const water=domainMap(map,'water'),a=zone.area,key=`${map.width}:${map.height}:${a.x}:${a.y}:${a.width}:${a.height}`;
 let areas=seaWaterCache.get(water.obstacles);if(!areas){areas=new Map();seaWaterCache.set(water.obstacles,areas);}
 let obstacles=areas.get(key);if(!obstacles){obstacles=[...water.obstacles,
 {x:0,y:0,width:map.width,height:a.y},{x:0,y:a.y+a.height,width:map.width,height:Math.max(0,map.height-a.y-a.height)},
 {x:0,y:a.y,width:a.x,height:a.height},{x:a.x+a.width,y:a.y,width:Math.max(0,map.width-a.x-a.width),height:a.height}];areas.set(key,obstacles);}
 return {...water,bodyHalf:seaMonsterRules.size/2,obstacles};
}
export function validSeaMonsterAreas(map:WorldMap):SeaMonsterArea[]{
 if(map.design!=='regions')return [];
 return (maps[map.id??'arena'].seaMonsters?.areas??[]).filter(zone=>{
  const water=seaMonsterWater(map,zone);
  return zone.patrol.length>=2&&zone.patrol.every(p=>bodyFits(water,p,seaMonsterRules.size/2))&&zone.patrol.every(p=>planRoute(water,zone.patrol[0],p).status!=='blocked');
 });
}
export function createSeaMonsters(map:WorldMap,difficulty:Difficulty):SeaMonsterRecord[]{
 return validSeaMonsterAreas(map).slice(0,Math.min(seaMonsterCounts[difficulty],maps[map.id??'arena'].seaMonsters?.cap??0)).map(z=>({id:z.id,hp:seaMonsterRules.hp,position:{...z.patrol[0]},attackCooldown:0,patrolIndex:1}));
}
function seaMonsterEnemies(m:Pick<MatchState,'bosses'>,includeDead=false):Enemy[]{
 return (m.bosses?.sea??[]).filter(v=>includeDead||v.hp>0).map(v=>({id:seaMonsterEnemyId(v.id),kind:'ship',owner:'enemy',position:{...v.position},hp:v.hp,attackCooldown:v.attackCooldown,seaMonster:{id:v.id,patrolIndex:v.patrolIndex}}));
}
/** At most one tile of beach. Rectangle edges let coastal buildings qualify without using their centers. */
export function seaMonsterTarget(map:WorldMap,zone:SeaMonsterArea,t:PlayerTarget):boolean {
 if(t.hp<=0||t.boss||t.domain==='air')return false;
 const a=zone.area,f=t.footprint;
 if(f.x+f.width<a.x-seaMonsterRules.range||f.x>a.x+a.width+seaMonsterRules.range||f.y+f.height<a.y-seaMonsterRules.range||f.y>a.y+a.height+seaMonsterRules.range)return false;
 const margin=t.kind==='ship'?0:['worker','soldier'].includes(t.kind)?seaMonsterRules.shoreRange:1,patches=terrainPatches(map);
 for(const patch of patches){
  if(patch.kind!=='water')continue;
  const left=Math.max(patch.column*32,Math.floor((f.x-margin)/32)*32),right=Math.min((patch.column+patch.columns)*32,f.x+f.width+margin),top=Math.max(patch.row*32,Math.floor((f.y-margin)/32)*32),bottom=Math.min((patch.row+patch.rows)*32,f.y+f.height+margin);
  for(let y=top;y<bottom;y+=32)for(let x=left;x<right;x+=32){
   // Closest interior water point; coastline distance is measured to the target footprint.
   const p={x:Math.max(x+.01,Math.min(x+31.99,f.x+f.width/2)),y:Math.max(y+.01,Math.min(y+31.99,f.y+f.height/2))};
   if(footprintDistance(p,f)<=margin+1e-6&&!patches.some(q=>q.kind==='rock'&&p.x>=q.column*32&&p.x<(q.column+q.columns)*32&&p.y>=q.row*32&&p.y<(q.row+q.rows)*32))return true;
  }
 }
 return false;
}
/** Shared combat adapter: human targets only, bounded naval pursuit, then resume the authored patrol. */
export function seaMonsterStep(enemy:Enemy,targets:readonly PlayerTarget[],map:WorldMap,delta:number){
 const state=enemy.seaMonster!,zone=maps[map.id??'arena'].seaMonsters?.areas.find(z=>z.id===state.id),rules=seaMonsterRules;
 if(!zone)return {enemy,damage:0,target:undefined};
 const water=seaMonsterWater(map,zone);
 const target=state.active?targets.filter(t=>seaMonsterTarget(map,zone,t)&&footprintDistance(enemy.position,t.footprint)<=rules.aggroRange).sort((a,b)=>(a.kind==='ship'?0:a.domain==='building'||!['worker','soldier'].includes(a.kind)?2:1)-(b.kind==='ship'?0:b.domain==='building'||!['worker','soldier'].includes(b.kind)?2:1)||footprintDistance(enemy.position,a.footprint)-footprintDistance(enemy.position,b.footprint)||a.id.localeCompare(b.id))[0]:undefined;
 let cooldown=Math.max(0,(enemy.attackCooldown??0)-delta);
 if(target){
  const center={x:target.footprint.x+target.footprint.width/2,y:target.footprint.y+target.footprint.height/2};
  const ship={...enemy,kind:'ship' as const,owner:'player' as const,role:'warship' as const,selected:false,target:enemy.position,order:{kind:'attack' as const,enemyId:target.id}};
  const step=attackStep(ship,{id:target.id,hp:target.hp,position:center,...(!['ship','worker','soldier'].includes(target.kind)?{footprint:target.footprint}:{}),kind:target.kind==='ship'?'ship':'unit'},delta,map,{...navyConfig.ship,...rules,targets:['sea','land','building']},water);
  let time=step.attackSeconds,damage=0;cooldown=Math.max(0,(enemy.attackCooldown??0)-(delta-time));
  while(time>0&&time+1e-9>=cooldown){time=Math.max(0,time-cooldown);damage+=rules.damage;cooldown=rules.attackInterval;}
  if(step.navigation?.status!=='blocked')return {enemy:{...enemy,position:step.position,attackCooldown:Math.max(0,cooldown-time)},target,damage};
  // An unreachable firing position must not pin a patrol against its leash or a rock.
 }
 const goal=zone.patrol[state.patrolIndex],route=planRoute(water,enemy.position,goal),step=advanceRoute(water,enemy.position,route,rules.speed,delta);
 return {enemy:{...enemy,position:step.position,attackCooldown:cooldown,seaMonster:{...state,patrolIndex:step.route.status==='arrived'?(state.patrolIndex+1)%zone.patrol.length:state.patrolIndex}},target:undefined,damage:0};
}
