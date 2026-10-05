/** Product release version is independent of git/build identity and Save config. */
export const releaseVersion='0.3.0';
export const changelog=[{version:releaseVersion,title:'Expanded campaign, independent AI and teams',changes:[
 'Seven expanded campaign operations with permanent phases, exploration, transport and clear current objectives; the short tutorial is preserved.',
 'Independent player economies and AI profiles, with three-player skirmish on Plains96 and Plains128.',
 'Configurable teams, shared allied vision, team victory and camera-only spectator play after your elimination.',
 'Hold position, patrol, Shift order queues and terrain-aware group destinations.',
 'Fortifications, repairs, spells and combined armies; flyers currently retain temporary art.',
 'Reliable mouse actions, faction action icons, authored Frontier forests/coasts and interactive wildlife with original sounds.',
 'Save51 preserves campaign phases and team state; older saves keep their original campaign rules.',
 'Reduced repeated fog work for large armies. Human campaign duration/balance and remaining voices/final flyer art are still unverified.',
]}, {version:'0.2.0',title:'Five factions and eight-mission campaign',changes:[
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
