import {mapResources,type MapId} from '../../config/maps';
import {createMap} from '../map';
import {placementObstacles} from '../placement';
import type {MatchState} from '../match';
/** Rebuild actual pre-reference map/resource geometry; never relabel modern coordinates. */
export function legacyTerrainFixture(doc:{map:MapId;state:MatchState}):void {
 const s=doc.state,oldNodes=[s.gathering.node,s.gathering.gold,...s.gathering.extraNodes??[]],resources=mapResources(doc.map).map(n=>({id:n.id,resource:n.resource,position:{...n.position},remaining:oldNodes.find(o=>o?.id===n.id)?.remaining??n.amount}));
 s.gathering.node=resources[0];s.gathering.gold=resources[1];if(resources.length>2)s.gathering.extraNodes=resources.slice(2);else delete s.gathering.extraNodes;
 const map=createMap(doc.map,'legacy','groves');delete map.terrainLayout;delete map.resourceLayout;s.map={...map,revision:s.map.revision,obstacles:[...map.obstacles,...placementObstacles(s.gathering),...(s.placement.barracks?[s.placement.barracks]:[]),...(s.placement.farms??[]).map(f=>f.footprint),...(s.placement.forge?[s.placement.forge.footprint]:[]),...(s.navy?.harbor?[s.navy.harbor.footprint]:[]),...s.combat.enemies.flatMap(e=>e.footprint?[e.footprint]:[])]};
 if(s.fog)delete s.fog.forest;if(s.enemyKnowledge)s.enemyKnowledge.nodes=[];
}
