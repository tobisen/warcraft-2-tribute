import { describe,expect,it } from 'vitest';
import { commandGuide,dispatchHotkey,hotkeyButton,hotkeys } from './hotkeys';
import { createMatch } from '../gameplay/match';
import { enqueueProduction,canEnqueue } from '../gameplay/productionQueue';
const context={playing:true,repeat:false,focusedTag:'CANVAS'};
describe('one validated command path for hotkeys',()=>{
 it('Delete requests dismissal once and respects focus/modifier/repeat/gameplay guards',()=>{
  expect(hotkeyButton('Delete',context)).toBe('dismiss-units');let requests=0;expect(dispatchHotkey('Delete',context,()=>({disabled:false,click:()=>requests++}))).toBe(true);expect(requests).toBe(1);
  for(const override of [{focusedTag:'INPUT'},{focusedTag:'TEXTAREA'},{focusedTag:'SELECT'},{focusedTag:'BUTTON'},{contentEditable:true},{playing:false},{paused:true},{repeat:true},{ctrlKey:true},{metaKey:true},{altKey:true}])expect(hotkeyButton('Delete',{...context,...override})).toBeNull();
 });
 it('maps upper/lower keys to unique actions and keeps the displayed guide in sync',()=>{
  expect(new Set(hotkeys.map(h=>h.key)).size).toBe(hotkeys.length);for(const h of hotkeys){expect(hotkeyButton(h.key.toLowerCase(),context)).toBe(h.button);expect(commandGuide).toContain(`${h.key}: ${h.label}`);}expect(hotkeyButton('x',context)).toBeNull();expect(hotkeyButton('1',context)).toBeNull();
 });
 it('ignores focused UI, pause/game over, repeat and control/meta/alt letters',()=>{
  for(const override of [{focusedTag:'INPUT'},{focusedTag:'SELECT'},{focusedTag:'BUTTON'},{contentEditable:true},{playing:false},{paused:true},{repeat:true},{ctrlKey:true},{metaKey:true},{altKey:true}])expect(hotkeyButton('W',{...context,...override})).toBeNull();
 });
 it('checks the same disabled action, and fires one click per accepted key',()=>{
  let clicks=0;expect(dispatchHotkey('W',context,()=>({disabled:true,click:()=>clicks++}))).toBe(false);expect(clicks).toBe(0);expect(dispatchHotkey('W',context,()=>({disabled:false,click:()=>clicks++}))).toBe(true);expect(clicks).toBe(1);expect(dispatchHotkey('W',{...context,repeat:true},()=>({disabled:false,click:()=>clicks++}))).toBe(false);expect(clicks).toBe(1);
 });
 it('shared button validation/debit is atomic and repeat/insufficient funds cannot start another job',()=>{
  const s=createMatch();s.gathering.wood=20;const button=()=>({disabled:!canEnqueue(s.gathering,s.production,{kind:'base'}),click:()=>{const next=enqueueProduction(s.gathering,s.production,{kind:'base'});s.gathering=next.gathering;s.production=next.production;}});
  expect(dispatchHotkey('W',context,button)).toBe(true);expect(s.gathering.wood).toBe(0);expect(s.production.queue).toHaveLength(1);expect(dispatchHotkey('W',context,button)).toBe(false);expect(s.production.queue).toHaveLength(1);
 });
});
