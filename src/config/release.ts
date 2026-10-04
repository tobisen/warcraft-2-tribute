/** Product release version is independent of git/build identity and Save config. */
export const releaseVersion='0.2.0';
export const changelog=[{version:releaseVersion,title:'Five factions and eight-mission campaign',changes:[
 'Five playable factions with distinct paid armies and configurable enemy matchups.',
 'Eight campaign operations with local unlocks, briefings, escort, rescue and coastal capture goals.',
 'Large Highlands and Coast maps, naval transport and finite expansion resources.',
 'Grouped commands, complete hotkey help and confirmed unit dismissal.',
 'Local highscores grouped by mission/map, difficulty, speed, factions and rules version.',
 'Save33 preserves match identity; older saves remain playable without invented scores.',
]}, {version:'0.1.0',title:'Presentation and match review',changes:[
 'Separate Victory and Defeat pages with Play Again, Main Menu and statistics.',
 'Expanded match statistics, including all resource nodes and completed/destroyed buildings.',
 'Local audio, voice, camera and new-match preferences persist across reload.',
 'Frontier Valley expansion resources, original fantasy sprites and bounded work/production audio.',
 'Six rendering resolutions with aspect-preserving canvas/HUD scaling and separate fullscreen.',
 'Original five-peoples fantasy start page with reduced motion and muted menu ambience.',
 'Existing tutorial, missions, land/naval gameplay and local saves remain available.',
]}] as const;
