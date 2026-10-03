import {expect,it} from 'vitest';
import {createMatch,type MatchState} from './match';
import {createNavy,commandShips,attackShips,stopShips,placeHarbor} from './navy';
import {updateCombat} from './combat';
import {cleanDestroyed} from './destruction';
import {advanceProjectiles} from './projectiles';
import {prepareNavalCombat} from './navalCombat';
import {marineFlightMap,domainBodyFits} from './terrainNavigation';
import {navyConfig} from '../config/navy';
import {replaceObstacles} from './map';
import {encodeSave,decodeSave} from './save';
import {matchFog} from './matchFog';
/** Explicit combat fixture, separate from paid production/normal match factories. */
function fixture(hp=90):MatchState {
 const m=createMatch('mission-outpost','easy');m.navy={...createNavy(),production:{remainingSeconds:null,nextUnitNumber:2},ships:[{kind:'ship',owner:'player',id:'ship-1',hp,selected:true,position:{x:208,y:512},target:{x:208,y:512},order:{kind:'idle'}}]};m.combat.enemies=[{id:'enemy-1',owner:'enemy',hp:36,position:{x:320,y:512},order:{kind:'idle'}}];m.waves.nextEnemyNumber=2;m.fog=matchFog(m);return m;
}
function tick(m:MatchState,delta:number,visible=true){const r=updateCombat(m.gathering,m.combat,delta,m.map,m.placement,undefined,()=>true,()=>visible,undefined,m.navy,()=>visible);return cleanDestroyed({...m,...r});}
it('manual cannon requires range, valid water firing position and fixed aim impact; kills clear orders',()=>{
 let m=fixture();m.navy=attackShips(m,'enemy-1');m=tick(m,.1);expect(m.combat.enemies[0].hp).toBe(36);expect(m.combat.projectiles).toHaveLength(1);expect(m.combat.projectiles![0]).toMatchObject({marine:true,damage:16,speed:280});for(let i=0;i<50;i++)m=tick(m,.1);expect(m.combat.enemies).toEqual([]);expect(m.navy!.ships[0].order.kind).toBe('idle');
});
it('unreachable distant target cannot move a ship onto land or fire beyond range',()=>{
 let m=fixture();m.combat.enemies[0].position={x:850,y:220};m.navy=attackShips(m,'enemy-1');m=tick(m,2);expect(m.navy!.ships[0].position).toEqual({x:208,y:512});expect(m.navy!.ships[0].navigation!.status).toBe('blocked');expect(m.combat.projectiles??[]).toEqual([]);expect(m.combat.enemies[0].hp).toBe(36);
});
it('marine shots cross water while rocks/structures occlude and moving targets can dodge fixed aim',()=>{
 const m=fixture(),prepared=prepareNavalCombat(attackShips(m,'enemy-1'),m.combat.enemies,.1,m.map,1),shot=prepared.shots[0].projectile;
 expect(advanceProjectiles([shot],m.combat.enemies,1,m.map).damage.get('enemy-1')).toBe(16);
 const dodged=m.combat.enemies.map(e=>({...e,position:{x:320,y:560}}));expect(advanceProjectiles([shot],dodged,1,m.map).damage.size).toBe(0);
 const wall=replaceObstacles(m.map,[...m.map.obstacles,{x:250,y:490,width:32,height:64}]);expect(advanceProjectiles([shot],m.combat.enemies,1,wall).damage.size).toBe(0);expect(marineFlightMap(wall).obstacles).toContainEqual({x:250,y:490,width:32,height:64});
});
it('hidden targets cancel orders and cannot receive cannon or projectile damage',()=>{
 let m=fixture();m.navy=attackShips(m,'enemy-1');m=tick(m,.1);expect(m.combat.projectiles).toHaveLength(1);m=tick(m,1,false);expect(m.combat.enemies[0].hp).toBe(36);expect(m.combat.projectiles).toEqual([]);expect(m.navy!.ships[0].order.kind).toBe('idle');
});
it('move/Stop replace attack and deselection preserves it',()=>{
 const m=fixture();m.navy=attackShips(m,'enemy-1');const order=m.navy!.ships[0].order;m.navy!.ships[0].selected=false;expect(tick(m,.1).navy!.ships[0].order).toEqual(order);m.navy!.ships[0].selected=true;m.navy=commandShips(m,{x:144,y:512});expect(m.navy!.ships[0].order.kind).toBe('move');m.navy=stopShips(m.navy);expect(m.navy!.ships[0].order.kind).toBe('idle');
});
it('coastal enemies can damage and defeat a ship; lethal cannon/melee blows share a live snapshot',()=>{
 let m=fixture(6);m.combat.enemies[0]={...m.combat.enemies[0],hp:16,position:{x:240,y:512},order:{kind:'defend',targetId:'ship-1'}};m.navy=attackShips(m,'enemy-1');m=tick(m,1);expect(m.combat.enemies).toEqual([]);expect(m.navy!.ships).toEqual([]);expect(m.navy!.production.nextUnitNumber).toBe(2);
});
it('static-target firing/cooldown/projectile outcomes agree across timestep sizes',()=>{
 let a=fixture(),b=fixture();a.navy=attackShips(a,'enemy-1');b.navy=attackShips(b,'enemy-1');a.combat.enemies[0].hp=200;b.combat.enemies[0].hp=200;
 for(let i=0;i<10;i++)a=tick(a,1);for(let i=0;i<100;i++)b=tick(b,.1);expect(a.combat.enemies[0].hp).toBeCloseTo(b.combat.enemies[0].hp);expect(a.navy!.ships[0].attackCooldown).toBeCloseTo(b.navy!.ships[0].attackCooldown!);expect(a.combat.projectiles!.length).toBe(b.combat.projectiles!.length);
});
it('attack/cooldown/inflight marine Save roundtrips; old eleven migrates without marine state',()=>{
 let m=fixture();m.navy=attackShips(m,'enemy-1');m=tick(m,.1);const view={camera:{x:0,y:0},building:null},json=encodeSave(m,view),loaded=decodeSave(json);expect(loaded.ok).toBe(true);if(loaded.ok){expect(loaded.match.navy!.ships[0].order).toEqual(m.navy!.ships[0].order);expect(loaded.match.combat.projectiles).toEqual(m.combat.projectiles);expect(domainBodyFits(loaded.match.map,'water',loaded.match.navy!.ships[0].position,16)).toBe(true);}
 for(const mutate of [(d:any)=>d.state.navy.ships[0].attackCooldown=2,(d:any)=>d.state.navy.ships[0].order.enemyId='missing',(d:any)=>d.state.combat.projectiles[0].damage=100,(d:any)=>d.configVersion='tribute-config-11']){const d=JSON.parse(json);mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}
 const old=fixture();const d=JSON.parse(encodeSave(old,view));d.configVersion='tribute-config-11';expect(decodeSave(JSON.stringify(d)).ok).toBe(true);
});

