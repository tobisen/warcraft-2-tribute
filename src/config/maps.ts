import {regionResourceNodes} from './mapRegions';
import {organicTerrain,organicResources,type TerrainDesign} from './organicTerrain';
import {extensionResources,extensionTerrain} from './mapExtensions';
import {frontierGroves,frontierReferenceTerrain} from './referenceTerrain';
import {text as uiText} from '../text';
import {gatheringConfig,goldConfig} from './gathering';
import {arenaConfig} from './arena';
export type MapId='arena'|'forest'|'river'|'islands'|'frontier'|'plains96'|'plains128'|'highlands'|'coast';
export interface TerrainPatch {column:number;row:number;columns:number;rows:number;kind:'rock'|'water'}
export interface MapResource {mine?:true;tree?:true;id:string;resource:'wood'|'gold';position:{x:number;y:number};amount:number}
export interface MapDefinition {referenceResourceWaypoints?:readonly {x:number;y:number}[];referenceAttackWaypoints?:readonly {x:number;y:number}[];referenceTerrain?:readonly TerrainPatch[];enemyNaval?:boolean;enemyBuildSites?:readonly {x:number;y:number}[];enemyMuster?:{x:number;y:number};attackEntry?:{x:number;y:number};world?:{width:number;height:number};enemyBase?:{x:number;y:number;width:number;height:number};extraResources?:readonly MapResource[];label:string;wood:number;gold:number;terrain:readonly TerrainPatch[];instruction?:string;goldPosition?:{x:number;y:number};enemyAttackWaypoints?:readonly {x:number;y:number}[];enemyResourceWaypoints?:readonly {x:number;y:number}[]}
export const maps:Record<MapId,MapDefinition>={
 coast:{label:'Shattered Coast',enemyNaval:true,world:{width:4096,height:4096},wood:800,gold:400,goldPosition:{x:600,y:300},
  instruction:'Build a harbor on the eastern shore of your western island. Transport troops across the northern channel, or sail south to the continent and resource islands. The enemy holds the northeast coast.',
  enemyAttackWaypoints:[{x:928,y:480},{x:944,y:208},{x:912,y:384}],enemyResourceWaypoints:[{x:944,y:240},{x:1168,y:400},{x:912,y:560}],
  extraResources:[{id:'wood-2',resource:'wood',position:{x:1600,y:300},amount:300},{id:'gold-2',resource:'gold',position:{x:1728,y:448},amount:200},
   {id:'wood-3',resource:'wood',position:{x:800,y:1600},amount:300},{id:'gold-3',resource:'gold',position:{x:960,y:1728},amount:200},
   {id:'wood-4',resource:'wood',position:{x:1920,y:1920},amount:200},{id:'gold-4',resource:'gold',position:{x:2080,y:2048},amount:150},
   {id:'wood-5',resource:'wood',position:{x:3104,y:2816},amount:250},{id:'gold-5',resource:'gold',position:{x:3264,y:2944},amount:200}],
  terrain:[{column:0,row:0,columns:128,rows:2,kind:'water'},{column:0,row:2,columns:2,rows:28,kind:'water'},
   {column:22,row:2,columns:6,rows:28,kind:'water'},{column:126,row:2,columns:2,rows:28,kind:'water'},
   {column:0,row:30,columns:128,rows:10,kind:'water'},
   {column:0,row:40,columns:2,rows:80,kind:'water'},
   {column:40,row:40,columns:88,rows:14,kind:'water'},
   {column:40,row:54,columns:14,rows:16,kind:'water'},{column:70,row:54,columns:58,rows:16,kind:'water'},
   {column:40,row:70,columns:88,rows:10,kind:'water'},
   {column:40,row:80,columns:48,rows:24,kind:'water'},{column:112,row:80,columns:16,rows:24,kind:'water'},
   {column:40,row:104,columns:88,rows:16,kind:'water'},{column:0,row:120,columns:128,rows:8,kind:'water'},
   {column:5,row:4,columns:3,rows:3,kind:'rock'},{column:33,row:20,columns:2,rows:3,kind:'rock'},
   {column:56,row:12,columns:8,rows:8,kind:'rock'},{column:84,row:2,columns:6,rows:14,kind:'rock'},
   {column:18,row:62,columns:4,rows:22,kind:'rock'},{column:6,row:96,columns:12,rows:6,kind:'rock'},
   {column:58,row:55,columns:2,rows:2,kind:'rock'},{column:100,row:84,columns:3,rows:3,kind:'rock'}]},
 highlands:{label:'Highland Crossroads',world:{width:3072,height:3072},wood:400,gold:300,
  enemyBuildSites:[{x:2592,y:192},{x:2816,y:192},{x:2784,y:256},{x:2528,y:512}],enemyMuster:{x:2592,y:512},enemyBase:{x:2688,y:96,width:96,height:96},attackEntry:{x:2624,y:144},
  extraResources:[
   {id:'wood-2',resource:'wood',position:{x:960,y:736},amount:200},{id:'gold-2',resource:'gold',position:{x:896,y:864},amount:150},
   {id:'wood-3',resource:'wood',position:{x:1568,y:1536},amount:250},{id:'gold-3',resource:'gold',position:{x:1728,y:1472},amount:200},
   {id:'wood-4',resource:'wood',position:{x:2528,y:416},amount:300},{id:'gold-4',resource:'gold',position:{x:2656,y:320},amount:200}],
  instruction:'A mountain ridge divides the highlands. Cross the northern pass, central opening or southern flank. Expand into finite groves and mines; the enemy base lies northeast.',
  enemyAttackWaypoints:[{x:1504,y:544},{x:1184,y:544},{x:736,y:640},{x:448,y:480}],
  enemyResourceWaypoints:[{x:2528,y:352},{x:2656,y:256},{x:1504,y:1504},{x:960,y:672},{x:850,y:156},{x:650,y:116}],
  terrain:[{column:40,row:0,columns:4,rows:15,kind:'rock'},{column:40,row:20,columns:4,rows:25,kind:'rock'},
   {column:40,row:50,columns:4,rows:33,kind:'rock'},{column:24,row:13,columns:5,rows:5,kind:'rock'},
   {column:19,row:26,columns:6,rows:4,kind:'rock'},{column:58,row:23,columns:8,rows:4,kind:'rock'},
   {column:64,row:54,columns:9,rows:7,kind:'water'},{column:8,row:60,columns:14,rows:6,kind:'water'},
   {column:77,row:71,columns:7,rows:10,kind:'rock'}]},
 plains96:{label:'Western Plains 128 × 128',world:{width:3072,height:3072},wood:400,gold:300,
  instruction:'Large open size-test map. The familiar start and enemy zones lie in the northwest; explore the full plains.',
  terrain:[...arenaConfig.terrain,{column:60,row:60,columns:3,rows:3,kind:'rock'}]},
 plains128:{label:'Eastern Plains 128 × 128',world:{width:4096,height:4096},wood:400,gold:300,
  instruction:'Largest open size-test map. The familiar start and enemy zones lie in the northwest; explore the full plains.',
  terrain:[...arenaConfig.terrain,{column:90,row:90,columns:3,rows:3,kind:'rock'}]},
 frontier:{referenceResourceWaypoints:[{x:1120,y:448},{x:848,y:240},{x:656,y:240},{x:1184,y:592},{x:1216,y:944}],referenceAttackWaypoints:[{x:1008,y:640},{x:736,y:640},{x:448,y:480}],referenceTerrain:frontierReferenceTerrain,label:'Frontier Valley',attackEntry:{x:1248,y:144},world:{width:1600,height:1152},wood:400,gold:300,
  enemyBase:{x:1312,y:96,width:96,height:96},
  extraResources:[{id:'wood-2',resource:'wood',position:{x:1216,y:896},amount:200},{id:'gold-2',resource:'gold',position:{x:1184,y:640},amount:150}],
  instruction:'Explore the larger valley. The north flank, central dry crossing and south flank reach the eastern base. Extra wood and gold lie beyond the river.',
  enemyResourceWaypoints:[{x:1056,y:448},{x:848,y:240},{x:608,y:240},{x:1184,y:592},{x:1248,y:864}],
  enemyAttackWaypoints:[{x:1008,y:656},{x:736,y:656},{x:448,y:480}],
  terrain:[{column:19,row:10,columns:3,rows:3,kind:'rock'},{column:25,row:14,columns:2,rows:5,kind:'water'},{column:25,row:22,columns:2,rows:9,kind:'water'},{column:32,row:5,columns:3,rows:7,kind:'rock'},{column:8,row:24,columns:5,rows:3,kind:'rock'},{column:36,row:22,columns:5,rows:4,kind:'rock'}]},
 arena:{label:uiText.arena,instruction:'Build east of your base. The open central land reaches the enemy base; small ponds leave the main route clear.',wood:400,gold:300,terrain:arenaConfig.terrain},
 forest:{label:uiText.forestPass,instruction:'Build east of your base. Keep the route to wood and gold open; cross the forest pass toward the northeast enemy base.',wood:500,gold:250,terrain:[{column:5,row:4,columns:3,rows:7,kind:'rock'},{column:3,row:17,columns:8,rows:3,kind:'water'},{column:21,row:11,columns:3,rows:3,kind:'rock'}]},
 islands:{enemyNaval:true,label:uiText.islands,instruction:uiText.gatherOnTheWesternIslandBuildAHarbor,wood:800,gold:400,goldPosition:{x:600,y:300},enemyAttackWaypoints:[{x:928,y:480},{x:944,y:208},{x:912,y:384}],enemyResourceWaypoints:[{x:944,y:240},{x:1168,y:400},{x:912,y:560}],terrain:[{column:0,row:0,columns:40,rows:2,kind:'water'},{column:0,row:28,columns:40,rows:2,kind:'water'},{column:0,row:2,columns:2,rows:26,kind:'water'},{column:38,row:2,columns:2,rows:26,kind:'water'},{column:22,row:2,columns:6,rows:26,kind:'water'},{column:5,row:4,columns:3,rows:3,kind:'rock'},{column:33,row:20,columns:2,rows:3,kind:'rock'}]},
 river:{label:uiText.riverBend,instruction:'Keep to the north bank for the enemy base. Leave space for workers around the mines; southern water bends block direct travel.',wood:350,gold:400,terrain:[{column:7,row:16,columns:14,rows:2,kind:'water'},{column:31,row:14,columns:5,rows:4,kind:'water'},{column:10,row:3,columns:2,rows:5,kind:'rock'},{column:34,row:2,columns:2,rows:2,kind:'rock'}]},
};
export const isMapId=(value:unknown):value is MapId=>typeof value==='string'&&Object.hasOwn(maps,value);

