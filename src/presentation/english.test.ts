import {it,expect} from 'vitest';
import {readSave,decodeSave,encodeSave} from '../gameplay/save';
import {createMatch} from '../gameplay/match';
import {factions} from '../config/factions';
import {scenarioConfig} from '../config/scenarios';
import {maps} from '../config/maps';
import {matchLabels} from './hud';
import {commandGuide} from './hotkeys';
it('separates save error categories from player-facing language without modifying storage',()=>{
 const storage={getItem:()=>null,setItem:()=>{throw Error('must not write');}};
 expect(readSave(storage)).toMatchObject({ok:false,code:'missing',error:'No local save exists'});
 expect(readSave({...storage,getItem:()=>{throw Error('access');}})).toMatchObject({ok:false,code:'storage'});
 expect(decodeSave('{')).toMatchObject({ok:false,code:'invalid'});
 const m=createMatch('mission-sea','easy',{player:'clans',enemy:'crown'},'islands'),save=encodeSave(m,{camera:{x:0,y:0},building:null});
 expect(decodeSave(save)).toMatchObject({ok:true,match:{scenario:'mission-sea',difficulty:'easy',factions:{player:'clans',enemy:'crown'}}});
 const invalid=JSON.parse(save);invalid.configVersion='future';expect(decodeSave(JSON.stringify(invalid))).toMatchObject({ok:false,code:'version'});
});
it('shows English faction, mission, map, fog-safe HUD and command guidance',()=>{
 expect(factions.crown.label).toBe('Humans · Crown Alliance');expect(factions.clans.label).toBe('Orcs · Iron Clan');expect(scenarioConfig['mission-sea'].label).toBe('Mission 4 – The Crossing');expect(maps.islands.label).toBe('Islands');
 const hud=matchLabels(createMatch('skirmish'));expect(hud.economy).toContain('node: ?');expect(hud.selected).toBe('No unit selected');expect(commandGuide).toContain('Shift-click');expect(commandGuide).toContain('pause/resume');
});
