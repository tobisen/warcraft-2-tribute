import {describe,it,expect} from 'vitest';
import {resultNavigation} from './resultScreen';
import {createSession,sessionTransition,gameplayDelta} from '../gameplay/session';
describe('result navigation and terminal match actions',()=>{
 it('highscore/back/escape navigation never changes the terminal session',()=>{expect(resultNavigation('summary','highscores')).toBe('highscores');expect(resultNavigation('highscores','back')).toBe('summary');expect(resultNavigation('highscores','escape')).toBe('summary');});
 it('statistics/back/escape never resume the ended session',()=>{
  const ended=sessionTransition(sessionTransition(createSession({scenario:'survival',difficulty:'normal',map:'arena'}),'start'),'end');
  expect(resultNavigation('summary','statistics')).toBe('statistics');expect(resultNavigation('statistics','back')).toBe('summary');expect(resultNavigation('statistics','escape')).toBe('summary');
  expect(sessionTransition(ended,'resume')).toBe(ended);expect(gameplayDelta(ended.phase,100,false)).toBe(0);
  expect(sessionTransition(ended,'restart')).toEqual({...ended,phase:'playing'});expect(sessionTransition(ended,'new-match').phase).toBe('menu');
 });
});
