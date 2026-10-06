# Kartfas RTS-191–194

2026-10-06. Nya matcher använder individuella skogsträd, gemensam Frontier-terräng och riktiga128×128 spelbara tiles. Tiles är fortsatt32px; sprites eller bakgrund har inte skalats upp.

## Kartinventering och dimensioner

| Kart-ID / spelkarta | Tidigare tiles | Tidigare world pixels | Nya tiles | Nya world pixels |
| --- | --- | --- | --- | --- |
| arena / Arena |40×30|1280×960|128×128|4096×4096|
| forest / Forest Pass |40×30|1280×960|128×128|4096×4096|
| river / River Bend |40×30|1280×960|128×128|4096×4096|
| islands / Islands |40×30|1280×960|128×128|4096×4096|
| frontier / Frontier Valley |50×36|1600×1152|128×128|4096×4096|
| plains96 / Western Plains |96×96|3072×3072|128×128|4096×4096|
| plains128 / Eastern Plains |128×128|4096×4096|128×128|4096×4096|
| highlands / Highland Crossroads |96×96|3072×3072|128×128|4096×4096|
| coast / Shattered Coast |128×128|4096×4096|128×128|4096×4096|

Alla skirmishkartor och alla kampanjers återanvända kartunderlag ingår. Plains128/Shattered Coast satte den befintliga miniminivån. Största kartorna får också ändlig expansionsstock och sammanhängande skogar. Kart-ID:n, ursprungliga baser, uppdragsmål, triggers och första ekonomin behålls. Highland/Western Plains utvidgas utanför den tidigare96×96-geometrin; de ursprungliga tre bergspassagerna bevaras och ridgen fortsätter till nya södergränsen.

Nya sektorer innehåller kantavverkade tätgroves,150gold-gruvor, brutna klippryggar, dammar och jordstråk mellan arbetsområden. Inlandskartorna har sammankopplade landvägar; Islands får större hav och en sydlig landmassa som kräver transport från startöarna. Shattered Coasts befintliga hav/resource islands består. Terräng och resurser filtreras mot originalresurser/strategiska positioner; entréer lämnas fria. Utvidgad stock räknas uttryckligt i initiering, statistik, matchinställningar och strikt sparvalidering.

## Avverkning, arbete och sparning

Varje synligt skogsträd i nya matcher är en riktig wood-resurs med stabilt ID/position/stock. Selection visar återstående wood, tilldelade och aktivt arbetande egna workers samt onåbarhet. Högerklick med valda workers ger normal gather-order.32×32 markfootprints blockerar täta skogar; inga workers går genom kronornas markceller. Kantträd öppnar åtkomst när de uttöms. Stock0 ger stubbe och borttaget collisionhinder; gemensam revision invaliderar navigation. Efter leverans väljs nästa synliga nåbara träd enligt befintliga last-/köregler. Frontier-groves ursprungliga600wood delas mellan142 träd; Forest Pass får210 uttrycklig wood i den tidigare dekorativa skogspatchen.

Gruvan har ett96px originalmotiv med entré/timmer/rails/berg/malm och polygonklickyta. Arbete/collision är fortsatt40×40. Markdjup följer world-y; gruventréns workers syns framför motivet och enheter bakom berget hamnar bakom det. Klippor har ljusa toppar och mörka syd-/östsidor med nordvästligt ljus.

Save57 lagrar `worldLayout: expanded` separat från terrain/resource layout. Tidigare sparningar behåller dåtidens dimensioner, resurser och geometri; äldre koordinater läses inte mot den utvidgade kartan. Blandade versioner/layoutmarkeringar avvisas. Dolda träds senaste observation bevaras i fog, inklusive separata AI-spelares sparade minne.

## Bildbelägg

- Skog före avverkning / efter öppnad passage: [före](artifacts/rts-191/forest-before-1280.png), [efter](artifacts/rts-191/forest-after-1280.png).
- Gruva före / efter detaljering: [före](artifacts/rts-191/mine-1280.png), [efter](artifacts/rts-192/mine-1280.png).
- Berg före / efter: [före](artifacts/rts-191/mountain-1280.png), [efter](artifacts/rts-192/mountain-1280.png).
- Gemensam terräng på samtliga nio kartor: [193-browserprotokoll](artifacts/rts-193/browser.json) och skog/gruva/berg/kustbilder i samma katalog.
- Utvidgade kartor: [194-browserprotokoll](artifacts/rts-194/browser.json), [Frontier-gruva](artifacts/rts-194/frontier-mine.png), [Highland-expansion](artifacts/rts-194/highlands-expansion.png), [Islands-kust](artifacts/rts-194/islands-coast.png).
- Stor tät skog: [18 workers](artifacts/rts-194/forest-stress-18.png), [prestandaprotokoll](artifacts/rts-194/performance.json).

Screenshots är faktisk native spelstorlek800/1280, zoom1. Terränggallerier använder uttryckligt synlighetsfixture för att kunna granska hela motivet; input-/avverknings-/sparflöden använder fysisk browserinput. Prestandafixturen placerar3/18 workers i verkliga gather-jobb på en4096² Frontier-karta. Den är inte en mänsklig genomspelning. Browsern kördes i arbetskatalogen med användarens befintliga CSS; CSS-filen ingår inte i kartcommits.

## Leverans och begränsningar

191 `036e306`,192 `461597e`,193 `1b06889` är pushade till origin/main.194:s slutliga unit472/85 och build inklusive strict typecheck passerar. Native Frontier-flow, nio kartors terräng/minimap/SaveLoad samt expansionsgruvornas landåtkomst är kontrollerade. Fullregression1528/181 PASS523.12s; manifest85/96, syntax, diff och dokumentlänkar PASS.194 levereras i denna taskcommit och slutlig hash rapporteras vid push. HANDOFF/DEV_LOG redovisar checks och tidigare felkörningar.

På4096² Frontier med793 träd gav3/18 aktiva workers median 3,8/4,1 ms, p95 4,5/4,6 ms och 59,8/59,4 fps över cirka300 uppvärmda frames per fall i Chrome. Delade collisionindex, exakt fogmemo, gemensamma arbetskartor och64 statiska terrängchunks begränsar kostnaden.

Mänsklig helkampanj-/balans-/tidsgranskning och längre matchprestanda på annan hårdvara ingår inte i de tekniska beläggen. Äldre saves behåller sin historiska terräng och får inte nya skördbara skogar eller större värld retroaktivt. Ingen ny CI/Pages-/release-/ljudverifiering hävdas. Användarens style.css och otrackade docs/ bevaras. Kartfasen stannar efter RTS-194; inga nya tasks eller karteditor startas.
