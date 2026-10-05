import {frontierGroves} from '../config/referenceTerrain';
import {forestCells,forestCellKey} from '../gameplay/forestTerrain';
import {isVisible,type FogState} from '../gameplay/fog';
import type {GatheringState} from '../gameplay/gathering';
export function forestVisuals(gathering:GatheringState,fog:FogState):{id:string;x:number;y:number;frame:string}[]{
 return [gathering.node,...gathering.extraNodes??[]].filter(n=>n.grove).flatMap(node=>{const alive=new Set(forestCells(node).map(c=>forestCellKey(node.grove!,c)));return frontierGroves[node.grove!].cells.flatMap(c=>{const id=forestCellKey(node.grove!,c),x=(c.column+.5)*32,y=(c.row+1)*32,visible=isVisible(fog,'player',{x,y:y-16}),known=visible?alive.has(id):fog.forest?.player[id];return known===undefined?[]:[{id,x,y,frame:known?`forest-${(c.column*3+c.row*7)%4}`:'stump'}];});});
}
