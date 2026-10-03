import {text as uiText} from '../text';
import {arenaConfig} from './arena';
export type MapId='arena'|'forest'|'river'|'islands';
export interface TerrainPatch {column:number;row:number;columns:number;rows:number;kind:'rock'|'water'}
export interface MapDefinition {label:string;wood:number;gold:number;terrain:readonly TerrainPatch[];instruction?:string;goldPosition?:{x:number;y:number};enemyAttackWaypoints?:readonly {x:number;y:number}[];enemyResourceWaypoints?:readonly {x:number;y:number}[]}
export const maps:Record<MapId,MapDefinition>={
 arena:{label:uiText.arena,wood:400,gold:300,terrain:arenaConfig.terrain},
 forest:{label:uiText.forestPass,wood:500,gold:250,terrain:[{column:5,row:4,columns:3,rows:7,kind:'rock'},{column:3,row:17,columns:8,rows:3,kind:'water'},{column:21,row:11,columns:3,rows:3,kind:'rock'}]},
 islands:{label:uiText.islands,instruction:uiText.gatherOnTheWesternIslandBuildAHarbor,wood:800,gold:400,goldPosition:{x:600,y:300},enemyAttackWaypoints:[{x:928,y:480},{x:944,y:208},{x:912,y:384}],enemyResourceWaypoints:[{x:944,y:240},{x:1168,y:400},{x:912,y:560}],terrain:[{column:0,row:0,columns:40,rows:2,kind:'water'},{column:0,row:28,columns:40,rows:2,kind:'water'},{column:0,row:2,columns:2,rows:26,kind:'water'},{column:38,row:2,columns:2,rows:26,kind:'water'},{column:22,row:2,columns:6,rows:26,kind:'water'},{column:5,row:4,columns:3,rows:3,kind:'rock'},{column:33,row:20,columns:2,rows:3,kind:'rock'}]},
 river:{label:uiText.riverBend,wood:350,gold:400,terrain:[{column:7,row:16,columns:14,rows:2,kind:'water'},{column:31,row:14,columns:5,rows:4,kind:'water'},{column:10,row:3,columns:2,rows:5,kind:'rock'},{column:34,row:2,columns:2,rows:2,kind:'rock'}]},
};
export const isMapId=(value:unknown):value is MapId=>typeof value==='string'&&Object.hasOwn(maps,value);
