import {isMapId} from '../config/maps';
import {isFactionId} from '../config/factions';
import {scenarioConfig,scenarioMapAllowed} from '../config/scenarios';
import {difficultyProfiles} from '../config/difficulty';
import type {MatchOptions} from './session';
export function validMatchOptions(value:unknown):value is MatchOptions {
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const o=value as Record<string,unknown>;
 return Object.keys(o).every(k=>['scenario','difficulty','map','faction'].includes(k))&&typeof o.scenario==='string'&&Object.hasOwn(scenarioConfig,o.scenario)&&typeof o.difficulty==='string'&&Object.hasOwn(difficultyProfiles,o.difficulty)&&isMapId(o.map)&&scenarioMapAllowed(o.scenario as keyof typeof scenarioConfig,o.map)&&(o.faction===undefined||isFactionId(o.faction));
}
export function patchMatchOptions(current:MatchOptions,patch:Partial<MatchOptions>):MatchOptions|null {
 if(!patch||typeof patch!=='object'||Array.isArray(patch)||Object.keys(patch).some(k=>!['scenario','difficulty','map','faction'].includes(k)))return null;
 if(patch.scenario!==undefined&&!Object.hasOwn(scenarioConfig,patch.scenario))return null;
 const next={...current,...patch};if(patch.scenario!==undefined&&patch.scenario!=='skirmish'&&patch.map===undefined)next.map=scenarioConfig[patch.scenario].map;
 return validMatchOptions(next)?next:null;
}
