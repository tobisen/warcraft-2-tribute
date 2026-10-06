import {createClassicMatch as createMatch} from './testHelpers/classicMatch';
import {expect,it} from 'vitest';
import {maps,mapResources,mapResourceTotals,type MapId} from '../config/maps';
import {campaignPlans} from '../config/campaignPhases';
import {operationConfig} from '../config/operations';

import {createMap,bodyFits,terrainPatches,nearbyObstacles} from './map';
import {resourceNodes} from './gathering';
import {placementObstacles} from './placement';
import {encodeSave,decodeSave} from './save';
import {matchFog} from './matchFog';
import {canReachFootprint} from './approach';
import {findDomainRoute} from './terrainNavigation';
const view={camera:{x:0,y:0},building:null};
it.each(Object.keys(maps) as MapId[])('%s has128×128 real tiles, finite reachable expansions and consistent resource totals',id=>{const m=createMatch('skirmish','beginner',undefined,id),nodes=resourceNodes(m.gathering),extra=nodes.filter(n=>n.id.startsWith('expansion-'));
  expect(m.map).toMatchObject({worldLayout:'expanded',width:4096,height:4096,tileSize:32});expect(m.fog!.teams.player.visible).toHaveLength(16384);expect(extra.length).toBeGreaterThan(50);
  expect(nodes.reduce((n,r)=>n+(r.resource==='wood'?r.remaining:0),0)).toBeCloseTo(mapResourceTotals(id,'trees','expanded').wood);
  for(const n of extra){expect(bodyFits(m.map,n.position,12)).toBe(false);expect(n.position.x).toBeLessThan(4096);expect(n.position.y).toBeLessThan(4096);}
  const mine=extra.find(n=>n.resource==='gold')!,point={x:mine.position.x,y:mine.position.y-64};expect(bodyFits(m.map,point,12)).toBe(true);expect(canReachFootprint(m.map,point,{x:mine.position.x-20,y:mine.position.y-20,width:40,height:40},24)).toBe(true);
  expect(decodeSave(encodeSave(m,{camera:{x:3000,y:3000},building:null})).ok).toBe(true);
});
it('Save56 coordinates stay on original reference dimensions and Save57 refuses mixing old dimensions with expanded identity',()=>{
 for(const id of ['arena','frontier','plains96'] as const){const m=createMatch('skirmish','beginner',undefined,id);delete m.discoveries;m.map=createMap(id,'reference','trees','original');const nodes=mapResources(id,'trees').map(n=>({id:n.id,resource:n.resource,tree:n.tree,mine:n.mine,position:n.position,remaining:n.amount}));m.gathering.node=nodes[0];m.gathering.gold=nodes[1];if(nodes.length>2)m.gathering.extraNodes=nodes.slice(2);else delete m.gathering.extraNodes;m.map.obstacles.push(...placementObstacles(m.gathering),...m.combat.enemies.flatMap(e=>e.footprint?[e.footprint]:[]));delete m.fog;m.fog=matchFog(m);
  const old=JSON.parse(encodeSave(m,view));old.configVersion='tribute-config-56';const loaded=decodeSave(JSON.stringify(old));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(loaded.ok){expect(loaded.match.map.width).toBe(m.map.width);expect(loaded.match.map.height).toBe(m.map.height);expect(loaded.match.map.worldLayout).toBeUndefined();}
  old.state.map.worldLayout='expanded';expect(decodeSave(JSON.stringify(old)).ok).toBe(false);
  const current=JSON.parse(encodeSave(createMatch('skirmish','beginner',undefined,id),view));delete current.state.map.worldLayout;expect(decodeSave(JSON.stringify(current)).ok).toBe(false);
 }
});
it('campaign positioning objectives remain on accessible authored land, transport route remains water-only',()=>{
 for(const plan of Object.values(campaignPlans))if(plan)for(const p of plan.phases)if(p.goal==='position')for(const point of p.points!){const m=createMatch('skirmish','beginner',undefined,plan.map);expect(bodyFits(m.map,point,12)).toBe(true);}
 for(const operation of Object.values(operationConfig)){const id=operation.kind==='escort'?'highlands':operation.kind==='rescue'?'frontier':'coast',m=createMatch('skirmish','beginner',undefined,id);expect(bodyFits(m.map,operation.zone,12)).toBe(true);}
 const m=createMatch('skirmish','beginner',undefined,'islands');expect(findDomainRoute(m.map,'water',{x:720,y:432},{x:880,y:432},16).ok).toBe(true);expect(terrainPatches(m.map).some(p=>p.row===30&&p.columns===128&&p.kind==='water')).toBe(true);
});
it('shared spatial collision index preserves exact small-body results across a dense map and revisions',()=>{
 const map=createMap('frontier'),obstacles=Array.from({length:300},(_,i)=>({x:(i%30)*96+1,y:Math.floor(i/30)*96+1,width:17+i%11,height:31+i%7}));map.obstacles=obstacles;
 for(let i=0;i<500;i++){const p={x:16+(i*193)%4000,y:16+(i*71)%4000},half=i%13,body={x:p.x-half,y:p.y-half,width:half*2,height:half*2};const expected=!obstacles.some(o=>half===0?p.x>=o.x&&p.x<o.x+o.width&&p.y>=o.y&&p.y<o.y+o.height:body.x<o.x+o.width&&body.x+body.width>o.x&&body.y<o.y+o.height&&body.y+body.height>o.y);expect(bodyFits(map,p,half)).toBe(expected);}
 const p={x:20,y:20};expect(bodyFits(map,p,12)).toBe(false);map.obstacles=map.obstacles.slice(1);map.revision++;expect(bodyFits(map,p,12)).toBe(true);expect(nearbyObstacles(map,{x:16,y:16,width:1,height:1})).toHaveLength(0);
});
