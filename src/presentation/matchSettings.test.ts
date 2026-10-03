import {describe,it,expect} from 'vitest';
import {matchSettingDetails,mapDescriptions,difficultyDescription} from './matchSettings';
import {maps,type MapId} from '../config/maps';
import {difficultyProfiles,type Difficulty} from '../config/difficulty';
describe('match details',()=>{it('describes every real map and difficulty without changing speed',()=>{for(const map of Object.keys(maps) as MapId[])for(const difficulty of Object.keys(difficultyProfiles) as Difficulty[]){const details=matchSettingDetails({scenario:'skirmish',map,difficulty});expect(details.map).toBe(mapDescriptions[map]);expect(details.difficulty).toBe(difficultyDescription[difficulty]);expect(details.speed).toBe(1);}});it('explains fixed mission maps',()=>{expect(matchSettingDetails({scenario:'mission-sea',map:'islands',difficulty:'easy'}).map).toContain('fixed');});});
