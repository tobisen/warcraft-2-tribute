# Game design

## Inriktning

RTS-001–096 är implementerade. Roadmap097–120 är planerad;091–096 är den färdiga presentationsetappen. Slicebeskrivningarna visar utvecklingen;
avsnitten RTS-018–060 längst ned anger dagens HUD, terrain/navigation,
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

Ingen multiplayer, backend, konton, procedural generation eller modding.
Save/load infördes efter första MVP i RTS-059. Egna assets/ljud ingår i RTS-053–057,
och Pages-publicering är godkänd inom RTS-060 efter releasekontroller.

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
releaseverifiering börjar lokalt. Användarens senare tillägg godkänner därefter Pages-publicering i RTS-060.

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

## RTS-037 – Archer

Välj färdig barracks och Träna archer (20 wood/10 gold, 6 s, supply 1).
Archer är blå med etikett, 40 HP, speed 140, range 160 och aggro 200.
Befintlig klick/dragselection, Move, Stop, automatisk attack, manuell attack
och attack-move gäller; resource-klick ger aldrig gather/cargo. Barracks
delar FIFO-kön mellan soldier/archer och bevarar jobbens typ/tid/kostnader.
Pilar: 12 damage varje sekund, speed 300, lifetime 2 s. Fast aim point gör
att rörliga targets kan undvika träff (16 px hit-radius). LOS krävs vid skott
och längs flygsegment; dött/osynligt target tar bort pilen. Damage sker bara
vid ett giltigt impact. Game over fryser simulation och döljer pilar; restart
rensar projektile-state, cooldown och rendering.

## RTS-038 – Catapult

Färdig barracks tränar catapult: 40 wood/20 gold, 10 s, supply 2. Lila
40 px kropp, 80 HP, speed 80, range 224/aggro 260. Samma orders som övriga
combat-units och ingen gathering. Navigation/spawn/klickträff använder faktisk
kropp; 32 px passage som fungerar för worker/soldier kan blockera catapult.
Fast impactpunkt, 24 damage var 2 s, projectile speed 180/lifetime 3 s.
Splash 48 px inklusive kanten, utan falloff eller friendly fire; avstånd till
byggnads-footprint används. Dött initialmål tar inte bort siege-skottet,
som fortfarande kan skada andra synliga enemies vid impact. Terrain stoppar
flygsegment. Fiendebyggnads-targets kan ta skada och deras hinder rensas;
en faktisk fiendebas/match kommer i RTS-041. Dessa värden är preliminära.

## RTS-039 – Forge och uppgraderingar

Välj worker och bygg Forge: 40 wood/10 gold, 64 px footprint, 5 s arbete,
HP 120 och högst en. Stop/ny order pausar; högerklick med worker återupptar.
Färdig Forge öppnar globala researchknappar, utan ändrad selection/order.
Attack och defense har en nivå vardera (40 wood/10 gold, 8 s, ett jobb utan
kö). Attack ger ×1,25 damage; defense ger ×0,75 mottagen damage för combat-
units. Workers/byggnader påverkas inte och inga HP återställs. Bonusar gäller
både gamla och nya units dynamiskt. Redan avfyrade projektiler behåller
sin damage. Död Forge stoppar research utan refund; färdiga bonusar består
vid rebuild. Game over spärrar research, restart återställer hela trädet.

## RTS-040 – Speltestade arméroller

Preliminära configvärden behålls efter tre upprepningsbara fixtures
(0,05 s steg, öppen karta): soldier vinner 36-HP melee-duel på 2,65 s med
47,4 HP kvar. Mot 72 HP tar ensam soldier 4,65 s; soldier + archer bakom
tar 3,30 s, soldier 43,5 HP och archer oskadad 40 HP. Catapult förstör två
48-HP stationära footprint-targets inom splash på 3,15 s, själv 80 HP; mål
utanför splash behåller 48 HP. Dessa mätningar visar tank/support/area-roller
och är inte universell slutbalans.

Naturlig full wave-match: två wood-workers och en gold-worker som bygger
barracks och återupptar gold. Soldier först, sedan archer och catapult,
manuella attackorders till blandad armé. Victory 126,79 s, bas 240 HP, tre
producerade typer och två överlevande combat-units. Spenderat 120 wood/35 gold
inklusive barracks, inget lostCargo; balans/resursbevarande och restart
verifierade. Separat låg-bas-HP-fixture verifierar defeat, input/simulation-
freeze och reset med samtliga army-typer. Ingen config ändrades utan mätbehov.

## RTS-041 – Fiendebas

Default survival är oförändrat. För belägring öppna ?scenario=siege-test:
96 px enemy-base vid 960,96 med 240 HP. Den blockerar navigation och kan
attackeras av alla combat-typer via giltig approach/LOS. Död rensar footprint,
revision och targetorders. Klick ger aldrig spelarens produktions-/rally-UI.
Testscenariot behåller finite waves; förstörd enemy-base ger inte separat
victory och stationär bas räknas inte som kvarvarande wave-unit. Riktig
skirmish-seger och scenario-val kommer i RTS-045. Restart behåller URL-valet.

## RTS-042 – Fiendeproduktion

Siege-test har ändlig basbudget 80 wood/20 gold, cap 6, FIFO max tre och
soldier-liknande enemies för 20 wood/5 gold och 5 s. Högst fyra units kan
produceras; ingen refill eller worker-ekonomi. Produktion/reservations/spawn
är atomiska och använder gemensamma regler. Blockad utgång väntar utan
dubbel debitering; player-ekonomin ändras inte. Basdöd rensar jobb utan refund
och restart återställer budget/IDs/timers. Producerade units står idle tills
AI-grupper införs i RTS-043; wave-enemies behåller sitt befintliga beteende.
Default survival får ingen fiendeproduktion.

## RTS-043 – AI-grupper

