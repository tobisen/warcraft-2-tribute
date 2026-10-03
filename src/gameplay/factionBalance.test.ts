import {expect,it} from 'vitest';
import {playableScenarios,scenarioConfig} from '../config/scenarios';
import {factionsForPlayer} from '../config/factions';
import {createMatch,updateMatch} from './match';
import {releasePlaythrough} from './testHelpers/releaseBot';
import {decodeSave,encodeSave} from './save';
for(const faction of ['crown','clans'] as const)for(const scenario of playableScenarios.filter(id=>scenarioConfig[id].map==='arena'))for(const difficulty of ['easy','normal','hard'] as const){
 it(`faction balance ${faction}/${scenario}/${difficulty}: paid victory with abilities and ledger`,()=>{
  const r=releasePlaythrough(scenario,difficulty,undefined,{faction,abilities:true}),m=r.match;
  console.info(JSON.stringify({faction,scenario,difficulty,outcome:m.outcome,time:m.waves.elapsedSeconds,baseHP:m.combat.baseHP,wood:r.spentWood,gold:r.spentGold,abilities:r.abilitiesUsed}));
  expect(m.outcome).toBe('victory');expect(r.saved).toBe(true);expect(m.factions).toEqual(factionsForPlayer(faction));expect(m.gathering.faction).toBe(faction);expect(updateMatch(m,999)).toBe(m);
  const cargo=(type:string)=>m.gathering.units.reduce((n,u)=>n+(u.kind==='worker'&&(u.cargoType??'wood')===type?u.cargo:0),0);
  expect(m.gathering.wood+m.gathering.node.remaining+cargo('wood')+(m.enemyProduction?.extracted?.wood??0)+r.spentWood+(m.gathering.lostCargo?.wood??0)).toBeCloseTo(400+scenarioConfig[scenario].initial.wood);
  expect((m.gathering.goldBalance??0)+m.gathering.gold!.remaining+cargo('gold')+(m.enemyProduction?.extracted?.gold??0)+r.spentGold+(m.gathering.lostCargo?.gold??0)).toBeCloseTo(300+scenarioConfig[scenario].initial.gold);
  expect(decodeSave(encodeSave(m,{camera:{x:0,y:0},building:'base'})).ok).toBe(true);
 },30_000);
}
for(const faction of ['crown','clans'] as const){
 it(`${faction} can lose through actual enemy attacks and next match isolates every choice`,()=>{
  let m=createMatch('survival','hard',factionsForPlayer(faction));for(let i=0;i<4000&&m.outcome==='playing';i++)m=updateMatch(m,.1);
  expect(m.outcome).toBe('defeat');expect(m.combat.baseHP).toBe(0);expect(updateMatch(m,1000)).toBe(m);
  const saved=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(saved.ok).toBe(true);
  const next=createMatch('mission-outpost','easy',factionsForPlayer(faction==='crown'?'clans':'crown'));expect(next.factions?.player).not.toBe(m.factions?.player);expect(next.gathering.faction).toBe(next.factions?.player);expect(next.gathering.units).toHaveLength(3);expect(next.gathering.units.every(u=>!u.selected&&!('ability' in u))).toBe(true);expect(next.waves.elapsedSeconds).toBe(0);expect(next.combat.baseHP).toBe(240);expect(next.production.queue).toBeUndefined();expect(next.scenario).toBe('mission-outpost');expect(next.difficulty).toBe('easy');
 },30_000);
}
