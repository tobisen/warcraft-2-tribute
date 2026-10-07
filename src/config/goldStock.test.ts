import {it,expect} from 'vitest';
import {maps,mapResources,type MapId} from './maps';
import {goldConfig} from './gathering';
it('makes every authored and generated mine substantially larger across all map layouts',()=>{
 const starts:Record<MapId,number>={arena:3000,forest:2500,river:4000,islands:4000,frontier:3000,plains96:3000,plains128:3000,highlands:3000,coast:4000};
 const seen=new Set<string>();
 for(const id of Object.keys(maps) as MapId[]){
  expect(maps[id].gold).toBe(starts[id]);
  for(const [layout,world,design]of [[undefined,undefined,undefined],['trees',undefined,undefined],['trees','expanded',undefined],['trees','expanded','organic'],['trees','expanded','regions']] as const){
   const resources=mapResources(id,layout,world,design),gold=resources.filter(n=>n.resource==='gold');expect(gold.length).toBeGreaterThan(0);
   for(const n of gold){expect(n.amount).toBeGreaterThanOrEqual(1500);if(n.id.startsWith('organic-mine')){seen.add('organic');expect(n.amount).toBe(2500);}if(n.id.startsWith('expansion-')){seen.add('expansion');expect(n.amount).toBe(1500);}if(n.id.startsWith('region-')){seen.add('region');expect(n.amount).toBe(3000);}}
   expect(resources.filter(n=>n.resource==='wood').every(n=>n.amount<=maps[id].wood)).toBe(true);
  }
 }
 expect(seen).toEqual(new Set(['organic','expansion','region']));expect(goldConfig.initialAmount).toBe(3000);
});
