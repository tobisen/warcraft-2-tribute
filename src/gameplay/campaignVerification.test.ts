import {expect,it} from 'vitest';
import {campaignMissions,campaignPreset} from '../config/campaign';
import {operationConfig} from '../config/operations';
import {factions} from '../config/factions';
import {startCampaignMission,createCampaignStore,campaignMissionStatus} from './campaign';
import {updateMatch,type MatchState} from './match';
import {encodeSave,decodeSave} from './save';
import {matchStats} from './matchStats';
const view={camera:{x:0,y:0},building:null};
const admission={version:1 as const,completed:campaignMissions.map(m=>m.id)};
function roundtrip(m:MatchState){const r=decodeSave(encodeSave(m,view));expect(r.ok,r.ok?'':r.error).toBe(true);if(!r.ok)throw Error(r.error);return r.match;}
// Explicit objective fixtures, separate from the paid early/late/native playthroughs.
for(const mission of campaignMissions)it(`${mission.id}: saved defeat preserves goal state and cannot unlock or reward`,()=>{
 const m=startCampaignMission(admission,mission.id,'normal',campaignPreset(mission.id)!)!;m.combat.baseHP=0;
 const ended=updateMatch(m,0),loaded=roundtrip(ended),before=JSON.stringify(loaded),stats=matchStats(loaded);
 expect(loaded.outcome).toBe('defeat');expect(updateMatch(loaded,100)).toBe(loaded);
 let writes=0;const store=createCampaignStore(()=>({getItem:()=>null,setItem:()=>{writes++;}}));store.load();store.record(loaded);store.record(loaded);
 expect(store.get().completed).toEqual([]);expect(writes).toBe(0);expect(JSON.stringify(loaded)).toBe(before);expect(matchStats(loaded)).toEqual(stats);
 const replay=startCampaignMission(admission,mission.id,'normal',loaded.factions!)!;expect(replay.outcome).toBe('playing');expect(replay.waves.elapsedSeconds).toBe(0);expect(replay.capture?.holdSeconds??0).toBe(0);
});
for(const scenario of Object.keys(operationConfig) as (keyof typeof operationConfig)[])it(`${scenario}: one defeated guard persists across load and cannot satisfy the remaining objective`,()=>{
 const mission=campaignMissions.find(m=>m.scenario===scenario)!,m=startCampaignMission(admission,mission.id,'normal',campaignPreset(mission.id)!)!;
 m.combat.enemies.shift();const loaded=roundtrip(m);expect(loaded.combat.enemies.map(e=>e.id)).toEqual(['enemy-2']);expect(updateMatch(loaded,0).outcome).toBe('playing');expect(matchStats(loaded).enemy).toMatchObject({added:0,lost:1});expect(loaded.gathering.wood).toBe(m.gathering.wood);
});
it('saved partial banner progress survives pause/load but absence starts a new full hold',()=>{
 let m=startCampaignMission(admission,'coastal-banner','normal',campaignPreset('coastal-banner')!)!;m.combat.enemies=[];m.campaignRun!.phase=4;
 const zone=operationConfig['mission-capture'].zone,id=`unit-${m.production.nextUnitNumber}`;m.production.nextUnitNumber++;m.soldierProduction.nextUnitNumber=m.production.nextUnitNumber;
 m.gathering.units.push({id,owner:'player',kind:'soldier',hp:factions.crown.units.soldier.hp,position:{...zone},target:{...zone},selected:false,cargo:0,order:{kind:'idle'}});
 m=updateMatch(m,8);m=roundtrip({...m,paused:true});expect(updateMatch(m,100)).toBe(m);expect(m.capture?.holdSeconds).toBe(8);
 m.paused=false;m.gathering.units.find(u=>u.id===id)!.position={x:zone.x+100,y:zone.y};m=updateMatch(m,0);expect(m.capture?.holdSeconds).toBe(0);m=roundtrip(m);m.gathering.units.find(u=>u.id===id)!.position={...zone};m=updateMatch(m,29);expect(m.outcome).toBe('playing');m=updateMatch(m,1);expect(m.outcome).toBe('victory');expect(m.capture?.holdSeconds).toBe(30);
});
it('actual escort goal and repeated loaded results write one completion without mutating bank, cargo or statistics',()=>{
 const m=startCampaignMission(admission,'ridge-convoy','normal',campaignPreset('ridge-convoy')!)!;m.campaignRun!.phase=3;m.combat.enemies=[];m.gathering.units.find(u=>u.id==='unit-4')!.position={...operationConfig['mission-escort'].zone};
 const ended=updateMatch(m,0),memory=new Map<string,string>();let writes=0;const storage={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{writes++;memory.set(k,v);}};
 const store=createCampaignStore(()=>storage);store.load();const loaded=roundtrip(ended),before=JSON.stringify(loaded),stats=matchStats(loaded);
 store.record(loaded);store.record(roundtrip(loaded));const reload=createCampaignStore(()=>storage);reload.load();reload.record(roundtrip(loaded));expect(writes).toBe(1);expect(reload.get().completed).toEqual(['ridge-convoy']);expect(campaignMissionStatus(reload.get(),'valley-rescue')).toBe('available');expect(campaignMissionStatus(reload.get(),'the-crossing')).toBe('locked');expect(JSON.stringify(loaded)).toBe(before);expect(matchStats(loaded)).toEqual(stats);
});
