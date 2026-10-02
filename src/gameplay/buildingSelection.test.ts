import { describe, expect, it } from 'vitest';
import { createMatch } from './match';
import { allowsProduction, selectPlayerTarget } from './buildingSelection';
const barracks={x:512,y:384,width:64,height:64};
describe('exclusive player building selection',()=>{
  it('selects inclusive footprints, replaces units and clears on empty terrain',()=>{
    const s=createMatch();s.gathering.units[0].selected=true;
    const base=selectPlayerTarget(s.gathering.units,{x:376,y:426},s.gathering.base,barracks,24);
    expect(base.building).toBe('base');expect(base.units.every(u=>!u.selected)).toBe(true);
    expect(base.units[0].order).toEqual(s.gathering.units[0].order);
    expect(selectPlayerTarget(base.units,{x:576,y:448},s.gathering.base,barracks,24).building).toBe('barracks');
    expect(selectPlayerTarget(base.units,{x:750,y:550},s.gathering.base,barracks,24).building).toBeNull();
  });
  it('units win overlaps and selecting them replaces the building target',()=>{
    const s=createMatch();s.gathering.units[0].position={...s.gathering.base};
    const chosen=selectPlayerTarget(s.gathering.units,s.gathering.base,s.gathering.base,barracks,24);
    expect(chosen.building).toBeNull();expect(chosen.units[0].selected).toBe(true);
  });
  it('absent buildings and unrelated targets cannot expose production',()=>{
    const s=createMatch();
    expect(selectPlayerTarget(s.gathering.units,{x:540,y:410},s.gathering.base,null,24).building).toBeNull();
    expect(allowsProduction(null,'base',true,true)).toBe(false);
    expect(allowsProduction('base','barracks',true,true)).toBe(false);
    expect(allowsProduction('barracks','barracks',false,true)).toBe(false);
    expect(allowsProduction('base','base',true,false)).toBe(false);
    expect(allowsProduction('base','base',true,true)).toBe(true);
  });
});
