import {enemyStartingBudget} from '../config/enemyNaval';
import {expect,it} from 'vitest';
import {maps,type MapId} from '../config/maps';
import {factionsForPlayer,factions} from '../config/factions';
import {difficultyProfiles,type Difficulty} from '../config/difficulty';
import {createSession,changeOptions,sessionTransition} from './session';
import {createMatch,updateMatch} from './match';
import {encodeSave,decodeSave} from './save';
import {validMatchOptions} from './matchSettings';
import {matchSettingsSummary} from '../presentation/matchSettings';
const initial={scenario:'skirmish' as const,map:'forest' as const,faction:'clans' as const,difficulty:'hard' as const};
it('rejects invalid option patches atomically and normalizes a scenario-only map change',()=>{
 const s=createSession(initial);for(const patch of [{map:'missing'},{faction:'missing'},{difficulty:'missing'},{scenario:'missing'},{scenario:'survival',map:'forest'},{debug:true}] as any[])expect(changeOptions(s,patch)).toBe(s);expect(s.options).toEqual(initial);expect(changeOptions(s,{scenario:'survival'}).options).toEqual({...initial,scenario:'survival',map:'arena'});expect(validMatchOptions({...initial,map:'forest',scenario:'survival'})).toBe(false);expect(()=>createSession({...initial,map:'unknown'} as any)).toThrow('Invalid match settings');
});
it('playing, paused and ended choices stay locked; new menu can isolate a new choice',()=>{
 const s=createSession(initial),playing=sessionTransition(s,'start');for(const phase of ['playing','paused','ended'] as const)expect(changeOptions({...playing,phase},{faction:'crown',map:'river',difficulty:'easy'}).options).toEqual(initial);const menu=sessionTransition(playing,'new-match');expect(changeOptions(menu,{faction:'crown',map:'river',difficulty:'easy'}).options).toEqual({...initial,faction:'crown',map:'river',difficulty:'easy'});expect(s.options).toEqual(initial);
});
for(const map of Object.keys(maps) as MapId[])for(const faction of ['crown','clans'] as const)for(const difficulty of Object.keys(difficultyProfiles) as Difficulty[]){
 it(`${map}/${faction}/${difficulty} applies menu choice to fresh model, saved choices and restart`,()=>{
  const s=sessionTransition(createSession({scenario:'skirmish',map,faction,difficulty}),'start'),o=s.options;
  let m=createMatch(o.scenario,o.difficulty,factionsForPlayer(o.faction!),o.map);expect(m.map.id).toBe(map);expect(m.factions!.player).toBe(faction);expect(m.difficulty).toBe(difficulty);const budget=enemyStartingBudget(difficultyProfiles[difficulty].budget,map==='islands');expect(m.enemyProduction!.wood).toBe(budget.wood);expect(m.enemyProduction!.gold).toBe(budget.gold);expect(m.gathering.node.remaining).toBe(maps[map].wood);const summary=matchSettingsSummary(o);expect(summary).toContain(maps[map].label);expect(summary).toContain(factions[faction].label);expect(summary).toContain(difficultyProfiles[difficulty].label);expect(summary).toContain(`${maps[map].wood} wood / ${maps[map].gold} gold`);
  m=updateMatch(m,1);m.paused=true;const loaded=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(loaded.ok).toBe(true);if(!loaded.ok)return;expect(loaded.match.map.id).toBe(map);expect(loaded.match.factions!.player).toBe(faction);expect(loaded.match.difficulty).toBe(difficulty);const restarted=sessionTransition({...s,phase:'paused'},'restart'),fresh=createMatch(restarted.options.scenario,restarted.options.difficulty,factionsForPlayer(restarted.options.faction!),restarted.options.map);expect(fresh.map.id).toBe(map);expect(fresh.factions!.player).toBe(faction);expect(fresh.gathering.node.remaining).toBe(maps[map].wood);expect(fresh.waves.elapsedSeconds).toBe(0);expect(fresh.production.queue).toBeUndefined();
 });
}
