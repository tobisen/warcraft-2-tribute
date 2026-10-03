import {text as uiText} from '../text';
import {gatheringConfig,goldConfig} from './gathering';
import {arenaConfig} from './arena';
export type MapId='arena'|'forest'|'river'|'islands'|'frontier';
export interface TerrainPatch {column:number;row:number;columns:number;rows:number;kind:'rock'|'water'}
export interface MapResource {id:string;resource:'wood'|'gold';position:{x:number;y:number};amount:number}
export interface MapDefinition {attackEntry?:{x:number;y:number};world?:{width:number;height:number};enemyBase?:{x:number;y:number;width:number;height:number};extraResources?:readonly MapResource[];label:string;wood:number;gold:number;terrain:readonly TerrainPatch[];instruction?:string;goldPosition?:{x:number;y:number};enemyAttackWaypoints?:readonly {x:number;y:number}[];enemyResourceWaypoints?:readonly {x:number;y:number}[]}
export const maps:Record<MapId,MapDefinition>={
 frontier:{label:'Frontier Valley',attackEntry:{x:1248,y:144},world:{width:1600,height:1152},wood:400,gold:300,
  enemyBase:{x:1312,y:96,width:96,height:96},
  extraResources:[{id:'wood-2',resource:'wood',position:{x:1216,y:896},amount:200},{id:'gold-2',resource:'gold',position:{x:1184,y:640},amount:150}],
  instruction:'Explore the larger valley. The north flank, central dry crossing and south flank reach the eastern base. Extra wood and gold lie beyond the river.',
  enemyResourceWaypoints:[{x:1056,y:448},{x:848,y:240},{x:608,y:240},{x:1184,y:592},{x:1248,y:864}],
  enemyAttackWaypoints:[{x:1008,y:656},{x:736,y:656},{x:448,y:480}],
  terrain:[{column:19,row:10,columns:3,rows:3,kind:'rock'},{column:25,row:14,columns:2,rows:5,kind:'water'},{column:25,row:22,columns:2,rows:9,kind:'water'},{column:32,row:5,columns:3,rows:7,kind:'rock'},{column:8,row:24,columns:5,rows:3,kind:'rock'},{column:36,row:22,columns:5,rows:4,kind:'rock'}]},
 arena:{label:uiText.arena,instruction:'Build east of your base. The open central land reaches the enemy base; small ponds leave the main route clear.',wood:400,gold:300,terrain:arenaConfig.terrain},
 forest:{label:uiText.forestPass,instruction:'Build east of your base. Keep the route to wood and gold open; cross the forest pass toward the northeast enemy base.',wood:500,gold:250,terrain:[{column:5,row:4,columns:3,rows:7,kind:'rock'},{column:3,row:17,columns:8,rows:3,kind:'water'},{column:21,row:11,columns:3,rows:3,kind:'rock'}]},
 islands:{label:uiText.islands,instruction:uiText.gatherOnTheWesternIslandBuildAHarbor,wood:800,gold:400,goldPosition:{x:600,y:300},enemyAttackWaypoints:[{x:928,y:480},{x:944,y:208},{x:912,y:384}],enemyResourceWaypoints:[{x:944,y:240},{x:1168,y:400},{x:912,y:560}],terrain:[{column:0,row:0,columns:40,rows:2,kind:'water'},{column:0,row:28,columns:40,rows:2,kind:'water'},{column:0,row:2,columns:2,rows:26,kind:'water'},{column:38,row:2,columns:2,rows:26,kind:'water'},{column:22,row:2,columns:6,rows:26,kind:'water'},{column:5,row:4,columns:3,rows:3,kind:'rock'},{column:33,row:20,columns:2,rows:3,kind:'rock'}]},
 river:{label:uiText.riverBend,instruction:'Keep to the north bank for the enemy base. Leave space for workers around the mines; southern water bends block direct travel.',wood:350,gold:400,terrain:[{column:7,row:16,columns:14,rows:2,kind:'water'},{column:31,row:14,columns:5,rows:4,kind:'water'},{column:10,row:3,columns:2,rows:5,kind:'rock'},{column:34,row:2,columns:2,rows:2,kind:'rock'}]},
};
export const isMapId=(value:unknown):value is MapId=>typeof value==='string'&&Object.hasOwn(maps,value);

/** Fixed authored stock; IDs and positions are shared by initialization and strict Save validation. */
export function mapResources(id:MapId):MapResource[]{const m=maps[id];return [{id:'wood-1',resource:'wood',position:{...gatheringConfig.nodePosition},amount:m.wood},{id:'gold-1',resource:'gold',position:{...(m.goldPosition??goldConfig.position)},amount:m.gold},...(m.extraResources??[]).map(n=>({...n,position:{...n.position}}))];}
export function mapResourceTotals(id:MapId):{wood:number;gold:number}{return mapResources(id).reduce((sum,n)=>({...sum,[n.resource]:sum[n.resource]+n.amount}),{wood:0,gold:0});}
