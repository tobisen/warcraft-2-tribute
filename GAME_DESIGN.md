# Game design

## Inriktning

RTS-001–036 är implementerade. Slicebeskrivningarna visar utvecklingen;
avsnitten RTS-018–036 längst ned anger dagens HUD, terrain/navigation,
kantbaserade ranges, gruppmål och säkra placering/spawn.


Ett browserbaserat singleplayer-RTS inspirerat av Warcraft 2, Age of Empires 2
och Command & Conquer. Spelaren samlar resurser, bygger upp sin bas,
producerar stridsenheter och möter fiendevågor. Local-first och gameplay före
grafik styr arbetet. Placeholders är tillåtna.

## MVP

- En karta.
- Drag selection och move commands.
- Gathering av resurser.
- En bas och en produktionsbyggnad.
- En stridsenhet.
- Enkla fiendevågor.
- Tydliga win/loss-tillstånd.

Kostnader, stats, vågor och win/loss beskrivs i implementerade slices nedan
och definieras i TypeScript-config.

## Ursprungligt selection- och command-beteende (RTS-004)

Tre placeholder-enheter med unika ID:n börjar omarkerade på separata positioner.
Vänsterklick på en enhets kvadratiska yta ersätter selection med den enheten.
Vänsterklick på tom mark avmarkerar alla. Ringarna är inte klickytor; vid
överlapp väljer klick den sist renderade enheten.

Vänsterdrag visar en markeringsrektangel i alla riktningar. Vid release ersätts
selection med enheter vars centrum ligger inom rektangeln inklusive kanten.
Tom rektangel avmarkerar alla. Gester under 5 screen pixels behandlas som klick;
vid 5 pixlar eller mer blir gesten drag. En gest som nått tröskeln förblir drag
även om pekaren återvänder. Varje markerad enhet får en ring som följer rörelsen.

Högerklick på tom mark skickar samma move-command till alla markerade enheter och ersätter
deras tidigare mål. Avmarkering stoppar inte pågående rörelse eller ändrar
målen. Omarkerade enheter ignorerar nya kommandon. Rörelsen är fortsatt rak,
delta-baserad och stannar exakt utan overshoot. Enheter får överlappa vid samma
mål; inga formationer eller collision avoidance finns.

Shift-selection, kontrollgrupper, pathfinding och HUD ingår inte i denna slice.

## Resurssamling med bas och leverans (RTS-006)

De tre enheterna är placeholder-arbetare. Den bruna noden vid (650, 180) börjar
med 400 wood efter RTS-012 (ursprungligen 100), och en fast blå bas står vid (400, 450). Markera arbetare och
högerklicka på noden för gather. Inom 24 world pixels från nodens footprintkant samlar
varje arbetare 1 wood/sekund till sin last, högst 5 wood. Text vid arbetaren
visar last/kapacitet med en decimal.

Full last startar en automatisk tur till basen. Inom 24 px från basens footprintkant
levereras hela lasten till gemensamt saldo. Arbetaren går sedan tillbaka till
sin resursnod om wood finns. Vid uttömning levereras även delvis fylld last,
sedan blir arbetaren idle. Enkla texter visar saldo och nodens återstående wood.
Den tidigare direkta krediteringen från RTS-005 är ersatt: saldo ökar först
vid leverans. Nod, laster och saldo bevarar totalt wood.

Move-order avbryter arbetsloopen men bevarar lasten. En ny gather-order med
full last levererar först; partiallast fortsätter fyllas om noden har wood.
Gather på uttömd nod levererar eventuell kvarvarande last och avslutas sedan.
Avmarkering påverkar inte loopen. Det finns ingen manuell leveransorder.
Enheter får överlappa. Arbetsloopen har ingen pathfinding eller collision och
använder endast wood.

## Arbetarproduktion från basen (RTS-007)

Knappen ”Träna arbetare – 20 wood” startar produktion från den befintliga basen.
Godkänd start drar 20 wood direkt från levererat saldo och tar 5 gameplay-
sekunder. Endast en produktion får pågå; otillräckligt saldo och upptagen bas
blockerar start. Återstående tid visas med enkel text; ingen kö finns.

Den nya arbetaren skapas nära basen vid (460, 450) med unikt ID, tom last,
idle och utan markering. Den kan klick-/dragmarkeras, flyttas och samla/leverera
precis som startarbetarna. Produktionsknappen ändrar inte selection eller ger
order. Spelaren markerar och kommenderar den nya arbetaren själv.

