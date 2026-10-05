import {terrainPatches} from './map';
import {expect,it} from 'vitest';
import {maps,type MapId} from '../config/maps';
import {createMap,replaceObstacles} from './map';
import {segmentFits} from './navigation';
import {createMatch} from './match';
import {encodeSave,decodeSave} from './save';
import {domainMap,domainBodyFits,findDomainRoute,planDomainRoute,advanceDomainRoute,coastalFootprint} from './terrainNavigation';
const view={camera:{x:0,y:0},building:null};
it('land and water are exclusive domains, including exact size and bounds',()=>{
 const map=createMap();expect(domainMap(map,'land')).toBe(map);
 expect(domainBodyFits(map,'water',{x:1152,y:336},48)).toBe(true);expect(domainBodyFits(map,'water',{x:1152,y:336},49)).toBe(false);
 expect(domainBodyFits(map,'land',{x:1152,y:336},12)).toBe(false);expect(domainBodyFits(map,'water',{x:400,y:450},12)).toBe(false);
 expect(domainBodyFits(map,'water',{x:0,y:0},12)).toBe(false);expect(domainBodyFits(map,'water',{x:1152,y:336},-1)).toBe(false);
});
it('routes and swept segments stay inside connected water and cannot cross land to another pond',()=>{
 const map=createMap(),start={x:1120,y:320},end={x:1180,y:350};expect(findDomainRoute(map,'water',start,end,12).ok).toBe(true);
 expect(segmentFits({...domainMap(map,'water'),bodyHalf:12},start,end)).toBe(true);
 expect(findDomainRoute(map,'water',start,{x:128,y:480},12)).toEqual({ok:false,error:'unreachable'});
 expect(findDomainRoute(map,'water',start,{x:1060,y:320},12)).toEqual({ok:false,error:'blocked-target'});
 expect(findDomainRoute(map,'land',start,end,12)).toEqual({ok:false,error:'blocked-target'});
});
it('water orders arrive exactly, conserve timestep and replan around changed physical obstacles',()=>{
 const map=createMap(),start={x:1104,y:320},end={x:1180,y:350};const route=planDomainRoute(map,'water',start,end,12,7);
 const once=advanceDomainRoute(map,'water',start,route,12,60,1);let point=start,current=route;
 for(let i=0;i<10;i++){const step=advanceDomainRoute(map,'water',point,current,12,60,.1);point=step.position;current=step.route;}
 expect(point.x).toBeCloseTo(once.position.x);expect(point.y).toBeCloseTo(once.position.y);
 const arrived=advanceDomainRoute(map,'water',start,route,12,60,100);expect(arrived.position).toEqual(end);expect(arrived.route.status).toBe('arrived');expect(arrived.route.commandNumber).toBe(7);
 const changed=replaceObstacles(map,[...map.obstacles,{x:1120,y:288,width:32,height:96}]);const blocked=advanceDomainRoute(changed,'water',start,route,12,60,100);expect(blocked.position).toEqual(start);expect(blocked.route.status).toBe('blocked');expect(blocked.route.revision).toBe(changed.revision);
});
it('coast requires positive land and water area and rejects rocks, buildings and outside world',()=>{
 const map=createMap(),rect={x:1056,y:320,width:64,height:64};expect(coastalFootprint(map,rect)).toBe(true);
 for(const bad of [{x:1024,y:320,width:64,height:64},{x:1088,y:320,width:64,height:64},{x:1250,y:320,width:64,height:64},{x:80,y:80,width:64,height:64},{...rect,width:0},{...rect,x:NaN}])expect(coastalFootprint(map,bad)).toBe(false);
 expect(coastalFootprint(replaceObstacles(map,[...map.obstacles,{x:1056,y:320,width:32,height:32}]),rect)).toBe(false);
});
for(const id of Object.keys(maps) as MapId[])it(`${id} reconstructs water routes after Save/load/reset without persistent adapters`,()=>{
 const match=createMatch('skirmish','normal',undefined,id),patch=terrainPatches(match.map).find(p=>p.kind==='water')!;
 const start={x:patch.column*32+16,y:patch.row*32+16},end={x:(patch.column+patch.columns)*32-16,y:(patch.row+patch.rows)*32-16};
 const expected=findDomainRoute(match.map,'water',start,end,12);expect(expected.ok).toBe(true);
 const json=encodeSave(match,view);expect(JSON.parse(json).state.map).toEqual(match.map);const loaded=decodeSave(json);expect(loaded.ok).toBe(true);if(!loaded.ok)return;
 expect(findDomainRoute(loaded.match.map,'water',start,end,12)).toEqual(expected);expect(findDomainRoute(createMatch('skirmish','normal',undefined,id).map,'water',start,end,12)).toEqual(expected);
});
it('adjacent water patches share a traversable seam for the whole body',()=>{
 const original=maps.arena.terrain;
 try{
  maps.arena.terrain=[...original.filter(p=>!(p.kind==='water'&&p.column===34)),{column:34,row:9,columns:2,rows:3,kind:'water'},{column:36,row:9,columns:2,rows:3,kind:'water'}];
  const map=createMap();expect(domainBodyFits(map,'water',{x:1152,y:336},24)).toBe(true);expect(findDomainRoute(map,'water',{x:1120,y:336},{x:1184,y:336},24).ok).toBe(true);
 }finally{maps.arena.terrain=original;}
});
