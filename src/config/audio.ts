/** Presentation only; PCM composition length excludes Vorbis decoder padding. */
export const audioConfig={musicLoopSeconds:16,menuMusicGain:.35,maxEffects:6};
/** Leave two source slots for alerts/results; quiet work cues repeat less often. */
export const effectMix={
 command:{gain:.65,cooldown:.12},impact:{gain:.65,cooldown:.16},complete:{gain:.65,cooldown:.4},
 victory:{gain:.8,cooldown:1},defeat:{gain:.8,cooldown:1},cannon:{gain:.7,cooldown:.25},
 splash:{gain:.5,cooldown:.3},warning:{gain:.8,cooldown:1},
 gather:{gain:.4,cooldown:.8},build:{gain:.4,cooldown:.8},train:{gain:.65,cooldown:.4},
} as const;

export const audioFiles=['music','command','impact','complete','victory','defeat','cannon','splash','gather','build','train'] as const;
