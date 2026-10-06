import {mapDiscoveries,discoveryConfig} from '../config/discoveries';
import type {MatchState} from '../gameplay/match';
import {isVisible} from '../gameplay/fog';
import {recruitReason} from '../gameplay/discoveries';
export function visibleDiscoveries(m:MatchState){
 if(!m.discoveries||!m.fog)return [];
 return mapDiscoveries(m.map.id??'arena',m.map.design).filter(d=>isVisible(m.fog!,'player',d.position)&&(d.kind==='treasure'||!m.discoveries!.claimed.includes(d.id))).map(d=>({...d,opened:m.discoveries!.claimed.includes(d.id),label:d.kind==='treasure'?m.discoveries!.claimed.includes(d.id)?'Opened':`Approach: +${discoveryConfig.reward.wood} wood +${discoveryConfig.reward.gold} gold`:recruitReason(m,d)??'Approach to rescue'}));
}
