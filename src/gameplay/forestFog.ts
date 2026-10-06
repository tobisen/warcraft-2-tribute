import {frontierGroves} from '../config/referenceTerrain';
import {forestCells,forestCellKey} from './forestTerrain';
import {isVisible,type FogState} from './fog';
import type {GatheringState} from './gathering';
/** Last observed crowns survive fog loss and Save; hidden harvesting never changes the visible memory. */
export function observeForest(fog:FogState,gathering:GatheringState):FogState {
 const nodes=[gathering.node,...(gathering.extraNodes??[])].filter(n=>n.grove||n.tree);if(!nodes.length)return fog;
 const forest={player:{...fog.forest?.player},enemy:{...fog.forest?.enemy}};
 for(const node of nodes){if(node.tree){for(const team of ['player','enemy'] as const)if(isVisible(fog,team,node.position))forest[team][node.id]=node.remaining>0;continue;}const alive=new Set(forestCells(node).map(c=>forestCellKey(node.grove!,c)));for(const c of frontierGroves[node.grove!].cells){const key=forestCellKey(node.grove!,c);for(const team of ['player','enemy'] as const)if(isVisible(fog,team,{x:(c.column+.5)*32,y:(c.row+.5)*32}))forest[team][key]=alive.has(key);}}
 return {...fog,forest};
}