Producerade enemies samlas nära 896,320 i tvåunitsgrupper med separata
säkra destinationspunkter. Full och ankommen grupp blir ready; 15 s timeout
gör överlevande underbemannad/blockerad grupp ready. Första dispatch tidigast
60 s, därefter minst 15 s mellan grupper. En grupp får en attack-move-order
mot player-bas, med befintlig lokal targeting/navigation. Inga gratis units:
80 wood/20 gold begränsar produktionen till fyra. Wave-enemies ingår inte i
grupperna. Döda medlem-/destinationsreferenser och tomma grupper rensas även
vid game over; restart återställer timer/ID:n/grupper.

## RTS-044 – Lokalt basförsvar

En producerad unit är reserve nära enemy-base. Hot är levande synliga och
nåbara combat-units inom 256 px från basens footprint; workers räknas inte
som hot. Högst två defenders prioriterar reserve, befintliga defenders och
närmaste tillgängliga units med stabilt ID. Giltigt mål behålls. Borrowed
unit tas ur anfallsgruppen och återgår dit om det finns plats, annars till
ny samling; reserve går tillbaka till säkert home utanför basen. Ny dispatch
pausas under hot; övriga redan skickade units fortsätter. Förluster kan
ersättas endast ur kvarvarande budget, supply och produktionstid. Vid budget
0 tillkommer inga units. Basdöd släpper reserve till grupp-AI och stoppar
produktion utan refund. Visibility-kontrakt förbereder RTS-049; fog är ännu
inte aktiv. Död target och restart rensar försvarsreferenser.

## RTS-045 – Valbara matchlägen

Spelaren väljer Wave-survival eller Skirmish. Survival behåller waves vid
60/90/120 s och seger efter sista wave när alla wave-enemies är döda.
Skirmish startar samma spelarresurser, med en fiendebas och ändlig produktion/
grupp-AI/lokalt försvar. Inga waves spawnar. Fiendebasens död ger seger även
om fiendesoldater finns kvar. Spelarbasens död ger alltid förlust först;
game over fryser gameplay och restart återskapar det valda läget.

## RTS-046 – Preliminär svårighet

Easy/Normal/Hard ändrar endast enemy-startbudget/cap, enemy-produktionstid,
gruppstorlek/first attack/gap och ändliga Survival-waves. Normal behåller
verifierad balans. Easy: två budgetbetalda enemies, längre grace och fyra
wave-enemies totalt; Hard: sex budgetbetalda enemies, kortare grace, grupper
om tre och nio wave-enemies. Player-ekonomi, unit-HP/DPS/speed och priser
är lika; ingen dold refill eller dynamisk svårighetsanpassning. Val byte
startar ny match; restart behåller profil/scenario och återställer budget.

## RTS-047 – Minimap och kamera

200 × 150 karta över världen 1280 × 960. Markörer visar byggnadsfootprints,
resurser och units; vit ram motsvarar 800 × 600 viewport. Klick flyttar
endast kameran, centrerat där världens kanter tillåter. Selection, order,
placement/attack-move-mode och rally bevaras. Ny match ersätter all data.

## RTS-048 – Synlighet och utforskning

Fog använder 32 px-celler. Levande worker ger 160 px vision, combat/enemy-unit
192 px, färdig bas 256 px, barracks/Forge 192 px och farm 128 px. Byggnader
mäter från footprint-kanten; unfinished ger ingen vision. Celler inom
radien inklusive kanten provas vid centrum. Rock blockerar bakomliggande
vision men kan själv avslöjas. Water/buildings blockerar inte vision.
Player/enemy har separata current-visible och persistent-explored arrayer.
Död tappar aktuell vision; explored terrain kvarstår till restart. Ingen
last-seen enemy-memory. Vanligt spel behåller tidigare överblick tills
RTS-049 är klar; endast märkt modellfixture visar masken nu.

## RTS-049 – Spelbar fog

Fog är nu aktiv i Survival och Skirmish. Utforska med workers/army innan
resurs/fiende-order. Resource-order tillåts efter utforskning; återstående
mängd visas endast vid current vision. Enemy units syns om deras centrum
är visible; någon visible footprint-cell visar en hel enemy-building/HP.
Förlorad vision tar bort enemy-marker, label, HP och attack-target. Ingen
last-seen-data visas. Explicit attack blir idle; autoattack återgår till
origin/attack-move. Pilar med förlorat mål tas bort; siege flyger till sin fasta siktpunkt även
om mål försvinner. Hidden enemies kan
inte få splash; skyttens död hindrar inte impact med annan teamvision.
Enemy-team följer samma sikt för local targeting/defense; anfallsgrupper och
waves får utforska mot ett fast kartmål, men skadar endast visible targets.
Minimap/current-world följer samma kontrakt. Byggen kräver full footprint-
vision; preview i okänt område avslöjar bara den egna placeringens otillåtlighet.

## RTS-050 – Modifierare och grupper

Shift-click togglar bara träffad unit; Shift-drag adderar alla center-träffar
inklusive kanter och i alla riktningar. Empty modifierad gesture bevarar
urval; normal selection ersätter. Shift låses vid gesture-start. Ett faktisk
byggnadsklick är fortsatt exklusivt. Ctrl/Cmd+1–9 binder aktuella levande
egna synliga units; 1–9 ersätter selection med giltiga gruppmedlemmar. Recall
ger inga orders/kameraflytt och avbryter UI-preview. Death rensar ID:n och
restart återställer grupper. UI-fokus/repeat/Alt/game over spärrar tangenter.

## RTS-051 – Upptäckbara hotkeys

S Stop, A attack-move, B/F/G bygg barracks/farm/Forge med worker, W worker
med vald bas, T/R/C soldier/archer/catapult med vald barracks, U/D attack-/
defense-research med färdig Forge. Guide i HUD och knapp-suffix visar samma
mapping. Disabled-knapp innebär disabled-hotkey; samma kostnad/context/kö
kontrolleras exakt en gång. UI/editable-focus och repeat/modified-letter
ignoreras. Escape cancellerar modes med samma guard. Pause-guard finns
för RTS-052; inga nya gameplay-orders eller macros införs.

