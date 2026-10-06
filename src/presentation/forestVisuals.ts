import {frontierGroves} from '../config/referenceTerrain';
import {forestCells,forestCellKey} from '../gameplay/forestTerrain';
import {isVisible,type FogState} from '../gameplay/fog';
import type {GatheringState} from '../gameplay/gathering';
export function forestVisuals(gathering:GatheringState,fog:FogState):{id:string;x:number;y:number;frame:string}[]{
 return [gathering.node,...gathering.extraNodes??[]].filter(n=>n.grove||n.tree).flatMap(node=>{if(node.tree){const visible=isVisible(fog,'player',node.position),alive=visible?node.remaining>0:fog.forest?.player[node.id];return alive===undefined?[]:[{id:node.id,x:node.position.x,y:node.position.y+16,frame:alive?`tree-${(Math.floor(node.position.x/32)*3+Math.floor(node.position.y/32)*7)%4}`:'stump'}];}const alive=new Set(forestCells(node).map(c=>forestCellKey(node.grove!,c)));return frontierGroves[node.grove!].cells.flatMap(c=>{const id=forestCellKey(node.grove!,c),x=(c.column+.5)*32,y=(c.row+1)*32,visible=isVisible(fog,'player',{x,y:y-16}),known=visible?alive.has(id):fog.forest?.player[id];return known===undefined?[]:[{id,x,y,frame:known?`forest-${(c.column*3+c.row*7)%4}`:'stump'}];});});
}