/** Extensions must not cover original resources, starts, scout/muster lanes or existing terrain. */
export function mapExtensionTerrain(id:MapId):TerrainPatch[]{const m=maps[id],points=[gatheringConfig.nodePosition,m.goldPosition??goldConfig.position,...(m.extraResources??[]).map(n=>n.position),...(m.enemyBuildSites??[]),...(m.enemyResourceWaypoints??[]),...(m.enemyAttackWaypoints??[]),...(m.enemyMuster?[m.enemyMuster]:[]),...(m.attackEntry?[m.attackEntry]:[])],old=m.referenceTerrain??m.terrain;return extensionTerrain(id).filter(p=>{if((id==='highlands'||id==='plains96')&&p.column<96&&p.row<96)return false;const x=p.column*32,y=p.row*32,w=p.columns*32,h=p.rows*32;return !points.some(q=>x<q.x+64&&x+w>q.x-64&&y<q.y+64&&y+h>q.y-64)&&!old.some(q=>x<(q.column+q.columns)*32&&x+w>q.column*32&&y<(q.row+q.rows)*32&&y+h>q.row*32);});}

/** Fixed authored stock; IDs and positions are shared by initialization and strict Save validation. */
export function mapResources(id:MapId,layout?:'trees',worldLayout?:'expanded',design?:TerrainDesign):MapResource[]{const m=maps[id];const original:MapResource[]= [{id:'wood-1',resource:'wood',position:{...gatheringConfig.nodePosition},amount:m.wood},{id:'gold-1',resource:'gold',position:{...(m.goldPosition??goldConfig.position)},amount:m.gold},...(m.extraResources??[]).map(n=>({...n,position:{...n.position}}))];if(layout!=='trees')return original;if(id==='forest')for(let row=4;row<11;row++)for(let column=5;column<8;column++)original.push({id:`forest-tree-${column}-${row}`,resource:'wood',position:{x:(column+.5)*32,y:(row+.5)*32},amount:10});const nodes=original.flatMap<MapResource>(n=>{if(n.resource!=='wood')return [{...n,mine:true as const}];const g=id==='frontier'?Object.values(frontierGroves).find(g=>g.nodeId===n.id):undefined;if(!g)return [{...n,tree:true as const}];const cells=[...g.cells].sort((a,b)=>Math.hypot((a.column+.5)*32-n.position.x,(a.row+.5)*32-n.position.y)-Math.hypot((b.column+.5)*32-n.position.x,(b.row+.5)*32-n.position.y));return cells.map((c,i)=>({id:i===0?n.id:`${n.id}-tree-${c.column}-${c.row}`,tree:true as const,resource:'wood' as const,position:{x:(c.column+.5)*32,y:(c.row+.5)*32},amount:n.amount/cells.length}));}).sort((a,b)=>a.id==='wood-1'?-1:b.id==='wood-1'?1:a.id==='gold-1'?-1:b.id==='gold-1'?1:0);if(design){const existing=[...nodes,...(design==='regions'?regionResourceNodes(id):[])];return [...existing,...organicResources(id,existing,organicTerrain(id,design),design)];}return worldLayout==='expanded'?[...nodes,...extensionResources(id,[...(m.referenceTerrain??(id==='forest'?m.terrain.filter(p=>!(p.column===5&&p.row===4)):m.terrain)),...mapExtensionTerrain(id)],nodes).filter(n=>(id!=='highlands'&&id!=='plains96'||n.position.x>=3072||n.position.y>=3072)&&(id!=='highlands'||!(n.position.x>=1184&&n.position.x<=1536&&((n.position.y>=480&&n.position.y<=640)||(n.position.y>=1440&&n.position.y<=1600)||(n.position.y>=2656&&n.position.y<=2880)))))]:nodes;}
export function mapResourceTotals(id:MapId,layout:'trees'|'legacy'='trees',worldLayout?:'expanded',design?:TerrainDesign):{wood:number;gold:number}{const total=mapResources(id,layout==='trees'?'trees':undefined,worldLayout,design).reduce((sum,n)=>({...sum,[n.resource]:sum[n.resource]+n.amount}),{wood:0,gold:0});return {wood:Math.round(total.wood*1e9)/1e9,gold:Math.round(total.gold*1e9)/1e9};}
