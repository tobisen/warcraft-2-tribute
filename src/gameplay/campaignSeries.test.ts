import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {expect,it} from 'vitest';
import {campaignMissions} from '../config/campaign';
import {campaignSeries,identityFor,identityKey,seriesMissionPlan} from '../config/campaignSeries';
import {factionIds} from '../config/factions';
import {createCampaignStore,campaignProgressKey,scopedCampaignProgressKey,campaignMissionStatus,startCampaignMission} from './campaign';
import {encodeSave,decodeSave} from './save';
import {campaignPlan,advanceCampaignPhases,campaignPhaseMet} from './campaignPhases';
import {resultScore,validHighscore,scorePartition} from './highscores';
const host=()=>{const data=new Map<string,string>();return {data,getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);}};};
it('Human/Beginner completions, replay and reload never unlock Orcs/Normal or Human/Normal',()=>{
 const memory=host(),store=createCampaignStore(()=>memory),human=identityFor('crown','beginner'),orc=identityFor('clans','normal');store.load();
 for(const id of ['first-steps','forest-watch'] as const){const m=startCampaignMission(store.get(human),id,'beginner',{player:'crown',enemy:'clans'})!;store.record({...m,outcome:'victory'});}
 expect(campaignMissionStatus(store.get(human),'the-siege')).toBe('available');expect(campaignMissionStatus(store.get(orc),'forest-watch')).toBe('locked');expect(store.get(identityFor('crown','normal')).completed).toEqual([]);
 const before=memory.getItem(scopedCampaignProgressKey);store.record({...startCampaignMission(store.get(human),'first-steps','beginner',{player:'crown',enemy:'clans'})!,outcome:'victory'});expect(memory.getItem(scopedCampaignProgressKey)).toBe(before);
 const loaded=createCampaignStore(()=>memory);loaded.load();expect(loaded.get(human)).toEqual(store.get(human));expect(loaded.get(orc).completed).toEqual([]);
 expect(startCampaignMission(store.get(human),'first-steps','normal',{player:'crown',enemy:'clans'})).toBeNull();
});
it('preserves legacy metadata-free progression without distributing it to scoped campaigns',()=>{
 const memory=host(),raw=JSON.stringify({version:1,completed:['first-steps','forest-watch']});memory.setItem(campaignProgressKey,raw);const store=createCampaignStore(()=>memory);store.load();expect(store.get().completed).toHaveLength(2);
 for(const faction of factionIds)for(const d of ['beginner','normal'] as const)expect(store.get(identityFor(faction,d)).completed).toEqual([]);
 store.record({...startCampaignMission(store.get(identityFor('elves','normal')),'first-steps','normal',{player:'elves',enemy:'goblins'})!,outcome:'victory'});expect(memory.getItem(campaignProgressKey)).toBe(raw);
});
it.each(factionIds)('%s owns a distinct story and tactical goal plan; all eight save identities and replay starts roundtrip',faction=>{
 const identity=identityFor(faction,'normal'),progress={version:1 as const,identity,completed:campaignMissions.map(m=>m.id)};
 for(const mission of campaignMissions){const m=startCampaignMission(progress,mission.id,'normal',{player:faction,enemy:'crown'})!;expect(m.factions?.player).toBe(faction);expect(m.campaignRun?.campaignId).toBe(campaignSeries[faction].id);expect(campaignPlan(m)).toEqual(seriesMissionPlan(mission.id,identity.campaignId));
  const doc=encodeSave({...m,paused:true},{camera:{x:0,y:0},building:null}),loaded=decodeSave(doc);expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(!loaded.ok)continue;expect(loaded.match.campaignRun).toEqual(m.campaignRun);expect(loaded.match.factions).toEqual(m.factions);
  const score=resultScore({...m,matchId:'00000000-0000-4000-8000-000000000001',outcome:'victory'})!;expect(validHighscore(score)).toBe(true);expect(scorePartition(score)).not.toBe(scorePartition({...score,campaignId:undefined}));
  const forged=JSON.parse(doc);forged.state.campaignRun.campaignId=identityFor(faction==='crown'?'clans':'crown','normal').campaignId;expect(decodeSave(JSON.stringify(forged)).ok).toBe(false);
 }
});
it('tactical goals observe live units/research/fleet and permanent advancement preserves campaign ID',()=>{
 const identity=identityFor('clans','normal'),m=startCampaignMission({version:1,identity,completed:campaignMissions.map(m=>m.id)},'the-siege','normal',{player:'clans',enemy:'crown'})!,plan=campaignPlan(m)!,phase=plan.phases.findIndex(p=>p.goal==='research');m.campaignRun!.phase=phase;expect(campaignPhaseMet(m,plan.phases[phase])).toBe(false);m.research!.attack=1;const next=advanceCampaignPhases(m);expect(next.campaignRun!.phase).toBe(phase+1);expect(next.campaignRun!.campaignId).toBe(identity.campaignId);
});
it('Save51 migrates as legacy without assigning an unknown campaign identity',()=>{
 const m=startCampaignMission({version:1,completed:[]},'first-steps','normal',{player:'crown',enemy:'clans'})!,doc=JSON.parse(encodeSave(m,{camera:{x:0,y:0},building:null}));legacyTerrainFixture(doc);doc.configVersion='tribute-config-51';const loaded=decodeSave(JSON.stringify(doc));expect(loaded.ok).toBe(true);if(loaded.ok)expect(loaded.match.campaignRun?.campaignId).toBeUndefined();
});
