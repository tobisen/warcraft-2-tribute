import {describe,it,expect} from 'vitest';
import {matchSettingDetails,mapDescriptions,difficultyDescription} from './matchSettings';
import {maps,type MapId} from '../config/maps';
import {difficultyProfiles,type Difficulty} from '../config/difficulty';
describe('match details',()=>{it('describes every real map and difficulty without changing speed',()=>{for(const map of Object.keys(maps) as MapId[])for(const difficulty of Object.keys(difficultyProfiles) as Difficulty[]){const details=matchSettingDetails({scenario:'skirmish',map,difficulty});expect(details.map).toBe(mapDescriptions[map]);expect(details.difficulty).toBe(difficultyDescription[difficulty]);expect(details.speed).toBe(1);}});it('explains fixed mission maps',()=>{expect(matchSettingDetails({scenario:'mission-sea',map:'islands',difficulty:'easy'}).map).toContain('fixed');});});

it('reuses unchanged summaries and refreshes every displayed setting',async()=>{
 const {matchSettingsSummary}=await import('./matchSettings');
 const options={scenario:'skirmish' as const,map:'highlands' as const,difficulty:'easy' as const};
 const original=matchSettingsSummary(options);expect(matchSettingsSummary({...options})).toBe(original);
 for(const changed of [{...options,map:'arena' as const},{...options,difficulty:'hard' as const},{...options,faction:'elves' as const},{...options,aiProfile:'offensive' as const},{...options,speed:.75 as const},{...options,scenario:'survival' as const}])expect(matchSettingsSummary(changed)).not.toBe(original);
 expect(matchSettingsSummary(options)).toBe(original);
});
