import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {expect,it} from 'vitest';
import {factions,factionsForPlayer} from '../config/factions';
import {createMatch,updateMatch} from './match';
import {enqueueProduction,updateQueuedProduction} from './productionQueue';
import {technologyFor} from './productionPrerequisites';
import {actionPanel} from '../presentation/actionPanel';
import {encodeSave,decodeSave} from './save';
import {updateEnemyProduction} from './enemyProduction';
import {unitFrame,motion} from '../presentation/animation';

it('Human roster exposes distinct specialist art and named research/naval recipes with gated siege',()=>{
 const f=factions.crown,m=createMatch('tutorial');
 expect(f.label).toBe('Human');expect(f.roster).toEqual(['worker','soldier','archer','catapult','specialist','air','cavalry','healer','giant','scout','ballista']);
 expect(f.units.specialist).toMatchObject({art:'specialist',hp:100,speed:130,cost:{wood:30,gold:15},durationSeconds:8,supply:2});
 expect(f.upgrades.attack.name).toBe('Tempered Arms');expect(f.upgrades.defense.name).toBe('Plate Craft');expect(f.naval.units.warship.name).toBe('Cutter');
 expect(unitFrame(motion(undefined,{x:0,y:0},'idle',0,'specialist','player',undefined,'crown'),0)).toBe('specialist-player-s-idle-0');
 m.placement.barracks={x:512,y:384,width:64,height:64};m.placement.construction={remainingSeconds:0,builderId:null};
 const panel=actionPanel(m,'barracks',true);expect(panel['train-specialist']).toMatchObject({visible:true,reason:'Complete Forge'});expect(panel['train-catapult'].visible).toBe(false);
});
it('completed Plate Craft unlocks a paid Human specialist, with atomic rejection before it finishes',()=>{
 const m=createMatch('tutorial');m.gathering.wood=100;m.gathering.goldBalance=50;
 m.placement.barracks={x:512,y:384,width:64,height:64};m.placement.construction={remainingSeconds:0,builderId:null};
 m.placement.forge={id:'forge',owner:'player',hp:120,footprint:{x:608,y:384,width:64,height:64},construction:{remainingSeconds:0,builderId:null}};
 const building=()=>({kind:'barracks' as const,footprint:m.placement.barracks,unitType:'specialist' as const,technology:technologyFor(m,'player')});
 m.research!.job={kind:'defense',remainingSeconds:1};const no=enqueueProduction(m.gathering,m.soldierProduction,building());expect(no.gathering).toBe(m.gathering);
 m.research!.job=null;m.research!.defense=1;const yes=enqueueProduction(m.gathering,m.soldierProduction,building());expect(yes.gathering.wood).toBe(70);expect(yes.gathering.goldBalance).toBe(35);
 expect(updateQueuedProduction(yes.gathering,yes.production,7.99,building()).gathering.units).toHaveLength(3);
 const done=updateQueuedProduction(yes.gathering,yes.production,8,building());expect(done.gathering.units.at(-1)).toMatchObject({id:'unit-4',archetype:'specialist',hp:100,selected:false,order:{kind:'idle'}});
});
it('config24 migration refunds old Barracks siege without requiring a retroactive workshop',()=>{
 const m=createMatch();m.gathering.wood=100;m.gathering.goldBalance=50;
 const b={kind:'barracks' as const,footprint:{x:512,y:384,width:64,height:64},unitType:'catapult' as const,producer:'siegeWorks' as const};
 const started=enqueueProduction(m.gathering,m.soldierProduction,{...b,technology:{baseLevel:2,buildings:['forge' as const,'siegeWorks' as const],research:{}}});
 m.gathering=started.gathering;m.soldierProduction=started.production;
 const d=JSON.parse(encodeSave(m,{camera:{x:0,y:0},building:null}));legacyTerrainFixture(d);d.configVersion='tribute-config-24';
 const loaded=decodeSave(JSON.stringify(d));expect(loaded.ok).toBe(true);if(!loaded.ok)return;
 expect(loaded.match.soldierProduction.queue).toEqual([]);expect(loaded.match.gathering.wood).toBe(100);
 const done=updateQueuedProduction(loaded.match.gathering,loaded.match.soldierProduction,10,b);expect(done.gathering.units).toHaveLength(3);
 expect(enqueueProduction(done.gathering,done.production,b).production).toBe(done.production);
});
it('Human enemy production spends its own recipe and does not debit the player',()=>{
 const m=createMatch('siege-test','normal',factionsForPlayer('clans'));
 const bank=m.enemyProduction!,playerWood=m.gathering.wood;
 const result=updateEnemyProduction(bank,m.combat,m.gathering,m.map,5,'crown');
 expect(result.state.acceptedJobs).toBe(3);expect(result.state.wood).toBe(20);expect(result.state.gold).toBe(5);
 expect(result.combat.enemies.some(e=>e.id==='enemy-produced-1')).toBe(true);expect(m.gathering.wood).toBe(playerWood);
 // Full AI roster is RTS-141; ordinary enemy soldiers retain the legacy combat profile here.
 expect(result.combat.enemies.find(e=>e.id==='enemy-produced-1')!.hp).toBe(36);
 expect(updateMatch(createMatch('skirmish'),0).outcome).toBe('playing');
});
