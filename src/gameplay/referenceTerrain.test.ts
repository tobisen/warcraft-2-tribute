import {expect,it} from 'vitest';
import {maps} from '../config/maps';
import {groveForNode} from '../config/referenceTerrain';
import {placementObstacles} from './placement';
import {createMap} from './map';
import {createMatch} from './match';
import {forestCells,forestContains,syncForestObstacles,forestCellKey} from './forestTerrain';
import {frontierGroves} from '../config/referenceTerrain';
import {bodyFits,terrainPatches,overlaps} from './map';
import {resourceNodes,isNodeHit} from './gathering';
import {observeForest} from './forestFog';
import {encodeSave,decodeSave} from './save';
import {referenceTile} from '../presentation/referenceTerrain';
import {forestVisuals} from '../presentation/forestVisuals';
function legacyMatch(){const m=createMatch('skirmish','normal',undefined,'frontier');m.map=createMap('frontier','reference','groves');m.gathering.node={id:'wood-1',resource:'wood',grove:groveForNode('wood-1'),position:{x:650,y:180},remaining:400};m.gathering.extraNodes=maps.frontier.extraResources!.map(n=>({id:n.id,resource:n.resource,grove:groveForNode(n.id),position:{...n.position},remaining:n.amount}));delete m.fog!.forest;m.map.obstacles.push(...placementObstacles(m.gathering),...m.combat.enemies.flatMap(e=>e.footprint?[e.footprint]:[]));return m;}
const view={camera:{x:0,y:0},building:null};
it('forest crowns, actual obstacles and water/rock tiles agree, with connected harvestable groves',()=>{
 const m=legacyMatch();
 for(const node of resourceNodes(m.gathering).filter(n=>n.grove)){
  const cells=forestCells(node);expect(cells.length).toBeGreaterThan(40);const remaining=new Set(cells.map(c=>`${c.column},${c.row}`)),pending=[cells[0]];remaining.delete(`${cells[0].column},${cells[0].row}`);
  while(pending.length){const c=pending.pop()!;for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const key=`${c.column+dx},${c.row+dy}`;if(remaining.delete(key))pending.push({column:c.column+dx,row:c.row+dy});}}expect(remaining.size).toBe(0);
  for(const c of cells){const p={x:(c.column+.5)*32,y:(c.row+.5)*32};expect(forestContains(node,p)).toBe(true);expect(isNodeHit(p,node)).toBe(true);expect(bodyFits(m.map,p)).toBe(false);expect(terrainPatches(m.map).some(t=>overlaps({x:c.column*32,y:c.row*32,width:32,height:32},{x:t.column*32,y:t.row*32,width:t.columns*32,height:t.rows*32}))).toBe(false);}
 }
 const patches=terrainPatches(m.map);for(let i=0;i<patches.length;i++)for(let j=i+1;j<patches.length;j++){const rect=(p:typeof patches[number])=>({x:p.column*32,y:p.row*32,width:p.columns*32,height:p.rows*32});expect(overlaps(rect(patches[i]),rect(patches[j]))).toBe(false);}
 for(let r=0;r<36;r++)for(let c=0;c<50;c++){const frame=referenceTile(c,r,m.map).frame;if(frame.startsWith('water')||frame.startsWith('deep')||frame.startsWith('shallow'))expect(terrainPatches(m.map).some(t=>t.kind==='water'&&c>=t.column&&c<t.column+t.columns&&r>=t.row&&r<t.row+t.rows)).toBe(true);}
});
it('extraction removes crowns and opens physical ground without revising unchanged routes',()=>{
 const m=legacyMatch(),before=m.gathering,cells=forestCells(before.node),after={...before,node:{...before.node,remaining:0}};
 expect(syncForestObstacles(before,before,m.map)).toBe(m.map);expect(syncForestObstacles(before,{...before,node:{...before.node,remaining:399.999}},m.map)).toBe(m.map);
 const map=syncForestObstacles(before,after,m.map);expect(map.revision).toBe(m.map.revision+1);expect(map.obstacles).toContainEqual(m.map.obstacles[0]);
 for(const c of cells)expect(bodyFits(map,{x:(c.column+.5)*32,y:(c.row+.5)*32},12)).toBe(true);
 expect(bodyFits(map,before.node.position,12)).toBe(true);expect(forestCells(after.node)).toEqual([]);
 m.gathering=after;m.map=map;expect(decodeSave(encodeSave(m,view)).ok).toBe(true);
});
it('hidden extraction preserves observed crowns, and Save remembers the last observation',()=>{
 const m=legacyMatch(),c=frontierGroves['frontier-west'].cells[0],i=c.row*m.fog!.columns+c.column,key=forestCellKey('frontier-west',c);
 m.fog!.teams.player.visible[i]=true;m.fog!.teams.player.explored[i]=true;m.fog=observeForest(m.fog!,m.gathering);expect(m.fog.forest!.player[key]).toBe(true);
 m.fog.teams.player.visible[i]=false;const before=m.gathering;m.gathering={...before,node:{...before.node,remaining:0}};m.map=syncForestObstacles(before,m.gathering,m.map);m.fog=observeForest(m.fog,m.gathering);
 expect(m.fog.forest!.player[key]).toBe(true);expect(forestVisuals(m.gathering,m.fog).find(v=>v.id===key)?.frame).toMatch(/^forest-/);expect(decodeSave(encodeSave(m,view)).ok).toBe(true);
 m.fog.teams.player.visible[i]=true;m.fog=observeForest(m.fog,m.gathering);expect(m.fog.forest!.player[key]).toBe(false);expect(forestVisuals(m.gathering,m.fog).find(v=>v.id===key)?.frame).toBe('stump');
});

