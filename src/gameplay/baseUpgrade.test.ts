import {it,expect} from 'vitest';
import {createMatch,updateMatch} from './match';
import {startBaseUpgrade,advanceBaseUpgrade,baseDevelopment} from './baseUpgrade';
import {enqueueProduction} from './productionQueue';
import {encodeSave,decodeSave} from './save';
const ready=()=>{const m=createMatch();m.gathering.wood=500;m.gathering.goldBalance=500;return m;};
it('charges once, advances both levels and rejects max level and insufficient funds',()=>{
 let m=startBaseUpgrade(ready());expect(m.gathering.wood).toBe(420);expect(startBaseUpgrade(m)).toBe(m);
 m=advanceBaseUpgrade(m,20).match;expect(baseDevelopment(m)).toEqual({level:2,remainingSeconds:null});
 m=startBaseUpgrade(m);expect(m.gathering.wood).toBe(300);m=advanceBaseUpgrade(m,30).match;
 expect(baseDevelopment(m).level).toBe(3);expect(startBaseUpgrade(m)).toBe(m);
 const poor=ready();poor.gathering.goldBalance=0;expect(startBaseUpgrade(poor)).toBe(poor);
});
it('pauses the accepted queue, preserves rally and resumes only leftover frame time',()=>{
 let m=ready();const q=enqueueProduction(m.gathering,m.production,{kind:'base'});m={...m,...q};
 m.production.rally={x:300,y:300};m=startBaseUpgrade(m);
 const before=structuredClone(m.production);m=updateMatch(m,1);expect(m.production).toEqual(before);
 const step=advanceBaseUpgrade(m,20);expect(step.productionSeconds).toBeCloseTo(1);expect(step.match.production).toEqual(before);
 const paused={...m,paused:true};expect(updateMatch(paused,10)).toBe(paused);
});
it('roundtrips an active upgrade, selection, rally and queue; rejects corrupt upgrade timing',()=>{
 let m=ready();m.gathering.wood=100;m.gathering.goldBalance=60;m={...m,...enqueueProduction(m.gathering,m.production,{kind:'base'})};m=startBaseUpgrade(m);
 const json=encodeSave(m,{camera:{x:240,y:180},building:'base'}),result=decodeSave(json);
 expect(result.ok,result.ok?'':result.error).toBe(true);if(result.ok){expect(result.match.combat.baseDevelopment).toEqual(m.combat.baseDevelopment);expect(result.match.production).toEqual(m.production);expect(result.view.building).toBe('base');}
 const bad=JSON.parse(json);bad.state.combat.baseDevelopment.remainingSeconds=100;expect(decodeSave(JSON.stringify(bad)).ok).toBe(false);
});
