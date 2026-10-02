import { describe,expect,it } from 'vitest';
import { gameplayKeyAllowed } from './keyboard';
describe('gameplay keyboard focus guard',()=>{
 it.each(['INPUT','TEXTAREA','SELECT','BUTTON','A'])('ignores focused %s',focusedTag=>expect(gameplayKeyAllowed({playing:true,repeat:false,focusedTag})).toBe(false));
 it('ignores repeat, alt, editable and game over; accepts focused canvas/body',()=>{
  expect(gameplayKeyAllowed({playing:true,repeat:false,focusedTag:'CANVAS'})).toBe(true);expect(gameplayKeyAllowed({playing:true,repeat:false})).toBe(true);
  for(const override of [{playing:false},{repeat:true},{altKey:true},{contentEditable:true}])expect(gameplayKeyAllowed({playing:true,repeat:false,...override})).toBe(false);
 });
});
