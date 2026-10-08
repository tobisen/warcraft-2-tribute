import {placeTower} from './towers';
import {replaceObstacles} from './map';
import {playerTargets} from './targets';
import {expect,it} from 'vitest';
import {createMatch,updateMatch,type MatchState} from './match';
import {dismissProposal,dismissUnits,dismissBuilding} from './dismiss';
import {matchPopulation,createNavy} from './navy';
import {matchStats} from './matchStats';
import {decodeSave,encodeSave} from './save';
import {resourceServices} from './resourceQueue';
import {dismissMessage} from '../presentation/dismiss';
const view={camera:{x:0,y:0},building:null};
it('proposal includes only living selected own units, never buildings or enemies; no selection is a no-op',()=>{
 const m=createMatch();expect(dismissProposal(m)).toBeNull();expect(dismissUnits(m,['base','barracks','enemy-1','missing'])).toBe(m);
 m.gathering.units[0].selected=true;m.gathering.units[1].selected=true;m.gathering.units[1].hp=0;
 expect(dismissProposal(m)).toEqual({ids:['unit-1'],count:1,passengers:0});expect(dismissMessage(dismissProposal(m)!)).toMatch(/Dismiss 1 own unit\?/);
 expect(dismissProposal({...m,paused:true})).toBeNull();expect(dismissUnits({...m,paused:true},['unit-1']).gathering.units).toBe(m.gathering.units);expect(dismissProposal({...m,outcome:'victory'})).toBeNull();
});
it('group dismissal frees supply, preserves surviving orders and bank, and counts removal without deaths or kills',()=>{
 const m=createMatch();m.gathering.units[0].selected=true;m.gathering.units[1].selected=true;m.gathering.units[2].order={kind:'move'};const survivor=m.gathering.units[2];
 m.controlGroups={'1':['unit-1','unit-2','unit-3']};const before=JSON.stringify(m),next=dismissUnits(m,['unit-1','unit-2','unit-2']);
 expect(next.gathering.units).toEqual([survivor]);expect(next.gathering.wood).toBe(m.gathering.wood);expect(matchPopulation(next).used).toBe(1);expect(next.controlGroups).toEqual({'1':['unit-3']});expect(matchStats(next).player).toMatchObject({removed:2,lost:0});expect(matchStats(next).enemy.killed).toBe(0);expect(next.production).toEqual(m.production);expect(next.waves.elapsedSeconds).toBe(0);expect(dismissUnits(next,['unit-1'])).toBe(next);
 expect(JSON.stringify(m)).toBe(before);expect(decodeSave(encodeSave(next,view)).ok).toBe(true);
});
it('carried wood is recorded as lost, never refunded, and dismissed gathering workers have no service assignment',()=>{
 const m=createMatch();const worker=m.gathering.units[0];worker.selected=true;worker.cargo=2;worker.order={kind:'gather',nodeId:m.gathering.node.id};m.gathering.node.remaining-=2;
 const next=dismissUnits(m,[worker.id]);expect(next.gathering.lostCargo).toEqual({wood:2,gold:0});expect(next.gathering.node.remaining).toBe(m.gathering.node.remaining);expect(next.gathering.wood).toBe(m.gathering.wood);expect(resourceServices(next.gathering,next.map,0).has(worker.id)).toBe(false);expect(matchStats(next).player.wood).toMatchObject({gathered:2,delivered:0,spent:0});expect(decodeSave(encodeSave(next,view)).ok).toBe(true);
});
it('dismissed builder pauses construction and removes enemy defense/AI targeting without removing buildings',()=>{
 const m=createMatch('skirmish');m.placement={...m.placement,barracks:{x:528,y:400,width:64,height:64},barracksHP:120,barracksOwner:'player',construction:{remainingSeconds:3,builderId:'unit-1'}};m.gathering.units[0].order={kind:'build',buildingId:'barracks'};m.combat.enemies.push({id:'fixture-defender',kind:'unit',owner:'enemy',role:'soldier',hp:60,position:{x:600,y:400},order:{kind:'defend',targetId:'unit-1'}});m.enemyAI!.threatId='unit-1';
 const next=dismissUnits(m,['unit-1']);expect(next.placement.barracks).toEqual(m.placement.barracks);expect(next.placement.construction).toEqual({remainingSeconds:3,builderId:null});expect(next.combat.enemies.at(-1)!.order).toEqual({kind:'idle'});expect(next.enemyAI!.threatId).toBeNull();expect(matchStats(next).player.removed).toBe(1);expect(next.combat.baseHP).toBe(m.combat.baseHP);
});
it('transport confirmation includes embarked cargo; removal frees all supply, loses gold and gives no kill credit',()=>{
 const m=createMatch('mission-sea');m.navy=createNavy();const passenger=m.gathering.units.shift()!;if(passenger.kind!=='worker')throw Error('Expected worker');passenger.cargo=3;passenger.cargoType='gold';m.gathering.gold!.remaining-=3;
 m.navy.ships=[{id:'ship-1',owner:'player',kind:'ship',role:'transport',hp:90,selected:true,position:{x:720,y:432},target:{x:720,y:432},order:{kind:'idle'},passengers:[passenger]}];m.navy.production.nextUnitNumber=2;m.controlGroups={'1':['ship-1']};
 const proposal=dismissProposal(m)!;expect(proposal).toEqual({ids:['ship-1'],count:2,passengers:1});expect(dismissMessage(proposal)).toMatch(/Includes 1 embarked passenger/);
 const used=matchPopulation(m).used,next=dismissUnits(m,proposal.ids);expect(next.navy!.ships).toEqual([]);expect(matchPopulation(next).used).toBeLessThan(used);expect(next.gathering.lostCargo).toEqual({wood:0,gold:3});expect(matchStats(next).player).toMatchObject({removed:2,lost:0});expect(matchStats(next).enemy.killed).toBe(0);expect(next.controlGroups).toEqual({'1':[]});expect(next.gathering.goldBalance).toBe(m.gathering.goldBalance);expect(decodeSave(encodeSave(next,view)).ok).toBe(true);
});
it('dismissing the named courier triggers defeat while remaining a removal, not a kill',()=>{const m=createMatch('mission-escort','normal',{player:'clans',enemy:'dwarves'}),next=dismissUnits(m,['unit-4']);expect(next.outcome).toBe('defeat');expect(matchStats(next).player).toMatchObject({removed:1,lost:0});expect(matchStats(next).enemy.killed).toBe(0);expect(updateMatch(next,100)).toBe(next);expect(decodeSave(encodeSave(next,view)).ok).toBe(true);});
it('dismissal of the last banner holder resets capture immediately, without advancing time',()=>{let m:MatchState=createMatch('mission-capture');m.combat.enemies=[];m.gathering.units.push({id:'unit-4',kind:'soldier',owner:'player',hp:60,selected:true,cargo:0,position:{x:1600,y:384},target:{x:1600,y:384},order:{kind:'idle'}});m.production.nextUnitNumber=m.soldierProduction.nextUnitNumber=5;m=updateMatch(m,7);expect(m.capture?.holdSeconds).toBe(7);const next=dismissUnits(m,['unit-4']);expect(next.capture?.holdSeconds).toBe(0);expect(next.waves.elapsedSeconds).toBe(7);expect(next.outcome).toBe('playing');});

