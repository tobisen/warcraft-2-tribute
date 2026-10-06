import type {TerrainDesign} from './organicTerrain';
import type {MapId} from './maps';
import type {Position} from '../gameplay/movement';
export interface Discovery {id:string;kind:'treasure'|'recruit';position:Position}
export const discoveryConfig={range:48,reward:{wood:20,gold:10}};
const sites:Record<MapId,readonly [Position,Position,Position]>={
 frontier:[{x:656,y:784},{x:1712,y:1328},{x:1360,y:976}],
 arena:[{x:752,y:624},{x:1872,y:2256},{x:976,y:880}],
 forest:[{x:528,y:816},{x:1712,y:1456},{x:1136,y:816}],
 river:[{x:656,y:752},{x:1488,y:1616},{x:1008,y:720}],
 islands:[{x:496,y:784},{x:1712,y:1648},{x:2832,y:3216}],
 coast:[{x:528,y:752},{x:1776,y:1776},{x:2864,y:3184}],
 highlands:[{x:976,y:1104},{x:1680,y:1904},{x:1392,y:1520}],
 plains96:[{x:784,y:752},{x:1872,y:2256},{x:1136,y:1136}],
 plains128:[{x:784,y:752},{x:1872,y:2256},{x:1136,y:1136}],
};
const regionalSites:Record<MapId,readonly [Position,Position,Position]>={
 coast:[{x:528,y:752},{x:1776,y:1776},{x:2832,y:3184}],
 highlands:[{x:976,y:1104},{x:1680,y:1904},{x:1392,y:1520}],
 plains96:[{x:784,y:752},{x:1680,y:2256},{x:1008,y:1104}],
 plains128:[{x:784,y:752},{x:1904,y:2256},{x:1136,y:1136}],
 frontier:[{x:656,y:784},{x:1712,y:1328},{x:1360,y:1040}],
 arena:[{x:752,y:624},{x:1872,y:1888},{x:976,y:848}],
 forest:[{x:496,y:720},{x:1680,y:1456},{x:1136,y:816}],
 islands:[{x:528,y:784},{x:1744,y:1648},{x:2832,y:3216}],
 river:[{x:656,y:752},{x:1360,y:1552},{x:1008,y:720}],
};
export function mapDiscoveries(id:MapId,design?:TerrainDesign):Discovery[]{return (design==='regions'?regionalSites:sites)[id].map((position,index)=>({id:`${id}-discovery-${index+1}`,kind:index===2?'recruit':'treasure',position:{...position}}));}
