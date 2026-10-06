import {canReachFootprint} from '../approach';
import {playExpandedCampaign} from './expandedCampaign';
import {matchStats} from '../matchStats';
import {canAttackDomain} from '../domains';
import {campaignMission,campaignMissions,campaignPreset,type CampaignMissionId} from '../../config/campaign';
import {startCampaignMission} from '../campaign';
import {technologyFor} from '../productionPrerequisites';
import {startResearch} from '../research';
import {maps,type MapId} from '../../config/maps';
import {factionsForPlayer,factions,type FactionId} from '../../config/factions';
import {useAbility} from '../abilities';
import { createClassicMatch as createMatch } from './classicMatch';
import { updateMatch, type MatchState } from '../match';
import { resourceNodes,orderUnits } from '../gathering';
import { orderAttack } from '../combat';
import { commandGroupMove } from '../groupMovement';
import { commandAttackMove } from '../attackMove';
import { beginPlacement, placeBuilding, placementObstacles } from '../placement';
import { barracksReady, resumeConstruction } from '../construction';
import { enqueueProduction } from '../productionQueue';
import { populationState } from '../population';
import { entityVisible, knownResource, placementVisible } from '../visibility';
import { scenarioConfig, type MatchScenario } from '../../config/scenarios';
import type { Difficulty } from '../../config/difficulty';
import { encodeSave, decodeSave } from '../save';

/** Deterministic accelerated release playthrough. Only player commands change state;
 * no injected resources/units/HP, and target decisions use player vision. */
