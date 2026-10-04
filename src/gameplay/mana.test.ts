import {expect,it} from 'vitest';
import {factions,factionIds,factionsForPlayer} from '../config/factions';
import {createMatch,updateMatch} from './match';
import {advanceMana,currentMana} from './mana';
import {enqueueProduction,updateQueuedProduction} from './productionQueue';
import {encodeSave,decodeSave} from './save';
import {saveConfig} from '../config/save';
import {selectionInfo} from '../presentation/selectionInfo';
import type {Soldier} from './gathering';
const specialist=(f:typeof factionIds[number],mana?:number):Soldier=>({kind:'soldier',archetype:'specialist',owner:'player',id:'unit-4',hp:factions[f].units.specialist.hp,selected:true,cargo:0,position:{x:400,y:300},target:{x:400,y:300},order:{kind:'idle'},...(mana!==undefined?{mana}:{})});
it.each(factionIds)('%s uses its existing paid/prerequisite specialist with initial mana and selection display',f=>{
 const m=createMatch('skirmish','normal',factionsForPlayer(f)),cfg=factions[f].units.specialist.mana!;m.gathering.wood=200;m.gathering.goldBalance=120;
 const b={kind:'barracks' as const,unitType:'specialist' as const,footprint:{x:512,y:384,width:64,height:64},technology:{buildings:['base','forge','barracks'] as const,research:{attack:1,defense:1}}};
 expect(enqueueProduction(m.gathering,m.soldierProduction,{...b,technology:undefined}).production.remainingSeconds).toBeNull();
 const started=enqueueProduction(m.gathering,m.soldierProduction,b);expect(started.gathering.wood).toBe(200-factions[f].units.specialist.cost.wood);expect(started.gathering.goldBalance).toBe(120-factions[f].units.specialist.cost.gold);
 const done=updateQueuedProduction(started.gathering,started.production,factions[f].units.specialist.durationSeconds,b);const u=done.gathering.units.at(-1)!;expect(u).toMatchObject({archetype:'specialist',mana:cfg.initial});u.selected=true;done.gathering.units.slice(0,-1).forEach(x=>x.selected=false);const info=selectionInfo({...m,gathering:done.gathering},null);expect(info).toMatchObject({name:factions[f].unitNames.specialist,mana:cfg.initial,maxMana:cfg.max});expect(info.portrait!.frame).toContain('specialist');
});
it('uses gameplay delta, caps without healing, preserves orders, stops for pause/end/death and excludes other roles',()=>{
 const m=createMatch('skirmish');m.gathering.units.push(specialist('crown',2));const before=m.gathering.units[3];const next=advanceMana(m,3.5);expect(currentMana(next.gathering.units[3],'crown')).toBe(5.5);expect(next.gathering.units[3]).toMatchObject({hp:before.hp,order:before.order,selected:true});expect(advanceMana(m,200).gathering.units[3]).toMatchObject({mana:100});expect(advanceMana({...m,paused:true},10)).toMatchObject({gathering:{units:m.gathering.units}});expect(advanceMana({...m,outcome:'victory'},10).gathering.units[3]).toBe(before);expect(updateMatch({...m,paused:true},10)).toMatchObject({gathering:{units:m.gathering.units}});const dead={...m,gathering:{...m.gathering,units:[{...before,hp:0}]}};expect(advanceMana(dead,10).gathering.units[0]).toMatchObject({mana:2});expect(next.gathering.units[0]).not.toHaveProperty('mana');
});
it('regenerates enemy and embarked specialists without granting vision or changing cargo',()=>{
 const m=createMatch('skirmish');m.combat.enemies.push({id:'enemy-produced-2',owner:'enemy',kind:'unit',role:'specialist',hp:80,mana:4,position:{x:1000,y:600}});m.navy={harbor:null,production:{remainingSeconds:null,nextUnitNumber:1},ships:[{id:'ship-1',kind:'ship',role:'transport',owner:'player',hp:90,selected:false,position:{x:0,y:0},target:{x:0,y:0},order:{kind:'idle'},passengers:[{...specialist('crown',2),selected:false}]}]};const next=advanceMana(m,2);expect(next.combat.enemies.at(-1)).toMatchObject({mana:6});expect(next.navy!.ships[0].passengers![0]).toMatchObject({mana:4,cargo:0});expect(next.fog).toBe(m.fog);
});
it('roundtrips fractional mana, migrates37, rejects out of bounds, wrong roles and forged legacy mana',()=>{
 const m=createMatch('skirmish');m.gathering.units.push(specialist('crown',12.25));m.production.nextUnitNumber=5;m.soldierProduction.nextUnitNumber=5;const json=encodeSave(m,{camera:{x:0,y:0},building:null}),loaded=decodeSave(json);expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(loaded.ok)expect(loaded.match.gathering.units[3]).toMatchObject({mana:12.25});
 for(const mana of [-1,101,'12',null]){const d=JSON.parse(json);d.state.gathering.units[3].mana=mana;expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}
 const wrong=JSON.parse(json);wrong.state.gathering.units[0].mana=1;expect(decodeSave(JSON.stringify(wrong)).ok).toBe(false);
 const old=JSON.parse(json);old.configVersion='tribute-config-37';expect(decodeSave(JSON.stringify(old)).ok).toBe(false);delete old.state.gathering.units[3].mana;const migrated=decodeSave(JSON.stringify(old));expect(migrated.ok).toBe(true);if(migrated.ok)expect(currentMana(migrated.match.gathering.units[3],'crown')).toBe(60);expect(saveConfig.configVersion).toBe('tribute-config-38');
});
