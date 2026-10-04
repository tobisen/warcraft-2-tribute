import {expect,it} from 'vitest';
import {createMatch,updateMatch} from './match';
import {decodeSave,encodeSave} from './save';
import {createHighscoreStore} from './highscores';
const view={camera:{x:0,y:0},building:null},id='00000000-0000-4000-8000-000000000001';
it('partial and completed match IDs survive Save/load; an actual defeat registers exactly once across loaded result views',()=>{
 const m={...createMatch('skirmish'),matchId:id},partial=decodeSave(encodeSave({...m,paused:true},view));expect(partial.ok).toBe(true);if(!partial.ok)return;expect(partial.match.matchId).toBe(id);
 const ended=updateMatch({...partial.match,paused:false,combat:{...partial.match.combat,baseHP:0}},0);expect(ended.outcome).toBe('defeat');const saved=decodeSave(encodeSave(ended,view));expect(saved.ok).toBe(true);if(!saved.ok)return;
 let data:string|null=null,writes=0;const host={getItem:()=>data,setItem:(_k:string,v:string)=>{writes++;data=v;}},store=createHighscoreStore(()=>host);store.load();store.record(saved.match);store.record(saved.match);const reload=createHighscoreStore(()=>host);reload.load();reload.record(saved.match);expect(writes).toBe(1);expect(reload.get()).toHaveLength(1);expect(saved.match.matchId).toBe(id);
});
it('Save32 migration preserves gameplay without inventing match identity; rejects spoofed legacy IDs and malformed new IDs',()=>{
 const m=createMatch('mission-capture'),doc=JSON.parse(encodeSave(m,view));doc.configVersion='tribute-config-32';const r=decodeSave(JSON.stringify(doc));expect(r.ok).toBe(true);if(r.ok){expect(r.match.matchId).toBeUndefined();expect(r.match.capture).toEqual(m.capture);expect(r.match.gathering).toEqual(m.gathering);}
 doc.state.matchId=id;expect(decodeSave(JSON.stringify(doc)).ok).toBe(false);doc.configVersion='tribute-config-33';doc.state.matchId='bad';expect(decodeSave(JSON.stringify(doc)).ok).toBe(false);
});
