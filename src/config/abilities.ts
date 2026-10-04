import {text as uiText} from '../text';
import type {FactionId} from './factions';
export const abilityConfig={
 crown:{label:uiText.defensiveStance,description:uiText.value25IncomingDamage,durationSeconds:5,cooldownSeconds:20,attackMultiplier:1,defenseMultiplier:.75},
 clans:{label:uiText.fury,description:uiText.value25OutgoingDamage,durationSeconds:5,cooldownSeconds:20,attackMultiplier:1.25,defenseMultiplier:1},
 elves:{label:'True Shot',description:'+20% outgoing damage',durationSeconds:5,cooldownSeconds:20,attackMultiplier:1.2,defenseMultiplier:1},
 dwarves:{label:'Brace',description:'−35% incoming damage',durationSeconds:5,cooldownSeconds:25,attackMultiplier:1,defenseMultiplier:.65},
} satisfies Record<FactionId,{label:string;description:string;durationSeconds:number;cooldownSeconds:number;attackMultiplier:number;defenseMultiplier:number}>;
