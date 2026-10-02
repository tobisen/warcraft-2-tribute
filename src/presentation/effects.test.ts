import {describe,it,expect} from 'vitest';
import {landedEffects,impactFrame,impactAlive} from './effects';
const shot={id:'x',targetId:'e',position:{x:0,y:0},destination:{x:10,y:0},speed:100,remainingLife:1,damage:10,hitRadius:1};
describe('cosmetic impact lifecycle',()=>{
 it('flashes visible landings and splash without hidden HP reads',()=>{expect(landedEffects([shot],[],.1,1,()=>true)).toEqual([{position:{x:10,y:0},kind:'impact',since:1}]);expect(landedEffects([{...shot,splashRadius:48}],[],.1,1,()=>true)[0]?.kind).toBe('splash');expect(landedEffects([shot],[],.1,1,()=>false)).toEqual([]);});
 it('ignores ongoing shots, pause, premature removal and lifetime expiry',()=>{expect(landedEffects([shot],[shot],1,1,()=>true)).toEqual([]);expect(landedEffects([shot],[],0,1,()=>true)).toEqual([]);expect(landedEffects([shot],[],.01,1,()=>true)).toEqual([]);expect(landedEffects([{...shot,remainingLife:.05}],[],.1,1,()=>true)).toEqual([]);});
 it('bounds frames and removes after .5 seconds or fog hiding',()=>{const e={position:{x:0,y:0},kind:'splash' as const,since:1};expect(impactFrame(e,1.26)).toBe('splash-2');expect(impactFrame(e,4)).toBe('splash-3');expect(impactAlive(e,1.49,()=>true)).toBe(true);expect(impactAlive(e,1.5,()=>true)).toBe(false);expect(impactAlive(e,1.1,()=>false)).toBe(false);});
});
