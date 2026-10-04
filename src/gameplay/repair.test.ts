import {it,expect} from 'vitest';import {createMatch} from './match';import {orderRepair,updateRepair} from './repair';import {stopSelected} from './orders';import {encodeSave,decodeSave} from './save';import {cleanDestroyed} from './destruction';import {factions,factionIds} from '../config/factions';import {defenseConfig} from '../config/defenses';import {updateCombat} from './combat';import {replaceObstacles} from './map';
const ready=()=>{const m=createMatch('skirmish');m.gathering.wood=100;m.gathering.goldBalance=100;m.combat.baseHP=140;m.gathering.units=m.gathering.units.map((u,i)=>({...u,position:{x:356,y:430+i*20},target:{x:356,y:430+i*20},selected:true}));return m;};
it('repairs actual missing HP, caps at full HP, charges only healing and stops all workers',()=>{
 let m=ready();m.combat.baseHP=238;m=orderRepair(m,'base');m=updateRepair(m,1);expect(m.combat.baseHP).toBe(240);expect(m.gathering.wood).toBe(99);expect(m.gathering.goldBalance).toBeCloseTo(99.8);expect(m.gathering.units.every(u=>u.order.kind==='idle')).toBe(true);expect(orderRepair(m,'base')).toBe(m);
});
it('multiple workers stack to three active workers, extra worker waits without cost',()=>{
 let m=ready();m.gathering.units.push({...m.gathering.units[0],id:'unit-4',position:{x:354,y:450}});m=updateRepair(orderRepair(m,'base'),1);expect(m.combat.baseHP).toBe(152);expect(m.gathering.wood).toBe(94);expect(m.gathering.goldBalance).toBeCloseTo(98.8);expect(m.gathering.units[3].order.kind).toBe('repair');
});
it('limited resources heal partially without overdraft, orders then stop; pause and interrupts preserve costs',()=>{
 let m=ready();m.gathering.wood=.25;m=updateRepair(orderRepair(m,'base'),1);expect(m.combat.baseHP).toBe(140.5);expect(m.gathering.wood).toBe(0);expect(m.gathering.units.every(u=>u.order.kind==='idle')).toBe(true);
 let full=orderRepair(ready(),'base');expect(updateRepair({...full,paused:true},10).combat.baseHP).toBe(140);full.gathering.units=stopSelected(full.gathering.units,true);expect(updateRepair(full,10).gathering.wood).toBe(100);
 const poor=ready();poor.gathering.goldBalance=0;expect(orderRepair(poor,'base')).toBe(poor);expect(orderRepair(ready(),'enemy:enemy-base')).toMatchObject({combat:{baseHP:140}});
});
it('walking consumes travel time before repair; dead target and worker cannot heal',()=>{
 let m=ready();m.gathering.units=m.gathering.units.slice(0,1).map(u=>({...u,position:{x:400,y:300}}));m=orderRepair(m,'base');expect(updateRepair(m,.1).combat.baseHP).toBe(140);m=updateRepair(m,2);expect(m.combat.baseHP).toBeGreaterThan(140);
 const dead=orderRepair(ready(),'base');dead.combat.baseHP=0;expect(cleanDestroyed(dead).gathering.units.every(u=>u.order.kind==='idle')).toBe(true);const worker=orderRepair(ready(),'base');worker.gathering.units.forEach(u=>u.hp=0);expect(updateRepair(worker,3).combat.baseHP).toBe(140);
});
it('roundtrips repair orders and rejects enemy or missing building references',()=>{
 const m=orderRepair(ready(),'base'),json=encodeSave(m,{camera:{x:0,y:0},building:'base'}),loaded=decodeSave(json);expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(loaded.ok)expect(loaded.match.gathering.units[0].order).toEqual({kind:'repair',buildingId:'base'});
 const bad=JSON.parse(json);bad.state.gathering.units[0].order.buildingId='enemy-base';expect(decodeSave(JSON.stringify(bad)).ok).toBe(false);
});
it.each(factionIds)('%s siege outranges upgraded towers and defeats defense despite three repairing workers',faction=>{
 let m=ready();m.factions={player:'crown',enemy:faction};m.combat.baseHP=240;const footprint={x:480,y:384,width:32,height:32};m.placement.defenses=[{id:'tower-1',kind:'tower',owner:'player',footprint,hp:140,construction:{remainingSeconds:0,builderId:null},level:2,upgradeRemaining:null,cooldown:0}];m.placement.nextDefenseNumber=2;m.map=replaceObstacles(m.map,[...m.map.obstacles,footprint]);m.gathering.units=m.gathering.units.map((u,i)=>u.kind==='worker'?({...u,position:{x:456,y:384+i*12},target:{x:456,y:384+i*12},order:{kind:'repair',buildingId:'tower-1'}}):u);
 m.gathering.wood=1000;m.gathering.goldBalance=1000;const cfg=factions[faction].units.catapult;expect(cfg.range!).toBeGreaterThan(defenseConfig.upgrade.range);m.combat.enemies=[{id:'enemy-siege',kind:'unit',role:'catapult',hp:cfg.hp,position:{x:496+cfg.range!+16,y:400},order:{kind:'defend',targetId:'tower-1'}}];
 for(let i=0;i<800&&(m.placement.defenses?.length??0)>0;i++){m=updateRepair(orderRepair(m,'tower-1'),.1);const fight=updateCombat(m.gathering,m.combat,.1,m.map,m.placement,undefined,()=>true,undefined,undefined,undefined,undefined,faction);m=cleanDestroyed({...m,gathering:fight.gathering,combat:fight.combat,placement:fight.placement!});}
 expect(m.placement.defenses).toEqual([]);expect(m.combat.enemies[0].hp).toBe(cfg.hp);
});