## RTS-052 – Lokal matchlivscykel

Första laddning är menu. Välj scenario/difficulty och Start; karta är den
handgjorda arenan. P/Pausa fryser hela matchen, med bevarade committed orders
och timers. Ocommitterade preview cancelleras. Pause tillåter meny/guide och
minimapkameran, men inga gameplay-actions/selection. Resume tillför ingen
wall-time och första gameplay-frame skippar delta. Escape prioriterar cancel
av preview, sedan pause/resume. Ctrl/Alt/Meta-letter, repeat och UI-text/fokus
spärras som tidigare. Game over går till ended med restart/new-menu.
Restart från paused/ended behåller val men resetter matchen; Ny match öppnar
menu och Start ersätter gammal state. Inga nya kartor/lobby/accounts.

## RTS-053 – Terräng- och resource-läsbarhet

Egna native 32 px grass-a/b, rock och water utan ändrad passability. Wood
visas som träd/stubbe och gold som fyndighet/uttömd ingång i 64 px frames.
Node-anchor (32,40) placeras vid samma world-center, footprint fortsatt
40 px (radius 20) och range oförändrad. Kroppen utanför footprinten är dekor.
Depletion-frame visas vid aktuell vision; utanför vision avslöjas ingen
förändrad mängd/färg. Inga animationer eller gameplay-stat-ändringar.

RTS-053-tillägg: native gräs med enhetlig grundton, pixelstrand/bergskanter endast vid exponerade patchkanter och egna skogs-/gruvresurser. Övergångar ändrar inte navigation eller footprints. Exporten omfattar 16 world-frames.

## RTS-054 – Byggnadssprites

Egen RGBA-atlas från assets/sources/buildings.mjs: bas, barracks, farm och Forge med blå/röd heraldik och tre statiska frames (grund, halvbygge, färdig). 128 px standard, farm 64 px; ankare är (.5,.75) vid logisk footprint-center. Native rendering utan skalning; befintliga footprints (spelbas 48 px, fiendebas 96 px, andra byggnader 64 px), HP och byggtid ändras inte. Foundation används över halva återstående byggtiden; halvbygge därefter, färdig vid noll. Enemy-varianter finns för alla typer men inga nya enemy-byggsystem införs. Fog/death tar bort renderobjekt; selection följer footprint, bas/fiendebas har synlig HP-text. Källor/palett/atlas/manifest exporteras med assets:export, ingen extern spelgrafik.

## RTS-055 – Enhetsanimationer

960 egna RGBA-frames i units-atlas från assets/sources/units.mjs: worker med verktyg, armored soldier/sköld, archer/båge och träcatapult. Blå/röda lagfärger, åtta riktningar (E, SE, S, SW, W, NW, N, NE), idle 1 och walk/attack/death 4 frames; worker gather/build 4. Humanframes 32 px med ankare (16,22), catapult 64 px (32,40). Walk/work/attack loopar i 8 FPS, death är en separat 0,5 s presentationsrest efter logical removal, utan HP/selection/target. Fog hiding skapar ingen död; dolda/dead renderobjekt och rests städas vid reset. Facing/state/frame väljs i presentation/animation.ts; simulationstiden styr bildtid, paus fryser även frames. Damage, gathering och construction drivs fortfarande enbart av gameplay-delta, aldrig animationsevents. Hitboxes/navigation/supply är oförändrade. Källor är egen originalkomposition, inga importerade spelsprites.

## RTS-056 – Eget ljud

16 s originalkomposition och command/impact/complete/victory/defeat från scripts/export-audio.py, PCM WAV-masters (mono 24 kHz/16 bit) och lokala Vorbis OGG med WAV-fallback. Manifest beskriver loop/duration/normaliseringsvolym. Appens enda Web Audio-graf skapas efter första klick/tangent eller Aktivera ljud; separata master/effects/music och mute verkar direkt, inställningar bevaras vid scene-restart. Pause suspenderar grafen; menu/game over/reset stoppar gamla källor. Musiken loopar exakt 16 s och exkluderar codec-padding. Throttle och looplängd finns i config/audio.ts. Public damage/completion hörs; enemy-händelser kräver syn både före och efter, och hidden removal/reveal är tyst. Saknat ljud blockerar inte gameplay.

Chromium-desktop är verifierad ljudprofil (OGG och WAV); andra browsermotorer är ännu inte verifierade. Exportverktyget soundfile används endast utanför projektets runtime/npm-dependencies: skapa en temporär Python-venv, installera soundfile där och kör scripts/export-audio.py, eller npm run audio:export med sådan miljö. Färdiga assets är incheckade; npm ci/build behöver inget Python-ljudverktyg.

## RTS-057 – Fantasy-HUD och effekter

Original trä-/mässingspanel med 16-px border, åtta 32-px ikoner och läsbara blå/röda lagfärger. Desktop (1280×900) har 280-px scrollande kommandopanel intill native 800×600 world; under 1120 px staplas world/HUD, inga worldkoordinater skalas. Georgia/systemfont är lokala standardfonts, inga externa font-/assetanrop. Hover/pressed/disabled/focus är olika; text/labels och keyboard-guide finns kvar, aria-pressed visar modes. HP är kompakta staplar; worker-last visas vid markerad worker, detaljer kvar i status.

Impact 32 px och splash 64 px har fyra egna frames i 8 FPS, 0,5 s bounded lifetime/max 64 effekter. Presentation visar synliga projektilers landningspunkt, även en synlig miss, utan att läsa dold HP eller driva damage. Fog/pause/reset styr effekternas syn/livstid; gameplay och inputfunktioner är oförändrade. Exportkälla assets/sources/ui.mjs, manifest/panel/atlas under public/assets.

## RTS-058 – Tre uppdrag

