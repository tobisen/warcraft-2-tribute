import {expect,it} from 'vitest';
import {campaignMissions,campaignPreset} from '../config/campaign';
import {campaignPlans} from '../config/campaignPhases';
import {scenarioConfig,scenarioWaves} from '../config/scenarios';
import {operationFor} from '../config/operations';
import {factions} from '../config/factions';
import {startCampaignMission} from './campaign';
import {createMatch,updateMatch,type MatchState} from './match';
import {advanceCampaignPhases,campaignObjective,campaignPhaseMet} from './campaignPhases';
import {encodeSave,decodeSave} from './save';
import {fogIndex} from './fog';
const admission={version:1 as const,completed:campaignMissions.map(m=>m.id)},view={camera:{x:0,y:0},building:null};
const start=(id:typeof campaignMissions[number]['id'])=>startCampaignMission(admission,id,'normal',campaignPreset(id)!)!;
const roundtrip=(m:MatchState)=>{const result=decodeSave(encodeSave({...m,paused:true},view));expect(result.ok,result.ok?'':result.error).toBe(true);if(!result.ok)throw Error(result.error);return {...result.match,paused:false};};
it.each(campaignMissions)('$id preserves the authored campaign map and phase at every save boundary',mission=>{
 const m=start(mission.id),plan=campaignPlans[mission.id];expect(m.map.id).toBe(plan?.map??scenarioConfig[mission.scenario].map);
 if(!plan){expect(roundtrip(m).campaignRun).toBeUndefined();return;}
 for(let phase=0;phase<plan.phases.length;phase++){
  // Historical completed phases may have lost units/buildings: do not invent live prerequisites on load.
  m.campaignRun={version:1,phase,...(plan.phases.some(p=>p.goal==='waves')&&phase>=2?{waveStartedSeconds:0}:{})};const loaded=roundtrip(m);expect(loaded.campaignRun).toEqual(m.campaignRun);expect(campaignObjective(loaded)).toContain(`Phase ${phase+1}/`);
 }
});
it.each(campaignMissions.slice(1))('$id advances its full objective sequence once; earlier terminal conditions cannot win',mission=>{
 let m=start(mission.id);const plan=campaignPlans[mission.id]!;
 expect(updateMatch(m,0).outcome).toBe('playing');
 for(let phase=0;phase<plan.phases.length;phase++){
  const goal=plan.phases[phase];m.campaignRun={version:1,phase};
  // Explicit objective fixtures, not a paid playthrough or duration measurement.
  const soldier={id:'unit-20',kind:'soldier' as const,owner:'player' as const,hp:factions[m.factions!.player].units.soldier.hp,position:{x:600,y:336},target:{x:600,y:336},selected:false,cargo:0 as const,order:{kind:'idle' as const}};
  if(goal.goal==='prepare'){m.placement={...m.placement,barracks:{x:512,y:384,width:96,height:96},construction:{remainingSeconds:0,builderId:'unit-1'},barracksHP:100};m.gathering.units.push(soldier,{...soldier,id:'unit-21'});}
  if(goal.goal==='explore')for(const point of goal.points!){const index=fogIndex(m.fog!,point)!;m.fog!.teams.player.explored[index]=true;}
  if(goal.goal==='position')m.gathering.units.push({...soldier,position:{...goal.points![0]}});
  if(goal.goal==='waves'){m.combat.enemies=[];m.waves.nextWave=scenarioWaves(m.scenario!,m.difficulty!).length;}
  if(goal.goal==='base'||goal.goal==='guards')m.combat.enemies=[];
  if(goal.goal==='transport')m.navy={harbor:{owner:'player',hp:100,footprint:{x:672,y:320,width:64,height:64},construction:{remainingSeconds:0,builderId:'unit-1'}},ships:[{kind:'ship',id:'ship-1',role:'transport',owner:'player',hp:100,position:{x:720,y:400},target:{x:720,y:400},selected:false,passengers:[],order:{kind:'idle'}}],production:{remainingSeconds:null,nextUnitNumber:2}};
  if(goal.goal==='operation'){
   const operation=operationFor(m.scenario)!;m.combat.enemies=[];
   if(operation.kind==='escort')m.gathering.units.find(u=>u.id===operation.courier.id)!.position={...operation.zone};else m.gathering.units.push({...soldier,position:{...operation.zone}});
   if(operation.kind==='capture'){m.capture={holdSeconds:30};m.waves.elapsedSeconds=30;}
  }
  expect(campaignPhaseMet(m,goal),`${mission.id}/${phase}`).toBe(true);m=advanceCampaignPhases(m);expect(m.campaignRun!.phase).toBeGreaterThan(phase);
 }
 expect(m.campaignRun!.phase).toBe(plan.phases.length);const ended=updateMatch(m,0);expect(ended.outcome).toBe('victory');expect(updateMatch(ended,100)).toBe(ended);
});
it('base loss and missing courier override phase completion; early escort arrival is not victory',()=>{
 const m=start('ridge-convoy');m.combat.enemies=[];m.gathering.units.find(u=>u.id==='unit-4')!.position={...operationFor(m.scenario)!.zone};expect(updateMatch(m,0).outcome).toBe('playing');
 m.gathering.units=m.gathering.units.filter(u=>u.id!=='unit-4');expect(updateMatch(m,0).outcome).toBe('defeat');
 const siege=start('the-siege');siege.campaignRun!.phase=4;siege.combat.baseHP=0;expect(updateMatch(siege,0).outcome).toBe('defeat');
});
it('malformed phase state and changed maps are rejected; config50 retains old rules',()=>{
 const m=start('forest-watch'),doc=JSON.parse(encodeSave(m,view));for(const run of [{version:2,phase:0},{version:1,phase:-1},{version:1,phase:5},{version:1,phase:.5},{version:1,phase:0,reward:true}]){doc.state.campaignRun=run;expect(decodeSave(JSON.stringify(doc)).ok).toBe(false);}
 const legacy={...createMatch('mission-waves'),campaignMission:'forest-watch' as const},old=JSON.parse(encodeSave(legacy,view));old.configVersion='tribute-config-50';const loaded=decodeSave(JSON.stringify(old));expect(loaded.ok).toBe(true);if(loaded.ok){expect(loaded.match.map.id).toBe('arena');expect(loaded.match.campaignRun).toBeUndefined();}
 old.state.campaignRun={version:1,phase:0};expect(decodeSave(JSON.stringify(old)).ok).toBe(false);
});
it('finite pressure begins once after exploration, survives load, and never respawns a fired wave',()=>{
 let m=start('forest-watch');m.campaignRun!.phase=1;m.waves.elapsedSeconds=200;
 for(const point of campaignPlans['forest-watch']!.phases[1].points!)m.fog!.teams.player.explored[fogIndex(m.fog!,point)!]=true;
 m=updateMatch(m,0);expect(m.campaignRun).toEqual({version:1,phase:2,waveStartedSeconds:200});
 m=roundtrip(m);m=updateMatch(m,59);expect(m.waves.nextWave).toBe(0);
 m=updateMatch(m,1);expect(m.waves.nextWave).toBe(1);expect(m.combat.enemies.map(e=>e.id)).toEqual(['enemy-1']);
 m=roundtrip(m);m=updateMatch(m,0);expect(m.campaignRun!.waveStartedSeconds).toBe(200);expect(m.waves.nextEnemyNumber).toBe(2);expect(m.combat.enemies.map(e=>e.id)).toEqual(['enemy-1']);
});
it('exhausted resources remain discoverable objectives; no phase depends on unavailable stock',()=>{
 const m=start('valley-rescue');m.campaignRun!.phase=1;for(const point of campaignPlans['valley-rescue']!.phases[1].points!)m.fog!.teams.player.explored[fogIndex(m.fog!,point)!]=true;
 for(const node of m.gathering.extraNodes!)node.remaining=0;
 expect(campaignPhaseMet(m,campaignPlans['valley-rescue']!.phases[1])).toBe(true);expect(advanceCampaignPhases(m).campaignRun!.phase).toBe(2);
});
