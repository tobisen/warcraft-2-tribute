import {factionForTeam} from '../config/factions';
import {navyConfig} from '../config/navy';
import type {BuildingSelection} from '../gameplay/buildingSelection';
import type {MatchState} from '../gameplay/match';
import {artAtlas,motion,unitFrame,type UnitArt} from './animation';
import {buildingFrame} from './assets';
export interface SelectionInfo {name:string;detail:string;hp:number|null;maxHP:number|null;stats:string[];portrait:{atlas:'units'|'naval'|'buildings';frame:string}|null}
const empty=():SelectionInfo=>({name:'No selection',detail:'Click a unit or building, or drag to select a group.',hp:null,maxHP:null,stats:[],portrait:null});
/** Presentation only: reads selected player entities, never enemy or hidden resources. Stats are baseline recipes. */
export function selectionInfo(m:MatchState,building:BuildingSelection):SelectionInfo {
 const faction=factionForTeam(m,'player'),selected=[...m.gathering.units,...(m.navy?.ships??[])].filter(u=>u.selected);
 if(selected.length>1){const infos=selected.map(u=>selectionInfo({...m,gathering:{...m.gathering,units:m.gathering.units.map(x=>({...x,selected:x.id===u.id}))},navy:m.navy?{...m.navy,ships:m.navy.ships.map(x=>({...x,selected:x.id===u.id}))}:undefined},null));return {name:`${selected.length} units selected`,detail:'Right-click to command the group. Workers gather; combat units fight.',hp:infos.reduce((n,x)=>n+(x.hp??0),0),maxHP:infos.reduce((n,x)=>n+(x.maxHP??0),0),stats:['Combined health'],portrait:null};}
 const u=selected[0];
 if(u){const role:UnitArt=u.kind==='ship'?u.role??'warship':u.kind==='worker'?'worker':u.archetype??'soldier';const data=u.kind==='ship'?navyConfig.ship:faction.units[role as 'worker'|'soldier'|'archer'|'catapult'];const stats=[`Speed ${data.speed} px/s`,`Supply ${data.supply}`];
  if(u.kind==='worker')stats.push(`Cargo ${u.cargo.toFixed(1)} / ${faction.units.worker.capacity} ${u.cargoType??'wood'}`,`Gather ${faction.units.worker.gatherPerSecond}/s`);
  else if(role==='transport')stats.push(`Passengers ${u.kind==='ship'?(u.passengers?.length??0):0} / ${navyConfig.transport.capacity}`);
  else {const combat=u.kind==='ship'?navyConfig.ship:faction.units[role as 'soldier'|'archer'|'catapult'];if(combat.range!==undefined)stats.push(`Range ${combat.range} px`);if('damagePerSecond' in combat&&combat.damagePerSecond!==undefined)stats.push(`Damage ${combat.damagePerSecond}/s`);if(combat.damage!==undefined)stats.push(`Damage ${combat.damage}/hit`);}
  return {name:u.kind==='ship'?role==='transport'?'Transport':'Warship':faction.unitNames[role as 'worker'|'soldier'|'archer'|'catapult'],detail:`${u.id} · ${u.order.kind}`,hp:u.hp??data.hp,maxHP:data.hp,stats,portrait:{atlas:artAtlas(role),frame:unitFrame(motion(undefined,u.position,'idle',0,role,'player',undefined,faction.id),0)}};
 }
 if(!building)return empty();
 const harbor=m.navy?.harbor;if(building==='barracks'&&!m.placement.barracks||building==='harbor'&&!harbor||building==='base'&&m.combat.baseHP<=0)return empty();
 const hp=building==='base'?m.combat.baseHP:building==='barracks'?m.placement.barracksHP??faction.buildings.barracks.hp:harbor!.hp;
 const maxHP=building==='harbor'?navyConfig.harbor.hp:faction.buildings[building].hp;
 const remaining=building==='barracks'?m.placement.construction?.remainingSeconds??0:building==='harbor'?harbor!.construction.remainingSeconds:0;
 return {name:building==='harbor'?'Harbor':faction.buildingNames[building],detail:remaining>0?`Construction ${remaining.toFixed(1)}s remaining`:'Complete',hp,maxHP,stats:building==='base'?[`Supply capacity ${faction.buildings.base.populationCapacity}`]:['Select production actions to train units.'],portrait:{atlas:'buildings',frame:buildingFrame(building,'player',remaining,5,faction.id,hp)}};
}
export function renderSelectionInfo(info:SelectionInfo):void {
 document.getElementById('selection-name')!.textContent=info.name;document.getElementById('selection-detail')!.textContent=info.detail;
 document.getElementById('selection-health')!.textContent=info.hp===null?'':`HP ${Math.ceil(info.hp)} / ${info.maxHP}`;
 const health=document.getElementById('selection-health-bar') as HTMLProgressElement;health.hidden=info.hp===null;health.max=info.maxHP??1;health.value=info.hp??0;
 document.getElementById('selection-stats')!.textContent=info.stats.length?'Baseline stats · '+info.stats.join(' · '):'';
}
