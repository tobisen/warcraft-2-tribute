import {legacyEnemyFixture} from './testHelpers/legacyEnemyFixture';
import {expect,it} from 'vitest';
import {isGameSpeed,initialGameSpeed} from '../config/gameSpeed';
import {factionsForPlayer} from '../config/factions';
import {createSession,changeOptions,sessionTransition,gameplayDelta} from './session';
import {createMatch,updateMatch} from './match';
import {encodeSave,decodeSave} from './save';
import {enqueueProduction} from './productionQueue';
import {orderUnits} from './gathering';
it('validates independent speeds and locks options during a match',()=>{
 for(const v of [NaN,Infinity,0,2,'0.75',null]){expect(isGameSpeed(v)).toBe(false);expect(initialGameSpeed(v)).toBe(1);}
 const s=createSession({scenario:'skirmish',difficulty:'hard',map:'arena'}),slow=changeOptions(s,{speed:.75});expect(s.options.speed).toBeUndefined();expect(slow.options).toMatchObject({speed:.75,difficulty:'hard'});expect(changeOptions(s,{speed:2} as any)).toBe(s);expect(changeOptions(sessionTransition(slow,'start'),{speed:1}).options.speed).toBe(.75);expect(sessionTransition({...slow,phase:'paused'},'restart').options.speed).toBe(.75);
 for(const phase of ['menu','paused','ended'] as const)expect(gameplayDelta(phase,999,false,.75)).toBe(0);expect(gameplayDelta('playing',999,true,.75)).toBe(0);expect(gameplayDelta('playing',4,false,.75)).toBe(3);expect(gameplayDelta('playing',4,false,1)).toBe(4);
});
it('scales real movement and production consistently, with no double scaling in updateMatch',()=>{
 let m=createMatch('mission-outpost','normal',factionsForPlayer('crown'),'arena',.75);
 m.gathering.units[2].selected=true;m.gathering.units=orderUnits(m.gathering.units,{x:760,y:300});const queued=enqueueProduction(m.gathering,m.production,{kind:'base'});m={...m,gathering:queued.gathering,production:queued.production};
 m=updateMatch(m,gameplayDelta('playing',.25,false,.75));expect(m.waves.elapsedSeconds).toBe(.1875);expect(m.production.remainingSeconds).toBeCloseTo(4.8125);expect(m.gathering.units.find(u=>u.id==='unit-3')!.position.x).toBeCloseTo(550);
 for(let i=0;i<19;i++)m=updateMatch(m,gameplayDelta('playing',.25,false,.75));expect(m.waves.elapsedSeconds).toBe(3.75);expect(m.production.remainingSeconds).toBeCloseTo(1.25);expect(m.gathering.units).toHaveLength(3);
 for(let i=0;i<7;i++)m=updateMatch(m,gameplayDelta('playing',.25,false,.75));expect(m.gathering.units).toHaveLength(4);expect(m.production.remainingSeconds).toBeNull();
});
it('equivalent gameplay time preserves entire gather/combat/wave/AI/navy state',()=>{
 for(const scenario of ['mission-waves','skirmish','mission-sea'] as const){const map=scenario==='mission-sea'?'islands':'arena';let slow=createMatch(scenario,'beginner',factionsForPlayer('crown'),map,.75),normal=createMatch(scenario,'beginner',factionsForPlayer('crown'),map,1);
 for(const m of [slow,normal]){m.gathering.units[2].selected=true;m.gathering.units=orderUnits(m.gathering.units,m.gathering.node.position,m.gathering.node);}
 for(let i=0;i<800;i++){slow=updateMatch(slow,gameplayDelta('playing',.25,false,.75));normal=updateMatch(normal,gameplayDelta('playing',.1875,false,1));}
 expect({...slow,speed:1}).toEqual(normal);expect(slow.gathering.wood).toBeGreaterThan(0);expect(slow.waves.elapsedSeconds).toBe(150);if(scenario==='mission-waves')expect(slow.waves.nextWave).toBe(1);else expect(slow.enemyAI?.elapsedSeconds).toBe(150);
 }
},30000);
it('roundtrips both speeds; migrates older saves to 1× and rejects malformed speed',()=>{
 for(const speed of [.75,1] as const){const m=createMatch('skirmish','beginner',factionsForPlayer('clans'),'islands',speed);const json=encodeSave(m,{camera:{x:0,y:0},building:null});const loaded=decodeSave(json);expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(loaded.ok)expect(loaded.match.speed).toBe(speed);
 for(const value of [undefined,null,0,2,'0.75']){const d=JSON.parse(json);d.state.speed=value;expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}
 const old=JSON.parse(json);old.configVersion='tribute-config-16';legacyEnemyFixture(old);delete old.state.statLedger;delete old.state.speed;const legacy=decodeSave(JSON.stringify(old));expect(legacy.ok).toBe(true);if(legacy.ok)expect(legacy.match.speed).toBe(1);
 }
});

it('roundtrips active Beginner enemy queues longer than ten seconds for both factions',()=>{
 for(const faction of ['crown','clans'] as const){let m=createMatch('skirmish','beginner',factionsForPlayer(faction),'arena',.75);for(let i=0;i<1800&&(m.enemyProduction!.production.remainingSeconds??0)<=10;i++)m=updateMatch(m,.1);expect(m.enemyProduction!.production.remainingSeconds).toBeGreaterThan(10);const result=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(result.ok,result.ok?'':result.error).toBe(true);if(result.ok){expect(result.match.enemyProduction!.production.remainingSeconds).toBe(m.enemyProduction!.production.remainingSeconds);expect(result.match.speed).toBe(.75);}}
});
