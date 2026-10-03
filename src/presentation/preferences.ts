import {validateDisplaySettings,defaultDisplaySettings,type DisplaySettings} from './displayPolicy';
import {defaultAudio,type AudioSettings} from './audioPolicy';
import {defaultCameraPreferences,validateCameraPreferences,type CameraPreferences} from './cameraPreferences';
import {isFactionId,type FactionId} from '../config/factions';
import {isGameSpeed,type GameSpeed} from '../config/gameSpeed';
import {difficultyProfiles,type Difficulty} from '../config/difficulty';
export const preferencesKey='warcraft-2-tribute.preferences.v1';
export interface Preferences {display:DisplaySettings;audio:AudioSettings;camera:CameraPreferences;game:{faction:FactionId;difficulty:Difficulty;speed:GameSpeed}}
export type PreferencePatch={display?:Partial<DisplaySettings>;audio?:Partial<AudioSettings>;camera?:Partial<CameraPreferences>;game?:Partial<Preferences['game']>};
const defaults:Preferences={display:{...defaultDisplaySettings},audio:{...defaultAudio},camera:{...defaultCameraPreferences},game:{faction:'crown',difficulty:'normal',speed:1}};
const object=(v:unknown):Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
export function validatePreferences(value:unknown):Preferences{
 const v=object(value),a=object(v.audio),g=object(v.game),audio={...defaultAudio};
 for(const k of ['master','effects','music','voices'] as const){const n=a[k];if(typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1)audio[k]=n;}
 if(typeof a.muted==='boolean')audio.muted=a.muted;
 return {display:validateDisplaySettings(v.display),audio,camera:validateCameraPreferences(v.camera),game:{faction:isFactionId(g.faction)?g.faction:defaults.game.faction,difficulty:typeof g.difficulty==='string'&&Object.hasOwn(difficultyProfiles,g.difficulty)?g.difficulty as Difficulty:defaults.game.difficulty,speed:isGameSpeed(g.speed)?g.speed:defaults.game.speed}};
}
export interface PreferenceStorage {getItem(key:string):string|null;setItem(key:string,value:string):void}
export function createPreferenceStore(storage:()=>PreferenceStorage){
 let state=structuredClone(defaults);
 return {
  get:()=>structuredClone(state),
  load:():void=>{state=structuredClone(defaults);try{const raw=storage().getItem(preferencesKey);if(!raw||raw.length>16384)return;const doc=object(JSON.parse(raw));if(doc.version===1)state=validatePreferences(doc.settings);}catch{/* Defaults stay valid; storage never blocks a session. */}},
  update:(patch:PreferencePatch):boolean=>{state=validatePreferences({display:{...state.display,...patch.display},audio:{...state.audio,...patch.audio},camera:{...state.camera,...patch.camera},game:{...state.game,...patch.game}});try{storage().setItem(preferencesKey,JSON.stringify({version:1,settings:state}));return true;}catch{return false;}},
 };
}
const store=createPreferenceStore(()=>window.localStorage);
export const initializePreferences=()=>store.load();
export const getPreferences=()=>store.get();
export function updatePreferences(patch:PreferencePatch):boolean{
 const saved=store.update(patch),label=typeof document==='undefined'?null:document.getElementById('preferences-status');
 if(label)label.textContent=saved?'Settings saved locally':'Settings apply for this session; local storage is unavailable.';
 return saved;
}
