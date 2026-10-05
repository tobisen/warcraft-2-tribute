import {readFileSync} from 'node:fs';
import {expect,it} from 'vitest';
import {factionIds} from '../src/config/factions';
import {actionIds} from '../src/presentation/actionPanel';
import {actionIcon} from '../src/presentation/actionIcons';
it.each(factionIds)('%s has distinct valid sprite or command references for every action',faction=>{
 const icons=actionIds.map(id=>actionIcon(id,faction));expect(new Set(icons.map(i=>JSON.stringify(i))).size).toBe(actionIds.length);
 for(const icon of icons){if(icon.atlas==='air'){expect(icon.frame).toBe(`${faction}-air-player-placeholder`);continue;}if(icon.atlas){const atlas=JSON.parse(readFileSync(new URL(`../public/assets/${icon.atlas}-atlas.json`,import.meta.url),'utf8'));expect(atlas.frames[icon.frame],`${faction}: ${icon.frame}`).toBeDefined();}else expect(icon.glyph).toBeTruthy();}
});
