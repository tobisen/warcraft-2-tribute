# Iron & Timber — Game design

Arbetstitel: **Iron & Timber — A Tribute to Warcraft II**. Egen typografisk
identitet; ingen juridisk granskning för kommersiell release.

## Inriktning

RTS-001–150 är klara; release0.2.0 är verifierad och publicerad. Fem spelbara fraktioner, nio kartval och åtta campaign-operationer med lokala resultat/progression ingår. Slicebeskrivningarna visar historiken; senare taskavsnitt anger aktuella regler. Ursprunglig MVP nedan är ursprungsplanen, inte nuvarande featuregräns.


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

## RTS-103 – Space/Home och camera settings

Space centrerar aktuell egen selection (gruppens boundingcenter eller vald base/barracks/harbor); tom selection ändrar inget. Home centrerar egen bas, utan ändring av orders/selection. Settings erbjuder240/480/720px/s och edge-pan on/off; defaults480/on. Samma kontroller nås under paus, bevaras över restart/menynavigation inom appen och återgår till defaults vid sidreload tills119. Keyboard/middle fungerar när edge är off; fält/buttonfocus/paus blockerar focus-hotkeys.

## RTS-104 – Pause, Quit och fullscreen

Menu/P/Escape öppnar pausdialog med Resume/Save/Load/Settings/Quit; Restart och slutresultat bevaras. Escape behåller tidigare previewcancel-prioritet. Settings har audio/camera/display och Back; Escape/P backar subpage/confirmation, main resume. Quit kräver Confirm quit; Cancel/Escape bevarar pausad match, bank/queue/orders/selection/kamera. Fullscreen är separat i top bar och Settings, ändrar inte matchstate; unavailable/failure visas. Ended har läsbar resultatdialog med intern scroll vid behov.

## Order- och actionfeedback (RTS-105)

Markerade egna enheter visar grön move-ring, rött attack/attack-move-crosshair, gul arbetsring och rött X för blockerad order. Attackmarkörer kräver synliga mål. Statusraden visar placeringsskäl, route/rallyproblem och modeinstruktioner. Actions visar Not enough wood/gold, båda resurser eller Population limit reached; ogiltiga actions ändrar varken saldo eller orders.

## Attackvarningar (RTS-106)

Skada mot egna objekt visar Your base/building/units are under attack! och en röd ring vid senaste skadepositionen. Basen prioriteras; ingen automatisk kameraflytt eller fiendeinformation. Kort originalcue, högst en varning per3gameplaysekunder,4sekunders visning. Mute/effects gäller; pause/end döljer varningen och restart/load börjar utan gamla alerts.

## Svårighetsprofiler (RTS-107)

Svårighet ändrar enemyresurser, armycap, produktion och attacktimers; spelarens ekonomi/combatstats och gameplaytid är lika. Normal är default. Beginner är en initial configprofil, ännu inte nybörjarspeltestad (RTS-110).

| Profil | Enemy initial wood/gold | Armycap | Soldierproduktion | First dispatch | Group / gap | Survivalwaves tid:antal |
| --- | --- | --- | --- | --- | --- | --- |
| Beginner | 20/5 | 3 | 12s | 120s | 1 / 30s | 120:1, 180:1, 240:1 |
| Easy | 40/10 | 4 | 7s | 75s | 2 / 20s | 75:1, 110:1, 145:2 |
| Normal | 80/20 | 6 | 5s | 60s | 2 / 15s | 60:1, 90:2, 120:3 |
| Hard | 120/30 | 8 | 4s | 50s | 3 / 12s | 50:2, 80:3, 110:4 |

Ekonomisk skirmish lägger befintliga20s grace till first dispatch; muster/armytilgänglighet kan fördröja ytterligare. Clans soldierproduktion tar1s extra i alla profiler. Beginner reserve0/maxdefenders1; övriga reserve1/maxdefenders2. Custom Outpost waves justeras Beginner+30s/−1unit, Easy+10s/−1, Normal0/0, Hard−5s/+1 (minst1): Beginner60:1,90:1,110:1, men missionen slutar efter90s enligt befintligt timer-win-villkor. Islands får samma separata navalbonus120wood/30gold och två passagerare; transportlaunch tidigast320/260/220/190s. Enemy bygger och samlar enligt befintliga regler; lägre startbudget och längre produktion bromsar utvecklingen utan ändrad gatherhastighet.

## Spelhastighet (RTS-108)

Välj 0.75× eller 1× oberoende av difficulty i setup. 1× är default och valet låses under match. All gameplay, inklusive movement, gathering, construction, production, combat, projectiles, research, abilities, AI, waves, navy och animationer använder gemensamt skalad tid. Vid 0.75× tar 5 gameplaysekunder cirka 6.67 verkliga sekunder; UI, kamera och ljudets pitch/tempo påverkas inte. Paus, end och menu ackumulerar ingen tid. Save/load och restart bevarar speed; äldre saves laddas med 1×.

## Tutorial – First Steps (RTS-109)

Campaigns första val erbjuder sex mål utan tidspress: välj worker, flytta minst 32 world pixels med en move-order, leverera 20 wood, färdigställ barracks, träna soldier och högerklicka det röda träningsmålet med vald soldier tills det är dött. Startsaldo är 40 wood och 10 gold; ordinarie kostnader, last, leverans och byggtid gäller. Wood i last räknas inte som levererat. Att byta vald worker under movement-steget fungerar.

Inga fiender eller waves finns under förberedelsen. Det enda målet spawnar efter riktig produktion, väntar stilla och anfaller inte. Soldaten väntar på spelarens kommando i stridslektionen. Alla sex mål ger Victory; defeat har fortfarande företräde. UI visar mål, genomförda steg och levererad mängd. Pause/Save/load bevarar progression och en enda target; restart återställer alla mål och matchstate. Vanliga kontroller är tillgängliga, så spelaren får experimentera och bygga i förväg.

## Frontier Valley (RTS-115)

Separat Skirmish-karta på1600×1152 med tre landvägar runt floden: norr, en
96px central torr passage och söder. Fiendebasen står i nordöst på(1360,144).
Utforska över floden för extra wood vid(1216,896),200wood och gold vid
(1184,640),150gold. Primarynoderna innehåller400wood/300gold. Totalt
600wood/450gold delas med fienden. Alla noder är ändliga och har egna ID:n.

Gather-order behåller sin specifika resursnod över leveransturer; uttömning
gäller den noden. Samma cap5 och hemleverans gäller expansioner, utan ny
dropoffbyggnad. Fog döljer okända noder; utforskade men osynliga noder visar
namn utan aktuell mängd. Pan/minimap/Save/load och restart följer kartstorleken.

## Kartornas starttips (RTS-116)