it('demolishes every own building/site through normal cleanup without refund or deleting units',()=>{
 for(const id of ['barracks','forge','academy','stable','aviary','siegeWorks','farm-1','base-1','wall-1','gate-1','tower-1','harbor'] as const){
  const m=createMatch('skirmish'),footprint={x:640,y:448,width:64,height:64},construction={remainingSeconds:3,builderId:m.gathering.units[0].id},production={remainingSeconds:4,nextUnitNumber:4,queue:[{id:'job-1',kind:'worker' as const,cost:{wood:50,gold:0},durationSeconds:4,remainingSeconds:4}]};
  const site={id,owner:'player' as const,hp:100,footprint,construction,production};
  if(id==='barracks') {m.placement={...m.placement,barracks:footprint,barracksHP:100,construction};m.soldierProduction=production;}
  else if(id==='harbor')m.navy={...createNavy(),harbor:site,production};
  else if(id==='farm-1')m.placement.farms=[{...site,id:'farm-1'}];
  else if(id==='base-1')m.placement.bases=[{...site,id:'base-1'}];
  else if(id==='wall-1'||id==='gate-1'||id==='tower-1')m.placement.defenses=[{...site,id,kind:id==='wall-1'?'wall':id==='gate-1'?'gate':'tower',level:1,upgradeRemaining:null,cooldown:0}];
  else m.placement={...m.placement,[id]:site};
  m.map=replaceObstacles(m.map,[...m.map.obstacles,footprint]);m.gathering.units[0].order={kind:'build',buildingId:id};
  if(id==='forge'){m.placement.forge!.construction.remainingSeconds=0;m.research!.job={kind:'attack',remainingSeconds:5};}
  const before=JSON.stringify(m),proposal=dismissProposal(m,id)!;expect(proposal.building).toBe(id);expect(dismissMessage(proposal)).toContain('No refund');
  const next=dismissBuilding(m,id);expect(playerTargets(next.gathering,next.combat,next.placement,next.navy).some(t=>t.id===id)).toBe(false);
  if(id==='forge')expect(next.research!.job).toBeNull();if(id==='barracks')expect(next.soldierProduction.queue).toEqual([]);if(id==='harbor')expect(next.navy!.production.queue).toEqual([]);
  expect(next.map.obstacles).not.toContainEqual(footprint);expect(next.gathering.units[0].order).toEqual({kind:'idle'});expect(next.gathering.units).toHaveLength(m.gathering.units.length);expect(next.gathering.wood).toBe(m.gathering.wood);expect(next.gathering.goldBalance).toBe(m.gathering.goldBalance);expect(next.waves.elapsedSeconds).toBe(0);expect(matchStats(next).enemy.killed).toBe(matchStats(m).enemy.killed);expect(JSON.stringify(m)).toBe(before);expect(dismissBuilding(next,id)).toBe(next);
 }
});
it('revalidates own building IDs, blocks paused/ended/enemy demolition and warns before defeat',()=>{
 const m=createMatch('skirmish');expect(dismissProposal(m,'enemy:enemy-base')).toBeNull();expect(dismissBuilding(m,'enemy:enemy-base')).toBe(m);expect(dismissBuilding(m,'wall-999')).toBe(m);
 const paused={...m,paused:true};expect(dismissBuilding(paused,'base')).toBe(paused);const ended={...m,outcome:'victory' as const};expect(dismissBuilding(ended,'base')).toBe(ended);
 expect(dismissMessage(dismissProposal(m,'base')!)).toContain('defeat');expect(dismissBuilding(m,'base').outcome).toBe('defeat');
});
it('demolished paid fortification survives Save/Load as removed, including released builder and obstacles',()=>{
 const m=createMatch('skirmish');m.gathering.wood=100;m.gathering.units[0].selected=true;m.placement={...m.placement,active:true,kind:'wall'};const paid=placeTower(m,{x:480,y:384}),next=dismissBuilding(paid,'wall-1');
 expect(next.gathering.wood).toBe(90);expect(next.placement.defenses).toEqual([]);const loaded=decodeSave(encodeSave(next,view));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(loaded.ok){expect(loaded.match.placement.defenses).toEqual([]);expect(loaded.match.gathering.units[0].order).toEqual({kind:'idle'});}
});
