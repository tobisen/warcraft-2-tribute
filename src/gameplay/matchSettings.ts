import {supportedPlayerCounts,playerColors} from '../config/players';
import {validatePlayerStarts} from './players';
import {isAIProfile} from '../config/aiProfiles';
import {isMapId} from '../config/maps';
import {isGameSpeed} from '../config/gameSpeed';
import {isFactionId,factionsForPlayer,defaultFactions} from '../config/factions';
import {scenarioConfig,scenarioMapAllowed} from '../config/scenarios';
import {difficultyProfiles} from '../config/difficulty';
import type {MatchOptions} from './session';
export function validMatchOptions(value:unknown):value is MatchOptions {
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const o=value as Record<string,unknown>;
 return Object.keys(o).every(k=>['players','aiProfile','scenario','difficulty','map','faction','enemyFaction','speed'].includes(k))&&typeof o.scenario==='string'&&Object.hasOwn(scenarioConfig,o.scenario)&&typeof o.difficulty==='string'&&Object.hasOwn(difficultyProfiles,o.difficulty)&&isMapId(o.map)&&scenarioMapAllowed(o.scenario as keyof typeof scenarioConfig,o.map)&&(o.faction===undefined||isFactionId(o.faction))&&(o.enemyFaction===undefined||isFactionId(o.enemyFaction))&&(o.aiProfile===undefined||isAIProfile(o.aiProfile))&&(o.speed===undefined||isGameSpeed(o.speed))&&(o.players===undefined||validPlayers(o.players,o));
}
export function patchMatchOptions(current:MatchOptions,patch:Partial<MatchOptions>):MatchOptions|null {
 if(!patch||typeof patch!=='object'||Array.isArray(patch)||Object.keys(patch).some(k=>!['players','aiProfile','scenario','difficulty','map','faction','enemyFaction','speed'].includes(k)))return null;
 if(patch.scenario!==undefined&&!Object.hasOwn(scenarioConfig,patch.scenario))return null;
 const next={...current,...patch};if(patch.scenario!==undefined&&patch.scenario!=='skirmish'&&patch.map===undefined)next.map=scenarioConfig[patch.scenario].map;
 if(next.players){
  if(!supportedPlayerCounts(next.map,next.scenario).includes(next.players.length))next.players=undefined;
  else {const factions=factionsForPlayer(next.faction??defaultFactions.player,next.enemyFaction);next.players=next.players.map((p,i)=>({...p,...(i===0?{faction:factions.player}:{}),...(i===1?{faction:factions.enemy,...(patch.aiProfile?{profile:patch.aiProfile}:{})}:{})}));}
 }
 return validMatchOptions(next)?next:null;
}

export function validPlayers(value:unknown,options:Record<string,unknown>):boolean{
 if(!Array.isArray(value)||!isMapId(options.map)||!supportedPlayerCounts(options.map,String(options.scenario)).includes(value.length))return false;
 const ids=['player','enemy','ai-2'];
 return value.every((p,i)=>p&&typeof p==='object'&&Object.keys(p).every(k=>['id','controller','faction','color','profile','teamId'].includes(k))&&p.id===ids[i]&&p.controller===(i===0?'human':'ai')&&isFactionId(p.faction)&&isAIProfile(p.profile)&&p.color===playerColors[i]&&(p.teamId===undefined||Number.isInteger(p.teamId)&&p.teamId>=1&&p.teamId<=3))&&new Set(value.map((p,i)=>p.teamId??i+1)).size>1&&validatePlayerStarts(options.map,value);
}
