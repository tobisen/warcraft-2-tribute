import {legacyEnemyFixture} from './testHelpers/legacyEnemyFixture';
import {matchFog} from './matchFog';
import {expect,it} from 'vitest';
import {createMatch} from './match';
import {encodeSave,decodeSave} from './save';
import {loadTransport} from './transport';
const view={camera:{x:0,y:0},building:null};
function afloat(){
 const m=createMatch('skirmish','easy',{player:'clans',enemy:'crown'},'islands');
 m.gathering.units[0]={...m.gathering.units[0],selected:true,position:{x:688,y:432},target:{x:688,y:432}};
 m.navy={harbor:null,production:{remainingSeconds:null,nextUnitNumber:2},ships:[{kind:'ship',id:'ship-1',role:'transport',owner:'player',hp:90,position:{x:720,y:432},target:{x:720,y:432},selected:false,order:{kind:'idle'},passengers:[]}]};
 m.fog=matchFog(m);return loadTransport(m,'ship-1');
}
it('ground, ship and embarked identities are stable and wrong, missing or unknown types are rejected',()=>{
 const m=afloat(),json=encodeSave(m,view),d=JSON.parse(json);
 expect(d.state.gathering.units.map((u:any)=>u.typeId)).toEqual(['clans:unit:worker','clans:unit:worker']);
 expect(d.state.navy.ships[0].typeId).toBe('clans:naval:transport');expect(d.state.navy.ships[0].passengers[0].typeId).toBe('clans:unit:worker');
 for(const mutate of [(d:any)=>d.state.gathering.units[0].typeId='crown:unit:worker',(d:any)=>delete d.state.gathering.units[0].typeId,(d:any)=>d.state.navy.ships[0].typeId='clans:naval:warship',(d:any)=>d.state.navy.ships[0].passengers[0].typeId='clans:unit:unknown']){
  const copy=JSON.parse(json);mutate(copy);expect(decodeSave(JSON.stringify(copy)).ok).toBe(false);
 }
 const loaded=decodeSave(json);expect(loaded.ok).toBe(true);if(loaded.ok){expect(loaded.match.gathering).toEqual(m.gathering);expect(loaded.match.navy).toEqual(m.navy);}
 expect(m.gathering.units[0]).not.toHaveProperty('typeId');
});
it('config23 migrates all owned identities including embarked units, preserving match state',()=>{
 const m=afloat(),d=JSON.parse(encodeSave(m,view));d.configVersion='tribute-config-23';legacyEnemyFixture(d);
 for(const unit of d.state.gathering.units)delete unit.typeId;
 for(const ship of d.state.navy.ships){delete ship.typeId;for(const unit of ship.passengers)delete unit.typeId;}
 const loaded=decodeSave(JSON.stringify(d));expect(loaded.ok).toBe(true);if(loaded.ok){expect(loaded.match.gathering).toEqual(m.gathering);expect(loaded.match.navy).toEqual(m.navy);expect(loaded.match.statLedger).toEqual(m.statLedger);}
});
