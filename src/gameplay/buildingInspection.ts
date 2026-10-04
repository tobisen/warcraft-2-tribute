import {baseFootprint,type BuildingSelection} from './buildingSelection';
import {entityVisible} from './visibility';
import {enemyMaximumHP} from './enemyUnits';
import {factionForTeam} from '../config/factions';
import type {MatchState} from './match';
import type {Footprint} from './placement';
import type {Position} from './movement';
export function inspectedBuilding(m:MatchState,selection:BuildingSelection){
 if(!selection)return null;
 const enemy=selection.startsWith('enemy:')?m.combat.enemies.find(e=>e.id===selection.slice(6)&&e.hp>0&&!!e.footprint&&(e.kind==='base'||e.kind==='building')):undefined;
 if(selection.startsWith('enemy:')&&(!enemy||!m.fog||!entityVisible(m.fog,'player',enemy)))return null;
 const team=enemy?'enemy':'player',faction=factionForTeam(m,team);
 const kind=enemy?(enemy.kind==='base'?'base':enemy.buildingType??'barracks'):selection.startsWith('farm-')?'farm':selection as 'base'|'barracks'|'forge'|'harbor';
 const farm=m.placement.farms?.find(f=>f.id===selection),forge=m.placement.forge,harbor=m.navy?.harbor;
 const footprint=enemy?.footprint??(kind==='base'?m.combat.baseHP>0?baseFootprint(m.gathering.base):null:kind==='barracks'?m.placement.barracks:kind==='farm'?farm?.footprint:kind==='forge'?forge?.footprint:harbor?.footprint);
 const maxHP=enemy?enemyMaximumHP(enemy,faction.id):kind==='harbor'?faction.naval.harbor.hp:kind==='outpost'?0:faction.buildings[kind].hp;
 const hp=enemy?.hp??(kind==='base'?m.combat.baseHP:kind==='barracks'?m.placement.barracksHP??maxHP:kind==='farm'?farm?.hp??maxHP:kind==='forge'?forge?.hp:harbor?.hp);
 if(!footprint||hp===undefined||hp<=0)return null;
 const remaining=enemy?.construction?.remainingSeconds??(kind==='barracks'?m.placement.construction?.remainingSeconds:kind==='farm'?farm?.construction.remainingSeconds:kind==='forge'?forge?.construction.remainingSeconds:kind==='harbor'?harbor?.construction.remainingSeconds:0)??0;
 return {team,kind,faction,footprint,hp,maxHP,remaining} as const;
}
export function inspectBuildingAt(m:MatchState,point:Position):BuildingSelection{
 const hit=(r:Footprint)=>point.x>=r.x&&point.x<=r.x+r.width&&point.y>=r.y&&point.y<=r.y+r.height;
 const candidates:BuildingSelection[]=['harbor','forge',...(m.placement.farms??[]).map(f=>f.id),'barracks','base',...m.combat.enemies.filter(e=>e.footprint).map(e=>`enemy:${e.id}` as const)];
 return candidates.find(id=>{const b=inspectedBuilding(m,id);return b&&hit(b.footprint);})??null;
}
/** New inspection-only selections are transient; preserve the established Save33 view format. */
export function savedBuildingSelection(selection:BuildingSelection):'base'|'barracks'|'harbor'|null{
 return selection==='base'||selection==='barracks'||selection==='harbor'?selection:null;
}
