import {expect,it} from 'vitest';
import {createMatch} from './match';
import {selectWorldTarget} from './resourceSelection';
import {resourceNodes,orderUnits} from './gathering';
import {knownResource} from './visibility';
import {fogIndex} from './fog';
import {selectionInfo} from '../presentation/selectionInfo';

const pick=(m:ReturnType<typeof createMatch>,point:{x:number;y:number})=>selectWorldTarget(m.gathering.units,point,m.gathering.base,m.placement.barracks,24,null,resourceNodes(m.gathering),n=>knownResource(m.fog!,n.position));
const reveal=(m:ReturnType<typeof createMatch>,point:{x:number;y:number},visible=true)=>{
 const i=fogIndex(m.fog!,point)!;m.fog!.teams.player.explored[i]=true;m.fog!.teams.player.visible[i]=visible;
};
it('resource hit clears units/buildings without changing ongoing orders or admitting move commands',()=>{
 const m=createMatch(),node=m.gathering.node;m.gathering.units[0].selected=true;
 m.gathering.units[0].order={kind:'move'};m.gathering.units[0].target={x:600,y:240};reveal(m,node.position);
 const result=pick(m,node.position);
 expect(result.resource).toBe(node.id);expect(result.building).toBeNull();expect(result.units.every(u=>!u.selected)).toBe(true);
 expect(result.units[0].order).toEqual({kind:'move'});expect(orderUnits(result.units,{x:700,y:500})).toEqual(result.units);
 expect(pick({...m,gathering:{...m.gathering,units:result.units}},m.gathering.base)).toMatchObject({building:'base',resource:null});
 expect(pick(m,m.gathering.units[0].position).resource).toBeNull();
 expect(pick(m,{x:100,y:100})).toMatchObject({building:null,resource:null});
});
it('overlapping own entities have priority and unknown resources cannot be selected',()=>{
 const m=createMatch(),node=m.gathering.node;
 expect(pick(m,node.position).resource).toBeNull();reveal(m,node.position);
 m.gathering.units[0].position={...node.position};expect(pick(m,node.position).units[0].selected).toBe(true);expect(pick(m,node.position).resource).toBeNull();
});
it.each(['wood','gold'] as const)('bottom bar displays live %s stock and depletion, never hidden current quantities',type=>{
 const m=createMatch(),node=resourceNodes(m.gathering).find(n=>n.resource===type)!;
 expect(selectionInfo(m,null,node.id).name).toBe('No selection');reveal(m,node.position);
 node.remaining=12.5;expect(selectionInfo(m,null,node.id)).toMatchObject({name:type==='wood'?'Wood grove':'Gold mine',detail:`${node.id} · 13 remaining`,hp:null,portrait:null,stats:[`Resource: ${type}`]});
 node.remaining=0;expect(selectionInfo(m,null,node.id).detail).toContain('Depleted');
 reveal(m,node.position,false);expect(selectionInfo(m,null,node.id).detail).toBe(`${node.id} · Outside current vision`);
 node.remaining=55;expect(selectionInfo(m,null,node.id).detail).toBe(`${node.id} · Outside current vision`);
 expect(selectionInfo(m,null,'missing').name).toBe('No selection');
});
it('expansion nodes use the same selection and visibility rules',()=>{
 const m=createMatch('skirmish','beginner',undefined,'frontier');
 for(const node of m.gathering.extraNodes!){expect(pick(m,node.position).resource).toBeNull();reveal(m,node.position);expect(pick(m,node.position).resource).toBe(node.id);expect(selectionInfo(m,null,node.id).detail).toContain(String(node.remaining));}
});