Arena: öppet centralt land mot fiendebasen, med små sidodammar.
Forest Pass: håll workerleder till wood/gold fria och gå genom passet mot nordöst.
River Bend: norra stranden ger landväg; södra vattenböjar hindrar direkt passage.
Islands: befintlig västö-ekonomi, kustharbor och transport krävs över havet.
Starttipsen visas under matchen. Befintlig geometri, stock och AI-balans är
bevarade; landkartorna har plats för64×64-byggnader och40px-catapultväg.

## Planerad presentation122–126

Nästa etapp ersätter avslutad spelvy med resultat och separat statistik,
inklusive byggnader och tydliga combatförluster. Play Again behåller matchval
men skapar ny match; Main Menu går till startsidan. Version/changelog och
valbar renderingsupplösning följer utan gameplayändring. Fem fantasyfolk
visas som startsidemotiv; endast Crown/Clans är spelbara. Lyssningsbedömning
av ljud/repliker är uppskjuten enligt användaren, inte utförd.

## RTS-122 – Avslutad match

Victory/Defeat ersätter spelvärlden med en separat resultatsida. Sammanfattning
visar utfall, karta, fraktion, svårighet, hastighet och matchtid. Play Again
skapar en ny match med samma val; Main Menu går direkt till startsidan.
View Statistics och Back/Escape växlar presentation medan matchen förblir
stoppad. Save/load av avslutad match återöppnar resultatsidan.

## RTS-123 – Utökad statistik

View Statistics visar insamlade/levererade/netto spenderade wood/gold,
producerade units, combatförluster, besegrade fiender, owner-removals och
färdigställda/förstörda byggnader per sida. Starting units/baser räknas inte
som producerade/byggda. Förstörda foundations räknas som förlust, inte
färdigställning. Egen borttagning är ännu ingen tillgänglig action.
Äldre saves får tydlig upplysning om saknad historik före migration.

## RTS-124 – Releaseinformation

Startsida och matchens top bar visar samma releaseversion. Menyn Changelog
visar större användarsynliga förändringar per release, plus separat build-ID.
Back/Escape återgår till startsidan. Versionsinformationen påverkar inte matchen.

## RTS-125 – Displayval

Settings → Display erbjuder sex renderingsupplösningar samt separat Adapt
resolution to window och Fullscreen. Hela spelytan skalar med bibehållet
bildförhållande; letterbox visar outnyttjad yta. Kamera/world och gameplay
påverkas inte av fysisk skalning. Inställningarna bevaras efter reload,
Save/load och restart. Välj lägre preset för större text på liten skärm.

## RTS-126 – Startsidespresentation

Original fantasyillustration visar Humans, Orcs, Elves, Dwarves och Goblins
mot kust/skog/stronghold. Titel och läsbar meny ligger ovanpå; endast Crown
Alliance och Iron Clan erbjuds som spelbara. Subtila embers stängs av vid
reduced-motion. Musik börjar efter interaction på lägre menyvolym; Mute
ambience på startsidan använder samma mute som Settings och sparas lokalt.
Paus och resultat följer befintliga ljudgates; artwork syns inte i matchen.

## RTS-127 – Oberoende resursfyndigheter

Frontier har två wood-fyndigheter och två gold mines med egna lager. En arbetare återgår till sin beordrade fyndighet efter leverans; en uttömd fyndighet ändrar inte orders eller lager vid andra fyndigheter. Inga nya resurser eller kartor införs i denna task.

## RTS-128 – Välj fyndighet

Vänsterklick på utforskad fyndighet ersätter unit/building-selection, även med Shift. Bottom bar visar Wood grove/Gold mine, ID, typ och synlig återstående mängd eller Depleted. Utanför aktuell vision visas ingen stock eller aktuell uttömningsstatus. Resursselection ger inga orders; arbetare fortsätter sin arbetsloop. Klick på unit/byggnad, drag eller grupprecall ersätter resursselection.

## RTS-129 – Flera arbetare vid fyndighet

Fler än tre tilldelade gather-workers använder befintliga nåbara arbetsplatser och tidsroterad väntkö. Levererande workers lämnar arbetsplatsen. Orderbyte/död frigör plats; den ändliga fyndighetens lager och levererade saldo bevaras. Befintlig separation håller arbetarna urskiljbara, utan full collision avoidance.

## RTS-130 – Resursbemanning

En vald synlig fyndighet visar Workers: N assigned / M gathering. Assigned omfattar levande egna arbetare som reser, väntar, samlar eller levererar från noden. Gathering omfattar bara arbetare med plats, kontakt, ledig last och tillgänglig stock. Orderbyte/död/uttömning ändrar texten; hidden nodes visar ingen bemanning. Markering av arbetsplatser införs inte i denna slice.

## RTS-131 – Plains96/128

Skirmish erbjuder två enkla storlekslayouter:96×96 och128×128 tiles, fortfarande32px/tile. Start, resurser och fiendens bas ligger i den bekanta nordvästra zonen; resten är öppen utforskbar mark med en avlägsen stenpatch. Detta verifierar stora världar före132/133:s strategiska land-/kustkartor. Kamera/minimap kan nå hela världen; move-order, fog och Save/load använder fulla dimensioner.

## RTS-132 – Highland Crossroads

Handgjord96×96-landkarta med nordpass, central passage och södra flank genom bergsrygg. Fyra wood-groves och fyra gold mines, totalt1150wood/850gold, är ändliga och delar lager mellan spelare/AI. Spelarens bekanta nordväststart har byggutrymme; fiendens nordöstbas har närresurser och en lokal samlingspunkt. Västra expansionen är tidigt åtkomlig; central och östlig ekonomi kräver längre resor/upptäckt. Berg/vatten är tydliga blockers med befintliga originalassets; inga dekorativa osynliga hinder eller importerade kartor.

