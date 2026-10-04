/** Authored, finite mission entities; starting guards are not paid AI production. */
export const operationConfig={
 'mission-escort':{kind:'escort',zone:{x:1504,y:544},radius:64,courier:{id:'unit-4',name:'Ridge Courier',position:{x:496,y:480}},guards:[{id:'enemy-1',name:'Pass Guard',position:{x:1184,y:544}},{id:'enemy-2',name:'Ridge Guard',position:{x:1456,y:544}}]},
 'mission-rescue':{kind:'rescue',zone:{x:1088,y:640},radius:64,guards:[{id:'enemy-1',name:'Camp Guard West',position:{x:1056,y:608}},{id:'enemy-2',name:'Camp Guard East',position:{x:1120,y:640}}]},
 'mission-capture':{kind:'capture',zone:{x:1600,y:384},radius:64,holdSeconds:30,guards:[{id:'enemy-1',name:'Banner Guard West',position:{x:1568,y:384}},{id:'enemy-2',name:'Banner Guard East',position:{x:1632,y:416}}]},
} as const;
export function operationFor(scenario:unknown){return typeof scenario==='string'&&Object.hasOwn(operationConfig,scenario)?operationConfig[scenario as keyof typeof operationConfig]:undefined;}
