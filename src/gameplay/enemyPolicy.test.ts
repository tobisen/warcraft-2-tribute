import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {legacyEnemyFixture} from './testHelpers/legacyEnemyFixture';
import {updateEnemyProduction} from './enemyProduction';
import {enemyPopulation} from './enemyConstruction';
import {expect,it} from 'vitest';
import {createMatch,updateMatch,type MatchState} from './match';
import {prepareEnemyConstruction,updateEnemyConstruction} from './enemyConstruction';
import {prepareEnemyPolicy,enemyPriority,advanceEnemyPolicy} from './enemyPolicy';
import {updateCombat,type CombatState} from './combat';
import {cleanDestroyed} from './destruction';
import {encodeSave,decodeSave} from './save';
const view={camera:{x:0,y:0},building:null};
/** Component preconditions: ready barracks, three army entities and a reconciled test bank. */
function fixture():MatchState {
 const m=prepareEnemyConstruction(createMatch('skirmish','normal'));delete m.enemyKnowledge;const bar=m.combat.enemies.find(e=>e.buildingType==='barracks')!;bar.construction={remainingSeconds:0,builderId:null};m.combat.enemies.find(e=>e.work)!.work!.order={kind:'idle'};
 m.combat.enemies.push(...Array.from({length:3},(_,i)=>({id:`enemy-produced-${i+1}`,kind:'unit' as const,owner:'enemy' as const,hp:36,position:{x:700+i*30,y:500},order:{kind:'idle' as const}})));m.enemyProduction!.production.nextUnitNumber=4;
 m.enemyProduction!.wood=100;m.enemyProduction!.gold=50;m.enemyProduction!.extracted={wood:60,gold:30};m.gathering.node.remaining-=60;m.gathering.gold!.remaining-=30;m.waves.elapsedSeconds=2;return m;
}
function forgeReady(){let m=prepareEnemyConstruction(fixture());for(let i=0;i<100;i++)m=updateEnemyConstruction(m,.1).match;return m;}
it('orders barracks, army, forge, attack, defense; losses restore army priority',()=>{
 const m=createMatch('skirmish');expect(enemyPriority(m)).toBe('barracks');const ready=fixture();expect(enemyPriority(ready)).toBe('forge');const built=forgeReady();expect(enemyPriority(built)).toBe('attack');built.enemyPolicy!.research.attack=1;expect(enemyPriority(built)).toBe('defense');built.enemyPolicy!.research.defense=1;expect(enemyPriority(built)).toBe('expansion');built.enemyPolicy!.research.defense=0;built.combat.enemies=built.combat.enemies.filter(e=>e.id!=='enemy-produced-3');expect(enemyPriority(built)).toBe('army');
});
it('required supply precedes forge and no second construction starts beside an unfinished site',()=>{
 const m=fixture();m.combat.enemies.push(...[4,5].map(i=>({id:`enemy-produced-${i}`,kind:'unit' as const,owner:'enemy' as const,hp:36,position:{x:700+i*30,y:500}})));expect(enemyPriority(m)).toBe('supply');const next=prepareEnemyConstruction(m);expect(next.combat.enemies.some(e=>e.buildingType==='farm')).toBe(true);expect(next.combat.enemies.some(e=>e.buildingType==='forge')).toBe(false);expect(prepareEnemyConstruction(next).enemyProduction!.wood).toBe(next.enemyProduction!.wood);
});
it('forge is paid once and research cannot start until five seconds of actual work complete',()=>{
 const m=prepareEnemyConstruction(fixture());expect(m.enemyProduction!.wood).toBe(60);expect(m.enemyProduction!.gold).toBe(40);expect(prepareEnemyConstruction(m).enemyProduction!.wood).toBe(60);expect(prepareEnemyPolicy(m).enemyPolicy!.research.job).toBeNull();const early=updateEnemyConstruction(m,.1).match;expect(early.combat.enemies.find(e=>e.buildingType==='forge')!.construction!.remainingSeconds).toBe(5);
});
it('research costs exactly once, lasts eight gameplay seconds and cannot repeat without the academy',()=>{
 let m=prepareEnemyPolicy(forgeReady());expect(m.enemyProduction!.wood).toBe(25);expect(m.enemyProduction!.gold).toBe(25);expect(m.enemyPolicy!.research.job).toEqual({kind:'attack',remainingSeconds:8});const again=prepareEnemyPolicy(m);expect(again.enemyProduction!.wood).toBe(25);m.enemyPolicy=advanceEnemyPolicy(m,7.9);expect(m.enemyPolicy!.research.attack).toBe(0);m.enemyPolicy=advanceEnemyPolicy(m,.1);expect(m.enemyPolicy!.research.attack).toBe(1);expect(m.enemyPolicy!.research.job).toBeNull();m.enemyPolicy=advanceEnemyPolicy(m,100);expect(m.enemyPolicy!.research.attack).toBe(1);expect(prepareEnemyPolicy(m).enemyPolicy!.research.job).toBeNull();
});
it('resource choice switches only empty workers and preserves loaded gathering and delivery orders',()=>{
 const m=fixture();m.enemyProduction!.wood=0;const gold=m.combat.enemies.find(e=>e.id==='enemy-worker-2')!;gold.work!.order={kind:'gather',nodeId:'gold-1'};gold.work!.cargo=2;gold.work!.cargoType='gold';let r=prepareEnemyPolicy(m);expect(r.combat.enemies.find(e=>e.id===gold.id)!.work).toEqual(gold.work);gold.work!.cargo=0;gold.work!.cargoType=undefined;r=prepareEnemyPolicy(m);expect(r.combat.enemies.find(e=>e.id===gold.id)!.work!.order).toEqual({kind:'gather',nodeId:'wood-1'});gold.work!.order={kind:'deliver',nodeId:'gold-1'};gold.work!.cargo=5;r=prepareEnemyPolicy(m);expect(r.combat.enemies.find(e=>e.id===gold.id)!.work).toEqual(gold.work);expect(r.enemyProduction!.wood).toBe(0);expect(r.enemyProduction!.gold).toBe(50);
});
it.each(['crown','clans'] as const)('%s enemy buffs affect only combat units, neither workers nor buildings',faction=>{
 const m=createMatch('skirmish','normal',{player:faction,enemy:faction==='crown'?'clans':'crown'});const hp=faction==='clans'?66:60;const g={...m.gathering,units:[{id:'unit-4',owner:'player' as const,kind:'soldier' as const,hp,cargo:0 as const,selected:true,position:{x:300,y:300},target:{x:300,y:300},order:{kind:'attack' as const,enemyId:'fighter'}}]};const combat={baseHP:240,enemyUpgrades:{attack:1,defense:1},enemies:[{id:'fighter',owner:'enemy' as const,kind:'unit' as const,hp:36,position:{x:330,y:300}}]};const fight=(state:CombatState)=>updateCombat(g,state,1,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,m.factions!.enemy);const r=fight(combat);expect(r.gathering.units[0].hp).toBeCloseTo(hp-(faction==='crown'?7.8:7.5));expect(r.combat.enemies[0].hp).toBeCloseTo(faction==='crown'?21.6:21);
 const worker={id:'fighter',owner:'enemy' as const,kind:'worker' as const,hp:30,position:{x:330,y:300},work:{cargo:0,target:{x:330,y:300},order:{kind:'idle' as const}}};const w=fight({...combat,enemies:[worker]});expect(w.gathering.units[0].hp).toBe(hp);expect(w.combat.enemies[0].hp).toBe(faction==='crown'?12:10);
 const building={id:'fighter',kind:'building' as const,owner:'enemy' as const,buildingType:'forge' as const,hp:120,position:{x:330,y:300},footprint:{x:320,y:288,width:64,height:64},construction:{remainingSeconds:0,builderId:null}};expect(fight({...combat,enemies:[building]}).combat.enemies[0].hp).toBe(faction==='crown'?102:100);
});
it('forge death cancels unfinished research without refund while learned levels survive',()=>{
 let m=prepareEnemyPolicy(forgeReady());const bank=m.enemyProduction!.wood;m.enemyPolicy!.research.defense=1;m.combat.enemies.find(e=>e.buildingType==='forge')!.hp=0;m=cleanDestroyed(m);expect(m.enemyPolicy!.research.job).toBeNull();expect(m.enemyPolicy!.research.defense).toBe(1);expect(m.enemyProduction!.wood).toBe(bank);
});
it('save/load preserve paid research and ledger, pause freezes it and restart clears all policy state',()=>{
 const m=prepareEnemyPolicy(forgeReady());m.paused=true;const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok).toBe(true);if(!loaded.ok)return;expect(loaded.match.enemyPolicy).toEqual(m.enemyPolicy);expect(loaded.match.enemyProduction).toEqual(m.enemyProduction);expect(updateMatch(loaded.match,100)).toBe(loaded.match);expect(createMatch('skirmish').enemyPolicy!.research).toEqual({attack:0,defense:0,job:null});
 for(const mutate of [(d:any)=>d.state.enemyPolicy.research.job.remainingSeconds=9,(d:any)=>d.state.enemyPolicy.research.attack=2,(d:any)=>d.configVersion='tribute-config-6']){const d=JSON.parse(encodeSave(m,view));mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}
});
it('config six migrates without free forge, levels, income or altered old construction policy',()=>{
 const m=createMatch('skirmish');delete m.enemyPolicy;delete m.enemyRecovery;delete m.enemyKnowledge;const d=JSON.parse(encodeSave(m,view));legacyTerrainFixture(d);d.configVersion='tribute-config-6';legacyEnemyFixture(d);delete d.state.statLedger;const loaded=decodeSave(JSON.stringify(d));expect(loaded.ok).toBe(true);if(loaded.ok){expect(loaded.match.enemyPolicy).toBeUndefined();expect(loaded.match.combat.enemies.some(e=>e.buildingType==='forge')).toBe(false);expect(loaded.match.enemyProduction).toEqual({...m.enemyProduction,roster:undefined});}
});

