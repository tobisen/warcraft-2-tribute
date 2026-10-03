import {expect,it} from 'vitest';
import {createMatch} from '../gameplay/match';
import {createNavy} from '../gameplay/navy';
import {createWarningState,warningSnapshot,updateAttackWarnings,warningMessage} from './attackWarnings';
const fresh=()=>createMatch();
it('warns on own damage, prioritizes base and never mutates gameplay',()=>{
 const m=fresh();let state=updateAttackWarnings(createWarningState(),warningSnapshot(m),0,true).state;
 const before=structuredClone(m);expect(state.warning).toBeNull();m.gathering.units[0].hp!--;m.combat.baseHP--;
 const damaged=structuredClone(m),result=updateAttackWarnings(state,warningSnapshot(m),1,true);
 expect(result.sound).toBe(true);expect(result.state.warning).toMatchObject({id:'base',kind:'base',position:m.gathering.base});expect(warningMessage(result.state.warning)).toBe('Your base is under attack!');expect(m).toEqual(damaged);expect(before.combat.baseHP).toBe(m.combat.baseHP+1);
});
it('throttles repeated damage globally, expires after four seconds and resets',()=>{
 const m=fresh();let state=updateAttackWarnings(createWarningState(),warningSnapshot(m),0,true).state;
 for(const time of [1,2,3,4]){m.gathering.units[0].hp!--;const result=updateAttackWarnings(state,warningSnapshot(m),time,true);expect(result.sound).toBe(time===1||time===4);state=result.state;}
 expect(updateAttackWarnings(state,warningSnapshot(m),7.99,true).state.warning).not.toBeNull();expect(updateAttackWarnings(state,warningSnapshot(m),8,true).state.warning).toBeNull();expect(createWarningState().warning).toBeNull();
});
it('detects destruction without mistaking spawn or boarding/unloading for death',()=>{
 const m=fresh();m.navy=createNavy();m.navy.ships.push({id:'ship-1',kind:'ship',owner:'player',role:'transport',hp:90,position:{x:400,y:300},target:{x:400,y:300},selected:false,order:{kind:'idle'},passengers:[]});
 let state=updateAttackWarnings(createWarningState(),warningSnapshot(m),0,true).state;
 const worker=m.gathering.units.shift()!;m.navy.ships[0].passengers!.push(worker);
 let result=updateAttackWarnings(state,warningSnapshot(m),1,true);expect(result.sound).toBe(false);state=result.state;
 m.navy.ships[0].passengers=[];m.gathering.units.push(worker);result=updateAttackWarnings(state,warningSnapshot(m),2,true);expect(result.sound).toBe(false);state=result.state;
 m.gathering.units=m.gathering.units.filter(u=>u.id!==worker.id);result=updateAttackWarnings(state,warningSnapshot(m),3,true);expect(result.sound).toBe(true);expect(result.state.warning?.id).toBe(worker.id);
 const initial=createWarningState();expect(updateAttackWarnings(initial,warningSnapshot(m),20,true).sound).toBe(false);
});
it('keeps pause/end/load silent and warns on building damage/removal',()=>{
 const m=fresh();m.placement.barracks={x:576,y:352,width:64,height:64};m.placement.barracksHP=120;
 let state=updateAttackWarnings(createWarningState(),warningSnapshot(m),0,true).state;m.placement.barracksHP--;
 let result=updateAttackWarnings(state,warningSnapshot(m),1,false);expect(result.sound).toBe(false);expect(result.state.warning).toBeNull();state=result.state;
 result=updateAttackWarnings(state,warningSnapshot(m),1,true);expect(result.sound).toBe(false);state=result.state;
 m.placement.barracks=null;result=updateAttackWarnings(state,warningSnapshot(m),2,true);expect(result.state.warning?.kind).toBe('building');expect(warningMessage(result.state.warning)).toContain('building');
 expect(updateAttackWarnings(result.state,warningSnapshot(m),3,false).state.warning).toBeNull();
});
