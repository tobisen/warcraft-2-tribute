import {describe,it,expect} from 'vitest';
import {factionsForPlayer,factionForTeam} from '../config/factions';
import {createSession,changeOptions,sessionTransition} from '../gameplay/session';
import {createMatch} from '../gameplay/match';
import {matchLabels} from './hud';
import {motion,unitFrame,deathEffect} from './animation';
describe('faction presentation and menu isolation',()=>{
 it('switches new-match sides only in menu without changing the previous match',()=>{
  const old=createMatch(),session=createSession({scenario:'survival',difficulty:'normal',map:'arena',faction:'crown'});
  const chosen=changeOptions(session,{faction:'clans'}),playing=sessionTransition(chosen,'start');
  const next=createMatch(playing.options.scenario,playing.options.difficulty,factionsForPlayer(playing.options.faction!));
  expect(next.factions).toEqual({player:'clans',enemy:'crown'});expect(old.factions).toEqual({player:'crown',enemy:'clans'});
  expect(changeOptions(playing,{faction:'crown'})).toBe(playing);expect(session.options.faction).toBe('crown');
  expect(sessionTransition({...playing,phase:'paused'},'restart').options.faction).toBe('clans');
 });
 it('uses owner-independent names and keeps faction art on death',()=>{
  const state=createMatch('survival','normal',factionsForPlayer('clans'));state.gathering.units[0].selected=true;
  expect(matchLabels(state).selected).toContain('Clan Worker');expect(matchLabels(state).health).toContain('Stronghold');expect(factionForTeam(state,'enemy').unitNames.soldier).toBe('Guard');
  const m=motion(undefined,{x:5,y:6},'attack',0,'soldier','player',undefined,'clans');expect(unitFrame(m,.125)).toBe('clans-soldier-player-s-attack-1');
  const dead=deathEffect(m,1,true,true)!;expect(unitFrame(dead.motion,1.25)).toBe('clans-soldier-player-s-death-2');
 });
});
