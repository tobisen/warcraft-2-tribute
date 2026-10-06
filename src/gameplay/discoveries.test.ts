import {createClassicMatch} from './testHelpers/classicMatch';
import {factions} from '../config/factions';
import {expect,it} from 'vitest';
import {maps,type MapId} from '../config/maps';
import {mapDiscoveries,discoveryConfig} from '../config/discoveries';
import {createMatch,updateMatch} from './match';
import {updateDiscoveries,discoveryBonus} from './discoveries';
import {visibleDiscoveries} from '../presentation/discoveries';
import {visibleMinimapData} from '../presentation/minimap';
import {matchFog} from './matchFog';
import {bodyFits,replaceObstacles} from './map';
import {isVisible} from './fog';
import {matchStats} from './matchStats';
import {encodeSave,decodeSave} from './save';
import {matchPopulation} from './navy';
const view={camera:{x:0,y:0},building:null} as const;
function fixture(id:MapId='frontier'){return createMatch('skirmish','beginner',undefined,id);}
function scout(m:ReturnType<typeof fixture>,index:number){const d=mapDiscoveries(m.map.id!,m.map.design)[index];m.gathering.units[0]={...m.gathering.units[0],position:{...d.position},target:{...d.position},order:{kind:'idle'}};m.fog=matchFog(m);return d;}
it('authors hidden body-safe sites on every expanded map without changing campaign admission',()=>{
 for(const id of Object.keys(maps) as MapId[]){const m=fixture(id),finds=mapDiscoveries(id,'regions');expect(finds).toHaveLength(3);expect(new Set(finds.map(d=>d.id)).size).toBe(3);for(const d of finds){expect(bodyFits(m.map,d.position,20)).toBe(true);expect(isVisible(m.fog!,'player',d.position),`${id}/${d.id}`).toBe(false);}expect(visibleDiscoveries(m)).toEqual([]);expect(visibleMinimapData(m).markers.some(d=>d.id.includes('discovery'))).toBe(false);expect(updateDiscoveries(m)).toBe(m);}
 expect(createMatch('mission-waves').discoveries).toBeUndefined();
});
it('requires actual vision and ground proximity, then credits exactly one finite reward',()=>{
 const m=fixture(),d=mapDiscoveries('frontier','regions')[0];m.gathering.units[0].position={...d.position};expect(updateDiscoveries(m)).toBe(m);m.fog=matchFog(m);const next=updateDiscoveries(m);expect(next.gathering.wood-m.gathering.wood).toBe(20);expect(next.gathering.goldBalance!-m.gathering.goldBalance!).toBe(10);expect(discoveryBonus(next)).toEqual({wood:20,gold:10});expect(updateDiscoveries(next)).toBe(next);expect(matchStats(next).player.wood).toEqual({gathered:0,delivered:0,spent:0});expect(visibleDiscoveries(next).find(f=>f.id===d.id)?.opened).toBe(true);
 const distant=fixture();distant.gathering.units[0].position={x:d.position.x-100,y:d.position.y};distant.fog=matchFog(distant);expect(isVisible(distant.fog!,'player',d.position)).toBe(true);expect(updateDiscoveries(distant)).toBe(distant);
});
it('does not collect during pause, after defeat, or merely through a flying scout',()=>{
 const m=fixture(),d=scout(m,0);expect(updateDiscoveries({...m,paused:true})).toMatchObject({discoveries:{claimed:[]}});expect(updateDiscoveries({...m,outcome:'defeat'})).toMatchObject({discoveries:{claimed:[]}});
 m.gathering.units[0]={id:'unit-1',kind:'soldier',archetype:'air',hp:100,cargo:0,selected:false,position:d.position,target:d.position,order:{kind:'idle'}};m.fog=matchFog(m);expect(updateDiscoveries(m)).toBe(m);
});
it('recruits one faction soldier with normal IDs, population and added/lost accounting',()=>{
 const m=fixture();scout(m,2);const before=matchPopulation(m),next=updateDiscoveries(m);expect(next.gathering.units).toHaveLength(4);const unit=next.gathering.units[3];expect(unit).toMatchObject({id:'unit-4',kind:'soldier',owner:'player',selected:false});expect(matchPopulation(next).used-before.used).toBe(factions.crown.units.soldier.supply);expect(next.production.nextUnitNumber).toBe(5);expect(next.soldierProduction.nextUnitNumber).toBe(5);expect(matchStats(next).player.added).toBe(1);expect(updateDiscoveries(next)).toBe(next);expect(visibleDiscoveries(next).some(d=>d.kind==='recruit')).toBe(false);
 const dead={...next,gathering:{...next.gathering,units:next.gathering.units.slice(0,3)}};expect(matchStats(dead).player.lost).toBe(1);expect(updateDiscoveries(dead)).toBe(dead);
});
it('waits for real supply or a free body-safe spawn without claiming or charging',()=>{
 const m=fixture();const d=scout(m,2);m.gathering.units=Array.from({length:8},(_,i)=>({...m.gathering.units[0],id:`unit-${i+1}`}));m.production.nextUnitNumber=9;m.soldierProduction.nextUnitNumber=9;expect(updateDiscoveries(m)).toBe(m);expect(visibleDiscoveries(m).find(f=>f.id===d.id)?.label).toBe('Need free population');
 m.gathering.units=m.gathering.units.slice(0,3);expect(updateDiscoveries(m).gathering.units).toHaveLength(4);
 const sealed=fixture(),site=scout(sealed,2).position;sealed.map=replaceObstacles(sealed.map,[...sealed.map.obstacles,{x:site.x-48,y:site.y-48,width:96,height:24},{x:site.x-48,y:site.y+24,width:96,height:24},{x:site.x-48,y:site.y-24,width:24,height:48},{x:site.x+24,y:site.y-24,width:24,height:48}]);expect(bodyFits(sealed.map,site,12)).toBe(true);expect(updateDiscoveries(sealed)).toBe(sealed);expect(visibleDiscoveries(sealed).find(f=>f.kind==='recruit')?.label).toBe('Waiting for a free position');

});
it('saves claimed treasure and recruited/lost allies, protects old formats and malformed claims',()=>{
 let m=fixture();scout(m,0);m=updateDiscoveries(m);scout(m,2);m=updateDiscoveries(m);
 const raw=JSON.parse(encodeSave(m,view)),loaded=decodeSave(JSON.stringify(raw));expect(loaded.ok).toBe(true);if(!loaded.ok)throw Error(loaded.error);expect(loaded.match.discoveries).toEqual(m.discoveries);expect(updateDiscoveries(loaded.match).gathering.units).toHaveLength(4);expect(updateDiscoveries(loaded.match).gathering.wood).toBe(m.gathering.wood);
 for(const mutate of [(d:typeof raw)=>d.state.discoveries.claimed.push(d.state.discoveries.claimed[0]),(d:typeof raw)=>d.state.discoveries.claimed.push('unknown'),(d:typeof raw)=>d.state.discoveries.recruits={'frontier-discovery-3':'unit-1'},(d:typeof raw)=>d.configVersion='tribute-config-59']){const bad=structuredClone(raw);mutate(bad);expect(decodeSave(JSON.stringify(bad)).ok).toBe(false);}
 const old=JSON.parse(encodeSave(createClassicMatch('skirmish','beginner',undefined,'frontier'),view));delete old.state.discoveries;old.configVersion='tribute-config-59';const migrated=decodeSave(JSON.stringify(old));expect(migrated.ok).toBe(true);if(migrated.ok)expect(migrated.match.discoveries).toBeUndefined();
 m.gathering.units=m.gathering.units.slice(0,3);expect(decodeSave(encodeSave(m,view)).ok).toBe(true);
});
it('updates in the match loop and leaves harvested stock untouched',()=>{
 const m=fixture();scout(m,0);const amount=m.gathering.node.remaining;const next=updateMatch(m,.1);expect(next.discoveries?.claimed).toHaveLength(1);expect(next.gathering.node.remaining).toBe(amount);expect(next.gathering.wood).toBe(m.gathering.wood+discoveryConfig.reward.wood);
});
