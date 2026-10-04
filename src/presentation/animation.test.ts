import {describe,it,expect} from 'vitest';
import {facing,motion,unitFrame,unitOrigin,unitOverlayOffsets,deathEffect,effectAlive,directions} from './animation';
describe('native animation presentation',()=>{
 it('has consistent eight-way facing and preserves facing for zero movement',()=>{directions.forEach((d,i)=>expect(facing({x:Math.cos(i*Math.PI/4),y:Math.sin(i*Math.PI/4)})).toBe(d));expect(facing({x:0,y:0},'nw')).toBe('nw');});
 it('movement overrides work pose; state changes restart timing and aim controls facing',()=>{const a=motion(undefined,{x:1,y:1},'gather',0,'worker','player');const b=motion(a,{x:2,y:1},'gather',.1,'worker','player');expect(b.action).toBe('walk');expect(b.facing).toBe('e');const c=motion(b,b.position,'attack',1,'worker','player',{x:2,y:20});expect(c.action).toBe('attack');expect(c.facing).toBe('s');expect(c.since).toBe(1);expect(unitFrame(c,1.26)).toBe('worker-player-s-attack-2');expect(unitFrame(c,1.5)).toBe('worker-player-s-attack-0');});
 it('death is bounded, visibility gated and cannot create selection/HP or survive restart state',()=>{const m=motion(undefined,{x:1,y:1},'idle',0,'soldier','enemy');expect(deathEffect(m,1,false,true)).toBeNull();expect(deathEffect(m,1,true,false)).toBeNull();const e=deathEffect(m,1,true,true)!;expect(effectAlive(e,1.49,true)).toBe(true);expect(effectAlive(e,1.5,true)).toBe(false);expect(effectAlive(e,1.1,false)).toBe(false);expect(unitFrame(e.motion,2)).toBe('soldier-enemy-s-death-3');expect(e).not.toHaveProperty('hp');expect(e).not.toHaveProperty('selected');});
 it('render anchors do not change logic body dimensions',()=>{expect(unitOrigin('worker')).toEqual({x:.5,y:22/32});expect(unitOrigin('catapult')).toEqual({x:.5,y:40/64});});
});

it('naval sprites keep role/team/facing and have bounded fog-safe sinking frames',()=>{
 const a=motion(undefined,{x:700,y:432},'idle',0,'transport','enemy',undefined,'clans');const sailing=motion(a,{x:699,y:432},'idle',.1,'transport','enemy',undefined,'clans');expect(unitFrame(sailing,.36)).toBe('clans-transport-enemy-w-walk-2');expect(unitOrigin('transport')).toEqual({x:.5,y:40/64});const firing=motion(undefined,{x:800,y:432},'attack',0,'warship','player',{x:880,y:432});expect(unitFrame(firing,.15)).toBe('warship-player-e-attack-1');expect(deathEffect(sailing,.4,false,true)).toBeNull();expect(deathEffect(sailing,.4,true,false)).toBeNull();const death=deathEffect(sailing,.4,true,true)!;expect(unitFrame(death.motion,1)).toBe('clans-transport-enemy-w-death-3');expect(effectAlive(death,.9,true)).toBe(false);
});

it('keeps Human labels above the taller native silhouette without moving other faction overlays',()=>{
 for(const type of ['worker','soldier'] as const){expect(unitOverlayOffsets(type,'crown')).toEqual({hp:48,cargo:68});expect(unitOverlayOffsets(type,'clans')).toEqual({hp:29,cargo:48});}
 expect(unitOverlayOffsets('catapult','crown')).toEqual({hp:39,cargo:48});
});
