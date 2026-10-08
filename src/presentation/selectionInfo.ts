import {workerToolsConfig} from '../config/workerTools';
import {upgradeMultiplier} from '../config/upgrades';
import {workerCombatConfig} from '../config/unit';
import {canReachFootprint} from '../gameplay/approach';
import {isSpectating} from '../gameplay/teamResults';
import {matchAnimals} from '../gameplay/wildlife';
import {orderSummary} from '../gameplay/commandOrders';
import {spellDefinition} from '../config/spells';
import {manaFor,currentMana} from '../gameplay/mana';
import {inspectedBuilding} from '../gameplay/buildingInspection';
import {selectedBase} from '../gameplay/extraBases';
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
export interface SelectionInfo {mana?:number;maxMana?:number;name:string;detail:string;hp:number|null;maxHP:number|null;stats:string[];portrait:{atlas:'submarine'|'ballista'|'siegeWorks'|'units'|'naval'|'buildings'|'cavalry'|'healer'|'giant'|'scout'|'air'|'world'|'aviary'|'tower-specializations'|'reference-terrain';frame:string}|null}
const empty=():SelectionInfo=>({name:'No selection',detail:'Click a unit, building or resource, or drag to select a group.',hp:null,maxHP:null,stats:[],portrait:null});
/** Presentation only: reads selected player entities, only visible enemy buildings and known resources. Stats are baseline recipes. */
export function selectionInfo(m:MatchState,building:BuildingSelection,resourceId:string|null=null,animalId:string|null=null):SelectionInfo {
 if(isSpectating(m))return {...empty(),name:'Spectating your team',detail:'Camera only · Allied vision · Menu [P] to leave'};
 if(animalId){const animal=matchAnimals(m).find(a=>a.id===animalId&&a.hp>0&&(!m.fog||isVisible(m.fog,'player',a.position)));if(animal)return {name:animal.name,detail:'Neutral animal',hp:animal.hp,maxHP:animal.maxHP,stats:['Right-click with combat units to attack.'],portrait:{atlas:'world',frame:`critter-${animal.type}-idle-0`}};}
 if(resourceId){
  const node=resourceNodes(m.gathering).find(n=>n.id===resourceId);
  if(!node||!m.fog||!knownResource(m.fog,node.position))return empty();
  const type=node.resource??'wood',visible=isVisible(m.fog,'player',node.position);
  const staffing=visible?resourceStaffing(m,node):null;
  const reachable=node.tree&&visible&&node.remaining>0?m.gathering.units.some(u=>u.kind==='worker'&&canReachFootprint(m.map,u.position,{x:node.position.x-16,y:node.position.y-16,width:32,height:32},24)):true;
  return {name:type==='wood'?node.tree?'Tree':'Wood grove':'Gold mine',detail:`${visible?node.remaining<=0?'Depleted':`${Math.ceil(node.remaining)} remaining`:'Outside current vision'}`,hp:null,maxHP:null,stats:[`Resource: ${type}`,...(!reachable?['Unreachable — fell outer trees to open access.']:[]),...(staffing?[`Workers: ${staffing.assigned} assigned / ${staffing.gathering} gathering`]:[])],portrait:{atlas:node.mine||node.tree||node.grove?'reference-terrain':'world',frame:node.mine?visible&&node.remaining<=0?'mine-empty':'mine-full':node.tree||node.grove?visible&&node.remaining<=0?'stump':node.tree?'tree-0':'forest-0':`${type}-${visible&&node.remaining<=0?'depleted':'available'}`}};
 }
 const faction=factionForTeam(m,'player'),selected=[...m.gathering.units,...(m.navy?.ships??[])].filter(u=>u.selected);
 if(selected.length>1){const infos=selected.map(u=>selectionInfo({...m,gathering:{...m.gathering,units:m.gathering.units.map(x=>({...x,selected:x.id===u.id}))},navy:m.navy?{...m.navy,ships:m.navy.ships.map(x=>({...x,selected:x.id===u.id}))}:undefined},null));const counts=new Map<string,number>();for(const info of infos)counts.set(info.name,(counts.get(info.name)??0)+1);return {name:`${selected.length} units selected`,detail:`${[...counts].map(([name,n])=>`${name} ×${n}`).join(' · ')}`,hp:infos.reduce((n,x)=>n+(x.hp??0),0),maxHP:infos.reduce((n,x)=>n+(x.maxHP??0),0),stats:['Combined health',...Array.from(new Set(selected.map(orderSummary)))],portrait:null};}
 const u=selected[0];
 if(u){const role:UnitArt=u.kind==='ship'?u.role??'warship':u.kind==='worker'?'worker':u.archetype??'soldier';const data=u.kind==='ship'?faction.naval.units[u.role??'warship']:faction.units[role as 'worker'|'soldier'|'archer'|'catapult'|'ballista'|'specialist'|'air'];const stats=[orderSummary(u),`Speed ${data.speed} px/s`,`Supply ${data.supply}`];
  if(u.kind==='worker')stats.push(`Cargo ${u.cargo.toFixed(1)} / ${faction.units.worker.capacity} ${u.cargoType??'wood'}`,`Gather ${faction.units.worker.gatherPerSecond}/s`,`Damage ${workerCombatConfig.damagePerSecond}/s · Range ${workerCombatConfig.range}px`);
  else if(role==='transport')stats.push(`Passengers ${u.kind==='ship'?(u.passengers?.length??0):0} / ${navyConfig.transport.capacity}`);
  else {const combat=u.kind==='ship'?faction.naval.units[u.role??'warship']:faction.units[role as 'soldier'|'archer'|'catapult'|'ballista'|'specialist'|'air'];if(combat.range!==undefined)stats.push(`Range ${combat.range} px`);if('damagePerSecond' in combat&&combat.damagePerSecond!==undefined)stats.push(`Damage ${combat.damagePerSecond}/s`);if(combat.damage!==undefined)stats.push(`Damage ${combat.damage}/hit`);}
  if(role==='submarine')stats.push('Stealth · sea targets only · firing does not reveal');if(role==='warship')stats.push('Submarine detector96px with current vision');if(u.kind==='soldier'&&!u.archetype)stats.push('Infantry counter: +50% melee damage against cavalry');if(role==='scout'&&m.research?.scoutOptics)stats.push('Submarine detection128px in current team vision');if(role==='cavalry'&&m.research?.cavalryArmor)stats.push('Cavalry Armor ×0.80 incoming');if(role==='cavalry')stats.push('Fast mounted raider · takes +50% melee damage from infantry');
  if(u.kind==='soldier'||u.kind==='ship'&&role!=='transport')stats.push(`Military tech: Attack ${m.research?.attack??0}/2 ×${upgradeMultiplier(faction.upgrades.attack.multiplier,m.research?.attack).toFixed(2)} · Defense ${m.research?.defense??0}/2 ×${upgradeMultiplier(faction.upgrades.defense.multiplier,m.research?.defense).toFixed(2)} incoming`);
  const mana=u.kind==='ship'?undefined:currentMana(u,faction.id),manaData=u.kind==='ship'?undefined:manaFor(u,faction.id,m.research);if(u.kind==='soldier'&&u.spellEffects?.length)stats.push('Effects: '+u.spellEffects.map(e=>`${spellDefinition(e.spell,e.sourceFaction).name} ${e.remainingSeconds.toFixed(1)}s`).join(' · '));if(manaData)stats.push(`${manaData.role} · Mana regeneration ${manaData.regenerationPerSecond}/s`);
  return {...(manaData?{mana,maxMana:manaData.max}:{}),name:u.kind==='ship'?faction.naval.units[role as 'transport'|'warship'|'submarine'].name:faction.unitNames[role as 'worker'|'soldier'|'archer'|'catapult'|'ballista'|'specialist'|'air'],detail:`${orderSummary(u)}${u.kind==='worker'&&u.order.kind==='idle'&&resourceNodes(m.gathering).some(n=>(n.resource??'wood')==='wood'&&n.remaining<=0&&n.position.x===u.target.x&&n.position.y===u.target.y)?' · Last tree depleted; choose a new resource.':''}${role==='air'?' · AIR':''}`,hp:u.hp??data.hp,maxHP:data.hp,stats,portrait:{atlas:artAtlas(role),frame:unitFrame(motion(undefined,u.position,'idle',0,role,'player',undefined,faction.id),0)}};
 }
 if(!building)return empty();
 const b=inspectedBuilding(m,building);if(!b)return empty();
 const {kind,team,hp,maxHP,remaining}=b,f=b.faction;
 const name=kind==='wall'?'Wall':kind==='gate'?'Gate':kind==='tower'?'Defense Tower':kind==='outpost'?'Outpost':kind==='harbor'?f.naval.harbor.name:f.buildingNames[kind];
 const tower=kind==='tower'?m.placement.defenses?.find(t=>t.id===building):undefined;
 const description=kind==='wall'?'Blocks movement until destroyed.':kind==='gate'?'Opens automatically for your troops and allies. Enemies must destroy or go around it.':kind==='tower'?`${tower?.level===2?tower.specialization==='air'?'Anti-Air':'Ground Defense':'Ground Tower'} · ${tower?.level===2&&tower.specialization==='air'?'Air only · Range 256px · Damage 16':`Ground only · Range ${tower?.level===2?192:176}px · Damage ${tower?.level===2?24:10}`}${tower?.upgradeRemaining!=null?` · Inactive upgrade ${tower.upgradeRemaining.toFixed(1)}s`:''}`:kind==='base'?'Your stronghold trains workers and receives gathered resources.':kind==='siegeWorks'?'Trains splash catapults and direct-shot ballistas.':kind==='aviary'?'Dedicated production for scouts and combat aircraft.':kind==='stable'?'Trains fast mounted raiders. Infantry deals 50% extra melee damage against cavalry.':kind==='barracks'?'Trains combat units to defend and expand your territory.':kind==='farm'?'Provides population capacity for workers and troops.':kind==='academy'?'Unlocks military attack and defense II after forge research I.':kind==='forge'?'Unlocks military research and advanced unit prerequisites.':kind==='harbor'?'Produces transports and warships at a free coastal exit.':'An expansion strongpoint.';
 const stats:string[]=team==='enemy'?['Enemy building · Inspection only']:kind==='farm'?[`Supply capacity +${f.buildings.farm.populationCapacity}`]:kind==='base'?[`Supply capacity ${f.buildings.base.populationCapacity}`]:[];
 if(team==='player'){
  if(remaining>0)stats.unshift(description);
  const roles=kind==='base'?['worker'] as const:kind==='siegeWorks'?['catapult','ballista'] as const:kind==='aviary'?['scout','air'] as const:kind==='academy'?['healer','giant'] as const:kind==='stable'?['cavalry'] as const:kind==='barracks'?f.roster.filter(r=>f.units[r].trainedAt==='barracks'):[];
  for(const role of roles){const reason=unitAvailability(f,role,technologyFor(m,'player'));stats.push(`${f.unitNames[role]}: ${reason??'Available'}`);}
  const production=kind==='base'?selectedBase(m,building)?.production:kind==='siegeWorks'?m.placement.siegeWorks?.production:kind==='aviary'?m.placement.aviary?.production:kind==='stable'?m.placement.stable?.production:kind==='barracks'?m.soldierProduction:kind==='harbor'?m.navy?.production:undefined;
  if(production)stats.push(`Production: ${production.queue?.length??0} queued`);
  if(kind==='harbor')stats.push(`${f.naval.units.transport.name} · ${f.naval.units.warship.name}`);
  if(kind==='base')stats.push(`Base level ${m.combat.baseDevelopment?.level??1}`,m.combat.baseDevelopment?.remainingSeconds!=null?`Upgrade: ${m.combat.baseDevelopment.remainingSeconds.toFixed(1)}s; worker training paused`:'Worker training active');
  if(kind==='base'){const level=m.research?.workerTools??0,next=workerToolsConfig[Math.min(2,level)];stats.push(`Research: Worker Tools ${level}/3${level>=3?' · Complete':` · Next: ${Math.round((1-next.timeMultiplier)*100)}% shorter wood/gold gathering · ${next.cost.wood} wood + ${next.cost.gold} gold · ${next.durationSeconds}s`}`);}
  if(kind==='academy'||kind==='forge'||kind==='base')stats.push(`Research: Attack ${m.research?.attack??0} / Defense ${m.research?.defense??0}`,m.research?.job?`${m.research.job.kind}: ${m.research.job.remainingSeconds.toFixed(1)}s remaining`:'Attack / Defense research requires a completed forge');
 }
 return {name,detail:team==='enemy'?'Visible enemy building · No orders or private production data':remaining>0?`Construction ${remaining.toFixed(1)}s remaining`:description,hp,maxHP,stats,portrait:kind==='tower'&&tower?.level===2?{atlas:'tower-specializations',frame:`${f.artPrefix}tower-${tower.specialization??'ground'}-${team}-${hp<=80?'damaged':'complete'}`}:kind==='outpost'?null:{atlas:kind==='siegeWorks'?'siegeWorks':kind==='aviary'?'aviary':kind==='stable'?'cavalry':'buildings',frame:kind==='gate'&&m.placement.defenses?.find(t=>t.id===building)?.open?`${f.artPrefix}gate-player-open`:buildingFrame(kind,team,remaining,kind==='academy'?10:kind==='base'&&building?.startsWith('base-')?12:5,f.id,hp,kind==='tower'?m.placement.defenses?.find(t=>t.id===building)?.level??1:kind==='base'&&team==='player'?m.combat.baseDevelopment?.level??1:1)}};
}
export function renderSelectionInfo(info:SelectionInfo):void {
 document.getElementById('selection-name')!.textContent=info.name;const detail=document.getElementById('selection-detail')!;detail.title=info.detail;detail.textContent=info.detail.length>65&&!info.name.endsWith(' units selected')?'Details: hover to inspect':info.detail;
 document.getElementById('selection-health')!.textContent=info.hp===null?'':`HP ${Math.ceil(info.hp)} / ${info.maxHP}${info.mana!==undefined?` · Mana ${Math.floor(info.mana)} / ${info.maxMana}`:''}`;
 const health=document.getElementById('selection-health-bar') as HTMLProgressElement;health.hidden=info.hp===null;health.max=info.maxHP??1;health.value=info.hp??0;
 const stats=document.getElementById('selection-stats')!;stats.title=info.stats.join(' · ');stats.textContent=info.stats.filter(s=>s.startsWith('Order:')||s.startsWith('Cargo')||s.startsWith('Supply')||s.startsWith('Production:')||s.startsWith('Research:')||s.startsWith('Enemy')||s.startsWith('Workers:')||s.startsWith('Effects:')).join(' · ');
 document.getElementById('selection-info')!.title=[info.name,info.detail,...info.stats].join(' · ');
}
