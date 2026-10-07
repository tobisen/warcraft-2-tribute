import {createClassicMatch} from './testHelpers/classicMatch';
import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {enemyAttackDestination} from './enemyKnowledge';
import {it,expect} from 'vitest';
import {createMatch,updateMatch} from './match';
import {matchPlayers} from './players';
import {projectMultiplePlayers} from './multiplePlayers';
import {playerEliminated,isSpectating} from './teamResults';
import {encodeSave,decodeSave} from './save';
import {issueOrder} from './commandOrders';
import {matchStats} from './matchStats';
import {resultScore,validHighscore,scorePartition,createHighscoreStore} from './highscores';
const match=(classic=false)=>{const r=matchPlayers(undefined,undefined,3);r[2].teamId=1;return (classic?createClassicMatch:createMatch)('skirmish','normal',undefined,'plains96',1,'balanced',r);};
function eliminate(m:ReturnType<typeof match>,id:'player'|'enemy'|'ai-2'){
 if(id==='player')m.combat.baseHP=0;else m.multiplePlayers!.ai.find(b=>b.id===id)!.state.combat.enemies.find(e=>e.kind==='base')!.hp=0;
 return projectMultiplePlayers(m);
}
function roundtrip(m:ReturnType<typeof match>){const result=decodeSave(encodeSave(m,{camera:{x:100,y:50},building:null}));expect(result.ok,result.ok?'':result.error).toBe(true);if(!result.ok)throw Error(result.error);return result.match;}
it('an eliminated allied AI stops its economy and decisions while the human continues',()=>{
 let m=updateMatch(eliminate(match(),'ai-2'),.25);expect(m.outcome).toBe('playing');expect(isSpectating(m)).toBe(false);const before=structuredClone(m.multiplePlayers!.ai[1].state);m=updateMatch(m,2);
 expect(m.multiplePlayers!.ai[1].state.enemyProduction).toEqual(before.enemyProduction);expect(m.multiplePlayers!.ai[1].state.enemyAI).toEqual(before.enemyAI);expect(m.multiplePlayers!.ai[1].state.combat.enemies).toEqual(before.combat.enemies);expect(m.waves.elapsedSeconds).toBe(2.25);roundtrip(m);
});
// Three-player economy, spectator fog and Save roundtrip exceed the unit
// deadline on shared CI runners; keep simulation and assertions unchanged.
it('human elimination offers spectator vision while the allied AI keeps producing and orders are rejected',()=>{
 let m=updateMatch(match(),1);m.gathering.units[0].selected=true;m=updateMatch(eliminate(m,'player'),.25);expect(m.outcome).toBe('playing');expect(isSpectating(m)).toBe(true);expect(issueOrder(m,{kind:'move',destination:{x:600,y:500}})).toBe(m);
 const own=structuredClone(m.gathering.units),bank=m.gathering.wood,before=m.multiplePlayers!.ai[1].state.enemyProduction!.spent!;
 m=updateMatch(m,10);expect(m.gathering.units).toEqual(own);expect(m.gathering.wood).toBe(bank);expect(m.multiplePlayers!.ai[1].state.enemyProduction!.spent!.wood).toBeGreaterThan(before.wood);expect(m.fog!.teams.player.visible).toEqual(m.multiplePlayers!.ai[1].vision.visible);
 const tile=Math.floor(450/m.fog!.tileSize)*m.fog!.columns+Math.floor(400/m.fog!.tileSize);expect(m.fog!.teams.player.visible[tile]).toBe(false);expect(m.fog!.teams.player.explored[tile]).toBe(true);
 const loaded=roundtrip({...m,paused:true});expect(isSpectating(loaded)).toBe(true);expect(loaded.paused).toBe(true);expect(updateMatch(loaded,2)).toBe(loaded);expect(updateMatch({...loaded,paused:false},.25).outcome).toBe('playing');
},30000);
it('victory requires elimination of every hostile team member and final simulation freezes',()=>{
 const r=matchPlayers(undefined,undefined,3);r[2].teamId=2;let m=createMatch('skirmish','normal',undefined,'plains96',1,'balanced',r);
 m=updateMatch(eliminate(m,'enemy'),.25);expect(m.outcome).toBe('playing');m=updateMatch(eliminate(m,'ai-2'),.25);expect(m.outcome).toBe('victory');expect(updateMatch(m,5)).toBe(m);roundtrip(m);
});
it('defeat occurs only when the entire human team is eliminated',()=>{
 let m=updateMatch(eliminate(match(),'player'),.25);expect(m.outcome).toBe('playing');m=updateMatch(eliminate(m,'ai-2'),.25);expect(m.outcome).toBe('defeat');expect(playerEliminated(m,'player')).toBe(true);expect(updateMatch(m,5)).toBe(m);roundtrip(m);
});
it('team victory can occur after the human is eliminated, with no artificial surviving-unit losses',()=>{
 let m=updateMatch(eliminate(match(),'player'),.25);const own=matchStats(m).player;m=updateMatch(eliminate(m,'enemy'),.25);expect(m.outcome).toBe('victory');expect(matchStats(m).player.lost).toBe(own.lost);expect(matchStats(m).player.removed).toBe(0);roundtrip(m);
});
it('team statistics and highscores retain ownership and record each match only once across reloads',()=>{
 let m=match();m.multiplePlayers!.kills={player:2,enemy:1,'ai-2':3};m=updateMatch(eliminate(m,'enemy'),.25);m.matchId='00000000-0000-4000-8000-000000000001';
 const stats=matchStats(m);expect(stats.teams![1].killed).toBe(5);expect(stats.teams![2].killed).toBe(1);const score=resultScore(m)!;expect(validHighscore(score)).toBe(true);
 const other=structuredClone(score);other.players![2].teamId=3;expect(scorePartition(other)).not.toBe(scorePartition(score));
 const memory=new Map<string,string>();let writes=0;const storage={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{writes++;memory.set(k,v);}};
 const store=createHighscoreStore(()=>storage);store.load();store.record(m);store.record(m);expect(writes).toBe(1);const reload=createHighscoreStore(()=>storage);reload.load();reload.record(roundtrip(m));expect(writes).toBe(1);expect(reload.get()[0].stats.teams).toEqual(stats.teams);
});
it('repeated restarts reconstruct all active players, independent banks and clean team state',()=>{
 const ended=updateMatch(eliminate(eliminate(match(),'player'),'ai-2'),.25);for(let n=0;n<3;n++){const fresh=match();expect(fresh.outcome).toBe('playing');expect(isSpectating(fresh)).toBe(false);expect(fresh.multiplePlayers!.roster.every(p=>!playerEliminated(fresh,p.id))).toBe(true);expect(fresh.multiplePlayers!.kills).toEqual({player:0,enemy:0,'ai-2':0});expect(fresh.waves.elapsedSeconds).toBe(0);expect(fresh.multiplePlayers!.ai[1].state).not.toBe(ended.multiplePlayers!.ai[1].state);roundtrip(fresh);}
});
it('campaign objectives retain their original independent defeat rules',()=>{const m=createMatch('tutorial');m.combat.baseHP=0;expect(updateMatch(m,.25).outcome).toBe('defeat');});

