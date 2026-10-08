import {wallLine,placeWallLine} from './wallDrag';
import {updateTowers} from './towers';
import {it,expect} from 'vitest';import {createMatch,updateMatch} from './match';import {placeTower,upgradeTower,towerShots,towerUpgradeReason,towerPlacementError} from './towers';import {updateCombat} from './combat';import {encodeSave,decodeSave} from './save';import {replaceObstacles} from './map';import {cleanDestroyed} from './destruction';
const ready=()=>{const m=createMatch('skirmish');m.gathering.wood=200;m.gathering.goldBalance=100;m.gathering.units[0].selected=true;m.placement={...m.placement,kind:'tower',active:true};return m;};
it('worker builds visible legal tower, charges once, saves and rejects occupied/hidden sites',()=>{
 const m=ready();expect(towerPlacementError(m,{x:480,y:384})).toBeNull();const built=placeTower(m,{x:480,y:384});expect(built).not.toBe(m);expect(built.gathering.wood).toBe(m.gathering.wood-50);expect(built.placement.defenses).toHaveLength(1);expect(placeTower(built,{x:480,y:384})).toBe(built);
 const loaded=decodeSave(encodeSave(built,{camera:{x:0,y:0},building:null}));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);
 expect(placeTower(ready(),{x:1500,y:1000}).placement.defenses).toBeUndefined();
 let finished=built;for(let i=0;i<150;i++)finished=updateMatch(finished,.1);expect(finished.placement.defenses![0].construction.remainingSeconds).toBe(0);
});
const completed=()=>{const m=placeTower(ready(),{x:480,y:384});m.placement.defenses![0].construction={remainingSeconds:0,builderId:null};m.gathering.units=[];return m;};
it('selects nearest visible unit, never buildings or out-of-range enemies; cooldown stable',()=>{
 const m=completed(),enemies=[{id:'b',position:{x:530,y:400},hp:100},{id:'a',position:{x:530,y:400},hp:100},{id:'outside',position:{x:800,y:400},hp:100}];
 const shot=towerShots(m.placement,enemies,.5,1,()=>true);expect(shot.shots).toHaveLength(1);expect(shot.shots[0].projectile.targetId).toBe('a');expect(towerShots(shot.placement,enemies,.5,shot.next,()=>true).shots).toHaveLength(0);expect(towerShots(m.placement,enemies,2,1,()=>false).shots).toHaveLength(0);
});
it('uses existing projectile flight/collision, respects hidden targets, and AI damages towers',()=>{
 const m=completed();m.combat.enemies=[{id:'enemy-close',position:{x:535,y:400},hp:100}];
 const hit=updateCombat(m.gathering,m.combat,.5,m.map,m.placement,undefined,()=>true,undefined,undefined,undefined,undefined,'clans',()=>true);expect(hit.combat.enemies[0].hp).toBeLessThan(100);
 const blocked=updateCombat(m.gathering,m.combat,.5,replaceObstacles(m.map,[...m.map.obstacles,{x:516,y:368,width:8,height:80}]),m.placement,undefined,()=>true,undefined,undefined,undefined,undefined,'clans',()=>true);expect(blocked.combat.enemies[0].hp).toBe(100);
 const hidden=updateCombat(m.gathering,m.combat,.5,m.map,m.placement,()=>false,()=>true,()=>false,undefined,undefined,undefined,'clans',()=>false);expect(hidden.combat.enemies[0].hp).toBe(100);
 const attack=updateCombat(m.gathering,m.combat,3,m.map,m.placement);expect(attack.placement!.defenses![0].hp).toBeLessThan(160);
 const dead=completed();dead.placement.defenses![0].hp=0;expect(cleanDestroyed(dead).placement.defenses).toEqual([]);expect(cleanDestroyed(dead).map.obstacles.length).toBe(dead.map.obstacles.length-1);
});
it('upgrade requires completed level2 base/forge, charges once, keeps HP and persists timing',()=>{
 let m=completed();expect(towerUpgradeReason(m,'tower-1')).toContain('level 2');m.combat.baseDevelopment={level:2,remainingSeconds:null};expect(towerUpgradeReason(m,'tower-1')).toBe('Complete Forge');m.placement.forge={id:'forge',owner:'player',hp:120,footprint:{x:704,y:384,width:64,height:64},construction:{remainingSeconds:0,builderId:null}};m.map=replaceObstacles(m.map,[...m.map.obstacles,m.placement.forge.footprint]);m.research!.attack=1;m=upgradeTower(m,'tower-1');expect(m.gathering.goldBalance).toBe(50);expect(upgradeTower(m,'tower-1')).toBe(m);
 const r=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(r.ok,r.ok?'':r.error).toBe(true);m=updateMatch(m,10);expect(m.placement.defenses![0]).toMatchObject({level:2,hp:160,upgradeRemaining:null});
});
it('permanent ground/AA choices enforce research, paid time, correct domains and no fire during upgrade',()=>{for(const mode of ['ground','air'] as const){let m=completed();m.combat.baseDevelopment={level:2,remainingSeconds:null};m.placement.forge={id:'forge',owner:'player',hp:120,footprint:{x:704,y:384,width:64,height:64},construction:{remainingSeconds:0,builderId:null}};m.map.obstacles.push(m.placement.forge.footprint);expect(towerUpgradeReason(m,'tower-1')).toBe('Research attack 1');m.research!.attack=1;const old=m.placement.defenses![0].footprint;m=upgradeTower(m,'tower-1',mode);expect(m.gathering.wood).toBe(110);expect(upgradeTower(m,'tower-1',mode==='air'?'ground':'air')).toBe(m);const enemies=[{id:'land',kind:'unit' as const,hp:100,position:{x:530,y:400}},{id:'air',kind:'unit' as const,role:'scout' as const,hp:35,position:{x:550,y:400}}];expect(towerShots(m.placement,enemies,9,1,()=>true).shots).toEqual([]);const loaded=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);for(let i=0;i<100;i++)m=updateMatch(m,.1);expect(m.placement.defenses![0]).toMatchObject({specialization:mode,level:2,footprint:old});const shots=towerShots({...m.placement,defenses:m.placement.defenses!.map(t=>({...t,cooldown:0,upgradeAfter:undefined}))},enemies,.1,1,()=>true).shots;expect(shots[0].projectile).toMatchObject({targetId:mode==='air'?'air':'land',targets:mode==='air'?['air']:['land'],damage:mode==='air'?16:24});expect(upgradeTower(m,'tower-1',mode==='air'?'ground':'air')).toBe(m);m.placement.defenses![0].hp=0;expect(cleanDestroyed(m).placement.defenses).toEqual([]);}});
it('basic ground towers cannot acquire flyers or ships',()=>{const m=completed();expect(towerShots(m.placement,[{id:'sky',kind:'unit',role:'air',hp:100,position:{x:530,y:400}},{id:'sea',kind:'ship',hp:100,position:{x:540,y:400}}],2,1,()=>true).shots).toEqual([]);});

