import {expect,it} from 'vitest';
import {factionIds,factions,type FactionId} from '../config/factions';
import {navyConfig} from '../config/navy';
import {createClassicMatch as createMatch} from './testHelpers/classicMatch';
import {createMatch as createRegionalMatch,updateMatch} from './match';
import {applyCheat} from './cheats';
import {createNavy,trainShip,canTrainShip,updateNavy,commandShips,type Ship} from './navy';
import {encodeSave,decodeSave} from './save';
import {replaceObstacles} from './map';
import {domainBodyFits} from './terrainNavigation';
import {matchFog,visionObservers} from './matchFog';
import {concealSubmarines} from './submarines';
import {entityVisible} from './visibility';
import {prepareNavalCombat,prepareEnemySubmarines} from './navalCombat';
import {combatAudioSnapshot} from '../presentation/combatAudio';
import {visibleMinimapData} from '../presentation/minimap';
import {actionPanel} from '../presentation/actionPanel';
import {matchPlayers} from './players';
import {initializeMultiplePlayers} from './multiplePlayers';
import {createFog} from './fog';
const view={camera:{x:0,y:0},building:'harbor' as const};
const vessel=(id:string,role:Ship['role'],x=144,y=512):Ship=>({id,kind:'ship',role,owner:'player',hp:role==='submarine'?100:90,selected:true,position:{x,y},target:{x,y},order:{kind:'idle'}});
function ready(id:FactionId='crown'){
 let m=applyCheat(createMatch('mission-outpost','easy',{player:id,enemy:'clans'}),'icanseemyhousefromhere');
 m.navy={...createNavy(),harbor:{owner:'player',hp:factions[id].naval.harbor.hp,footprint:{x:192,y:416,width:64,height:64},construction:{remainingSeconds:0,builderId:null}}};m.map=replaceObstacles(m.map,[...m.map.obstacles,m.navy.harbor!.footprint]);return m;
}
it.each(factionIds)('%s paid research-gated submarine FIFO, unique water spawn, movement, save and restart',id=>{
 let m=ready(id);expect(trainShip(m,'submarine')).toBe(m);expect(actionPanel(m,'harbor',true)['train-submarine'].reason).toContain('Research');m.research!.submarineDesign=1;
 const wood=m.gathering.wood,gold=m.gathering.goldBalance!;m=trainShip(m,'submarine');expect(m.gathering.wood).toBe(wood-75);expect(m.gathering.goldBalance).toBe(gold-50);expect(m.navy!.production.queue![0]).toMatchObject({kind:'submarine',supply:3,durationSeconds:20});expect(canTrainShip({...m,research:{...m.research!,submarineDesign:0}},'submarine')).toBe(false);
 expect(updateNavy(m,19.99).navy!.ships).toHaveLength(0);expect(decodeSave(encodeSave(m,view))).toMatchObject({ok:true});m=updateNavy(m,20);expect(m.navy!.ships[0]).toMatchObject({id:'ship-1',role:'submarine',hp:100});expect(domainBodyFits(m.map,'water',m.navy!.ships[0].position,16)).toBe(true);m.navy!.ships[0].selected=true;m.navy=commandShips(m,{x:144,y:512});m=updateNavy(m,1);expect(domainBodyFits(m.map,'water',m.navy!.ships[0].position,16)).toBe(true);
 m.navy=commandShips(m,{x:400,y:300});expect(m.navy!.ships[0].navigation?.status).toBe('blocked');m.fog=matchFog(m);expect(decodeSave(encodeSave(m,view))).toMatchObject({ok:true});expect(createMatch('mission-outpost','easy',{player:id,enemy:'clans'}).research?.submarineDesign).toBeUndefined();expect(factions[id].naval.units.submarine.name).toBeTruthy();
});
it('sea-only torpedoes both sides, no land/air/building hunt and immediate target loss',()=>{
 const ship={...vessel('ship-1','submarine'),order:{kind:'attack' as const,enemyId:'target'}},navy={...createNavy(),ships:[ship]};
 for(const target of [{kind:'unit' as const},{role:'air' as const},{kind:'building' as const,footprint:{x:160,y:496,width:32,height:32}}]){const result=prepareNavalCombat(navy,[{id:'target',hp:60,position:{x:180,y:512},...target}],.1,undefined,1);expect(result.shots).toHaveLength(0);expect(result.navy!.ships[0].order.kind).toBe('idle');}
 const sea={id:'target',kind:'ship' as const,hp:90,position:{x:180,y:512}},result=prepareNavalCombat(navy,[sea],.1,undefined,1);expect(result.shots[0].projectile).toMatchObject({damage:24,targets:['sea'],submarine:true,marine:true});const lost=prepareNavalCombat(result.navy,[sea],.1,undefined,2,1,()=>false);expect(lost.shots).toHaveLength(0);expect(lost.navy!.ships[0]).toMatchObject({order:{kind:'idle'},navigation:undefined});
 const enemy={id:'enemy-ship-2',kind:'ship' as const,navalRole:'submarine' as const,owner:'enemy' as const,hp:100,position:ship.position},t={id:'ship-1',kind:'ship' as const,owner:'player' as const,hp:90,footprint:{x:164,y:496,width:32,height:32}};
 expect(prepareEnemySubmarines([enemy],[t],.1,undefined,1,'clans',1,()=>true).shots[0].projectile).toMatchObject({owner:'enemy',submarine:true,targets:['sea'],damage:24});expect(prepareEnemySubmarines([enemy],[t],.1,undefined,1,'clans',1,()=>false).shots).toHaveLength(0);
});
it('ordinary vision cannot reveal submarines; researched scout / warship proximity AND current vision required',()=>{
 const m=ready(),enemy={id:'enemy-ship-2',kind:'ship' as const,navalRole:'submarine' as const,owner:'enemy' as const,hp:100,position:{x:144,y:512}};m.combat.enemies.push(enemy);m.fog!.revealed=true;
 m.navy!.ships=[vessel('ship-1','transport',200,512)];m.fog=matchFog(m);expect(entityVisible(m.fog,'player',enemy)).toBe(false);
 m.navy!.ships=[vessel('ship-1','warship',200,512)];m.fog=matchFog(m);expect(entityVisible(m.fog,'player',enemy)).toBe(true);m.navy!.ships[0].position.x=241;m.fog=matchFog(m);expect(entityVisible(m.fog,'player',enemy)).toBe(false);
 m.navy!.ships=[];const p={x:270,y:512};m.gathering.units.push({id:'unit-4',kind:'soldier',archetype:'scout',owner:'player',hp:35,cargo:0,selected:false,position:p,target:p,order:{kind:'idle'}});m.fog=matchFog(m);expect(entityVisible(m.fog,'player',enemy)).toBe(false);m.research!.scoutOptics=1;m.fog=matchFog(m);expect(entityVisible(m.fog,'player',enemy)).toBe(true);
 const dark=createFog(m.map),detection=concealSubmarines(m,dark,visionObservers(m));expect(entityVisible(detection,'player',enemy)).toBe(false);
});
it('concealed bodies/attacks/torpedoes never appear in audio or minimap; no saved concealment cache',()=>{
 const m=ready(),enemy={id:'enemy-ship-2',kind:'ship' as const,navalRole:'submarine' as const,owner:'enemy' as const,hp:100,attackCooldown:1,position:{x:144,y:512}};m.combat.enemies.push(enemy);m.fog!.revealed=true;m.fog=matchFog(m);
 m.combat.projectiles=[{id:'enemy-arrow-1',shooterId:enemy.id,targetId:'ship-1',owner:'enemy',marine:true,submarine:true,targets:['sea'],position:enemy.position,destination:{x:200,y:512},speed:280,remainingLife:3,damage:24,hitRadius:20}];
 expect(combatAudioSnapshot(m).bodies.some(b=>b.id===enemy.id)).toBe(false);expect(combatAudioSnapshot(m).attacks.some(a=>a.id===enemy.id)).toBe(false);expect(combatAudioSnapshot(m).shots[0].visible).toBe(false);expect(visibleMinimapData(m).markers.some(x=>x.id===enemy.id)).toBe(false);m.combat.enemies=m.combat.enemies.filter(e=>e.id!==enemy.id);m.combat.projectiles=[];expect(JSON.parse(encodeSave(m,view)).state.fog.concealedIds).toBeUndefined();
});
it('allied researched detector shares detection; hostile/unresearched/dead detectors do not',()=>{
 let m=createRegionalMatch('skirmish','normal',undefined,'plains96'),roster=matchPlayers(undefined,'balanced',3);roster[2].teamId=1;m=initializeMultiplePlayers(m,roster);const ally=m.multiplePlayers!.ai[1],p={x:400,y:400};
 const sub={id:'enemy-ship-2',owner:'enemy' as const,kind:'ship' as const,navalRole:'submarine' as const,hp:100,position:p};m.combat.enemies.push(sub);m.fog!.revealed=true;ally.state.combat.enemies.push({id:'enemy-produced-1',kind:'unit',owner:'enemy',role:'scout',hp:35,position:{x:450,y:400}});ally.state.enemyPolicy!.research.scoutOptics=1;m.fog=matchFog(m);expect(entityVisible(m.fog,'player',sub)).toBe(true);
 ally.state.enemyPolicy!.research.scoutOptics=0;m.fog=matchFog(m);expect(entityVisible(m.fog,'player',sub)).toBe(false);ally.state.enemyPolicy!.research.scoutOptics=1;ally.state.combat.enemies.at(-1)!.hp=0;m.fog=matchFog(m);expect(entityVisible(m.fog,'player',sub)).toBe(false);
});
it('AI pays the same researched harbor recipe and keeps the queue after transport destruction',async()=>{
 const {updateEnemyNaval}=await import('./enemyNaval'),{enemyNavalConfig}=await import('../config/enemyNaval'),{cleanDestroyed}=await import('./destruction');
 let m=createMatch('skirmish','normal',{player:'crown',enemy:'clans'},'islands');const foot={...enemyNavalConfig.harbor};m.combat.enemies.push({id:'enemy-harbor',owner:'enemy',kind:'building',buildingType:'harbor',hp:factions.clans.naval.harbor.hp,footprint:foot,position:{x:foot.x+32,y:foot.y+32},construction:{remainingSeconds:0,builderId:null}});m.map=replaceObstacles(m.map,[...m.map.obstacles,foot]);m.enemyNaval!.production.nextUnitNumber=2;m.enemyNaval!.production.nextJobNumber=2;m.enemyNaval!.phase='finished';const before={wood:m.enemyProduction!.wood,gold:m.enemyProduction!.gold};m=updateEnemyNaval(m,.1);expect(m.enemyNaval!.production.queue??[]).toHaveLength(0);
 m.enemyPolicy!.research.submarineDesign=1;m=updateEnemyNaval(m,.1);expect(m.enemyProduction!.wood).toBe(before.wood-75);expect(m.enemyProduction!.gold).toBe(before.gold-50);expect(m.enemyNaval!.production.queue![0]).toMatchObject({kind:'submarine',durationSeconds:20,supply:3});m=cleanDestroyed(m);expect(m.enemyNaval!.production.queue![0].kind).toBe('submarine');expect(decodeSave(encodeSave(m,{...view,building:null}))).toMatchObject({ok:true});m=updateEnemyNaval(m,20);const sub=m.combat.enemies.find(e=>e.navalRole==='submarine');expect(sub).toMatchObject({id:'enemy-ship-2',hp:100});expect(domainBodyFits(m.map,'water',sub!.position,16)).toBe(true);expect(decodeSave(encodeSave(m,{...view,building:null}))).toMatchObject({ok:true});
});
it('submarine torpedoes and own/enemy submarine orders survive strict save; forged land masks are rejected',()=>{
 let m=createMatch('skirmish','normal',{player:'crown',enemy:'clans'},'islands');m=applyCheat(m,'icanseemyhousefromhere');m.research!.submarineDesign=1;m.navy={...createNavy(),production:{remainingSeconds:null,nextUnitNumber:2},ships:[vessel('ship-1','submarine',800,432)]};const sub={id:'enemy-ship-2',kind:'ship' as const,navalRole:'submarine' as const,owner:'enemy' as const,hp:100,position:{x:864,y:432},order:{kind:'defend' as const,targetId:'ship-1'}};m.enemyNaval!.production.nextUnitNumber=3;m.enemyNaval!.phase='finished';m.combat.enemies.push(sub);m.navy.ships[0].order={kind:'attack',enemyId:sub.id};m.combat.projectiles=[{id:'arrow-1',shooterId:'ship-1',targetId:sub.id,marine:true,submarine:true,targets:['sea'],position:{x:800,y:432},destination:sub.position,speed:280,remainingLife:3,damage:24,hitRadius:20},{id:'enemy-arrow-2',shooterId:sub.id,targetId:'ship-1',owner:'enemy',marine:true,submarine:true,targets:['sea'],position:sub.position,destination:{x:800,y:432},speed:280,remainingLife:3,damage:24,hitRadius:20}];m.combat.nextProjectileNumber=3;
 const json=encodeSave(m,{...view,building:null}),loaded=decodeSave(json);expect(loaded).toMatchObject({ok:true});if(loaded.ok){expect(loaded.match.combat.projectiles).toHaveLength(2);expect(loaded.match.fog!.concealedIds!.player).toContain(sub.id);}const forged=JSON.parse(json);forged.state.combat.projectiles[0].targets=['land'];expect(decodeSave(JSON.stringify(forged)).ok).toBe(false);
});
it('enemy target selection cannot shoot or pursue an undetected player submarine, and loses it after detector death',()=>{
 let m=createMatch('skirmish','normal',{player:'crown',enemy:'clans'},'islands');m=applyCheat(m,'icanseemyhousefromhere');delete m.enemyAI;delete m.armyPlan;
 m.navy={...createNavy(),production:{remainingSeconds:null,nextUnitNumber:2},ships:[{...vessel('ship-1','submarine',800,432),selected:false}]};m.enemyNaval!.production={remainingSeconds:null,nextUnitNumber:3};m.enemyNaval!.phase='finished';m.combat.enemies.push({id:'enemy-ship-2',kind:'ship',navalRole:'submarine',owner:'enemy',hp:100,position:{x:864,y:432},order:{kind:'idle'}});m.fog=matchFog(m);
 m=updateMatch(m,.1);expect(m.navy!.ships[0].hp).toBe(100);expect(m.combat.enemies.find(e=>e.navalRole)?.order?.kind).toBe('idle');
 m.enemyPolicy!.research.scoutOptics=1;m.combat.enemies.push({id:'enemy-produced-1',kind:'unit',role:'scout',owner:'enemy',hp:35,position:{x:850,y:432},order:{kind:'idle'}});m.enemyProduction!.production.nextUnitNumber=2;m=updateMatch(m,.3);expect(m.navy!.ships[0].hp).toBeLessThan(100);
 m.combat.enemies.find(e=>e.role==='scout')!.hp=0;m.fog=matchFog(m);const previousHP=m.navy!.ships[0].hp;m=updateMatch(m,.1);expect(m.combat.enemies.find(e=>e.navalRole)).toMatchObject({order:{kind:'idle'},navigation:undefined});expect(m.navy!.ships[0].hp).toBe(previousHP);
});
