# RTS-061 – Kvalitetsgranskning 2026-10-02

## Miljö och omfattning

Chromium 147.0.7727.15/headless, macOS arm64; 1280×900 och 1024×768, native 800×600. Publicerad Pages och lokal dist från 538e6ae/RTS-060, inga runtimeändringar i denna granskning. Canvas/assets, båda ljudformaten, selection/movement, pause/save/reload/load/resume, tio restarts och båda viewportarna omkörda på Pages utan runtime/requestfel. 457 tester, typecheck/build och diff-check passerade.

[RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) redovisar fem naturliga Normal-UI-matcher och 15 legala accelererade scenario/profil-flöden inklusive båda modes och samtliga missions; dessa återanvänds som oförändrad releaseevidens. Ny större-armé-kontroll använder betalda player-commands och acceleration, inte injicerad valuta/HP/units: Belägringen/Easy, barracks (512,384), farms (512,512)/(608,512), 10 soldiers +1 archer +1 catapult och tre workers. 279,20 gameplay-sekunder, kostnad340 wood/80 gold, 15 levande units, save/load bevarade hela armén. Ingen full naturlig större-armé-UI-match påstås.

## Prioriterade, bekräftade fynd

| ID | Prioritet | Reproduktion och faktiskt beteende | Förväntat nästa beteende | Hantering |
| --- | --- | --- | --- | --- |
| QA-001 | P2 | Samla en större betald armé mot samma synliga fiende. När striden slutar stannar units nästan på samma punkt; unit-5/unit-6 hade centrumavstånd0,322 px i kontrollen. Pixelkroppar/ringar/HP staplas och individuell klickselection blir svår. | Lokal separation som respekterar kroppsstorlek, terräng och orders. | Redan avgränsad till RTS-063. Tidigare medveten begränsning, ingen P0/P1-regression. |
| QA-002 | P2 | Ge flera workers gather på samma nod. Approach väljer samma närmaste kontaktpunkt och alla kan samtidigt arbeta där utan kö. Ingen fysisk begränsning av samtidiga serviceplatser. | Avgränsad rättvis kö vid nod/passager, bevarad last och fungerande avbrytning. | RTS-064 efter separation. Befintlig ekonomi är korrekt; detta är planerad trängselförbättring. |
| QA-003 | P3 | Navigera med Tab. Minimap har tabIndex−1, saknar keyboard-handler och kan inte nås/användas via tangentbord trots textlabel. | En framtida separat tillgänglighetsslice kan lägga till fokus/keyboard-pan. | Kvarstående mouse-krav, inget nytt featurearbete i RTS-061–065. |

Inga bekräftade blockerande eller P1-buggar hittades. RTS-062 ska därför inte hitta på fixes: bekräfta denna prioritering och lämna QA-001/002 till sina avgränsade tasks. QA-003 kvarstår med låg prioritet och är inte en bekräftad regression från en tidigare keyboard-kamera.

## Läsbarhet och tillgänglighet

Egna blå/röda sprites, HP-staplar, ringar, byggsteg och DOM-status är läsbara i verifierade desktopstorlekar. Fokus/labels/statusroller finns för UI-knappar; audiomute och volymer fungerar. Ringen och HP-staplarna tappar tydlighet i överlappande grupper (QA-001). Matchen kräver pekdon för world-selection och kamera; full skärmläsar-/keyboard-only-spelbarhet har inte verifierats. Acoustic listening, andra browsermotorer och mobil kvarstår från releaseprofilen.

## Granskning och begränsningar

Granskade input/session/save-livscykel, betalning/produktion/supply, navigation/interaction, array/ID-cleanup och publicerade assetvägar. Browserfixtures är tydligt separerade från naturliga flöden; inga spekulativa buggar, balansändringar eller fraktions-/sjöfeatures infördes. Bundle-varningen kvar inom releasebudget. Ingen garanti utanför verifierad miljö/flöden.


## RTS-062: prioriteringsbeslut

Ingen P0/P1-fixlista valdes eftersom inga sådana fel reproducerades. QA-001/002 behålls för RTS-063/064, QA-003 kvar som P3. Inga spelkodändringar, ingen påhittad regression och ingen save-versionändring. Befintliga 457 tester/typecheck/build/diff-check omkörda; aktuella browserrepro och releaseevidens från RTS-061 gäller oförändrad runtime.


RTS-063: QA-001 åtgärdad för stillastående grupper i öppet fält; betald armé minavstånd24,24px, save/load/gruppmove godkända. Soft separation kan ha kortvariga rörelsekontakter; fysisk passage/node-admission hanteras i RTS-064.

RTS-064: QA-002 åtgärdad med högst tre serviceplatser vid överbelastade resursnoder, roterande prioritet och väntplatser. Åtta workers, 400 wood och 338,8 gameplay-sekunder verifierade i Chromium-fixture med riktig drag/right-click och Save/Load: alla fick last, allt levererades, noll strandsatta orders. Separat 12-kropps passagefixture slutfördes efter borttagning av en kropp. Fixtures är avsiktligt injicerad belastning, inte betald produktion. QA-003 (minimap keyboard) förblir P3 utanför denna etapp.
