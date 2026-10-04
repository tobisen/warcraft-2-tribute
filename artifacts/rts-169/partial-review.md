# RTS-169: avgränsad inventering, inte färdig balansverifiering

2026-10-05. Ingen RTS-169-statändring eller färdigmarkering. Luftroster,
luftassets och anti-air-beslut saknas enligt
[RTS-168-inventeringen](../../assets/sources/air-168.md). Hela169 kan därför
inte bedömas. Nedanstående är kod-/datareview av fungerande land/sjö/magi,
inte mänskligt helmatchspeltest eller ett komplett counterexperiment.

## Befintliga specialistprofiler

Källa src/config/factions.ts och mana.ts. Kostnad wood/gold, tider gameplay-s.

| Ras | Kostnad / tid / supply | HP / speed | Basattack / range | Magins begränsning |
| --- | --- | --- | --- | --- |
| Humans |30/15 /8s /2|100 /130|14DPS /32|support; Heal25/Ward0.75/Hex0.75; max100, initial60, regen1/s|
| Orcs |26/12 /7s /2|80 /175|24DPS /32|War Cry1.3/Intimidate0.7; max80, initial40, regen1/s|
| Elves |30/20 /8s /2|50 /170|16 per1s /200|Renew30/Wither0.65; max120, initial60, regen1.25/s|
| Dwarves |45/20 /10s /2|140 /100|14DPS /32|Mend20/Rune Shield0.6; max100, initial50, regen0.8/s|
| Goblins |25/25 /7s /2|35 /170|20 per1.5s /128, splash32|Overclock1.4 attack OCH1.2 inkommande/Corrode1.25; max80, initial40, regen1/s|

Ground melee/ranged behåller billigare1supply-profiler; specialister2supply
ersätter inte pris, träningstid eller alla range/HP/fart-egenskaper. Siege
behåller splash/byggnadscounter och lång range208–256. Nuvarande spells har
endast markstridsmål, alltså inte fartyg eller byggnader. Heal cappar max HP;
kanaler stackar inte. Rune Shield/Overclock kombineras dock med befintlig
E/research, vilket behöver ingå i169:s kommande kombinerade stridsbudget.

Spellkostnad/regen ger långsiktig manabegränsning utöver cooldown: t.ex.
Human Ward25mana/1regen kräver25s återgenerering mot8s cooldown; Dwarf Rune
30/0.8 kräver37.5s mot12s cooldown. Detta är en beräkning, inte playtest.

## Sjö och försvar

Harbor låser fartyg till kust/vatten och befintlig navigation/fog. Gemensam
warship attack16/1.5s, range192, supply2; Human Cutter40/15,8s,90HP/110speed,
Orc War Barge40/15,8s,100HP/105speed, Elf Swift Sail45/15,8s,80HP/125speed,
Dwarf Ironclad50/15,10s,120HP/85speed och Goblin Powder Boat35/20,6s,
65HP/135speed. Transporter har ingen attack,4passagerare och2supply; samma
fraktions-HP/fart som warship, med separata befintliga kostnader/tider.

RTS-164:s riktade historiska belägg: alla fem siege-profiler outrangar
tier2-torn192 och besegrar det med tre kontinuerliga repairers; siege1.5×
endast mot tower/wall/gate. Detta återanvänds som historiskt belägg, inte
som en ny169-simulering. Försvarsbalans ändras inte här.

## Nya verifieringsbelägg inom165–167

- Betald specialistproduktion/prerequisites/mana för fem raser i165.
- Heal/buff/debuff ändrar verklig strid, expiry och Save i166/167.
- AI kan använda fraktionsspells med samma fog/range/mana/cooldownregler.
- Riktade95 tester/6filer inkluderade befintliga factionBalance-genomspelningar
  och enemyFactions/AI; PASS. Dessa bots är inte ett mänskligt speltest och
  använder ingen ännu saknad flygare eller anti-air.
- Native800/1280 browser för alla fem loadouts: aktiva effekter/AI/Save/Load/
  restart. Detta är magiverifiering, inte full balans för fyra vapenslag.

## Återstår innan169 kan vara Done

RTS-168:s flygproduktion, navigation, attacker/anti-air, fog, AI och Save samt
riktad luftvisuell review. Därefter stridsscenarier för ground/sea/air/magic,
kombinerad buff+E+research, ekonomi/supply och counters; konkreta statsändringar
ska motiveras av dessa resultat. Ingen tidigare statistik återimplementeras
eller ändras spekulativt medan luftdelen saknas.
