import {beginPlacement,placementPreviewError,placementObstacles} from './placement';
import {visibleMinimapData} from '../presentation/minimap';
import {battleEnemies} from './bosses';
import {expect,it} from 'vitest';
import {bossDefinitions,bossRules,bossEnemyId,type BossId} from '../config/bosses';
import {factions} from '../config/factions';
import {createMatch,updateMatch,type MatchState} from './match';
import {createClassicMatch} from './testHelpers/classicMatch';
import {bossEnemies,bossLootPosition,updateBossRewards,prepareBossCombat,finishBossCombat} from './bosses';
import {updateCombat} from './combat';
import {bodyFits} from './map';
import {planRoute} from './navigation';
import {matchFog} from './matchFog';
import {isVisible} from './fog';
import {encodeSave,decodeSave} from './save';
import {matchStats} from './matchStats';
import {startCampaignMission} from './campaign';
import {identityFor} from '../config/campaignSeries';
import {campaignMissions} from '../config/campaign';
const view={camera:{x:0,y:0},building:null};
function match(id:BossId){return createMatch('skirmish','beginner',undefined,bossDefinitions[id].map);}
function army(m:MatchState,id:BossId,count:number):MatchState{const b=bossDefinitions[id],f=factions.crown;const next:MatchState={...m,gathering:{...m.gathering,units:Array.from({length:count},(_,i)=>({id:`unit-${i+4}`,kind:'soldier' as const,owner:'player' as const,hp:f.units.soldier.hp,cargo:0 as const,selected:true,position:{x:b.position.x-96+(i%4)*40,y:b.position.y-104+Math.floor(i/4)*40},target:b.position,order:{kind:'attack' as const,enemyId:bossEnemyId(id)}}))}};next.fog=matchFog(next);return next;}
function fight(m:MatchState,seconds:number){for(let i=0;i<seconds*20&&bossEnemies(m).length&&m.gathering.units.length;i++){m.fog=matchFog(m);const combat=prepareBossCombat(m,m.combat),r=updateCombat(m.gathering,combat,.05);m={...m,gathering:r.gathering,...finishBossCombat(m,r.combat)};}return m;}
it.each(['bramblemaw','gravelheart'] as const)('%s is hidden, body-safe, reachable, stationary and absent from AI troops/statistics',id=>{
 const m=match(id),b=bossDefinitions[id];expect(bossEnemies(m)).toHaveLength(1);expect(m.combat.enemies.some(e=>e.id===bossEnemyId(id))).toBe(false);expect(isVisible(m.fog!,'player',b.position)).toBe(false);expect(visibleMinimapData(m).markers.some(p=>p.id===bossEnemyId(id))).toBe(false);expect(bodyFits(m.map,b.position,bossRules.size/2)).toBe(true);expect(bodyFits(m.map,bossLootPosition(id),20)).toBe(true);expect(planRoute(m.map,m.gathering.units[0].position,b.position).status).not.toBe('blocked');expect(matchStats(m).player.killed).toBe(0);
 const next=updateMatch(m,.1);expect(next.bosses).toEqual(m.bosses);expect(bossEnemies(next)[0].position).toEqual(b.position);expect(next.enemyAI?.groups.every(g=>!g.members.includes(bossEnemyId(id)))).toBe(true);
});
it.each(['bramblemaw','gravelheart'] as const)('%s defeats a lone soldier but a substantial army can kill it with existing combat',id=>{
 const solo=fight(army(match(id),id,1),60);expect(solo.gathering.units).toHaveLength(0);expect(solo.bosses!.guardians[id]!.hp).toBeGreaterThan(0);
 const force=fight(army(match(id),id,12),60);expect(force.bosses!.guardians[id]!.hp).toBe(0);expect(force.gathering.units.length).toBeGreaterThan(0);expect(force.bosses!.guardians[id]!.claimed).toBe(false);
});
it('fully resets an abandoned encounter, retaliates against buildings/air and never pursues outside its home',()=>{
 let m=match('bramblemaw');m.bosses!.guardians.bramblemaw!.hp=200;m.bosses!.guardians.bramblemaw!.attackCooldown=.5;
 const next=updateMatch(m,.1);expect(next.bosses!.guardians.bramblemaw!.hp).toBe(1100);expect(bossEnemies(next)[0].position).toEqual(bossDefinitions.bramblemaw.position);
 const b=bossDefinitions.bramblemaw,base={...m.combat,baseHP:240};m={...m,gathering:{...m.gathering,units:[]},placement:{...m.placement,farms:[{id:'farm-1',owner:'player',footprint:{x:b.position.x-96,y:b.position.y-96,width:64,height:64},hp:80,construction:{remainingSeconds:0,builderId:null}}]}};
 m.fog=matchFog(m);const r=updateCombat(m.gathering,prepareBossCombat(m,base),2,undefined,m.placement);expect(r.placement!.farms![0].hp).toBeLessThan(80);expect(r.combat.baseHP).toBe(240);
});
it('requires death, actual vision and living ground proximity; rewards once and preserves harvested-resource accounting',()=>{
 let m=match('bramblemaw');const p=bossLootPosition('bramblemaw');m.gathering.units[0].position=p;m.gathering.units[0].target=p;
 expect(updateBossRewards(m)).toBe(m);m.bosses!.guardians.bramblemaw!.hp=0;expect(updateBossRewards(m)).toBe(m);m.fog=matchFog(m);expect(updateBossRewards({...m,paused:true})).toMatchObject({bosses:{guardians:{bramblemaw:{claimed:false}}}});
 const next=updateBossRewards(m);expect(next.gathering.wood-m.gathering.wood).toBe(300);expect(next.gathering.goldBalance!-m.gathering.goldBalance!).toBe(200);expect(matchStats(next).player.wood).toEqual({gathered:0,delivered:0,spent:0});expect(updateBossRewards(next)).toBe(next);
 const saved=decodeSave(encodeSave(next,view));expect(saved.ok,saved.ok?'':saved.error).toBe(true);if(!saved.ok)throw Error(saved.error);expect(updateBossRewards(saved.match).gathering.wood).toBe(next.gathering.wood);
});
it('roundtrips wounded/dead/unclaimed/claimed bosses and rejects wrong maps, duplicate roster, invalid HP and premature loot',()=>{
 const m=match('gravelheart');m.bosses!.guardians.gravelheart!.hp=900;const raw=JSON.parse(encodeSave(m,view));const loaded=decodeSave(JSON.stringify(raw));expect(loaded.ok).toBe(true);if(loaded.ok)expect(loaded.match.bosses).toEqual(m.bosses);
 for(const mutate of [(d:typeof raw)=>d.state.bosses.guardians.gravelheart.hp=1401,(d:typeof raw)=>d.state.bosses.guardians.gravelheart.claimed=true,(d:typeof raw)=>d.state.bosses.guardians.bramblemaw={hp:1100,attackCooldown:0,claimed:false},(d:typeof raw)=>d.state.bosses.guardians={},(d:typeof raw)=>d.configVersion='tribute-config-64']){const bad=structuredClone(raw);mutate(bad);expect(decodeSave(JSON.stringify(bad)).ok).toBe(false);}
 m.bosses!.guardians.gravelheart!.hp=0;expect(decodeSave(encodeSave(m,view)).ok).toBe(true);
 const old=JSON.parse(encodeSave(m,view));delete old.state.bosses;old.configVersion='tribute-config-64';const migrated=decodeSave(JSON.stringify(old));expect(migrated.ok).toBe(true);if(migrated.ok)expect(migrated.match.bosses!.guardians.gravelheart!.hp).toBe(1400);
 expect(createClassicMatch('skirmish','beginner',undefined,'frontier').bosses).toBeUndefined();expect(createMatch('tutorial').bosses).toBeUndefined();expect(createMatch('skirmish','beginner',undefined,'arena').bosses).toBeUndefined();
});
it('campaign victory does not require the optional guardian and replay resets its claim ledger',()=>{
 const identity=identityFor('crown','beginner'),progress={version:1 as const,identity,completed:campaignMissions.map(m=>m.id)};
 const m=startCampaignMission(progress,'ridge-convoy','beginner',{player:'crown',enemy:'clans'})!;expect(bossEnemies(m)).toHaveLength(1);m.campaignRun!.phase=4;m.combat.enemies=[];m.gathering.units.find(u=>u.id==='unit-4')!.position={x:1504,y:544};const won=updateMatch(m,0);expect(won.outcome).toBe('victory');expect(won.bosses!.guardians.gravelheart!.hp).toBe(1400);
 const fresh=startCampaignMission(progress,'ridge-convoy','beginner',{player:'crown',enemy:'clans'})!;expect(fresh.bosses!.guardians.gravelheart).toEqual({hp:1400,attackCooldown:0,claimed:false,engaged:false});
});

