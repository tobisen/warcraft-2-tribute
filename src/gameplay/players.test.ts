import {describe,it,expect} from 'vitest';
import {matchPlayers,ownerOf,canControl,canHarm,canSupport,validatePlayerStarts} from './players';
import {supportedPlayerCounts} from '../config/players';
describe('stable player ownership and authored starts',()=>{
 it('keeps player color independent of faction and AI state independent of difficulty',()=>{
 const p=matchPlayers({player:'elves',enemy:'elves'},'economic',3);
 expect(new Set(p.map(p=>p.id)).size).toBe(3);expect(new Set(p.map(p=>p.color)).size).toBe(3);
 expect(p.every(p=>p.faction==='elves'&&p.profile==='economic')).toBe(true);
 });
 it('uses explicit owner over legacy presentation side',()=>{
 expect(ownerOf({owner:'enemy',playerId:'ai-2'})).toBe('ai-2');
 expect(canHarm('enemy','ai-2')).toBe(true);expect(canControl('player','ai-2')).toBe(false);
 expect(canSupport('enemy','ai-2')).toBe(false);expect(canSupport('ai-2','ai-2')).toBe(true);
 });
 it('offers only authored physically valid extra starts in skirmish',()=>{
 const p=matchPlayers(undefined,undefined,3);
 for(const map of ['plains96','plains128'] as const){expect(supportedPlayerCounts(map,'skirmish')).toEqual([2,3]);expect(validatePlayerStarts(map,p)).toBe(true);}
 expect(supportedPlayerCounts('frontier','skirmish')).toEqual([2]);
 expect(supportedPlayerCounts('plains96','tutorial')).toEqual([2]);
 expect(validatePlayerStarts('frontier',p)).toBe(false);
 });
});
