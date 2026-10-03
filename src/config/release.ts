/** Product release version is independent of git/build identity and Save config. */
export const releaseVersion='0.1.0';
export const changelog=[{version:releaseVersion,title:'Presentation and match review',changes:[
 'Separate Victory and Defeat pages with Play Again, Main Menu and statistics.',
 'Expanded match statistics, including all resource nodes and completed/destroyed buildings.',
 'Local audio, voice, camera and new-match preferences persist across reload.',
 'Frontier Valley expansion resources, original fantasy sprites and bounded work/production audio.',
 'Six rendering resolutions with aspect-preserving canvas/HUD scaling and separate fullscreen.',
 'Original five-peoples fantasy start page with reduced motion and muted menu ambience.',
 'Existing tutorial, missions, land/naval gameplay and local saves remain available.',
]}] as const;