Basproduktionen har ingen avbrytning/refund,
rally point eller population cap införs. Den begränsade noden och produktions-
kostnaderna sätter naturliga gränser för antalet nya arbetare i denna slice.

## Barracks-placering (RTS-008)

”Bygg barracks – 40 wood” öppnar placeringsläge med synlig preview. Barracks
är 2 × 2 tiles och dess övre vänstra hörn snappas till 32 px-grid. Grön preview
är giltig; röd preview och text visar fel. Vänsterklick placerar direkt om hela
footprinten ligger i världen, inte överlappar bas/nod och saldo är minst 40.
Kostnaden dras exakt en gång vid lyckad placering; bara en barracks får byggas.

Escape eller högerklick avbryter gratis. Ogiltiga klick stannar i placeringsläge
utan debitering. Selection och unit-orders ändras inte av placeringsinput.
Byggknappen kan öppna preview vid lågt saldo; det kontrolleras vid placering.
Basens och nodens footprints samt kantkontakt beskrivs i [DECISIONS.md](DECISIONS.md).
Arbetare blockerar inte platsen. Basproduktion påverkas inte av placeringsläget.

Ingen byggtid, byggande arbetare, rivning, pathfinding,
unit-collision eller generell byggmeny ingår.

## Soldier-produktion från barracks (RTS-009)

Efter placering aktiveras ”Träna soldier – 20 wood”. Godkänd start drar 20 wood
omedelbart och tar 5 gameplay-sekunder. En produktion åt gången per byggnad,
ingen kö; bas och barracks kan producera samtidigt. Otillräckligt saldo eller
upptagen barracks blockerar start. Återstående tid visas bredvid knappen.

Soldier skapas strax utanför barracks footprint, med hela kroppen inom världen,
unikt ID, idle, utan markering och utan last. Orange färg och texten Soldier
skiljer den från gröna workers. Klick-/dragselection och movement fungerar som
för workers. Soldier kan inte samla eller bära wood. Vid blandad selection och
högerklick på resursnoden får workers gather-order medan soldiers behåller sina
order. UI-interaktion ändrar varken selection eller unit-orders.

I RTS-009 tillkom bara produktion/movement. Combat, HP och fiender har sedan
införts i RTS-010/011. Rally point, kö, population cap, collision och pathfinding
ingår fortfarande inte. Spelaren markerar och kommenderar soldaten själv.

## Utvecklingsordning

Efter projektinitialisering: movement → selection → resources → buildings →
combat → AI. [BACKLOG.md](BACKLOG.md) definierar genomförbara tasks; ordningen
är inte en färdig tasklista.

## Avgränsningar

Ingen multiplayer, backend, konton, procedural generation, modding eller
deployment. Save/load ligger efter MVP. Grafikproduktion är inte ett krav
för att verifiera gameplay.

Se [DECISIONS.md](DECISIONS.md) för beslut och [ARCHITECTURE.md](ARCHITECTURE.md)
för tekniska principer.

## Manuell melee (RTS-010)

Markera soldiers och högerklicka på en röd enemy för att angripa. Soldiers går
rakt till 32 px centrumavstånd och skadar med 18 HP/s. En enemy börjar med
36 HP; soldier med 60 HP. HP visas vid kropparna. Fiende med HP 0 försvinner
och soldiers blir idle. Attack följer mål-ID; move avbryter, avmarkering och
resursklick gör det inte. Workers angriper inte och behåller sin arbetsorder.
En stillastående övningsfiende används tills wave-slicen ersätter den.

## Enemy AI (RTS-011)

Röda enemies går mot basen eller närmaste soldier inom 140 px. De gör 6 HP/s
inom 32 px och rör sig med 65 px/s. Basen börjar med 240 HP och visar återstående
HP. Soldiers med HP 0 försvinner. Båda sidor kan dö samtidigt. Workers och
barracks angrips inte; soldiers måste fortfarande få manuell attack-order.

## Arena och waves (RTS-012)

Den enda kartan är en öppen 800 × 600-arena med befintlig bas/wood-nod.
Noden har nu 400 wood (tidigare 100). Samla från start, placera barracks och
producera flera soldiers före första vågen. Tre vågor anländer efter 60, 90 och
120 gameplay-sekunder med 1, 2 och 3 enemies från övre högra delen. Wave/countdown
visas vid basens HP. Endast dessa sex enemies spawnar; inga oändliga vågor.
Övningsfienden från RTS-010/011 är borttagen.

