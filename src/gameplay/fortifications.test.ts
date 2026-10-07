import {it,expect} from 'vitest';
import {fortificationConnections} from './fortifications';
import type {Defense} from './towers';
const wall=(n:number,x:number,y:number,kind:'wall'|'gate'|'tower'='wall'):Defense=>({id:`${kind}-${n}`,kind,owner:'player',footprint:{x,y,width:kind==='gate'?64:32,height:32},hp:180,construction:{remainingSeconds:0,builderId:null},level:1,upgradeRemaining:null,cooldown:0});
it('connects a long wall across gates and retains exact ends without a component-size cap',()=>{
 const walls=Array.from({length:100},(_,i)=>wall(i+1,i*32,64));walls.splice(40,2,wall(41,1280,64,'gate'));
 const connections=fortificationConnections(walls);expect(connections.get('wall-1')).toEqual([2]);expect(connections.get('wall-100')).toEqual([8]);expect(connections.get('gate-41')).toEqual([10,10]);expect(connections.get('wall-40')).toEqual([10]);expect(connections.get('wall-43')).toEqual([10]);
});
it('joins corners, T-junctions, crossings and both gate cells; rebuilds after destruction and ignores towers/diagonals',()=>{
 const center=wall(1,64,64),neighbors=[wall(2,64,32),wall(3,96,64),wall(4,64,96),wall(5,32,64)];
 expect(fortificationConnections([center,...neighbors]).get(center.id)).toEqual([15]);
 expect(fortificationConnections([center,neighbors[0],neighbors[1]]).get(center.id)).toEqual([3]);
 neighbors[0].hp=0;expect(fortificationConnections([center,...neighbors]).get(center.id)).toEqual([14]);
 expect(fortificationConnections([center,wall(6,96,96),wall(7,64,32,'tower')]).get(center.id)).toEqual([0]);
 expect(fortificationConnections([wall(8,64,64,'gate'),wall(9,64,32),wall(10,96,96)]).get('gate-8')).toEqual([3,12]);
});