it('approach to firing contact remains in water and removes a stale blocked marker when range opens',()=>{
 let m=fixture();m.navy!.ships[0].position={x:112,y:464};m.combat.enemies[0].position={x:400,y:512};m.navy=attackShips(m,'enemy-1');
 for(let i=0;i<20;i++){m=tick(m,.1);expect(domainBodyFits(m.map,'water',m.navy!.ships[0].position,16)).toBe(true);}expect(m.navy!.ships[0].position.x).toBeGreaterThan(112);expect(m.navy!.ships[0].navigation!.status).toBe('arrived');expect(m.combat.enemies[0].hp).toBeLessThan(36);
 m=fixture();m.combat.enemies[0].position={x:850,y:220};m.navy=attackShips(m,'enemy-1');m=tick(m,.1);expect(m.navy!.ships[0].navigation!.status).toBe('blocked');m.combat.enemies[0].position={x:320,y:512};m=tick(m,.1);expect(m.navy!.ships[0].navigation!.status).toBe('arrived');expect(m.combat.projectiles).toHaveLength(1);
});

it('real coastal melee destroys a paid harbor and clears builder/footprint without a refund',()=>{
 let m=createMatch('mission-outpost','easy');m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.id==='unit-1'}));m.placement={...m.placement,active:true,kind:'harbor'};m=placeHarbor(m,{x:192,y:416});expect(m.navy!.harbor).toBeTruthy();
 // Explicit low-health precondition; damage and destruction use actual combat.
 m.navy!.harbor!.hp=6;m.combat.enemies=[{id:'enemy-1',owner:'enemy',hp:36,position:{x:288,y:448},order:{kind:'defend',targetId:'harbor'}}];const wood=m.gathering.wood,gold=m.gathering.goldBalance,revision=m.map.revision;
 m=tick(m,1);expect(m.navy!.harbor).toBeNull();expect(m.map.revision).toBeGreaterThan(revision);expect(m.map.obstacles).not.toContainEqual({x:192,y:416,width:64,height:64});expect(m.gathering.wood).toBe(wood);expect(m.gathering.goldBalance).toBe(gold);expect(m.gathering.units[0].order.kind).toBe('idle');expect(m.combat.enemies[0].order!.kind).toBe('idle');
});

it('inflight saved cannon resumes damage and fog cancellation identically without revealing target',()=>{
 let m=fixture();m.navy=attackShips(m,'enemy-1');m=tick(m,.1);const loaded=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(loaded.ok).toBe(true);if(!loaded.ok)throw Error(loaded.error);expect(tick(m,.6).combat.enemies[0].hp).toBe(tick(loaded.match,.6).combat.enemies[0].hp);const hidden=tick(loaded.match,.6,false);expect(hidden.combat.enemies[0].hp).toBe(36);expect(hidden.combat.projectiles).toEqual([]);expect(hidden.navy!.ships[0].order.kind).toBe('idle');
});
