import { costs } from './economy';
import { goldConfig } from './gathering';
import { describe, expect, it } from 'vitest';
import { barracksConfig } from './buildings';
import { gatheringConfig } from './gathering';
import { combatConfig } from './combat';
import { productionConfig, soldierProductionConfig } from './production';
import { waveSchedule } from './waves';

// Product contracts, not a snapshot of the current tuning numbers.
describe('survival balance budget', () => {
  it('funds a barracks, four defenders, an extra worker and a replacement', () => {
    const budget = barracksConfig.cost + 5 * soldierProductionConfig.cost + productionConfig.workerCost;
    expect(gatheringConfig.initialWood).toBeGreaterThanOrEqual(budget);
    expect(goldConfig.initialAmount).toBeGreaterThanOrEqual(costs.barracks.gold+5*costs.soldier.gold+costs.worker.gold);
  });
  it('keeps finite waves and positive gameplay rates, health and durations', () => {
    expect(waveSchedule.length).toBeGreaterThan(0);
    let previous = 0;
    for (const wave of waveSchedule) {
      expect(wave.atSeconds).toBeGreaterThan(previous);
      expect(wave.count).toBeGreaterThan(0);
      expect(Number.isInteger(wave.count)).toBe(true);
      previous = wave.atSeconds;
    }
    for (const value of [gatheringConfig.capacity, gatheringConfig.woodPerSecond,
      productionConfig.durationSeconds, soldierProductionConfig.durationSeconds,
      combatConfig.baseHP, combatConfig.soldierHP, combatConfig.enemyHP,
      combatConfig.soldierDamagePerSecond, combatConfig.enemyDamagePerSecond]) {
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBeGreaterThan(0);
    }
    for (const cost of [productionConfig.workerCost, soldierProductionConfig.cost, barracksConfig.cost]) {
      expect(Number.isFinite(cost)).toBe(true);
      expect(cost).toBeGreaterThanOrEqual(0);
    }
  });
});
