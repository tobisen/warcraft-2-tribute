import {it,expect} from 'vitest';
import {createMatch,updateMatch} from './match';
import {matchPlayers} from './players';
import {projectMultiplePlayers} from './multiplePlayers';
it('creates one human and two independent paid AI economies',()=>{
 let m=createMatch('skirmish','normal',{player:'crown',enemy:'clans'},'plains96',1,'balanced',matchPlayers(undefined,undefined,3));
 expect(m.multiplePlayers!.ai).toHaveLength(2);
 expect(new Set(m.combat.enemies.map(e=>e.id)).size).toBe(m.combat.enemies.length);
 expect(m.combat.enemies.find(e=>e.playerId==='ai-2'&&e.kind==='base')?.position).toEqual({x:1664,y:384});
 m=updateMatch(m,5);
 const [a,b]=m.multiplePlayers!.ai;
 expect(a.state.enemyProduction).not.toBe(b.state.enemyProduction);
 expect(a.state.enemyProduction!.spent!.wood).toBeGreaterThan(0);
 expect(b.state.enemyProduction!.spent!.wood).toBeGreaterThan(0);
 expect(m.waves.elapsedSeconds).toBe(5);
});
it('AI bodies can fight a hostile AI using only their own current vision',()=>{
 let m=createMatch('skirmish','normal',undefined,'plains96',1,'balanced',matchPlayers(undefined,undefined,3));
 const [a,b]=m.multiplePlayers!.ai;
 a.state.combat.enemies.push({id:'enemy-produced-1',kind:'unit',role:'soldier',owner:'enemy',position:{x:1400,y:500},hp:60,order:{kind:'attack-move',destination:{x:1430,y:500}}});
 b.state.combat.enemies.push({id:'enemy-produced-1',kind:'unit',role:'soldier',owner:'enemy',position:{x:1430,y:500},hp:48,order:{kind:'attack-move',destination:{x:1400,y:500}}});
 m=projectMultiplePlayers(m);m=updateMatch(m,.5);
 expect(m.multiplePlayers!.ai[0].state.combat.enemies.find(e=>e.id==='enemy-produced-1')!.hp).toBeLessThan(60);
 expect(m.multiplePlayers!.ai[1].state.combat.enemies.find(e=>e.id==='enemy-produced-1')!.hp).toBeLessThan(48);
});
import {encodeSave,decodeSave} from './save';
it('strict save/load preserves three owners, independent banks and restarts',()=>{
 let m=createMatch('skirmish','normal',undefined,'plains96',1,'balanced',matchPlayers(undefined,undefined,3));
 m=updateMatch(m,5);
 const json=encodeSave(m,{camera:{x:0,y:0},building:null}),loaded=decodeSave(json);
 expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);
 if(!loaded.ok)return;
 expect(loaded.match.multiplePlayers!.roster).toEqual(m.multiplePlayers!.roster);
 expect(loaded.match.multiplePlayers!.ai.map(bot=>bot.state.enemyProduction)).toEqual(m.multiplePlayers!.ai.map(bot=>bot.state.enemyProduction));
 expect(loaded.match.combat.enemies.map(e=>[e.id,e.playerId,e.hp])).toEqual(m.combat.enemies.map(e=>[e.id,e.playerId,e.hp]));
 expect(updateMatch(loaded.match,.25).waves.elapsedSeconds).toBe(5.25);
 const malformed=JSON.parse(json);malformed.multiplePlayers[2].id='enemy';expect(decodeSave(JSON.stringify(malformed)).ok).toBe(false);
});
it('both AI players construct and produce from paid jobs over ordinary gameplay time',()=>{
 let m=createMatch('skirmish','normal',undefined,'plains96',1,'offensive',matchPlayers(undefined,'offensive',3));
 m=updateMatch(m,60);
 for(const bot of m.multiplePlayers!.ai){expect(bot.state.enemyProduction!.acceptedJobs).toBeGreaterThan(0);expect(bot.state.combat.enemies.some(e=>e.kind==='unit')).toBe(true);expect(bot.state.enemyProduction!.spent!.wood).toBeGreaterThan(0);}
 expect(decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null})).ok).toBe(true);
},15000);
import {castSpell} from './spells';
import {matchStats} from './matchStats';
it('commits human offensive spells to the correct AI owner and persists timers',()=>{
 let m=createMatch('skirmish','normal',undefined,'plains96',1,'balanced',matchPlayers(undefined,undefined,3));
 const bot=m.multiplePlayers!.ai[1];bot.state.combat.enemies.push({id:'enemy-produced-1',kind:'unit',role:'soldier',owner:'enemy',hp:48,position:{x:450,y:500},order:{kind:'idle'}});bot.state.enemyProduction!.production.nextUnitNumber=2;
 m.gathering.units.push({id:'unit-4',kind:'soldier',archetype:'specialist',faction:'crown',owner:'player',hp:45,mana:100,cargo:0,selected:true,position:{x:400,y:500},target:{x:400,y:500},order:{kind:'idle'}});m.production.nextUnitNumber=m.soldierProduction.nextUnitNumber=5;
 m=projectMultiplePlayers(m);m=updateMatch(m,.01);
 const cast=castSpell(m,'unit-4','hex','ai-2:enemy-produced-1');expect(cast.reason).toBeNull();
 expect(cast.match.multiplePlayers!.ai[1].state.combat.enemies.find(e=>e.id==='enemy-produced-1')!.spellEffects?.[0].spell).toBe('hex');
 const duration=cast.match.combat.enemies.find(e=>e.id==='ai-2:enemy-produced-1')!.spellEffects![0].remainingSeconds;m=updateMatch(cast.match,.25);expect(m.combat.enemies.find(e=>e.id==='ai-2:enemy-produced-1')!.spellEffects?.[0].remainingSeconds).toBeCloseTo(duration-.25);
});
it('records an AI-against-AI kill once, separately from losses and human kills',()=>{
 let m=createMatch('skirmish','normal',undefined,'plains96',1,'balanced',matchPlayers(undefined,undefined,3));
 for(const [i,bot] of m.multiplePlayers!.ai.entries()){bot.state.combat.enemies.push({id:'enemy-produced-1',kind:'unit',role:'soldier',owner:'enemy',hp:i===0?60:.1,position:{x:1400+i*30,y:500},order:{kind:'attack-move',destination:{x:1430-i*30,y:500}}});bot.state.enemyProduction!.production.nextUnitNumber=2;}
 m=projectMultiplePlayers(m);m=updateMatch(m,.25);expect(m.multiplePlayers!.kills.enemy).toBe(1);expect(m.multiplePlayers!.kills.player).toBe(0);
 m=updateMatch(m,.25);expect(m.multiplePlayers!.kills.enemy).toBe(1);expect(matchStats(m).players!.enemy!.killed).toBe(1);expect(matchStats(m).players!['ai-2']!.lost).toBe(1);
});
it('saves an AI defender threat owned by another AI, rejecting missing references',()=>{
 let m=createMatch('skirmish','normal',undefined,'plains96',1,'balanced',matchPlayers(undefined,undefined,3));
 const target=m.multiplePlayers!.ai[1];target.state.combat.enemies.push({id:'enemy-produced-1',kind:'unit',role:'soldier',owner:'enemy',hp:48,position:{x:1400,y:500},order:{kind:'idle'}});target.state.enemyProduction!.production.nextUnitNumber=2;
 m.multiplePlayers!.ai[0].state.enemyAI!.threatId='ai-2:enemy-produced-1';m=projectMultiplePlayers(m);
 const json=encodeSave(m,{camera:{x:0,y:0},building:null}),loaded=decodeSave(json);expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);
 const malformed=JSON.parse(json),ai=JSON.parse(malformed.ai[0].document);ai.state.enemyAI.threatId='ai-2:enemy-produced-999';malformed.ai[0].document=JSON.stringify(ai);expect(decodeSave(JSON.stringify(malformed)).ok).toBe(false);
});
it('does not acquire knowledge of hidden other bases or share AI current vision',()=>{
 const m=createMatch('skirmish','normal',undefined,'plains96',1,'balanced',matchPlayers(undefined,undefined,3));
 const updated=updateMatch(m,.25);
 for(const bot of updated.multiplePlayers!.ai){expect(bot.state.enemyKnowledge!.playerBase).toBeNull();expect(bot.vision.visible).not.toEqual(updated.fog!.teams.player.visible);}
 expect(updated.multiplePlayers!.ai[0].vision.visible).not.toEqual(updated.multiplePlayers!.ai[1].vision.visible);
});
import {minimapData} from '../presentation/minimap';
it('colors every owned minimap marker by player rather than faction or entity kind',()=>{
 const m=createMatch('skirmish','normal',{player:'elves',enemy:'elves'},'plains96',1,'balanced',matchPlayers({player:'elves',enemy:'elves'},'balanced',3));
 const data=minimapData(m);expect(data.markers.filter(p=>p.owner==='player').every(p=>p.color==='#5fa9df')).toBe(true);
 expect(data.markers.find(p=>p.id==='enemy-base')!.color).toBe('#ec7770');expect(data.markers.find(p=>p.id==='ai-2:enemy-base')!.color).toBe('#e5bf55');
});
it('shows and saves an AI projectile against another AI without advancing it twice',()=>{
 let m=createMatch('skirmish','normal',undefined,'plains96',1,'balanced',matchPlayers(undefined,undefined,3));
 const [a,b]=m.multiplePlayers!.ai;
 a.state.combat.enemies=a.state.combat.enemies.filter(e=>e.kind==='base');const target=a.state.combat.enemies.find(e=>e.kind==='base')!;
 b.state.combat.enemies.push({id:'enemy-produced-1',kind:'unit',role:'archer',owner:'enemy',hp:32,position:{x:target.position.x+160,y:target.position.y},order:{kind:'attack-move',destination:target.position}});b.state.enemyProduction!.production.nextUnitNumber=2;
 m=projectMultiplePlayers(m);m=updateMatch(m,.05);
 const shot=m.combat.projectiles!.find(p=>p.id.startsWith('ai-2:'));expect(shot).toBeDefined();expect(shot!.shooterId).toBe('ai-2:enemy-produced-1');
 const loaded=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(!loaded.ok)return;
 expect(loaded.match.combat.projectiles).toEqual(m.combat.projectiles);
 const before=m.multiplePlayers!.ai[0].state.combat.enemies.find(e=>e.id===shot!.targetId)!.hp;m=updateMatch(loaded.match,.5);expect(m.multiplePlayers!.ai[0].state.combat.enemies.find(e=>e.id===shot!.targetId)!.hp).toBeLessThan(before);
});
it('continues and saves when one AI base is destroyed but a hostile player remains',()=>{
 let m=createMatch('skirmish','normal',undefined,'plains96',1,'balanced',matchPlayers(undefined,undefined,3));
 m.multiplePlayers!.ai[0].state.combat.enemies.find(e=>e.kind==='base')!.hp=0;
 m=updateMatch(m,.25);expect(m.outcome).toBe('playing');
 const loaded=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);
});
