import {expect,it} from 'vitest';
import {maps,type MapId} from '../config/maps';
import {difficultyProfiles,type Difficulty} from '../config/difficulty';
import {factionsForPlayer} from '../config/factions';
import {createMatch,updateMatch,type MatchState} from './match';
import {enemyKnowledgeConfig} from '../config/enemyKnowledge';
import {bodyFits,createMap} from './map';
import {matchStats} from './matchStats';
import {releasePlaythrough} from './testHelpers/releaseBot';

function conserved(m:MatchState){
 const stats=matchStats(m),profile=maps[m.map.id??'arena'];
 for(const type of ['wood','gold'] as const){
  const remaining=type==='wood'?m.gathering.node.remaining:m.gathering.gold!.remaining;
  expect(stats.player[type].gathered+stats.enemy[type].gathered+remaining).toBeCloseTo(profile[type],6);
  const cargo=m.combat.enemies.reduce((n,e)=>n+(e.work&&(e.work.cargoType??'wood')===type?e.work.cargo:0),0);
  const bank=m.enemyProduction!;
  expect(bank[type]+bank.spent![type]+cargo+(bank.lostCargo?.[type]??0)).toBeCloseTo(difficultyProfiles[m.difficulty!].budget[type]+bank.extracted![type],6);
  expect(remaining).toBeGreaterThanOrEqual(0);expect(bank[type]).toBeGreaterThanOrEqual(0);
 }
}
for(const map of ['arena','forest','river'] as MapId[])for(const faction of ['crown','clans'] as const)for(const difficulty of Object.keys(difficultyProfiles) as Difficulty[]){
 it(`paid ${map}/${faction}/${difficulty} completes with conserved finite economy`,()=>{
  const r=releasePlaythrough('skirmish',difficulty,conserved,{map,faction,abilities:true});
  expect(r.match.outcome).toBe('victory');expect(r.saved).toBe(true);
  const stats=matchStats(r.match);expect(stats.player.wood.spent).toBeCloseTo(r.spentWood,6);expect(stats.player.gold.spent).toBeCloseTo(r.spentGold,6);
  expect(stats.seconds).toBeGreaterThan(45);expect(stats.seconds).toBeLessThanOrEqual(300);
  expect(updateMatch(r.match,600)).toEqual(r.match);
  console.info(JSON.stringify({map,faction,difficulty,seconds:stats.seconds,spentWood:r.spentWood,spentGold:r.spentGold,kills:stats.player.killed}));
 },30_000);
}
for(const map of ['arena','forest','river'] as MapId[])for(const faction of ['crown','clans'] as const){
 it(`passive ${map}/${faction} reaches defeat without free income`,()=>{
  let m=createMatch('skirmish','normal',factionsForPlayer(faction),map);
  for(let i=0;i<1500&&m.outcome==='playing';i++){m=updateMatch(m,.2);if(i%25===0)conserved(m);}
  expect(m.outcome).toBe('defeat');conserved(m);expect(matchStats(m).player.wood.gathered).toBe(0);
  expect(updateMatch(m,600)).toEqual(m);
  console.info(JSON.stringify({passive:true,map,faction,seconds:m.waves.elapsedSeconds,enemySpent:m.enemyProduction!.spent,enemyGathered:m.enemyProduction!.extracted}));
 },30_000);
}

it('search waypoints remain land positions on every handcrafted map',()=>{
 for(const id of Object.keys(maps) as MapId[])for(const point of maps[id].enemyAttackWaypoints??enemyKnowledgeConfig.attackWaypoints)expect(bodyFits(createMap(id),point,12)).toBe(true);
});
