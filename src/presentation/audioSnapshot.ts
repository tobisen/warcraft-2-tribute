import type {MatchState} from '../gameplay/match';
import {combatConfig} from '../config/combat';
import {isVisible} from '../gameplay/fog';
import {barracksReady} from '../gameplay/construction';
import type {AudioSnapshot} from './audioPolicy';
/** Public activity only: callers supply visibility-filtered enemies, never hidden economy. */
export function matchAudioSnapshot(m:MatchState,visibleEnemies:MatchState['combat']['enemies']):AudioSnapshot{
 const g=m.gathering,p=m.placement,n=m.navy;
 return {
  baseHP:m.combat.baseHP,outcome:m.outcome,
  own:Object.fromEntries([...g.units.map(u=>[u.id,u.hp??combatConfig.workerHP]),...(n?.ships??[]).map(s=>[s.id,s.hp])]),
  visibleEnemies:Object.fromEntries(visibleEnemies.map(e=>[e.id,e.hp])),
  navalShots:(m.combat.projectiles??[]).filter(s=>s.marine).map(s=>({id:s.id,audible:!m.fog||isVisible(m.fog,'player',s.position)})),
  work:Object.fromEntries(g.units.filter(u=>u.kind==='worker'&&u.order.kind==='gather').map(u=>[u.id,u.cargo])),
  construction:Object.fromEntries([...(p.construction?[['barracks',p.construction.remainingSeconds]]:[]),...(p.farms??[]).map(f=>[f.id,f.construction.remainingSeconds]),...(p.forge?[['forge',p.forge.construction.remainingSeconds]]:[]),...(n?.harbor?[['harbor',n.harbor.construction.remainingSeconds]]:[])]),
  production:m.production.nextUnitNumber+m.soldierProduction.nextUnitNumber+((n?.production.nextUnitNumber??1)-1),
  completed:[...(n?.harbor?.construction.remainingSeconds===0?['harbor']:[]),...(barracksReady(p)?['barracks']:[]),...(p.farms??[]).filter(f=>f.construction.remainingSeconds===0).map(f=>f.id),...(p.forge?.construction.remainingSeconds===0?['forge']:[])],
 };
}
