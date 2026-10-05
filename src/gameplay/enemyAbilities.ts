import {isAir} from './domains';
import {canInteract} from './approach';
import {advanceAbilities,useAbility} from './abilities';
import {enemySoldier,enemyUnitStats} from './enemyUnits';
import {playerTargets} from './targets';
import {entityVisible} from './visibility';
import {defaultFactions} from '../config/factions';
import type {MatchState} from './match';
/** Only own combatants with a currently visible target in attack range self-buff. */
export function prepareEnemyAbilities(m:MatchState):MatchState{
 const faction=(m.factions??defaultFactions).enemy,targets=playerTargets(m.gathering,m.combat,m.placement,m.navy);
 const enemies=m.combat.enemies.map(e=>{
  if(isAir(e)||!e.role||e.hp<=0||e.order?.kind==='idle'||e.order?.kind==='muster'||(e.ability?.cooldownSeconds??0)>1e-9)return e;
  const range=enemyUnitStats(e,faction).range;
  const target=targets.find(t=>(e.order?.kind!=='defend'||t.id===e.order.targetId)&&(!m.fog||entityVisible(m.fog,'enemy',{position:{x:t.footprint.x+t.footprint.width/2,y:t.footprint.y+t.footprint.height/2},...(t.kind==='soldier'||t.kind==='worker'||t.kind==='ship'?{}:{footprint:t.footprint})}))&&canInteract({...m.map,bodyHalf:enemyUnitStats(e,faction).size/2},e.position,t.footprint,range));
  if(!target)return e;
  const result=useAbility({...m.gathering,faction,units:[{...enemySoldier(e,faction),selected:true}]});
  const u=result.units[0];return {...e,...(u.kind==='soldier'&&u.ability?{ability:u.ability}:{})};
 });
 return {...m,combat:{...m.combat,enemies}};
}
export function advanceEnemyAbilities(m:MatchState,delta:number):MatchState{
 const faction=(m.factions??defaultFactions).enemy;
 const result=advanceAbilities({...m.gathering,faction,units:m.combat.enemies.filter(e=>e.role).map(e=>enemySoldier(e,faction))},delta);
 const byId=new Map(result.units.map(u=>[u.id,u]));
 return {...m,combat:{...m.combat,enemies:m.combat.enemies.map(e=>{const u=byId.get(e.id);return u?.kind==='soldier'&&u.ability?{...e,ability:u.ability}:e;})}};
}
