import {expect,it} from 'vitest';
import {maps,type MapId} from '../config/maps';
import {regionBases,regionExpansion} from '../config/mapRegions';
import {createMatch,updateMatch} from './match';
import {bodyFits,terrainPatches} from './map';
import {resourceNodes} from './gathering';
import {approachRoute} from './approach';
import {findDomainRoute} from './terrainNavigation';
import {isVisible} from './fog';
import {encodeSave,decodeSave} from './save';
import {prepareEnemyConstruction} from './enemyConstruction';
import {prepareEnemyExpansion,updateEnemyExpansion} from './enemyExpansion';
import {updateEnemyGathering} from './enemyGathering';
import {updateEnemyProduction} from './enemyProduction';
import {enemyPopulation} from './enemyConstruction';
import {hasEnemyBase} from './enemyBases';
import {enemyBase} from './enemyBases';
import {cleanDestroyed} from './destruction';
const view={camera:{x:0,y:0},building:null};
it.each(Object.keys(maps) as MapId[])('%s has a distant reachable region, usable resources, curved land/water and strict Save',id=>{
 const m=createMatch('skirmish','beginner',undefined,id),base=regionBases[id],route=approachRoute(m.map,m.gathering.units[2].position,base,24),nodes=resourceNodes(m.gathering);expect(m.map.design).toBe('regions');expect(terrainPatches(m.map).filter(p=>p.kind==='water').length).toBeGreaterThan(5);
 expect(isVisible(m.fog!,'player',{x:base.x+48,y:base.y+48})).toBe(false);
 if(!maps[id].enemyNaval){expect(route.status,id).not.toBe('blocked');const points=[m.gathering.units[2].position,...route.waypoints],length=points.slice(1).reduce((n,p,i)=>n+Math.hypot(p.x-points[i].x,p.y-points[i].y),0);expect(length,id).toBeGreaterThan(1500);}
 else{expect(route.status).toBe('blocked');expect(approachRoute(m.map,m.combat.enemies.find(e=>e.kind==='worker')!.position,{x:864,y:320,width:64,height:64},24).status).not.toBe('blocked');expect(findDomainRoute(m.map,'water',{x:720,y:432},{x:880,y:432},16).ok).toBe(true);expect(approachRoute(m.map,{x:960,y:480},base,24).status).not.toBe('blocked');}
 for(const n of nodes){expect(n.position.x).toBeGreaterThanOrEqual(0);expect(n.position.y).toBeGreaterThanOrEqual(0);expect(n.position.x).toBeLessThan(m.map.width);expect(n.position.y).toBeLessThan(m.map.height);}
 for(const n of [m.gathering.node,m.gathering.gold!])expect(approachRoute(m.map,m.gathering.units[0].position,{x:n.position.x-(n.tree?16:20),y:n.position.y-(n.tree?16:20),width:n.tree?32:40,height:n.tree?32:40},24).status,`${id}:${n.id}`).not.toBe('blocked');
 const mine=nodes.find(n=>n.id==='region-0-0-mine')!,worker=m.combat.enemies.find(e=>e.kind==='worker')!;expect(approachRoute(m.map,worker.position,{x:mine.position.x-20,y:mine.position.y-20,width:40,height:40},24).status).not.toBe('blocked');
 expect(bodyFits(m.map,{x:base.x-128,y:base.y+128},12)).toBe(true);expect(decodeSave(encodeSave(m,view)).ok).toBe(true);
});
it('a paid second base builds through contact, gathers locally, produces and survives original-base destruction',()=>{
 let m=prepareEnemyConstruction(createMatch('skirmish','normal',undefined,'frontier'));const bar=m.combat.enemies.find(e=>e.buildingType==='barracks')!;bar.construction={remainingSeconds:0,builderId:null};delete m.enemyKnowledge;
 for(const e of m.combat.enemies)if(e.work){e.work.order={kind:'idle'};e.navigation=undefined;}
 m.enemyPolicy!.research={attack:1,defense:1,job:null};m.combat.enemies.push(...Array.from({length:3},(_,i)=>({id:`enemy-produced-${i+1}`,kind:'unit' as const,owner:'enemy' as const,role:'soldier' as const,hp:48,position:{x:3400+i*32,y:3480},order:{kind:'idle' as const}})));m.enemyProduction!.production.nextUnitNumber=4;
 m.enemyProduction!.wood=200;m.enemyProduction!.gold=100;const bank=m.enemyProduction!.wood;m=prepareEnemyExpansion(m);const outpost=m.combat.enemies.find(e=>e.buildingType==='outpost')!;expect(outpost.footprint).toMatchObject(regionExpansion(regionBases.frontier,'frontier'));expect(m.enemyProduction!.wood).toBe(bank-80);expect(outpost.construction!.remainingSeconds).toBe(10);
 for(let i=0;i<180&&m.combat.enemies.find(e=>e.id===outpost.id)!.construction!.remainingSeconds>0;i++)m=updateEnemyExpansion(m,.25);expect(m.combat.enemies.find(e=>e.id===outpost.id)!.construction!.remainingSeconds).toBe(0);
 const worker=m.combat.enemies.find(e=>e.id===outpost.construction!.builderId)!;worker.work!.order={kind:'idle'};worker.navigation=undefined;
 const nearby=resourceNodes(m.gathering).find(n=>n.id==='region-0-1-tree-0-1')!;worker.position={x:nearby.position.x-32,y:nearby.position.y};worker.work!.target=worker.position;worker.work!.order={kind:'gather',nodeId:nearby.id};const stock=nearby.remaining;m=updateEnemyGathering(m,6);expect(resourceNodes(m.gathering).find(n=>n.id===nearby.id)!.remaining).toBeLessThan(stock);
 m.combat.enemies.find(e=>e.kind==='base')!.hp=0;m=cleanDestroyed(m);expect(hasEnemyBase(m.combat,m.map)).toBe(true);expect(updateMatch(m,0).outcome).toBe('playing');expect(enemyBase(m.combat,m.map)?.id).toBe(outpost.id);
 const production=updateEnemyProduction(m.enemyProduction!,m.combat,m.gathering,m.map,20,m.factions!.enemy,{site:bar,population:enemyPopulation(m)});expect(production.combat.enemies.length).toBeGreaterThan(m.combat.enemies.length);const produced=production.combat.enemies.at(-1)!;expect(Math.hypot(produced.position.x-outpost.position.x,produced.position.y-outpost.position.y)).toBeLessThan(200);
 m.combat.enemies.find(e=>e.id===outpost.id)!.hp=0;expect(updateMatch(m,0).outcome).toBe('victory');
},30000);
it('normal AI pressure remains held during initial economic establishment',()=>{const m=updateMatch(createMatch('skirmish','normal',undefined,'arena'),60);expect(m.enemyAI!.groups.some(g=>g.status==='attack')).toBe(false);expect(m.enemyProduction!.spent!.wood).toBeGreaterThan(0);},30000);

it('natural paid expansion preserves a valid Save and victory after the original base falls',()=>{let m=createMatch('skirmish','normal',undefined,'frontier',1,'economic');for(let t=0;t<120;t+=.5){m=updateMatch(m,.5);if(m.combat.enemies.some(e=>e.buildingType==='outpost'&&e.construction?.remainingSeconds===0))break;}expect(m.combat.enemies.some(e=>e.buildingType==='outpost'&&e.construction?.remainingSeconds===0)).toBe(true);m.combat.enemies.find(e=>e.kind==='base')!.hp=0;m=updateMatch(m,0);expect(m.outcome).toBe('playing');const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);},30000);

it.each(['islands','coast'] as const)('%s distant naval economy scouts and builds its paid harbor',id=>{let m=createMatch('skirmish','normal',undefined,id);for(let t=0;t<180;t+=.5){m=updateMatch(m,.5);if(m.combat.enemies.some(e=>e.buildingType==='harbor'&&e.construction?.remainingSeconds===0))break;}expect(m.combat.enemies.some(e=>e.buildingType==='harbor'&&e.construction?.remainingSeconds===0)).toBe(true);const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);},30000);
