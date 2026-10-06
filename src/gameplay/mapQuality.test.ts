import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {legacyEnemyFixture} from './testHelpers/legacyEnemyFixture';
import {expect,it} from 'vitest';
import {factionsForPlayer} from '../config/factions';
import {createMatch} from './match';
import {bodyFits} from './map';
import {approachRoute} from './approach';
import {findRoute} from './navigation';
import {coastalFootprint,findDomainRoute} from './terrainNavigation';
import {placementObstacles} from './placement';
import {encodeSave,decodeSave} from './save';
for(const id of ['arena','forest','river','islands'] as const)for(const faction of ['crown','clans'] as const){
 it(`${id}/${faction}: build space, resource approaches and intended travel domains survive legacy migration`,()=>{
  const m=createMatch('skirmish','normal',factionsForPlayer(faction),id);
  for(const p of [{x:544,y:416},{x:480,y:352}])expect(bodyFits(m.map,p,32)).toBe(true);
  for(const footprint of placementObstacles({...m.gathering,extraNodes:undefined}).slice(1))expect(approachRoute(m.map,m.gathering.units[0].position,footprint,24).status).not.toBe('blocked');
  if(id==='islands'){
   expect(findRoute(m.map,{x:656,y:432},{x:944,y:432},20).ok).toBe(false);
   expect(findDomainRoute(m.map,'water',{x:720,y:432},{x:880,y:432},16).ok).toBe(true);
   expect(coastalFootprint(m.map,{x:672,y:320,width:64,height:64})).toBe(true);
  }else expect(findRoute(m.map,{x:448,y:480},{x:896,y:240},20).ok).toBe(true);
  const doc=JSON.parse(encodeSave(m,{camera:{x:280,y:458},building:null}));legacyTerrainFixture(doc);doc.configVersion='tribute-config-18';legacyEnemyFixture(doc);delete doc.state.statLedger;
  const result=decodeSave(JSON.stringify(doc));expect(result.ok).toBe(true);
  if(result.ok){expect(result.match.map.obstacles).toEqual(doc.state.map.obstacles);expect(result.match.gathering.node).toEqual(doc.state.gathering.node);expect(result.match.gathering.gold).toEqual(doc.state.gathering.gold);expect(result.match.map.resourceLayout).toBeUndefined();expect(result.match.gathering.extraNodes).toBeUndefined();}
 });
}
