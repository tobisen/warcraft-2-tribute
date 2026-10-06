import { describe, expect, it } from 'vitest';
import { combatConfig } from '../config/combat';
import { orderUnits, type GatheringState, type Soldier } from './gathering';
import { enemyAt, orderAttack, updateCombat, type CombatState } from './combat';

const soldier = (overrides: Partial<Soldier> = {}): Soldier => ({
  kind: 'soldier', id: 'unit-1', position: { x: 100, y: 100 }, target: { x: 100, y: 100 },
  cargo: 0, selected: true, hp: combatConfig.soldierHP, order: { kind: 'attack', enemyId: 'enemy-1' }, ...overrides,
});
const economy = (units: GatheringState['units'] = [soldier()]): GatheringState => ({
  units, wood: 0, base: { x: 400, y: 450 }, node: { id: 'wood', position: { x: 650, y: 180 }, remaining: 100 },
});
const fight = (x = 132, hp = 36): CombatState => ({ baseHP: combatConfig.baseHP, enemies: [{ id: 'enemy-1', position: { x, y: 100 }, hp }] });

describe('manual combat', () => {
  it('only selected units accept attack, including workers', () => {
    const worker = { kind: 'worker' as const, id: 'w', position: {x:0,y:0}, target:{x:0,y:0}, cargo:3, selected:true, order:{kind:'gather' as const,nodeId:'wood'} };
    const idle = soldier({order:{kind:'idle'}});
    const units = orderAttack([worker, idle, soldier({id:'unselected',selected:false,order:{kind:'move'}})], 'enemy-2');
    expect(units[0].order).toEqual({kind:'attack',enemyId:'enemy-2'});expect(units[0].cargo).toBe(3);
    expect(units[1].order).toEqual({kind:'attack',enemyId:'enemy-2'});
    expect(units[2].order.kind).toBe('move');
  });
  it('moves to range before damage, spending only the time left after travel', () => {
    const result = updateCombat(economy(), fight(292), 1);
    expect(result.gathering.units[0].position).toEqual({x:260,y:100});
    expect(result.combat.enemies[0].hp).toBe(36);
    const after = updateCombat(result.gathering, result.combat, 0.5);
    // AI moved the target during the first step; approach consumes more time.
    expect(after.combat.enemies[0].hp).toBeGreaterThan(27);
    expect(after.combat.enemies[0].hp).toBeLessThan(36);
  });
  it('zero delta leaves health and position unchanged', () => {
    expect(updateCombat(economy(), fight(), 0)).toEqual({gathering:economy(),combat:fight()});
  });
  it.each([1, 10, 60])('damage across %s stationary time steps is equivalent', steps => {
    let result = {gathering:economy(),combat:fight()};
    for(let i=0;i<steps;i++) result=updateCombat(result.gathering,result.combat,1/steps);
    expect(result.combat.enemies[0].hp).toBeCloseTo(18);
  });
  it('death removes enemy and ends every order targeting it, without mutating original', () => {
    const original=economy([soldier(),soldier({id:'unit-2'})]);
    const result=updateCombat(original,fight(),2);
    expect(result.combat.enemies).toEqual([]);
    expect(result.gathering.units.every(u=>u.order.kind==='idle')).toBe(true);
    expect(original.units[0].order.kind).toBe('attack');
  });
  it('missing target ends attack and a move command replaces attack', () => {
    expect(updateCombat(economy(),{...fight(),enemies:[]},1).gathering.units[0].order.kind).toBe('idle');
    const units=orderUnits(economy().units,{x:300,y:300});
    expect(units[0].order.kind).toBe('move');
    expect(updateCombat(economy(units),fight(),1).combat.enemies[0].hp).toBe(36);
  });
  it('enemy click uses body bounds including edge', () => {
    expect(enemyAt(fight().enemies,{x:144,y:100})?.id).toBe('enemy-1');
    expect(enemyAt(fight().enemies,{x:145,y:100})).toBeUndefined();
  });
});

describe('enemy AI and attacks', () => {
  it('approaches the base without dealing damage during travel, then deals damage', () => {
    const initial = {baseHP:240,enemies:[{id:'e',position:{x:400,y:353},hp:36}]};
    const result = updateCombat(economy([]),initial,1);
    expect(result.combat.baseHP).toBe(240);
    expect(result.combat.enemies[0].position).toEqual({x:400,y:418});
    expect(updateCombat(result.gathering,result.combat,0.5).combat.baseHP).toBe(237);
  });
  it('targets the nearest soldier in aggro, ignoring workers and far soldiers', () => {
    const units=[soldier({id:'far',position:{x:600,y:100},order:{kind:'idle'}}),
      soldier({id:'near',position:{x:145,y:100},order:{kind:'idle'}}),
      soldier({id:'nearest',position:{x:140,y:100},order:{kind:'idle'}})];
    const result=updateCombat(economy(units),fight(),1);
    expect(result.gathering.units.find(u=>u.id==='nearest')).toMatchObject({hp:54});
    expect(result.gathering.units.find(u=>u.id==='near')).toMatchObject({hp:60});
    expect(result.combat.baseHP).toBe(240);
  });
  it('kills a soldier, removes it and retargets the base on the next update', () => {
    const result=updateCombat(economy([soldier({hp:1,order:{kind:'idle'}})]),fight(),1);
    expect(result.gathering.units).toHaveLength(0);
    const before=result.combat.enemies[0].position;
    const next=updateCombat(result.gathering,result.combat,1);
    expect(next.combat.enemies[0].position.x).toBeGreaterThan(before.x);
    expect(next.combat.enemies[0].position.y).toBeGreaterThan(before.y);
  });
  it('allows simultaneous lethal damage without negative health', () => {
    const result=updateCombat(economy([soldier({hp:6})]),fight(132,18),1);
    expect(result.gathering.units).toEqual([]);
    expect(result.combat.enemies).toEqual([]);
    const base=updateCombat(economy([]),{baseHP:1,enemies:[{id:'e',position:{x:400,y:450},hp:36}]},1);
    expect(base.combat.baseHP).toBe(0);
  });
  it('zero delta causes no AI movement or damage', () => {
    const result=updateCombat(economy([soldier({order:{kind:'idle'}})]),fight(),0);
    expect(result).toEqual({gathering:economy([soldier({order:{kind:'idle'}})]),combat:fight()});
  });
});

it('dead combatants cannot damage anyone', () => {
  const result=updateCombat(economy([soldier({hp:0})]),fight(),1);
  expect(result.combat.enemies[0].hp).toBe(36);
  expect(result.gathering.units).toHaveLength(0);
  expect(updateCombat(economy(),fight(132,0),1).gathering.units[0]).toMatchObject({hp:60,order:{kind:'idle'}});
});
