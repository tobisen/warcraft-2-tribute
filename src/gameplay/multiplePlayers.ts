import {enemyBody} from './enemyBody';
import {abilityEffects} from './abilities';
import {untilSpellBoundary} from './enemySpells';
import type {PlayerDefinition,PlayerId} from '../config/players';
import {supportedPlayerCounts} from '../config/players';
import {createMatch,updateMatch,type MatchState} from './match';
import {playerStart,validatePlayerStarts,canHarm} from './players';
import {createFog,updateFog,type FogTeam} from './fog';
import {visionObservers} from './matchFog';
import {entityVisible} from './visibility';
import {enemySoldier} from './enemyUnits';
import {enemyWorker} from './enemyGathering';
import {playerTargets,type PlayerTarget} from './targets';
import type {Enemy} from './combat';
import type {Position} from './movement';
import {cleanDestroyed} from './destruction';
import {spellModifiers,type SpellEffect} from './spells';
import {spellDefinition} from '../config/spells';
import type {Unit,Soldier} from './gathering';
import {factions} from '../config/factions';
import {placementObstacles} from './placement';
import {createMap,terrainPatches} from './map';

export interface AIContext {buildSites:Position[];muster:Position;attackWaypoints:Position[]}
export interface AIPlayer {id:Exclude<PlayerId,'player'>;state:MatchState;vision:FogTeam}
export interface MultiplePlayers {roster:PlayerDefinition[];ai:AIPlayer[];kills:Record<PlayerId,number>}
export function globalEntityId(player:PlayerId,id:string):string{return player==='ai-2'?`${player}:${id}`:id;}
export function aiContext(m:MatchState,id:PlayerId):AIContext{
 const base=playerStart(m.map.id??'arena',id);
 return {buildSites:[{x:base.x-192,y:base.y+96},{x:base.x+96,y:base.y+96},{x:base.x-192,y:base.y-96},{x:base.x+96,y:base.y-96}],muster:{x:base.x-144,y:base.y+176},
  attackWaypoints:[{x:base.x-256,y:base.y+224},{x:704,y:480},{x:448,y:480}]};
}
export function initializeMultiplePlayers(m:MatchState,roster:PlayerDefinition[]):MatchState{
 if(roster.length<3)return m;
 if(m.scenario!=='skirmish'||!supportedPlayerCounts(m.map.id??'arena',m.scenario).includes(roster.length)||!validatePlayerStarts(m.map.id??'arena',roster))throw Error('Unsupported player starts');
 const ai:AIPlayer[]=roster.filter(p=>p.controller==='ai').map(p=>{
  let state=createMatch('skirmish',m.difficulty,{player:m.factions!.player,enemy:p.faction},m.map.id,m.speed,p.profile);
  const from=playerStart(m.map.id??'arena','enemy'),to=playerStart(m.map.id??'arena',p.id),dx=to.x-from.x,dy=to.y-from.y;
  const shift=(point:Position)=>({x:point.x+dx,y:point.y+dy});
  state={...state,combat:{...state.combat,enemies:state.combat.enemies.map(e=>({...e,position:shift(e.position),...(e.footprint?{footprint:{...e.footprint,...shift(e.footprint)}}:{}),...(e.work?{work:{...e.work,target:shift(e.work.target)}}:{})}))}};
  const fog=createFog(m.map);return {id:p.id as AIPlayer['id'],state,vision:fog.teams.enemy};
 });
 return projectMultiplePlayers({...m,multiplePlayers:{roster:roster.map(p=>({...p})),ai,kills:{player:0,enemy:0,'ai-2':0}}});
}
export function projectedEnemies(m:MatchState):Enemy[]{
 return m.multiplePlayers!.ai.flatMap(bot=>{
 const p=m.multiplePlayers!.roster.find(p=>p.id===bot.id)!;
 return bot.state.combat.enemies.map(e=>({...e,id:globalEntityId(bot.id,e.id),playerId:bot.id,faction:p.faction}));
 });
}
/** Root is the human's UI view. Each AI owns its private economy/queue/research/knowledge. */
export function projectMultiplePlayers(m:MatchState):MatchState{
 const multi=m.multiplePlayers!;
 const enemies=projectedEnemies(m);
 const own=[...placementObstacles(m.gathering).slice(m.combat.baseHP>0?0:1),...(m.placement.barracks?[m.placement.barracks]:[]),...(m.placement.forge?[m.placement.forge.footprint]:[]),...(m.placement.farms??[]).map(f=>f.footprint),...(m.placement.defenses??[]).filter(t=>t.kind!=='gate'||!t.open).map(t=>t.footprint),...(m.navy?.harbor?[m.navy.harbor.footprint]:[])];
 const obstacles=[...createMap(m.map.id,m.map.terrainLayout).obstacles,...own,...enemies.flatMap(e=>e.footprint?[e.footprint]:[])];
 const unchanged=JSON.stringify(obstacles)===JSON.stringify(m.map.obstacles);
 const primary=multi.ai.find(p=>p.id==='enemy')!.state;
 return {...m,map:{...m.map,obstacles,revision:m.map.revision+Number(!unchanged)},combat:{...m.combat,enemies,projectiles:[...(m.combat.projectiles??[]).filter(p=>!p.owner),...multi.ai.flatMap(bot=>(bot.state.combat.projectiles??[]).filter(p=>p.owner==='enemy').map(p=>({...p,id:globalEntityId(bot.id,p.id),shooterId:p.shooterId?globalEntityId(bot.id,p.shooterId):undefined})))]},
  ...(m.fog?{fog:{...m.fog,teams:{...m.fog.teams,enemy:multi.ai.find(p=>p.id==='enemy')!.vision}}}:{}),
  enemyProduction:primary.enemyProduction,enemyAI:primary.enemyAI,enemyConstruction:primary.enemyConstruction,enemyPolicy:primary.enemyPolicy,enemyRecovery:primary.enemyRecovery,enemyKnowledge:primary.enemyKnowledge,armyPlan:primary.armyPlan};
}
/** Commit human spell effects into the authoritative owning AI, preserving local IDs. */
export function syncProjectedCombat(m:MatchState):MatchState{
 if(!m.multiplePlayers)return m;
 const byId=new Map(m.combat.enemies.map(e=>[e.id,e]));
 return {...m,multiplePlayers:{...m.multiplePlayers,ai:m.multiplePlayers.ai.map(bot=>({...bot,state:{...bot.state,combat:{...bot.state.combat,enemies:bot.state.combat.enemies.map(e=>{
 const updated=byId.get(globalEntityId(bot.id,e.id));return updated?{...e,hp:updated.hp,mana:updated.mana,spellEffects:updated.spellEffects,spellCooldowns:updated.spellCooldowns}:e;
 })}}}))}};
}
function targets(m:MatchState,actor:PlayerId):PlayerTarget[]{
 const own=actor==='player'?[]:playerTargets(m.gathering,m.combat,m.placement,m.navy);
 return [...own,...m.combat.enemies.filter(e=>e.playerId!==actor&&canHarm(actor,e.playerId??'enemy')).map(e=>({id:e.id,owner:'player' as const,hp:e.hp,kind:e.kind==='worker'?'worker' as const:e.kind==='base'?'base' as const:e.footprint?'barracks' as const:'soldier' as const,domain:e.role==='air'?'air' as const:undefined,
  footprint:enemyBody(e)}))];
}
function playerDefense(m:MatchState,unit:Unit):number{
 if(unit.kind!=='soldier')return 1;
 const original=m.gathering.units.find((old):old is Soldier=>old.kind==='soldier'&&old.id===unit.id)??unit;
 return (m.research?.defense?factions[m.factions!.player].upgrades.defense.multiplier:1)*abilityEffects(m.gathering,original).defenseMultiplier*spellModifiers(original).defense;
}
function aiDefense(m:MatchState,id:PlayerId,entity:Enemy):number{
 if(entity.footprint||entity.kind==='worker')return 1;
 const before=m.multiplePlayers!.ai.find(bot=>bot.id===id)!.state;
 const original=before.combat.enemies.find(old=>old.id===entity.id)??entity,faction=before.factions!.enemy;
 return (before.enemyPolicy?.research.defense?factions[faction].upgrades.defense.multiplier:1)*abilityEffects({...before.gathering,faction},enemySoldier(original,faction)).defenseMultiplier*spellModifiers(original).defense;
}
function mergeEffects(current:SpellEffect[]|undefined,incoming:SpellEffect[]):SpellEffect[]{
 const channels=new Set(incoming.map(e=>spellDefinition(e.spell,e.sourceFaction).kind));
 return [...(current??[]).filter(e=>!channels.has(spellDefinition(e.spell,e.sourceFaction).kind)),...incoming];
}
function actorVision(m:MatchState,bot:AIPlayer):FogTeam{
 const old=createFog(m.map);old.teams.enemy=bot.vision;
 const observers=visionObservers(bot.state).filter(o=>o.owner==='enemy');
 return updateFog(old,observers,terrainPatches(m.map).filter(t=>t.kind==='rock').map(t=>({x:t.column*32,y:t.row*32,width:t.columns*32,height:t.rows*32}))).teams.enemy;
}
function updateHuman(m:MatchState,delta:number,damage:Map<string,number>):MatchState{
 const human={...m,combat:{...m.combat,projectiles:m.combat.projectiles?.filter(p=>!p.owner)},multiplePlayers:undefined,enemyProduction:undefined,enemyAI:undefined,enemyConstruction:undefined,enemyPolicy:undefined,enemyRecovery:undefined,enemyKnowledge:undefined,armyPlan:undefined};
 return updateMatch(human,delta,{side:'player',onDamage:d=>{for(const [id,n] of d){damage.set(id,(damage.get(id)??0)+n);}}});
}
/** One bounded shared slice: each body/economy moves once; outgoing hits merge after all actors. */
export function updateMultiplePlayers(m:MatchState,delta:number):MatchState{
 if(m.paused||m.outcome!=='playing')return m;
 let remaining=Math.max(0,delta),current=projectMultiplePlayers(m);
 while(remaining>1e-9&&current.outcome==='playing'){
  const activeTimes=[...current.gathering.units.flatMap(u=>u.kind==='soldier'?[u.ability?.activeSeconds??0]:[]),...current.combat.enemies.map(e=>e.ability?.activeSeconds??0)].filter(t=>t>1e-9);
  const step=Math.min(remaining,.25,untilSpellBoundary(current),...activeTimes),snapshot=current,damage=new Map<string,number>(),sources=new Map<string,PlayerId>();
  const foreignEffects=new Map<string,import('./spells').SpellEffect[]>();
  let human=updateHuman(snapshot,step,damage);for(const id of damage.keys())sources.set(id,'player');
  const ai=snapshot.multiplePlayers!.ai.map(bot=>{
   const roster=snapshot.multiplePlayers!.roster.find(p=>p.id===bot.id)!;
   const vision=actorVision(snapshot,bot),fog=createFog(snapshot.map);fog.teams.enemy=vision;
   const hostiles=targets(snapshot,bot.id),foreign=snapshot.multiplePlayers!.ai.filter(other=>other.id!==bot.id).flatMap(other=>other.state.combat.enemies.flatMap(e=>{
    if(e.footprint)return [];const u=e.kind==='worker'?enemyWorker(e):enemySoldier(e,snapshot.multiplePlayers!.roster.find(p=>p.id===other.id)!.faction);return u?[{...u,id:globalEntityId(other.id,e.id)}]:[];
   }));
   const knownBase=hostiles.filter(t=>t.kind==='base'&&entityVisible(fog,'enemy',{position:{x:t.footprint.x+t.footprint.width/2,y:t.footprint.y+t.footprint.height/2},footprint:t.footprint})).sort((a,b)=>a.id.localeCompare(b.id))[0];
   let view:MatchState={...bot.state,multiplePlayers:undefined,aiContext:aiContext(snapshot,bot.id),map:human.map,fog,paused:false,outcome:'playing',factions:{player:snapshot.factions!.player,enemy:roster.faction},aiProfile:roster.profile,
    gathering:{...human.gathering,units:[...snapshot.gathering.units.map(u=>({...u,selected:false})),...foreign]},placement:{active:false,barracks:null,farms:[],nextFarmNumber:1},navy:undefined,production:{remainingSeconds:null,nextUnitNumber:4},soldierProduction:{remainingSeconds:null,nextUnitNumber:4},controlGroups:{},wildlife:{},waves:{...snapshot.waves},
    combat:{...bot.state.combat,baseHP:snapshot.combat.baseHP},
    ...(knownBase&&bot.state.enemyKnowledge?{enemyKnowledge:{...bot.state.enemyKnowledge,playerBase:{x:knownBase.footprint.x+knownBase.footprint.width/2,y:knownBase.footprint.y+knownBase.footprint.height/2}}}:{})};
   const beforeEffects=new Map(view.gathering.units.filter(u=>u.kind==='soldier').map(u=>[u.id,u.spellEffects??[]]));
   view=updateMatch(view,step,{side:'enemy',targets:hostiles,onDamage:d=>{for(const [id,n] of d){damage.set(id,(damage.get(id)??0)+n);sources.set(id,bot.id);}}});
   for(const u of view.gathering.units)if(u.kind==='soldier'){const changes=(u.spellEffects??[]).filter(effect=>!beforeEffects.get(u.id)?.some(old=>old.spell===effect.spell&&old.sourceFaction===effect.sourceFaction&&old.remainingSeconds>=effect.remainingSeconds));if(changes.length)foreignEffects.set(u.id,mergeEffects(foreignEffects.get(u.id),changes));}
   human={...human,map:view.map,gathering:{...human.gathering,node:view.gathering.node,gold:view.gathering.gold,extraNodes:view.gathering.extraNodes}};
   return {...bot,state:view,vision:view.fog!.teams.enemy};
  });
  human={...human,gathering:{...human.gathering,units:human.gathering.units.map(u=>({...u,...(u.kind==='soldier'&&foreignEffects.has(u.id)?{spellEffects:mergeEffects(u.spellEffects,foreignEffects.get(u.id)!)}:{}),hp:Math.max(0,u.hp!-(damage.get(u.id)??0)*playerDefense(snapshot,u))}))},combat:{...human.combat,baseHP:Math.max(0,human.combat.baseHP-(damage.get('base')??0))},multiplePlayers:{...snapshot.multiplePlayers!,ai:ai.map(bot=>({...bot,state:{...bot.state,combat:{...bot.state.combat,enemies:bot.state.combat.enemies.map(e=>({...e,...(foreignEffects.has(globalEntityId(bot.id,e.id))?{spellEffects:mergeEffects(e.spellEffects,foreignEffects.get(globalEntityId(bot.id,e.id))!)}:{}),hp:Math.max(0,e.hp-(damage.get(globalEntityId(bot.id,e.id))??0)*aiDefense(snapshot,bot.id,e))}))}}}))}};
  human={...human,placement:{...human.placement,barracksHP:human.placement.barracksHP===undefined?undefined:Math.max(0,human.placement.barracksHP-(damage.get('barracks')??0)),...(human.placement.forge?{forge:{...human.placement.forge,hp:Math.max(0,human.placement.forge.hp-(damage.get('forge')??0))}}:{}),farms:human.placement.farms?.map(f=>({...f,hp:Math.max(0,(f.hp??1)-(damage.get(f.id)??0))})),defenses:human.placement.defenses?.map(t=>({...t,hp:Math.max(0,t.hp-(damage.get(t.id)??0))}))},...(human.navy?{navy:{...human.navy,ships:human.navy.ships.map(s=>({...s,hp:Math.max(0,s.hp-(damage.get(s.id)??0)*(snapshot.research?.defense?factions[human.factions!.player].upgrades.defense.multiplier:1))})),harbor:human.navy.harbor?{...human.navy.harbor,hp:Math.max(0,human.navy.harbor.hp-(damage.get('harbor')??0))}:null}}:{})};
  const kills={...snapshot.multiplePlayers!.kills};
  const before=[...snapshot.gathering.units.map(u=>({id:u.id,hp:u.hp!})),...snapshot.combat.enemies.filter(e=>!e.footprint),...(snapshot.navy?.ships??[])];
  const after=new Map([...human.gathering.units.map(u=>[u.id,u.hp!] as const),...human.multiplePlayers!.ai.flatMap(bot=>bot.state.combat.enemies.map(e=>[globalEntityId(bot.id,e.id),e.hp] as const)),...(human.navy?.ships??[]).map(s=>[s.id,s.hp] as const)]);
  for(const unit of before)if(unit.hp>0&&(after.get(unit.id)??0)<=0&&sources.has(unit.id))kills[sources.get(unit.id)!]++;
  human={...cleanDestroyed(human),multiplePlayers:{...human.multiplePlayers!,kills,ai:human.multiplePlayers!.ai.map(bot=>({...bot,state:cleanDestroyed(bot.state)}))}};
  // Match elimination remains the existing base rule until team outcomes in RTS-176.
  human.outcome=human.combat.baseHP<=0?'defeat':human.multiplePlayers!.ai.every(bot=>!bot.state.combat.enemies.some(e=>e.kind==='base'))?'victory':'playing';
  current=projectMultiplePlayers(human);remaining-=step;
 }
 return current;
}
