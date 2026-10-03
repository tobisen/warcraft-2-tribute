# Presentation och kontroller – RTS-091

Inventering av verifierad090-release,2026-10-03. Ingen runtime ändrad.

| Område | Återanvänd | Brist / nästa task |
|---|---|---|
| Startsida | `index.html`, BootScene/session: sex spelbara lägen, fyra uppdrag, fyra kartor, två fraktioner, tre svårigheter; validerad start/restart | Ett långt formulär utan tydlig huvudmeny, kvar ovanför match;093–095. |
| HUD | DOM-knappar, kostnader/spärrar, selection, FIFO/refund/research, population och matchresultat i presentation/hud.ts |280px sidopanel med scrolling, flera globala handlingar;097–100. Behåll actionhandlers. |
| Grafik | Repoegna reproducerbara pixelatlas för terräng, byggstadier, åttavägsunits och fartyg; lag/fraktionsfärger, fog/HP/ringar | Nuvarande fantasy-panel har stil men komposition saknar sammanhållen meny/spelvy;092. Förbättra detalj/läsbarhet111–114 utan ändrad simulation. |
| Ljud | En appägd gesture-låst AudioContext, master/effects/music, mute/pause/reset, OGG/PCM-fallback, fog-säker cannon/splash | Ingen röstkanal/persistens. Tidigare verifierat decode/start/gain, inte subjektiv lyssning;117–119 måste redovisa faktisk lyssning separat. |
| Kamera | Fast800×600 viewport i1280×960 world, mittendrag/bounds, minimap/fog/navigation och saved scroll | Fyller inte fönstret, ingen kant/tangentpan/Space/Home. Resize095; nya kontroller102–103. |
| Input | Click/5screenpx drag i alla riktningar, Shift, kontrollgrupper, RMB context orders, hotkeys via samma buttons; UI fokus spärrar tangenter | Startsidematchcontrols tar vertikal plats; flytta sessioncontrols till separat spelvy095. HUD/pointerupoutside måste regressionstestas vid resize. |
| Matchinställningar | config/maps/difficulty/scenarios/factions + gameplay/matchSettings.ts, strikt Save/legacy migration | Karta/svårighet sammanfattas i lång text; separata beskrivningar094. Endast1× finns: visa inte aktiv0.75× innan108. |
| Introduktion | Uppdragsinstruktion, commandGuide, status/feedback | Svenska/engelska blandas;096. Ingen stegvis tutorial eller verifierat nybörjarspeltest;109–110. |

## Browserprotokoll

Baseline granskas i Chromium i1280×720 och1920×1080: startsida, startad match, sidopanel/canvas, pause/resume och mittendrag. Screenshots är granskning, inte slutlig design. Kontrollen passerade utan page errors. Canvas börjar vid y299 i båda upplösningar: nederkant899 hamnar utanför720px-fönstret. Vid1920×1080 ryms canvas men stor oanvänd yta kvarstår. Paus/resume och mittendrag fungerar. Granskade screenshots: `/tmp/w2t-091-menu-1280.png`, `/tmp/w2t-091-game-1280.png`, `/tmp/w2t-091-game-1920.png`.

## Avgränsningar

Ingen ny gameplaykod eller balans. Befintliga IDs, state, actionhandlers, Save och originalassets återanvänds. HUD-ombyggnad/kameragester/Beginner/0.75×/tutorial/nya sprites/ljud/persistens tillhör097–120, inte091–096. Campaign i093 betyder befintliga fristående uppdrag, utan påhittad progression.
