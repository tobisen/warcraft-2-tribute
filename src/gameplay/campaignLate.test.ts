import {expect,it} from 'vitest';
import {campaignMissions,campaignPreset} from '../config/campaign';
import {playCampaignOperation} from './testHelpers/campaignOperations';
import {completeCampaignMission,startCampaignMission} from './campaign';
import {matchStats} from './matchStats';
import {operationOutcome} from './operations';
import {decodeSave,encodeSave} from './save';
for(const mission of campaignMissions.slice(4))it(`${mission.id}: paid Normal army, real objective, progression, Save/load and replay`,()=>{
 const result=playCampaignOperation(mission.id),m=result.match,stats=matchStats(m);
 expect(m.outcome,JSON.stringify({id:mission.id,time:m.waves.elapsedSeconds,base:m.combat.baseHP,army:m.gathering.units.filter(u=>u.kind==='soldier'),enemies:m.combat.enemies,capture:m.capture})).toBe('victory');expect(m.factions).toEqual(campaignPreset(mission.id));expect(m.campaignMission).toBe(mission.id);expect(m.combat.baseHP).toBeGreaterThan(0);expect(result.saved).toBe(true);expect(stats.player.wood.spent).toBeGreaterThan(100);expect(stats.player.gold.spent).toBeGreaterThan(0);expect(stats.player.added).toBeGreaterThanOrEqual(4);expect(stats.player.lost).toBeGreaterThanOrEqual(0);
 if(mission.scenario==='mission-sea'){expect(m.navy!.ships).toHaveLength(1);expect(m.navy!.harbor).toBeTruthy();expect(m.combat.enemies.some(e=>e.kind==='base')).toBe(false);}else expect(operationOutcome(m)).toBe('victory');
 if(mission.scenario==='mission-capture'){expect(m.navy!.ships).toHaveLength(1);expect(m.capture?.holdSeconds).toBe(30);}
 const loaded=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);
 const progress={version:1 as const,completed:campaignMissions.slice(0,campaignMissions.indexOf(mission)).map(m=>m.id)},next=completeCampaignMission(progress,m);expect(next.completed.at(-1)).toBe(mission.id);expect(completeCampaignMission(next,m)).toBe(next);
 const replay=startCampaignMission(next,mission.id,'normal',m.factions!)!;expect(replay.outcome).toBe('playing');expect(replay.waves.elapsedSeconds).toBe(0);expect(replay.placement.barracks).toBeNull();expect(replay.capture?.holdSeconds??0).toBe(0);
 console.info({mission:mission.id,time:m.waves.elapsedSeconds,base:m.combat.baseHP,spent:stats.player.wood.spent,gold:stats.player.gold.spent,abilities:result.abilities});
},120_000);
