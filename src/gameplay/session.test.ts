import { describe,expect,it } from 'vitest';
import { changeOptions,createSession,gameplayDelta,sessionTransition } from './session';
import { createMatch,updateMatch } from './match';
import { enqueueProduction } from './productionQueue';
const options={scenario:'survival' as const,difficulty:'normal' as const,map:'arena' as const};
describe('local match lifecycle and frozen simulation',()=>{
 it('uses guarded menu/start/pause/resume/outcome/restart/new-menu transitions',()=>{
  let s=createSession(options);expect(s.phase).toBe('menu');expect(sessionTransition(s,'pause')).toBe(s);s=sessionTransition(s,'start');expect(s.phase).toBe('playing');expect(sessionTransition(s,'start')).toBe(s);s=sessionTransition(s,'pause');expect(s.phase).toBe('paused');expect(sessionTransition(s,'pause')).toBe(s);s=sessionTransition(s,'resume');expect(s.phase).toBe('playing');s=sessionTransition(s,'end');expect(s.phase).toBe('ended');expect(sessionTransition(s,'resume')).toBe(s);s=sessionTransition(s,'restart');expect(s.phase).toBe('playing');expect(s.options).toEqual(options);expect(sessionTransition(s,'new-match').phase).toBe('menu');
 });
 it('changes choices only in menu and copies options instead of mutating caller',()=>{
  const s=createSession(options),next=changeOptions(s,{scenario:'skirmish',difficulty:'hard'});expect(s.options).toEqual(options);expect(next.options).toMatchObject({scenario:'skirmish',difficulty:'hard',map:'arena'});const playing=sessionTransition(next,'start');expect(changeOptions(playing,{difficulty:'easy'})).toBe(playing);expect(changeOptions(sessionTransition(playing,'pause'),{scenario:'survival'}).options.scenario).toBe('skirmish');
 });
 it('frozen model preserves every system/queue/projectile/reference during a long pause',()=>{
  let m=createMatch('skirmish');m.gathering.wood=100;m.gathering.units[0].selected=true;m.gathering.units[0].order={kind:'gather',nodeId:'wood-1'};const queued=enqueueProduction(m.gathering,m.production,{kind:'base'});m={...m,gathering:queued.gathering,production:queued.production};m=updateMatch(m,1);m.combat.projectiles=[{id:'fixture',targetId:'enemy-base',position:{x:500,y:400},destination:{x:1008,y:144},speed:180,remainingLife:3,damage:24,hitRadius:0,splashRadius:48}];m.paused=true;
  const before=JSON.stringify(m);for(const delta of [0,1,100000])expect(updateMatch(m,delta)).toBe(m);expect(JSON.stringify(m)).toBe(before);expect(m.production.remainingSeconds).toBe(4);expect(m.enemyProduction!.acceptedJobs).toBeGreaterThan(0);
 });
 it('does not process destruction/outcome while paused and processes it on resume',()=>{
  const m=createMatch();m.paused=true;m.combat.baseHP=0;expect(updateMatch(m,10).outcome).toBe('playing');expect(updateMatch({...m,paused:false},0).outcome).toBe('defeat');
 });
 it('drops the first resume/start frame and never accumulates menu or pause wall-time',()=>{
  expect(gameplayDelta('menu',100000,false)).toBe(0);expect(gameplayDelta('paused',100000,false)).toBe(0);expect(gameplayDelta('ended',100000,false)).toBe(0);expect(gameplayDelta('playing',100000,true)).toBe(0);expect(gameplayDelta('playing',.016,false)).toBe(.016);expect(gameplayDelta('playing',-1,false)).toBe(0);
 });
 it.each(['survival','skirmish'] as const)('new %s matches preserve choices but reset all model state',scenario=>{
  for(const difficulty of ['easy','normal','hard'] as const){const session=sessionTransition(createSession({scenario,difficulty,map:'arena'}),'start'),m=createMatch(session.options.scenario,session.options.difficulty);m.gathering.wood=100;m.controlGroups={'1':['unit-1']};m.paused=true;const restartSession=sessionTransition({...session,phase:'paused'},'restart'),fresh=createMatch(restartSession.options.scenario,restartSession.options.difficulty);expect(fresh.gathering.wood).toBe(0);expect(fresh.controlGroups).toEqual({});expect(fresh.paused).toBe(false);expect(fresh.scenario).toBe(scenario);expect(fresh.difficulty).toBe(difficulty);}
 });
});
