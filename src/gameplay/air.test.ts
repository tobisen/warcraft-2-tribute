import {expect,it} from 'vitest';
import {factionIds,factions,type FactionId} from '../config/factions';
import {airConfig,airPresentation} from '../config/air';
import {createMatch,updateMatch} from './match';
import {matchFog,visionObservers} from './matchFog';
import {visibleMinimapData} from '../presentation/minimap';
import {enqueueProduction,updateQueuedProduction} from './productionQueue';
import {unitAvailability} from './productionPrerequisites';
import {commandMappedMove,updateMappedMove} from './navigation';
import {commandGroupMove} from './groupMovement';
import {isAir,canAttackDomain,movementMap} from './domains';
import {bodyFits} from './map';
import {towerShots} from './towers';
import {selectUnitsInRectangle,selectUnitAt} from './selection';
import {updateCombat} from './combat';
import {castSpell} from './spells';
import {abilityReady} from './abilities';
import {advanceProjectiles} from './projectiles';
import {encodeSave,decodeSave} from './save';
import {createEnemyAI,updateEnemyAI} from './enemyAI';
import {nextEnemyRole,updateEnemyProduction} from './enemyProduction';
import {selectionInfo} from '../presentation/selectionInfo';
import type {Soldier} from './gathering';
import type {Enemy} from './combat';
const flyer=(f:FactionId,id='unit-4',x=400,y=300):Soldier=>({id,owner:'player',kind:'soldier',archetype:'air',faction:f,hp:factions[f].units.air.hp,cargo:0,selected:true,autoDisabled:true,position:{x,y},target:{x,y},order:{kind:'idle'}});
function fixture(f:FactionId='crown'){const m=createMatch('skirmish','normal',{player:f,enemy:f});m.gathering.units.push(flyer(f));m.production.nextUnitNumber=5;m.soldierProduction.nextUnitNumber=5;m.fog=matchFog(m);return m;}
it.each(factionIds)('%s has its approved paid air recipe, early ground AA, tech locks, FIFO and supply',f=>{
 const m=createMatch('skirmish','normal',{player:f,enemy:f}),recipe=factions[f].units.air;m.gathering.wood=500;m.gathering.goldBalance=200;
 expect(factions[f].unitNames.air).toBe(airConfig[f].name);expect(unitAvailability(factions[f],'archer',{buildings:['base','barracks'],research:{}})).toBeNull();expect(unitAvailability(factions[f],'air',{buildings:['base','barracks'],research:{}})).toMatch(/Complete/);
 const building={kind:'barracks' as const,footprint:{x:512,y:384,width:64,height:64},unitType:'air' as const,technology:{buildings:['base','barracks','forge'] as const,research:{attack:1,defense:1}},bounds:m.map};
 const paid=enqueueProduction(m.gathering,m.soldierProduction,building,{cap:20,used:3,reserved:0});expect(paid.gathering.wood).toBe(500-recipe.cost.wood);expect(paid.gathering.goldBalance).toBe(200-recipe.cost.gold);expect(paid.production.queue![0]).toMatchObject({kind:'air',supply:recipe.supply,durationSeconds:recipe.durationSeconds});
 const denied=enqueueProduction(m.gathering,m.soldierProduction,building,{cap:3,used:3,reserved:0});expect(denied.production).toBe(m.soldierProduction);
 const done=updateQueuedProduction(paid.gathering,paid.production,recipe.durationSeconds,building,{map:m.map,enemies:[]});expect(done.gathering.units.at(-1)).toMatchObject({kind:'soldier',archetype:'air',hp:recipe.hp,faction:f});
});
it.each(factionIds)('%s crosses terrain/building obstacles, remains in bounds and saves mid-flight on blocked ground',f=>{
 let m=fixture(f);const obstacle=m.map.obstacles[0];const u=m.gathering.units.at(-1)!;u.position={x:obstacle.x+obstacle.width/2,y:obstacle.y+obstacle.height/2};u.target={...u.position};expect(bodyFits(m.map,u.position,14)).toBe(false);expect(bodyFits(movementMap(m.map,u),u.position,14)).toBe(true);
 const original=u;m.gathering.units.slice(0,-1).forEach(u=>u.selected=false);m.gathering.units=commandMappedMove(m.gathering.units,{x:600,y:400},m.map);const moved=updateMappedMove(m.gathering.units.at(-1)!,m.map,.3,undefined,f);expect(moved.position).not.toEqual(original.position);m.gathering.units[m.gathering.units.length-1]=moved;
 const json=encodeSave(m,{camera:{x:0,y:0},building:null}),loaded=decodeSave(json);expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(loaded.ok){expect(loaded.match.gathering.units.at(-1)).toMatchObject({position:moved.position,archetype:'air',faction:f,order:{kind:'move'}});const resumed=updateMatch({...loaded.match,paused:false},.1);expect(resumed.gathering.units.at(-1)!.position).not.toEqual(moved.position);}
 const before=m.gathering.units.at(-1)!;expect(commandMappedMove([before],{x:-2,y:30},m.map)[0]).toBe(before);expect(commandGroupMove([before],{x:m.map.width+1,y:40},m.map)[0]).toBe(before);const done=updateMappedMove(before,m.map,20,undefined,f);expect(bodyFits(movementMap(m.map,done),done.position,14)).toBe(true);
});
it('air selection follows elevated icon, group movement supports mixed domains, vision/minimap stay local and restart clears air',()=>{
 const m=fixture();m.gathering.units.forEach(u=>u.selected=false);const picked=selectUnitAt(m.gathering.units,{x:400,y:300-airPresentation.height},28);expect(picked.at(-1)!.selected).toBe(true);expect(selectUnitsInRectangle(m.gathering.units,{x:395,y:270},{x:405,y:280}).at(-1)!.selected).toBe(true);expect(selectionInfo({...m,gathering:{...m.gathering,units:picked}},null)).toMatchObject({name:'Gryphon Rider',detail:expect.stringContaining('TEMP ART'),portrait:{atlas:'air'}});
 expect(visionObservers(m).find(o=>o.id==='unit-4')).toMatchObject({airborne:true});expect(m.fog!.teams.player.visible.filter(Boolean).length).toBeLessThan(m.fog!.columns*m.fog!.rows/2);expect(visibleMinimapData(m).markers.find(x=>x.id==='unit-4')!.color).toBe('#86dbe6');
 const obstruction=m.map.obstacles[0],p={x:obstruction.x+16,y:obstruction.y+16},ordered=commandGroupMove(m.gathering.units.map(u=>({...u,selected:true})),p,m.map);expect(ordered.at(-1)!.order.kind).toBe('move');expect(ordered.slice(0,-1).every(u=>u.order.kind==='idle')).toBe(true);expect(createMatch('skirmish').gathering.units.some(isAir)).toBe(false);
});
it('melee/siege cannot hit air, bows can, air target masks and ground-only spells/abilities are enforced',()=>{
 const m=fixture(),air=m.gathering.units.at(-1)!,enemy:Enemy={id:'enemy-produced-1',kind:'unit',role:'air',hp:130,owner:'enemy',position:{x:430,y:300},order:{kind:'idle'}};
 expect(canAttackDomain({archetype:'archer'},enemy,'crown')).toBe(true);expect(canAttackDomain({archetype:'catapult'},enemy,'crown')).toBe(false);expect(canAttackDomain({},enemy,'crown')).toBe(false);expect(canAttackDomain(flyer('goblins'),enemy,'goblins')).toBe(false);expect(canAttackDomain(air,{kind:'ship'},'crown')).toBe(true);expect(abilityReady(air)).toBe(false);
 const caster:Soldier={...flyer('crown','unit-5',380,300),archetype:'specialist',mana:60,hp:100};m.gathering.units.push(caster);expect(castSpell(m,caster.id,'ward',air.id).match).toBe(m);
 for(const archetype of [undefined,'archer','catapult'] as const){const attacker:Soldier={...flyer('crown'),archetype,hp:40,order:{kind:'attack',enemyId:enemy.id}};const r=updateCombat({...m.gathering,units:[attacker]},{...m.combat,enemies:[enemy]},1,m.map,m.placement);expect(r.combat.enemies[0].hp<130).toBe(archetype==='archer');}
 const bomb={id:'arrow-1',shooterId:'unit-4',targetId:enemy.id,position:{x:430,y:300},destination:{x:430,y:300},speed:300,remainingLife:2,damage:30,hitRadius:16,splashRadius:40,targets:['land','building'] as const};const land={...enemy,id:'ground',role:'soldier' as const};const splash=advanceProjectiles([bomb],[enemy,land],1);expect(splash.damage.has(enemy.id)).toBe(false);expect(splash.damage.get(land.id)).toBe(30);
});
it('AI chooses an available paid air role, produces it and recruits only legal anti-air defenders',()=>{
 const m=fixture();const tech={buildings:['base','forge','barracks'] as const,research:{attack:1,defense:1}},state={...m.enemyProduction!,acceptedJobs:4,wood:500,gold:200,cap:20};expect(nextEnemyRole(state,'crown',tech)).toBe('air');expect(nextEnemyRole(state,'crown',{...tech,research:{}})).not.toBe('air');
 const base=m.combat.enemies.find(e=>e.kind==='base')!,site:Enemy={id:'enemy-barracks',kind:'building',buildingType:'barracks',owner:'enemy',hp:120,position:{x:800,y:400},footprint:{x:768,y:368,width:64,height:64},construction:{remainingSeconds:0,builderId:null}};
 const produced=updateEnemyProduction(state,{...m.combat,enemies:[base,site]},m.gathering,m.map,14,'crown',{site,technology:tech,population:{cap:20,used:0,reserved:0},startAllowed:true});expect(produced.combat.enemies.some(e=>e.role==='air')).toBe(true);
 const enemy=(id:string,role:'soldier'|'archer'):Enemy=>({id,role,kind:'unit',owner:'enemy',hp:60,position:{x:base.position.x-70,y:base.position.y},order:{kind:'idle'}}),threat={...flyer('crown'),position:{x:base.position.x-90,y:base.position.y}};
 const defense=updateEnemyAI(createEnemyAI(),{...m.combat,enemies:[base,enemy('enemy-produced-1','soldier'),enemy('enemy-produced-2','archer')]},m.map,m.gathering.base,.1,[threat],undefined,()=>true,'crown');expect(defense.state.defenders.map(d=>d.id)).toEqual(['enemy-produced-2']);
});
it('Save41 migrates40 without new air fields and rejects forged air/target masks/passengers',()=>{
 const m=createMatch('skirmish'),old=JSON.parse(encodeSave(m,{camera:{x:0,y:0},building:null}));old.configVersion='tribute-config-40';expect(decodeSave(JSON.stringify(old)).ok).toBe(true);old.state.gathering.units.push({...flyer('crown'),typeId:'crown:unit:air'});expect(decodeSave(JSON.stringify(old)).ok).toBe(false);
 const air=fixture(),json=JSON.parse(encodeSave(air,{camera:{x:0,y:0},building:null}));json.state.gathering.units.at(-1).mana=1;expect(decodeSave(JSON.stringify(json)).ok).toBe(false);delete json.state.gathering.units.at(-1).mana;json.state.gathering.units.at(-1).position.x=0;expect(decodeSave(JSON.stringify(json)).ok).toBe(false);
});
it('air projectile multipliers, local visibility and in-flight Save/Load preserve actual impacts',()=>{
 const m=fixture('dwarves'),air=m.gathering.units.at(-1)!;air.position={x:400,y:300};m.combat.enemies.push({id:'enemy-produced-1',owner:'enemy',kind:'unit',role:'air',hp:95,position:{x:500,y:300},order:{kind:'idle'}});m.enemyProduction!.production.nextUnitNumber=2;m.enemyProduction!.acceptedJobs=1;air.order={kind:'attack',enemyId:'enemy-produced-1'};const r=updateCombat(m.gathering,m.combat,.01,m.map,m.placement);m.gathering=r.gathering;m.combat=r.combat;expect(m.combat.projectiles).toHaveLength(1);const p=m.combat.projectiles![0];expect(p).toMatchObject({airborne:true,damageByDomain:{air:1.5,land:.65}});const loaded=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(!loaded.ok)return;const impact=advanceProjectiles(loaded.match.combat.projectiles!,m.combat.enemies,1,m.map);expect(impact.damage.get('enemy-produced-1')).toBe(18);expect(advanceProjectiles([p],m.combat.enemies,1,m.map,()=>false).damage.size).toBe(0);const forged=JSON.parse(encodeSave(m,{camera:{x:0,y:0},building:null}));forged.state.combat.projectiles[0].targets=['space'];expect(decodeSave(JSON.stringify(forged)).ok).toBe(false);
});
it('sea AI keeps ground transport cap while paid aircraft use actual shared supply',()=>{
 const m=fixture(),tech={buildings:['base','barracks','forge'] as const,research:{attack:1,defense:1}},base=m.combat.enemies.find(e=>e.kind==='base')!,site:Enemy={id:'enemy-barracks',kind:'building',buildingType:'barracks',owner:'enemy',hp:120,position:{x:800,y:400},footprint:{x:768,y:368,width:64,height:64},construction:{remainingSeconds:0,builderId:null}},ground:Enemy[]=[1,2].map(i=>({id:`enemy-produced-${i}`,kind:'unit',role:'soldier',owner:'enemy',hp:60,position:{x:850+i*32,y:400},order:{kind:'idle'}}));const state={...m.enemyProduction!,acceptedJobs:4,wood:500,gold:200,cap:20,production:{remainingSeconds:null,nextUnitNumber:3}};const r=updateEnemyProduction(state,{...m.combat,enemies:[base,site,...ground]},m.gathering,m.map,14,'crown',{site,technology:tech,population:{cap:20,used:2,reserved:0},maxArmy:2});expect(r.combat.enemies.filter(e=>e.role==='air')).toHaveLength(1);expect(r.combat.enemies.filter(e=>e.role==='soldier')).toHaveLength(2);
});

it('ranged towers engage visible air and do not acquire hidden flyers',()=>{const m=fixture(),t={id:'tower-1' as const,owner:'player' as const,kind:'tower' as const,footprint:{x:384,y:288,width:32,height:32},hp:120,level:1 as const,cooldown:0,upgradeRemaining:null,construction:{remainingSeconds:0,builderId:null}},enemy:Enemy={id:'enemy-produced-1',kind:'unit',owner:'enemy',role:'air',hp:130,position:{x:450,y:300},order:{kind:'idle'}};const p={...m.placement,defenses:[t]},visible=towerShots(p,[enemy],.1,1,()=>true);expect(visible.shots).toHaveLength(1);expect(visible.shots[0].projectile).toMatchObject({airborne:true,targets:['land','sea','air']});expect(advanceProjectiles([visible.shots[0].projectile],[enemy],1,m.map).damage.get(enemy.id)).toBeGreaterThan(0);expect(towerShots(p,[enemy],1,1,()=>false).shots).toEqual([]);});
