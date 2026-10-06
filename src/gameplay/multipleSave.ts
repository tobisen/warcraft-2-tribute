import {teamOutcome} from './teamResults';
import {decodeSave,encodeSingleSave,type SavedView,type LoadResult,type SaveContext} from './save';
import {validPlayers} from './matchSettings';
import {playerStart,canHarm} from './players';
import {refreshTeamVision,shareTeamVision,projectMultiplePlayers,globalEntityId,type MultiplePlayers} from './multiplePlayers';
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
  fog:state.fog?{...state.fog,...(state.fog.forest?{forest:{player:m.fog?.forest?.player??{},enemy:bot.state.fog?.forest?.enemy??{}}}:{}),teams:{player:m.fog!.teams.player,enemy:bot.vision}}:undefined,
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
 const doc=raw as Record<string,unknown>;if(doc?.configVersion!==saveConfig.configVersion&&doc?.configVersion!=='tribute-config-53'&&doc?.configVersion!=='tribute-config-54'&&doc?.configVersion!=='tribute-config-55'&&doc?.configVersion!=='tribute-config-56'&&Array.isArray(doc?.multiplePlayers)&&doc.multiplePlayers.some(p=>(p as Record<string,unknown>).difficulty!==undefined))throw Error('Legacy player difficulty');
 if(doc?.configVersion==='tribute-config-53'||doc?.configVersion==='tribute-config-54'||doc?.configVersion==='tribute-config-55'||doc?.configVersion==='tribute-config-56')doc.configVersion=saveConfig.configVersion;
 const migrateTeams=doc?.configVersion==='tribute-config-49';
 if(doc?.configVersion==='tribute-config-48'&&Array.isArray(doc.multiplePlayers)){doc.multiplePlayers=doc.multiplePlayers.map((p,i)=>({...p as object,teamId:i+1}));doc.configVersion=saveConfig.configVersion;}
 if(doc?.configVersion==='tribute-config-51'||doc?.configVersion==='tribute-config-52')doc.configVersion=saveConfig.configVersion;
 if(doc?.configVersion==='tribute-config-50')doc.configVersion=saveConfig.configVersion;
 if(doc?.configVersion==='tribute-config-49')doc.configVersion=saveConfig.configVersion;
 if(!doc||Object.keys(doc).some(k=>!['schemaVersion','configVersion','map','multiplePlayers','kills','human','ai'].includes(k))||doc.schemaVersion!==saveConfig.schemaVersion||doc.configVersion!==saveConfig.configVersion||typeof doc.human!=='string'||!Array.isArray(doc.ai)||doc.ai.length!==2)throw Error('Invalid multiplayer document');
 const humanRaw=JSON.parse(doc.human) as {state:MatchState};
 if(!validPlayers(doc.multiplePlayers,{scenario:humanRaw.state.scenario,map:doc.map})||(doc.multiplePlayers as unknown[]).length!==3)throw Error('Invalid player roster');
 const kills=doc.kills as Record<PlayerId,number>;if(!kills||Object.keys(kills).sort().join(',')!=='ai-2,enemy,player'||Object.values(kills).some(n=>!Number.isInteger(n)||n<0||n>100000))throw Error('Invalid player kill ledger');
 const roster=doc.multiplePlayers as MultiplePlayers['roster'];
 if(roster.some(p=>p.teamId===undefined))throw Error('Missing team identity');
 const ai=doc.ai.map((value,index)=>{
 const part=value as {id:PlayerId;document:string};
 if(!part||Object.keys(part).some(k=>!['id','document'].includes(k))||part.id!==roster[index+1].id||typeof part.document!=='string')throw Error('Invalid AI identity');
 const parsed=JSON.parse(part.document) as {state:MatchState};
 if(parsed.state.difficulty!==(roster[index+1].difficulty??humanRaw.state.difficulty))throw Error('AI difficulty mismatch');
 if(parsed.state.factions?.enemy!==roster[index+1].faction||parsed.state.aiProfile!==undefined&&parsed.state.aiProfile!==roster[index+1].profile)throw Error('AI faction/profile mismatch');
 return {id:part.id as 'enemy'|'ai-2',state:parsed.state,vision:parsed.state.fog!.teams.enemy};
 });
 const shell:MatchState={...humanRaw.state,multiplePlayers:{roster,ai,kills}};
 if(shell.factions?.player!==roster[0].faction||shell.factions.enemy!==roster[1].faction)throw Error('Human faction mismatch');
 if(migrateTeams){
  const legacyOutcome=shell.combat.baseHP<=0?'defeat':ai.every(bot=>!bot.state.combat.enemies.some(e=>e.kind==='base'&&e.hp>0))?'victory':'playing';
  if(humanRaw.state.outcome!==legacyOutcome||ai.some(bot=>bot.state.outcome!==legacyOutcome))throw Error('Invalid legacy multiplayer outcome');
  const outcome=teamOutcome(shell);humanRaw.state.outcome=outcome;doc.human=JSON.stringify(humanRaw);
  for(const part of doc.ai as {document:string}[]){const parsed=JSON.parse(part.document);parsed.state.outcome=outcome;part.document=JSON.stringify(parsed);}
 }
 const human=decodeSave(doc.human as string,contextFor(shell,'player'));if(!human.ok)return human;
 const validated=ai.map((bot,index)=>{
 const loaded=decodeSave((doc.ai as {document:string}[])[index].document,contextFor(shell,bot.id));if(!loaded.ok)throw Error(loaded.error);
 if(loaded.match.waves.elapsedSeconds!==human.match.waves.elapsedSeconds||loaded.match.map.id!==human.match.map.id||loaded.match.outcome!==human.match.outcome)throw Error('Unsynchronised AI state');
 return {...bot,state:loaded.match,vision:loaded.match.fog!.teams.enemy};
 });
 const targetOwner=(id:string):PlayerId=>id.startsWith('ai-2:')?'ai-2':id.startsWith('enemy-')?'enemy':'player';
 const checkAttack=(actor:PlayerId,id:string)=>{if(!canHarm(actor,targetOwner(id),roster))throw Error('Allied attack reference');};
 for(const unit of [...human.match.gathering.units,...(human.match.navy?.ships??[])]){if(unit.order.kind==='attack')checkAttack('player',unit.order.enemyId);for(const order of unit.orderQueue??[])if(order.kind==='attack')checkAttack('player',order.enemyId);}
 for(const shot of human.match.combat.projectiles??[])if(!shot.owner)checkAttack('player',shot.targetId);
 for(const bot of validated){if(bot.state.enemyAI?.threatId)checkAttack(bot.id,bot.state.enemyAI.threatId);for(const entity of bot.state.combat.enemies)if(entity.order?.kind==='defend')checkAttack(bot.id,entity.order.targetId);for(const shot of bot.state.combat.projectiles??[])checkAttack(shot.owner==='enemy'?bot.id:'player',shot.targetId);}
 const expected=teamOutcome({...human.match,multiplePlayers:{roster,ai:validated,kills}});if(human.match.outcome!==expected)throw Error('Invalid multiplayer outcome');
 const match=projectMultiplePlayers({...human.match,multiplePlayers:{roster,ai:validated,kills}});
 return {...human,match:migrateTeams?refreshTeamVision(match):shareTeamVision(match)};
 }catch(e){return {ok:false,code:'invalid',error:e instanceof Error?e.message:'Invalid multiplayer save'};}
}
