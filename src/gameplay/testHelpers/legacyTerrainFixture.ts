import {enemyBaseConfig} from '../../config/scenarios';
import {maps,mapResources,type MapId} from '../../config/maps';
import {createMap} from '../map';
import {placementObstacles} from '../placement';
import type {MatchState} from '../match';
/** Rebuild actual pre-reference map/resource geometry; never relabel modern coordinates. */
export function legacyTerrainFixture(doc:{map:MapId;state:MatchState}):void {
 delete doc.state.discoveries;delete doc.state.bosses;
 const s=doc.state,resourceBodies=placementObstacles(s.gathering),oldNodes=[s.gathering.node,s.gathering.gold,...s.gathering.extraNodes??[]],resources=mapResources(doc.map).map(n=>({id:n.id,resource:n.resource,position:{...n.position},remaining:oldNodes.find(o=>o?.id===n.id)?.remaining??n.amount}));
 s.gathering.node=resources[0];s.gathering.gold=resources[1];if(resources.length>2)s.gathering.extraNodes=resources.slice(2);else delete s.gathering.extraNodes;
 const oldTerrain=createMap(doc.map,s.map.terrainLayout,s.map.resourceLayout==='trees'?'trees':'groves',s.map.worldLayout==='expanded'?'expanded':'original',s.map.design).obstacles;
 const preserved=s.map.obstacles.filter(o=>![...oldTerrain,...resourceBodies,...s.combat.enemies.flatMap(e=>e.footprint?[e.footprint]:[])].some(t=>t.x===o.x&&t.y===o.y&&t.width===o.width&&t.height===o.height));
 if(s.map.design){const base=s.combat.enemies.find(e=>e.kind==='base'),old=maps[doc.map].enemyBase??enemyBaseConfig.footprint;if(base?.footprint){const dx=old.x-base.footprint.x,dy=old.y-base.footprint.y;for(const e of s.combat.enemies)if(e.footprint||e.kind==='worker'){e.position={x:e.position.x+dx,y:e.position.y+dy};if(e.footprint)e.footprint={...e.footprint,x:e.footprint.x+dx,y:e.footprint.y+dy};if(e.work)e.work.target={x:e.work.target.x+dx,y:e.work.target.y+dy};}}}
 const map=createMap(doc.map,'legacy','groves');delete map.terrainLayout;delete map.resourceLayout;s.map={...map,revision:s.map.revision,obstacles:[...map.obstacles,...preserved,...placementObstacles(s.gathering).slice(s.combat.baseHP>0?0:1),...(s.placement.barracks?[s.placement.barracks]:[]),...(s.placement.farms??[]).map(f=>f.footprint),...(s.placement.forge?[s.placement.forge.footprint]:[]),...(s.navy?.harbor?[s.navy.harbor.footprint]:[]),...s.combat.enemies.flatMap(e=>e.footprint?[e.footprint]:[])]};
 s.map.obstacles=s.map.obstacles.filter((o,i,a)=>a.findIndex(t=>t.x===o.x&&t.y===o.y&&t.width===o.width&&t.height===o.height)===i);
 if(s.fog){delete s.fog.forest;const oldColumns=s.fog.columns,columns=map.width/32,rows=map.height/32;for(const team of Object.values(s.fog.teams))for(const field of ['visible','explored'] as const)team[field]=Array.from({length:columns*rows},(_,i)=>team[field][Math.floor(i/columns)*oldColumns+i%columns]??false);s.fog={...s.fog,width:map.width,height:map.height,columns,rows};}if(s.enemyKnowledge)s.enemyKnowledge.nodes=[];
}
