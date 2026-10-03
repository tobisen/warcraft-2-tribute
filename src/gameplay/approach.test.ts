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
for(const [index,c] of cases.entries())it('preserves pre-optimization approach route '+index,()=>{const target={x:500,y:200,width:64,height:64};const map={width:800,height:600,tileSize:32,revision:0,bodyHalf:c.half,obstacles:[target,...c.extra]};expect(approachRoute(map,c.position,target,32)).toEqual(c.route);});

for(const [index,c] of cases.entries())it('connectivity witness matches full route reachability '+index,()=>{const target={x:500,y:200,width:64,height:64},map={width:800,height:600,tileSize:32,revision:0,bodyHalf:c.half,obstacles:[target,...c.extra]};expect(canReachFootprint(map,c.position,target,32)).toBe(c.route.status!=='blocked');});
