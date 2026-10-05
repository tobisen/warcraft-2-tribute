import {orderSummary} from '../gameplay/commandOrders';
import {spellDefinition} from '../config/spells';
import {manaFor,currentMana} from '../gameplay/mana';
import {inspectedBuilding} from '../gameplay/buildingInspection';
import {unitAvailability,technologyFor} from '../gameplay/productionPrerequisites';
import {resourceStaffing} from '../gameplay/resourceStaffing';
import {resourceNodes} from '../gameplay/gathering';
import {knownResource} from '../gameplay/visibility';
import {isVisible} from '../gameplay/fog';
import {factionForTeam} from '../config/factions';
import {navyConfig} from '../config/navy';
import type {BuildingSelection} from '../gameplay/buildingSelection';
import type {MatchState} from '../gameplay/match';
import {artAtlas,motion,unitFrame,type UnitArt} from './animation';
import {buildingFrame} from './assets';
export interface SelectionInfo {mana?:number;maxMana?:number;name:string;detail:string;hp:number|null;maxHP:number|null;stats:string[];portrait:{atlas:'units'|'naval'|'buildings'|'air';frame:string}|null}
const empty=():SelectionInfo=>({name:'No selection',detail:'Click a unit, building or resource, or drag to select a group.',hp:null,maxHP:null,stats:[],portrait:null});
/** Presentation only: reads selected player entities, only visible enemy buildings and known resources. Stats are baseline recipes. */
export function selectionInfo(m:MatchState,building:BuildingSelection,resourceId:string|null=null):SelectionInfo {
 if(resourceId){
  const node=resourceNodes(m.gathering).find(n=>n.id===resourceId);
  if(!node||!m.fog||!knownResource(m.fog,node.position))return empty();
  const type=node.resource??'wood',visible=isVisible(m.fog,'player',node.position);
  const staffing=visible?resourceStaffing(m,node):null;
  return {name:type==='wood'?'Wood grove':'Gold mine',detail:`${node.id} · ${visible?node.remaining<=0?'Depleted':`${Math.ceil(node.remaining)} remaining`:'Outside current vision'}`,hp:null,maxHP:null,stats:[`Resource: ${type}`,...(staffing?[`Workers: ${staffing.assigned} assigned / ${staffing.gathering} gathering`]:[])],portrait:null};
 }
 const faction=factionForTeam(m,'player'),selected=[...m.gathering.units,...(m.navy?.ships??[])].filter(u=>u.selected);
 if(selected.length>1){const infos=selected.map(u=>selectionInfo({...m,gathering:{...m.gathering,units:m.gathering.units.map(x=>({...x,selected:x.id===u.id}))},navy:m.navy?{...m.navy,ships:m.navy.ships.map(x=>({...x,selected:x.id===u.id}))}:undefined},null));return {name:`${selected.length} units selected`,detail:'Right-click to command the group. Workers gather; combat units fight.',hp:infos.reduce((n,x)=>n+(x.hp??0),0),maxHP:infos.reduce((n,x)=>n+(x.maxHP??0),0),stats:['Combined health',...Array.from(new Set(selected.map(orderSummary)))],portrait:null};}
 const u=selected[0];
 if(u){const role:UnitArt=u.kind==='ship'?u.role??'warship':u.kind==='worker'?'worker':u.archetype??'soldier';const data=u.kind==='ship'?faction.naval.units[u.role??'warship']:faction.units[role as 'worker'|'soldier'|'archer'|'catapult'|'specialist'|'air'];const stats=[orderSummary(u),`Speed ${data.speed} px/s`,`Supply ${data.supply}`];
  if(u.kind==='worker')stats.push(`Cargo ${u.cargo.toFixed(1)} / ${faction.units.worker.capacity} ${u.cargoType??'wood'}`,`Gather ${faction.units.worker.gatherPerSecond}/s`);
  else if(role==='transport')stats.push(`Passengers ${u.kind==='ship'?(u.passengers?.length??0):0} / ${navyConfig.transport.capacity}`);
  else {const combat=u.kind==='ship'?faction.naval.units[u.role??'warship']:faction.units[role as 'soldier'|'archer'|'catapult'|'specialist'|'air'];if(combat.range!==undefined)stats.push(`Range ${combat.range} px`);if('damagePerSecond' in combat&&combat.damagePerSecond!==undefined)stats.push(`Damage ${combat.damagePerSecond}/s`);if(combat.damage!==undefined)stats.push(`Damage ${combat.damage}/hit`);}
  const mana=u.kind==='ship'?undefined:currentMana(u,faction.id),manaData=u.kind==='ship'?undefined:manaFor(u,faction.id);if(u.kind==='soldier'&&u.spellEffects?.length)stats.push('Effects: '+u.spellEffects.map(e=>`${spellDefinition(e.spell,e.sourceFaction).name} ${e.remainingSeconds.toFixed(1)}s`).join(' · '));if(manaData)stats.push(`${manaData.role} · Mana regeneration ${manaData.regenerationPerSecond}/s`);
  return {...(manaData?{mana,maxMana:manaData.max}:{}),name:u.kind==='ship'?faction.naval.units[role as 'transport'|'warship'].name:faction.unitNames[role as 'worker'|'soldier'|'archer'|'catapult'|'specialist'|'air'],detail:`${u.id} · ${u.order.kind}${role==='air'?' · AIR · TEMP ART':''}`,hp:u.hp??data.hp,maxHP:data.hp,stats,portrait:{atlas:artAtlas(role),frame:unitFrame(motion(undefined,u.position,'idle',0,role,'player',undefined,faction.id),0)}};
 }
 if(!building)return empty();
 const b=inspectedBuilding(m,building);if(!b)return empty();
 const {kind,team,hp,maxHP,remaining}=b,f=b.faction;
 const name=kind==='wall'?'Wall':kind==='gate'?'Gate':kind==='tower'?'Defense Tower':kind==='outpost'?'Outpost':kind==='harbor'?f.naval.harbor.name:f.buildingNames[kind];
 const tower=kind==='tower'?m.placement.defenses?.find(t=>t.id===building):undefined;
 const description=kind==='wall'?'Blocks movement until destroyed.':kind==='gate'?`Gate ${m.placement.defenses?.find(t=>t.id===building)?.open?'open to your team':'closed'}. Enemies must destroy or go around it.`:kind==='tower'?`Level ${tower?.level??1} tower · Range ${tower?.level===2?192:176}px${tower?.upgradeRemaining!=null?` · Upgrade ${tower.upgradeRemaining.toFixed(1)}s`:''}. Fires at visible hostile units.`:kind==='base'?'Your stronghold trains workers and receives gathered resources.':kind==='barracks'?'Trains combat units to defend and expand your territory.':kind==='farm'?'Provides population capacity for workers and troops.':kind==='forge'?'Unlocks military research and advanced unit prerequisites.':kind==='harbor'?'Produces transports and warships at a free coastal exit.':'An expansion strongpoint.';
 const stats:string[]=team==='enemy'?['Enemy building · Inspection only']:kind==='farm'?[`Supply capacity +${f.buildings.farm.populationCapacity}`]:kind==='base'?[`Supply capacity ${f.buildings.base.populationCapacity}`]:[];
 if(team==='player'){
  if(remaining>0)stats.unshift(description);
  const roles=kind==='base'?['worker'] as const:kind==='barracks'?f.roster.filter(r=>r!=='worker'):[];
  for(const role of roles){const reason=unitAvailability(f,role,technologyFor(m,'player'));stats.push(`${f.unitNames[role]}: ${reason??'Available'}`);}
  const production=kind==='base'?m.production:kind==='barracks'?m.soldierProduction:kind==='harbor'?m.navy?.production:undefined;
  if(production)stats.push(`Production: ${production.queue?.length??0} queued`);
  if(kind==='harbor')stats.push(`${f.naval.units.transport.name} · ${f.naval.units.warship.name}`);
  if(kind==='base')stats.push(`Base level ${m.combat.baseDevelopment?.level??1}`,m.combat.baseDevelopment?.remainingSeconds!=null?`Upgrade: ${m.combat.baseDevelopment.remainingSeconds.toFixed(1)}s; worker training paused`:'Worker training active');
  if(kind==='forge'||kind==='base')stats.push(`Research: Attack ${m.research?.attack??0} / Defense ${m.research?.defense??0}`,m.research?.job?`${m.research.job.kind}: ${m.research.job.remainingSeconds.toFixed(1)}s remaining`:'Attack / Defense research requires a completed forge');
 }
 return {name,detail:team==='enemy'?'Visible enemy building · No orders or private production data':remaining>0?`Construction ${remaining.toFixed(1)}s remaining`:description,hp,maxHP,stats,portrait:kind==='outpost'?null:{atlas:'buildings',frame:kind==='gate'&&m.placement.defenses?.find(t=>t.id===building)?.open?`${f.artPrefix}gate-player-open`:buildingFrame(kind,team,remaining,5,f.id,hp,kind==='tower'?m.placement.defenses?.find(t=>t.id===building)?.level??1:kind==='base'&&team==='player'?m.combat.baseDevelopment?.level??1:1)}};
}
export function renderSelectionInfo(info:SelectionInfo):void {
 document.getElementById('selection-name')!.textContent=info.name;const detail=document.getElementById('selection-detail')!;detail.title=info.detail;detail.textContent=info.detail.length>65?'Details: hover to inspect':info.detail;
 document.getElementById('selection-health')!.textContent=info.hp===null?'':`HP ${Math.ceil(info.hp)} / ${info.maxHP}${info.mana!==undefined?` · Mana ${Math.floor(info.mana)} / ${info.maxMana}`:''}`;
 const health=document.getElementById('selection-health-bar') as HTMLProgressElement;health.hidden=info.hp===null;health.max=info.maxHP??1;health.value=info.hp??0;
 const stats=document.getElementById('selection-stats')!;stats.title=info.stats.join(' · ');stats.textContent=info.stats.filter(s=>s.startsWith('Order:')||s.startsWith('Cargo')||s.startsWith('Supply')||s.startsWith('Production:')||s.startsWith('Research:')||s.startsWith('Enemy')||s.startsWith('Workers:')||s.startsWith('Effects:')).join(' · ');
 document.getElementById('selection-info')!.title=[info.name,info.detail,...info.stats].join(' · ');
}
