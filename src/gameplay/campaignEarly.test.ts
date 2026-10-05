import {campaignPlans} from '../config/campaignPhases';
import {expect,it} from 'vitest';
import {campaignMissions,campaignPreset} from '../config/campaign';
import {scenarioConfig,scenarioWaves} from '../config/scenarios';
import {factions} from '../config/factions';
import {completeCampaignMission,startCampaignMission} from './campaign';
import {createMatch,updateMatch} from './match';
import {releasePlaythrough} from './testHelpers/releaseBot';
import {matchStats} from './matchStats';
import {encodeSave,decodeSave} from './save';
const early=campaignMissions.slice(0,4),view={camera:{x:0,y:0},building:null};
for(const [index,mission] of early.entries()){
 it(`${mission.id}: new campaign starts use their story profiles, not unrelated Skirmish preferences`,()=>{
  const progress={version:1 as const,completed:early.slice(0,index).map(m=>m.id)},pair=campaignPreset(mission.id)!;
  const m=startCampaignMission(progress,mission.id,'normal',{player:'goblins',enemy:'dwarves'})!;
  expect(m.factions).toEqual(pair);expect(m.map.id).toBe(campaignPlans[mission.id]?.map??'arena');expect(m.gathering.wood).toBe(scenarioConfig[mission.scenario].initial.wood);expect(m.gathering.units[0].hp).toBe(factions[pair.player].units.worker.hp);expect(m.combat.baseHP).toBe(factions[pair.player].buildings.base.hp);
 });
 it(`${mission.id}: paid normal playthrough completes the actual goal, Save checkpoint, progression and fresh replay`,()=>{
  const pair=campaignPreset(mission.id)!,r=releasePlaythrough(mission.scenario,'normal',undefined,{campaignMission:mission.id,abilities:true}),m=r.match;
  expect(m.outcome,JSON.stringify({mission:mission.id,time:m.waves.elapsedSeconds,base:m.combat.baseHP,spent:r.spentWood})).toBe('victory');expect(m.campaignMission).toBe(mission.id);expect(m.factions).toEqual(pair);expect(r.saved).toBe(true);expect(r.spentWood).toBeGreaterThan(40);expect(r.spentGold).toBeGreaterThan(0);expect(m.combat.baseHP).toBeGreaterThan(0);
  const stats=matchStats(m);expect(stats.player.wood.spent).toBeCloseTo(r.spentWood,6);expect(stats.player.gold.spent).toBeCloseTo(r.spentGold,6);
  if(mission.scenario==='tutorial')expect(m.tutorial?.step).toBe(6);
  if(mission.scenario==='mission-waves'){expect(m.waves.nextWave).toBe(scenarioWaves(mission.scenario,'normal').length);expect(m.combat.enemies).toHaveLength(0);}
  if(mission.scenario==='mission-base')expect(m.combat.enemies.some(e=>e.kind==='base')).toBe(false);
  if(mission.scenario!=='tutorial')expect(m.campaignRun!.phase).toBe(4);
  expect(updateMatch(m,100)).toBe(m);
  const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(loaded.ok){expect(loaded.match.campaignMission).toBe(mission.id);expect(loaded.match.factions).toEqual(pair);}
  const before={version:1 as const,completed:early.slice(0,index).map(v=>v.id)},after=completeCampaignMission(before,m);expect(after.completed).toEqual(early.slice(0,index+1).map(v=>v.id));expect(completeCampaignMission(after,m)).toBe(after);
  const replay=startCampaignMission(after,mission.id,'normal',pair)!;expect(replay.waves.elapsedSeconds).toBe(0);expect(replay.gathering.units).toHaveLength(3);expect(replay.placement.barracks).toBeNull();expect(replay.factions).toEqual(pair);
  console.info({mission:mission.id,pair,seconds:stats.seconds,wood:r.spentWood,gold:r.spentGold,base:m.combat.baseHP,abilities:r.abilitiesUsed});
 },60_000);
 it(`${mission.id}: base defeat blocks completion even when the success condition is also satisfied`,()=>{
  const before={version:1 as const,completed:early.slice(0,index).map(v=>v.id)},m=startCampaignMission(before,mission.id,'normal',{player:'crown',enemy:'clans'})!;
  m.combat.baseHP=0;m.combat.enemies=[];if(m.tutorial)m.tutorial.step=6;m.waves.nextWave=scenarioWaves(mission.scenario,'normal').length;if(mission.scenario==='mission-outpost')m.waves.elapsedSeconds=90;
  const ended=updateMatch(m,0);expect(ended.outcome).toBe('defeat');expect(completeCampaignMission(before,ended)).toBe(before);
 });
}
it('legacy campaign saves retain their chosen factions and fresh restart can use that saved identity',()=>{
 const legacy={...createMatch('tutorial','beginner',{player:'elves',enemy:'dwarves'},'arena',.75),campaignMission:'first-steps' as const};legacy.gathering.units[0].selected=true;
 const loaded=decodeSave(encodeSave(legacy,view));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(!loaded.ok)return;
 expect(loaded.match.factions).toEqual({player:'elves',enemy:'dwarves'});expect(loaded.match.campaignMission).toBe('first-steps');
 const fresh={...createMatch(loaded.match.scenario,loaded.match.difficulty,loaded.match.factions,loaded.match.map.id,loaded.match.speed),campaignMission:loaded.match.campaignMission};expect(fresh.factions).toEqual(legacy.factions);expect(fresh.gathering.units[0].hp).toBe(factions.elves.units.worker.hp);expect(fresh.gathering.units[0].selected).toBe(false);expect(fresh.campaignMission).toBe('first-steps');
});