import {mapResources,mapResourceTotals} from '../config/maps';
import {approachRoute} from './approach';
import {orderUnits,updateGathering} from './gathering';
import {selectionInfo} from '../presentation/selectionInfo';
it('fresh Frontier has one stable selectable resource per crown and conserves authored wood',()=>{
 const m=createMatch('skirmish','normal',undefined,'frontier'),trees=resourceNodes(m.gathering).filter(n=>n.tree);
 expect(trees.length).toBe(Object.values(frontierGroves).reduce((s,g)=>s+g.cells.length,0));
 expect(new Set(trees.map(n=>n.id)).size).toBe(trees.length);expect(trees.reduce((s,n)=>s+n.remaining,0)).toBeCloseTo(mapResourceTotals('frontier').wood);
 for(const n of trees){expect(isNodeHit(n.position,n)).toBe(true);expect(bodyFits(m.map,n.position,12)).toBe(false);}
 expect(mapResources('frontier','trees').map(n=>n.id)).toEqual(resourceNodes(m.gathering).map(n=>n.id));
 expect(decodeSave(encodeSave(m,view)).ok).toBe(true);
});
it('interior tree is blocked, felling boundary opens access, multiple workers harvest and Save preserves individual stocks',()=>{
 const m=createMatch('skirmish','normal',undefined,'frontier');m.fog!.teams.player.visible.fill(true);m.fog!.teams.player.explored.fill(true);
 const trees=resourceNodes(m.gathering).filter(n=>n.tree),rect=(n:typeof trees[number])=>({x:n.position.x-16,y:n.position.y-16,width:32,height:32});
 const worker=m.gathering.units[2];const interior=trees.find(n=>approachRoute(m.map,worker.position,rect(n),24).status==='blocked')!;
 expect(interior).toBeDefined();expect(selectionInfo(m,null,interior.id).stats.join(' ')).toContain('Unreachable');
 const edge=trees.find(n=>approachRoute(m.map,worker.position,rect(n),24).status!=='blocked')!;
 m.gathering.units=orderUnits(m.gathering.units.map(u=>({...u,selected:true})),edge.position,edge);
 const before=m.gathering;const after=updateGathering(before,30,m.map,{elapsedSeconds:0});
 expect(resourceNodes(after).find(n=>n.id===edge.id)!.remaining).toBe(0);
 m.gathering=after;m.map=syncForestObstacles(before,after,m.map);expect(bodyFits(m.map,edge.position,12)).toBe(true);
 const neighbors=trees.filter(n=>Math.abs(n.position.x-edge.position.x)+Math.abs(n.position.y-edge.position.y)===32);
 expect(neighbors.some(n=>approachRoute(m.map,worker.position,rect(n),24).status!=='blocked')).toBe(true);
 m.fog=observeForest(m.fog!,m.gathering);expect(forestVisuals(m.gathering,m.fog).find(n=>n.id===edge.id)?.frame).toBe('stump');
 const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok).toBe(true);if(loaded.ok){expect(resourceNodes(loaded.match.gathering)).toEqual(resourceNodes(m.gathering));expect(loaded.match.map.obstacles).toEqual(m.map.obstacles);}
 const bad=JSON.parse(encodeSave(m,view));bad.state.gathering.node.position.x+=32;expect(decodeSave(JSON.stringify(bad)).ok).toBe(false);
});