it('prevents building over a living guardian body and reveals its marker only through current vision',()=>{
 const m=match('bramblemaw'),b=bossDefinitions.bramblemaw;m.gathering.wood=1000;m.gathering.units[0].selected=true;m.gathering.units[0].position={x:b.position.x-100,y:b.position.y};m.fog=matchFog(m);
 expect(visibleMinimapData(m).markers.some(p=>p.id===bossEnemyId('bramblemaw'))).toBe(true);
 expect(placementPreviewError(beginPlacement(m.placement,'farm'),{x:b.position.x-32,y:b.position.y-32},m.gathering.wood,placementObstacles(m.gathering),{map:m.map,gathering:m.gathering,enemies:battleEnemies(m)})).toMatch(/unit/i);
 const hidden=structuredClone(m);hidden.gathering.units[0].position={x:272,y:240};hidden.fog=matchFog(hidden);expect(visibleMinimapData(hidden).markers.some(p=>p.id===bossEnemyId('bramblemaw'))).toBe(false);
});

it('uses normal projectiles to retaliate against aircraft and saves an active encounter in flight',()=>{
 let m=match('bramblemaw'),b=bossDefinitions.bramblemaw;const hp=factions.crown.units.air.hp;
 m.gathering.units=[{id:'unit-4',kind:'soldier',archetype:'air',owner:'player',hp,cargo:0,selected:false,autoDisabled:true,position:{x:b.position.x-96,y:b.position.y},target:b.position,order:{kind:'idle'}}];m.production.nextUnitNumber=5;m.soldierProduction.nextUnitNumber=5;m.fog=matchFog(m);
 m=updateMatch(m,.05);expect(m.bosses!.guardians.bramblemaw!.engaged).toBe(true);expect(m.combat.projectiles?.some(p=>p.shooterId===bossEnemyId('bramblemaw')&&p.airborne)).toBe(true);
 const loaded=decodeSave(encodeSave({...m,paused:true},view));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(!loaded.ok)throw Error(loaded.error);expect(loaded.match.combat.projectiles).toEqual(m.combat.projectiles);
 const attacked=updateMatch({...loaded.match,paused:false},.5);expect(attacked.gathering.units[0].hp).toBeLessThan(hp);expect(bossEnemies(attacked)[0].position).toEqual(b.position);
});
