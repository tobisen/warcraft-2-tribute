import { describe, expect, it } from 'vitest';
import { costs } from '../config/economy';
import { canAfford, payCost, costLabel } from './economy';
import { createMatch } from './match';
import { startProduction } from './production';
import { productionLabel } from '../presentation/hud';

const building={kind:'barracks' as const,footprint:{x:512,y:384,width:64,height:64}};
describe('atomic two-resource costs',()=>{
  it.each([{wood:19.99,goldBalance:5},{wood:20,goldBalance:4.99}])('does not debit either resource when a balance is insufficient: %j',balance=>{
    expect(canAfford(balance,costs.soldier)).toBe(false);expect(payCost(balance,costs.soldier)).toBe(balance);
    const s=createMatch();Object.assign(s.gathering,balance);
    const result=startProduction(s.gathering,s.soldierProduction,building);
    expect(result.gathering).toBe(s.gathering);expect(result.production).toBe(s.soldierProduction);
    expect(productionLabel(s.gathering,s.soldierProduction,'playing',building)).toContain('Behöver');
  });
  it('debits exact balances once and blocks double start',()=>{
    const s=createMatch();s.gathering.wood=20;s.gathering.goldBalance=5;
    const started=startProduction(s.gathering,s.soldierProduction,building);
    expect(started.gathering.wood).toBe(0);expect(started.gathering.goldBalance).toBe(0);
    expect(startProduction(started.gathering,started.production,building)).toEqual(started);
    expect(costLabel(costs.soldier)).toBe('20 wood + 5 gold');
    expect(s.gathering.wood).toBe(20);expect(s.gathering.goldBalance).toBe(5);
  });
  it('single-resource purchases preserve gold and fresh match resets both',()=>{
    const s=createMatch();s.gathering.wood=20;s.gathering.goldBalance=5;
    const result=startProduction(s.gathering,s.production);
    expect(result.gathering.wood).toBe(0);expect(result.gathering.goldBalance).toBe(5);
    expect(createMatch().gathering.goldBalance).toBe(0);expect(createMatch().gathering.wood).toBe(0);
  });
});
