import {it,expect} from 'vitest';
import {createMatch} from '../gameplay/match';
import {factions,factionsForPlayer,factionIds} from '../config/factions';
import {technologyView} from './technologyView';
import {missionContent} from '../config/campaignContent';
it.each(factionIds)('%s uses faction names/recipes and complete roster, without changing gameplay state',id=>{
 const m=createMatch('skirmish','normal',factionsForPlayer(id)),before=structuredClone(m),view=technologyView(m);
 expect(view.faction).toBe(factions[id].label);expect(new Set(view.nodes.map(n=>n.id)).size).toBe(view.nodes.length);
 for(const role of factions[id].roster)expect(view.nodes.find(n=>n.id===`unit-${role}`)?.label).toBe(factions[id].unitNames[role]);
 expect(view.nodes.find(n=>n.id==='building-academy')?.dependencies).toEqual(expect.arrayContaining([factions[id].buildingNames.forge,`${factions[id].upgrades.attack.name} I`,`${factions[id].upgrades.defense.name} I`]));expect(m).toEqual(before);
});
it('distinguishes owned, affordable and missing technology, and preserves researched unlock after building loss',()=>{
 const m=createMatch(),node=(id:string)=>technologyView(m).nodes.find(n=>n.id===id)!;
 expect(node('building-base').status).toBe('unlocked');expect(node('building-barracks').status).toBe('unlocked');expect(node('unit-soldier').status).toBe('locked');
 m.gathering.wood=1000;m.gathering.goldBalance=1000;expect(node('building-barracks').status).toBe('available');
 m.placement.barracks={x:704,y:512,width:64,height:64};m.placement.construction={remainingSeconds:0,builderId:null};expect(node('unit-soldier').status).toBe('available');
 m.research!.attack=1;expect(node('research-attack-1').status).toBe('unlocked');expect(node('research-attack-2').missing).toContain('Complete Royal Academy');
 expect(node('research-attack-2').cost).toContain('80 wood + 20 gold');
});
it('shows mission restrictions for units, academy and level II research',()=>{
 const m=createMatch('tutorial');m.campaignMission='first-steps';m.campaignRun={version:1,phase:0,campaignId:'human-frontier-v1'};m.gathering.campaignContent=missionContent(m.campaignMission);
 const view=technologyView(m);for(const id of ['unit-air','building-academy','research-attack-2']){const node=view.nodes.find(n=>n.id===id)!;expect(node.status).toBe('locked');expect(node.campaign).toContain('campaign mission');}
});
