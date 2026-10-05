import {decodeSave,encodeSingleSave,type SavedView,type LoadResult,type SaveContext} from './save';
import {validPlayers} from './matchSettings';
import {playerStart} from './players';
import {projectMultiplePlayers,globalEntityId,type MultiplePlayers} from './multiplePlayers';
import type {MatchState} from './match';
import type {Footprint} from './placement';
import {saveConfig} from '../config/save';
import type {PlayerId} from '../config/players';

function contextFor(m:MatchState,id:PlayerId):SaveContext{
 const multi=m.multiplePlayers!,start=playerStart(m.map.id??'arena',id==='player'?'enemy':id);
 const others=multi.ai.filter(bot=>bot.id!==(id==='player'?'enemy':id));
 return {multiplayer:true,enemyBase:{x:start.x-48,y:start.y-48,width:96,height:96},
  extraObstacles:others.flatMap(bot=>bot.state.combat.enemies.flatMap(e=>e.footprint?[e.footprint]:[])),
  externalTargets:new Set(others.flatMap(bot=>bot.state.combat.enemies.map(e=>globalEntityId(bot.id,e.id)))),
  knownBases:multi.roster.map(p=>playerStart(m.map.id??'arena',p.id))};
}
function singleView(m:MatchState,id:PlayerId):MatchState{
 const bot=m.multiplePlayers!.ai.find(bot=>bot.id===(id==='player'?'enemy':id))!;
 const state=id==='player'?m:bot.state;
 return {...state,multiplePlayers:undefined,aiContext:undefined,map:m.map,waves:m.waves,paused:m.paused,outcome:m.outcome,
  gathering:m.gathering,placement:m.placement,production:m.production,soldierProduction:m.soldierProduction,navy:m.navy,research:m.research,controlGroups:m.controlGroups,wildlife:m.wildlife,
  combat:{...state.combat,projectiles:id==='player'?[...(m.combat.projectiles??[]).filter(p=>!p.owner),...(bot.state.combat.projectiles??[])]:bot.state.combat.projectiles,baseHP:m.combat.baseHP,enemies:bot.state.combat.enemies},
  factions:{player:m.factions!.player,enemy:bot.state.factions!.enemy}};
}
export function encodeMultipleSave(m:MatchState,view:SavedView):string{
 const multi=m.multiplePlayers!;
 const json=JSON.stringify({schemaVersion:saveConfig.schemaVersion,configVersion:saveConfig.configVersion,map:m.map.id,multiplePlayers:multi.roster,kills:multi.kills,
  human:encodeSingleSave(singleView(m,'player'),view,contextFor(m,'player')),
  ai:multi.ai.map(bot=>({id:bot.id,document:encodeSingleSave(singleView(m,bot.id),view,contextFor(m,bot.id))}))});
 if(new TextEncoder().encode(json).byteLength>saveConfig.maxBytes)throw Error('Save too large');
 const result=decodeMultipleSave(JSON.parse(json));if(!result.ok)throw Error(result.error);
 return json;
}
/** Validate every scoped document with the existing strict economy/tech/ID checks. */
export function decodeMultipleSave(raw:unknown):LoadResult{
 try{
 const doc=raw as Record<string,unknown>;
 if(!doc||Object.keys(doc).some(k=>!['schemaVersion','configVersion','map','multiplePlayers','kills','human','ai'].includes(k))||doc.schemaVersion!==saveConfig.schemaVersion||doc.configVersion!==saveConfig.configVersion||typeof doc.human!=='string'||!Array.isArray(doc.ai)||doc.ai.length!==2)throw Error('Invalid multiplayer document');
 const humanRaw=JSON.parse(doc.human) as {state:MatchState};
 if(!validPlayers(doc.multiplePlayers,{scenario:humanRaw.state.scenario,map:doc.map})||(doc.multiplePlayers as unknown[]).length!==3)throw Error('Invalid player roster');
 const kills=doc.kills as Record<PlayerId,number>;if(!kills||Object.keys(kills).sort().join(',')!=='ai-2,enemy,player'||Object.values(kills).some(n=>!Number.isInteger(n)||n<0||n>100000))throw Error('Invalid player kill ledger');
 const roster=doc.multiplePlayers as MultiplePlayers['roster'];
 const ai=doc.ai.map((value,index)=>{
 const part=value as {id:PlayerId;document:string};
 if(!part||Object.keys(part).some(k=>!['id','document'].includes(k))||part.id!==roster[index+1].id||typeof part.document!=='string')throw Error('Invalid AI identity');
 const parsed=JSON.parse(part.document) as {state:MatchState};
 if(parsed.state.factions?.enemy!==roster[index+1].faction||parsed.state.aiProfile!==undefined&&parsed.state.aiProfile!==roster[index+1].profile)throw Error('AI faction/profile mismatch');
 return {id:part.id as 'enemy'|'ai-2',state:parsed.state,vision:parsed.state.fog!.teams.enemy};
 });
 const shell:MatchState={...humanRaw.state,multiplePlayers:{roster,ai,kills}};
 if(shell.factions?.player!==roster[0].faction||shell.factions.enemy!==roster[1].faction)throw Error('Human faction mismatch');
 const human=decodeSave(doc.human,contextFor(shell,'player'));if(!human.ok)return human;
 const validated=ai.map((bot,index)=>{
 const loaded=decodeSave((doc.ai as {document:string}[])[index].document,contextFor(shell,bot.id));if(!loaded.ok)throw Error(loaded.error);
 if(loaded.match.waves.elapsedSeconds!==human.match.waves.elapsedSeconds||loaded.match.map.id!==human.match.map.id||loaded.match.outcome!==human.match.outcome)throw Error('Unsynchronised AI state');
 return {...bot,state:loaded.match,vision:loaded.match.fog!.teams.enemy};
 });
 const expected=human.match.combat.baseHP<=0?'defeat':validated.every(bot=>!bot.state.combat.enemies.some(e=>e.kind==='base'&&e.hp>0))?'victory':'playing';if(human.match.outcome!==expected)throw Error('Invalid multiplayer outcome');
 return {...human,match:projectMultiplePlayers({...human.match,multiplePlayers:{roster,ai:validated,kills}})};
 }catch(e){return {ok:false,code:'invalid',error:e instanceof Error?e.message:'Invalid multiplayer save'};}
}
