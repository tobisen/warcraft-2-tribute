import {arenaConfig} from './arena';
export type MapId='arena'|'forest'|'river';
export interface TerrainPatch {column:number;row:number;columns:number;rows:number;kind:'rock'|'water'}
export interface MapDefinition {label:string;wood:number;gold:number;terrain:readonly TerrainPatch[]}
export const maps:Record<MapId,MapDefinition>={
 arena:{label:'Handgjord arena',wood:400,gold:300,terrain:arenaConfig.terrain},
 forest:{label:'Skogspasset',wood:500,gold:250,terrain:[{column:5,row:4,columns:3,rows:7,kind:'rock'},{column:3,row:17,columns:8,rows:3,kind:'water'},{column:21,row:11,columns:3,rows:3,kind:'rock'}]},
 river:{label:'Flodkröken',wood:350,gold:400,terrain:[{column:7,row:16,columns:14,rows:2,kind:'water'},{column:31,row:14,columns:5,rows:4,kind:'water'},{column:10,row:3,columns:2,rows:5,kind:'rock'},{column:34,row:2,columns:2,rows:2,kind:'rock'}]},
};
export const isMapId=(value:unknown):value is MapId=>typeof value==='string'&&Object.hasOwn(maps,value);
