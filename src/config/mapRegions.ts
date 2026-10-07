import type {MapId,MapDefinition,MapResource} from './maps';
import type {TerrainDesign} from './organicTerrain';
import type {Footprint} from '../gameplay/placement';
import type {Position} from '../gameplay/movement';
/** Northeast/southeast strongholds separated from the human economy by whole regions. */
export const regionBases:Record<MapId,Footprint>={arena:{x:1632,y:1536,width:96,height:96},forest:{x:2560,y:2464,width:96,height:96},frontier:{x:3456,y:3232,width:96,height:96},river:{x:3456,y:3360,width:96,height:96},highlands:{x:3456,y:416,width:96,height:96},plains96:{x:3456,y:3296,width:96,height:96},plains128:{x:3456,y:3296,width:96,height:96},islands:{x:3200,y:416,width:96,height:96},coast:{x:3008,y:416,width:96,height:96}};
export const regionThirdStart:Position={x:3504,y:496};
export function regionExpansion(base:Footprint,mapId:MapId):Position{return {x:Math.max(384,base.x-384),y:Math.max(384,base.y+(mapId==='coast'||mapId==='islands'?128:-384))};}
export function regionBuildSites(base:Footprint):Position[]{return [{x:base.x-192,y:base.y+96},{x:base.x+128,y:base.y+96},{x:base.x-192,y:base.y-96},{x:base.x+128,y:base.y-96},{x:base.x+32,y:base.y+192}];}
export function regionDefinition(id:MapId,original:MapDefinition,design?:TerrainDesign):MapDefinition{
 if(design!=='regions')return original;const b=regionBases[id];return {...original,enemyBase:b,enemyBuildSites:regionBuildSites(b),enemyMuster:{x:b.x-128,y:b.y+160},referenceResourceWaypoints:undefined,referenceAttackWaypoints:undefined,
 enemyResourceWaypoints:[{x:b.x-128,y:b.y-128},regionExpansion(b,id),{x:b.x-512,y:b.y+64}],
 enemyAttackWaypoints:[{x:b.x-256,y:b.y+144},{x:Math.round((b.x+448)/64)*32,y:Math.round((b.y+480)/64)*32},{x:448,y:480},{x:208,y:320}],
 instruction:original.enemyNaval?'Establish your western island economy. Scout the channel and transport an army to the distant eastern stronghold. Expand into finite groves and mines.':'Establish an economy and defenses before exploring the distant enemy region. Scout glades, mines and alternative approaches through the woods, ridges and lakes.'};
}
export function regionResourceNodes(id:MapId):MapResource[]{const bases=[regionBases[id],...(['plains96','plains128'].includes(id)?[{x:regionThirdStart.x-48,y:regionThirdStart.y-48,width:96,height:96}]:[])];const result:MapResource[]=[];
 for(const [index,b]of bases.entries())for(const [site,point]of [{x:b.x,y:b.y},regionExpansion(b,id)].entries()){
  for(let r=0;r<4;r++)for(let c=0;c<4;c++)if(!(r===0&&c===0))result.push({id:`region-${index}-${site}-tree-${c}-${r}`,tree:true,resource:'wood',position:{x:point.x-176+c*32,y:point.y-176+r*32},amount:24});
  result.push({id:`region-${index}-${site}-mine`,mine:true,resource:'gold',position:{x:point.x+176,y:point.y-64},amount:3000});
 }return result;
}
export function regionProtected(c:number,r:number,id:MapId):boolean{const b=regionBases[id],sites=[b,regionExpansion(b,id),...(['plains96','plains128'].includes(id)?[{x:regionThirdStart.x-48,y:regionThirdStart.y-48},regionExpansion({x:regionThirdStart.x-48,y:regionThirdStart.y-48,width:96,height:96},id)]:[])];return sites.some(p=>c>=p.x/32-8&&c<=p.x/32+9&&r>=p.y/32-8&&r<=p.y/32+9);}