Startmenyn behåller Survival/Skirmish och lägger till Skogsvakten (besegra tre vågor, 20 wood/10 gold), Belägringen (förstör fiendebasen, 20/10) och Utposten (håll basen vid liv i 90 gameplay-sekunder, 40/10). Instruktion och start är explicita scenario-configs på befintlig handgjord arena. Utpostens normal-vågor är 30/60/80 s (1/2/2 fiender); Easy senare/färre och Hard tidigare/fler. Andra missions använder befintlig difficulty-pressure.

Måltid använder gameplay-delta; stora steg delas vid deadline så seger stannar exakt vid 90 s. Defeat har alltid företräde vid samma boundary. Levande fiender hindrar inte timerseger. Scenario/map/objective/start kan återställas individuellt och menuval påverkar först ny match; pause fryser även mål. Ingen kampanj, ny unittyp eller terränggenerator införs.

## RTS-059 – Lokal sparning

Spara lokalt skriver en manuell slot i denna browsers localStorage. Ladda sparning fungerar även från startmenyn och öppnar en levande match pausad; välj Återuppta. Ingen autosave eller filimport/export. Slot finns kvar efter restart/ny match och sidreload; privat läge/rensad webbläsarlagring kan göra den otillgänglig. Localhost och Pages har olika origins och delar inte sparningar.

Schema 1 / tribute-config-1 innehåller hela modellen, scenario/arena/tid/outcome/pause, resurslaster/saldo, units/orders/IDs/HP, byggtid, FIFO-kostnader/rally/reservationer, research, projektiler, AI-budget/grupper/waves och fog/explored samt kamera/byggnadsselection. Navigation och render/audio/listeners/blocked-spawn-cache lagras inte. Matchens dynamiska footprints valideras mot sparade byggnader/resurser; enheternas clearance, ID-referenser, queue/config och fog-form granskas innan state byts atomiskt. Navigation planeras om från orders, current vision räknas om medan explored bevaras.

Korrupt/okänd äldre/framtida schema eller annan config-version avvisas; ingen migration uppfinns. Aktiv match och tidigare slot förblir oförändrade vid load-/storagefel. Load rensar uncommitted previews och återskapar scenens render/listeners, ger ingen wall-time-bonus och laddar terminala matcher som terminala. save.ts och config/save.ts är Phaser-fria. Fog-factory sparar nu endast deklarerade worlddimensioner, inte oavsiktliga gamla map-obstacles.


## RTS-060 – Spelbar releasebalans

Alla fem modes och Easy/Normal/Hard kan vinnas utan extra resurser/HP/units. Accelererad legal kommandostrategi bygger barracks med wood först, samlar därefter gold, tränar upp till fyra soldiers och ger synliga attackmål. Gruppanfall, förstärkningar och skydd av gold-workers behövs särskilt i Hard Skirmish. Tidiga testförluster berodde på oskyddad gold-ekonomi och för tidiga enskilda anfall; inga stats, startresurser, vågor eller difficulty-värden ändrades för att få matrisen att passera. Aktiva order gör denna lilla RTS enklare än passivt försvar; resultaten är spelbarhetsbevis, inte en slutlig balansgaranti.

Fem naturliga Normal-UI-flöden och 15 accelererade scenario/profile-flöden redovisas separat i [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md). Utposten tillåter kvarvarande enemies vid deadline, Skirmish vinner på basdöd trots kvarvarande enemies, och defeat har fortsatt företräde. RTS-061–090 är framtida planering; nya fraktioner/förmågor är inte del av releasen.


## RTS-061: kvalitetsgranskning

[QA_REVIEW.md](QA_REVIEW.md) beskriver verifierad Pages, betald större blandad armé, prioriterade fynd och browser-/tillgänglighetsgränser. Inga blockerande/P1-regressioner; överlappning och resurs-trängsel hanteras i RTS-063/064. Ny godkänd etapp fortsätter till RTS-065; RTS-066–090 är endast planerade.


RTS-062: QA-granskningen gav ingen bekräftad P0/P1-fixlista; gameplay/save-format är oförändrade. Överlappning och köer hanteras taskvis i RTS-063/064 enligt QA_REVIEW.md.


## RTS-063: lokal separation

[separation.ts](src/gameplay/separation.ts) och [config](src/config/separation.ts) separerar kvadratiska unit-kroppar deterministiskt med max48 px/s correction, spatiala64px-celler/två pass/12 grannar. Terräng/world bounds respekteras; orders/last/selection/HP bevaras. Rörda pathcaches planeras om, blockerade kommandoresultat behålls utan automatisk fallback. Fog uppdateras efter separation; paus/game-over fryser. Save schema/config1 behålls utan ny persistent state. Kortvarig kontakt vid rörelse och omöjlig packning i trång terräng kan kvarstå; resource/passage-köer följer i RTS-064.

## RTS-064: trängsel

Wood/gold-noder betjänar högst tre samlande workers samtidigt. Vid fler arbetsorders väntar resten utanför räckvidden; prioriteten roterar var femte gameplay-sekund. Levererande workers räknas till sin nod tills loopen avslutas. Smala passager släpper fram en aktiv entrant åt gången, med företräde för den som redan är inne. Ny order eller död lämnar kön direkt. Pause fryser prioritet; save/load återskapar den. Last, hastighet och insamlingspris/rate är oförändrade. Detta är begränsad insläppning och mjuk separation, ingen garanti om perfekt tät packning eller formationer.

RTS-065 ändrar beräkningsarbete, inte resursrate, kostnad, kroppsstorlek, attacker, orders eller save-format. Större matcher har mätts med 64/128 injicerade kroppar, utan att ändra spelets supply eller ge dessa enheter till vanlig match. Se [PERFORMANCE.md](PERFORMANCE.md) för faktiska FPS/CPU-gränser.

## RTS-066: fraktion och lag

