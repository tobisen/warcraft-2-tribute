import {expect,it} from 'vitest';
import {difficultyProfiles} from '../config/difficulty';
import {scenarioWaves} from '../config/scenarios';
import {enemyNavalConfig} from '../config/enemyNaval';
import {createMatch,updateMatch} from './match';
import {encodeSave,decodeSave} from './save';
import {factionsForPlayer} from '../config/factions';
it('delays custom missions without increasing their attack sizes; preserves prior schedules',()=>{
 expect(scenarioWaves('mission-outpost','beginner')).toEqual([{atSeconds:60,count:1},{atSeconds:90,count:1},{atSeconds:110,count:1}]);
 expect(scenarioWaves('mission-outpost','easy')[0]).toEqual({atSeconds:40,count:1});expect(scenarioWaves('mission-outpost','normal')[0]).toEqual({atSeconds:30,count:1});expect(scenarioWaves('mission-outpost','hard')[0]).toEqual({atSeconds:25,count:2});
 let m=createMatch('mission-outpost','beginner');for(let i=0;i<599;i++)m=updateMatch(m,.1);expect(m.waves.nextWave).toBe(0);m=updateMatch(m,.1);expect(m.waves.nextWave).toBe(1);expect(m.combat.enemies).toHaveLength(1);
});
it('roundtrips Beginner on all map types; naval launch waits longer than Easy',()=>{
 for(const map of ['arena','forest','river','islands'] as const){let m=createMatch('skirmish','beginner',factionsForPlayer('clans'),map);m=updateMatch(m,0);const result=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(result.ok,result.ok?'':result.error).toBe(true);if(result.ok){expect(result.match.difficulty).toBe('beginner');expect(result.match.enemyProduction?.durationSeconds).toBe(12);}}
 expect(enemyNavalConfig.launchSeconds.beginner).toBeGreaterThan(enemyNavalConfig.launchSeconds.easy);let m=createMatch('skirmish','beginner',factionsForPlayer('crown'),'islands');for(let i=0;i<600;i++)m=updateMatch(m,.2);expect(m.enemyNaval?.phase).not.toBe('loading');expect(m.enemyNaval?.phase).not.toBe('sailing');
},30000);
it('keeps player initial economy, HP, unit types and simulation time equal',()=>{
 const beginner=createMatch('survival','beginner'),normal=createMatch('survival','normal');expect(beginner.gathering).toEqual(normal.gathering);expect(beginner.combat).toEqual(normal.combat);expect(updateMatch(beginner,.25).waves.elapsedSeconds).toBe(.25);expect(difficultyProfiles.beginner.ai.groupSize).toBeLessThan(difficultyProfiles.easy.ai.groupSize);
});
