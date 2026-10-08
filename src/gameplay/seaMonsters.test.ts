import {expect,it} from 'vitest';
import {maps,type MapId} from '../config/maps';
import {factionIds} from '../config/factions';
import {seaMonsterRules,seaMonsterEnemyId} from '../config/bosses';
import {createMatch,updateMatch,type MatchState} from './match';
import {createSeaMonsters,bossEnemies,prepareBossCombat,finishBossCombat,seaMonsterTarget,seaMonsterWater} from './bosses';
import {updateCombat} from './combat';
import {createMap,bodyFits,replaceObstacles} from './map';
import {matchFog} from './matchFog';
import {entityPresented,entityVisible} from './visibility';
import {visibleMinimapData} from '../presentation/minimap';
import {createNavy,type Ship} from './navy';
import {decodeSave,encodeSave} from './save';
import type {PlayerTarget} from './targets';
const view={camera:{x:0,y:0},building:null};
function match(){return createMatch('skirmish','hard',undefined,'islands');}
function ship(p={x:752,y:688}):Ship{return {id:'ship-1',kind:'ship',role:'warship',owner:'player',hp:90,selected:false,position:p,target:p,order:{kind:'idle'}};}
function step(m:MatchState,dt=.1){m.fog=matchFog(m);const r=updateCombat(m.gathering,prepareBossCombat(m,m.combat),dt,m.map,m.placement,undefined,()=>true,undefined,undefined,m.navy);return {...m,gathering:r.gathering,placement:r.placement!,navy:r.navy,...finishBossCombat(m,r.combat)};}
const target=(p:{x:number;y:number},kind:PlayerTarget['kind']='worker'):PlayerTarget=>({id:'test',owner:'player',hp:100,kind,domain:kind==='ship'?'sea':kind==='farm'?'building':'land',footprint:{x:p.x-12,y:p.y-12,width:24,height:24}});
it.each(['islands','coast','river'] as const)('%s has rising counts with an authored cap and reachable water patrols',id=>{
 const map=createMap(id,'reference','trees','expanded','regions'),cap=maps[id].seaMonsters!.cap;
 expect(['beginner','easy','normal','hard'].map(d=>createSeaMonsters(map,d as 'hard').length)).toEqual([1,1,2,cap]);
 for(const monster of createSeaMonsters(map,'hard')){const area=maps[id].seaMonsters!.areas.find(a=>a.id===monster.id)!;expect(bodyFits(seaMonsterWater(map,area),monster.position,16)).toBe(true);}
});
it('maps without authored suitable sea routes and old layouts have none; obstructed patrols are rejected',()=>{
 for(const id of ['arena','forest','frontier','highlands','plains96','plains128'] as MapId[])expect(createSeaMonsters(createMap(id,'reference','trees','expanded','regions'),'hard')).toEqual([]);
 const m=match();expect(createSeaMonsters(createMap('islands'),'hard')).toEqual([]);const a=maps.islands.seaMonsters!.areas[0];expect(createSeaMonsters(replaceObstacles(m.map,[...m.map.obstacles,a.area]),'hard').some(v=>v.id===a.id)).toBe(false);
});
it('patrol moves through water, remains bounded for repeated cycles, and pause/end freeze it',()=>{
 let m=match();const initial=structuredClone(m.bosses!.sea!);for(let i=0;i<90;i++){m=step(m,1);for(const v of m.bosses!.sea!){const z=maps.islands.seaMonsters!.areas.find(z=>z.id===v.id)!;expect(bodyFits(seaMonsterWater(m.map,z),v.position,16)).toBe(true);}}
 expect(m.bosses!.sea!.some((v,i)=>v.position.y!==initial[i].position.y||v.position.x!==initial[i].position.x)).toBe(true);
 expect(updateMatch({...m,paused:true},10).bosses).toEqual(m.bosses);expect(updateMatch({...m,outcome:'victory'},10).bosses).toEqual(m.bosses);
},20000);
it.each(factionIds)('%s human ships are bitten, AI ships/buildings are never bitten even on retaliation',faction=>{
 let m=createMatch('skirmish','hard',{player:faction,enemy:'crown'},'islands');m.navy={...createNavy(),ships:[ship()]};
 const before=m.bosses!.sea![0].hp,monster=bossEnemies(m)[0];m.combat.enemies.push({id:'enemy-produced-9',kind:'unit',role:'archer',position:{x:624,y:688},hp:50,order:{kind:'defend',targetId:monster.id}},{id:'enemy-ship-9',kind:'ship',navalRole:'submarine',hp:90,position:{x:752,y:720},order:{kind:'defend',targetId:monster.id}},{id:'enemy-coastal-base',kind:'base',hp:200,position:{x:624,y:688},footprint:{x:608,y:672,width:32,height:32}});
 for(let i=0;i<30;i++)m=step(m);
 expect(m.navy!.ships[0].hp).toBeLessThan(90);expect(m.combat.enemies.find(e=>e.id==='enemy-ship-9')!.hp).toBe(90);expect(m.combat.enemies.find(e=>e.id==='enemy-coastal-base')!.hp).toBe(200);expect(m.combat.enemies.find(e=>e.id==='enemy-produced-9')!.hp).toBe(50);expect(m.bosses!.sea![0].hp).toBeLessThan(before);
 m.navy!.ships=[];m.gathering.units=[];const hp=m.combat.enemies.map(e=>e.hp);for(let i=0;i<20;i++)m=step(m);expect(m.combat.enemies.map(e=>e.hp)).toEqual(hp);
});
it('only coastline targets qualify; ship priority and actual coastal worker/building damage, no inland or aircraft damage',()=>{
 let m=match();const z=maps.islands.seaMonsters!.areas[0];
 expect(seaMonsterTarget(m.map,z,target({x:624,y:688}))).toBe(true);expect(seaMonsterTarget(m.map,z,target({x:560,y:688}))).toBe(false);expect(seaMonsterTarget(m.map,z,{...target({x:624,y:688}),domain:'air'})).toBe(false);
 const worker=m.gathering.units[0];worker.position={x:624,y:688};worker.target=worker.position;worker.order={kind:'idle'};m.gathering.units=[worker];m.placement.farms=[{id:'farm-1',owner:'player',hp:80,footprint:{x:576,y:704,width:64,height:64},construction:{remainingSeconds:0,builderId:null}}];
 m.navy={...createNavy(),ships:[ship()]};let next=step(m);expect(next.navy!.ships[0].hp).toBe(72);expect(next.gathering.units[0].hp).toBe(worker.hp);expect(next.placement.farms![0].hp).toBe(80);
 delete m.navy;next=step(m);expect(next.gathering.units[0].hp).toBeLessThan(worker.hp!);m.gathering.units=[];next=step(m,3);expect(next.placement.farms![0].hp).toBeLessThan(80);
 m.placement.farms[0].footprint.x=512;next=step(m,3);expect(next.placement.farms![0].hp).toBe(80);
});
it('pursuit cannot leave its region; losing the target resumes patrol instead of a map-wide chase',()=>{
 let m=match();m.navy={...createNavy(),ships:[ship({x:752,y:848})]};const initial=m.bosses!.sea![0].position;
 for(let i=0;i<10;i++)m=step(m,.5);expect(m.bosses!.sea![0].position.y).toBeGreaterThan(initial.y);
 m.navy!.ships[0].position={x:752,y:1008};const hp=m.navy!.ships[0].hp,legs=new Set<number>();for(let i=0;i<120;i++){m=step(m,.5);legs.add(m.bosses!.sea![0].patrolIndex);}
 expect([...legs].sort()).toEqual([0,1]);
 expect(m.navy!.ships[0].hp).toBe(hp);expect(Math.abs(m.bosses!.sea![0].position.y-initial.y)).toBeLessThan(288);expect(bodyFits(seaMonsterWater(m.map,maps.islands.seaMonsters!.areas[0]),m.bosses!.sea![0].position,16)).toBe(true);
});
it('fog hides monsters and their moving minimap markers before discovery and after vision loss',()=>{
 let m=match(),enemy=bossEnemies(m)[0];expect(entityVisible(m.fog!,'player',enemy)).toBe(false);expect(visibleMinimapData(m).markers.some(v=>v.id===enemy.id)).toBe(false);
 m.navy={...createNavy(),ships:[ship()]};m.fog=matchFog(m);expect(entityVisible(m.fog,'player',enemy)).toBe(true);expect(visibleMinimapData(m).markers.some(v=>v.id===enemy.id)).toBe(true);
 m.navy.ships=[];m.fog=matchFog(m);expect(entityPresented(m.fog,'player',enemy)).toBe(false);expect(visibleMinimapData(m).markers.some(v=>v.id===enemy.id)).toBe(false);
});
it('save/load preserves patrol, wounded/dead states; legacy saves add no surprise monsters; restart resets',()=>{
 let m=match();m=updateMatch(m,.5);m.bosses!.sea![0].hp=180;m.bosses!.sea![1].hp=0;const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(!loaded.ok)throw Error(loaded.error);expect(loaded.match.bosses).toEqual(m.bosses);expect(updateMatch(loaded.match,.25).bosses).toEqual(updateMatch(m,.25).bosses);
 const raw=JSON.parse(encodeSave(m,view));for(const mutate of [(v:typeof raw)=>v.state.bosses.sea[0].position.x=100,(v:typeof raw)=>v.state.bosses.sea[0].hp=241,(v:typeof raw)=>v.state.bosses.sea[0].patrolIndex=9,(v:typeof raw)=>v.state.bosses.sea.pop(),(v:typeof raw)=>v.state.bosses.sea[1].id='channel']){const bad=structuredClone(raw);mutate(bad);expect(decodeSave(JSON.stringify(bad)).ok).toBe(false);}
 raw.configVersion='tribute-config-68';delete raw.state.bosses;const old=decodeSave(JSON.stringify(raw));expect(old.ok).toBe(true);if(old.ok)expect(old.match.bosses).toBeUndefined();expect(match().bosses!.sea!.every(v=>v.hp===seaMonsterRules.hp)).toBe(true);
});
it('sea monsters do not count as enemy bases or prevent ordinary victory',()=>{
 let m=match();m.combat.enemies=[];m=updateMatch(m,0);expect(m.outcome).toBe('victory');expect(m.bosses!.sea!.length).toBeGreaterThan(0);expect(m.combat.enemies).toEqual([]);expect(bossEnemies(m)[0].id).toBe(seaMonsterEnemyId('channel'));
});
it('normal match cleanup preserves ship attacks, in-flight shots and saves; killing clears orders without giving a reward',()=>{
 let m=match();m.gathering.resourceCheatUses=1;m.gathering.wood+=100000-40;m.gathering.goldBalance!+=100000-15;
 m.navy={...createNavy(),production:{remainingSeconds:null,nextUnitNumber:2},ships:[{...ship({x:696,y:624}),selected:true,order:{kind:'attack',enemyId:seaMonsterEnemyId('channel')}}]};m.fog=matchFog(m);
 m=updateMatch(m,.1);expect(m.navy!.ships[0].order.kind).toBe('attack');expect(m.combat.projectiles?.some(p=>p.targetId===seaMonsterEnemyId('channel'))).toBe(true);const saved=decodeSave(encodeSave(m,view));expect(saved.ok,saved.ok?'':saved.error).toBe(true);if(!saved.ok)throw Error(saved.error);let resumed=saved.match;
 for(let i=0;i<5;i++){m=updateMatch(m,.1);resumed=updateMatch(resumed,.1);}expect(m.bosses!.sea![0].hp).toBeLessThan(240);expect(resumed.bosses).toEqual(m.bosses);expect(resumed.navy).toEqual(m.navy);
 m.bosses!.sea![0].hp=1;const wood=m.gathering.wood,gold=m.gathering.goldBalance;for(let i=0;i<20&&m.bosses!.sea![0].hp>0;i++)m=updateMatch(m,.1);expect(m.bosses!.sea![0].hp).toBe(0);expect(m.navy!.ships[0].order.kind).toBe('idle');expect(m.gathering.wood).toBe(wood);expect(m.gathering.goldBalance).toBe(gold);expect(decodeSave(encodeSave(m,view))).toMatchObject({ok:true});
});
it('the existing sea mission gets configured encounters and its usual victory/defeat rules survive',()=>{
 const m=createMatch('mission-sea','normal');expect(m.bosses!.sea).toHaveLength(2);expect(decodeSave(encodeSave(m,view))).toMatchObject({ok:true});m.combat.enemies.find(e=>e.kind==='base')!.hp=0;expect(updateMatch(m,0).outcome).toBe('victory');m.combat.baseHP=0;expect(updateMatch(m,0).outcome).toBe('defeat');
});
it('coastal placement and naval spawns cannot overlap the live neutral water body',async()=>{
 const {harborPlacementError,harborSpawn}=await import('./navy'),{overlaps}=await import('./map'),{unitBody}=await import('./spawning');
 const m=match();m.gathering.wood=100;m.gathering.goldBalance=100;m.gathering.units[0].selected=true;m.gathering.units[0].position={x:656,y:816};m.bosses!.sea![0].position={x:720,y:848};m.fog=matchFog(m);
 expect(harborPlacementError(m,{x:672,y:832})).toMatch(/unit/i);
 const foot={x:672,y:832,width:64,height:64},first=harborSpawn({...m,bosses:undefined},foot)!;expect(first).toBeTruthy();m.bosses!.sea![0].position=first;const second=harborSpawn(m,foot)!;expect(second).toBeTruthy();expect(overlaps(unitBody(first,16),unitBody(second,16))).toBe(false);
});

it('a defeated corpse does not block a later coastal harbor or make its save invalid',()=>{
 const m=match();m.bosses!.sea![0].hp=0;m.bosses!.sea![0].position={x:720,y:848};
 m.gathering.resourceCheatUses=1;m.gathering.wood+=100000-40;m.gathering.goldBalance!+=100000-10;
 const foot={x:672,y:832,width:64,height:64};m.navy={...createNavy(),harbor:{owner:'player',hp:160,footprint:foot,construction:{remainingSeconds:0,builderId:null}}};m.map=replaceObstacles(m.map,[...m.map.obstacles,foot]);m.fog=matchFog(m);
 expect(decodeSave(encodeSave(m,view))).toMatchObject({ok:true});
 m.bosses!.sea![0].hp=1;const raw=JSON.parse(encodeSave({...m,bosses:undefined},view));raw.state.bosses=m.bosses;expect(decodeSave(JSON.stringify(raw)).ok).toBe(false);
});
