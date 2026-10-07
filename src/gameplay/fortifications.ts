import type {Defense} from './towers';
/** Cardinal tile occupancy includes both cells of a gate; no component-size limit. */
export function fortificationConnections(defenses:readonly Defense[]):Map<string,number[]> {
 const cells=new Set<string>();
 for(const t of defenses)if(t.hp>0&&t.kind!=='tower')for(let x=t.footprint.x;x<t.footprint.x+t.footprint.width;x+=32)cells.add(`${x},${t.footprint.y}`);
 const result=new Map<string,number[]>();
 for(const t of defenses)if(t.hp>0&&t.kind!=='tower'){
  const masks=[];for(let x=t.footprint.x;x<t.footprint.x+t.footprint.width;x+=32){let mask=0;for(const [dx,dy,bit]of [[0,-32,1],[32,0,2],[0,32,4],[-32,0,8]])if(cells.has(`${x+dx},${t.footprint.y+dy}`))mask|=bit;masks.push(mask);}result.set(t.id,masks);
 }
 return result;
}
