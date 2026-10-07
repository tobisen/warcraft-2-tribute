import {expect,it} from 'vitest';
import {createMatch} from '../gameplay/match';
import {selectionInfo} from './selectionInfo';
import {createNavy} from '../gameplay/navy';
import {factions,factionsForPlayer} from '../config/factions';
it('clears old data on empty selection and ignores enemy state',()=>{const m=createMatch();expect(selectionInfo(m,null)).toMatchObject({name:'No selection',hp:null,portrait:null,stats:[]});m.combat.enemies.push({id:'secret',kind:'unit',hp:100,position:{x:0,y:0}});expect(selectionInfo(m,null).hp).toBeNull();});
it('shows live worker HP and cargo with faction name and baseline stats',()=>{const m=createMatch('survival','normal',factionsForPlayer('clans'));const u=m.gathering.units[0];u.selected=true;u.hp=12;u.cargo=3;expect(selectionInfo(m,null)).toMatchObject({name:'Peon',hp:12,maxHP:35,portrait:{atlas:'units',frame:'clans-worker-player-s-idle-0'}});expect(selectionInfo(m,null).stats).toContain('Cargo 3.0 / 5 wood');u.selected=false;expect(selectionInfo(m,null).name).toBe('No selection');});
it.each(['soldier','archer','catapult'] as const)('reads %s recipe instead of generic soldier stats',role=>{const m=createMatch('survival','normal',factionsForPlayer('clans')),data=factions.clans.units[role];m.gathering.units=[{kind:'soldier',...(role==='soldier'?{}:{archetype:role}),id:'combat-1',selected:true,hp:data.hp-2,cargo:0,position:{x:0,y:0},target:{x:0,y:0},order:{kind:'idle'}}];const info=selectionInfo(m,null);expect(info.name).toBe(factions.clans.unitNames[role]);expect(info.maxHP).toBe(data.hp);expect(info.stats).toContain(`Speed ${data.speed} px/s`);expect(info.portrait?.frame).toContain(`clans-${role}-`);});
it('summarizes groups, then updates to building HP and clears destroyed buildings',()=>{const m=createMatch();m.gathering.units[0].selected=true;m.gathering.units[1].selected=true;expect(selectionInfo(m,null)).toMatchObject({name:'2 units selected',hp:60,maxHP:60,portrait:null});m.gathering.units.forEach(u=>u.selected=false);m.combat.baseHP=150;expect(selectionInfo(m,'base')).toMatchObject({name:'Keep',hp:150,maxHP:240,portrait:{atlas:'buildings',frame:'base-player-complete'}});expect(selectionInfo(m,'barracks').name).toBe('No selection');m.placement.barracks={x:700,y:300,width:64,height:64};m.placement.barracksHP=90;m.placement.construction={remainingSeconds:4,builderId:null};expect(selectionInfo(m,'barracks')).toMatchObject({hp:90,maxHP:120,detail:'Construction 4.0s remaining',portrait:{frame:'barracks-player-foundation'}});m.combat.baseHP=0;expect(selectionInfo(m,'base').name).toBe('No selection');});
it.each(['transport','warship'] as const)('shows %s portrait/HP and transport passenger capacity',role=>{const m=createMatch();m.navy=createNavy();m.navy.ships.push({id:'ship-1',kind:'ship',role,owner:'player',selected:true,hp:40,passengers:[],position:{x:0,y:0},target:{x:0,y:0},order:{kind:'idle'}});const info=selectionInfo(m,null);expect(info).toMatchObject({name:role==='transport'?'Transport':'Cutter',hp:40,maxHP:90,portrait:{atlas:'naval',frame:`${role}-player-s-idle-0`}});expect(info.stats).toContain(role==='transport'?'Passengers 0 / 4':'Damage 16/hit');m.navy.ships[0].selected=false;m.navy.harbor={owner:'player',hp:80,footprint:{x:0,y:0,width:64,height:64},construction:{remainingSeconds:0,builderId:null}};expect(selectionInfo(m,'harbor')).toMatchObject({name:'Harbor',hp:80,maxHP:160});});

it.each(['crown','clans'] as const)('reflects actual %s base damage in the selected portrait',faction=>{
 const m=createMatch('survival','normal',factionsForPlayer(faction));m.combat.baseHP=factions[faction].buildings.base.hp/2;
 expect(selectionInfo(m,'base').portrait?.frame).toBe(`${faction==='clans'?'clans-':''}base-player-damaged`);
 m.combat.baseHP=factions[faction].buildings.base.hp/2+1;expect(selectionInfo(m,'base').portrait?.frame).toBe(`${faction==='clans'?'clans-':''}base-player-complete`);
});

it.each(['crown','clans','elves','dwarves','goblins'] as const)('uses human names/counts, retains HP/order and never exposes unit IDs for %s',faction=>{
 const m=createMatch('survival','normal',factionsForPlayer(faction));const worker=m.gathering.units[0];worker.selected=true;worker.id='unit-17';worker.hp=12;worker.cargo=2;const original=structuredClone(m);
 const solo=selectionInfo(m,null);expect(solo.name).toBe(factions[faction].unitNames.worker);expect([solo.name,solo.detail,...solo.stats].join(' ')).not.toContain('unit-17');expect(solo.stats).toContain('Order: idle');expect(solo.hp).toBe(12);
 m.gathering.units[1].selected=true;m.gathering.units.push({id:'unit-99',kind:'soldier',selected:true,hp:20,cargo:0,position:{x:300,y:300},target:{x:300,y:300},order:{kind:'move'}});
 const group=selectionInfo(m,null);expect(group.detail).toContain(factions[faction].unitNames.worker+' ×2');expect(group.detail).toContain(factions[faction].unitNames.soldier+' ×1');expect(group.name).toBe('3 units selected');expect(group.stats).toContain('Order: move');expect(group.detail).not.toMatch(/unit-\d/);expect(group.hp).toBe(12+(m.gathering.units[1].hp??factions[faction].units.worker.hp)+20);
 expect(worker.id).toBe(original.gathering.units[0].id);expect(worker.order).toEqual(original.gathering.units[0].order);
});

it('explains idle after the last wood target is depleted without adding saved worker state',()=>{
 const m=createMatch(),u=m.gathering.units[0];u.selected=true;u.target={...m.gathering.node.position};m.gathering.node.remaining=0;
 expect(selectionInfo(m,null).detail).toContain('Order: idle · Last tree depleted; choose a new resource.');u.target={...u.position};expect(selectionInfo(m,null).detail).toBe('Order: idle');
});
