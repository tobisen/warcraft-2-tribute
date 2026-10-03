import {effectConfig} from '../config/effects';
import {describe,it,expect} from 'vitest';
import {landedEffects,impactFrame,impactAlive,hitEffects,canAddImpact,projectileAppearance} from './effects';
const shot={id:'x',targetId:'e',position:{x:0,y:0},destination:{x:10,y:0},speed:100,remainingLife:1,damage:10,hitRadius:1};
describe('cosmetic impact lifecycle',()=>{
 it('flashes visible landings and splash without hidden HP reads',()=>{expect(landedEffects([shot],[],.1,1,()=>true)).toEqual([{position:{x:10,y:0},kind:'impact',since:1}]);expect(landedEffects([{...shot,splashRadius:48}],[],.1,1,()=>true)[0]?.kind).toBe('splash');expect(landedEffects([shot],[],.1,1,()=>false)).toEqual([]);});
 it('ignores ongoing shots, pause, premature removal and lifetime expiry',()=>{expect(landedEffects([shot],[shot],1,1,()=>true)).toEqual([]);expect(landedEffects([shot],[],0,1,()=>true)).toEqual([]);expect(landedEffects([shot],[],.01,1,()=>true)).toEqual([]);expect(landedEffects([{...shot,remainingLife:.05}],[],.1,1,()=>true)).toEqual([]);});
 it('bounds frames and removes after .5 seconds or fog hiding',()=>{const e={position:{x:0,y:0},kind:'splash' as const,since:1};expect(impactFrame(e,1.26)).toBe('splash-2');expect(impactFrame(e,4)).toBe('splash-3');expect(impactAlive(e,1.49,()=>true)).toBe(true);expect(impactAlive(e,1.5,()=>true)).toBe(false);expect(impactAlive(e,1.1,()=>false)).toBe(false);});
});

describe('public hit feedback and bounded projectile presentation',()=>{
 const sample={id:'unit-1',hp:30,position:{x:10,y:20}};
 it('only existing, surviving HP loss is a hit; spawn/reveal/removal/heal are silent',()=>{
  expect(hitEffects(undefined,[sample],1,true)).toEqual([]);
  expect(hitEffects([],[sample],1,true)).toEqual([]);
  expect(hitEffects([sample],[],1,true)).toEqual([]);
  expect(hitEffects([sample],[{...sample,hp:0}],1,true)).toEqual([]);
  expect(hitEffects([sample],[{...sample,hp:31}],1,true)).toEqual([]);
  expect(hitEffects([sample],[{...sample,hp:25}],1,false)).toEqual([]);
  const next={...sample,hp:25,position:{x:30,y:40}},result=hitEffects([sample],[next],2,true);
  expect(result).toEqual([{kind:'impact',position:{x:30,y:40},since:2}]);result[0].position.x=99;expect(next.position.x).toBe(30);
 });
 it('limits concurrent effects and repeated nearby hit spam without dropping distinct splash/death',()=>{
  const active={position:{x:10,y:10},kind:'impact' as const,since:1};
  expect(canAddImpact([active],{...active,since:1.1})).toBe(false);
  expect(canAddImpact([active],{...active,since:1.16})).toBe(true);
  expect(canAddImpact([active],{...active,position:{x:30,y:10},since:1.1})).toBe(true);
  expect(canAddImpact([active],{...active,kind:'dust',since:1.1})).toBe(true);
  expect(canAddImpact(Array.from({length:64},()=>active),{...active,kind:'splash',since:2})).toBe(false);
  expect(impactFrame({...active,kind:'dust'},1.26)).toBe('dust-2');
 });
 it('distinguishes arrow, stone and cannonball and follows actual travel direction',()=>{
  expect(projectileAppearance(shot)).toEqual({kind:'arrow',rotation:0});
  expect(projectileAppearance({...shot,splashRadius:48})).toEqual({kind:'stone',rotation:0});
  expect(projectileAppearance({...shot,marine:true,destination:{x:0,y:10}})).toEqual({kind:'cannonball',rotation:Math.PI/2});
  expect(projectileAppearance({...shot,marine:true,splashRadius:48})).toMatchObject({kind:'cannonball'});
  expect(Number.isFinite(projectileAppearance({...shot,destination:{...shot.position}}).rotation)).toBe(true);
 });
});

it('keeps transient ground art beneath units and projectiles beneath selection/HP',()=>{expect(effectConfig.groundDepth).toBeLessThan(0);expect(effectConfig.projectileDepth).toBeLessThan(effectConfig.selectionDepth);expect(effectConfig.selectionDepth).toBeLessThan(7);});
