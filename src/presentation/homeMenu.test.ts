import {describe,it,expect} from 'vitest';
import {homeScenarios} from './homeMenu';
import {scenarioConfig,playableScenarios} from '../config/scenarios';
describe('home entry points',()=>{it('offers every existing playable scenario exactly once',()=>{const offered=[...homeScenarios.campaign,...homeScenarios.skirmish];expect(new Set(offered).size).toBe(offered.length);expect([...offered].sort()).toEqual([...playableScenarios].sort());});it('campaign keeps the four existing mission objectives and fixed maps',()=>{expect(homeScenarios.campaign.slice(1).map(s=>scenarioConfig[s].victory)).toEqual(['waves','enemy-base','timer','enemy-base']);expect(scenarioConfig[homeScenarios.campaign[4]].map).toBe('islands');});});
