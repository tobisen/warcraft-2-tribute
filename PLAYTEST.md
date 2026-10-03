# Beginner-speltest – RTS-110

Status: avklarat enligt användarens rapport 2026-10-03: ”speltestet är avklarat och det såg bra ut”.
Version: RTS-109, commit d1e5b6f. Publicerad adress: [spelet på GitHub Pages](https://tobisen.github.io/warcraft-2-tribute/). GitHub Actions 37135134183: success. Publicerad bundle index-D5sn15XH.js verifierad i browser 2026-10-03.

## Genomförande

1. Öppna Campaign → Tutorial – First Steps. Välj Beginner och 1×. Följ målen utan extern hjälp. Notera vilket steg som behöver förklaras bättre eller där du fastnar.
2. Starta sedan Skirmish, Arena, Crown Alliance, Beginner och 1×. Försök bygga ekonomi och ett försvar med vanliga kontroller. Notera om en soldier är färdig före första synliga fiendeangreppet.
3. Berätta kort vad som gick lätt, vad som var otydligt och om förberedelsetiden räckte. Ange ungefärlig tidsåtgång och browser/fönsterstorlek om du vet dem. Säg även hur van du är vid RTS-spel.

Paus är tillåten; notera om du behövde pausa för att hinna förstå. Ingen viss matchlängd eller Victory krävs för nybörjarbedömningen. Ett tekniskt fel eller ett otydligt mål är en observation, inte ett misslyckat test från spelarens sida.

## Rapporterat resultat

| Observation | Resultat |
| --- | --- |
| Testare och tidigare RTS-erfarenhet | Användaren; erfarenhetsnivå ej specificerad |
| Spelversion, browser och viewport | Ej rapporterat |
| Tutorial genomförd; otydliga steg | Ej rapporterat |
| Gathering och leverans förstådd | Ej rapporterat |
| Barracks byggd och soldier tränad före angrepp | Ej rapporterat |
| Paus/external hjälp som behövdes | Ej rapporterat |
| Bugs, frustration och tidsåtgång | Ej rapporterat |
| Slutsats och eventuell avgränsad åtgärd | Användaren bedömer speltestet avklarat och bra. Inga problem rapporterade; ingen balansändring motiverad. |

Rapporten är övergripande. Browser, tidsåtgång, enskilda tutorialsteg och soldier-timing har inte specificerats; dessa detaljer lämnas ej rapporterade. Användarens godkännande ligger till grund för att avsluta RTS-110 och fortsätta roadmapen.

## Teknisk baseline, inte nybörjarspeltest

RTS-109 har 822 passerade tester, typecheck/build/diff och browserflöden i 1280×720 och 1920×1080. Tutorialen har betalda genomspelningar för två fraktioner och två speeds, plus Save/load och restart. Publicerade spelet har dessutom genomspelats med riktiga browserinputs i realtid: alla sex tutorialsteg → Victory, utan runtime- eller nätverksfel. Ingen av dessa kontroller visar hur lätt en ny spelare förstår spelet.

Förväntade configvärden: Beginner har första skirmish-dispatch tidigast 120 gameplaysekunder plus befintlig 20-sekunders economygrace. Faktisk första synliga attack kan komma senare på grund av förberedelse och förflyttning. Detta är config, inte en uppmätt spelarobservation. Inga balansändringar görs innan verklig feedback finns.