Fraktionens identitet är skild från lagfärg och player/enemy. Tekniska standard-ID:n är crown för player och clans för enemy; båda kan representeras på valfritt team i modellen/sparformatet. Befintliga unit/building/upgrade-system delas. Detta är data- och savegrunden; egna fraktionsnamn, grafik och UI-val kommer i RTS-067, fraktionsstats i RTS-068 och särskilda förmågor i RTS-069. Fraktionsnamn/förmågor är fortfarande öppna beslut.

## RTS-067 – Två valbara fraktioner

Välj Kronförbundet eller Järnklanen i startmenyn. Motståndaren får den andra fraktionen. Kronförbundets arbetare/soldat/bågskytt/katapult och borg/kasern/gård/smedja motsvaras av Järnklanens klansarbetare/yxkrigare/jägare/stenkastare och fäste/krigshydda/boskapshägn/ässja. Orcherna har grönt skinn, betar, yxor och trä/hud/ben-byggnader. Blå är spelarens lagfärg, röd fiendens, oavsett fraktion. Kostnader, HP, ekonomi och stridsregler är fortfarande lika; samla, leverera, bygg och träna med samma kommandon. Save/load/restart behåller fraktionen.

## RTS-068 – Produktionsrecept

Kronförbundets soldat: 20 wood + 5 gold, 5 s, 60 HP. Järnklanens yxkrigare: 18 wood + 6 gold, 6 s, 66 HP. Båda tar en supply och har samma rörelse och skada. Övriga enhetsrecept och byggnader är oförändrade. Knappen/kötiden och HP-stapeln följer fraktionen. Den ändliga enemy-budgeten betalar sin fraktionskostnad; Järnklanens enemy-produktion tar en sekund längre än difficulty-grunden. Waves och enemy-stridsprofil är fortfarande tidigare förenklingar. Slutlig balans verifieras i RTS-070.

Äldre redan betalda köjobb bevarar sin originalkostnad och tid vid Load; en avbrytning återbetalar andelen av den faktiskt betalda kostnaden. Nyproduktion efter laddning följer nya recept. Restart börjar en helt ny match med vald fraktion.

## RTS-069 – Försvarshållning och raseri

Markera stridsenheter och använd fraktionsknappen eller **E**. Kronförbundets försvarshållning ger 25 % mindre inkommande damage; Järnklanens raseri ger 25 % mer utgående damage, även bågskyttar/katapulter. Effekten varar 5 gameplay-sekunder och enheten kan aktiveras igen efter 20 sekunder från aktivering. Ingen wood/gold-kostnad. I blandad selection aktiveras endast redo stridsenheter; workers fortsätter sina order. Avmarkering eller nya rörelseorder avbryter inte förmågetimern. Forge-bonus kombineras multiplicativt. Redan avfyrade skott behåller skadan de fick vid avfyrning.

Egna valda enheters status visar effekt/cooldown. Paus fryser timern, game over fryser hela simulationen, Save/load behåller timern och restart rensar den. Självförmågan ändrar ingen vision och befintliga fog-regler för strid kvarstår. Fienden aktiverar inga förmågor i denna slice; värdena ska speltestas i RTS-070.

## RTS-070 – Speltestad preliminär balans

Båda fraktionerna kan vinna samtliga befintliga scenarios på Easy/Normal/Hard med legal ekonomi och kommandostrategi, och kan förlora genom verkliga enemy-attacker när basen lämnas oskyddad. Naturlig Utposten/Normal verifierades för båda: 90 s Victory, bas240 och betald soldier/archer/catapult med förmågeaktivering. Järnklanen behöver planera gold tidigt för 6-gold-receptet; låt gärna en annan worker bygga. Skydda/retirera workers och fortsätt med överlevande armé efter störd ekonomi. Inga numeriska balansändringar i denna task; resultaten är vinstvägar på en arena, inte statistiskt jämn fraktionsstyrka. Se FACTION_BALANCE.md för metod och begränsningar.

## RTS-071: angripbar fiendeekonomi

Skirmish och Belägringen börjar med två fiendearbetare, en wood och en gold.
De delar spelarens noder, arbetar 1/s, bär högst 5 och levererar inom 24 px
från fiendebasens footprint. De har 30 HP, syns enligt fog och kan angripas,
men attackerar inte. Ingen worker-produktion eller ersättning i denna slice.
Fiendens verkliga saldo finansierar fler stridsenheter upp till army-cap.
Död förlorar last; basdöd stoppar arbetet. Startbudget behålls och inget
wood/gold skapas automatiskt. Leveransturer upptar inte nodens arbetsplatser.

Den delade resurskonkurrensen gav Hard-regression i tidigare vinststrategi.
Nya ekonomimatcher får därför +20 s före första gruppanfall (95/80/70 s),
med tidigare lokal attack/försvar kvar. Inga HP-/kostnads-/startbudgetändringar.
Äldre saves får varken arbetare, income eller ny attack-timing gratis.
AI känner fortfarande resurspositionerna; begränsad upptäckt kommer i RTS-075.

## RTS-072: betalade AI-byggen

Nya ekonomimatcher börjar utan enemy-barracks. En worker bygger den för
40 wood, 64px-footprint och 5s arbete vid kontakt. Enemy-army produceras
först därefter, med spawn vid barracks. AI bygger högst en farm för
20 wood/5s och +5 supply vid base-cap8:s marginal1. Workers, stridsenheter
och betalda reservationer använder verklig supply; difficulty army-cap
begränsar fortfarande armén. Vid farm-behov sparar AI banken i stället
för att starta nya jobb; redan betalda jobb fortsätter.

Platser väljs ur sex gridpunkter med 1s retry och full placement-validation.
Ogiltig plats kostar inget. Builder-död/blockering pausar bygget; kvarvarande
worker kan återuppta utan ytterligare site-kostnad. Last bevaras.
Byggen och färdiga byggnader kan angripas, syns enligt fog och blockerar
rörelse. Farm-supply tillkommer först vid färdigt bygge. Ingen Forge,
workerproduktion eller expansion i denna slice. Äldre saves behåller
sin tidigare produktionsmodell; fresh restart aktiverar nya byggregler.

