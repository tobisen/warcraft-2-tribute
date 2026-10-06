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
 node.remaining=12.5;expect(selectionInfo(m,null,node.id)).toMatchObject({name:type==='wood'?'Tree':'Gold mine',detail:`${node.id} · 13 remaining`,hp:null,portrait:{atlas:'reference-terrain',frame:type==='wood'?'tree-0':'mine-full'},stats:[`Resource: ${type}`,'Workers: 0 assigned / 0 gathering']});
 node.remaining=0;expect(selectionInfo(m,null,node.id).detail).toContain('Depleted');
 reveal(m,node.position,false);expect(selectionInfo(m,null,node.id).detail).toBe(`${node.id} · Outside current vision`);
 node.remaining=55;expect(selectionInfo(m,null,node.id).detail).toBe(`${node.id} · Outside current vision`);
 expect(selectionInfo(m,null,'missing').name).toBe('No selection');
});
it('expansion nodes use the same selection and visibility rules',()=>{
 const m=createMatch('skirmish','beginner',undefined,'frontier');
 for(const node of [m.gathering.extraNodes![0],m.gathering.extraNodes![1],...m.gathering.extraNodes!.filter(n=>n.resource==='gold').slice(0,3)]){m.fog!.teams.player.explored.fill(false);m.fog!.teams.player.visible.fill(false);expect(pick(m,node.position).resource).toBeNull();reveal(m,node.position);expect(pick(m,node.position).resource).toBe(node.id);expect(selectionInfo(m,null,node.id).detail).toContain(String(Math.ceil(node.remaining)));}
});

it('inspects every farm and forge, preserving orders and unit priority',async()=>{
 const {inspectBuildingAt,inspectedBuilding,savedBuildingSelection}=await import('./buildingInspection');
 const m=createMatch();m.placement.farms=[1,2].map(n=>({id:`farm-${n}` as const,hp:40,footprint:{x:700+n*64,y:300,width:32,height:32},construction:{remainingSeconds:n===1?0:4,builderId:null}}));
 m.placement.forge={id:'forge',owner:'player',hp:60,footprint:{x:700,y:400,width:64,height:64},construction:{remainingSeconds:0,builderId:null}};
 expect(inspectBuildingAt(m,{x:765,y:305})).toBe('farm-1');expect(inspectBuildingAt(m,{x:830,y:305})).toBe('farm-2');expect(inspectBuildingAt(m,{x:710,y:410})).toBe('forge');
 expect(selectionInfo(m,'farm-1').stats.join(' ')).toContain('Supply capacity');expect(selectionInfo(m,'farm-2').detail).toContain('Construction');expect(selectionInfo(m,'forge').stats.join(' ')).toContain('Research');
 expect(savedBuildingSelection('forge')).toBeNull();expect(savedBuildingSelection('enemy:secret')).toBeNull();expect(savedBuildingSelection('base')).toBe('base');
 m.placement.farms[0].hp=0;expect(inspectedBuilding(m,'farm-1')).toBeNull();expect(selectionInfo(m,'farm-1').hp).toBeNull();
});
it('visible enemy building inspection never exposes queues/research and disappears under fog',async()=>{
 const {inspectBuildingAt,inspectedBuilding}=await import('./buildingInspection');const {actionPanel}=await import('../presentation/actionPanel');
 const m=createMatch();m.gathering.units.forEach(u=>u.selected=false);
 const enemy={id:'inspect-test',kind:'building' as const,buildingType:'forge' as const,hp:55,position:{x:800,y:500},footprint:{x:784,y:484,width:32,height:32}};m.combat.enemies.push(enemy);
 expect(inspectBuildingAt(m,enemy.position)).toBeNull();reveal(m,enemy.position);
 expect(inspectBuildingAt(m,enemy.position)).toBe('enemy:inspect-test');const info=selectionInfo(m,'enemy:inspect-test');expect(info.hp).toBe(55);expect(info.stats).toEqual(['Enemy building · Inspection only']);expect(info.detail).not.toContain('55');
 expect(Object.values(actionPanel(m,'enemy:inspect-test',true)).every(a=>!a.visible)).toBe(true);
 m.fog!.teams.player.visible.fill(false);expect(inspectedBuilding(m,'enemy:inspect-test')).toBeNull();expect(selectionInfo(m,'enemy:inspect-test').name).toBe('No selection');
 reveal(m,enemy.position);enemy.hp=0;expect(inspectBuildingAt(m,enemy.position)).toBeNull();
});
