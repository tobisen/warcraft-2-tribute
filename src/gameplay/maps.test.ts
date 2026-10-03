import {expect,it} from 'vitest';
import {maps,type MapId} from '../config/maps';
import {factionsForPlayer} from '../config/factions';
import {createMatch,updateMatch} from './match';
import {bodyFits,createMap} from './map';
import {approachRoute} from './approach';
import {findRoute} from './navigation';
import {placementObstacles} from './placement';
import {encodeSave,decodeSave} from './save';
import {terrainFrame} from '../presentation/assets';
import {minimapData} from '../presentation/minimap';
import {releasePlaythrough} from './testHelpers/releaseBot';
const view={camera:{x:0,y:0},building:null};
for(const id of ['arena','forest','river'] as MapId[])for(const faction of ['crown','clans'] as const){
 it(`${id}/${faction} has finite configured stocks, valid spawns, resources and connected bases`,()=>{
  const m=createMatch('skirmish','normal',factionsForPlayer(faction),id);expect(m.map.id).toBe(id);expect(m.gathering.node.remaining).toBe(maps[id].wood);expect(m.gathering.gold!.remaining).toBe(maps[id].gold);for(const u of [...m.gathering.units,...m.combat.enemies.filter(e=>!e.footprint)])expect(bodyFits(m.map,u.position,12)).toBe(true);const rects=placementObstacles(m.gathering).slice(1);for(const rect of rects)expect(approachRoute(m.map,m.gathering.units[0].position,rect,24).status).not.toBe('blocked');expect(findRoute(m.map,{x:448,y:480},{x:944,y:208}).ok).toBe(true);expect(minimapData(m).terrain).toEqual(createMap(id).obstacles);const patch=maps[id].terrain[0];expect(terrainFrame(patch.column,patch.row,id)).toBe(patch.kind);
 });
 it(`${id}/${faction} completes a paid finite-resource skirmish and roundtrips its own map`,()=>{
  const r=releasePlaythrough('skirmish','normal',undefined,{faction,abilities:true,map:id}),m=r.match;expect(m.outcome).toBe('victory');expect(r.spentWood).toBeGreaterThan(40);expect(r.spentGold).toBeGreaterThan(0);const cargo=(type:string)=>m.gathering.units.reduce((n,u)=>n+(u.kind==='worker'&&(u.cargoType??'wood')===type?u.cargo:0),0);expect(m.gathering.wood+m.gathering.node.remaining+cargo('wood')+(m.enemyProduction?.extracted?.wood??0)+r.spentWood+(m.gathering.lostCargo?.wood??0)).toBeCloseTo(maps[id].wood);expect((m.gathering.goldBalance??0)+m.gathering.gold!.remaining+cargo('gold')+(m.enemyProduction?.extracted?.gold??0)+r.spentGold+(m.gathering.lostCargo?.gold??0)).toBeCloseTo(maps[id].gold);const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok).toBe(true);if(loaded.ok)expect(loaded.match.map.id).toBe(id);
 },30_000);
}
it('different profiles own different terrain and amounts, strict identity and legacy arena migration',()=>{
 expect(new Set(Object.values(maps).map(m=>JSON.stringify(m.terrain))).size).toBe(4);const m=createMatch('skirmish','normal',factionsForPlayer('crown'),'forest');const json=encodeSave(m,view);for(const mutate of [(d:any)=>d.map='unknown',(d:any)=>d.map='arena',(d:any)=>d.state.gathering.gold.remaining=400,(d:any)=>d.state.scenario='survival',(d:any)=>d.configVersion='tribute-config-9']){const d=JSON.parse(json);mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}const old=createMatch('skirmish');const d=JSON.parse(encodeSave(old,view));d.configVersion='tribute-config-9';delete d.state.map.id;const r=decodeSave(JSON.stringify(d));expect(r.ok).toBe(true);expect(createMatch('skirmish','normal',factionsForPlayer('clans'),'forest').gathering.node.remaining).toBe(500);expect(updateMatch({...m,paused:true},100)).toEqual({...m,paused:true});
});
