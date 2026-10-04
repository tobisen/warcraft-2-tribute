/** Original 32px atlas icons; labels stay native accessible button text. */
export function applySkin():void{
 const icons:Record<string,number>={'repair-building':4,'build-wall':4,'build-gate':4,'toggle-gate':5,'build-tower':4,'upgrade-tower':4,'upgrade-base':4,'train-worker':2,'train-soldier':3,'train-specialist':3,'train-archer':6,'train-catapult':7,'build-barracks':4,'build-farm':0,'build-forge':4,'research-attack':3,'research-defense':5,'attack-move':3,'stop-units':5,'dismiss-units':5,'unit-ability':3,'build-harbor':4,'train-transport':2,'train-ship':7,'unload-transport':2};
 for(const [id,index] of Object.entries(icons)){const button=document.getElementById(id)!;button.dataset.icon=String(index);button.style.setProperty('--icon-position',`${-index*32}px 0`);}
}