it('an existing paid production queue advances while the policy saves for a Forge',()=>{
 let m=fixture();const bar=m.combat.enemies.find(e=>e.buildingType==='barracks')!;const queued=updateEnemyProduction(m.enemyProduction!,m.combat,m.gathering,m.map,0,'clans',{site:bar,population:{...enemyPopulation(m),cap:6}});m={...m,combat:queued.combat,enemyProduction:queued.state};expect(m.enemyProduction!.production.queue).toHaveLength(1);const wood=m.enemyProduction!.wood;
 m=updateMatch(m,.1);expect(m.combat.enemies.some(e=>e.buildingType==='forge')).toBe(true);expect(m.enemyProduction!.wood).toBe(wood-40);expect(m.enemyProduction!.production.queue).toHaveLength(1);expect(m.enemyProduction!.production.remainingSeconds).toBeCloseTo(5.9);expect(m.enemyProduction!.acceptedJobs).toBe(1);
});

it('AI pays for reachable academy construction and then level II, preserving expansion priority',()=>{
 let m=forgeReady();m.enemyPolicy!.research={attack:1,defense:1,job:null};delete m.enemyRecovery;m.enemyProduction!.wood=300;m.enemyProduction!.gold=150;m.waves.elapsedSeconds=100;
 expect(enemyPriority(m)).toBe('academy');m=prepareEnemyConstruction(m);expect(m.combat.enemies.find(e=>e.buildingType==='academy')).toBeDefined();expect(m.enemyProduction!.wood).toBe(220);expect(m.enemyProduction!.gold).toBe(110);expect(prepareEnemyPolicy(m).enemyPolicy!.research.job).toBeNull();
 for(let i=0;i<300;i++)m=updateEnemyConstruction(m,.1).match;
 expect(m.combat.enemies.find(e=>e.buildingType==='academy')!.construction!.remainingSeconds).toBe(0);expect(enemyPriority(m)).toBe('attack');m=prepareEnemyPolicy(m);expect(m.enemyProduction!.wood).toBe(150);expect(m.enemyProduction!.gold).toBe(80);expect(m.enemyPolicy!.research.job).toEqual({kind:'attack',remainingSeconds:12});m.enemyPolicy=advanceEnemyPolicy(m,12);expect(m.enemyPolicy!.research.attack).toBe(2);expect(enemyPriority(m)).toBe('defense');
});

it('legacy early story AI stops at level I without academy construction',()=>{const m=forgeReady();m.campaignMission='the-siege';m.enemyPolicy!.research={attack:1,defense:1,job:null};delete m.enemyRecovery;m.enemyProduction!.wood=300;m.enemyProduction!.gold=150;m.waves.elapsedSeconds=100;expect(enemyPriority(m)).toBe('army');expect(prepareEnemyConstruction(m).combat.enemies.some(e=>e.buildingType==='academy')).toBe(false);});