it('drag walls are connected, bounded and built in sequence across Save/Load',()=>{
 expect(wallLine({x:1,y:1},{x:65,y:65})).toEqual([{x:0,y:0},{x:32,y:0},{x:32,y:32},{x:64,y:32},{x:64,y:64}]);
 expect(wallLine({x:0,y:0},{x:100000,y:0})).toHaveLength(32);
 const m=ready();m.placement.kind='wall';
 const points=wallLine({x:480,y:384},{x:544,y:384}),placed=placeWallLine(m,points);
 expect(placed.count,placed.reason??'').toBe(3);expect(placed.match.gathering.wood).toBe(170);
 expect(placed.match.gathering.units[0].order).toEqual({kind:'build',buildingId:'wall-1'});
 const saved=decodeSave(encodeSave(placed.match,{camera:{x:0,y:0},building:null}));expect(saved.ok,saved.ok?'':saved.error).toBe(true);if(!saved.ok)return;
 let next=saved.match;for(let i=0;i<400;i++)next=updateMatch(next,.1);
 expect(next.placement.defenses!.map(t=>t.construction.remainingSeconds)).toEqual([0,0,0]);expect(next.gathering.wood).toBe(170);
});
it('wall drag stops at unaffordable, occupied or hidden sites; stopped builders stay stopped',()=>{
 const m=ready();m.placement.kind='wall';m.gathering.wood=15;
 const paid=placeWallLine(m,wallLine({x:480,y:384},{x:544,y:384}));expect(paid.count).toBe(1);expect(paid.match.gathering.wood).toBe(5);expect(paid.reason).toContain('wood');
 const duplicate=placeWallLine({...paid.match,placement:{...paid.match.placement,active:true}},[{x:480,y:384}]);expect(duplicate.count).toBe(0);expect(duplicate.match.gathering.wood).toBe(5);
 const hidden=placeWallLine(m,[{x:1500,y:1000}]);expect(hidden.count).toBe(0);expect(hidden.match).toBe(m);
 const bulk=ready();bulk.placement.kind='wall';let stopped=placeWallLine(bulk,wallLine({x:480,y:384},{x:544,y:384})).match;
 stopped.gathering.units[0].order={kind:'idle'};const updated=updateTowers(stopped,20);expect(updated.placement.defenses!.every(t=>t.construction.remainingSeconds===3)).toBe(true);
 const capped={...bulk,placement:{...bulk.placement,defenses:Array.from({length:32},(_,i)=>({...paid.match.placement.defenses![0],id:`wall-${i+1}` as const}))}};
 expect(placeWallLine(capped,[{x:544,y:384}]).reason).toContain('limit');
});
