import {expect,it} from 'vitest';
import {factionIds,factions,factionsForPlayer} from '../config/factions';
import {createSession,changeOptions,sessionTransition} from './session';
import {createMatch} from './match';
import {encodeSave,decodeSave} from './save';
import {validatePreferences,createPreferenceStore} from '../presentation/preferences';

it('all twenty-five player/opponent identities roundtrip independently and initialize a fresh match',()=>{
 for(const player of factionIds)for(const enemy of factionIds){
  const pair=factionsForPlayer(player,enemy),m=createMatch('skirmish','normal',pair);
  expect(m.factions).toEqual({player,enemy});expect(m.gathering.units[0].hp).toBe(factions[player].units.worker.hp);
  const loaded=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(loaded.ok,`${player}/${enemy}`).toBe(true);if(!loaded.ok)continue;
  expect(loaded.match.factions).toEqual(pair);expect(createMatch('skirmish','normal',loaded.match.factions).factions).toEqual(pair);
 }
 expect(factionsForPlayer('crown')).toEqual({player:'crown',enemy:'clans'});expect(factionsForPlayer('goblins')).toEqual({player:'goblins',enemy:'crown'});
});
it('opponent changes belong to menu settings and reject invalid identities; active matches keep their choice',()=>{
 const original=createSession({scenario:'skirmish',difficulty:'normal',map:'arena',faction:'elves'});
 const chosen=changeOptions(original,{enemyFaction:'dwarves'});expect(chosen.options.enemyFaction).toBe('dwarves');expect(original.options.enemyFaction).toBeUndefined();
 const playing=sessionTransition(chosen,'start');expect(changeOptions(playing,{enemyFaction:'goblins'})).toBe(playing);
 expect(changeOptions(chosen,{enemyFaction:'missing' as never})).toBe(chosen);
 expect(changeOptions(chosen,{enemyFaction:undefined}).options.enemyFaction).toBeUndefined();
 expect(sessionTransition(playing,'restart').options.enemyFaction).toBe('dwarves');
});
it('explicit opponent preferences persist separately from match Save and automatic choice clears them',()=>{
 const memory=new Map<string,string>(),host={getItem:(key:string)=>memory.get(key)??null,setItem:(key:string,value:string)=>memory.set(key,value)};
 const a=createPreferenceStore(()=>host);a.load();a.update({game:{faction:'goblins',enemyFaction:'elves'}});const b=createPreferenceStore(()=>host);b.load();expect(b.get().game).toMatchObject({faction:'goblins',enemyFaction:'elves'});
 b.update({game:{enemyFaction:undefined}});expect(b.get().game.enemyFaction).toBeUndefined();expect(validatePreferences({game:{enemyFaction:'missing'}}).game.enemyFaction).toBeUndefined();
});
