import {domainMap,marineFlightMap} from './terrainNavigation';
import {bodyFits} from './map';
import {segmentFits} from './navigation';
import {navyConfig} from '../config/navy';
import {expect,it} from 'vitest';
import {createMatch,updateMatch} from './match';
import {matchAnimals,animalAt,updateWildlife,visibleAnimals} from './wildlife';
import {issueOrder,prepareOrders} from './commandOrders';
import {stopSelected} from './orders';
import {encodeSave,decodeSave} from './save';
import {selectionInfo} from '../presentation/selectionInfo';
import {visionObservers} from './matchFog';
const view={camera:{x:0,y:0},building:null};
function fixture(archetype?:'archer'|'catapult'|'specialist'|'air'){
 const m=createMatch('skirmish'),animal=matchAnimals(m)[0];m.fog!.teams.player.visible.fill(true);m.fog!.teams.player.explored.fill(true);m.gathering.units.push({id:'unit-4',kind:'soldier',owner:'player',selected:true,hp:60,cargo:0,position:{x:animal.position.x-30,y:animal.position.y},target:{x:animal.position.x-30,y:animal.position.y},order:{kind:'idle'},...(archetype?{archetype}:{}),autoDisabled:true});m.production.nextUnitNumber=5;m.soldierProduction.nextUnitNumber=5;return {m,animal};
}
it('animal inspection works while troops remain selected and leaves their orders unchanged',()=>{
 const {m,animal}=fixture(),before=structuredClone(m.gathering.units);expect(animalAt(m,animal.position)?.id).toBe(animal.id);expect(animalAt(m,{x:animal.position.x+8,y:animal.position.y-20})?.id).toBe(animal.id);const info=selectionInfo(m,null,null,animal.id);expect(info).toMatchObject({name:'Deer',hp:24,maxHP:24});expect(m.gathering.units).toEqual(before);expect(visionObservers(m).some(o=>o.id===animal.id)).toBe(false);expect(m.map.obstacles.some(o=>o.x===animal.position.x&&o.y===animal.position.y)).toBe(false);
 m.fog!.teams.player.visible.fill(false);expect(animalAt(m,animal.position)).toBeUndefined();expect(selectionInfo(m,null,null,animal.id).name).not.toBe('Deer');
});
it('ordinary combat range/damage kills a neutral animal, clears every hunter and changes no scores or economy',()=>{
 const {m,animal}=fixture(),initial={wood:m.gathering.wood,gold:m.gathering.goldBalance,ledger:structuredClone(m.statLedger),enemies:structuredClone(m.combat.enemies)},ordered=issueOrder(m,{kind:'hunt',animalId:animal.id});expect(ordered.gathering.units.at(-1)!.order).toEqual({kind:'hunt',animalId:animal.id});let hurt=updateWildlife(ordered,.5);expect(hurt.wildlife![animal.id].hp).toBeGreaterThan(0);expect(hurt.wildlife![animal.id].hp).toBeLessThan(24);expect(selectionInfo(hurt,null,null,animal.id).hp).toBe(hurt.wildlife![animal.id].hp);
 const dead=updateWildlife(hurt,3);expect(dead.wildlife![animal.id].hp).toBe(0);expect(dead.gathering.units.at(-1)!.order.kind).toBe('idle');expect(animalAt(dead,animal.position)).toBeUndefined();expect(dead.gathering.wood).toBe(initial.wood);expect(dead.gathering.goldBalance).toBe(initial.gold);expect(dead.statLedger).toEqual(initial.ledger);expect(dead.combat.enemies).toEqual(initial.enemies);expect(visibleAnimals(dead).some(a=>a.id===animal.id&&a.hp===0)).toBe(true);dead.waves.elapsedSeconds+=2;expect(visibleAnimals(dead).some(a=>a.id===animal.id)).toBe(false);
});
it.each(['archer','catapult','specialist','air'] as const)('%s can hunt with its own combat profile',type=>{const {m,animal}=fixture(type);const next=updateWildlife(issueOrder(m,{kind:'hunt',animalId:animal.id}),.5);expect(next.wildlife![animal.id].hp).toBeLessThan(animal.hp);});
it('Shift queues hunting and later movement; Stop/ordinary orders replace it, workers never receive hunts',()=>{
 const {m,animal}=fixture();m.gathering.units[0].selected=true;let ordered=issueOrder(m,{kind:'hunt',animalId:animal.id});expect(ordered.gathering.units[0].order.kind).toBe('idle');ordered=issueOrder(ordered,{kind:'move',destination:{x:400,y:300}},true);expect(ordered.gathering.units.at(-1)!.orderQueue).toHaveLength(1);let dead=updateWildlife(ordered,3);dead=prepareOrders(dead);expect(dead.gathering.units.at(-1)!.order.kind).toBe('move');expect(dead.gathering.units.at(-1)!.orderQueue).toBeUndefined();ordered.gathering.units=stopSelected(ordered.gathering.units,true);expect(ordered.gathering.units.at(-1)!.order.kind).toBe('idle');expect(ordered.gathering.units.at(-1)!.orderQueue).toBeUndefined();
 const replacing=issueOrder(issueOrder(m,{kind:'hunt',animalId:animal.id}),{kind:'hold'});expect(replacing.gathering.units.at(-1)!.commandMode?.kind).toBe('hold');expect(replacing.gathering.units.at(-1)!.order.kind).toBe('idle');
});
it('lost vision or unreachable animals cancel hunting without secretly following their wandering',()=>{
 const {m,animal}=fixture(),ordered=issueOrder(m,{kind:'hunt',animalId:animal.id});ordered.fog!.teams.player.visible.fill(false);expect(updateWildlife(ordered,.5).gathering.units.at(-1)!.order.kind).toBe('idle');ordered.fog!.teams.player.visible.fill(true);ordered.map={...ordered.map,revision:ordered.map.revision+1,obstacles:[...ordered.map.obstacles,{x:animal.position.x-50,y:animal.position.y-50,width:100,height:100}]};expect(updateWildlife(ordered,.5).gathering.units.at(-1)!.order.kind).toBe('idle');
});
it('Save/load preserves damaged/dead animals and hunts; restart restores HP and invalid refs are rejected',()=>{
 const {m,animal}=fixture();let hurt=updateWildlife(issueOrder(m,{kind:'hunt',animalId:animal.id}),.5);const loaded=decodeSave(encodeSave(hurt,view));expect(loaded.ok).toBe(true);if(loaded.ok){expect(loaded.match.wildlife).toEqual(hurt.wildlife);expect(matchAnimals(loaded.match)).toEqual(matchAnimals(hurt));expect(loaded.match.gathering.units.at(-1)!.order).toEqual(hurt.gathering.units.at(-1)!.order);}
 const dead=updateWildlife(hurt,3);expect(decodeSave(encodeSave(dead,view)).ok).toBe(true);expect(matchAnimals(createMatch('skirmish'))[0].hp).toBe(24);
 for(const mutate of [(d:any)=>d.state.wildlife['ghost']={hp:3},(d:any)=>d.state.wildlife[animal.id].hp=25,(d:any)=>d.state.wildlife[animal.id].deadAt=0,(d:any)=>d.state.gathering.units.at(-1).order.animalId='ghost']){const d=JSON.parse(encodeSave(hurt,view));mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}
 const paused={...hurt,paused:true};expect(updateMatch(paused,5)).toBe(paused);
});
it('warships use marine range/occlusion against shore animals, while transports keep their orders',()=>{
 const m=createMatch('skirmish'),water=domainMap(m.map,'water'),flight=marineFlightMap(m.map);let animal:ReturnType<typeof matchAnimals>[number]|undefined,point:{x:number;y:number}|undefined;
 outer:for(const a of matchAnimals(m))for(let y=16;y<m.map.height;y+=32)for(let x=16;x<m.map.width;x+=32)if(Math.hypot(x-a.position.x,y-a.position.y)<navyConfig.ship.range-16&&bodyFits(water,{x,y},navyConfig.ship.size/2)&&segmentFits(flight,{x,y},a.position,0)){animal=a;point={x,y};break outer;}expect(animal).toBeDefined();expect(point).toBeDefined();if(!animal||!point)throw Error('No shore fixture');m.fog!.teams.player.visible.fill(true);m.fog!.teams.player.explored.fill(true);m.navy={harbor:null,production:{remainingSeconds:null,nextUnitNumber:3},ships:[{id:'ship-1',kind:'ship',role:'warship',owner:'player',hp:navyConfig.ship.hp,selected:true,position:point,target:point,order:{kind:'idle'}},{id:'ship-2',kind:'ship',role:'transport',owner:'player',hp:navyConfig.ship.hp,selected:true,passengers:[],position:point,target:point,order:{kind:'idle'}}]};
 const ordered=issueOrder(m,{kind:'hunt',animalId:animal.id});expect(ordered.navy!.ships[0].order.kind).toBe('hunt');expect(ordered.navy!.ships[1].order.kind).toBe('idle');const hurt=updateWildlife(ordered,.2);expect(hurt.wildlife![animal.id].hp).toBeLessThan(animal.hp);expect(hurt.navy!.ships[0].position).toEqual(m.navy.ships[0].position);expect(hurt.combat.enemies).toEqual(m.combat.enemies);expect(decodeSave(encodeSave(hurt,view)).ok).toBe(true);
});

it('the final hit clears earlier hunters too and restores normal idle targeting',()=>{
 const {m,animal}=fixture();m.gathering.units.push({...m.gathering.units.at(-1)!,id:'unit-5'});const first=updateWildlife(issueOrder(m,{kind:'hunt',animalId:animal.id}),.4);expect(first.wildlife![animal.id].hp).toBeGreaterThan(0);const dead=updateWildlife(first,.4);expect(dead.wildlife![animal.id].hp).toBe(0);expect(dead.gathering.units.slice(-2).every(u=>u.order.kind==='idle'&&u.kind==='soldier'&&!u.autoDisabled)).toBe(true);
});