## Defeat (RTS-013)

När basens HP når 0 visas ”Defeat – basen är förstörd”. Simulation och gameplay-
input stoppas, inklusive insamling, enheter, produktion och waves. Selection
bevaras, pågående placeringsläge/dragpreview avslutas. Slutläget visas på arenan.

## Victory (RTS-014)

Efter sista vågens spawn: besegra alla kvarvarande enemies för ”Victory – alla
vågor besegrade”. Inga fler vågor anländer. Defeat har företräde om basen
förstörs samtidigt som sista enemy dör. Victory stoppar simulation/input precis
som defeat. Alla soldiers angriper manuellt; ge nytt mål när föregående dör.

## Starta om (RTS-015)

Efter victory eller defeat visas ”Starta om”. En ny match börjar direkt utan
sidomladdning: 240 bas-HP, 400 wood i noden, saldo 0 och tre omarkerade idle-
workers. Byggnader, soldiers, enemies, last, produktion, orders, markering,
waves och alla timers/ID-räknare återställs. Börja samla och bygg nytt försvar.

## Spela hela MVP-matchen

1. Dragmarkera de tre gröna workers och högerklicka på bruna noden. De samlar
   och levererar automatiskt. Avmarkering avbryter inte deras arbete.
2. Vid 40 wood: placera barracks, till exempel omkring (512, 384), fri från
   bas/nod. Fortsätt samla och träna soldiers för 20 wood och 5 sekunder vardera.
3. Markera orange soldiers med klick/drag. Högerklicka på röda enemies för
   manuell attack; ge nästa mål när den föregående dör. Workers i samma urval
   behåller sin arbetsorder när högerklicket träffar en enemy.
4. Försvara basen mot tre vågor efter 60/90/120 sekunder. Alla sex enemies döda
   efter sista spawn ger victory; bas-HP 0 ger defeat. Restart börjar om.

Inga formationer, collision eller pathfinding finns. Workers och barracks
angrips inte; soldiers har ingen automatisk attack. Överlappande kroppar/ringar
kan göra separata enheter svåra att se; gruppurval fungerar ändå. Grafik/ljud,
save/load och avancerad AI ingår inte.

## Framtida tribute-mål – planerat efter MVP, RTS-016–060

Detta är nästa målbild, inte redan implementerade funktioner. Dagens MVP ovan
förblir en färdig wave-survival-baseline med placeholders, wood, worker/soldier,
manuell melee och restart. Den nya planen utökar den till en liten komplett
singleplayer-tribute enligt [BACKLOG.md](BACKLOG.md):

- Basbygge med worker-byggtid, guld/trä, farms/supply, rally och produktionskö.
- Worker, soldier, archer och catapult, begränsade uppgraderingar och automatiskt
  targetval/attack-move. Workers och byggnader blir attackbara i RTS-034.
- Handgjord tile-karta, hinder/navigation, större värld/kamera, minimap och fog.
- Fiendebas och skirmish med begränsad AI-resursbudget, anfallsgrupper/försvar.
- Egna pixelassets/ljud, tre korta uppdrag och versionerad lokal save/load.

Etappordning: stabilisering/navigation (016–024), kontroller/basbygge (025–034),
armé/combat (035–040), fiendebas/skirmish (041–046), överblick/kontroller (047–052),
presentation/releaseverifiering (053–060). Placeholders används till etapp 6;
releaseverifiering är lokal och innebär ingen deployment.

### Spelkontrakt i planen

Navigation avvisar otillgängliga move-mål och hanterar ändrade hinder genom
validering/omplanering eller säkert stopp. Gathering/leverans/attack använder
nåbara positioner utanför målfootprints; planerad räckvidd mäts till footprintens
kant. Dagens implementation använder fortfarande centrumavstånd och rak movement.
Separata gruppdestinationer förbättrar slutpositioner, men lovar inte full
unit-collision. Byggplacering ska hantera enhetskroppar, footprints, arbetsvägar,
spawnutgångar och wave-entry; ogiltig placering betalar inget.

Förstörda mål ska rensa selection, orders/routes och produktion/byggande utan
extra spawn/refund. Alla framtida systems timers/data återställs vid restart
eller scenario-byte och stannar vid game over. Pause tillkommer först i RTS-052.

