import {defenseConfig} from '../config/defenses';
import {baseFootprint,type BuildingSelection} from './buildingSelection';
import {entityVisible} from './visibility';
import {enemyMaximumHP} from './enemyUnits';
import {factionForTeam} from '../config/factions';
import type {MatchState} from './match';
import type {Footprint} from './placement';
import type {Position} from './movement';
export function inspectedBuilding(m:MatchState,selection:BuildingSelection){
 if(!selection)return null;
 const producer=m.placement.producers?.find(p=>p.id===selection);if(producer){const faction=factionForTeam(m,'player');return producer.hp>0?{team:'player' as const,kind:producer.kind,faction,footprint:producer.footprint,hp:producer.hp,maxHP:producer.kind==='harbor'?faction.naval.harbor.hp:faction.buildings[producer.kind].hp,remaining:producer.construction.remainingSeconds}:null;}
 const enemy=selection.startsWith('enemy:')?m.combat.enemies.find(e=>e.id===selection.slice(6)&&e.hp>0&&!!e.footprint&&(e.kind==='base'||e.kind==='building')):undefined;
 if(selection.startsWith('enemy:')&&(!enemy||!m.fog||!entityVisible(m.fog,'player',enemy)))return null;
 const team=enemy?'enemy':'player',faction=factionForTeam(m,team);
 const expansion=m.placement.bases?.find(b=>b.id===selection);
 if(selection.startsWith('base-')&&!expansion||selection==='siegeWorks'&&!m.placement.siegeWorks||selection==='aviary'&&!m.placement.aviary||selection==='stable'&&!m.placement.stable||selection==='academy'&&!m.placement.academy)return null;
 const tower=m.placement.defenses?.find(t=>t.id===selection);
 const kind=expansion?'base':tower?tower.kind:enemy?(enemy.kind==='base'?'base':enemy.buildingType??'barracks'):selection.startsWith('farm-')?'farm':selection as 'siegeWorks'|'aviary'|'stable'|'academy'|'base'|'barracks'|'forge'|'harbor';
 const farm=m.placement.farms?.find(f=>f.id===selection),forge=m.placement.forge,harbor=m.navy?.harbor;
 const academy=selection==='siegeWorks'?m.placement.siegeWorks:selection==='aviary'?m.placement.aviary:selection==='stable'?m.placement.stable:selection==='academy'?m.placement.academy:undefined;
 const footprint=academy?.footprint??expansion?.footprint??tower?.footprint??enemy?.footprint??(kind==='base'?m.combat.baseHP>0?baseFootprint(m.gathering.base):null:kind==='barracks'?m.placement.barracks:kind==='farm'?farm?.footprint:kind==='forge'?forge?.footprint:harbor?.footprint);
 const maxHP=kind==='tower'||kind==='wall'||kind==='gate'?defenseConfig[kind].hp:enemy?enemyMaximumHP(enemy,faction.id):kind==='harbor'?faction.naval.harbor.hp:kind==='outpost'?0:faction.buildings[kind].hp;
 const hp=academy?.hp??expansion?.hp??tower?.hp??enemy?.hp??(kind==='base'?m.combat.baseHP:kind==='barracks'?m.placement.barracksHP??maxHP:kind==='farm'?farm?.hp??maxHP:kind==='forge'?forge?.hp:harbor?.hp);
 if(!footprint||hp===undefined||hp<=0)return null;
 const remaining=academy?.construction.remainingSeconds??expansion?.construction.remainingSeconds??tower?.construction.remainingSeconds??enemy?.construction?.remainingSeconds??(kind==='barracks'?m.placement.construction?.remainingSeconds:kind==='farm'?farm?.construction.remainingSeconds:kind==='forge'?forge?.construction.remainingSeconds:kind==='harbor'?harbor?.construction.remainingSeconds:0)??0;
 return {team,kind,faction,footprint,hp,maxHP,remaining} as const;
}
export function inspectBuildingAt(m:MatchState,point:Position):BuildingSelection{
 const hit=(r:Footprint)=>point.x>=r.x&&point.x<=r.x+r.width&&point.y>=r.y&&point.y<=r.y+r.height;
 const candidates:BuildingSelection[]=[...(m.placement.producers??[]).map(p=>p.id),...(m.placement.bases??[]).map(b=>b.id),...(m.placement.defenses??[]).map(t=>t.id),'siegeWorks','aviary','stable','academy','harbor','forge',...(m.placement.farms??[]).map(f=>f.id),'barracks','base',...m.combat.enemies.filter(e=>e.footprint).map(e=>`enemy:${e.id}` as const)];
 return candidates.find(id=>{const b=inspectedBuilding(m,id);return b&&hit(b.footprint);})??null;
}
/** New inspection-only selections are transient; preserve the established Save33 view format. */
export function savedBuildingSelection(selection:BuildingSelection):'base'|'barracks'|'harbor'|null{
 return selection==='base'||selection==='barracks'||selection==='harbor'?selection:null;
}
