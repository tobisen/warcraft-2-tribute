import {expect,it} from 'vitest';
import {createMatch} from './match';
import {scoreFor,resultScore,scorePartition,validHighscore,createHighscoreStore,highscoreKey,rankedScores} from './highscores';
const id=(n:number)=>`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const ended=(n=1)=>({...createMatch('skirmish'),matchId:id(n),outcome:'victory' as const});
it('scoring is outcome/time only, floors gameplay seconds, caps long matches and grants no kill/removal/production bonus',()=>{
 expect(scoreFor('victory',10.9)).toBe(13590);expect(scoreFor('victory',4000)).toBe(10000);expect(scoreFor('defeat',1)).toBe(0);
 const m=ended();const score=resultScore(m)!.score;m.statLedger!.player.removed=3;m.production.nextUnitNumber=20;expect(resultScore(m)!.score).toBe(score);expect(resultScore({...m,outcome:'playing'})).toBeNull();expect(resultScore({...m,matchId:undefined})).toBeNull();
});
it('separates campaign/map, difficulty, speed, factions and rules/version while retaining all metadata and statistics',()=>{
 const s=resultScore(ended())!;expect(validHighscore(s)).toBe(true);expect(s.stats.seconds).toBe(s.seconds);expect(s.config).toBe('tribute-config-34');
 for(const patch of [{goal:'forest',map:'forest'},{difficulty:'hard'},{speed:.75},{player:'elves'},{enemy:'dwarves'},{config:'tribute-config-32'}])expect(scorePartition({...s,...patch})).not.toBe(scorePartition(s));
 const campaign={...createMatch('tutorial'),campaignMission:'first-steps' as const,matchId:id(2),outcome:'victory' as const};expect(resultScore(campaign)).toMatchObject({kind:'campaign',goal:'first-steps',map:'arena'});expect(resultScore({...createMatch('survival'),matchId:id(3),outcome:'defeat'})).toBeNull();
});
it('rejects malformed/unknown/non-finite/forged score data and campaign/map mismatch',()=>{
 const s=resultScore(ended())!;
 for(const patch of [{id:'bad'},{model:2},{config:'<script>'},{difficulty:'toString'},{map:'missing'},{player:'missing'},{seconds:Infinity},{score:s.score+1},{extra:true},{stats:{...s.stats,seconds:NaN}},{stats:{...s.stats,player:{...s.stats.player,removed:-1}}},{kind:'campaign',goal:'first-steps',map:'coast'}])expect(validHighscore({...s,...patch}),JSON.stringify(patch)).toBe(false);
});
it('records an ID once across repeated result views/reloads, keeps the first terminal result and isolates storage copies',()=>{
 const memory=new Map<string,string>();let writes=0;const host={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>{writes++;memory.set(k,v);}};
 const store=createHighscoreStore(()=>host);store.load();const m=ended();store.record({...m,outcome:'defeat'});store.record(m);store.record(m);expect(writes).toBe(1);expect(store.get()[0].outcome).toBe('defeat');const reload=createHighscoreStore(()=>host);reload.load();reload.record(m);expect(writes).toBe(1);reload.record(ended(2));expect(reload.get()).toHaveLength(2);reload.get().length=0;expect(reload.get()).toHaveLength(2);expect(store.get()).toHaveLength(1);
});
it('ranking preserves every dedup ID and separates groups; displaying top ten cannot re-register older IDs',()=>{
 const memory=new Map<string,string>(),host={getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>memory.set(k,v)},store=createHighscoreStore(()=>host);store.load();for(let n=1;n<=12;n++)store.record(ended(n));expect(rankedScores(store.get()).slice(0,10)).toHaveLength(10);store.record(ended(12));expect(store.get()).toHaveLength(12);expect(rankedScores(store.get(),scorePartition({...store.get()[0],speed:.75}))).toEqual([]);
});
it('storage failure retains session scores with an honest error; invalid stores reset safely',()=>{
 const store=createHighscoreStore(()=>({getItem(){throw Error('blocked');},setItem(){throw Error('quota');}}));expect(store.load()).toEqual([]);expect(store.error()).toMatch(/read/);store.record(ended());expect(store.get()).toHaveLength(1);expect(store.error()).toMatch(/session only/);store.record(ended());expect(store.get()).toHaveLength(1);
 for(const raw of ['bad JSON',JSON.stringify({version:2,entries:[]}),JSON.stringify({version:1,entries:[resultScore(ended()),resultScore(ended())]}),JSON.stringify({version:1,entries:[],extra:true})]){const s=createHighscoreStore(()=>({getItem:()=>raw,setItem(){}}));expect(s.load()).toEqual([]);expect(s.error()).toMatch(/read/);}
});
