import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {it,expect} from 'vitest';
import {createMatch,updateMatch} from './match';
import {matchStats} from './matchStats';
import {placeBarracks,placementObstacles} from './placement';
import {cleanDestroyed} from './destruction';
import {encodeSave,decodeSave} from './save';
import {resourceNodes,updateGathering} from './gathering';
const view={camera:{x:0,y:0},building:null};
function building(){const m=createMatch();m.gathering.wood=40;m.gathering.units[0].selected=true;const placed=placeBarracks({...m.placement,active:true},{x:512,y:384},40,placementObstacles(m.gathering),{map:m.map,gathering:m.gathering,enemies:[]});return {...m,placement:placed.placement,map:placed.map!,gathering:placed.gathering!};}
it('counts real completed construction exactly once over repeated ticks and destruction once',()=>{
 let m=building();expect(matchStats(m).player.built).toBe(0);m=updateMatch(m,12);expect(matchStats(m).player.built).toBe(1);m=updateMatch(m,1);expect(matchStats(m).player.built).toBe(1);
 m.placement.barracksHP=0;m=cleanDestroyed(m);expect(matchStats(m).player.destroyed).toBe(1);m=cleanDestroyed(m);expect(matchStats(m).player.destroyed).toBe(1);
 m.combat.baseHP=0;m=cleanDestroyed(m);expect(matchStats(m).player.destroyed).toBe(2);expect(matchStats(cleanDestroyed(m)).player.destroyed).toBe(2);
});
it('unfinished sites lost do not count as completed, and enemy base loss counts once',()=>{
 let m=building();m.placement.barracksHP=0;m=cleanDestroyed(m);expect(matchStats(m).player).toMatchObject({built:0,destroyed:1});
 m=createMatch('skirmish');m.combat.enemies.find(e=>e.kind==='base')!.hp=0;m=cleanDestroyed(m);expect(matchStats(m).enemy.destroyed).toBe(1);expect(matchStats(cleanDestroyed(m)).enemy.destroyed).toBe(1);
});
it('owner removals are separate from combat losses and opponent kills',()=>{
 const m=createMatch();m.gathering.units.pop();m.statLedger!.player.removed=1;expect(matchStats(m).player).toMatchObject({removed:1,lost:0});expect(matchStats(m).enemy.killed).toBe(0);
 m.gathering.units.pop();expect(matchStats(m).player.lost).toBe(1);expect(matchStats(m).enemy.killed).toBe(1);
});
it('Frontier expansion extraction and cargo are not mislabelled as spending',()=>{
 const m=createMatch('skirmish','normal',undefined,'frontier');const node=resourceNodes(m.gathering).find(n=>n.id==='wood-2')!;
 const u=m.gathering.units[0];u.position={x:node.position.x-40,y:node.position.y};u.order={kind:'gather',nodeId:node.id};
 m.gathering=updateGathering(m.gathering,1,m.map);expect(matchStats(m).player.wood).toEqual({gathered:1,delivered:0,spent:0});
});
it('roundtrips counters, resets new matches and migrates genuine config19 without invented history',()=>{
 const m=updateMatch(building(),12),loaded=decodeSave(encodeSave(m,view));expect(loaded.ok).toBe(true);if(loaded.ok)expect(loaded.match.statLedger).toEqual(m.statLedger);
 expect(createMatch().statLedger?.player.built).toBe(0);
 const old=JSON.parse(encodeSave(m,view));legacyTerrainFixture(old);old.configVersion='tribute-config-19';delete old.state.statLedger;
 const migrated=decodeSave(JSON.stringify(old));expect(migrated.ok).toBe(true);if(migrated.ok){expect(migrated.match.statLedger).toMatchObject({legacy:true,player:{built:0,destroyed:0,removed:0}});expect(decodeSave(encodeSave(migrated.match,view)).ok).toBe(true);}
 for(const bad of [-1,NaN,1.5,'1']){const doc=JSON.parse(encodeSave(m,view));doc.state.statLedger.player.built=bad;expect(decodeSave(JSON.stringify(doc)).ok).toBe(false);}
});
