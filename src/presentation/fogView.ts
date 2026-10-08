import {forEachFogRun} from './fogRuns';
import type Phaser from 'phaser';
import type { FogState,Team } from '../gameplay/fog';
/** Preview/overlay only; gameplay information must be filtered separately before normal activation. */
export function drawFog(graphics:Phaser.GameObjects.Graphics,fog:FogState,team:Team){
 graphics.clear();
 forEachFogRun(fog,team,(x,y,width,height,alpha)=>{graphics.fillStyle(0x000000,alpha);graphics.fillRect(x,y,width,height);});
}
