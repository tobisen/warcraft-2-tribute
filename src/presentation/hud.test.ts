import { describe, expect, it } from 'vitest';
import { createMatch } from '../gameplay/match';
import { productionLabel, matchLabels } from './hud';
import { productionConfig } from '../config/production';

describe('HUD feedback', () => {
  it('explains unavailable building, insufficient balance and active production', () => {
    const s = createMatch();
    expect(productionLabel(s.gathering,s.production,s.outcome,{kind:'barracks',footprint:null})).toContain('Bygg barracks');
    expect(productionLabel(s.gathering,s.production,s.outcome)).toContain(`Behöver ${productionConfig.workerCost}`);
    s.gathering.wood=productionConfig.workerCost;
    expect(productionLabel(s.gathering,s.production,s.outcome)).toBe('Redo att träna');
    s.production.remainingSeconds=3.25;
    expect(productionLabel(s.gathering,s.production,s.outcome)).toContain('3.3 s kvar');
  });
  it('game over takes precedence over timers and fresh state removes old status', () => {
    const s=createMatch();s.production.remainingSeconds=2;
    expect(productionLabel(s.gathering,s.production,'defeat')).toBe('Matchen är avslutad');
    expect(productionLabel(createMatch().gathering,createMatch().production,'playing')).toContain('Behöver');
  });
  it('reports delivered balance separately from carried wood and resets selection', () => {
    const s=createMatch();s.gathering.units[0].selected=true;s.gathering.units[0].cargo=4;
    const labels=matchLabels(s);
    expect(labels.economy).toContain('Wood: 0.0');expect(labels.selected).toContain('4.0/5');
    expect(matchLabels(createMatch()).selected).toBe('Ingen enhet markerad');
    s.waves.elapsedSeconds=10;
    expect(matchLabels(s).wave).toContain('50.0 s');
  });
  it('explains ready-but-blocked spawn and gives game over precedence', () => {
    const s=createMatch();s.production.remainingSeconds=0;s.production.blockedSpawnKey='occupied';
    expect(productionLabel(s.gathering,s.production,'playing')).toContain('spawn-utgång blockerad');
    expect(productionLabel(s.gathering,s.production,'victory')).toBe('Matchen är avslutad');
  });

});
