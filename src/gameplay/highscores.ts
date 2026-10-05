import {campaignPlans} from '../config/campaignPhases';
import {validPlayers} from './matchSettings';
import type {PlayerDefinition} from '../config/players';
import {isAIProfile,type AIProfileId} from '../config/aiProfiles';
import {campaignMission} from '../config/campaign';
import {isMapId} from '../config/maps';
import {isFactionId} from '../config/factions';
import {difficultyProfiles} from '../config/difficulty';
import {isGameSpeed} from '../config/gameSpeed';
import {scenarioConfig} from '../config/scenarios';
import {saveConfig} from '../config/save';
import {matchStats,sumStats,type MatchStats} from './matchStats';
import type {MatchState} from './match';
export const highscoreKey='warcraft-2-tribute.highscores.v1';
export const scoreModel=1;
export const validMatchId=(v:unknown):v is string=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(v);
export interface Highscore {players?:PlayerDefinition[];aiProfile?:AIProfileId;id:string;model:1;config:string;kind:'campaign'|'skirmish';goal:string;map:string;difficulty:string;speed:number;player:string;enemy:string;outcome:'victory'|'defeat';seconds:number;score:number;stats:MatchStats}
export const scoreFor=(outcome:'victory'|'defeat',seconds:number)=>outcome==='victory'?10000+Math.max(0,3600-Math.floor(Math.max(0,seconds))):0;
export function resultScore(m:MatchState):Highscore|null{
 const mission=campaignMission(m.campaignMission);
 if(!validMatchId(m.matchId)||m.outcome==='playing'||!m.factions||(!mission&&m.scenario!=='skirmish')||mission&&mission.scenario!==m.scenario)return null;
 const stats=matchStats(m);
 return {...(m.multiplePlayers?{players:structuredClone(m.multiplePlayers.roster)}:{}),...(m.aiProfile?{aiProfile:m.aiProfile}:{}),id:m.matchId,model:1,config:saveConfig.configVersion,kind:mission?'campaign':'skirmish',goal:mission?.id??m.map.id!,map:m.map.id!,difficulty:m.difficulty!,speed:m.speed??1,player:m.factions.player,enemy:m.factions.enemy,outcome:m.outcome,seconds:stats.seconds,score:scoreFor(m.outcome,stats.seconds),stats};
}
export const scorePartition=(s:Highscore)=>JSON.stringify([s.kind,s.goal,s.map,s.difficulty,s.speed,s.player,s.enemy,s.config,s.model,...(s.players?[s.players.map(p=>[p.id,p.teamId,p.faction,p.profile])]:[]),...(s.aiProfile&&s.aiProfile!=='balanced'?[s.aiProfile]:[])]);
const finite=(v:unknown)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=1e12;
function validStats(value:unknown):value is MatchStats{
 if(!value||typeof value!=='object')return false;const s=value as MatchStats;
 if(Object.keys(s).filter(k=>k!=='players'&&k!=='teams').sort().join()!=='enemy,player,seconds'||!finite(s.seconds))return false;
 if(s.players&&(Object.keys(s.players).sort().join()!=='ai-2,enemy,player'||!Object.values(s.players).every(t=>validStats({seconds:s.seconds,player:t,enemy:t}))))return false;
 if(s.teams&&(Object.keys(s.teams).some(k=>!['1','2','3'].includes(k))||!Object.values(s.teams).every(t=>validStats({seconds:s.seconds,player:t,enemy:t}))))return false;
 for(const t of [s.player,s.enemy]){
  if(!t||typeof t!=='object'||Object.keys(t).sort().join()!=='added,built,destroyed,gold,killed,lost,removed,wood')return false;
  for(const k of ['added','built','destroyed','killed','lost','removed'] as const)if(!Number.isSafeInteger(t[k])||t[k]<0||t[k]>1e6)return false;
  for(const r of [t.wood,t.gold])if(!r||typeof r!=='object'||Object.keys(r).sort().join()!=='delivered,gathered,spent'||![r.delivered,r.gathered,r.spent].every(finite))return false;
 }
 return true;
}
export function validHighscore(value:unknown):value is Highscore{
 if(!value||typeof value!=='object'||Array.isArray(value))return false;const s=value as Highscore;
 if((s.aiProfile!==undefined&&!isAIProfile(s.aiProfile))||(s.players!==undefined&&!validPlayers(s.players,{scenario:'skirmish',map:s.map}))||Object.keys(s).filter(k=>k!=='aiProfile'&&k!=='players').sort().join()!=='config,difficulty,enemy,goal,id,kind,map,model,outcome,player,score,seconds,speed,stats')return false;
 if(!validStats(s.stats))return false;
 if(s.players){if(!s.stats?.players||!s.stats.teams)return false;const expected:Record<number,import('./matchStats').TeamStats>={};for(const p of s.players){const stat=s.stats.players[p.id];if(!stat)return false;const team=p.teamId??s.players.indexOf(p)+1;expected[team]=expected[team]?sumStats(expected[team],stat):stat;}if(Object.keys(s.stats.teams).sort().join()!==Object.keys(expected).sort().join()||Object.entries(expected).some(([id,stat])=>JSON.stringify(s.stats.teams![Number(id)])!==JSON.stringify(stat)))return false;}
 const mission=campaignMission(s.goal);
 return validMatchId(s.id)&&s.model===1&&typeof s.config==='string'&&/^tribute-config-[1-9][0-9]{0,3}$/.test(s.config)&&isMapId(s.map)&&Object.hasOwn(difficultyProfiles,s.difficulty)&&isGameSpeed(s.speed)&&isFactionId(s.player)&&isFactionId(s.enemy)&&(s.outcome==='victory'||s.outcome==='defeat')&&finite(s.seconds)&&s.score===scoreFor(s.outcome,s.seconds)&&validStats(s.stats)&&s.stats.seconds===s.seconds&&(s.kind==='campaign'?!!mission&&(s.map===scenarioConfig[mission.scenario].map||Number(s.config.slice('tribute-config-'.length))>=51&&s.map===campaignPlans[mission.id]?.map):s.kind==='skirmish'&&s.goal===s.map);
}
export function rankedScores(entries:readonly Highscore[],partition?:string):Highscore[]{return entries.filter(s=>!partition||scorePartition(s)===partition).sort((a,b)=>b.score-a.score||a.seconds-b.seconds||a.id.localeCompare(b.id));}
interface Storage {getItem(key:string):string|null;setItem(key:string,value:string):void}
export function createHighscoreStore(storage:()=>Storage){
 let entries:Highscore[]=[],error:string|null=null;
 return {
  load(){try{const raw=storage().getItem(highscoreKey);if(raw){const v=JSON.parse(raw);if(!v||Object.keys(v).sort().join()!=='entries,version'||v.version!==1||!Array.isArray(v.entries)||v.entries.length>5000||!v.entries.every(validHighscore)||new Set(v.entries.map((s:Highscore)=>s.id)).size!==v.entries.length)throw Error('invalid');entries=v.entries;}else entries=[];error=null;}catch{entries=[];error='Highscores could not be read. New results are available for this session.';}return this.get();},
  get(){return structuredClone(entries);},signature(){return `${entries.length}:${error??''}`;},error(){return error;},
  record(m:MatchState){const s=resultScore(m);if(!s||!validHighscore(s)||entries.some(e=>e.id===s.id))return;
   if(entries.length>=5000){error='Highscore storage is full (5000 results). This result was not registered.';return;}
   entries=[...entries,s];try{storage().setItem(highscoreKey,JSON.stringify({version:1,entries}));error=null;}catch{error='Highscores could not be stored. This result is available for this session only.';}
  },
 };
}