export function releasePlaythrough(scenario: MatchScenario, difficulty: Difficulty, observe?: (match: MatchState) => void,options?:{campaignMission?:CampaignMissionId;enemyFaction?:FactionId;faction?:FactionId;abilities?:boolean;map?:MapId}) {
  if(options?.campaignMission&&options.campaignMission!=='first-steps'){const result=playExpandedCampaign(options.campaignMission,difficulty),stats=matchStats(result.match);observe?.(result.match);return {match:result.match,spentWood:stats.player.wood.spent,spentGold:stats.player.gold.spent,saved:result.saved,abilitiesUsed:result.abilities};}
  const faction=campaignPreset(options?.campaignMission)?.player??options?.faction??'crown';
  const explicitFaction=options?.faction!==undefined||options?.campaignMission!==undefined;
  let match = createMatch(scenario, difficulty,factionsForPlayer(faction,options?.enemyFaction),options?.map??'arena'), spentWood = 0, spentGold = 0, saved = false,abilitiesUsed=0;
  if(options?.campaignMission){const definition=campaignMission(options.campaignMission)!;if(definition.scenario!==scenario)throw Error('Campaign scenario mismatch');const prior=campaignMissions.slice(0,campaignMissions.indexOf(definition)).map(m=>m.id);match=startCampaignMission({version:1,completed:prior},definition.id,difficulty,match.factions!)!;}
  let observedAir=false;
  const retreatUntil = new Map<string, number>();
  const select = (id: string) => { match.gathering.units = match.gathering.units.map(u => ({ ...u, selected: u.id === id })); };
  for (let frame = 0; frame < 6000 && match.outcome === 'playing'; frame++) {
    if (frame % 4 === 0) {
      const visible = match.combat.enemies.filter(e => entityVisible(match.fog!, 'player', e));
      const army = match.gathering.units.filter(u => u.kind === 'soldier');
      const pending = match.soldierProduction.queue?.length ?? 0;
      const modern=match.enemyProduction?.roster===true;
      observedAir ||= modern&&visible.some(e=>e.role==='air');
      const needsAA=observedAir&&army.filter(u=>u.kind==='soldier'&&u.archetype==='archer').length+(match.soldierProduction.queue??[]).filter(j=>j.kind==='archer').length<2;
      const tech=modern&&difficulty==='hard'&&match.map.id!=='river',definition=factions[faction];
      const armyLimit=observedAir?6:tech?4:modern?6:4;
      const assaultReady=army.length>=(tech?4:modern?5:3)||(modern?army.length>=2&&match.waves.elapsedSeconds>=210:army.length>=(explicitFaction?1:2)&&match.waves.elapsedSeconds>=120);
      const goldNeeded = needsAA?definition.units.archer.cost.gold:tech?Math.max(definition.units.soldier.cost.gold,!match.placement.forge?definition.buildings.forge.cost.gold:0,match.research!.defense?0:definition.upgrades.defense.cost.gold,army.length>=4&&!match.research!.attack?definition.upgrades.attack.cost.gold:0):Math.max(0,armyLimit-army.length-pending)*definition.units.soldier.cost.gold;
      for (const worker of [...match.gathering.units].filter(u => u.kind === 'worker')) {
        select(worker.id);
        const threatened = visible.some(e => (modern?!e.footprint&&e.kind!=='worker'&&e.kind!=='ship'&&e.order?.kind!=='idle'&&e.order?.kind!=='muster':e.kind !== 'base') && Math.hypot(e.position.x - worker.position.x, e.position.y - worker.position.y) < 160);
        if (threatened && (modern||worker.hp! < (explicitFaction?24:10)) && worker.order.kind !== 'build') retreatUntil.set(worker.id, match.waves.elapsedSeconds + 5);
        if ((retreatUntil.get(worker.id) ?? 0) > match.waves.elapsedSeconds) {
          if (worker.order.kind !== 'move' && Math.hypot(worker.position.x - 250, worker.position.y - 450) > 40)
            match.gathering.units = commandGroupMove(match.gathering.units, { x: 250, y: 450 }, match.map);
          continue;
        }
        if (worker.order.kind === 'build') continue;
        const goldWorker = match.gathering.units.filter(u => u.kind === 'worker').at(-1)?.id;
        const node = (barracksReady(match.placement)||(modern||explicitFaction)&&!!match.placement.barracks) && worker.id === goldWorker && (match.gathering.goldBalance ?? 0) < goldNeeded ? match.gathering.gold! : resourceNodes(match.gathering).find(n=>(n.resource??'wood')==='wood'&&n.remaining>0&&knownResource(match.fog!,n.position)&&(!n.tree||canReachFootprint(match.map,worker.position,{x:n.position.x-16,y:n.position.y-16,width:32,height:32},24)))??match.gathering.node;
        if (!knownResource(match.fog!, node.position)) {
          if (worker.order.kind !== 'move') match.gathering.units = commandGroupMove(match.gathering.units, node.resource === 'gold' ? { x: 780, y: 240 } : { x: 600, y: 220 }, match.map);
        } else if (!('nodeId' in worker.order) || !resourceNodes(match.gathering).some(n=>n.id===('nodeId' in worker.order?worker.order.nodeId:undefined)&&n.remaining>0&&(n.resource??'wood')===(node.resource??'wood'))) {
          match.gathering.units = orderUnits(match.gathering.units, node.position, node);
        }
      }
      if(tech&&match.gathering.units.filter(u=>u.kind==='worker').length<4&&match.production.remainingSeconds===null){
        const trained=enqueueProduction(match.gathering,match.production,{kind:'base'},populationState(match.gathering,match.placement,[match.production,match.soldierProduction]));spentWood+=match.gathering.wood-trained.gathering.wood;spentGold+=(match.gathering.goldBalance??0)-(trained.gathering.goldBalance??0);match={...match,gathering:trained.gathering,production:trained.production};
      }
      if (!match.placement.barracks && match.gathering.wood >= factions[faction].buildings.barracks.cost.wood && placementVisible(match.fog!, { x: 512, y: 384, width: 64, height: 64 })) {
        const workers=match.gathering.units.filter(u=>u.kind==='worker');
        const builder = modern||explicitFaction?workers[0]:workers.at(-1);
        if (builder) {
          select(builder.id);
          const placed = placeBuilding(beginPlacement(match.placement), { x: 512, y: 384 }, match.gathering.wood, placementObstacles(match.gathering), { map: match.map, gathering: match.gathering, enemies: visible });
          if (placed.gathering && placed.map) { spentWood += factions[faction].buildings.barracks.cost.wood; match = { ...match, map: placed.map, gathering: placed.gathering, placement: placed.placement }; }
        }
      }
      if (match.placement.construction && match.placement.construction.remainingSeconds > 0 && !match.gathering.units.some(u => u.order.kind === 'build')) {
        const worker = match.gathering.units.find(u => u.kind === 'worker' && (retreatUntil.get(u.id) ?? 0) <= match.waves.elapsedSeconds);
        if (worker) { select(worker.id); match = { ...match, ...resumeConstruction(match.gathering, match.placement, match.map) }; }
      }
      if(modern&&armyLimit>4&&barracksReady(match.placement)&&!match.placement.farms?.length&&army.length+pending>=4&&match.gathering.wood>=factions[faction].buildings.farm.cost.wood){
        const builder=match.gathering.units.find(u=>u.kind==='worker'&&u.order.kind!=='build');
        if(builder){select(builder.id);const placed=placeBuilding(beginPlacement(match.placement,'farm'),{x:448,y:512},match.gathering.wood,placementObstacles(match.gathering),{map:match.map,gathering:match.gathering,enemies:visible});
          if(placed.gathering&&placed.map){spentWood+=match.gathering.wood-placed.gathering.wood;spentGold+=(match.gathering.goldBalance??0)-(placed.gathering.goldBalance??0);match={...match,map:placed.map,gathering:placed.gathering,placement:placed.placement};}}
      }
      if(tech&&army.length+pending>=3&&!match.placement.forge&&match.gathering.wood>=definition.buildings.forge.cost.wood){
        const builder=match.gathering.units.find(u=>u.kind==='worker'&&u.order.kind!=='build');
        if(builder){select(builder.id);for(const point of [{x:608,y:384},{x:544,y:512},{x:480,y:256}]){const placed=placeBuilding(beginPlacement(match.placement,'forge'),point,match.gathering.wood,placementObstacles(match.gathering),{map:match.map,gathering:match.gathering,enemies:visible});if(placed.gathering&&placed.map){spentWood+=match.gathering.wood-placed.gathering.wood;spentGold+=(match.gathering.goldBalance??0)-(placed.gathering.goldBalance??0);match={...match,map:placed.map,gathering:placed.gathering,placement:placed.placement};break;}}}
      }
      if(tech&&match.placement.forge?.construction.remainingSeconds===0&&!match.research!.job&&(!match.research!.defense||army.length>=4)){
        const kind=match.research!.defense<1?'defense':'attack';
        const started=startResearch(match.gathering,match.research!,match.placement,kind);spentWood+=match.gathering.wood-started.gathering.wood;spentGold+=(match.gathering.goldBalance??0)-(started.gathering.goldBalance??0);match={...match,gathering:started.gathering,research:started.research};
      }
      if (barracksReady(match.placement) && army.length + pending < armyLimit&&(!tech||army.length+pending<3||match.research!.defense>0)) {
        const queued = enqueueProduction(match.gathering, match.soldierProduction, { kind: 'barracks', footprint: match.placement.barracks,technology:technologyFor(match,'player'),unitType:needsAA?'archer':'soldier' }, populationState(match.gathering, match.placement, [match.production, match.soldierProduction]));
        spentWood += match.gathering.wood - queued.gathering.wood; spentGold += (match.gathering.goldBalance ?? 0) - (queued.gathering.goldBalance ?? 0);
        match = { ...match, gathering: queued.gathering, soldierProduction: queued.production };
      }
      for (const soldier of army) {
        select(soldier.id);
        const target = visible.filter(e=>canAttackDomain(soldier,e,faction)).filter(e => modern?(assaultReady||tech&&e.kind==='worker'&&e.work?.order.kind==='gather'&&Math.hypot(e.position.x-match.gathering.node.position.x,e.position.y-match.gathering.node.position.y)<=80||!e.footprint&&e.kind!=='worker'&&e.kind!=='ship'&&e.order?.kind!=='idle'&&e.order?.kind!=='muster'&&(Math.hypot(e.position.x-match.gathering.base.x,e.position.y-match.gathering.base.y)<240||match.gathering.units.some(u=>u.kind==='worker'&&Math.hypot(e.position.x-u.position.x,e.position.y-u.position.y)<140))):assaultReady||Math.hypot(e.position.x-match.gathering.base.x,e.position.y-match.gathering.base.y)<240||explicitFaction&&match.gathering.units.some(u=>u.kind==='worker'&&Math.hypot(e.position.x-u.position.x,e.position.y-u.position.y)<140)).sort((a,b) => (modern?(soldier.kind==='soldier'&&soldier.archetype==='archer'&&a.role==='air'?-1:a.role==='catapult'?0:a.role?1:a.kind==='worker'?2:a.kind==='base'?4:3)-(soldier.kind==='soldier'&&soldier.archetype==='archer'&&b.role==='air'?-1:b.role==='catapult'?0:b.role?1:b.kind==='worker'?2:b.kind==='base'?4:3):Number(a.kind === 'base') - Number(b.kind === 'base')) || Math.hypot(a.position.x - soldier.position.x,a.position.y - soldier.position.y) - Math.hypot(b.position.x - soldier.position.x,b.position.y - soldier.position.y))[0];
        if((options?.abilities||modern)&&target&&Math.hypot(target.position.x-soldier.position.x,target.position.y-soldier.position.y)<80){const next=useAbility(match.gathering);if(next!==match.gathering)abilitiesUsed++;match.gathering=next;}
        if (target && (soldier.order.kind !== 'attack' || soldier.order.enemyId !== target.id)) match.gathering.units = orderAttack(match.gathering.units, target.id);
        else if(modern&&match.map.id==='river'&&!target&&!assaultReady&&Math.hypot(soldier.position.x-400,soldier.position.y-450)>40)match.gathering.units=commandGroupMove(match.gathering.units,{x:400,y:450},match.map);
        else if(tech&&!target&&!assaultReady&&soldier.order.kind==='attack'&&match.combat.enemies.find(e=>soldier.order.kind==='attack'&&e.id===soldier.order.enemyId)?.kind==='worker')match.gathering.units=commandGroupMove(match.gathering.units,{x:match.gathering.node.position.x-80,y:match.gathering.node.position.y+80},match.map);
        else if (!target && assaultReady && scenarioConfig[scenario].victory === 'enemy-base' && soldier.order.kind === 'idle') match.gathering.units = commandAttackMove(match.gathering.units, maps[match.map.id??'arena'].attackEntry??{ x: 896, y: 192 }, match.map);
      }
    }
    match = updateMatch(match, .05);
    if (observe && (frame % 20 === 0 || match.outcome !== 'playing')) observe(match);
    if (!saved && (scenario==='tutorial'?match.tutorial?.step===3:match.waves.elapsedSeconds>=45)) {
      match.paused = true;
      if (updateMatch(match, 100) !== match) throw Error('pause advanced simulation');
      const loaded = decodeSave(encodeSave(match, { camera: { x: 240, y: 180 }, building: 'base' }));
      if (!loaded.ok) throw Error(loaded.error);
      match = loaded.match; match.paused = false; saved = true;
    }
  }
  return { match, spentWood, spentGold, saved,abilitiesUsed };
}
