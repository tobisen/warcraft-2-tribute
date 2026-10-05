import {playerEliminated,teamOutcome} from './teamResults';
import {matchFog} from './matchFog';
import {withGateRules} from './gates';
import {enemyBody} from './enemyBody';
import {abilityEffects} from './abilities';
import {untilSpellBoundary} from './enemySpells';
import type {PlayerDefinition,PlayerId} from '../config/players';
import {supportedPlayerCounts} from '../config/players';
import {createMatch,updateMatch,type MatchState} from './match';
import {playerStart,validatePlayerStarts,canHarm,canSupport} from './players';
import {createFog,updateFog,type FogTeam,type VisionObserver} from './fog';
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

export interface AIContext {buildSites:Position[];muster:Position;attackWaypoints:Position[];gateFriendly?:boolean;humanHostile?:boolean;sharedObservers?:VisionObserver[];visionSide?:'player'|'enemy';helpBases?:import('./placement').Footprint[]}
export interface AIPlayer {id:Exclude<PlayerId,'player'>;state:MatchState;vision:FogTeam}
export interface MultiplePlayers {roster:PlayerDefinition[];ai:AIPlayer[];kills:Record<PlayerId,number>}
export function globalEntityId(player:PlayerId,id:string):string{return player==='ai-2'?`${player}:${id}`:id;}
function alliedObservers(m:MatchState,id:PlayerId):VisionObserver[]{
 if(!m.multiplePlayers)return [];
 const observers=id!=='player'&&!playerEliminated(m,'player')&&canSupport(id,'player',m.multiplePlayers.roster)?visionObservers(m).filter(o=>o.owner==='player'):[];
 return [...observers,...m.multiplePlayers.ai.filter(bot=>bot.id!==id&&!playerEliminated(m,bot.id)&&canSupport(id,bot.id,m.multiplePlayers!.roster)).flatMap(bot=>visionObservers(bot.state).filter(o=>o.owner==='enemy'))];
}
export function aiContext(m:MatchState,id:PlayerId):AIContext{
 const base=playerStart(m.map.id??'arena',id);
 const helpBases=id==='player'?[]:[...(canSupport(id,'player',m.multiplePlayers?.roster)&&m.combat.baseHP>0?playerTargets(m.gathering,m.combat).filter(t=>t.kind==='base').map(t=>t.footprint):[]),...(m.multiplePlayers?.ai.filter(bot=>bot.id!==id&&!playerEliminated(m,bot.id)&&canSupport(id,bot.id,m.multiplePlayers!.roster)).flatMap(bot=>bot.state.combat.enemies.filter(e=>e.kind==='base'&&e.hp>0).map(e=>e.footprint!))??[])];
 const hostileStart=m.multiplePlayers?.roster.find(p=>!playerEliminated(m,p.id)&&canHarm(id,p.id,m.multiplePlayers!.roster)),search=hostileStart?playerStart(m.map.id??'arena',hostileStart.id):undefined;
 return {humanHostile:!playerEliminated(m,'player')&&canHarm(id,'player',m.multiplePlayers?.roster),helpBases,sharedObservers:alliedObservers(m,id),visionSide:id==='player'?'player':'enemy',gateFriendly:canSupport(id,'player',m.multiplePlayers?.roster),buildSites:[{x:base.x-192,y:base.y+96},{x:base.x+96,y:base.y+96},{x:base.x-192,y:base.y-96},{x:base.x+96,y:base.y-96}],muster:{x:base.x-144,y:base.y+176},
  attackWaypoints:[{x:base.x-256,y:base.y+224},search?{x:Math.max(32,search.x-160),y:search.y+160}:{x:704,y:480},search??{x:448,y:480}]};
}
export function initializeMultiplePlayers(m:MatchState,roster:PlayerDefinition[]):MatchState{
 if(roster.length<3)return m;
 if(m.scenario!=='skirmish'||!supportedPlayerCounts(m.map.id??'arena',m.scenario).includes(roster.length)||!validatePlayerStarts(m.map.id??'arena',roster))throw Error('Unsupported player starts');
 const ai:AIPlayer[]=roster.filter(p=>p.controller==='ai').map(p=>{
  let state=createMatch('skirmish',m.difficulty,{player:m.factions!.player,enemy:p.faction},m.map.id,m.speed,p.profile);
  const from=playerStart(m.map.id??'arena','enemy'),to=playerStart(m.map.id??'arena',p.id),dx=to.x-from.x,dy=to.y-from.y;
  const shift=(point:Position)=>({x:point.x+dx,y:point.y+dy});
  state={...state,combat:{...state.combat,enemies:state.combat.enemies.map(e=>({...e,position:shift(e.position),...(e.footprint?{footprint:{...e.footprint,...shift(e.footprint)}}:{}),...(e.work?{work:{...e.work,target:shift(e.work.target)}}:{})}))}};
  const bot={id:p.id as AIPlayer['id'],state,vision:createFog(m.map).teams.enemy};return {...bot,vision:actorVision(m,bot)};
 });
 return shareTeamVision(projectMultiplePlayers({...m,multiplePlayers:{roster:roster.map(p=>({...p})),ai,kills:{player:0,enemy:0,'ai-2':0}}}));
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
 return withGateRules({...m,aiContext:undefined,map:{...m.map,obstacles,revision:m.map.revision+Number(!unchanged)},combat:{...m.combat,enemies,projectiles:[...(m.combat.projectiles??[]).filter(p=>!p.owner),...multi.ai.flatMap(bot=>(bot.state.combat.projectiles??[]).filter(p=>p.owner==='enemy').map(p=>({...p,id:globalEntityId(bot.id,p.id),shooterId:p.shooterId?globalEntityId(bot.id,p.shooterId):undefined})))]},
  ...(m.fog?{fog:{...m.fog,teams:{...m.fog.teams,enemy:multi.ai.find(p=>p.id==='enemy')!.vision}}}:{}),
  enemyProduction:primary.enemyProduction,enemyAI:primary.enemyAI,enemyConstruction:primary.enemyConstruction,enemyPolicy:primary.enemyPolicy,enemyRecovery:primary.enemyRecovery,enemyKnowledge:primary.enemyKnowledge,armyPlan:primary.armyPlan});
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
 const own=actor==='player'||playerEliminated(m,'player')||!canHarm(actor,'player',m.multiplePlayers?.roster)?[]:playerTargets(m.gathering,m.combat,m.placement,m.navy);
 return [...own,...m.combat.enemies.filter(e=>e.playerId!==actor&&!playerEliminated(m,e.playerId??'enemy')&&canHarm(actor,e.playerId??'enemy',m.multiplePlayers?.roster)).map(e=>({id:e.id,owner:'player' as const,hp:e.hp,kind:e.kind==='worker'?'worker' as const:e.kind==='base'?'base' as const:e.footprint?'barracks' as const:'soldier' as const,domain:e.role==='air'?'air' as const:undefined,
  footprint:enemyBody(e)}))];
}
export function shareTeamVision(m:MatchState):MatchState{
 if(!m.multiplePlayers||!m.fog)return m;
 const multi=m.multiplePlayers,visions=new Map<PlayerId,FogTeam>([['player',m.fog.teams.player],...multi.ai.map(bot=>[bot.id,bot.vision] as [PlayerId,FogTeam])]);
 const shared=new Map<PlayerId,FogTeam>();
 for(const player of multi.roster){const allies=multi.roster.filter(p=>canSupport(player.id,p.id,multi.roster));shared.set(player.id,{visible:visions.get(player.id)!.visible.map((_,i)=>allies.some(p=>!playerEliminated(m,p.id)&&visions.get(p.id)!.visible[i])),explored:visions.get(player.id)!.explored.map((_,i)=>allies.some(p=>visions.get(p.id)!.explored[i]))});}
 return {...m,fog:{...m.fog,teams:{player:shared.get('player')!,enemy:shared.get('enemy')!}},multiplePlayers:{...multi,ai:multi.ai.map(bot=>({...bot,vision:shared.get(bot.id)!}))}};
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
 const observers=[...(playerEliminated(m,bot.id)?[]:visionObservers(bot.state)).filter(o=>o.owner==='enemy'),...alliedObservers(m,bot.id).map(o=>({...o,owner:'enemy' as const}))];
 return updateFog(old,observers,terrainPatches(m.map).filter(t=>t.kind==='rock').map(t=>({x:t.column*32,y:t.row*32,width:t.columns*32,height:t.rows*32}))).teams.enemy;
}
function updateHuman(m:MatchState,delta:number,damage:Map<string,number>):MatchState{
 const human={...m,aiContext:aiContext(m,'player'),combat:{...m.combat,projectiles:m.combat.projectiles?.filter(p=>!p.owner)},multiplePlayers:undefined,enemyProduction:undefined,enemyAI:undefined,enemyConstruction:undefined,enemyPolicy:undefined,enemyRecovery:undefined,enemyKnowledge:undefined,armyPlan:undefined};
 return updateMatch(human,delta,{side:'player',canTarget:e=>!playerEliminated(m,e.playerId??'enemy')&&canHarm('player',e.playerId??'enemy',m.multiplePlayers?.roster),onDamage:d=>{for(const [id,n] of d){damage.set(id,(damage.get(id)??0)+n);}}});
}
/** One bounded shared slice: each body/economy moves once; outgoing hits merge after all actors. */
export function updateMultiplePlayers(m:MatchState,delta:number):MatchState{
 if(m.paused||m.outcome!=='playing')return m;
 m={...cleanDestroyed(m),multiplePlayers:{...m.multiplePlayers!,ai:m.multiplePlayers!.ai.map(bot=>({...bot,state:cleanDestroyed(bot.state)}))}};
 let remaining=Math.max(0,delta),current=projectMultiplePlayers(m);
 current.outcome=teamOutcome(current);
 if(current.outcome!=='playing')return shareTeamVision(current);
 while(remaining>1e-9&&current.outcome==='playing'){
  const timed={...current,gathering:{...current.gathering,units:playerEliminated(current,'player')?[]:current.gathering.units},combat:{...current.combat,enemies:current.combat.enemies.filter(e=>!playerEliminated(current,e.playerId??'enemy'))}};
  const activeTimes=[...timed.gathering.units.flatMap(u=>u.kind==='soldier'?[u.ability?.activeSeconds??0]:[]),...timed.combat.enemies.map(e=>e.ability?.activeSeconds??0)].filter(t=>t>1e-9);
  const step=Math.min(remaining,.25,untilSpellBoundary(timed),...activeTimes),snapshot=current,damage=new Map<string,number>(),sources=new Map<string,PlayerId>();
  const foreignEffects=new Map<string,import('./spells').SpellEffect[]>();
  let human=playerEliminated(snapshot,'player')?{...snapshot,waves:{...snapshot.waves,elapsedSeconds:snapshot.waves.elapsedSeconds+step},combat:{...snapshot.combat,projectiles:[]}}:updateHuman(snapshot,step,damage);for(const id of damage.keys())sources.set(id,'player');
  const ai=snapshot.multiplePlayers!.ai.map(bot=>{
   if(playerEliminated(snapshot,bot.id))return {...bot,state:{...bot.state,waves:{...human.waves},combat:{...bot.state.combat,projectiles:[]}}};
   const roster=snapshot.multiplePlayers!.roster.find(p=>p.id===bot.id)!;
   const vision=actorVision(snapshot,bot),fog=createFog(snapshot.map);fog.teams.enemy=vision;
   const hostiles=targets(snapshot,bot.id),foreign=snapshot.multiplePlayers!.ai.filter(other=>!playerEliminated(snapshot,other.id)&&canHarm(bot.id,other.id,snapshot.multiplePlayers!.roster)).flatMap(other=>other.state.combat.enemies.flatMap(e=>{
    if(e.footprint)return [];const u=e.kind==='worker'?enemyWorker(e):enemySoldier(e,snapshot.multiplePlayers!.roster.find(p=>p.id===other.id)!.faction);return u?[{...u,id:globalEntityId(other.id,e.id)}]:[];
   }));
   const context=aiContext(snapshot,bot.id),remembered=bot.state.enemyKnowledge?.playerBase;
   // Eliminations are public match events; no hidden living base/position is read here.
   const retired=!!remembered&&!snapshot.multiplePlayers!.roster.some(p=>!playerEliminated(snapshot,p.id)&&canHarm(bot.id,p.id,snapshot.multiplePlayers!.roster)&&(()=>{const start=playerStart(snapshot.map.id??'arena',p.id);return start.x===remembered.x&&start.y===remembered.y;})());
   const knownBase=hostiles.filter(t=>t.kind==='base'&&entityVisible(fog,'enemy',{position:{x:t.footprint.x+t.footprint.width/2,y:t.footprint.y+t.footprint.height/2},footprint:t.footprint})).sort((a,b)=>a.id.localeCompare(b.id))[0];
   let view:MatchState={...bot.state,multiplePlayers:undefined,aiContext:context,map:human.map,fog,paused:false,outcome:'playing',factions:{player:snapshot.factions!.player,enemy:roster.faction},aiProfile:roster.profile,
    gathering:{...human.gathering,units:[...(!playerEliminated(snapshot,'player')&&canHarm(bot.id,'player',snapshot.multiplePlayers!.roster)?snapshot.gathering.units.map(u=>({...u,selected:false})):[]),...foreign]},placement:snapshot.placement,navy:undefined,production:{remainingSeconds:null,nextUnitNumber:4},soldierProduction:{remainingSeconds:null,nextUnitNumber:4},controlGroups:{},wildlife:{},waves:{...snapshot.waves},
    combat:{...bot.state.combat,baseHP:snapshot.combat.baseHP,...(retired?{enemies:bot.state.combat.enemies.map(e=>e.order?.kind==='attack-move'&&e.order.destination.x===remembered!.x&&e.order.destination.y===remembered!.y?{...e,navigation:undefined,order:{kind:'attack-move' as const,destination:context.attackWaypoints[0]}}:e)}:{})},
    ...(retired&&bot.state.enemyKnowledge?{enemyKnowledge:{...bot.state.enemyKnowledge,playerBase:null,attackScoutIndex:0}}:{}),
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
  human=freezeEliminated(human);human.outcome=teamOutcome(human);
  current=projectMultiplePlayers(human);current={...current,fog:matchFog(current)};
  current=shareTeamVision(current);remaining-=step;
 }
 return current;
}

function freezeEliminated(m:MatchState):MatchState{
 const human=playerEliminated(m,'player');
 return {...m,...(human?{gathering:{...m.gathering,units:m.gathering.units.map(u=>({...u,selected:false,order:{kind:'idle' as const},target:{...u.position},orderQueue:undefined,commandMode:undefined,navigation:undefined}))},combat:{...m.combat,projectiles:[]},...(m.navy?{navy:{...m.navy,ships:m.navy.ships.map(s=>({...s,selected:false,order:{kind:'idle' as const},orderQueue:undefined,commandMode:undefined,navigation:undefined}))}}:{})}:{}),multiplePlayers:{...m.multiplePlayers!,ai:m.multiplePlayers!.ai.map(bot=>!playerEliminated(m,bot.id)?bot:{...bot,state:{...bot.state,combat:{...bot.state.combat,projectiles:[],enemies:bot.state.combat.enemies.map(e=>({...e,navigation:undefined,order:e.kind==='worker'?undefined:{kind:'idle' as const},...(e.work?{work:{...e.work,order:{kind:'idle' as const}}}:{})}))}}})}};
}

/** Rebuild legacy current vision from active observers, retaining explored team history. */
export function refreshTeamVision(m:MatchState):MatchState{
 const next={...m,multiplePlayers:{...m.multiplePlayers!,ai:m.multiplePlayers!.ai.map(bot=>({...bot,vision:actorVision(m,bot)}))}};
 return shareTeamVision({...next,fog:matchFog(next)});
}