it.each(['barracks','forge','farm-1','harbor','tower-1','wall-1','gate-1'] as const)('repairs own %s, including unfinished sites, without granting construction work',id=>{
 let m=ready();const foot={x:480,y:384,width:64,height:64},job={remainingSeconds:1,builderId:null};m.gathering.units=m.gathering.units.slice(0,1).map(u=>({...u,position:{x:456,y:400},target:{x:456,y:400}}));
 if(id==='barracks'){m.placement.barracks=foot;m.placement.barracksHP=80;m.placement.construction=job;}
 else if(id==='forge')m.placement.forge={id,owner:'player',hp:80,footprint:foot,construction:job};
 else if(id==='farm-1')m.placement.farms=[{id,owner:'player',hp:40,footprint:foot,construction:job}];
 else if(id==='harbor')m.navy={harbor:{owner:'player',hp:100,footprint:foot,construction:job},ships:[],production:{nextUnitNumber:1,remainingSeconds:null}};
 else {const kind=id==='tower-1'?'tower':id==='wall-1'?'wall':'gate';m.placement.defenses=[{id,kind,owner:'player',footprint:{...foot,width:kind==='gate'?64:32,height:32},hp:defenseConfig[kind].hp-40,construction:job,level:1,upgradeRemaining:null,cooldown:0,...(kind==='gate'?{open:false}:{})}];}
 m.map=replaceObstacles(m.map,[...m.map.obstacles,id==='tower-1'||id==='wall-1'?{...foot,width:32,height:32}:id==='gate-1'?{...foot,height:32}:foot]);
 const queued=orderRepair(m,id);expect(queued.gathering.units[0].order.kind).toBe('repair');const next=updateRepair(queued,1);expect(next.gathering.wood).toBe(98);expect(next.gathering.goldBalance).toBeCloseTo(99.6);expect(next.placement.construction?.remainingSeconds??next.placement.forge?.construction.remainingSeconds??next.placement.farms?.[0]?.construction.remainingSeconds??next.navy?.harbor?.construction.remainingSeconds??next.placement.defenses?.[0]?.construction.remainingSeconds).toBe(1);
});
