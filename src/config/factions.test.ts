import {expect,it} from 'vitest';
import {factions,factionIds,factionForTeam,defaultFactions} from './factions';
import {costs} from './economy';
import {unitStats} from './unit';
import {combatConfig} from './combat';
import {archerConfig} from './archer';
import {catapultConfig} from './catapult';
import {upgradeConfig} from './upgrades';
import {createMatch,updateMatch} from '../gameplay/match';

it('implemented factions define all shared roles with distinct, globally unique type IDs',()=>{
  const ids=new Set<string>();
  for(const id of factionIds){const f=factions[id];
    expect(Object.keys(f.units)).toEqual(['worker','soldier','archer','catapult','specialist','air']);
    expect(Object.keys(f.buildings)).toEqual(['base','barracks','farm','forge','academy']);
    expect(Object.keys(f.upgrades)).toEqual(['attack','defense']);
    for(const group of [f.units,f.buildings,f.upgrades])for(const [role,type] of Object.entries(group)){
      expect(type.role).toBe(role);expect(type.faction).toBe(id);expect(type.id.startsWith(`${id}:`)).toBe(true);
      expect(ids.has(type.id)).toBe(false);ids.add(type.id);
    }
  }
  expect(ids.size).toBe(65);
});
it('catalog values preserve current baseline and costs do not alias the other faction',()=>{
  for(const f of [factions.crown]){
    for(const role of ['worker','soldier','archer','catapult'] as const)expect(f.units[role].cost).toEqual(costs[role]);
    expect(f.units.worker).toMatchObject({hp:combatConfig.workerHP,speed:unitStats.speed,durationSeconds:5});
    expect(f.units.archer).toMatchObject({hp:archerConfig.hp,range:archerConfig.range,supply:archerConfig.supply});
    expect(f.units.catapult).toMatchObject({hp:catapultConfig.hp,splashRadius:catapultConfig.splashRadius,supply:2});
    expect(f.upgrades.attack.multiplier).toBe(upgradeConfig.attackMultiplier);
    expect(f.upgrades.defense.multiplier).toBe(upgradeConfig.defenseMultiplier);
  }
  expect(factions.crown.units.worker.cost).not.toBe(factions.clans.units.worker.cost);
  expect(factions.crown.buildings.forge.cost).not.toBe(factions.clans.buildings.forge.cost);
});
it('identity is independent of owner/team and fresh matches own their faction selection',()=>{
  const chosen={player:'clans',enemy:'crown'} as const;
  const m=createMatch('skirmish','normal',chosen);
  expect(factionForTeam(m,'player').id).toBe('clans');expect(m.gathering.units[0].owner).toBe('player');
  expect(factionForTeam(m,'enemy').id).toBe('crown');expect(m.combat.enemies[0].owner).toBe('enemy');
  expect(updateMatch(m,.1).factions).toEqual(chosen);
  m.factions!.enemy='clans';expect(chosen.enemy).toBe('crown');
  expect(createMatch('skirmish','normal',chosen).factions).toEqual(chosen);
  expect(createMatch().factions).toEqual(defaultFactions);expect(defaultFactions.enemy).toBe('clans');
  expect(factionForTeam({},'player').id).toBe('crown');
});
