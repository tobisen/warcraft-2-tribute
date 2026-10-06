# Gameplayfas RTS-195–204 — 2026-10-06

Alla tio beställda förbättringar levereras taskvis till origin/main. Stopp efter204.
Ingen ny roadmap, karteditor eller Pages-release ingår.

| Task | Resultat | Commit |
|---|---|---|
|195|Byggknappar på en eller två rader|e7cef16|
|196|Automatisk synlig nåbar strandkontakt för load/unload|18be41e|
|197|Billig byggpreview, full vägkontroll vid placering|66fe7dd|
|198|Kort tooltip efter120ms, tydlig blockeringsorsak|c4376d6|
|199|Mushjulzoom0.5×–2× med pointerankare|4b2ad55|
|200|Kroppssäkra raka/diagonala delsträckor runt hinder|30f9734|
|201|Manuella workerattacker2DPS, last bevaras|d95468b|
|202|Två skatter och en rekryt på varje ny skirmishkarta|7954e2e|
|203|Två extra huvudbyggnader med egna workerköer/rally|485e9e5|
|204|Fem akademier och attack/försvar II; Save62|Hash rapporteras efter push|

204 bygger på befintlig roster, fraktionsteknik och bas-/tornuppgraderingar.
Akademin kräver forge och båda forskningsnivåerna I:80wood+40gold,10s
workerjobb,64×64 footprint och140HP. Nivå II kostar dubbla fraktionens nivå I,
tar12s och använder samma multiplikator två gånger. Workers får ingen militär
bonus. Betald avancerad forskning avbryts utan refund om forge/akademi förstörs;
färdiga nivåer består. AI följer kedjan och behåller tidigare expansionsprioritet.
Kampanj låser akademin till uppdrag6–8. Befintliga tidiga recipes består.

Save58–62 införs taskvis med kontrollerad migration och avvisning av omdöpta
äldre format. Sparade skatter/rekrutter, lastningsmöten, workerorder, extra
basköer/rally och akademi/forskning återställs; äldre matcher får inga nya fynd.
Kampanj förloras fortsatt vid ursprungsbasens död; skirmish/team vid sista färdiga
basens död. Foundations ger ingen basöverlevnad/supply/dropoff.

## Bilder och faktisk browser

Native800/1280 kontrolleras med fysisk mus/tangent/knappinput och riktade
funded fixtures; detta är teknisk verifiering, inte mänskligt matchspel eller
balansgodkännande. JSON och bilder finns under artifacts/rts-195–204.

- [203 före](artifacts/rts-203/1280-before.png) → [extra bas och workers](artifacts/rts-203/1280-completed.png).
- [204 före](artifacts/rts-204/1280-before.png) → [grund](artifacts/rts-204/1280-foundation.png) → [akademi/teknik II](artifacts/rts-204/1280-level-II.png).
- [Kompakt800 efter](artifacts/rts-204/800-level-II.png), [Orc](artifacts/rts-204/clans-academy.png), [Elves](artifacts/rts-204/elves-academy.png), [Dwarves](artifacts/rts-204/dwarves-academy.png), [Goblins](artifacts/rts-204/goblins-academy.png).
- [204 browserresultat](artifacts/rts-204/browser.json): betalt bygge, fysisk workerconstruction, attack/försvar II och Save/load under forskning; två/en byggrader, inga pageerrors.

450 tidigare byggnadssprites bevaras pixel för pixel;40 egna nya
akademiframes tillkommer, fem fraktioner × två teams × fyra stadier. Separat
byggnadsexport skyddar samtidig användarredigering av unitkällorna.

## Verifiering och begränsningar

Slutresultaten för full regression, unit, strict build och diff finns i
[HANDOFF.md](HANDOFF.md) och [DEV_LOG.md](DEV_LOG.md). Tidigare taskvisa belägg
är historik och kompletteras av slutregressionen. Ingen ny CI/Pages/ljud- eller
mänsklig balansgranskning hävdas. Vite har fortsatt varning för stort bundle.

Transport söker lokala möten inom256px från båten/512px från trupp,30s timeout;
utanför området kan man fortfarande ge manuella order. Fynd finns endast i nya
skirmishmatcher, AI samlar dem inte, full supply väntar. Pathfinding använder
fyrgrannars BFS med säker förenkling; globalt kortaste Euclidean-väg garanteras
inte. RTS-200:s tidigare Frontierstress med793träd/18workers gav59.2fps/4ms
median på testmaskinen; det är en kort mätning, ingen hårdvarugaranti.

Kartfasens nio kartor/dimensioner/träd/gruvor/berg/kust och före/efterbilder
redovisas separat i [MAP_PHASE.md](MAP_PHASE.md). Alla nya kartor är128×128
32px tiles/4096×4096 world pixels.195–204 ändrar inga kartdimensioner.

Användarens src/style.css, assets/sources/units.mjs och otrackade docs/ bevaras
utanför dessa commits. Ursprung för de externa ändringarna tillskrivs inte
något verktyg utan belägg.
