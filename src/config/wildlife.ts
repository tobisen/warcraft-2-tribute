/** Small ambient animals: no economy, vision, occupancy or enemy score. */
export const wildlifeConfig={deer:{name:'Deer',hp:24},rabbit:{name:'Rabbit',hp:8},fox:{name:'Fox',hp:16}} as const;
export type AnimalType=keyof typeof wildlifeConfig;
export const wildlifeFeedbackSeconds=1.5;