Kartreferensgranskning132/133,2026-10-03: [Blizzards BNE-översikt](https://classic.battle.net/war2/lp/bne.shtml) läst; Winding Ways-thumbnail visuellt granskad för grenade passager/terrängfickor. [Fall of Lordaeron](https://www.blizzplanet.com/blog/comments/warcraft_ii_tides_of_darkness___orc_campaign_the_fall_of_lordaeron/warcraft-ii-the-fall-of-lordaeron-map) och sidans thumbnail granskade för separerade landmassor/vatten, främst inför133. [VGMaps index](https://vgmaps.de/maps/pc/warcraft-ii-tides-of-darkness) och mission14-sida gick att läsa, men bildfil403/cache miss; inget bildinnehåll antas därifrån. [HoMM-länken](http://modhomm3.free.fr/maps/map_english01.htm) fungerade via direktHTTP efter att webverktygetsHTTPS misslyckats: sidan beskriver en Heroes III:Shadow of Death-mod, inte en generell kartlista. Inga modfiler eller externa spelassets hämtades till repo. Bilderna låg enbart i/tmp för granskning, inga tilegeometrier kopierades.

## RTS-133 – Shattered Coast

Shattered Coast128×128 har västlig spelarö, nordöstlig landkust, sydlig kontinent och två resursöar i ett sammanhängande hav. Det finns inga landbroar mellan dessa landmassor. Första hamnen kan byggas på östkusten (t.ex.672,320); transportera armén över norra kanalen till fienden eller segla söderut efter ändliga resurser. Arbetare kan transporteras med last; för spelarens fjärröar krävs manuell transport tillbaka till huvudön för leverans. Automatisk transport av cargo införs inte. Totalstock1850wood/1150gold. Egen terräng återanvänder tidigare geografiska referensprinciper från132; inga externa kartor/assets kopieras.

## RTS-134 – Fem fraktioner: beslutad design inför135–141

Detta är måldesign, inte redan implementerat gameplay. Humans/Orcs kompletteras136/137; Elves/Dwarves/Goblins införs138–140; matchups/AI verifieras141. Vid designleveransen134 hade runtime bara Crown och Clans; senare fraktionsavsnitt anger faktiskt tillgänglig roster. Behåll `crown` för Humans och `clans` för Orcs; nya ID:n är `elves`, `dwarves`, `goblins`. Presentation och teamägare är separata från dessa stabila identiteter. Äldre matchers redan betalda jobb/costs/tider bevaras vid migration, inga gratis specialistupplåsningar.

| Fraktion | Styrka och spelstil | Svaghet | Specialist |
| --- | --- | --- | --- |
| Humans | Balanserade grundtrupper, prisvärda flexibla byggnader | Ingen högsta rörlighet eller siege-skada | Banner Guard: tålig närstridseskort med lägre DPS |
| Orcs | Stark närstrid, snabb offensiv raider | Kortare ranged/siege-räckvidd, dyrare grundmelee i gold | Raider: snabb melee med hög DPS |
| Elves | Snabba workers och ranged, stor skotträckvidd | Lägre siege/base-HP, dyr specialtrupp | Marksman: lång räckvidd, låg HP |
| Dwarves | Tåliga byggnader/trupper, tung siege | Långsam rörelse och produktion, hög wood-kostnad | Bulwark: mycket HP, låg hastighet/DPS |
| Goblins | Billig snabb produktion, mobila explosiva vapen | Låg HP och kortare räckvidd | Grenadier: kort ranged med splash, sårbar närstrid |

Roster använder tekniska roller `worker`, `soldier` (melee), `archer` (ranged), `catapult` (siege), `specialist`. Namn ändrar inte rollen. Kostnad anges wood/gold, tid gameplay-sekunder, fart world-px/s. Alla workers bär5 och samlar1/s; ingen ny resurstyp, deliveryregel eller bärkapacitet. Melee anger kontinuerlig DPS och32px range. Projectile anger skada/skottintervall och range; splash omfattar enbart fientliga mål enligt befintliga regler.

| Fraktion / unit | Roll | Kostnad | Tid / supply | HP / fart | Attack / range / splash |
| --- | --- | --- | --- | --- | --- |
| Humans Worker | worker |20/0|5/1|30/160| ingen |
| Humans Guard | soldier |20/5|5/1|60/160|18DPS/32/0|
| Humans Archer | archer |20/10|6/1|40/140|12/1s,160/0|
| Humans Catapult | catapult |40/20|10/2|80/80|24/2s,224/48|
| Humans Banner Guard | specialist melee |30/15|8/2|100/130|14DPS/32/0|
| Orcs Peon | worker |20/0|5/1|35/155| ingen |
| Orcs Axe Warrior | soldier |18/6|6/1|66/160|20DPS/32/0|
| Orcs Hunter | archer |20/10|6/1|45/135|12/1.1s,144/0|
| Orcs Stone Thrower | catapult |40/20|11/2|90/75|26/2.1s,208/48|
| Orcs Raider | specialist melee |26/12|7/2|80/175|24DPS/32/0|
| Elves Grove Tender | worker |20/0|5/1|28/170| ingen |
| Elves Warden | soldier |20/6|5/1|50/175|16DPS/32/0|
| Elves Longbow | archer |22/12|6/1|45/170|14/0.9s,192/0|
| Elves Ballista | catapult |45/25|10/2|60/100|18/1.8s,256/32|
| Elves Marksman | specialist projectile |30/20|8/2|50/170|16/1s,200/0|
| Dwarves Miner | worker |22/0|6/1|40/140| ingen |
| Dwarves Iron Guard | soldier |24/5|6/1|85/120|17DPS/32/0|
| Dwarves Crossbow | archer |24/10|7/1|55/115|16/1.2s,160/0|
| Dwarves Cannon | catapult |45/25|12/2|110/60|30/2s,240/48|
| Dwarves Bulwark | specialist melee |45/20|10/2|140/100|14DPS/32/0|
| Goblins Tinkerer | worker |18/0|4/1|24/180| ingen |
| Goblins Scrapper | soldier |16/4|4/1|40/180|16DPS/32/0|
| Goblins Slinger | archer |18/8|5/1|30/175|10/0.8s,144/0|
| Goblins Mortar | catapult |35/25|8/2|55/95|26/1.6s,208/64|
| Goblins Grenadier | specialist projectile |25/25|7/2|35/170|20/1.5s,128/32|

Body-storlek24px för worker/melee/ranged/specialist,40px för siege. Projectile-simulation återanvänder archer-parametrar300px/s,2s lifetime,16px hitRadius för archer/Marksman; siege/Grenadier180px/s,3s lifetime,16px hitRadius. Aggro-range är attack-range+40px för projectile,140px för melee. Specialist har egen roll, kostnad och stridsprofil; ingen healer/aura/magi eller självmordsmekanism krävs. Befintliga stance/fury och timer/input-regler bevaras för Humans/Orcs. Elves får True Shot (+20% utgående skada,5s/20s cooldown), Dwarves Brace (35% mindre inkommande skada,5s/25s), Goblins Overcharge (+35% utgående och +20% inkommande skada,4s/20s). Dessa self-buffs använder befintligt ability-state och valda levande combat-units; inga hidden-target spells, aura eller nya mana-system. Implementeras/testas i respektive fraktions-task; generic135 behöver endast stödja data/timer-reglerna.

### Byggnader och prerequisites

Varje fraktion har startbas, truppbyggnad, supplybyggnad, researchbyggnad och hamn. Samma byggmekanik, placement/grid och begränsningar återanvänds. Spelarens startbas har befintligt48px-footprint och8supply; fiendens startbas har96px-footprint. Ingen ny basplacering; övriga64px,5s worker-bygge. Supply ger5, högst befintliga tre supplybyggnader; truppproduktion använder befintlig FIFO-kö,5-unit-roster utan nya byggnadssystem.

| Fraktion | Bas: namn / HP | Truppbyggnad: namn / kostnad / HP | Supply: namn / kostnad / HP | Research: namn / kostnad / HP | Hamn: namn / kostnad / HP |
| --- | --- | --- | --- | --- | --- |
| Humans |Keep/240|Barracks/40/0/120|Farm/20/0/80|Forge/40/10/120|Harbor/40/10/160|
| Orcs |Stronghold/260|War Hut/40/0/130|Cattle Pen/20/0/90|Smithy/40/10/130|War Dock/40/10/170|
| Elves |Grove Hall/220|Ranger Lodge/40/0/110|Garden/20/0/70|Moon Workshop/45/10/110|River Dock/40/10/140|
| Dwarves |Stone Hold/300|Guard Hall/45/0/160|Storehouse/22/0/110|Foundry/45/15/160|Stone Dock/45/10/200|
| Goblins |Workshop Hall/200|Scrap Yard/35/0/90|Supply Shack/18/0/60|Lab/35/15/90|Junk Dock/35/10/130|

Worker kräver levande färdig bas; melee/ranged färdig truppbyggnad. Siege kräver dessutom färdig researchbyggnad. Specialist kräver färdig trupp- och researchbyggnad samt attack1 (Orcs/Elves/Goblins) eller defense1 (Humans/Dwarves). Alla krav kontrolleras vid enqueue; redan betalda jobb behåller sina recept. Destroyed producer följer tidigare cancellation-regler. Ingen extra tech-tier införs. UI visar faktisk blockerande prerequisite, kostnad/supply och researchnamn; otillgängliga factions exponeras först när deras task är verifierad.

### Research och fartyg

Research är en engångsnivå per befintlig attack/defense-role, en pågående research i taget vid färdig researchbyggnad. Samma tillämpning på combat som i nuvarande system; workers får inte nya vapen. Defensevärdet är mottagen skademultiplikator. Inga hypotetiska extra tech-träd.

| Fraktion | Attack: namn / kostnad / tid / multiplier | Defense: namn / kostnad / tid / multiplier |
| --- | --- | --- |
| Humans |Tempered Arms/40/10/8s/1.25|Plate Craft/40/10/8s/0.75|
| Orcs |War Blades/35/15/8s/1.30|Hide Armor/40/10/8s/0.80|
| Elves |True Aim/40/15/8s/1.25|Woven Guard/35/15/8s/0.80|
| Dwarves |Forged Shot/45/15/10s/1.25|Stone Plates/45/15/10s/0.65|
| Goblins |Hot Powder/30/20/6s/1.30|Scrap Plating/30/15/6s/0.85|

Färdig hamn krävs för warship/transport. Alla transports har4platser,2supply,8s träning,32px body och64px boarding-range; befintlig cargo/conservation gäller. Naval-HP/fart och warship-recept varierar via data, inte separata sjösystem. Warships använder befintlig projectile16damage/1.5s,range192 och280px/s projectile,3s lifetime,20px hitRadius.

| Fraktion | Warship: namn / kostnad / tid | Transport: namn / kostnad | Fartyg HP / fart |
| --- | --- | --- | --- |
| Humans |Cutter/40/15/8s|Transport/40/10|90/110|
| Orcs |War Barge/40/15/8s|Raft/40/10|100/105|
| Elves |Swift Sail/45/15/8s|Grove Ferry/40/10|80/125|
| Dwarves |Ironclad/50/15/10s|Heavy Ferry/45/10|120/85|
| Goblins |Powder Boat/35/20/6s|Junk Ferry/35/10|65/135|

AI måste faktiskt betala/använda egna roster-/research-/naval-recept; inga fraktionsdata enbart i spelar-UI. Befintlig enemy combat-asymmetri från svårighetsprofiler inventeras135/141 och redovisas, inte tyst ersatt i design-tasken. Matrisen är startvärden för tester/balans, inte ett löfte om jämn win-rate. Varje fraktions-task kräver egna läsbara unit/building-assets och beteende/ekonomi/AI/Save/browser; generiska tillfälliga assets får inte markeras som färdig fraktion utan redovisning.

## RTS-135 – Implementerad data- och prerequisitegrund

Vid leverans av135 hade ordinarie spel Crown/Clans och fyra arméroller inklusive worker. Specialistprototyper är förberedda i data men dolda tills respektive fraktion kompletteras. En roster kan utesluta roller; då visas ingen träningsaction. Prerequisites kontrolleras vid betalning/start: byggnaden ska vara färdig och levande och research ska vara avslutad. Blockerad produktion drar inget saldo. Ett redan godkänt jobb fortsätter om ett prerequisite därefter försvinner.

Recept styr namn, kostnader, tider, supply, HP, movement och spelarcombat samt researchmodifier och fartyg. Fraktionsdesignens nya balans/prerequisites aktiveras i136–140, inte retroaktivt genom135. Full fienderoster och fraktionsmatchups kommer141; nuvarande generiska enemy-armé är bevarad. Specialistens befintliga soldatbild är en prototyp, inte färdig fraktionsgrafik.

## RTS-136 – Spelbara Humans

Humans har fem beslutade roller, egen Banner Guard-grafik och befintliga Human-byggnadsutseenden. Forge låser upp siege; Plate Craft låser upp Banner Guard. Recept/stats enligt134; Catapult aggro-range264px motsvarar range+40. Researchnamn Tempered Arms och Plate Craft, warship Cutter; befintliga stance/ekonomi/delivery/produktion/selection/combat-regler återanvänds. Basens befintliga spelar-footprint48px och enemy96px bevaras;134-textens96px som generell spelarbas var en felaktig inventering och har rättats. Ingen geometri-/saveombyggnad genomförs här. Full femrolls-AI och matchup-balans verifieras141; nuvarande betalda enemy-grundproduktion/ekonomi kvar.

## RTS-137 – Spelbara Orcs

Orcs har hela femrolls-roster enligt134. Raider är snabb offensiv melee med egen lättare rustning/bare-head/tvåyxor-silhuett. Forge/War Blades låser upp den; attack1 ger1.30damage och Fury1.25, tillsammans1.625 medan buffen varar. Högre meleeDPS och HP men kortare ranged/siege-range skiljer spelstilen från Humans. Stronghold260HP, War Hut/Smithy130HP, Cattle Pen90HP och War Dock170HP. Egna befintliga trä-/spik-/tuskbyggnader återanvänds. NPC-grundarmé fortfarande generisk till141, egen research/ekonomi/naval fungerar redan. Save bevarar betalda äldre tider/kostnader och faktisk skadad HP; inga gratis refunds/heals.

## RTS-138 – Spelbara Elves

Välj Elves: Grove Tender, Warden, Longbow, Ballista och Marksman. Lättare HP och högre fart, längre ranged/siege-range enligt134. Moon Workshop45wood/10gold låser upp Ballista; True Aim40/15,8s låser dessutom upp Marksman30/20,8s/2supply/50HP/170px/s/range200/16damage. True Shot ger+20% outgoing i5s,20s cooldown och bevarar orders. Woven Guard35/15,8s reducerar mottagen skada20%. Grove Hall220HP, Ranger Lodge110, Garden70, Moon Workshop110; River Dock140HP, Swift Sail45/15 och Grove Ferry40/10, båda80HP/125px/s. Alla använder befintlig ekonomi/leverans/produktion och egna woodland-/leaf-/bow-/ballista-/root-/canopybilder. Full fraktions-AI hör till141; ingen sådan färdigmarkering här.

## RTS-139 – Spelbara Dwarves

Dwarves har Miner40HP/140px/s (22wood,6s), Iron Guard85HP/120px/s/17DPS, Crossbow55HP/115px/s/16damage/1.2s och Cannon110HP/60px/s/30damage/2s/range240. Bulwark140HP/100px/s/14DPS kostar45/20, tar10s/2supply och kräver Foundry+Stone Plates. Stone Hold300HP, Guard Hall160 och45wood, Storehouse110 och22wood, Foundry160 och45/15. Forged Shot/Stone Plates45/15,10s; defense0.65 och Brace0.65 multipliceras medan buffen är aktiv (5s,25s cooldown). Stone Dock200HP45/10, Ironclad120HP/85px/s50/15/10s, Heavy Ferry45/10/8s. Egna kompakta armored/beard/hammer/shield/crossbow/cannon och stone/metalbilder, gamla order/input/Save-regler kvar. NPC-roster/full matchup141.

## RTS-140 – Spelbara Goblins

Tinkerer24HP/180px/s18wood/4s; Scrapper40HP/180px/s16DPS16/4/4s; Slinger30HP/175px/s10damage/0.8s; Mortar55HP/95px/s26damage/1.6s/range208/splash64. Grenadier35HP/170px/s20damage/1.5s/range128/splash32 kostar25/25,7s/2supply och kräver Lab+Hot Powder. Workshop Hall200HP; Scrap Yard35wood/90HP, Supply Shack18wood/60HP och Lab35/15/90HP. Hot Powder30/20,6s1.3 damage; Scrap Plating30/15,6s0.85 received damage. Overcharge ger1.35 outgoing och1.2 incoming i4s/20s cooldown, multiplicativt med research. Befintlig splash träffar bara synliga fiender, ingen friendly fire. Junk Dock35/10/130HP, Powder Boat35/20/6s och Junk Ferry35/10/8s, fartyg65HP/135px/s. Egna små goggles/green/scrap/slingshot/mortar/grenade-, patched tin/pipe/lab- och junkfleetbilder. Full AI/matchups återstår141.

## RTS-141 – Fraktioner som motståndare

Välj Enemy faction i startmenyn: Humans, Orcs, Elves, Dwarves eller Goblins, oberoende av egen fraktion. Automatic opponent behåller tidigare standardmotståndare. Spegelmatcher är tillåtna; teamfärger skiljer ägaren från fraktionsidentiteten. Valet bevaras av restart, lokal Save och preferenser och kan inte ändras mitt i matchen.

Basmatchernas AI betalar nu för sin roster och använder samma fraktionsprofiler som spelaren. Den bygger egna prerequisites och forskar innan specialist tillåts. En låst roll hoppas över; en upplåst dyr roll inväntar saldo/supply, så billigare units inte permanent blockerar siege och specialist. Buffar används i synlig strid och förändrar inte order. Projektiler har fasta mål, splash träffar bara motståndarlaget och synlighet följer befintlig fog.

Starkare faktiska arméer behöver längre förberedelse: nya roster-matcher har 120 sekunders ekonomigrace före första gruppdispatch, utöver difficulty-profilens första anfallstid (Normal 180 s, Hard 170 s). Äldre sparade matcher behåller 20 s grace och generisk army. Försvar av egen bas och sjöinvasionens konfigurerade launch påverkas inte av landgrace. Den betalda land-regressionstrategin bygger farm och upp till sex närstridsenheter; Hard på Arena/Forest använder i stället en extra betald arbetare och försvarsforskning för fyra soldiers. På River hålls armén samlad före anfall; sjöstrategin bygger farm och transporterar fyra enheter med aktiv självbuff. Detta är reproducerbara spelstrategier, inte en garanti om lika win-rate.

Begränsningar: finite scripted waves är fortsatt generiska raiders, developer Siege test behåller diagnostisk profil, och den ändliga sjö-AI:n använder två en-supply-passagerare. Full AI-roster verifieras på land med betalda prerequisites och ersättning efter stridsförluster. Ingen avancerad produktionsplanering, mikro/kiting eller fraktionsspecifik AI-ekonomi.

## RTS-142 – Campaign med upplåsning och replay

Campaign visar fem befintliga uppdrag i ordning: Tutorial – First Steps, Forest Watch, The Siege, The Outpost och The Crossing. Tutorial är först tillgänglig. Victory i ett uppdrag gör nästa tillgängligt; defeat ger ingen completion eller upplåsning. Avklarade uppdrag kan spelas om utan att ta bort tidigare framsteg. Välj missionknapp eller scenario i menyn, läs briefing och objektiv och starta en tillgänglig operation. Låsta uppdrag visar status och kan inte startas. Egen fraktion, motståndare och svårighet följer befintliga menyval i denna struktur-slice.

De faktiska målen bevaras: sex betalda Tutorial-steg, tre ändliga Forest Watch-vågor, förstörd enemy-base i The Siege, basen levande90gameplay-sekunder i The Outpost och sjölandstigning/enemy-base i The Crossing. Resultatvyn visar debriefing; Play Again återställer samma campaign-run och Main Menu låter spelaren välja nästa upplåsta uppdrag eller replay. Skirmish/Survival och historiska standalone-matcher ger ingen campaign-completion.

Progression sparas lokalt separat från matchens Save. Save/load/paus/restart bevarar vilket campaign-uppdrag som faktiskt spelas, inklusive pågående Tutorial-steg. En avslutad giltig campaign-Save kan ge samma idempotenta completion; gamla Saves utan run-ID hittar inte på progression. Saknade/ogiltiga progressionsvärden ger en ny campaign; storagefel visas och sessionens framsteg behålls i minnet. Ingen kontosynkronisering, highscore, nya måltyper eller nya uppdrag i142; utökningen följer143–145.

## RTS-143 – Eight operations: Five Banners of the Frontier

Planeringsleverans: menyn har fortfarande142:s fem spelbara uppdrag. Tabellen nedan definierar åtta operationer för144–145, inte åtta redan implementerade nivåer. De fem befintliga mission-ID:n och deras gameplaymål återanvänds. Nya starters får berättelsens fasta player/enemy-par; Skirmish behåller alla25val. Äldre campaign-Saves behåller sina faktiskt valda fraktioner och ska kunna återupptas utan omskrivna units/bank.

Berättelse: rivaliserande garnisoner hotar gränslandet. Fem folk samarbetar genom lokala befälhavare för att öppna en säker väg från skogsvakten till kusten. Motståndarnas race är rosteridentitet, inte att ett helt folk framställs som ondskefullt. Varje briefing presenterar nästa uppgift och debriefing förklarar vad som säkrats. Originalberättelse, inga lånade kampanjtexter eller cutscenes.

| # | Stabilt mission-ID / titel | Scenario | Player → enemy | Karta | Initial wood/gold | Berättelse och verkligt successmål | Leverans |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `first-steps` · First Steps | Befintlig `tutorial` | Humans → Orcs | `arena` | 40 / 10 | Gör garnisonen redo: välj/move/gather och leverera20wood, bygg barracks, producera soldier och ge den manuellt attackmål. Alla sex befintliga Tutorial-steg krävs. | 144, återanvänd |
| 2 | `forest-watch` · Forest Watch | Befintlig `mission-waves` | Orcs → Humans | `arena` | 20 / 10 | Försvara skogsvakten med ny ekonomi och melee-armé. Sista konfigurerade vågen ska ha spawnat och samtliga raiders vara döda. | 144, återanvänd |
| 3 | `the-siege` · The Siege | Befintlig `mission-base` | Elves → Goblins | `arena` | 20 / 10 | Slå ut den rivaliserande garnisonen innan den tar nästa gränspassage. Victory först när den faktiska enemy-basen är förstörd. Introducera egna ranged/research-val genom tydlig briefing, inga gratis uppgraderingar. | 144, återanvänd |
| 4 | `the-outpost` · The Outpost | Befintlig `mission-outpost` | Dwarves → Goblins | `arena` | 40 / 10 | Håll utposten medan förbundet samlas. Basen ska leva vid90gameplay-sekunder; befintlig ändlig vågschedule och timer återanvänds. Dwarf-försvar/Brace görs begripliga. | 144, återanvänd |
| 5 | `the-crossing` · The Crossing | Befintlig `mission-sea` | Goblins → Humans | `islands` | 20 / 10 | Knyt samman kusterna: betala för harbor/transport, landstig med armén och förstör enemy-basen. Samma sjöregler och ändliga resurser som befintlig mission. | 145, återanvänd |
| 6 | `ridge-convoy` · Ridge Convoy | Ny mission, först vid användning | Orcs → Dwarves | `highlands` | 40 / 20 | Skydda en namngiven courier genom bergspasset. Courier ska leva, nå skyddszonen och de två namngivna ambush-guards som hör till operationen ska vara döda. Ingen victory genom att bara springa förbi striden. | 145, ny escort |
| 7 | `valley-rescue` · Valley Rescue | Ny mission, först vid användning | Elves → Orcs | `frontier` | 40 / 20 | Befria fånglägret i den östra dalen. De två namngivna camp-guards ska vara döda och minst en levande egen combat-enhet ska nå lägrets rescue-zon. Det räcker inte att slå ut en annan fiende på kartan. | 145, ny rescue |
| 8 | `coastal-banner` · Coastal Banner | Ny mission, först vid användning | Humans → Dwarves | `coast` | 60 / 30 | För förbundets fana över sundet. Erövra det markerade kustfästet genom att hålla dess zon oavbrutet30gameplay-sekunder med minst en levande egen combat-enhet och ingen levande enemy combat-enhet i zonen. | 145, ny capture |

Success/failure är konkreta matchmål, inte berättelseflaggor som kan bli klara av en UI-klickning. Basdöd ger defeat i alla operationer och har företräde vid samtidiga villkor. I6 ger courier-död dessutom defeat; vanliga workerförluster avslutar inte operationen.7 kräver både guard-clear och närvaro vid lägret.8 räknar bara combat-enheter på land: workers/fartyg/cargo/transportpassagerare räknas inte som kontroll; frånvaro eller contested-zon nollställer den sammanhängande hold-tiden. Game over fryser simulation och gameplay-input enligt befintliga regler.

Föreslagna målplatser i befintliga kartor, verifierade geometriskt mot40px kropp och kartans terrain:6 courier-start(496,480), skyddszon(1504,544),64px räckvidd;7 läger(1088,640),64px räckvidd;8 kustfäste(1600,384),64px zon. De är data för missionen, inga nya blockerande tiles. Befintliga land-/sjöpassager återanvänds; faktisk start/spawn/route och browserflöde måste verifieras i145 före Done. Courier, guards och zonmarkör ska vara synliga med namn/målstatus utan att kringgå fog. Courier kan använda befintlig egen worker-bild med tydlig missionmarkör; camp/fana använder befintlig pixelgrafik eller uttryckligt redovisad enkel målmarkör. Det är inte ett nytt generellt quest-, convoy- eller neutral-ägarsystem.

Startkapital är explicit missionconfig, inte återkommande gratisinkomst. Spelarens byggnader, produktion, research, transports och replacements betalas med befintliga recept. Courier är en explicit startentity för eskortmålet, ingen producerad unit/reward; initial population och statistik ska räkna den korrekt. De namngivna guards är konfigurerade ändliga missionhot, inte påstått betald AI-produktion eller oändliga spawns. Kartförråd och faktisk handel mellan nod/cargo/bank bevaras; större kartor har befintliga extra fyndigheter. Guards kopplas till stabila mission-specifika entity-ID:n och respektive fraktions riktiga combatprofil. Deras initiala roster/spawn/order och budget måste avgränsas/valideras vid implementation; ingen ny avancerad AI-ekonomi eller oändliga waves. Planen garanterar inte balans före genomspelning.

Lokal progression142 fortsätter i tabellordning, med de tre nya mission-ID:n tillagda först när deras scenarios är implementerade. De fem tidigare completions bevaras; `the-crossing` är då inte längre slutoperation. Briefing/mål/debriefing/status och source-config uppdateras tillsammans. Nya mål sparar endast erforderligt matchstate: courier-ID/guard-ID:n för6, guard-ID:n/rescue-zon för7 och sammanhängande capture-tid för8; inga framtida generiska objectives före behov. Save-version och validering uppdateras när nya data faktiskt införs, med paus/restart/migration utan healing, gratisproduktion eller dubbla completions.

Verifieringsordning:144 spelar1–4 från briefing till seger/förlust med fasta profiler och betald ekonomi, inklusive Save/replay.145 gör5–8 i samma ordning och implementerar escort/rescue/capture vartefter respektive mission behöver dem.146 verifierar hela kedjan: alla success-/failure-triggers, fog, blockerande lägen, depletion, progression, load mitt i mål och efter resultat samt restart. Normal är grundbalans, Beginner ska ge lärutrymme och övriga profiler behåller sina konfigurerade tryck; skeva matchups åtgärdas i missionconfig efter faktisk observation, inga hemliga buffs. Ingen planeringsrad markeras spelbar före dessa checks.

## RTS-144 – Första fyra operationerna spelbara med berättelseprofiler

First Steps använder Humans mot Orcs, Forest Watch Orcs mot Humans, The Siege Elves mot Goblins och The Outpost Dwarves mot Goblins. Campaign visar och låser dessa profiler vid ny start; Skirmish behåller fria val. Äldre campaign-Saves återupptas med sina faktiskt sparade fraktioner. Målen och startförråden i143:s första fyra tabellrader är oförändrade.

Briefingarna förklarar betald ekonomi/produktion, supply före större anfall och respektive Guard/Fury/True Shot/Brace. Elves kan välja Longbows och forskning, men de är inte extra obligatoriska mål. Forest Watch och The Outpost använder fortfarande ändliga generiska raiders enligt141; deras motståndarprofil betyder inte att vågor har en ny betald fraktionsekonomi. Uppdrag5–8 färdigställs i145; menyn har fortfarande fem nivåer.

## RTS-145 – Campaign 5–8

The Crossing startar Goblins mot Humans med betald Scrap Yard/supply/army/Junk Dock/Junk Ferry och befintlig landstignings-/base-seger. Ridge Convoy startar Orcs mot Dwarves påHighlands med en namngiven vanlig starting worker: Ridge Courier. Två namngivna, ändliga guards står vid bergspasset. Båda måste dö och courier leva/nå safe-zone inom64px; flytta courier manuellt efter att eskortarmén säkrat passagen. Courier kan använda vanliga workerorders, men dess död avslutar missionen.

Valley Rescue startar Elves mot Orcs påFrontier: båda namngivna camp guards ska dö och en levande egen landcombat-enhet nå64px-zonen kring lägret. Inga gratis prisoner/reward-units; rescue representeras av tydlig målmarkör/status och verklig närvaro. Coastal Banner startar Humans mot Dwarves påCoast: betald transport/landstigning, clear guards och minst en levande egen landcombat-enhet i64px-zonen oavbrutet30s utan enemy landcombat där. Workers, ships och transportpassagerare håller inte zonen. Frånvaro/contest nollställer hold. Basdöd har alltid företräde.

Configens målplatser/förråd/par följer143:s tabell. Tre nya operationer har två uttryckliga initiala soldier-guards av fiendens faktiska fraktionsprofil och självbuffar, ingen kontinuerlig NPC-ekonomi/vågproduktion. Courier/guards räknas som initialentities i supply/statistik, inte gratis producerade enheter. Målringen/namn använder enkel redovisad markör med befintliga units; inga nya flagg-/camp-animationer eller cutscenes. Fog visar målzonen efter exploration och guards först vid faktisk sight; briefing/status beskriver de authored målen.

Alla åtta operationer visas i ordning, låses upp efter verklig victory och kan återspelas. Fem tidigare completion-ID:n bevaras; The Crossing låser nu upp Ridge Convoy. Save32 bevarar exakt capture-tid, levande courier/guards och befintlig matchstatus utan rewards. Äldre Campaign-Saves behåller faktisk fraktionsidentitet.

## RTS-146 – Campaign-speltest och avgränsningar

Native sammanhängande1–8-kedja genomförd i två upplösningar med faktisk gathering, supply, produktion, förmågor och vid behov navaltransport. Första missionenBeginner, restenNormal; separata betalda gameplaytester allaNormal. Crossings Goblins behöver använda transport och kan utnyttja Overcharge försiktigt; en fyrsoldatsarmé med farm och egna förmågor klarade5–8 utan balance-/HP-fixture. Escort/rescue uppmuntrar att rensa guards innan kurir/marknärvaro. Coast kräver obruten kontroll efter landstigning, inte enbart guardkills.

Blockerande unload är avsiktligt atomiskt: inga passagerare försvinner om hela gruppen inte får plats. Alternativ fri strand användes i verkligt speltest när enemyworkers blockerade den första. Stora målzoner/path-rutter passerade med befintlig navigation; ingen säkerhet utlovas för varje möjlig byggblockering eller taktik. Senare3 har två initiala namngivna guards och inga NPC-ekonomier/vågor; difficulty ändrar inte dessa fasta vakters antal/stats. Rescue är guardclear+combat vid campmarkör, inte neutrala reward-units. Campaign ger completion/unlock/replay utan materiell reward.

## RTS-147 – Bekräftad egenunit-borttagning

Dismiss Unit/Delete är en explicit spelaråtgärd för levande egna markerade workers, combat-units och ships. Bekräftelsens count inkluderar passagerarna på valda transporter. Passagerare och deras last tas bort tillsammans med transporten; ingen landstigning eller refund sker. Carried wood/gold räknas som lost cargo, medan nod/saldo är oförändrade. Units removed är separat från deaths/kills.

Modalen låser fokus och fryser matchtid, simulation och gameplay-input; Cancel/Escape återgår till samma selection/orders. Delete med UI-fokus/modifiers/repeat eller paus/avslutad match startar ingen action. Byggnader/enemyunits ingår inte. Befintliga order-/group-/target-/byggarreferenser städas; construction behåller betald progress och kan bemannas igen. Campaignens vanliga failure-/capturevillkor gäller även frivillig borttagning.

## RTS-148 – Tydliga commands

Orders/Build/Train/Research visas som rubriker för kontextens befintliga actions. Varje knapp visar sin hotkey och tooltip med full actionbeskrivning, aktuell cost och orsak om blocked. Hjälpvyn använder samma bindningar: H harbor, J transport, K warship, L unload och V specialist kompletterar tidigare13bindningar till18actions. Arrow/Home/Space-camera, Ctrl/Cmd-grupper och browser/textinput är fortsatt separata; modifiers/repeat/fokuserad UI utlöser inga gameplaykeys. Inga ekonomi-/combat-/produktionsregler ändras.

## RTS-149 – Lokala resultatlistor

Campaign-uppdrag och Skirmish-kartor har separata lokala highscores, ytterligare uppdelade efter svårighet, hastighet, spelar-/fiendefraktion och regelversion. Modell1: victory10000 plus högst3600 tidsbonus (hela gameplaysekunder dras av); defeat0. Förlust visas som förlust. Kills, produktion, dismiss och resurser ger inga scorebonusar. Matchstatistik sparas tillsammans med utfall/tid och profiler.

Första terminala resultatet per match-ID gäller; load av en tidigare gren ger inte ett andra resultat. Ny replay/restart ger ny identitet. Äldre Saves saknar säker ID och är ej rankade. Top10 visas, alla dedup-ID:n behålls upp till5000entries. Detta är lokal spelhistorik utan backend eller garanti mot lokal manipulation.

## RTS-150 – Slutetappens avgränsning

Release0.2.0 samlar befintliga system utan nya mål eller balansjusteringar. Native genomspelning och full regression verifierar kampanjens betalda ekonomi/mål och befintlig femfraktions-/kartfunktion. Lokala scores och Save/restart ingår i användarflödet. Faktisk ljudlyssning/matchlyssning är uppskjutna enligt användaren; teknisk ljudkontroll får inte beskrivas som en lyssningsgranskning eller garanti om mixkvalitet. RTS-151 startas inte.

## RTS-164 – reparera eget försvar

Välj workers och använd Repair [Z], följt av en egen skadad byggnad, eller högerklicka byggnaden. Varje worker återställer4HP/s inom24px, för0.5wood och0.1gold per HP. Upp till tre workers arbetar samtidigt per byggnad, övriga väntar. Stop eller en annan order avbryter; full HP, slut på resurser eller förstörd byggnad avslutar ordern. Reparation fortsätter efter save/load och fryser vid pause. Den ändrar inte byggtid eller produktion.

Nivå2-tornens räckvidd är192px; alla befintliga siege-enheter har minst208px. Siege-skott gör1.5× skada mot torn, murar och portar. Vanliga byggnader/enheter har oförändrad skadeberäkning. Försvar behöver därför skyddas mot belägring även med tre reparerande workers.

## RTS-165 – specialistmana

Banner Guard, Raider, Marksman, Bulwark och Grenadier kompletteras med mana; namn, stridsprofil, kostnad, tid, supply och prerequisites bevaras. Max/initial/regeneration per gameplay-sekund: Humans100/60/1, Orcs80/40/1, Elves120/60/1.25, Dwarves100/50/0.8, Goblins80/40/1. Mana visas bredvid HP för en markerad specialist. Regeneration stannar vid max, paus, gameover eller död; transporterade specialister regenererar också. Mana används av spells166/167, inte av äldre gratis E-selfbuff. Äldre saves börjar med initial mana när fältet saknas.

## RTS-166 – riktade spells

Välj en specialist: Heal[F2] kostar20mana, range160 och cooldown6s; återställer25HP upp till max. Ward[F3] kostar25mana, range160 och cooldown8s; en egen markstridsenhet tar0.75× skada i6s. Hex[F4] kostar20mana, range192 och cooldown8s; en synlig fientlig markstridsenhet gör0.75× attackskada i5s.

Range-cirkeln och grön/röd markör visar targeting. Escape/högerklick avbryter utan kostnad; invalid/fullHP/fog/range/feltyp ger feedback utan cooldown. Aktiva buffs har cyan ring, debuffs lila; selection-tooltip visar namn och återstående tid. En buff och en debuff kan samexistera; samma kanal ersätts och får ny duration. Pause/save/load bevarar mana och tid. Ingen ny castpose ingår.

## RTS-167 – aktuella fraktionsspells

Detta ersätter166:s gemensamma utbud för fyra raser, med bevarade historiska Save-effekter. Befintliga specialistnamn och stridsprofiler består. F2 heal, F3 buff och F4 debuff; tomma slots döljs.

| Ras | Spell | Mana / range / cooldown | Verkan |
| --- | --- | --- | --- |
| Humans | Heal / Ward / Hex |20/160/6;25/160/8;20/192/8|25HP; inkommande0.75×/6s; attack0.75×/5s|
| Orcs | War Cry / Intimidate |25/160/10;20/160/10|attack1.3×/5s; attack0.7×/5s|
| Elves | Renew / Wither |25/192/8;25/224/10|30HP; attack0.65×/4s|
| Dwarves | Mend / Rune Shield |15/128/8;30/160/12|20HP; inkommande0.6×/6s|
| Goblins | Overclock / Corrode |25/160/12;20/192/10|attack1.4× OCH inkommande1.2×/5s; fienden tar1.25×/5s|

Effektens namn/tid visas i selection. Cyan buff och lila debuff kan visas samtidigt. Kanaler stackar inte; refresh ersätter samma kanal och startar ny tid. Pause/save/load/restart bevarar eller återställer effekter enligt matchflödet. AI använder heal under70%HP och annars synliga meningsfulla stridsmål, med samma regler och högst två beslut/s. Ingen ny castanimation levereras.


## RTS-168 – första luftrostern (TEMP ART)

Alla flygare tränas i rasens barracks efter Forge+attack1+defense1. Archer är tidig mark-AA utan dessa prerequisites. Inga nya resurser, transporter eller air-specialförmågor.

| Ras/enhet | Wood/gold | Tid/supply | HP/fart | Skada/intervall/range | Mål |
| --- | --- | --- | --- | --- | --- |
| Human Gryphon Rider |65/35|14s/3|130/160|18/1.3s/160|land,sea,air,building|
| Orc Wyvern Rider |60/40|13s/3|90/170|24/1.4s/160|land,sea,air,building|
| Elf Great Eagle |45/35|12s/2|60/215|14/0.9s/176|land,air,building; mark/byggnad0.45×, luft1.25×|
| Dwarf Gyrocopter |65/40|15s/3|95/175|12/1s/192|land,air,building; mark/byggnad0.65×, luft1.5×|
| Goblin Airship |75/45|18s/4|140/90|30/2s/160, splash40|land,building; ingen luftattack|

Flygare använder samma production/FIFO/supply/selection/save/matchsystem som marktrupp. Lokal luftvision, cyan/pink minimapmarkörer och höjd/skugga. Slutgrafik inte godkänd; tillfälliga originalikoner synligt märkta TEMP ART. Balansvärden är första preliminära passets utgångspunkt, inte mänskligt speltestade.


## RTS-169 – första preliminära counters

Markarchers är tidig anti-air för alla fem raser. I25 kostnadsjämförbara korsrasfixturer slår de två flygare; på marken slår billigare meleegrupper archers vid32px startavstånd. Detta inkluderar inte mänsklig kiting. Siege besegrar AA i fyra av fem120px-fixturer; Elf-archers vinner sin siege-matchup.

Great Eagle gör17.5 mot luft före research men bara6.3 mot mark/byggnad. Den snabba luftjägaren slår Wyvern vid400-resursbudget men förlorar mot tåliga Gryphon och anti-air-Gyrocopter. Gyrocopter gör18 mot luft men7.8 mot mark/byggnad. Airship saknar luftattack: två bombare(240 resurser) förlorar mot tre Eagles(240); en bombare+fyra Slingers(224) skyddar kombinationen mot tre Eagles(240). Bombare kan slå ren melee som saknar lagliga luftmål.

Warship är nu också sjöbaserad AA:16 normal skada men12 mot luft, samma192range/1.5s. Jämförbara3–4 warships mot två Gryphon/Wyvern vinner i faktisk water-fixture för samtliga raser. Transport attackerar aldrig. Sjö-/markspritekvalitet ändras inte i detta balanspass. Specialisternas markspells använder samma mana/kostnad/duration som före169; de ger inte automatisk seger mot kostnadsjämförbar melee. Lika research1 och exakt wood/gold/supply/produktionstid i config ger en reproducerbar teknisk bas; mänsklig fullmatchbalans krävs fortfarande.
