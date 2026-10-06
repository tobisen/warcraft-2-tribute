import {describe,it,expect} from 'vitest';
import {createMatch} from './match';
import {applyResourceCheat,resourceCheatCode} from './cheats';
import {matchStats} from './matchStats';
import {encodeSave,decodeSave} from './save';
describe('resource cheat',()=>{
 it('keeps real spending and gathering totals accurate',()=>{
  const m=createMatch();m.gathering.wood-=10;m.gathering.goldBalance=(m.gathering.goldBalance??0)-5;const next=applyResourceCheat(m,resourceCheatCode);expect(matchStats(next).player.wood).toEqual(matchStats(m).player.wood);expect(matchStats(next).player.gold).toEqual(matchStats(m).player.gold);
 });
 it('rejects malformed grant counters in saves',()=>{
  const m=applyResourceCheat(createMatch(),resourceCheatCode),doc=JSON.parse(encodeSave(m,{camera:{x:0,y:0},building:null}));for(const count of [-1,0,1.5,1000001,'1']){doc.state.gathering.resourceCheatUses=count;expect(decodeSave(JSON.stringify(doc)).ok).toBe(false);}
 });
 it('preserves granted balances through Save/load',()=>{
  const next=applyResourceCheat(createMatch(),resourceCheatCode),loaded=decodeSave(encodeSave(next,{camera:{x:0,y:0},building:null}));expect(loaded.ok).toBe(true);if(!loaded.ok)throw Error(loaded.error);expect(loaded.match.gathering.wood).toBe(next.gathering.wood);expect(loaded.match.gathering.goldBalance).toBe(next.gathering.goldBalance);
 });
 it('grants both resources repeatedly without crediting gathering statistics or enemies',()=>{
  const m=createMatch(),next=applyResourceCheat(m,resourceCheatCode),again=applyResourceCheat(next,resourceCheatCode);
  expect(next.gathering.wood).toBe(m.gathering.wood+100000);expect(next.gathering.goldBalance).toBe((m.gathering.goldBalance??0)+100000);
  expect(again.gathering.wood).toBe(m.gathering.wood+200000);expect(next.statLedger).toBe(m.statLedger);expect(next.enemyProduction).toBe(m.enemyProduction);expect(m.gathering.wood).not.toBe(next.gathering.wood);
 });
 it('ignores unknown codes, paused and ended matches; tolerates case and outer spaces',()=>{
  const m=createMatch();expect(applyResourceCheat(m,'wrong')).toBe(m);const paused={...m,paused:true};expect(applyResourceCheat(paused,resourceCheatCode)).toBe(paused);
  const ended={...m,outcome:'victory' as const};expect(applyResourceCheat(ended,resourceCheatCode)).toBe(ended);expect(applyResourceCheat(m,` ${resourceCheatCode.toUpperCase()} `)).not.toBe(m);
 });
});
