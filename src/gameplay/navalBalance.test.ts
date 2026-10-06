import {expect,it} from 'vitest';
import {createClassicMatch as createMatch} from './testHelpers/classicMatch';
import {updateMatch} from './match';
import {factions,factionsForPlayer} from '../config/factions';
import {orderUnits} from './gathering';
import {commandGroupMove} from './groupMovement';
import {knownResource} from './visibility';
import {placeHarbor,trainShip,commandShips,attackShips,matchPopulation} from './navy';
import {navyConfig} from '../config/navy';
for(const difficulty of ['easy','normal','hard'] as const)for(const faction of ['crown','clans'] as const){
 it(`${difficulty}/${faction}: doing nothing loses to a paid finite naval assault`,()=>{
  let m=createMatch('skirmish',difficulty,factionsForPlayer(faction),'islands');for(let i=0;i<1900&&m.outcome==='playing';i++)m=updateMatch(m,.2);
  expect(m.outcome).toBe('defeat');expect(m.enemyNaval!.phase).toBe('landed');expect(m.enemyProduction!.acceptedJobs).toBeGreaterThanOrEqual(2);expect(m.enemyProduction!.extracted).toEqual({wood:0,gold:0});expect(m.waves.elapsedSeconds).toBeLessThan(350);
 },30000);
 it(`${difficulty}/${faction}: a paid early cannon ship stops the carrier without free economy`,()=>{
  let m=createMatch('skirmish',difficulty,factionsForPlayer(faction),'islands');const select=(id:string)=>{m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.id===id}));if(m.navy)m.navy.ships=m.navy.ships.map(s=>({...s,selected:s.id===id}));};
  for(let i=0;i<1700&&(m.gathering.wood<80||m.gathering.goldBalance!<25);i++){
   for(const worker of m.gathering.units){if(worker.kind!=='worker'||worker.order.kind==='gather'||worker.order.kind==='deliver')continue;const node=worker.id==='unit-3'?m.gathering.gold!:m.gathering.node;select(worker.id);m.gathering.units=knownResource(m.fog!,node.position)?orderUnits(m.gathering.units,node.position,node):commandGroupMove(m.gathering.units,{x:600,y:220},m.map);}m=updateMatch(m,.1);
  }
  expect(m.gathering.wood).toBeGreaterThanOrEqual(80);expect(m.gathering.goldBalance).toBeGreaterThanOrEqual(25);select('unit-1');m.gathering.units=commandGroupMove(m.gathering.units,{x:656,y:400},m.map);for(let i=0;i<60;i++)m=updateMatch(m,.1);m.placement={...m.placement,active:true,kind:'harbor'};m=placeHarbor(m,{x:672,y:320});expect(m.navy!.harbor).toBeTruthy();for(let i=0;i<140&&m.navy!.harbor!.construction.remainingSeconds>0;i++)m=updateMatch(m,.1);const bank={wood:m.gathering.wood,gold:m.gathering.goldBalance!};m=trainShip(m);expect(m.gathering.wood).toBeCloseTo(bank.wood-navyConfig.ship.cost.wood);expect(m.gathering.goldBalance).toBeCloseTo(bank.gold-navyConfig.ship.cost.gold);for(let i=0;i<90&&!m.navy!.ships.length;i++)m=updateMatch(m,.1);expect(matchPopulation(m).used).toBe(5);select('ship-1');m.navy=commandShips(m,{x:800,y:432});for(let i=0;i<40&&m.navy!.ships[0].order.kind!=='idle';i++)m=updateMatch(m,.1);const enemy=m.combat.enemies.find(e=>e.kind==='ship');expect(enemy).toBeTruthy();m.navy=attackShips(m,enemy!.id);for(let i=0;i<110&&m.combat.enemies.some(e=>e.kind==='ship');i++)m=updateMatch(m,.1);expect(m.enemyNaval!.phase).toBe('finished');for(let i=0;i<1800&&m.waves.elapsedSeconds<350;i++)m=updateMatch(m,.2);expect(m.outcome).toBe('playing');expect(m.combat.baseHP).toBe(factions[faction].buildings.base.hp);expect(m.enemyNaval!.production.nextUnitNumber).toBe(2);expect(m.enemyNaval!.passengers).toEqual([]);
 },30000);
}
