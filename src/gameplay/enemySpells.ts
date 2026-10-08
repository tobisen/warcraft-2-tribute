import {factionSpells,spellAIConfig,spellDefinition} from '../config/spells';
import {defaultFactions} from '../config/factions';
import {castSpell,spellCasterReason,spellTargetReason} from './spells';
import {entityVisible} from './visibility';
import {enemyMaximumHP} from './enemyUnits';
import type {Soldier} from './gathering';
import type {MatchState} from './match';
/** A shared gameplay-time clock limits decisions to twice a second, including after Load. */
export function prepareEnemySpells(m:MatchState):MatchState{
 if(m.paused||m.outcome!=='playing'||Math.abs(m.waves.elapsedSeconds/spellAIConfig.decisionSeconds-Math.round(m.waves.elapsedSeconds/spellAIConfig.decisionSeconds))>1e-7)return m;
 const faction=(m.factions??defaultFactions).enemy,casterIds=m.combat.enemies.filter(e=>e.hp>0&&e.kind==='unit'&&e.role==='specialist').map(e=>e.id).sort((a,b)=>a.localeCompare(b,'en',{numeric:true}));
 for(const casterId of casterIds){
  const caster=m.combat.enemies.find(e=>e.id===casterId)!;
  const hostiles=m.gathering.units.filter((u):u is Soldier=>u.kind==='soldier'&&u.hp>0&&(!m.fog||entityVisible(m.fog,'enemy',u)));
  const allies=m.combat.enemies.filter(e=>e.hp>0&&!e.footprint&&(e.kind==='unit'||e.kind===undefined));
  const ordered=[...factionSpells[faction]].sort((a,b)=>({heal:0,debuff:1,buff:2}[spellDefinition(a,faction).kind]-{heal:0,debuff:1,buff:2}[spellDefinition(b,faction).kind]));
  for(const id of ordered){if(spellCasterReason(m,casterId,id,'enemy'))continue;const cfg=spellDefinition(id,faction),candidates=cfg.targetTeam==='ally'?allies:hostiles;
   const targets=candidates.filter(u=>!spellTargetReason(m,casterId,id,u.id,'enemy')).filter(u=>cfg.kind==='heal'?u.hp!/enemyMaximumHP(u as typeof caster,faction)<=spellAIConfig.healBelowFraction:!(u.spellEffects??[]).some(e=>spellDefinition(e.spell,e.sourceFaction).kind===cfg.kind&&e.remainingSeconds>spellAIConfig.refreshBelowSeconds)).filter(u=>cfg.kind!=='buff'||hostiles.some(h=>Math.hypot(h.position.x-u.position.x,h.position.y-u.position.y)<=spellAIConfig.engagementRange));
   targets.sort((a,b)=>cfg.kind==='heal'?a.hp!/enemyMaximumHP(a as typeof caster,faction)-b.hp!/enemyMaximumHP(b as typeof caster,faction)||a.id.localeCompare(b.id):Math.hypot(a.position.x-caster.position.x,a.position.y-caster.position.y)-Math.hypot(b.position.x-caster.position.x,b.position.y-caster.position.y)||a.id.localeCompare(b.id));
   if(targets[0]){m=castSpell(m,casterId,id,targets[0].id,'enemy').match;break;}
  }
 }
 return m;
}
export function untilSpellBoundary(m:MatchState):number{
 const effects=[...m.gathering.units.flatMap(u=>u.kind==='soldier'?u.spellEffects??[]:[]),...m.combat.enemies.flatMap(e=>e.spellEffects??[])];
 const expiry=Math.min(Infinity,...effects.map(e=>e.remainingSeconds).filter(t=>t>1e-9));
 const decision=(m.gathering.units.some(u=>u.kind==='soldier'&&u.hp>0&&u.archetype==='healer')||m.combat.enemies.some(e=>e.hp>0&&e.kind==='unit'&&(e.role==='specialist'||e.role==='healer')))?(Math.floor((m.waves.elapsedSeconds+1e-9)/spellAIConfig.decisionSeconds)+1)*spellAIConfig.decisionSeconds-m.waves.elapsedSeconds:Infinity;
 return Math.min(expiry,decision);
}