## RTS-073: betald AI-forskning

I nya ekonomimatcher följer AI barracks/supply, tre levande army-units,
Forge, attack1 och defense1. Förlust under tre öppnar ersättningsarmé
före nya research-starter. Forge kostar40/10 och 5s arbete; forskning
kostar40/10 och 8s per nivå. Obetalda mål reserverar banken genom att
pausa nya army-jobb; redan betalda jobb fortsätter. Betald research kan
köras samtidigt med ny army-produktion. Två workers kan prioritera wood
när gold-behovet är fyllt, utan att slänga last eller avbryta leverans.
Fiendens svagare grundprofil36HP/65speed/6DPS behålls; attack1 ger7,5DPS
och defense1 inkommande multiplikator0,75 för stridsenheter. Workers,
byggnader och spelarens stats ändras inte. Forge kan angripas enligt fog;
förstörelse avbryter aktiv research
utan refund av dess redan betalda kostnad. Redan lärda nivåer består.

Save config7 bevarar tids-/kostnadsmodell. Gamla snapshots behåller sin
tidigare policy; restart aktiverar aktuell modell. Expansion och
ersättningsworkers tillhör nästa slice, upptäckt RTS-075.

## RTS-074 – återhämtning och extra resursbas

Nya ekonomimatcher kan ersätta förlorade workers till två:20wood,
5s träning, supply1 och giltig spawn vid levande bas. Ersättningsbehov
prioriteras före nya armé-/research-betalningar; betalda jobb fortsätter.
Last startar tom och worker börjar idle, sedan befintligt arbete.
Blockerad spawn behåller betalt färdigt jobb utan ny kostnad. Om båda
workers förlorats och banken saknar20wood kan ekonomin inte återhämta sig
gratis. En extra resursbas kan byggas vid befintliga noder efter färdig barracks,
tre levande army och attack1/defense1. Kostnad80wood/20gold,10s worker-
arbete,96px/240HP och +8 supply vid färdigt bygge. Högst en extra bas;
färdig bas tar emot last via samma leveransregler. Närmaste nåbara
leveranspunkt används, utan ny resursstock eller incomebonus. Du kan
angripa bygget/basen enligt fog. Förlust tar bort leverans och supply;
återuppbyggnad kostar igen. Huvudbasen är fortfarande victory-objective
och den enda enemy-worker-producenten. Betald expansion kan byggas
samtidigt som redan betalda/nya army-jobb; obetald expansion sparar bank.

## RTS-075: AI utforskar

Fienden känner egen ekonomi och terräng men måste se noder innan
nya gather-orders skickas. En tom worker söker med en kort fast rutt;
last/bygge avbryts inte. Senast sedd nodmängd behålls när den döljs.
Verklig insamling följer fortfarande den delade ändliga noden.
Anfallsgrupper söker terrängpunkter tills spelarbasen observerats,
sedan används senaste kända position. Enbart synliga targets kan
angripas. Minne och sökindex sparas i config9 och rensas vid restart.
Gamla snapshots får ingen ny policy/kunskap vid Load. Sökrutterna gäller
befintlig arena; flera kartor anpassas i nästa etapp.

## RTS-076: skirmish-etappens kartor

Skirmish har nu tre handgjorda kartor: arena400wood/300gold, Skogspasset
500/250 och Flodkröken350/400. Terrängpatcherna ger olika landvägar och
byggutrymmen. Alla delar1280x960/32px, bas- och nodpositioner samt samma
units/ekonomi/AI. Vatten är fortfarande hinder för landenheter.
Resursmängder är ursprunglig ändlig stock, aldrig en incomebonus.
Kartval sker i Skirmish-menyn; missions/Survival behåller arena.
Load och restart bevarar profil. Detta utökar den ursprungliga MVP:ns
en-karta-krav; tidigare taskbeskrivningar ovan är historiska slices.

## RTS-077: tydliga val före match

Menyn visar vald karta med total finite wood/gold-stock, fraktion och
aktiv förmåga samt fiendetryck för svårighetsgraden. Sammanfattningen
följer valen före Start. Matchen använder de valen och låser kontroller
tills Ny match. Pause/Load/restart bevarar samma faktiska inställningar.
Byt från Skirmish till missions/Survival så blir kartan arena; explicita
ogiltiga kombinationer ignoreras utan att ändra matchen. Inga nya
spelvärden eller menypreferenser sparas separat.

## RTS-078: resultat efter match

Efter game over visas Victory/Defeat, gameplay-tid, karta/scenario/
svårighet och båda fraktionernas statistik. Insamlat, levererat och
netto spenderat wood/gold skiljs åt. Last och förlorad last är inte
leverans. Netto spenderat inkluderar betalda ofärdiga jobb och drar av
refunds. Tillkomna enheter exkluderar startenheter; förlorade/besegrade
enheter exkluderar byggnader. Resultatvyn visas inte under match så
fiendens dolda ekonomi förblir dold. Ingen damage/APM/byggnadshistorik.
Game-over freeze/Save bevarar resultat, restart/Ny match rensar vyn.

## RTS-079: preliminär skirmish-balans

Balans verifieras med begränsade betalda strategier, utan injicerad
ekonomi eller HP. Alla18 karta/fraktion/difficulty-par ska kunna
vinnas inom fem gameplay-minuter. Oskyddat passivt Normal-spel ska
förlora inom samma observationsfönster. Detta bevisar spelbara flöden,
inte optimal strategi, jämn vinstchans eller att alla uppgraderingar och
expansioner hinner användas i varje match.

## RTS-081: kustregler inför hamnar

Landrörelse bevaras. Kommande fartyg rör sig enbart inom sammanhängande
vatten där hela kroppen ryms, utan landgenvägar. En hamnfootprint ska
ha positiv area på både land och vatten och inte överlappa sten eller
byggnader; att bara nudda stranden räcker inte. RTS-081 introducerar
regler/ruttadapter, ingen spelbar hamn eller fartygsproduktion ännu.

