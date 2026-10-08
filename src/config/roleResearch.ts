export const roleResearchKinds=['cavalryArmor','healerTraining','scoutOptics','submarineDesign'] as const;
export type RoleResearchKind=typeof roleResearchKinds[number];
export const roleResearchConfig={
 submarineDesign:{name:'Submarine Design',cost:{wood:45,gold:30},durationSeconds:12,buildings:['forge','academy'] as const,description:'Unlocks harbor submarines: water only, torpedoes against ships only; enemy detection requires nearby detector and current vision.'},
 cavalryArmor:{name:'Cavalry Armor',cost:{wood:45,gold:30},durationSeconds:12,buildings:['forge','stable'] as const,description:'Cavalry only: 20% less incoming damage; stacks once with normal defense research.'},
 healerTraining:{name:'Healer Training',cost:{wood:45,gold:30},durationSeconds:12,buildings:['forge','academy'] as const,description:'Healers only: +50 maximum mana; initial mana, regeneration, Heal amount/range/cost/cooldown unchanged.'},
 scoutOptics:{name:'Scout Optics',cost:{wood:45,gold:30},durationSeconds:12,buildings:['forge','aviary'] as const,description:'Scouts detect submarines within128px and current team vision; ordinary288px vision unchanged.'},
};
export const isRoleResearch=(kind:string):kind is RoleResearchKind=>roleResearchKinds.some(k=>k===kind);
export const cavalryArmorMultiplier=(role:string|undefined,level=0)=>role==='cavalry'&&level>=1?.8:1;
export const trainedHealerMana=(role:string|undefined,level=0)=>role==='healer'&&level>=1?50:0;
export const scoutDetectionRadius=128;
export const scoutDetectorRadius=(role:string|undefined,level=0)=>role==='scout'&&level>=1?scoutDetectionRadius:0;
