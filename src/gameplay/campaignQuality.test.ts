import {expect,it} from 'vitest';
import {campaignMissions,campaignPreset} from '../config/campaign';
import {playExpandedCampaign} from './testHelpers/expandedCampaign';
import {releasePlaythrough} from './testHelpers/releaseBot';
import {matchStats} from './matchStats';
import {decodeSave,encodeSave} from './save';
for(const mission of campaignMissions)it(`${mission.id}: Beginner paid completion, recoverable preparation and phase-boundary Save`,()=>{
 const result=mission.id==='first-steps'?releasePlaythrough(mission.scenario,'beginner',undefined,{campaignMission:mission.id,abilities:true}):playExpandedCampaign(mission.id,'beginner');
 const m=result.match,stats=matchStats(m);expect(m.outcome).toBe('victory');expect(m.factions).toEqual(campaignPreset(mission.id));expect(m.combat.baseHP).toBeGreaterThan(0);expect(result.saved).toBe(true);expect(stats.player.wood.spent).toBeGreaterThan(40);expect(stats.player.gold.spent).toBeGreaterThan(0);
 expect(decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null})).ok).toBe(true);
 console.info({mission:mission.id,difficulty:'beginner',automatedGameplaySeconds:stats.seconds,base:m.combat.baseHP,woodSpent:stats.player.wood.spent,goldSpent:stats.player.gold.spent,humanDurationVerified:false});
},120_000);
