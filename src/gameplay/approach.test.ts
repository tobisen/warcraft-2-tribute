import {segmentFits} from './navigation';
import {expect,it} from 'vitest';
import {approachRoute,canReachFootprint} from './approach';
// Golden routes captured from RTS-064 before the measured optimization.
const cases=[
  {
    "position": {
      "x": 400,
      "y": 232
    },
    "extra": [],
    "half": 12,
    "route": {
      "commandNumber": 1,
      "destination": {
        "x": 488,
        "y": 232
      },
      "waypoints": [
        {
          "x": 488,
          "y": 232
        }
      ],
      "revision": 0,
      "status": "moving"
    }
  },
  {
    "position": {
      "x": 532,
      "y": 100
    },
    "extra": [],
    "half": 12,
    "route": {
      "commandNumber": 1,
      "destination": {
        "x": 528,
        "y": 176
      },
      "waypoints": [
        {
          "x": 528,
          "y": 176
        }
      ],
      "revision": 0,
      "status": "moving"
    }
  },
  {
    "position": {
      "x": 400,
      "y": 100
    },
    "extra": [
      {
        "x": 440,
        "y": 0,
        "width": 32,
        "height": 300
      }
    ],
    "half": 12,
    "route": {
      "commandNumber": 1,
      "destination": {
        "x": 532,
        "y": 276
      },
      "waypoints": [
        {
          "x": 400,
          "y": 144
        },
        {
          "x": 400,
          "y": 176
        },
        {
          "x": 400,
          "y": 208
        },
        {
          "x": 400,
          "y": 240
        },
        {
          "x": 400,
          "y": 272
        },
        {
          "x": 400,
          "y": 304
        },
        {
          "x": 400,
          "y": 336
        },
        {
          "x": 432,
          "y": 336
        },
        {
          "x": 464,
          "y": 336
        },
        {
          "x": 496,
          "y": 336
        },
        {
          "x": 496,
          "y": 304
        },
        {
          "x": 532,
          "y": 276
        }
      ],
      "revision": 0,
      "status": "moving"
    }
  },
  {
    "position": {
      "x": 400,
      "y": 300
    },
    "extra": [
      {
        "x": 440,
        "y": 160,
        "width": 32,
        "height": 300
      }
    ],
    "half": 12,
    "route": {
      "commandNumber": 1,
      "destination": {
        "x": 496,
        "y": 176
      },
      "waypoints": [
        {
          "x": 400,
          "y": 272
        },
        {
          "x": 400,
          "y": 240
        },
        {
          "x": 400,
          "y": 208
        },
        {
          "x": 400,
          "y": 176
        },
        {
          "x": 400,
          "y": 144
        },
        {
          "x": 432,
          "y": 144
        },
        {
          "x": 464,
          "y": 144
        },
        {
          "x": 496,
          "y": 144
        },
        {
          "x": 496,
          "y": 176
        }
      ],
      "revision": 0,
      "status": "moving"
    }
  },
  {
    "position": {
      "x": 400,
      "y": 232
    },
    "extra": [],
    "half": 20,
    "route": {
      "commandNumber": 1,
      "destination": {
        "x": 480,
        "y": 232
      },
      "waypoints": [
        {
          "x": 480,
          "y": 232
        }
      ],
      "revision": 0,
      "status": "moving"
    }
  },
  {
    "position": {
      "x": 532,
      "y": 232
    },
    "extra": [],
    "half": 12,
    "route": {
      "commandNumber": 1,
      "destination": {
        "x": 532,
        "y": 232
      },
      "waypoints": [],
      "revision": 0,
      "status": "blocked",
      "error": "unreachable"
    }
  }
];
for(const [index,c] of cases.entries())it('preserves approach contact and clearance with shortened route '+index,()=>{const target={x:500,y:200,width:64,height:64};const map={width:800,height:600,tileSize:32,revision:0,bodyHalf:c.half,obstacles:[target,...c.extra]};const route=approachRoute(map,c.position,target,32);expect({...route,waypoints:[]}).toEqual({...c.route,waypoints:[]});expect(route.waypoints.length).toBeLessThanOrEqual(c.route.waypoints.length);let previous=c.position;for(const p of route.waypoints){expect(segmentFits(map,previous,p,c.half)).toBe(true);previous=p;}if(route.status==='moving')expect(previous).toEqual(c.route.destination);});

for(const [index,c] of cases.entries())it('connectivity witness matches full route reachability '+index,()=>{const target={x:500,y:200,width:64,height:64},map={width:800,height:600,tileSize:32,revision:0,bodyHalf:c.half,obstacles:[target,...c.extra]};expect(canReachFootprint(map,c.position,target,32)).toBe(c.route.status!=='blocked');});

it('cached contacts match fresh geometry across sizes, range, occlusion, targets and terrain revisions',()=>{
 const target={x:256,y:224,width:64,height:64};
 const map={width:640,height:512,tileSize:32,revision:0,bodyHalf:12,obstacles:[target,{x:224,y:192,width:32,height:160}]};
 const variants=[map,{...map,bodyHalf:20},{...map,ignoreAttackOcclusion:true},{...map,interactionTarget:map.obstacles[1]},{...map,width:512,height:400}];
 for(const variant of variants)for(const range of [16,24,48])for(const goal of [target,{...target,x:320}])for(const position of [{x:128,y:128},{x:384,y:320}]){
  const fresh={...variant,obstacles:variant.obstacles.map(o=>({...o}))};
  expect(approachRoute(variant,position,goal,range)).toEqual(approachRoute(fresh,position,goal,range));
 }
 map.obstacles.push({x:192,y:0,width:32,height:512});
 expect(approachRoute(map,{x:128,y:128},target,24)).toEqual(approachRoute({...map,obstacles:[...map.obstacles]},{x:128,y:128},target,24));
 map.obstacles[2].height=64;map.revision++;
 expect(approachRoute(map,{x:128,y:128},target,24)).toEqual(approachRoute({...map,obstacles:[...map.obstacles]},{x:128,y:128},target,24));
});
