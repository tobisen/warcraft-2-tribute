import type {MatchState} from '../gameplay/match';
import {combatConfig} from '../config/combat';
import {isVisible} from '../gameplay/fog';
import {barracksReady} from '../gameplay/construction';
import type {AudioSnapshot} from './audioPolicy';
import {voiceRole} from './voicePolicy';
import {resourceNodes} from '../gameplay/gathering';
import {mapDiscoveries} from '../config/discoveries';
/** Public activity only: callers supply visibility-filtered enemies, never hidden economy. */
export function matchAudioSnapshot(m:MatchState,visibleEnemies:MatchState['combat']['enemies']):AudioSnapshot{
 const g=m.gathering,p=m.placement,n=m.navy;
 return {
  baseHP:m.combat.baseHP,outcome:m.outcome,
  readyUnits:g.units.filter(u=>u.owner===undefined||u.owner==='player').map(u=>({id:u.id,role:voiceRole(u),faction:('faction' in u?u.faction:undefined)??m.factions?.player??g.faction??'crown'})),
  own:Object.fromEntries([...g.units.map(u=>[u.id,u.hp??combatConfig.workerHP]),...(n?.ships??[]).map(s=>[s.id,s.hp])]),
  visibleEnemies:Object.fromEntries(visibleEnemies.map(e=>[e.id,e.hp])),
  navalShots:(m.combat.projectiles??[]).filter(s=>s.marine).map(s=>({id:s.id,audible:!m.fog||isVisible(m.fog,'player',s.position)})),
  work:Object.fromEntries(g.units.filter(u=>u.kind==='worker'&&u.order.kind==='gather'&&(u.owner===undefined||u.owner==='player')).map(u=>[u.id,u.cargo])),
  workMaterials:Object.fromEntries(g.units.flatMap(u=>{
   if(u.kind!=='worker'||u.order.kind!=='gather'||u.owner!==undefined&&u.owner!=='player')return [];
   const id=u.order.nodeId,node=resourceNodes(g).find(n=>n.id===id);return node?[[u.id,node.resource??'wood']]:[];
  })),
  treasures:mapDiscoveries(m.map.id??'arena',m.map.design).filter(d=>d.kind==='treasure'&&m.discoveries?.claimed.includes(d.id)).map(d=>d.id),
  construction:Object.fromEntries([...(p.construction?[['barracks',p.construction.remainingSeconds]]:[]),...(p.farms??[]).map(f=>[f.id,f.construction.remainingSeconds]),...(p.forge?[['forge',p.forge.construction.remainingSeconds]]:[]),...(p.academy?[['academy',p.academy.construction.remainingSeconds]]:[]),...(p.bases??[]).map(b=>[b.id,b.construction.remainingSeconds]),...(p.defenses??[]).map(d=>[d.id,d.construction.remainingSeconds]),...(n?.harbor?[['harbor',n.harbor.construction.remainingSeconds]]:[])]),
  production:m.production.nextUnitNumber+m.soldierProduction.nextUnitNumber+((n?.production.nextUnitNumber??1)-1),
  completed:[...(n?.harbor?.construction.remainingSeconds===0?['harbor']:[]),...(barracksReady(p)?['barracks']:[]),...(p.farms??[]).filter(f=>f.construction.remainingSeconds===0).map(f=>f.id),...(p.forge?.construction.remainingSeconds===0?['forge']:[]),...(p.academy?.construction.remainingSeconds===0?['academy']:[]),...(p.bases??[]).filter(b=>b.construction.remainingSeconds===0).map(b=>b.id),...(p.defenses??[]).filter(d=>d.construction.remainingSeconds===0).map(d=>d.id)],
 };
}
