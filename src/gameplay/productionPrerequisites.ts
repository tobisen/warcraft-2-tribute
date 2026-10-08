import {academyCampaignReason,contentReason} from '../config/campaignContent';
import {factionForTeam as factionOf} from '../config/factions';
import type {FactionDefinition,TechnologyState,UnitRole} from '../config/factions';
/** Enqueue admission only: accepted jobs keep their original recipes and continue. */
export function unitAvailability(faction:FactionDefinition,role:UnitRole,technology?:TechnologyState,content?:import('../config/campaignContent').CampaignContent):string|null {
 const locked=contentReason(content??technology?.campaignContent,'units',role);if(locked)return locked;
 if(!faction.roster.includes(role))return 'Unit unavailable for this faction';
 return prerequisiteReason(faction,faction.units[role].prerequisites,technology);
}

/** Derive technology from completed live buildings, never UI selection or an in-progress job. */
export function technologyFor(m:import('./match').MatchState,team:'player'|'enemy'):TechnologyState {
 const buildings:import('../config/factions').BuildingRole[]=[];
 if(team==='enemy'){
  for(const e of m.combat.enemies){
   if(e.hp<=0||e.construction&&e.construction.remainingSeconds>0)continue;
   const role=e.kind==='base'?'base':e.buildingType;
   if(role==='base'||role==='barracks'||role==='farm'||role==='forge'||role==='academy'||role==='stable'||role==='aviary'||role==='siegeWorks')if(!buildings.includes(role))buildings.push(role);
  }
  return {baseLevel:m.enemyProduction?.baseDevelopment?.level??1,academyAllowed:!academyCampaignReason(m),buildings,research:{attack:m.enemyPolicy?.research.attack??0,defense:m.enemyPolicy?.research.defense??0}};
 }
 if((m.combat.baseHP>0||(m.placement.bases??[]).some(b=>b.hp>0&&b.construction.remainingSeconds===0)))buildings.push('base');
 if(m.placement.barracks&&(m.placement.barracksHP??1)>0&&(m.placement.construction?.remainingSeconds??0)===0)buildings.push('barracks');
 if(m.placement.siegeWorks&&m.placement.siegeWorks.hp>0&&m.placement.siegeWorks.construction.remainingSeconds===0)buildings.push('siegeWorks');
 if(m.placement.aviary&&m.placement.aviary.hp>0&&m.placement.aviary.construction.remainingSeconds===0)buildings.push('aviary');
 if(m.placement.stable&&m.placement.stable.hp>0&&m.placement.stable.construction.remainingSeconds===0)buildings.push('stable');
 if(m.placement.academy&&m.placement.academy.hp>0&&m.placement.academy.construction.remainingSeconds===0)buildings.push('academy');
 if(m.placement.forge&&(m.placement.forge.hp??1)>0&&m.placement.forge.construction.remainingSeconds===0)buildings.push('forge');
 if(m.placement.farms?.some(f=>(f.hp??1)>0&&f.construction.remainingSeconds===0))buildings.push('farm');
 return {academyAllowed:!academyCampaignReason(m),...(m.gathering.campaignContent?{campaignContent:m.gathering.campaignContent}:{}),...(m.combat.baseDevelopment?{baseLevel:m.combat.baseDevelopment.level}:{}),buildings,research:{attack:m.research?.attack??0,defense:m.research?.defense??0}};
}

/** One evaluator for every action, with completed technology only. */
export function missingPrerequisites(f: FactionDefinition,r:import('../config/factions').UnitPrerequisites|undefined,t?:TechnologyState):string[]{
 return [...(r?.baseLevel&&(t?.baseLevel??1)<r.baseLevel?[`Upgrade ${f.buildingNames.base} to level ${r.baseLevel}`]:[]),...(r?.buildings??[]).filter(b=>!t?.buildings.includes(b)).map(b=>`Complete ${f.buildingNames[b]}`),...Object.entries(r?.research??{}).filter(([k,v])=>(t?.research[k as 'attack'|'defense']??0)<v).map(([k,v])=>`Research ${k} ${v}`)];
}
export function prerequisiteReason(f:FactionDefinition,r:import('../config/factions').UnitPrerequisites|undefined,t?:TechnologyState):string|null{return missingPrerequisites(f,r,t)[0]??null;}
export function buildingAvailability(f:FactionDefinition,k:import('../config/factions').BuildingRole|'harbor',t:TechnologyState):string|null{return (k==='academy'&&t.academyAllowed===false?'Locked for this campaign mission':null)??contentReason(t.campaignContent,'buildings',k)??prerequisiteReason(f,k==='harbor'?{buildings:['base']}:f.buildings[k].prerequisites,t);}
export function researchAvailability(f:FactionDefinition,k:'attack'|'defense',t:TechnologyState):string|null{return contentReason(t.campaignContent,'research',k)??prerequisiteReason(f,(t.research[k]??0)>=1?{buildings:['forge','academy']}:f.upgrades[k].prerequisites,t);}
export function techTree(m:import('./match').MatchState):string[]{const f=factionOf(m,'player'),t=technologyFor(m,'player');return [
 `${f.buildingNames.base}: level ${m.combat.baseDevelopment?.level??1} / 3`,
 ...(['barracks','farm','forge','academy','stable','aviary','siegeWorks','harbor'] as const).map(k=>`${k==='harbor'?f.naval.harbor.name:f.buildingNames[k]} ← ${buildingAvailability(f,k,t)??'Available'}`),
 ...f.roster.map(k=>`${f.unitNames[k]} @ ${f.buildingNames[f.units[k].trainedAt]} ← ${prerequisiteReason(f,{buildings:[f.units[k].trainedAt]},t)??unitAvailability(f,k,t)??'Available'}${f.units[k].prerequisites?.buildings?.length?` (needs ${f.units[k].prerequisites!.buildings!.map(b=>f.buildingNames[b]).join(', ')})`:''}`),
 ...(['attack','defense'] as const).map(k=>`${f.upgrades[k].name}: ${t.research[k]??0}/2 · I: forge; II: forge + ${f.buildingNames.academy} ← ${(t.research[k]??0)>=2?'Complete':researchAvailability(f,k,t)??'Available'}`)
 ];}
