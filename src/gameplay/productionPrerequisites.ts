import type {FactionDefinition,TechnologyState,UnitRole} from '../config/factions';
/** Enqueue admission only: accepted jobs keep their original recipes and continue. */
export function unitAvailability(faction:FactionDefinition,role:UnitRole,technology?:TechnologyState):string|null {
 if(!faction.roster.includes(role))return 'Unit unavailable for this faction';
 const requirements=faction.units[role].prerequisites;
 for(const building of requirements?.buildings??[]){
  if(!technology?.buildings.includes(building))return `Complete ${faction.buildingNames[building]}`;
 }
 for(const [kind,level] of Object.entries(requirements?.research??{})){
  if((technology?.research[kind as 'attack'|'defense']??0)<level)return `Research ${kind} ${level}`;
 }
 return null;
}

/** Derive technology from completed live buildings, never UI selection or an in-progress job. */
export function technologyFor(m:import('./match').MatchState,team:'player'|'enemy'):TechnologyState {
 const buildings:import('../config/factions').BuildingRole[]=[];
 if(team==='enemy'){
  for(const e of m.combat.enemies){
   if(e.hp<=0||e.construction&&e.construction.remainingSeconds>0)continue;
   const role=e.kind==='base'?'base':e.buildingType;
   if(role==='base'||role==='barracks'||role==='farm'||role==='forge')if(!buildings.includes(role))buildings.push(role);
  }
  return {buildings,research:{attack:m.enemyPolicy?.research.attack??0,defense:m.enemyPolicy?.research.defense??0}};
 }
 if(m.combat.baseHP>0)buildings.push('base');
 if(m.placement.barracks&&(m.placement.barracksHP??1)>0&&(m.placement.construction?.remainingSeconds??0)===0)buildings.push('barracks');
 if(m.placement.forge&&(m.placement.forge.hp??1)>0&&m.placement.forge.construction.remainingSeconds===0)buildings.push('forge');
 if(m.placement.farms?.some(f=>(f.hp??1)>0&&f.construction.remainingSeconds===0))buildings.push('farm');
 return {buildings,research:{attack:m.research?.attack??0,defense:m.research?.defense??0}};
}
