import {expect,it} from 'vitest';
import {createStatLedger} from './statLedger';
import {createMatch,updateMatch} from './match';
import {encodeSave,decodeSave,readSave,storeSave} from './save';
import {saveConfig} from '../config/save';
import {defaultFactions} from '../config/factions';
const view={camera:{x:240,y:180},building:null};
function legacy(){const m=updateMatch(createMatch('siege-test'),2);m.gathering.units[0]={...m.gathering.units[0],kind:'worker',cargo:3,cargoType:'wood',order:{kind:'deliver',nodeId:'wood-1'}};m.paused=true;const d=JSON.parse(encodeSave(m,view));d.schemaVersion=1;d.configVersion='tribute-config-1';delete d.state.statLedger;d.state.combat.enemies=d.state.combat.enemies.filter((e:any)=>e.kind!=='worker');delete d.state.enemyProduction.extracted;delete d.state.enemyProduction.spent;delete d.state.enemyProduction.lostCargo;delete d.state.factions;const e=d.state.enemyProduction;if(e?.production.queue){e.wood=20;e.gold=5;e.production.remainingSeconds=3;e.production.queue.forEach((j:any,i:number)=>{j.cost={wood:20,gold:5};j.durationSeconds=5;j.remainingSeconds=i===0?3:5;});}return d;}
it('migrates a v1 local slot atomically without changing gameplay, view or the stored JSON until Save',()=>{
  const old=legacy(),json=JSON.stringify(old);let slot=json;
  const storage={getItem:()=>slot,setItem:(_key:string,s:string)=>{slot=s;}};
  const loaded=readSave(storage);expect(loaded.ok).toBe(true);if(!loaded.ok)return;
  expect(loaded.match.factions).toEqual(defaultFactions);const {factions:_factions,...state}=loaded.match;
  const before=structuredClone(old.state);before.statLedger=createStatLedger(true);before.enemyProduction.production.queue.forEach((j:any)=>j.legacyRecipe=true);expect({...state,gathering:{...state.gathering,faction:undefined}}).toEqual(before);expect(loaded.view).toEqual(view);expect(slot).toBe(json);
  expect(updateMatch(loaded.match,100)).toBe(loaded.match);
  expect(storeSave(storage,loaded.match,loaded.view).ok).toBe(true);
  expect(JSON.parse(slot)).toMatchObject({schemaVersion:saveConfig.schemaVersion,configVersion:saveConfig.configVersion,state:{factions:defaultFactions}});
});
it('roundtrips both swapped and same-faction teams in version two',()=>{
  for(const selected of [{player:'clans',enemy:'crown'},{player:'clans',enemy:'clans'}] as const){
    const m=createMatch('skirmish','hard',selected),loaded=decodeSave(encodeSave(m,view));
    expect(loaded.ok).toBe(true);if(loaded.ok)expect(loaded.match).toEqual(m);
  }
});
it('rejects missing/unknown/spoofed factions and unsupported versions without mutating the old slot',()=>{
  const mutations=[(d:any)=>delete d.state.factions,(d:any)=>d.state.factions.player='unknown',
    (d:any)=>d.state.factions.team='player',(d:any)=>d.schemaVersion=3,
    (d:any)=>{d.schemaVersion=1;d.configVersion='tribute-config-1';delete d.state.statLedger;},
    (d:any)=>{d.schemaVersion=1;d.configVersion='other';delete d.state.factions;}];
  for(const mutate of mutations){const d=JSON.parse(encodeSave(createMatch(),view));mutate(d);const before=JSON.stringify(d);const loaded=decodeSave(before);expect(loaded.ok).toBe(false);if(!loaded.ok)expect(loaded.error).toMatch(/faction|version/);expect(JSON.stringify(d)).toBe(before);}
  const invalid=legacy();invalid.state.gathering.units[0].cargo=-1;expect(decodeSave(JSON.stringify(invalid)).ok).toBe(false);
});
