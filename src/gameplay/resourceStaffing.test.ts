import {expect,it} from 'vitest';
import {createMatch} from './match';
import {resourceStaffing} from './resourceStaffing';
import {enemyWorker} from './enemyGathering';
import {resourceServices} from './resourceQueue';
import {selectionInfo} from '../presentation/selectionInfo';
import {fogIndex} from './fog';

function fixture(){
 const m=createMatch('survival'),node=m.gathering.node;
 m.gathering.units=m.gathering.units.map((u,i)=>u.kind!=='worker'?u:({...u,position:{x:node.position.x-32,y:node.position.y+i*32},navigation:undefined,order:{kind:'gather' as const,nodeId:node.id}}));
 return m;
}
it('distinguishes travel, actual gathering and delivery while retaining assignment',()=>{
 const m=fixture(),node=m.gathering.node;
 m.gathering.units[1].position={x:300,y:300};m.gathering.units[2].order={kind:'deliver',nodeId:node.id};m.gathering.units[2].cargo=5;
 expect(resourceStaffing(m,node)).toEqual({assigned:3,gathering:1});
 m.gathering.units[2].order={kind:'move'};expect(resourceStaffing(m,node)).toEqual({assigned:2,gathering:1});
 m.gathering.units[0].hp=0;expect(resourceStaffing(m,node)).toEqual({assigned:1,gathering:0});
});
it('counts only arrived service workers, not a full carrier or workers waiting in queue',()=>{
 const m=fixture(),node=m.gathering.node;
 m.gathering.units=Array.from({length:5},(_,i)=>({...m.gathering.units[0],id:`unit-${i+1}`,position:{x:600,y:160+i*28}}));
 const services=resourceServices(m.gathering,m.map,0);
 m.gathering.units=m.gathering.units.map(u=>({...u,position:services.get(u.id)!.point}));
 expect(resourceStaffing(m,node)).toEqual({assigned:5,gathering:3});
 const active=m.gathering.units.find(u=>services.get(u.id)!.working)!;active.cargo=5;
 expect(resourceStaffing(m,node)).toEqual({assigned:5,gathering:2});
 node.remaining=0;expect(resourceStaffing(m,node)).toEqual({assigned:5,gathering:0});
 m.gathering.units.forEach(u=>u.order={kind:'idle'});expect(resourceStaffing(m,node)).toEqual({assigned:0,gathering:0});
});
it('does not count another resource or soldiers as assigned workers',()=>{
 const m=fixture(),node=m.gathering.node;
 m.gathering.units[1].order={kind:'gather',nodeId:'gold-1'};
 m.gathering.units[2]={...m.gathering.units[2],kind:'soldier',hp:60,cargo:0,order:{kind:'idle'}};
 expect(resourceStaffing(m,node)).toEqual({assigned:1,gathering:1});
});
it('staffing is visible only under current vision and updates when selection changes',()=>{
 const m=fixture(),node=m.gathering.node,i=fogIndex(m.fog!,node.position)!;
 m.gathering.units[1].position={x:300,y:300};
 m.fog!.teams.player.explored[i]=true;m.fog!.teams.player.visible[i]=true;
 expect(selectionInfo(m,null,node.id).stats).toContain('Workers: 3 assigned / 1 gathering');
 m.gathering.units[0].order={kind:'move'};
 expect(selectionInfo(m,null,node.id).stats).toContain('Workers: 2 assigned / 0 gathering');
 m.fog!.teams.player.visible[i]=false;
 expect(selectionInfo(m,null,node.id).stats).toEqual(['Resource: wood']);
 expect(selectionInfo(m,null).stats).toEqual([]);
});

it('shared enemy workers consume admission but are excluded from own assignment totals',()=>{
 const m=createMatch('skirmish'),node=m.gathering.node;
 m.gathering.units=m.gathering.units.map(u=>u.kind!=='worker'?u:({...u,order:{kind:'gather',nodeId:node.id},position:{x:600,y:220}}));
 for(const e of m.combat.enemies.filter(e=>e.work)){e.work!.order={kind:'gather',nodeId:node.id};e.position={x:600,y:240};}
 const services=resourceServices({...m.gathering,units:[...m.gathering.units,...m.combat.enemies.flatMap(e=>{const w=enemyWorker(e);return w?[w]:[];})]},m.map,0);
 m.gathering.units=m.gathering.units.map(u=>({...u,position:services.get(u.id)!.point}));
 const active=m.gathering.units.filter(u=>services.get(u.id)!.working).length;
 expect(active).toBeLessThan(3);expect(resourceStaffing(m,node)).toEqual({assigned:3,gathering:active});
});
