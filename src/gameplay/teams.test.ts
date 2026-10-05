import {it,expect} from 'vitest';
import {createMatch,updateMatch} from './match';
import {matchPlayers,canHarm,canSupport,canControl} from './players';
import {projectMultiplePlayers,shareTeamVision,aiContext} from './multiplePlayers';
import {castSpell} from './spells';
import {issueOrder} from './commandOrders';
import {encodeSave,decodeSave} from './save';
import {withGateRules} from './gates';
import {enemyNavigationMap,bodyFits} from './map';
const teamMatch=()=>{const roster=matchPlayers(undefined,undefined,3);roster[2].teamId=1;return createMatch('skirmish','normal',undefined,'plains96',1,'balanced',roster);};
it('centralizes ally/enemy without granting allied unit control',()=>{const m=teamMatch(),r=m.multiplePlayers!.roster;expect(canSupport('player','ai-2',r)).toBe(true);expect(canHarm('player','ai-2',r)).toBe(false);expect(canHarm('ai-2','enemy',r)).toBe(true);expect(canControl('player','ai-2')).toBe(false);});
it('shares current vision and explored cells while retaining separate banks',()=>{
 let m=teamMatch();m=updateMatch(m,.25);expect(m.fog!.teams.player.visible).toEqual(m.multiplePlayers!.ai[1].vision.visible);expect(m.fog!.teams.player.explored).toEqual(m.multiplePlayers!.ai[1].vision.explored);expect(m.fog!.teams.player.visible).not.toEqual(m.multiplePlayers!.ai[0].vision.visible);
 expect(m.multiplePlayers!.ai[1].state.enemyKnowledge!.playerBase).toBeNull();
 const loaded=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(loaded.ok)expect(loaded.match.fog!.teams.player.explored).toEqual(m.fog!.teams.player.explored);
});
it('prevents human attacks, autonomous attacks and splash against allies',()=>{
 let m=teamMatch();const ally=m.multiplePlayers!.ai[1];ally.state.combat.enemies.push({id:'enemy-produced-1',kind:'unit',role:'soldier',owner:'enemy',hp:48,position:{x:440,y:500},order:{kind:'idle'}});ally.state.enemyProduction!.production.nextUnitNumber=2;
 m.gathering.units.push({id:'unit-4',kind:'soldier',owner:'player',archetype:'catapult',hp:100,cargo:0,selected:true,position:{x:400,y:500},target:{x:400,y:500},order:{kind:'idle'}});m.production.nextUnitNumber=m.soldierProduction.nextUnitNumber=5;
 m=projectMultiplePlayers(m);expect(issueOrder(m,{kind:'attack',enemyId:'ai-2:enemy-produced-1'})).toBe(m);
 m=updateMatch(m,.5);expect(m.gathering.units.find(u=>u.id==='unit-4')!.order.kind).toBe('idle');expect(m.multiplePlayers!.ai[1].state.combat.enemies.find(e=>e.id==='enemy-produced-1')!.hp).toBe(48);
});
it('friendly spells reach allied units while offensive spells reject them',()=>{
 let m=teamMatch();const ally=m.multiplePlayers!.ai[1];ally.state.combat.enemies.push({id:'enemy-produced-1',kind:'unit',role:'soldier',owner:'enemy',hp:20,position:{x:440,y:500},order:{kind:'idle'}});ally.state.enemyProduction!.production.nextUnitNumber=2;
 m.gathering.units.push({id:'unit-4',kind:'soldier',archetype:'specialist',faction:'crown',owner:'player',hp:100,mana:100,cargo:0,selected:true,position:{x:400,y:500},target:{x:400,y:500},order:{kind:'idle'}});m.production.nextUnitNumber=m.soldierProduction.nextUnitNumber=5;
 m=shareTeamVision(projectMultiplePlayers(m));m=updateMatch(m,.01);
 expect(castSpell(m,'unit-4','hex','ai-2:enemy-produced-1').reason).toBe('Invalid player relation');
 const healed=castSpell(m,'unit-4','heal','ai-2:enemy-produced-1');expect(healed.reason).toBeNull();expect(healed.match.multiplePlayers!.ai[1].state.combat.enemies.find(e=>e.id==='enemy-produced-1')!.hp).toBeGreaterThan(20);
});
it('open human gates admit allies but block hostile navigation',()=>{
 let m=teamMatch();const footprint={x:736,y:480,width:64,height:32};m.placement.defenses=[{id:'gate-1',kind:'gate',owner:'player',hp:200,footprint,open:true,level:1,upgradeRemaining:null,cooldown:0,construction:{remainingSeconds:0,builderId:null}}];
 const friendly=withGateRules({...m,aiContext:aiContext(m,'ai-2')}),hostile=withGateRules({...m,aiContext:aiContext(m,'enemy')});
 expect(bodyFits(enemyNavigationMap(friendly.map),{x:768,y:496},12)).toBe(true);expect(bodyFits(enemyNavigationMap(hostile.map),{x:768,y:496},12)).toBe(false);
});
it('actual siege splash damages hostiles while preserving nearby allied HP',()=>{
 let m=teamMatch();const enemy=m.multiplePlayers!.ai[0],ally=m.multiplePlayers!.ai[1];ally.state.enemyAI=undefined;
 enemy.state.combat.enemies.push({id:'enemy-barracks',kind:'building',buildingType:'barracks',owner:'enemy',hp:130,position:{x:512,y:512},footprint:{x:480,y:480,width:64,height:64},construction:{remainingSeconds:0,builderId:null}});
 ally.state.combat.enemies.push({id:'enemy-produced-1',kind:'unit',role:'soldier',owner:'enemy',hp:48,position:{x:556,y:512},order:{kind:'idle'}});ally.state.enemyProduction!.production.nextUnitNumber=2;
 m.gathering.units.push({id:'unit-4',kind:'soldier',owner:'player',archetype:'catapult',hp:80,cargo:0,selected:true,position:{x:400,y:512},target:{x:400,y:512},order:{kind:'attack',enemyId:'enemy-barracks'}});m.production.nextUnitNumber=m.soldierProduction.nextUnitNumber=5;
 m=projectMultiplePlayers(m);m=updateMatch(m,.7);expect(m.multiplePlayers!.ai[0].state.combat.enemies.find(e=>e.id==='enemy-barracks')!.hp).toBeLessThan(130);expect(m.multiplePlayers!.ai[1].state.combat.enemies.find(e=>e.id==='enemy-produced-1')!.hp).toBe(48);
});
it('allied AI defends a human base against a visible hostile within existing rules',()=>{
 let m=teamMatch();const enemy=m.multiplePlayers!.ai[0],ally=m.multiplePlayers!.ai[1];
 enemy.state.combat.enemies.push({id:'enemy-produced-1',kind:'unit',role:'soldier',owner:'enemy',hp:66,position:{x:440,y:500},order:{kind:'attack-move',destination:m.gathering.base}});enemy.state.enemyProduction!.production.nextUnitNumber=2;
 ally.state.combat.enemies.push({id:'enemy-produced-1',kind:'unit',role:'soldier',owner:'enemy',hp:48,position:{x:600,y:500},order:{kind:'idle'}});ally.state.enemyProduction!.production.nextUnitNumber=2;
 m=projectMultiplePlayers(m);m=updateMatch(m,.25);expect(m.multiplePlayers!.ai[1].state.enemyAI!.threatId).toBe('enemy-produced-1');expect(m.multiplePlayers!.ai[1].state.combat.enemies.find(e=>e.id==='enemy-produced-1')!.order?.kind).toBe('defend');
});
