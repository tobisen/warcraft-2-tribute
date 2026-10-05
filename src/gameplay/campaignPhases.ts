import {campaignPlans,type CampaignPhase} from '../config/campaignPhases';
import {scenarioWaves} from '../config/scenarios';
import {operationFor} from '../config/operations';
import {isExplored} from './fog';
import {isAir} from './domains';
import {passengerUnits} from './navy';
import {operationOutcome} from './operations';
import type {MatchState} from './match';
export interface CampaignRun {version:1;phase:number;waveStartedSeconds?:number}
export function campaignPlan(m:MatchState){return m.campaignMission&&m.campaignRun?campaignPlans[m.campaignMission]:undefined;}
export function campaignPhase(m:MatchState){return campaignPlan(m)?.phases[m.campaignRun!.phase];}
export function campaignPhaseMet(m:MatchState,p:CampaignPhase):boolean{
 const land=m.gathering.units.filter(u=>u.kind==='soldier'&&(u.hp??0)>0&&!isAir(u));
 switch(p.goal){
  case 'prepare':return !!m.placement.barracks&&(m.placement.barracksHP??1)>0&&(m.placement.construction?.remainingSeconds??0)===0&&[...land,...passengerUnits(m.navy).filter(u=>u.kind==='soldier'&&(u.hp??0)>0&&!isAir(u))].length>=2;
  case 'explore':return !!m.fog&&p.points!.every(point=>isExplored(m.fog!,'player',point));
  case 'waves':return m.waves.nextWave===scenarioWaves(m.scenario!,m.difficulty!).length&&!m.combat.enemies.some(e=>e.hp>0&&e.kind!=='base');
  case 'position':return p.points!.every(point=>land.some(u=>Math.hypot(u.position.x-point.x,u.position.y-point.y)<=64));
  case 'base':return !m.combat.enemies.some(e=>e.kind==='base'&&e.hp>0);
  case 'transport':return !!m.navy?.harbor&&m.navy.harbor.hp>0&&m.navy.harbor.construction.remainingSeconds===0&&m.navy.ships.some(s=>s.role==='transport'&&s.hp>0);
  case 'guards':return !!operationFor(m.scenario)&&operationFor(m.scenario)!.guards.every(g=>!m.combat.enemies.some(e=>e.id===g.id&&e.hp>0));
  case 'operation':return operationOutcome(m)==='victory';
 }
}
/** Permanent phase completion is also the one-shot transition ledger. No reward respawns. */
export function advanceCampaignPhases(m:MatchState):MatchState{
 const plan=campaignPlan(m);if(!plan||m.combat.baseHP<=0||operationOutcome(m)==='defeat')return m;
 let phase=m.campaignRun!.phase;
 while(phase<plan.phases.length&&campaignPhaseMet(m,plan.phases[phase]))phase++;
 const waveStartedSeconds=plan.phases.some(p=>p.goal==='waves')&&phase>=2?(m.campaignRun!.waveStartedSeconds??m.waves.elapsedSeconds):undefined;
 return phase===m.campaignRun!.phase&&waveStartedSeconds===m.campaignRun!.waveStartedSeconds?m:{...m,campaignRun:{version:1,phase,...(waveStartedSeconds!==undefined?{waveStartedSeconds}:{})}};
}
export function campaignObjective(m:MatchState):string{
 const plan=campaignPlan(m);if(!plan)return '';
 const phase=m.campaignRun!.phase;
 return phase===plan.phases.length?'All campaign objectives complete.':`Phase ${phase+1}/${plan.phases.length} · ${plan.phases[phase].text}${phase>0?' Previous phase complete.':''}`;
}

export function campaignWaveSchedule(m:MatchState){const schedule=scenarioWaves(m.scenario??'survival',m.difficulty??'normal');if(!m.campaignRun||!campaignPlan(m)?.phases.some(p=>p.goal==='waves'))return schedule;const start=m.campaignRun.waveStartedSeconds;return schedule.map(w=>({...w,atSeconds:start===undefined?Infinity:start+w.atSeconds}));}