it('rejects a forged terminal outcome before the human team is eliminated',()=>{
 const m=updateMatch(eliminate(match(),'player'),.25),raw=JSON.parse(encodeSave(m,{camera:{x:0,y:0},building:null}));
 for(const key of ['human']){const doc=JSON.parse(raw[key]);doc.state.outcome='defeat';raw[key]=JSON.stringify(doc);}
 for(const part of raw.ai){const doc=JSON.parse(part.document);doc.state.outcome='defeat';part.document=JSON.stringify(doc);}
 expect(decodeSave(JSON.stringify(raw)).ok).toBe(false);
});

it('retires a remembered eliminated enemy destination and scouts toward the remaining hostile player',()=>{
 let m=match(),bot=m.multiplePlayers!.ai[0];
 bot.state.enemyKnowledge!.playerBase={...m.gathering.base};bot.state.combat.enemies.push({id:'enemy-produced-1',kind:'unit',role:'soldier',owner:'enemy',hp:66,position:{x:600,y:600},order:{kind:'attack-move',destination:{...m.gathering.base}}});bot.state.enemyProduction!.production.nextUnitNumber=2;
 m=updateMatch(eliminate(m,'player'),.25);bot=m.multiplePlayers!.ai[0];expect(m.outcome).toBe('playing');expect(bot.state.enemyKnowledge!.playerBase).toBeNull();
 const unit=bot.state.combat.enemies.find(e=>e.id==='enemy-produced-1')!;expect(['attack-move','muster']).toContain(unit.order?.kind);if(unit.order?.kind==='attack-move'||unit.order?.kind==='muster')expect(unit.order.destination).not.toEqual(m.gathering.base);
 expect(enemyAttackDestination(bot.state)).not.toEqual(m.gathering.base);roundtrip(m);
});

it('migrates valid config49 individual outcomes to team victory or continuing spectator play',()=>{
 for(const eliminated of ['player','enemy'] as const){
  const m=updateMatch(eliminate(match(true),eliminated),.25),raw=JSON.parse(encodeSave(m,{camera:{x:0,y:0},building:null}));raw.configVersion='tribute-config-49';
  const oldOutcome=eliminated==='player'?'defeat':'playing';
  for(const key of ['human']){const doc=JSON.parse(raw[key]);legacyTerrainFixture(doc);doc.configVersion='tribute-config-49';doc.state.outcome=oldOutcome;raw[key]=JSON.stringify(doc);}
  for(const part of raw.ai){const doc=JSON.parse(part.document);legacyTerrainFixture(doc);doc.configVersion='tribute-config-49';doc.state.outcome=oldOutcome;part.document=JSON.stringify(doc);}
  const loaded=decodeSave(JSON.stringify(raw));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(!loaded.ok)throw Error(loaded.error);expect(loaded.match.outcome).toBe(eliminated==='player'?'playing':'victory');expect(isSpectating(loaded.match)).toBe(eliminated==='player');roundtrip(loaded.match);
 }
});