Skirmish använder basförstörelse som victory-villkor och bevarar defeat-företräde.
Wave-survival behåller ändliga waves och sitt eget victory-villkor som separat
scenario. AI börjar med en ändlig gold/wood-budget. ”AI samlar” i RTS-043 betyder
att den samlar producerade stridsenheter till anfallsgrupper; en full worker-
ekonomi för AI är inte planerad.

Fog har teamvis aktuell synlighet och utforskad terräng. Dolda enemies får inte
läcka via rendering, HP-text, selection/targeting, HUD, ljud eller minimap.
Minnesmarkörer får endast använda faktiskt observerade data. RTS-048 bygger
modellen; spelarens fog-läge aktiveras först när RTS-049 filtrerar alla ytor.

### Preliminära val och avgränsningar

Dagens config är en verifierad spelbar baseline, inte slutbalans för två resurser
och fyra enhetstyper. Pris, supply, attackpolicy, scenario-budget, svårighetsgrader
och uppdragslängder ska speltestas i respektive task. Öppna produkt-/teknikval,
inklusive lastbyte, refund, fog-minne, tredje uppdragets mål och save-UX finns i
[DECISIONS.md](DECISIONS.md); planens assetformat/dimensioner är exportkontrakt,
inte redan producerade assets.

Multiplayer, backend/konton, sjöstrid, andra fullständiga fraktionen, procedural
generation och modding ingår inte. Save/load hör till denna plan efter MVP;
det finns fortfarande inte i spelkoden. Inga nya enheter/system införs i själva
planeringskörningen.

### Baseline-speltest RTS-016

Nuvarande regler har spelats igenom med riktiga resurser och tider i Chromium:
manuellt försvar gav victory efter cirka 125 sekunder; inget försvar gav defeat
efter cirka 101 sekunder. Detta verifierar möjliga matchutfall, inte slutbalans
eller nybörjarvänlighet. Balansutvärdering sker i RTS-017. Daterat protokoll och
begränsningar finns i [DEV_LOG.md](DEV_LOG.md).

### Verifierad preliminär survival-balans (RTS-017)

Nuvarande config behålls: 400 wood, barracks 40, worker/soldier 20 och 5 s,
last 5 och 1 wood/s. Tidigt försvar nådde barracks vid 27,03 s och första
soldier vid 42,03 s; worker-investering vid 17,50 s gav barracks 36,06 s och
soldier 50,28 s. Båda vann cirka 124 s med bas 240 HP. Utan försvar förloras
matchen cirka 101 s. Detta är en preliminär profil för manuell wave-survival;
ingen automatisk vinst eller slutbalans för nya enheter utlovas.

### HUD (RTS-018)

Ekonomi, bas-HP och wave/countdown visas i DOM ovanför canvas. Separata
produktionskontroller visar configkostnad och countdown eller spärrskäl
(saknad barracks, saldo, upptagen byggnad eller avslutad match). Markerade
enheters last/HP visas separat. HUD-input ändrar inte selection/orders; restart
har reserverad yta och återställer all status. Detta är funktionell presentation,
inte den senare fantasy-skinnen.

### Handgjord terräng (RTS-019)

Arenan har grön placeholder-mark, grå sten och blå vatten i vänstra delen.
Kartdata anger blockerade områden, men rörelse är fortsatt rak i denna
övergångsslice. Samla/försvara längs de tidigare fria MVP-rutterna. Navigation
runt terräng kommer i RTS-020–022; säkra terrängplaceringar i RTS-024.

### Move runt terräng (RTS-020)

Högerklick på mark ger kroppssäker waypoint-rutt runt terräng. Blockerat mål,
plats utanför världen eller avskuren väg avvisas med skäl vid urvalets status;
enheten stannar utan teleportering. Ny order ersätter rutten och avmarkering
stoppar inte rörelse. Ändrad hinderrevision omplanerar eller stoppar säkert.
Gather och attack är fortfarande raka fram till RTS-021/022.

### Arbete utanför footprints (RTS-021)

Workers navigerar till utsidan av bas/nod och samlar/levererar inom 24 px
från footprintens kant. Nod/bas passeras inte längre av move/work-orders.
Full last och partial depletion levereras som tidigare. Avskuren arbets-/
leveransväg stoppar loopen med feedback utan lastförlust eller remote arbete.
Ny move/gather eller ändrade hinder kan åter möjliggöra arbetet. Detta ersätter
den tidigare centrumräckvidden och påverkar turernas restid utan configändring.

### Combat runt hinder (RTS-022)

