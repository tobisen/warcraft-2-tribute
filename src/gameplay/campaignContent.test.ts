import {expect,it} from 'vitest';
import {campaignMissions} from '../config/campaign';
import {identityFor,seriesMissionPlan} from '../config/campaignSeries';
import {campaignActionReason,missionContent} from '../config/campaignContent';
import {factionIds,type FactionId} from '../config/factions';
import {startCampaignMission} from './campaign';
import {createMatch} from './match';
import {enqueueProduction} from './productionQueue';
import {canStartProduction} from './production';
import {placementError} from './placement';
import {startResearch} from './research';
import {useAbility} from './abilities';
import {canTrainShip,harborPlacementError} from './navy';
import {baseUpgradeReason} from './baseUpgrade';
import {spellCasterReason} from './spells';
import {spellForSlot} from '../config/spells';
import {actionPanel} from '../presentation/actionPanel';
import {decodeSave,encodeSave} from './save';
import {campaignPhaseMet} from './campaignPhases';
const start=(f:FactionId,id=campaignMissions[0].id as typeof campaignMissions[number]['id'])=>startCampaignMission({version:1,identity:identityFor(f,'normal'),completed:campaignMissions.map(m=>m.id)},id,'normal',{player:f,enemy:'crown'})!;
it.each(factionIds)('%s: sufficient resources and completed prerequisites cannot bypass mission-one locks',f=>{
 const m=start(f);m.gathering.wood=1000;m.gathering.goldBalance=1000;const rect={x:512,y:384,width:96,height:96},technology={buildings:['base','barracks','forge'] as const,research:{attack:1,defense:1},baseLevel:3};
 for(const role of ['archer','specialist','catapult','air'] as const){const b={kind:'barracks' as const,ready:true,footprint:rect,technology,unitType:role};expect(canStartProduction(m.gathering,m.soldierProduction,b)).toBe(false);const next=enqueueProduction(m.gathering,m.soldierProduction,b);expect(next.gathering).toBe(m.gathering);expect(next.production).toBe(m.soldierProduction);}
 expect(placementError({...m.placement,kind:'forge'},{x:600,y:300},1000,[],{map:m.map,gathering:m.gathering,technology,enemies:[]})).toMatch(/Locked/);
 m.placement.forge={id:'forge',owner:'player',hp:100,footprint:rect,construction:{remainingSeconds:0,builderId:null}};expect(startResearch(m.gathering,m.research!,m.placement,'attack').research).toBe(m.research);expect(baseUpgradeReason(m)).toMatch(/Locked/);expect(harborPlacementError(m,{x:600,y:300})).toMatch(/Locked/);expect(canTrainShip(m,'transport')).toBe(false);
 const worker=m.gathering.units[0];m.gathering.units.push({...worker,id:'unit-20',kind:'soldier',archetype:'specialist',faction:f,hp:100,cargo:0,selected:true,mana:100,order:{kind:'idle'}});expect(useAbility(m.gathering)).toBe(m.gathering);expect(spellCasterReason(m,'unit-20',spellForSlot(f,'heal')!)).toMatch(/Locked/);
 expect(actionPanel(m,'barracks',true)['train-archer'].reason).toMatch(/Locked/);expect(actionPanel(m,null,true)['unit-ability'].reason).toMatch(/Locked/);
});
it.each(factionIds)('%s introduces playable content at every level and every tactical objective uses permitted content',f=>{
 let previous='';for(const mission of campaignMissions){const c=missionContent(mission.id);expect(JSON.stringify(c)).not.toBe(previous);previous=JSON.stringify(c);for(const phase of seriesMissionPlan(mission.id,identityFor(f,'normal').campaignId).phases){if(phase.role)expect(c.units).toContain(phase.role);if(phase.research)expect(c.research).toContain(phase.research);if(phase.ship)expect(c.ships).toContain(phase.ship);}
 const m=start(f,mission.id);for(const role of c.units.filter(r=>r!=='worker')){const next=enqueueProduction({...m.gathering,wood:1000,goldBalance:1000},m.soldierProduction,{kind:'barracks',footprint:{x:512,y:384,width:96,height:96},technology:{baseLevel:3,buildings:['base','barracks','forge'],research:{attack:1,defense:1}},unitType:role},{used:0,reserved:0,cap:100});expect(next.production.queue?.[0].kind).toBe(role);}
 }
});
it('save/load derives policy from authored identity, does not serialize it, replay starts with mission policy and skirmish stays independent',()=>{
 const m=start('crown'),json=encodeSave(m,{camera:{x:0,y:0},building:null});expect(json).not.toContain('campaignContent');const loaded=decodeSave(json);expect(loaded.ok).toBe(true);if(loaded.ok)expect(loaded.match.gathering.campaignContent).toEqual(missionContent('first-steps'));
 const advanced=start('crown','coastal-banner');expect(campaignActionReason(advanced,'train-air')).toBeNull();expect(campaignActionReason(start('crown'),'train-air')).toMatch(/Locked/);expect(campaignActionReason(createMatch('skirmish'),'train-air')).toBeNull();
});
it.each(factionIds)('%s force/research/fleet objectives count actual living assets and do not pass on missing content',f=>{
 for(const mission of campaignMissions){const m=start(f,mission.id),phase=seriesMissionPlan(mission.id,identityFor(f,'normal').campaignId).phases.find(p=>['force','research','fleet'].includes(p.goal))!;expect(campaignPhaseMet(m,phase)).toBe(false);
 if(phase.goal==='force'){const u=m.gathering.units[0];for(let i=0;i<phase.count!;i++)m.gathering.units.push({...u,id:`unit-${20+i}`,kind:'soldier',...(phase.role==='soldier'?{}:{archetype:phase.role as 'archer'|'catapult'|'specialist'|'air'}),hp:10,cargo:0,order:{kind:'idle'}});}
 else if(phase.goal==='research')m.research![phase.research!]=1;
 else {m.navy={harbor:null,production:{remainingSeconds:null,nextUnitNumber:1},ships:Array.from({length:phase.count!},(_,i)=>({id:`ship-${i}`,kind:'ship' as const,owner:'player' as const,role:phase.ship!,hp:10,position:{x:1,y:1},target:{x:1,y:1},selected:false,order:{kind:'idle' as const}}))};}
 expect(campaignPhaseMet(m,phase)).toBe(true);
 }
});
