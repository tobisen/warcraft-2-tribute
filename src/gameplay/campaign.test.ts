import {createClassicMatch} from './testHelpers/classicMatch';
import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {expect,it} from 'vitest';
import {campaignMissions,campaignDetails,campaignPreset} from '../config/campaign';
import {freshCampaignProgress,campaignMissionStatus,completeCampaignMission,startCampaignMission,createCampaignStore,validateCampaignProgress,campaignProgressKey} from './campaign';
import {createMatch,updateMatch} from './match';
import {encodeSave,decodeSave} from './save';
import {campaignDebrief} from '../presentation/campaign';
const view={camera:{x:0,y:0},building:null};
const pair={player:'elves',enemy:'dwarves'} as const;
it('the eight missions unlock in order only after actual campaign victory and remain replayable',()=>{
 let progress=freshCampaignProgress();
 for(let i=0;i<campaignMissions.length;i++){
  const mission=campaignMissions[i];
  expect(campaignMissionStatus(progress,mission.id)).toBe('available');
  if(i+1<campaignMissions.length)expect(startCampaignMission(progress,campaignMissions[i+1].id,'normal',pair)).toBeNull();
  const match=startCampaignMission(progress,mission.id,'normal',pair)!;
  expect(match.scenario).toBe(mission.scenario);expect(match.campaignMission).toBe(mission.id);
  expect(completeCampaignMission(progress,match)).toBe(progress);
  expect(completeCampaignMission(progress,{...match,outcome:'defeat'})).toBe(progress);
  progress=completeCampaignMission(progress,{...match,outcome:'victory'});
  expect(campaignMissionStatus(progress,mission.id)).toBe('completed');
  expect(completeCampaignMission(progress,{...match,outcome:'victory'})).toBe(progress);
  expect(startCampaignMission(progress,mission.id,'normal',pair)).not.toBeNull();
 }
 expect(progress.completed).toEqual(campaignMissions.map(m=>m.id));
});
it('standalone wins and mismatched run identities cannot earn campaign completion',()=>{
 const progress=freshCampaignProgress(),win={...createMatch('tutorial'),outcome:'victory' as const};
 expect(completeCampaignMission(progress,win)).toBe(progress);
 expect(completeCampaignMission(progress,{...win,campaignMission:'the-siege'})).toBe(progress);
});
it.each([null,{},[],{version:2,completed:[]},{version:1,completed:['missing']},{version:1,completed:['first-steps','first-steps']},{version:1,completed:'first-steps'},{version:1,completed:[],other:true}])('invalid local progress resets safely: %j',value=>{
 expect(validateCampaignProgress(value)).toEqual(freshCampaignProgress());
});
it('local completion persists once, supports reload/replay and does not expose mutable storage state',()=>{
 const memory=new Map<string,string>();let writes=0;
 const host={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{writes++;memory.set(k,v);}};
 const store=createCampaignStore(()=>host);expect(store.load()).toEqual(freshCampaignProgress());
 const victory={...startCampaignMission(store.get(),'first-steps','easy',pair)!,outcome:'victory' as const};
 store.record(victory);store.record(victory);expect(writes).toBe(1);
 const reloaded=createCampaignStore(()=>host);expect(reloaded.load().completed).toEqual(['first-steps']);
 reloaded.get().completed.length=0;expect(reloaded.get().completed).toEqual(['first-steps']);
 memory.set(campaignProgressKey,'broken JSON');expect(reloaded.load()).toEqual(freshCampaignProgress());expect(reloaded.error()).toMatch(/read/);
});
it('storage failures retain session completion and report that persistence failed',()=>{
 const store=createCampaignStore(()=>({getItem(){throw Error('unavailable');},setItem(){throw Error('quota');}}));
 expect(store.load()).toEqual(freshCampaignProgress());expect(store.error()).toMatch(/read/);
 store.record({...startCampaignMission(store.get(),'first-steps','easy',pair)!,outcome:'victory'});
 expect(store.get().completed).toEqual(['first-steps']);expect(store.error()).toMatch(/session only/);
 expect(campaignMissionStatus(store.get(),'forest-watch')).toBe('available');
});
it.each(campaignMissions)('$id preserves run identity, settings and state through pause/Save; replay owns fresh state',mission=>{
 const progress={version:1 as const,completed:campaignMissions.map(m=>m.id)};
 const match=startCampaignMission(progress,mission.id,'beginner',pair,.75)!;
 match.gathering.units[0].selected=true;match.gathering.units[0].position.x+=16;match.paused=true;
 expect(updateMatch(match,100)).toBe(match);
 const loaded=decodeSave(encodeSave(match,view));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(!loaded.ok)return;
 expect(loaded.match.campaignMission).toBe(mission.id);expect(loaded.match.factions).toEqual(campaignPreset(mission.id)??pair);expect(loaded.match.speed).toBe(.75);expect(loaded.match.gathering.units[0].selected).toBe(true);
 const replay=startCampaignMission(progress,mission.id,'beginner',loaded.match.factions!,.75)!;
 expect(replay.campaignMission).toBe(mission.id);expect(replay.gathering.units[0].selected).toBe(false);expect(replay.waves.elapsedSeconds).toBe(0);expect(replay.gathering.units).not.toBe(match.gathering.units);
 const forged=JSON.parse(encodeSave(match,view));forged.state.campaignMission=mission.id==='first-steps'?'the-crossing':'first-steps';expect(decodeSave(JSON.stringify(forged)).ok).toBe(false);
});
it('Save30 migrates without inventing historical campaign participation or changing paid NPC state',()=>{
 const match=createClassicMatch('skirmish'),doc=JSON.parse(encodeSave(match,view));legacyTerrainFixture(doc);doc.configVersion='tribute-config-30';
 const loaded=decodeSave(JSON.stringify(doc));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(loaded.ok){expect(loaded.match.campaignMission).toBeUndefined();expect(loaded.match.enemyProduction).toEqual(match.enemyProduction);expect(loaded.match.combat).toEqual(match.combat);}
 doc.state.campaignMission='first-steps';expect(decodeSave(JSON.stringify(doc)).ok).toBe(false);
});
it('a resumed mission can earn its own completion without fabricating earlier local history',()=>{
 const resumed={...createMatch('mission-base'),campaignMission:'the-siege' as const,outcome:'victory' as const};
 const completed=completeCampaignMission(freshCampaignProgress(),resumed);expect(completed.completed).toEqual(['the-siege']);expect(campaignMissionStatus(completed,'the-outpost')).toBe('available');expect(campaignMissionStatus(completed,'forest-watch')).toBe('locked');
});
it('briefings, objectives and debriefings describe existing scenario goals and defeat unlocks nothing',()=>{
 for(const mission of campaignMissions){const details=campaignDetails(mission.id);expect(details.briefing.length).toBeGreaterThan(20);expect(details.goal.length).toBeGreaterThan(20);expect(details.debriefing.length).toBeGreaterThan(20);const match={...createMatch(mission.scenario),campaignMission:mission.id};expect(campaignDebrief({...match,outcome:'victory'})).toBe(details.debriefing);expect(campaignDebrief({...match,outcome:'defeat'})).toMatch(/No new mission/);}
 expect(campaignDebrief(createMatch())).toBeNull();
});
