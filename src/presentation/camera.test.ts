import { describe, expect, it } from 'vitest';
import { clampCamera, dragCamera, screenToWorld } from './camera';
import { selectUnitAt, selectUnitsInRectangle } from '../gameplay/selection';
import { barracksFootprint } from '../gameplay/placement';

const world = { width:1280, height:960 }, viewport = { width:800, height:600 };
describe('fixed-zoom bounded camera', () => {
  it('clamps all world edges and worlds smaller than the viewport', () => {
    expect(clampCamera({x:-50,y:1000},world,viewport)).toEqual({x:0,y:360});
    expect(clampCamera({x:9999,y:-1},world,viewport)).toEqual({x:480,y:0});
    expect(clampCamera({x:100,y:100},viewport,world)).toEqual({x:0,y:0});
  });
  it('pans opposite to pointer travel, relative to the gesture start', () => {
    const drag={screen:{x:700,y:500},scroll:{x:0,y:0}};
    expect(dragCamera(drag,{x:220,y:140},world,viewport)).toEqual({x:480,y:360});
    expect(dragCamera(drag,{x:700,y:500},world,viewport)).toEqual({x:0,y:0});
  });
  it('converts all viewport corners at all camera extremes', () => {
    for(const x of [0,480])for(const y of [0,360])for(const sx of [0,800])for(const sy of [0,600]) {
      expect(screenToWorld({x:sx,y:sy},{x,y})).toEqual({x:x+sx,y:y+sy});
    }
  });
  it('preserves world-space click, reverse rectangle and building snap after pan', () => {
    const scroll={x:480,y:360};
    const units=[{id:'unit-1',selected:false,target:{x:1200,y:880},position:{x:1200,y:880}}];
    expect(selectUnitAt(units,screenToWorld({x:720,y:520},scroll),24)[0].selected).toBe(true);
    expect(selectUnitsInRectangle(units,screenToWorld({x:730,y:530},scroll),screenToWorld({x:710,y:510},scroll))[0].selected).toBe(true);
    expect(barracksFootprint(screenToWorld({x:741,y:549},scroll))).toEqual({x:1216,y:896,width:64,height:64});
  });
});
