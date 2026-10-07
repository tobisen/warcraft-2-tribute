import {expect,it} from 'vitest';import {combatAudioSnapshot,combatAudioCues,combatDistanceGain,type CombatAudioSnapshot} from './combatAudio';
import {createMatch} from '../gameplay/match';
const p={x:400,y:400},base:CombatAudioSnapshot={bodies:[{id:'victim',hp:40,position:p,building:false},{id:'forge',hp:100,position:p,building:true}],attacks:[{id:'melee',position:p,visible:true,cooldown:0,sound:'melee',target:'victim',range:32},{id:'archer',position:p,visible:true,cooldown:0,sound:'bow',range:180},{id:'siege',position:p,visible:true,cooldown:0,sound:'siege',range:220},{id:'ship',position:p,visible:true,cooldown:0,sound:'cannon',range:220}],shots:[]};
it('distinct damage, melee, arrows, siege and cannon events coalesce at closest distance',()=>{const next=structuredClone(base);next.bodies.forEach(b=>b.hp--);next.attacks.forEach(a=>{if(a.sound!=='melee')a.cooldown=1;});expect(combatAudioCues(base,next,p,true).map(c=>c.sound)).toEqual(['impact','buildingHit','melee','bow','siege','cannon']);expect(combatAudioCues(base,next,p,true).every(c=>c.gain===1)).toBe(true);});
it('silences initial, pause, reveal, unchanged attack/approach and out-of-earshot activity',()=>{const fresh=structuredClone(base);fresh.attacks.forEach(a=>a.cooldown=1);expect(combatAudioCues(undefined,fresh,p,true)).toEqual([]);expect(combatAudioCues(base,fresh,p,false)).toEqual([]);expect(combatAudioCues({bodies:[],attacks:[],shots:[]},fresh,p,true)).toEqual([]);expect(combatAudioCues(base,base,p,true)).toEqual([]);expect(combatAudioCues(base,fresh,{x:5000,y:5000},true)).toEqual([]);expect(combatDistanceGain(p,{x:1100,y:400})).toBeGreaterThan(0);expect(combatDistanceGain(p,{x:1100,y:400})).toBeLessThan(1);});
it('a new projectile sounds once; revealing an existing flight is silent',()=>{const next=structuredClone(base);next.shots=[{id:'arrow-1',shooter:'archer',visible:true}];expect(combatAudioCues(base,next,p,true).map(c=>c.sound)).toEqual(['bow']);expect(combatAudioCues(next,next,p,true)).toEqual([]);const hidden=structuredClone(next);hidden.shots[0]!.visible=false;expect(combatAudioCues(hidden,next,p,true)).toEqual([]);});

it('distinguishes final building destruction from a hit and never repeats it',()=>{
 const next=structuredClone(base);next.bodies[1]!.hp=0;
 expect(combatAudioCues(base,next,p,true).map(c=>c.sound)).toEqual(['destruction']);
 expect(combatAudioCues(next,next,p,true)).toEqual([]);
 const removed={...base,bodies:base.bodies.filter(b=>!b.building),destroyed:[{id:'forge',position:p}]};
 expect(combatAudioCues(base,removed,p,true).map(c=>c.sound)).toEqual(['destruction']);
 expect(combatAudioCues(removed,removed,p,true)).toEqual([]);
 expect(combatAudioCues(base,removed,p,false)).toEqual([]);
});
it('a formerly seen building disappearing in fog is silent; visible actual removal sounds once',()=>{
 const m=createMatch();m.fog!.teams.player.visible.fill(true);
 m.combat.enemies.push({id:'enemy-forge-audio',kind:'building',buildingType:'forge',hp:50,position:p,footprint:{x:384,y:384,width:32,height:32}});
 const before=combatAudioSnapshot(m);
 m.fog!.teams.player.visible.fill(false);const hidden=combatAudioSnapshot(m,before);
 expect(hidden.destroyed).toEqual([]);expect(combatAudioCues(before,hidden,p,true)).toEqual([]);
 m.fog!.teams.player.visible.fill(true);const revealed=combatAudioSnapshot(m,hidden);
 expect(combatAudioCues(hidden,revealed,p,true)).toEqual([]);
 m.combat.enemies=m.combat.enemies.filter(e=>e.id!=='enemy-forge-audio');
 const removed=combatAudioSnapshot(m,revealed);expect(removed.destroyed).toEqual([{id:'enemy-forge-audio',position:p}]);
 expect(combatAudioCues(revealed,removed,p,true).map(c=>c.sound)).toEqual(['destruction']);
 expect(combatAudioSnapshot(m,removed).destroyed).toEqual([]);
});