Soldiers och enemies går till nåbar melee-position runt terräng och bas/nod.
32-px-range mäts till målfootprintens kant; en stängd terrängvägg förhindrar
skada även inom nominell range. Soldiers får fortsatt manuella mål; enemy
väljer närmaste soldier inom aggro eller bas, och blockerade mål står säkert
still tills relevant target-/hinderändring. Båda sidor kan dö samtidigt och
defeat har företräde. Ingen generell collision eller avancerad målpolicy.

### Separata slutpositioner (RTS-023)

Grupp-move fördelar enheter runt klickpunkten med separata kroppssäkra mål.
Blockerat centralt klick avvisas; platsbrist visar ”Ingen ledig nåbar målposition”.
Tilldelningen är stabil per ID. Enheter kan överlappa under gång; samla/attack
behåller egna approach-regler och får inte formationsorders.

### Bygg säkert (RTS-024)

Barracks får inte överlappa terräng, workers/soldiers/enemies eller fasta
footprints, och får inte stänga tidigare nåbara arbets-, spawn- eller wave-
vägar. Preview och klick visar skälet; inga resurser dras vid avvisning.
Giltig byggnad blir nav-hinder och aktiva rutter omplaneras. Nya enheter spawnar
på ledig kroppssäker yta. Blockerad utgång visar väntande färdig produktion;
fri plats ger exakt en spawn utan ny betalning. Ingen automatisk eviction.

## RTS-025 – Kamerapanorering

Kartan är 1280 × 960 px med 800 × 600 viewport. Dra med mittenmusknappen
för att se hela världen. Zoom är 1 och HUD står still. Pan är möjlig under
byggpreview och ändrar inte enhetsmarkering eller order. Kameran stannar vid
kanterna; game over låser pan och restart börjar vid övre vänstra hörnet.

## RTS-026 – Välj byggnad

Vänsterklick på bas/barracks väljer byggnaden med gul ram och visar dess
produktionsknapp/status. Byggnadsval och unit-selection är exklusiva. Units
får klickprioritet vid överlapp; tomt klick eller dragselection rensar
byggnadsval. Avmarkering stoppar aldrig orders eller produktion. Bygg barracks
är fortsatt en global knapp. Båda byggnaderna kan producera samtidigt genom
att välja respektive byggnad och starta dess jobb.

## RTS-027 – Rally points

Välj bas eller barracks och högerklicka på nåbar tom mark för att ange dess
rally. En grön markör visar vald byggnads mål. Nyproducerade units flyttar
dit omarkerade; workers samlar inte automatiskt. Ett blockerat/utanförliggande
mål avvisas med text och behåller föregående giltigt rally. Spawn väntar
fortsatt om alla utgångar är upptagna. Om rally blir blockerat efter kommandot
spawnar unit säkert och väntar med blockerad route på ny order/hinderrevision.
Restart rensar båda byggnaders rally.

## RTS-028 – Stop och orderfeedback

Stop-knappen avbryter markerade enheters move, gather, delivery eller attack.
Last behålls; full last levereras först vid nästa gather-order. Omarkerade
units och byggnadsproduktion fortsätter. Gul målring visar aktuell vald units
order, röd ring blockerad route. HUD visar orderfas och blockeringsorsak.
Avmarkering döljer markören utan att avbryta order. Completion/död/Stop/reset
rensar markör; game over blockerar Stop och döljer ordermarkörer.

## RTS-029 – Gold och lastbyte

Gul gruva vid (850,220) innehåller 300 gold; pan åt höger för att se den.
Workers samlar båda resurstyperna med 1/s, lastkapacitet 5 och automatisk
leverans vid basen. Gold och wood har separata saldon, båda från 0.
Last är alltid av en enda typ. Högerklick till annan resurstyp med partial/full
last levererar den gamla lasten först och går sedan till nya noden. Move och
Stop behåller typ/last, avmarkering påverkar inte loopen, soldiers samlar inte.
Gruvan är ett blocking footprint och skyddas av samma placeringsregler som
wood. Goldkostnader tillkommer i RTS-030.

## RTS-030 – Tvåresurspriser

Worker kostar 20 wood, barracks 40 wood och soldier 20 wood + 5 gold.
Båda nödvändiga saldon måste räcka innan något dras; full cost dras exakt en
gång vid godkänd start/placering. En preview eller avbruten placering kostar
fortsatt inget. En fungerande grundstrategi är två wood-workers och en
gold-worker, barracks och fyra soldiers före/samtidigt med waves.

