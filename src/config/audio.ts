/** Presentation only; PCM composition length excludes Vorbis decoder padding. */
export const audioConfig={musicLoopSeconds:16,menuMusicGain:.35,maxEffects:6,nearRadius:256,audibleRadius:1400};
/** Leave two source slots for alerts/results; quiet work cues repeat less often. */
export const effectMix={
 'animal-deer':{gain:.55,cooldown:1},'animal-rabbit':{gain:.4,cooldown:1},'animal-fox':{gain:.5,cooldown:1},
 melee:{gain:.65,cooldown:.22},bow:{gain:.65,cooldown:.18},siege:{gain:.75,cooldown:.3},buildingHit:{gain:.7,cooldown:.25},
 command:{gain:.65,cooldown:.12},impact:{gain:.65,cooldown:.16},complete:{gain:.65,cooldown:.4},
 victory:{gain:.8,cooldown:1},defeat:{gain:.8,cooldown:1},cannon:{gain:.7,cooldown:.25},
 splash:{gain:.5,cooldown:.3},warning:{gain:.8,cooldown:1},
 gather:{gain:.4,cooldown:.8},build:{gain:.4,cooldown:.8},train:{gain:.65,cooldown:.4},
} as const;

export const audioFiles=['animal-deer','animal-rabbit','animal-fox','music','command','impact','complete','victory','defeat','cannon','splash','gather','build','train','melee','bow','siege','buildingHit'] as const;
