import type {FactionId} from './factions';
export const abilityConfig={
 crown:{label:'Försvarshållning',description:'−25 % inkommande skada',durationSeconds:5,cooldownSeconds:20,attackMultiplier:1,defenseMultiplier:.75},
 clans:{label:'Raseri',description:'+25 % utgående skada',durationSeconds:5,cooldownSeconds:20,attackMultiplier:1.25,defenseMultiplier:1},
} satisfies Record<FactionId,{label:string;description:string;durationSeconds:number;cooldownSeconds:number;attackMultiplier:number;defenseMultiplier:number}>;