## RTS-031 – Byggtid

Välj minst en worker innan Bygg barracks. Lägsta valda unit-ID får build-order;
40 wood dras direkt och 64 × 64-footprint reserveras. Builder når utsidan och
arbetar 5 s inom 24 px. Last/typ behålls. Ofärdig barracks kan inte producera
och visas grå med återstående arbetstid. Stop eller ny order pausar bygget
utan refund; välj worker och högerklicka bygget för att återuppta. Ett bygge
har en builder åt gången. Färdig builder blir idle och behöver ny gather-order.

## RTS-032 – Farms och population

Basen ger cap 8. Worker/soldier tar 1 plats; pågående produktionsjobb reserverar
1 direkt, även under väntan på fri spawn. Full cap blockerar start utan cost.
HUD visar used + reserved / cap. Välj worker och Bygg farm – 20 wood: 64 × 64
footprint, samma approach/Stop/resume-modell och 5 s byggarbete. Färdig farm
ger +5 cap en gång; ofärdig/pausad ger inget. Högst tre farms med egna ID:n.
Olika builders kan arbeta på olika sites; en builder kan bara arbeta på en.
Om cap senare minskar behålls units och godkända jobb, men nya starter stoppas
tills plats finns. Faktisk förstörelse tillkommer i RTS-034. Restart: tre workers,
cap 8, inga farms eller reservations.

## RTS-033 – Köa och avbryt produktion

Bas/barracks har tre jobb vardera inklusive aktivt. Träna-knappen lägger till
FIFO-jobb när resurser och population räcker; hela kostnaden dras och plats
reserveras direkt. Panelen visar timer, kö och avbrytning per job-ID. Köade
jobb får 100 % cost tillbaka, aktivt jobb 50 % (även färdig blockerad spawn).
Cancel head börjar nästa fulla timer; cancel frigör reservation direkt.
Blockerad head stoppar senare jobb, och fri utgång spawnar exakt en gång.
Båda byggnadernas köer tickar samtidigt. Rally används vid spawn. Game over
stoppar köer och avvisar cancel/enqueue; restart rensar jobb/ID:n.

## RTS-034 – Förstörbar ekonomi och bas

Workers har 30 HP, barracks 120 och farms 80; projekt har samma HP och läker
inte vid completion. Enemies kan angripa dem med samma nåbara melee som
soldiers/bas. Närmaste levande player-target inom 140 px väljs; lika distans
prioriterar soldier, worker, byggnad och stabilt ID. Basen är fallback.

Worker-död förlorar last, bokförd som lostCargo per typ; saldo ändras inte.
Builder-död pausar projekt, som kan återupptas med ny worker. Döda byggnader
eller projekt ger ingen refund; deras kostnadsbetalda köer/rally tas bort och
reserverad population frigörs. Farmdöd minskar cap utan att döda andra units.
Footprint försvinner och rutter kan återplaneras. Val/targetrefs/render rensas;
produktionen körs först efter death-cleanup. Base HP 0 ger fortsatt Defeat med
företräde och restart återställer HP, ekonomi, förlustbokföring och alla jobb.

## RTS-035 – Automatisk attack

Idle soldiers söker levande, synliga, nåbara enemies inom 140 px. Närmaste
centrum väljs, med numeriskt enemy-ID vid lika distans; ett giltigt aktuellt
mål behålls. Efter kill kan nästa enemy väljas utan klick. Automatisk jakt
är begränsad till 140 px från utgångspunkten; utan giltigt mål återgår enheten
via navigation. Manuell attack har prioritet och följs tills målet dör.
Vanlig Move avbryter striden och tillåter automatisk försvar efter arrival.
Stop avbryter och håller utan auto tills nytt Move/attack; avmarkering påverkar
inte striden. Ingen acquisition vid delta 0. Fog är ännu inte aktiverad.

## RTS-036 – Attack-move

Välj soldiers, tryck Attack-move och vänsterklicka destination. Enheter får
separata gruppmål, söker samma giltiga enemies som automatisk attack och
återupptar sina ursprungliga mål efter strid. Workers behåller arbete.
Stop, vanlig Move och manuell attack ersätter hela ordern. Escape/högerklick
avbryter väntande destination utan att ändra selection/orders. Blockerad
destination avslutar ordern med befintligt route-fel; game over spärrar input
och restart rensar både gameplay-state och kommandoläge.