## RTS-082: spelbar hamnproduktion

Välj worker, Bygg hamn och klicka giltig synlig kust. Hamnen är
64x64 och straddlar land/vatten med fri arbetarväg och vattenutgång.
40wood/10gold betalas vid placering;5 sekunders kontaktarbete krävs.
Esc/högerklick avbryter preview utan kostnad. Avbruten arbetare kan
återuppta med högerklick på bygget utan andra kostnaden.

Välj färdig hamn, Bygg fartyg:40wood/15gold dras vid enqueue,
8 sekunder och2 supply per fartyg; max3 FIFO-jobb och befintlig
refundpolicy. Land och sjö delar population/reservations. En blockerad
vattenutgång håller färdigt jobb tills en giltig plats finns.
Fartyg börjar idle/omarkerade och stöder klick, drag, shift, grupper,
Stop och högerklick i vatten. Ingen gathering eller hamn-rally.
Placeholder-hull/Hamn-text visar modellen; transport tillkommer i084,
slutlig presentation i089.
Pause/game over/Save/load/restart omfattar hamn, jobs och fartyg.


RTS-083: välj fartyg och högerklicka synlig fiende för manuell attack.
Fartyget söker en nåbar vattenposition med fri skottlinje inom192px från
målets footprint. Kanonskott gör16 damage var1,5s, speed280px/s och
träffradie20px; aim låses vid skott, livstid3s. Vatten tillåter skott,
sten/byggnader blockerar. Gömda mål avbryter attack; Move/Stop ersätter,
avmarkering bevarar order. Befintliga army attack/defense-upgrades gäller
fartygen; landförmågor gör det inte. Riktiga landfiender kan attackera
fartyg vid nåbar kustkontakt och skada/förstöra hamnen. Inga fiendefartyg
före086. Hamn/fartyg visar fortfarande placeholders och enkel HP-text.


RTS-084: välj färdig hamn → Bygg transport (40wood/10gold,8s,2supply).
Transporten har90HP/110px/s och fyra platser, men inga vapen. Flytta
valda landenheter nära kusten (inom64px med fri kontakt) och högerklicka
transporten. Upp till fyra lastas omedelbart; ingen boarding-kö finns.
Lastade units behåller HP/ID/archetype/resurslast och supply, blir idle och
omarkerade, ger ingen egen syn och agerar inte från marken. Deras timers
fryser under transporten. Välj transport → Landsätt → vänsterklicka synlig
landpunkt inom64px. Alla passagerare får separata giltiga platser runt
klicket; annars sker ingen landsättning. Ogiltig punkt behåller läget,
Escape/högerklick avbryter utan order. Efter landning är units idle och
omarkerade och kan väljas igen. Vid sänkning dör alla passagerare och deras
wood/gold-last förloras. Save/load omfattar lasten; restart tömmer matchen.


RTS-085: välj Skirmish → Öarna. Två landmassor skiljs av havet x704–896,
med vatten även runt ytterkanterna. På västra ön finns800wood vid650180
och400gold vid600300; spelaren börjar med vanliga tre workers och0/0 bank.
Samla, bygg kasern/tre stridsenheter och hamn vid synlig östkust, till
exempel672320. Flytta transporten till720432, markarmén till688432,
markera armén och högerklicka transporten. Segla till880432 och landsätt
vid912432 på östra ön; utforska/strid mot fiendebasen i nordöst.
Markunits kan inte gå över havet. Grundvillkoren victory/defeat gäller.
Fienden använder befintligt ändligt startkapital och lokal land-AI;
produktion/landstigning via sjö-AI följer i086. Resursnoderna och banken
är aldrig gratis/påfyllda under matchen. Save/restart behåller kartprofilen.

## RTS-086: betalt AI-landstigningsanfall

Öarnas AI betalar hamn40wood/10gold och transport40wood/10gold samt två
ordinarie producerade soldater ur sin ändliga bank. Ökartan ger120wood/
30gold extra startkapital, aldrig inkomst. Transporten tar2supply, har90HP,
ryms i32px och seglar110px/s. AI använder inga kanonfartyg. Landarmén
samlas vid synlig kust och lämnar landstate medan den bärs; landning är
atomisk på synligt fritt land. Publika terrängvägpunkter styr utforskning
innan spelarbasen observeras. En sänkt transport återbyggs inte; lastade
soldater dör, väntande soldater återgår till ordinarie AI. Avmarkering,
Save/load, paus och terminalfreeze bevarar matchens regler. Balans087 följer.

## RTS-087: verifierad sjöbalans

Båda fraktioner × Easy/Normal/Hard klarar verklig insamling, kasern, tre
soldater, hamn, transport och landstrid till victory. Priserna behålls:
Kronförbundet180wood/35gold totalt, klanerna174wood/38gold. Tre workers +
tre soldater + transportens2supply =8/8; ingen farm krävs. Transporten är
obeväpnad och kan bära4 units. Ett tidigt stridsfartyg kräver inklusive
hamn80wood/25gold och ger5/8 använd supply med de tre startarbetarna.

AI anfaller tidigast260/220/190s för Easy/Normal/Hard med två betalda
soldater. Passivt spel förlorar inom350s i alla sex kombinationer. En betald
tidig kanonbåt kan sänka den ännu tomma transporten vid fiendens kust och
hålla basen oskadad till350s. Det är ett avsiktligt enkelt motmedel; AI har
bara en transport, inga kanonbåtar och ingen återuppbyggnad. Sänkning ger
inte victory: fiendebasen måste fortfarande förstöras. Inga balansvärden
ändrades eftersom de verifierade progressionerna fungerar. Resultaten
är deterministiska scenarioflöden, inte ett statistiskt balanspåstående.

## RTS-088: sjöuppdrag med befintligt basmål

