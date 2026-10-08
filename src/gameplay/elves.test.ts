import {createClassicMatch as createMatch} from './testHelpers/classicMatch';
import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {saveConfig as currentSaveConfig} from '../config/save';
import {expect,it} from 'vitest';
import {factions,factionsForPlayer} from '../config/factions';

import {enqueueProduction,updateQueuedProduction} from './productionQueue';
import {updateCombat} from './combat';
import {useAbility,advanceAbilities} from './abilities';
import {updateGathering} from './gathering';
import {encodeSave,decodeSave} from './save';
import {placeHarbor,trainShip,updateNavy} from './navy';
import {unitFrame,motion} from '../presentation/animation';
import {matchLabels} from '../presentation/hud';

it('Elves use a faster, lighter ranged roster and their own woodland economy recipes',()=>{
 const f=factions.elves,m=createMatch('tutorial','beginner',factionsForPlayer('elves'));
 expect(f.roster).toEqual(['worker','soldier','archer','catapult','specialist','air','cavalry','healer','giant','scout','ballista']);
 expect(matchLabels(m).health).toBe('Grove Hall: 220 / 220 HP');
 expect(m.gathering.units[0].hp).toBe(28);
 const worker={...m.gathering.units[0],position:{x:200,y:200},target:{x:400,y:200},order:{kind:'move' as const}};
 expect(updateGathering({...m.gathering,units:[worker]},1).units[0].position.x).toBe(370);
 expect(f.units.soldier).toMatchObject({hp:50,speed:175,damagePerSecond:16});
 expect(f.units.archer).toMatchObject({hp:45,speed:170,range:192,damage:14,attackInterval:.9});
 expect(f.units.catapult).toMatchObject({hp:60,range:256,damage:18,hitRadius:16,splashRadius:32,attackInterval:1.8});
 expect(f.buildings.forge).toMatchObject({hp:110,cost:{wood:45,gold:10}});
 expect(f.upgrades.attack).toMatchObject({name:'True Aim',cost:{wood:40,gold:15},multiplier:1.25});
 expect(f.upgrades.defense).toMatchObject({name:'Woven Guard',cost:{wood:35,gold:15},multiplier:.8});
 expect(unitFrame(motion(undefined,{x:0,y:0},'idle',0,'specialist','player',undefined,'elves'),0)).toBe('elves-specialist-player-s-idle-0');
});
it('Marksman requires completed research, pays once, and fires research/buff-scaled projectiles',()=>{
 const m=createMatch('tutorial','beginner',factionsForPlayer('elves'));m.gathering.wood=100;m.gathering.goldBalance=50;
 const b={kind:'barracks' as const,footprint:{x:512,y:384,width:64,height:64},unitType:'specialist' as const};
 expect(enqueueProduction(m.gathering,m.soldierProduction,b).production).toBe(m.soldierProduction);
 expect(enqueueProduction(m.gathering,m.soldierProduction,{...b,technology:{buildings:['forge' as const],research:{}}}).gathering).toBe(m.gathering);
 const start=enqueueProduction(m.gathering,m.soldierProduction,{...b,technology:{buildings:['forge' as const],research:{attack:1}}});
 expect(start.gathering).toMatchObject({wood:70,goldBalance:30});
 expect(updateQueuedProduction(start.gathering,start.production,7.99,b).gathering.units).toHaveLength(3);
 const done=updateQueuedProduction(start.gathering,start.production,8,b),marksman=done.gathering.units.at(-1)!;
 expect(marksman).toMatchObject({id:'unit-4',archetype:'specialist',hp:50,selected:false,order:{kind:'idle'}});
 expect(updateQueuedProduction(done.gathering,done.production,8,b).gathering.units).toHaveLength(4);
 if(marksman.kind!=='soldier')throw new Error('Marksman must be a combat unit');
 const workers=done.gathering.units.slice(0,3),fighter={...marksman,position:{x:200,y:200},selected:true,order:{kind:'attack' as const,enemyId:'dummy'}};
 const g=useAbility({...done.gathering,units:[...workers,fighter]});expect(g.units.slice(0,3)).toEqual(workers);
 const result=updateCombat(g,{baseHP:220,upgrades:{attack:1,defense:0},enemies:[{id:'dummy',kind:'base',hp:100,position:{x:300,y:200},footprint:{x:292,y:192,width:16,height:16}}]},.5);
 expect(result.combat.enemies[0].hp).toBeCloseTo(76); // 16 ×1.25 True Aim ×1.2 True Shot.
 const expired=advanceAbilities(g,5);expect(expired.units.at(-1)).toMatchObject({ability:{activeSeconds:0,cooldownSeconds:15},order:fighter.order});
});
it('Elf naval recipes pay per role and spawn the proper HP/speed profile, also after Save/load',()=>{
 let m=createMatch('mission-outpost','easy',factionsForPlayer('elves'));
 m.gathering.wood=200;m.gathering.goldBalance=100;m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.id==='unit-1'}));
 m.placement={...m.placement,active:true,kind:'harbor'};m=placeHarbor(m,{x:192,y:416});
 expect(m.gathering).toMatchObject({wood:160,goldBalance:90});expect(m.navy!.harbor!.hp).toBe(140);
 m=updateNavy(m,100);expect(m.navy!.harbor!.construction.remainingSeconds).toBe(0);
 m=trainShip(m,'warship');expect(m.gathering).toMatchObject({wood:115,goldBalance:75});m=updateNavy(m,8);
 expect(m.navy!.ships[0]).toMatchObject({hp:80,selected:false});
 m=trainShip(m,'transport');expect(m.gathering).toMatchObject({wood:75,goldBalance:65});m=updateNavy(m,8);
 expect(m.navy!.ships[1]).toMatchObject({role:'transport',hp:80,selected:false});
 expect(factions.elves.naval.units.warship.speed).toBe(125);expect(factions.elves.naval.units.transport.speed).toBe(125);
 const json=encodeSave(m,{camera:{x:0,y:0},building:'harbor'}),d=JSON.parse(json);
 expect(d.state.navy.ships.map((s:{typeId:string})=>s.typeId)).toEqual(['elves:naval:warship','elves:naval:transport']);
 expect(decodeSave(json).ok).toBe(true);
});
it('Save27 accepts canonical Elf identities and rejects Elf IDs in older configuration versions',()=>{
 const m=createMatch('survival','normal',factionsForPlayer('elves'));
 const d=JSON.parse(encodeSave(m,{camera:{x:0,y:0},building:null}));
 expect(d.configVersion).toBe(currentSaveConfig.configVersion);expect(d.state.gathering.units[0].typeId).toBe('elves:unit:worker');expect(decodeSave(JSON.stringify(d)).ok).toBe(true);
 const forged=structuredClone(d);forged.state.gathering.units[0].typeId='crown:unit:worker';expect(decodeSave(JSON.stringify(forged)).ok).toBe(false);
 legacyTerrainFixture(d);d.configVersion='tribute-config-26';expect(decodeSave(JSON.stringify(d)).ok).toBe(false);
 for(const faction of ['crown','clans'] as const){const old=JSON.parse(encodeSave(createMatch('survival','normal',factionsForPlayer(faction)),{camera:{x:0,y:0},building:null}));legacyTerrainFixture(old);old.configVersion='tribute-config-26';expect(decodeSave(JSON.stringify(old)).ok).toBe(true);}
});
