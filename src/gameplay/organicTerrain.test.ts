import {expect,it} from 'vitest';
import {createMatch} from './match';
import {createMap,bodyFits,terrainPatches,overlaps} from './map';
import {resourceNodes} from './gathering';
import {mapResourceTotals} from '../config/maps';
import {approachRoute} from './approach';
import {encodeSave,decodeSave} from './save';
import {referenceTile} from '../presentation/referenceTerrain';
const view={camera:{x:0,y:0},building:null};
it('Frontier organic forests, cliffs and lakes share physical cells and preserve reachable starting resources',()=>{
 const m=createMatch('skirmish','beginner',undefined,'frontier'),nodes=resourceNodes(m.gathering),patches=terrainPatches(m.map);
 expect(m.map.design).toBe('organic');expect(patches.filter(p=>p.kind==='water').length).toBeGreaterThan(20);
 for(const n of nodes.filter(n=>n.tree)){expect(bodyFits(m.map,n.position,12)).toBe(false);expect(patches.some(p=>overlaps({x:n.position.x-16,y:n.position.y-16,width:32,height:32},{x:p.column*32,y:p.row*32,width:p.columns*32,height:p.rows*32})),n.id).toBe(false);}
 expect(nodes.reduce((s,n)=>s+(n.resource==='wood'?n.remaining:0),0)).toBeCloseTo(mapResourceTotals('frontier','trees','expanded','organic').wood);
 expect(approachRoute(m.map,m.gathering.units[2].position,{x:m.gathering.gold!.position.x-20,y:m.gathering.gold!.position.y-20,width:40,height:40},24).status).not.toBe('blocked');
 m.fog!.teams.player.visible.fill(true);m.fog!.teams.player.explored.fill(true);m.fog!.teams.enemy.visible.fill(true);m.fog!.teams.enemy.explored.fill(true);
 for(const team of ['player','enemy'] as const)m.fog!.forest![team]=Object.fromEntries(nodes.filter(n=>n.tree).map(n=>[n.id,true]));
 expect(decodeSave(encodeSave(m,view)).ok).toBe(true);
 const tile=patches.find(p=>p.kind==='rock')!;expect(referenceTile(tile.column,tile.row+tile.rows-1,m.map).edges.some(e=>e.startsWith('cliff-'))).toBe(true);
});
it('Save62 keeps expanded legacy geography and rejects an organic layout under the old version',()=>{
 const m=createMatch('skirmish','beginner',undefined,'arena'),doc=JSON.parse(encodeSave(m,view));doc.configVersion='tribute-config-62';const loaded=decodeSave(JSON.stringify(doc));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(loaded.ok)expect(loaded.match.map).toEqual(m.map);
 doc.state.map.design='organic';expect(decodeSave(JSON.stringify(doc)).ok).toBe(false);
 expect(createMap('frontier','reference','trees','expanded').design).toBeUndefined();
});