Uppdrag4 – Överfarten låser Öarna och börjar med20wood/10gold. Victory
kräver förstörd fiendebas; egen bas0HP ger alltid defeat, även samtidigt.
Samma betalda armé/transport och ändliga enemy-landstigning används.
Inga gratis fartyg eller kampanjsystem. Meny/restart/Save behåller scenario,
fraktion, svårighet och fast map. Egna lastade units och enemy-passagerare
saknar separata minimap-/synmarkörer; kanonskott kräver fortsatt målsyn.

## RTS-089: läsbar flotta och kust

Stridsfartyg har kanon, transport lastdäck/lådor; blått/rött lagsegel och
fraktionens heraldik. Åtta riktningar och gångvake/attack/sjunkframes visar
befintlig simulation. Brygga, kran och hamnmagasin har synliga byggstadier.
Ringar, HP och transportens0–4 lasttext kvarstår. Skarpa native pixelassets
utan importerad spelgrafik. Kanon/sjunkljud följer faktisk syn och gesture/
mute/volym/paus; dolda dödsfall, boarding och Save-load reveal är tysta.

## RTS-090: publicerad sjörelease

Befintliga landscenarier/kartor och två fraktioner bevaras. Öarna och
Överfarten använder betald flotta/transport/landarmé, ändliga resurser,
fog-säkert AI-landstigningsanfall, Save och restart. Tidigt kanonmotmedel
stoppar transporten; förstörd fiendebas krävs fortfarande för victory.
Verifierad progression på Easy/Normal/Hard; ingen generell jämn balans
eller avancerad naval AI-ekonomi påstås. Original sjöart/ljud följer samma
syn/pause/reset som gameplay. Releaseprofil och begränsningar finns i
[RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

## RTS-093 – Huvudmeny

Fantasy-startsida med titel/sköld och Campaign, Skirmish, Load Game, Settings. Campaign väljer befintliga fyra fristående uppdrag, utan nya objectives/progression. Skirmish erbjuder befintlig skirmish/survival. Inställningar är befintligt ljud; sparning är lokal validerad slot, load återkommer pausad. Menynavigering ändrar inga unit-orders och skapar inga nya matchstate-system.

## RTS-094 – Matchinställningar

Befintliga kart-/fraktions-/svårighetsval presenteras med separata beskrivningar. Fast uppdragskarta förklaras och är låst. Spelhastighet är separat från svårighet: enda fungerande val är1× tills108. Svårighet påverkar bara tidigare definierade enemy/waveprofiler, inte klockhastighet.

## RTS-096 – Engelska och bevarat spelkontrakt

All synlig speltext är engelska: meny/matchval/uppdrag/guide, fraktioner, ekonomi, selection, routes/placement, produktion, fartyg, förmågor, ljudstatus, Save och resultat. Interna IDs, stats, kontroller, objectives och Saveformat bevaras. Crown Alliance/Iron Clan ersätter svenska visningsnamn. Save-load-status styrs av state/felkoder, inte textinnehåll; legacy rally-feedback visas med aktuell engelsk copy. Pausfeedback anger frozen, inte match ended. Ingen stegvis tutorial, nya svårigheter/hastigheter eller HUD-system097–120 införda.

## RTS-097 – Matchöversikt

Toppraden visar Menu [P], levererat Gold/Wood samt använd/max Population och köreservationer. Last räknas först efter leverans; saldo visas avrundat nedåt. Menu pausar och visar befintliga Resume/Save/restartkontroller. Under spel är sessionpanelen dold.

## RTS-098 – Markerad enhet eller byggnad

Bottenpanelen visar namn, originalporträtt, aktuell/max HP och grundstatistik. Worker visar last, stridsroller speed/supply/range/damage; transport visar passagerare. Base/barracks/harbor visar HP och byggstatus. Grupper visar antal och total HP; tom selection ger instruktion och rensar porträtt/stats. Panelen är endast information, utan worldorders. Farm/forge är fortfarande inte klickvalbara enligt tidigare selectionmodell.

## RTS-099 – Actions vid selection

Bottom bars högra panel visar worker build/Stop, landcombat attack-move/ability/Stop och transport Unload/Stop. Blandade grupper får unionen. Base tränar worker och visar research via färdig forge; barracks/harbor visar sina recept. Kostnader/hotkeys och blockeringsskäl är synliga. Tom selection visar inga actions. Right-click behåller befintliga move/gather/attack/landbyggnadsrallyregler; harbor har ingen rally. Previewstart kräver tillräckligt saldo, Escape/right-click avbryter utan kostnad.

## RTS-100 – Blandade grupper och produktionskö

Grupper visar en ikon per vald land-/sjöenhet, i befintlig landföljd följd av fartyg; hover/accessibel etikett visar namn, ID och HP. Total HP och union-actions bevaras, större grupper scrollar internt. Produktionsbyggnaden visar upp till tre befintliga FIFO-jobb med ikon, Active/Queued, tid och progress. Cancel ger50% refund för active och100% för queued. Färdig men blockerad spawn visar Waiting for free exit; paus fryser progress och blockerar cancellation.

## RTS-101 – Minimap i spelvyn

Minimappen ligger ovanpå worldytans nedre vänstra hörn. Vänsterklick centrerar/clampas kamera under playing; paus/ended/menu blockerar navigation. Höger-/mittklick ger inga orders/selection; context menu förhindras. Befintlig fog, kameraindikator och egna land-/navymarkers används, dolda fiender/resurser läcker inte.

## RTS-102 – Panorera kameran

Piltangenter och worldviewens inre16pxkant panorerar480px/s; diagonal har samma totalhastighet. Klicka världen för keyboardfocus. HUD/minimap/menu/buttonfocus/paus blockerar pan, vänster-/mittendrag har företräde. Mittendrag flyttar kameran som tidigare; alla gränser clampas. A/S/W/D behåller sina actions. Kameran använder realtid oberoende av framtida gameplay-speed.
