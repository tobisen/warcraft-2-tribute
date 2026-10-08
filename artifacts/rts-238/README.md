# RTS-238 — prestanda vid markering/order

Chrome headless, lokal Vite, viewport1280×720, faktisk canvas1280×488.
Explicit stressfixture128 kroppar (116 egna,12 enemy) och32 murar, injicerad
HP/supply; detta är inte en betald match eller mätning på användarens dator.

CPU-proben i probe-before/after: median update29.6→13.9ms, median frame
33.3→16.7ms. nearbyObstacles self3.90→1.92s och GC1.22→0.62s per10s.
Reproducerbar kontroll i scripts/check-input-performance.mjs, before/after:
W2T_DISABLE_MARINE_CACHE=1 stänger enbart återanvändning av den härledda kartan
via temporär browserresponse; inga debugflaggor i runtime. Efter10s live match
fryses rörelse och kamera centreras för12 faktiska markeringsklick samt en
högerklicksorder till108 soldiers. Inputfixture är alltså stabiliserad; handlers
mäts, inte browserns fulla event-to-photon-latens.

| Median | Before | After |
| --- | ---: | ---: |
| update |36.5ms|17.1ms|
| frame |33.4ms|16.7ms|
| selection handler |3.5ms|3.4ms|
| en grupporder (108 units) |153ms|189.2ms|

Separat första after-körning hade234.8ms för gruppordern. Direkt orderplanering
är fortfarande dyr i detta extrema fall; ingen förbättring av dess latency hävdas.
Första before-inputförsök klickade ett rörligt/offscreen mål; fixturen korrigerad
till centrerat stillastående mål, båda slutliga klickkontroller PASS. Alla108 units
behåller move-order. Bild efter faktisk grupporder visuellt inspekterad.

Optimering: marineFlightMap återanvänder filtrerad hinderlista efter originalets
arrayidentitet + revision/längd/kartprofil. Då återanvänds också befintligt spatialt
collisionindex. Init-push, immutable replacement/revision och profilers byte
invaliderar. Vatten filtreras fortsatt, stenar/byggnader/terrängformad duplicate
byggnad kolliderar. Deriverad cache sparas inte och gameplaytid/balans ändras inte.

Riktade36/4 PASS, unit527/92 PASS22.78s och strict build866ms/diff/script syntax
PASS. Fullregression1869/215 PASS516.80s. CPU-profiler
hålls externa i /private/tmp, sammanfattning i probe-cpu.json. Headless mätvärden
varierar med övrig CPU-last; fullsuite kördes delvis parallellt med kontrollen.
