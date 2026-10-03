import {expect,it} from 'vitest';
import {createMatch,updateMatch} from './match';
import {factionsForPlayer} from '../config/factions';
import {changeOptions,createSession} from './session';
import {decodeSave,encodeSave} from './save';
import {visibleMinimapData} from '../presentation/minimap';
import {entityVisible} from './visibility';
const view={camera:{x:0,y:0},building:null};
it('sea mission fixes its map, keeps choices and starts with finite configured funds',()=>{
 const s=changeOptions(createSession({scenario:'skirmish',difficulty:'hard',map:'forest',faction:'clans'}),{scenario:'mission-sea'});expect(s.options).toEqual({scenario:'mission-sea',difficulty:'hard',map:'islands',faction:'clans'});expect(changeOptions(s,{map:'arena'})).toBe(s);const m=createMatch('mission-sea','hard',factionsForPlayer('clans'));expect(m.map.id).toBe('islands');expect(m.gathering.wood).toBe(20);expect(m.gathering.goldBalance).toBe(10);expect(m.enemyNaval).toBeTruthy();const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok).toBe(true);if(loaded.ok)expect(loaded.match.scenario).toBe('mission-sea');const old=JSON.parse(encodeSave(m,view));old.configVersion='tribute-config-15';delete old.state.statLedger;expect(decodeSave(JSON.stringify(old)).ok).toBe(false);const legacy=JSON.parse(encodeSave(createMatch(),view));legacy.configVersion='tribute-config-15';delete legacy.state.statLedger;expect(decodeSave(JSON.stringify(legacy)).ok).toBe(true);
});
it('sea objective never wins early, and simultaneous base deaths give defeat then freeze',()=>{
 const m=createMatch('mission-sea');expect(updateMatch(m,0).outcome).toBe('playing');m.combat.enemies.find(e=>e.kind==='base')!.hp=0;expect(updateMatch(structuredClone(m),0).outcome).toBe('victory');m.combat.baseHP=0;const end=updateMatch(m,0);expect(end.outcome).toBe('defeat');expect(updateMatch(end,100)).toBe(end);
});
it('mid-enemy-crossing save resumes the same paid landing/result without revealing hidden fleet or cargo',()=>{
 let m=createMatch('mission-sea','normal');for(let i=0;i<1500&&m.enemyNaval!.phase!=='sailing';i++)m=updateMatch(m,.2);expect(m.enemyNaval!.passengers).toHaveLength(2);const ids=m.enemyNaval!.passengers.map(e=>e.id);const json=encodeSave(m,view),loaded=decodeSave(json);expect(loaded.ok).toBe(true);if(!loaded.ok)throw Error(loaded.error);let resumed=loaded.match;const before=visibleMinimapData(m),after=visibleMinimapData(resumed);expect(after).toEqual(before);for(const id of ids)expect(after.markers.some(x=>x.id===id)).toBe(false);const ship=m.combat.enemies.find(e=>e.kind==='ship')!;expect(entityVisible(m.fog!,'player',ship)).toBe(false);expect(after.markers.some(x=>x.id===ship.id)).toBe(false);
 for(let i=0;i<500&&m.outcome==='playing';i++){m=updateMatch(m,.2);resumed=updateMatch(resumed,.2);}expect(resumed.outcome).toBe('defeat');expect(resumed.combat.baseHP).toBe(m.combat.baseHP);expect(resumed.enemyNaval!.phase).toBe(m.enemyNaval!.phase);expect(resumed.enemyProduction!.spent).toEqual(m.enemyProduction!.spent);expect(resumed.waves.elapsedSeconds).toBeCloseTo(m.waves.elapsedSeconds,0);
},30000);
