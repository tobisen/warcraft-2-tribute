import {mapDiscoveries,discoveryConfig} from '../config/discoveries';
import type {MatchState} from '../gameplay/match';
import {isVisible} from '../gameplay/fog';
import {recruitReason} from '../gameplay/discoveries';
export function visibleDiscoveries(m:MatchState){
 if(!m.discoveries||!m.fog)return [];
 return mapDiscoveries(m.map.id??'arena',m.map.design).filter(d=>isVisible(m.fog!,'player',d.position)&&(d.kind==='treasure'||!m.discoveries!.claimed.includes(d.id))).map(d=>({...d,opened:m.discoveries!.claimed.includes(d.id),label:d.kind==='treasure'?m.discoveries!.claimed.includes(d.id)?'Opened':`Approach: +${discoveryConfig.reward.wood} wood +${discoveryConfig.reward.gold} gold`:recruitReason(m,d)??'Approach to rescue'}));
}
/** Original 32px pixel-art chest, sharing the terrain's warm wood and metal palette. */
export function paintDiscoveryChest(ctx:CanvasRenderingContext2D,opened:boolean):void {
 const rect=(x:number,y:number,w:number,h:number,color:string)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h);};
 ctx.clearRect(0,0,32,32);rect(4,25,24,4,'#18261f');
 rect(5,12,22,14,'#34291f');rect(7,14,18,10,'#805333');rect(7,15,18,2,'#b68a52');
 rect(7,20,18,1,'#4b3326');rect(9,12,3,13,'#b79554');rect(21,12,3,13,'#b79554');
 if(opened){rect(5,7,22,7,'#34291f');rect(7,8,18,4,'#936841');rect(7,13,18,4,'#17201b');}
 else{rect(6,8,20,6,'#936841');rect(8,8,16,2,'#c79d63');rect(9,9,3,5,'#d9bf79');rect(21,9,3,5,'#d9bf79');rect(14,14,5,6,'#e0bf4d');rect(16,16,1,2,'#34291f');}
}
