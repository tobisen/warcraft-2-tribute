import {campaignActionReason} from '../config/campaignContent';
import {playerEliminated} from './teamResults';
import {syncProjectedCombat} from './multiplePlayers';
import {canHarm,canSupport,ownerOf} from './players';
import {isAir} from './domains';
import {factionSpells,spellDefinition,spellIds,type SpellId} from '../config/spells';
import {factions,defaultFactions,type FactionId} from '../config/factions';
import {entityVisible} from './visibility';
import {enemyMaximumHP} from './enemyUnits';
import type {Soldier,Unit} from './gathering';
import type {Enemy} from './combat';
import type {MatchState} from './match';
import type {Position} from './movement';
export interface SpellEffect {spell:SpellId;sourceFaction:FactionId;remainingSeconds:number}
export interface SpellState {spellCooldowns?:Partial<Record<SpellId,number>>;spellEffects?:SpellEffect[]}
type Combatant=Soldier|Enemy;
const teamFaction=(m:MatchState,team:'player'|'enemy')=>(m.factions??defaultFactions)[team];
function combatant(m:MatchState,id:string,team:'player'|'enemy'):Combatant|undefined{return team==='player'?m.gathering.units.find((u):u is Soldier=>u.kind==='soldier'&&!isAir(u)&&u.id===id):m.combat.enemies.find(e=>e.id===id&&!isAir(e)&&!e.footprint&&(e.kind===undefined||e.kind==='unit'));}
export function spellCasterReason(m:MatchState,casterId:string,id:SpellId,team:'player'|'enemy'='player'):string|null{
 if(team==='player'){const locked=campaignActionReason(m,'cast-heal');if(locked)return locked;}
 if(m.paused||m.outcome!=='playing'||!!m.multiplePlayers&&m.combat.baseHP<=0)return 'Match is paused or ended';
 const caster=combatant(m,casterId,team),faction=teamFaction(m,team),cfg=spellDefinition(id,faction);
 if(!caster||caster.hp<=0||('archetype'in caster?caster.archetype!=='specialist':!('role'in caster)||caster.role!=='specialist'))return 'Select a living own specialist';
 if(!factionSpells[faction].includes(id))return 'Spell unavailable to this faction';
 if((caster.spellCooldowns?.[id]??0)>1e-9)return `Cooldown ${(caster.spellCooldowns![id]!).toFixed(1)}s`;
 if((caster.mana??factions[faction].units.specialist.mana!.initial)+1e-9<cfg.manaCost)return `Needs ${cfg.manaCost} mana`;
 return null;
}
export function selectedSpellCaster(m:MatchState,id:SpellId):Soldier|undefined{const units=m.gathering.units.filter((u):u is Soldier=>u.kind==='soldier'&&u.archetype==='specialist'&&u.hp>0&&u.selected).sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}));return units.find(u=>!spellCasterReason(m,u.id,id))??units[0];}
export function spellTargetReason(m:MatchState,casterId:string,id:SpellId,targetId:string,team:'player'|'enemy'='player'):string|null{
 const reason=spellCasterReason(m,casterId,id,team);if(reason)return reason;
 const cfg=spellDefinition(id,teamFaction(m,team)),targetTeam=cfg.targetTeam==='ally'?team:team==='player'?'enemy':'player',target=combatant(m,targetId,targetTeam)??(cfg.targetTeam==='ally'&&m.multiplePlayers?m.combat.enemies.find(e=>e.id===targetId&&!isAir(e)&&!e.footprint&&e.kind==='unit'):undefined),caster=combatant(m,casterId,team)!;
 if(!target||target.hp<=0)return 'Choose a living '+(cfg.targetTeam==='ally'?'allied':'hostile')+' ground combat unit';
 if(m.multiplePlayers){const casterOwner=team==='player'?'player':ownerOf(caster as Enemy),targetOwner=m.gathering.units.some(u=>u.id===targetId)?'player':ownerOf(target as Enemy);if(playerEliminated(m,targetOwner))return 'Player eliminated';if(cfg.targetTeam==='ally'?!canSupport(casterOwner,targetOwner,m.multiplePlayers.roster):!canHarm(casterOwner,targetOwner,m.multiplePlayers.roster))return 'Invalid player relation';}
 if(m.fog&&!entityVisible(m.fog,team,target))return 'Target outside current vision';
 if(Math.hypot(target.position.x-caster.position.x,target.position.y-caster.position.y)>cfg.range+1e-9)return `Target outside ${cfg.range}px range`;
 if(cfg.kind==='heal'){const role='kind'in target&&target.kind==='soldier'?target.archetype??'soldier':'role'in target?target.role??'soldier':'soldier';const maximum=target.kind==='soldier'?factions[teamFaction(m,'player')].units[role].hp:enemyMaximumHP(target as Enemy,teamFaction(m,targetTeam));if(target.hp>=maximum)return 'Target at full HP';}
 return null;
}
/** IDs are resolved at commit time; invalid/cancelled targeting has no resource or cooldown mutation. */
export function castSpell(m:MatchState,casterId:string,id:SpellId,targetId:string,team:'player'|'enemy'='player'):{match:MatchState;reason:string|null}{
 const reason=spellTargetReason(m,casterId,id,targetId,team);if(reason)return {match:m,reason};
 const faction=teamFaction(m,team),cfg=spellDefinition(id,faction),targetTeam=cfg.targetTeam==='ally'&&m.multiplePlayers?(m.gathering.units.some(u=>u.id===targetId)?'player':'enemy'):cfg.targetTeam==='ally'?team:team==='player'?'enemy':'player';
 const change=(u:Combatant,unitTeam:'player'|'enemy'):Combatant=>{let next=u;if(u.id===casterId&&unitTeam===team)next={...next,mana:(u.mana??factions[faction].units.specialist.mana!.initial)-cfg.manaCost,spellCooldowns:{...u.spellCooldowns,[id]:cfg.cooldown}};
  if(u.id===targetId&&unitTeam===targetTeam){if(cfg.kind==='heal'){const role='kind'in u&&u.kind==='soldier'?u.archetype??'soldier':'role'in u?u.role??'soldier':'soldier';next={...next,hp:Math.min(targetTeam==='player'?factions[teamFaction(m,targetTeam)].units[role].hp:enemyMaximumHP(u as Enemy,teamFaction(m,targetTeam)),u.hp+cfg.healHP!)};}else next={...next,spellEffects:[...(next.spellEffects??[]).filter(e=>spellDefinition(e.spell,e.sourceFaction).kind!==cfg.kind),{spell:id,sourceFaction:faction,remainingSeconds:cfg.duration}]};}return next;};
 return {reason:null,match:syncProjectedCombat({...m,gathering:{...m.gathering,units:m.gathering.units.map((u):Unit=>u.kind==='soldier'?change(u,'player') as Soldier:u)},combat:{...m.combat,enemies:m.combat.enemies.map(e=>change(e,'enemy') as Enemy)}})};
}
export function spellTargetAt(m:MatchState,id:SpellId,point:Position,team:'player'|'enemy'='player'):string|undefined{const cfg=spellDefinition(id,teamFaction(m,team)),targetTeam=cfg.targetTeam==='ally'?team:team==='player'?'enemy':'player',candidates=targetTeam==='player'?[...m.gathering.units.filter(u=>u.kind==='soldier'&&!isAir(u)),...(cfg.targetTeam==='ally'&&m.multiplePlayers?m.combat.enemies.filter(e=>!isAir(e)&&!e.footprint&&e.kind==='unit'&&canSupport('player',ownerOf(e),m.multiplePlayers!.roster)):[])]:m.combat.enemies.filter(e=>!isAir(e)&&!e.footprint&&(e.kind===undefined||e.kind==='unit'));return candidates.find(u=>u.hp!>0&&(!m.multiplePlayers||!spellTargetReason(m,'player'===team?selectedSpellCaster(m,id)?.id??'':m.combat.enemies.find(e=>e.role==='specialist')?.id??'',id,u.id,team))&&(!m.fog||entityVisible(m.fog,team,u))&&Math.abs(u.position.x-point.x)<=16&&Math.abs(u.position.y-point.y)<=16)?.id;}
export function spellModifiers(u:SpellState,elapsed=0){let attack=1,defense=1;for(const effect of u.spellEffects??[])if(effect.remainingSeconds>elapsed+1e-9){const cfg=spellDefinition(effect.spell,effect.sourceFaction);attack*=cfg.attackMultiplier??1;defense*=cfg.defenseMultiplier??1;}return {attack,defense};}
export function advanceSpells(m:MatchState,delta:number):MatchState{
 if(m.paused||m.outcome!=='playing'||!!m.multiplePlayers&&m.combat.baseHP<=0||delta<=0)return m;
 const active=(u:SpellState)=>u.spellEffects?.some(e=>e.remainingSeconds>0)||Object.values(u.spellCooldowns??{}).some(v=>v>0);if(!m.gathering.units.some(u=>u.kind==='soldier'&&active(u))&&!m.combat.enemies.some(active)&&!m.navy?.ships.some(s=>s.passengers?.some(u=>u.kind==='soldier'&&active(u)))&&!m.enemyNaval?.passengers.some(active))return m;
 const tick=<T extends SpellState>(u:T):T=>!u.spellCooldowns&&!u.spellEffects?u:{...u,...(u.spellCooldowns?{spellCooldowns:Object.fromEntries(spellIds.filter(id=>u.spellCooldowns![id]!==undefined).map(id=>[id,Math.max(0,u.spellCooldowns![id]!-delta)]))}:{}),...(u.spellEffects?{spellEffects:u.spellEffects.map(e=>({...e,remainingSeconds:Math.max(0,e.remainingSeconds-delta)})).filter(e=>e.remainingSeconds>1e-9)}:{})};
 return {...m,gathering:{...m.gathering,units:m.gathering.units.map(u=>u.kind==='soldier'?tick(u):u)},combat:{...m.combat,enemies:m.combat.enemies.map(tick)},...(m.navy?{navy:{...m.navy,ships:m.navy.ships.map(s=>({...s,passengers:s.passengers?.map(u=>u.kind==='soldier'?tick(u):u)}))}}:{}),...(m.enemyNaval?{enemyNaval:{...m.enemyNaval,passengers:m.enemyNaval.passengers.map(tick)}}:{})};
}
