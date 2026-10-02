import { describe, expect, it } from 'vitest';
import { createMap, replaceObstacles, bodyFits, type WorldMap } from './map';
import { createMatch, updateMatch } from './match';
import { advanceRoute, commandMappedMove, findRoute, planRoute, segmentFits } from './navigation';

const open = (): WorldMap => ({...createMap(),width:800,height:600,obstacles:[]});
describe('bounded navigation', () => {
  it('finds a deterministic route around a wall with body-safe segments', () => {
    const map=replaceObstacles(open(),[{x:160,y:64,width:32,height:128}]);
    const a={x:100,y:100},b={x:300,y:100};
    expect(segmentFits(map,a,b)).toBe(false);
    const result=findRoute(map,a,b);expect(result.ok).toBe(true);
    expect(findRoute(map,a,b)).toEqual(result);
    if(!result.ok)throw new Error('missing route');
    let previous=a;
    for(const waypoint of result.waypoints){expect(segmentFits(map,previous,waypoint)).toBe(true);previous=waypoint;}
    expect(previous).toEqual(b);
  });
  it('rejects blocked, outside and unreachable targets without fallback', () => {
    const map=replaceObstacles(open(),[{x:160,y:0,width:32,height:600}]);
    expect(findRoute(map,{x:100,y:100},{x:170,y:100})).toEqual({ok:false,error:'blocked-target'});
    expect(findRoute(map,{x:100,y:100},{x:800,y:100})).toEqual({ok:false,error:'outside-world'});
    expect(findRoute(map,{x:100,y:100},{x:300,y:100})).toEqual({ok:false,error:'unreachable'});
    expect(findRoute(map,{x:2,y:2},{x:100,y:100})).toEqual({ok:false,error:'blocked-start'});
  });
  it('prevents body corner cutting and handles clipped world edge/same tile', () => {
    const map=replaceObstacles(open(),[{x:64,y:32,width:32,height:32},{x:32,y:64,width:32,height:32}]);
    expect(segmentFits(map,{x:48,y:48},{x:80,y:80})).toBe(false);
    expect(findRoute(map,{x:16,y:588},{x:48,y:588}).ok).toBe(true);
    expect(findRoute(map,{x:12,y:12},{x:12,y:12})).toEqual({ok:true,waypoints:[]});
    const result=findRoute(map,{x:12,y:12},{x:20,y:20});expect(result.ok).toBe(true);
  });
  it('consumes remainder over waypoints consistently without overshoot', () => {
    const map=open(),start={x:100,y:100},goal={x:300,y:300};
    const route=planRoute(map,start,goal);
    const large=advanceRoute(map,start,route,160,5);
    let small={position:start,route,remaining:0};
    for(let i=0;i<100;i++)small=advanceRoute(map,small.position,small.route,160,.05);
    expect(large.position).toEqual(goal);expect(small.position).toEqual(goal);
    expect(large.route.status).toBe('arrived');
    expect(advanceRoute(map,start,route,160,0).position).toEqual(start);
  });
  it('revision replans from the current position or stops safely with no per-frame retry', () => {
    const map=open(),start={x:100,y:100},goal={x:400,y:100};
    const moving=advanceRoute(map,start,planRoute(map,start,goal,9),160,.1);
    const detour=replaceObstacles(map,[{x:192,y:64,width:32,height:128}]);
    const revised=advanceRoute(detour,moving.position,moving.route,160,5);
    expect(revised.position).toEqual(goal);expect(revised.route.commandNumber).toBe(9);
    const wall=replaceObstacles(detour,[{x:192,y:0,width:32,height:600}]);
    const stopped=advanceRoute(wall,moving.position,moving.route,160,5);
    expect(stopped.route.error).toBe('unreachable');expect(stopped.position).toEqual(moving.position);
    expect(bodyFits(wall,stopped.position,12)).toBe(true);
    expect(advanceRoute(wall,stopped.position,stopped.route,160,10).route).toBe(stopped.route);
  });
  it('new commands replace routes, preserve cargo/selection and ignore unselected units', () => {
    let state=createMatch();state.gathering.units[0].selected=true;state.gathering.units[0].cargo=4;
    const untouched=state.gathering.units[1];
    state.gathering.units=commandMappedMove(state.gathering.units,{x:300,y:250},state.map);
    expect(state.gathering.units[1]).toBe(untouched);
    state.gathering.units=commandMappedMove(state.gathering.units,{x:600,y:300},state.map);
    expect(state.gathering.units[0].navigation?.commandNumber).toBe(2);
    state=updateMatch(state,5);
    expect(state.gathering.units[0].position).toEqual({x:600,y:300});
    expect(state.gathering.units[0].cargo).toBe(4);expect(state.gathering.units[0].selected).toBe(true);
    state.gathering.units=commandMappedMove(state.gathering.units,{x:120,y:120},state.map);
    expect(state.gathering.units[0].navigation?.error).toBe('blocked-target');
    const position=state.gathering.units[0].position;state=updateMatch(state,1);
    expect(state.gathering.units[0].position).toEqual(position);
  });
  it('validates every crossed segment when a transient target blocks a later waypoint', () => {
    const map=open();
    const route={commandNumber:1,destination:{x:240,y:100},revision:0,status:'moving' as const,
      waypoints:[{x:120,y:100},{x:240,y:100}]};
    const transient={...map,obstacles:[{x:180,y:80,width:24,height:40}]};
    const result=advanceRoute(transient,{x:100,y:100},route,160,1);
    expect(result.position).toEqual({x:120,y:100});expect(result.route.status).toBe('blocked');
    expect(bodyFits(transient,result.position,12)).toBe(true);
  });

});
