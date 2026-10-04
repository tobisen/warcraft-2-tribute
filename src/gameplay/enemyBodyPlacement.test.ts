import {expect,it} from 'vitest';
import {createMatch} from './match';
import {beginPlacement,placementError} from './placement';
import {chooseSpawn} from './spawning';

it('placement checks the full enemy siege body at an edge that clears a melee body',()=>{
 const m=createMatch('skirmish');
 const position={x:430,y:544};
 const context={map:{...m.map,obstacles:[]},gathering:{...m.gathering,units:[{...m.gathering.units[0],selected:true}],wood:100},enemies:[{position,kind:'unit',role:'catapult'}]};
 const state=beginPlacement(m.placement);
 expect(placementError(state,{x:448,y:512},100,[],context)).toBe('Overlaps a unit');
 expect(placementError(state,{x:448,y:512},100,[],{...context,enemies:[{position,kind:'unit',role:'soldier'}]})).toBeNull();
});
it('spawn candidates avoid the full opposing siege body instead of treating it as a soldier',()=>{
 const m=createMatch('skirmish'),map={...m.map,obstacles:[]},footprint={x:512,y:384,width:64,height:64};
 const candidate=chooseSpawn(map,footprint,'barracks',[],[]);expect(candidate).not.toBeNull();if(!candidate)return;
 const position={x:candidate.x+30,y:candidate.y};
 expect(chooseSpawn(map,footprint,'barracks',[],[{position,role:'soldier'}])).toEqual(candidate);
 expect(chooseSpawn(map,footprint,'barracks',[],[{position,role:'catapult'}])).not.toEqual(candidate);
});
