import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {updateEnemyAI,createEnemyAI} from './enemyAI';
import {enemyAIConfig} from '../config/enemyAI';
import {describe,it,expect} from 'vitest';
import {aiProfiles,profileAISettings,type AIProfileId} from '../config/aiProfiles';
import {difficultyProfiles} from '../config/difficulty';
import {createMatch,updateMatch} from './match';
import {createSession,changeOptions} from './session';
import {encodeSave,decodeSave} from './save';
import {enemyPriority} from './enemyPolicy';
import {wantsEnemyExpansion} from './enemyExpansion';
import {prepareEnemyConstruction} from './enemyConstruction';
import {resultScore,scorePartition,validHighscore} from './highscores';
import {validatePreferences} from '../presentation/preferences';
const view={camera:{x:0,y:0},building:null};
function ready(){const m=prepareEnemyConstruction(createMatch('skirmish'));delete m.enemyKnowledge;const bar=m.combat.enemies.find(e=>e.buildingType==='barracks')!;bar.construction={remainingSeconds:0,builderId:null};for(const e of m.combat.enemies)if(e.work)e.work.order={kind:'idle'};m.combat.enemies.push({id:'enemy-forge',kind:'building',buildingType:'forge',owner:'enemy',hp:100,position:{x:1100,y:500},footprint:{x:1068,y:468,width:64,height:64},construction:{remainingSeconds:0,builderId:null}},...Array.from({length:3},(_,i)=>({id:`enemy-produced-${i+1}`,kind:'unit' as const,owner:'enemy' as const,hp:36,position:{x:900+i*32,y:500},order:{kind:'idle' as const}})));return m;}
describe('AI behavior separately from difficulty',()=>{
 it('keeps standard settings unchanged and makes three distinct attack/defense profiles',()=>{
  for(const difficulty of Object.values(difficultyProfiles)){const base=difficulty.ai;expect(profileAISettings(base)).toEqual(base);const defensive=profileAISettings(base,'defensive'),offensive=profileAISettings(base,'offensive'),economic=profileAISettings(base,'economic');expect(offensive.firstAttackSeconds).toBeLessThan(base.firstAttackSeconds);expect(defensive.firstAttackSeconds).toBeGreaterThan(base.firstAttackSeconds);expect(economic.firstAttackSeconds).toBeGreaterThan(defensive.firstAttackSeconds);expect(defensive.maxDefenders).toBeGreaterThan(offensive.maxDefenders);expect(defensive.reserveCount).toBeGreaterThan(offensive.reserveCount);}
 });
 it('changes paid production/research/expansion priorities using own state',()=>{
  const m=ready();expect(enemyPriority(m)).toBe('attack');m.aiProfile='offensive';expect(enemyPriority(m)).toBe('army');m.aiProfile='economic';expect(wantsEnemyExpansion(m)).toBe(true);expect(enemyPriority(m)).toBe('expansion');m.aiProfile='defensive';expect(enemyPriority(m)).toBe('army');m.combat.enemies.push(...[4,5,6].map(i=>({id:`enemy-produced-${i}`,hp:36,position:{x:900,y:600},order:{kind:'idle' as const}})));m.combat.enemies.push({id:'enemy-farm-1',kind:'building',buildingType:'farm',owner:'enemy',hp:100,position:{x:1050,y:650},footprint:{x:1018,y:618,width:64,height:64},construction:{remainingSeconds:0,builderId:null}});expect(enemyPriority(m)).toBe('defense');m.enemyPolicy!.research={attack:1,defense:1,job:null};expect(wantsEnemyExpansion(m)).toBe(true);
 });
 it.each(Object.keys(aiProfiles) as AIProfileId[])('preserves %s through options, Save/load and deterministic updates',id=>{
  let session=createSession({scenario:'skirmish',difficulty:'hard',map:'arena'});session=changeOptions(session,{aiProfile:id});expect(session.options.difficulty).toBe('hard');expect(session.options.aiProfile).toBe(id);
  const m=createMatch('skirmish','hard',undefined,'arena',1,id);const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok).toBe(true);if(loaded.ok)expect(loaded.match.aiProfile??'balanced').toBe(id);
  const run=()=>{let n=structuredClone(m);for(let i=0;i<80;i++)n=updateMatch(n,.5);return n;};expect(run()).toEqual(run());
  expect(validatePreferences({game:{aiProfile:id,difficulty:'easy'}}).game).toMatchObject({aiProfile:id,difficulty:'easy'});
 });
 it('dispatches the same ready group earlier for Offensive and holds it for Defensive/Economic',()=>{
  const m=createMatch('skirmish'),combat={...m.combat,enemies:[...m.combat.enemies,{id:'enemy-produced-1',hp:36,position:{x:896,y:320},order:{kind:'idle' as const}}]},state={...createEnemyAI(),elapsedSeconds:50,groups:[{id:'enemy-group-1',status:'ready' as const,members:['enemy-produced-1'],destinations:{'enemy-produced-1':{x:896,y:320}},startedAt:0}]};
  for(const id of ['offensive','defensive','economic'] as const){const settings={...profileAISettings(enemyAIConfig,id),reserveCount:0};const next=updateEnemyAI(state,combat,m.map,m.gathering.base,0,[],settings);expect(next.state.groups[0].status).toBe(id==='offensive'?'attack':'ready');}
 });
 it('validates profile IDs, migrates legacy defaults and partitions scores by behavior',()=>{
  const m=createMatch('skirmish'),raw=JSON.parse(encodeSave(m,view));legacyTerrainFixture(raw);raw.configVersion='tribute-config-43';expect(decodeSave(JSON.stringify(raw)).ok).toBe(true);legacyTerrainFixture(raw);raw.configVersion='tribute-config-44';raw.state.aiProfile='invented';expect(decodeSave(JSON.stringify(raw)).ok).toBe(false);
  m.matchId='00000000-0000-4000-8000-000000000001';m.outcome='victory';const base=resultScore(m)!;m.aiProfile='economic';const economic=resultScore(m)!;expect(validHighscore(economic)).toBe(true);expect(scorePartition(economic)).not.toBe(scorePartition(base));
 });
});
