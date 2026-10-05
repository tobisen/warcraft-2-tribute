import type Phaser from 'phaser';
import {factionIds} from '../config/factions';
/** Original canvas icons for authorized gameplay placeholders, not final sprites. */
export function createAirIcons(textures:Phaser.Textures.TextureManager):void{
 if(textures.exists('air'))return;
 const texture=textures.createCanvas('air',640,64)!;const c=texture.context;
 for(const [i,faction] of factionIds.entries())for(const [j,team] of ['player','enemy'].entries()){
  const x=(i*2+j)*64;c.save();c.translate(x,0);c.fillStyle='#172c29';c.strokeStyle=team==='player'?'#86dbe6':'#e79584';c.lineWidth=2;
  c.beginPath();c.moveTo(32,5);c.lineTo(59,30);c.lineTo(32,52);c.lineTo(5,30);c.closePath();c.fill();c.stroke();c.fillStyle='#bfc8ba';
  if(faction==='goblins'){c.beginPath();c.ellipse(32,24,22,10,0,0,Math.PI*2);c.fill();c.fillStyle='#a77b40';c.fillRect(24,36,16,6);c.fillRect(15,23,34,3);}
  else if(faction==='dwarves'){c.fillRect(13,12,38,3);c.fillRect(30,14,4,14);c.beginPath();c.ellipse(32,30,14,8,0,0,Math.PI*2);c.fill();c.fillRect(45,27,10,3);}
  else{c.beginPath();c.moveTo(32,17);c.lineTo(7,12);c.lineTo(15,29);c.lineTo(30,32);c.lineTo(32,42);c.lineTo(36,32);c.lineTo(51,29);c.lineTo(59,12);c.closePath();c.fill();c.fillStyle='#bd974e';c.fillRect(30,19,6,15);}
  c.fillStyle='#f2d576';c.font='bold 8px monospace';c.textAlign='center';c.fillText(['GR','WR','GE','GY','AS'][i],32,49);c.fillText('TEMP',32,60);c.restore();
  texture.add(`${faction}-air-${team}-placeholder`,0,x,0,64,64);
 }texture.refresh();
}
