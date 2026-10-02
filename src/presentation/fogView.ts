import type Phaser from 'phaser';
import type { FogState,Team } from '../gameplay/fog';
/** Preview/overlay only; gameplay information must be filtered separately before normal activation. */
export function drawFog(graphics:Phaser.GameObjects.Graphics,fog:FogState,team:Team){
 graphics.clear();const layer=fog.teams[team];
 for(let row=0;row<fog.rows;row++)for(let col=0;col<fog.columns;col++){
  const i=row*fog.columns+col;if(layer.visible[i])continue;
  graphics.fillStyle(0x000000,layer.explored[i] ? .55 : 1);const x=col*fog.tileSize,y=row*fog.tileSize;
  graphics.fillRect(x,y,Math.min(fog.tileSize,fog.width-x),Math.min(fog.tileSize,fog.height-y));
 }
}
