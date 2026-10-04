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
 let m=completed();expect(towerUpgradeReason(m,'tower-1')).toContain('level 2');m.combat.baseDevelopment={level:2,remainingSeconds:null};expect(towerUpgradeReason(m,'tower-1')).toBe('Complete Forge');m.placement.forge={id:'forge',owner:'player',hp:120,footprint:{x:704,y:384,width:64,height:64},construction:{remainingSeconds:0,builderId:null}};m.map=replaceObstacles(m.map,[...m.map.obstacles,m.placement.forge.footprint]);m=upgradeTower(m,'tower-1');expect(m.gathering.goldBalance).toBe(50);expect(upgradeTower(m,'tower-1')).toBe(m);
 const r=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(r.ok,r.ok?'':r.error).toBe(true);m=updateMatch(m,10);expect(m.placement.defenses![0]).toMatchObject({level:2,hp:160,upgradeRemaining:null});
});
