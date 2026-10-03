# Visuell riktning – RTS-092

Två öppningsbara [referensvyer](design/references.html): startsida `#home` och spelvy `#game`. Öppna via Vite `/design/references.html`. Statiska designreferenser; spelvyns top/bottom/minimap/actions är mål för097–101 och implementeras inte i denna task.

- Egen fantasyidentitet: mörk skogsgrön sten/trä, varm mässing, en geometrisk sköld och två fraktionsfärger. Titeln/projektnamnet är warcraft-2-tribute. Ingen kopierad originalgrafik eller font.
- Palett: bakgrund `#101917`, panel `#192b28`, kant `#977a40`, accent `#d5b66b`, text `#eee5cf`, sekundär `#aebcaf`. Val/positiv `#67a879`, attack/fel `#da7665`. Information ges även med text/ikon, inte enbart färg.
- Typografi: Georgia/Times-serif för titel och meny; system-ui för form, stats, feedback. Inga fontdownloads.14–16px brödtext, minst36px actions, synlig gul keyboard-focus. Läslängd och kontrast prioriteras före ornament.
- Startsida: fönsterfyllande bakgrund, titel/crest till vänster och fyra ingångar till höger. Matchform visas efter Campaign/Skirmish. Settings återanvänder ljud, Load validerad lokal save. Vid1280×720 och1920×1080 ska huvudmenyn rymmas utan scroll.
- Spelvy: startmenyn dold; pixelvärld fyller kvarvarande yta, ingen CSS-skalning till fraktionella spritepixlar.097–101 flyttar ekonomi till48px top och selection/actions till170px bottom, minimap overlay nedre vänster.095 använder befintlig sidopanel och separat sessionrad tills dess.
- Assets: befintliga egna pixelatlas i `public/assets`, källor under `assets/sources`, licens i [assets/ASSET_LICENSE.md](assets/ASSET_LICENSE.md). Referensens sköld och layout är egen HTML/CSS; terräng/sprites är repoegna och vyn märkt kompositionsprov. Inga externa assets/attributioner införda.
- Referenser är beslutad riktning, inte bevis på implementerad HUD eller funktionella mock-knappar. Screenshots granskas i båda målupplösningar och protokoll förs i DEV_LOG.
