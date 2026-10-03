import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
const file=p=>readFileSync(new URL(`../${p}`,import.meta.url)),manifest=JSON.parse(file('public/audio/manifest.json'));
describe('original audio exports',()=>{
 it('documents masters, loop/duration/volume and local OGG plus real PCM fallback',()=>{expect(Object.keys(manifest.entries)).toHaveLength(11);for(const [name,m] of Object.entries(manifest.entries)){const ogg=file('public/'+m.ogg),wav=file('public/'+m.fallback);expect(ogg.subarray(0,4).toString()).toBe('OggS');expect(wav.subarray(0,4).toString()).toBe('RIFF');expect(wav.subarray(8,12).toString()).toBe('WAVE');expect(wav.readUInt16LE(20)).toBe(1);expect(wav.readUInt16LE(22)).toBe(1);expect(wav.readUInt32LE(24)).toBe(24000);expect(wav.readUInt16LE(34)).toBe(16);expect((wav.length-44)/48000).toBeCloseTo(m.duration,4);expect(m.loop).toBe(name==='music');expect(m.volume).toBeGreaterThan(0);expect(file(m.master)).toEqual(wav);}});
 it('contains non-silent samples without clipping and documents original synthesis',()=>{for(const m of Object.values(manifest.entries)){const wav=file(m.master);let peak=0;for(let n=44;n<wav.length;n+=2)peak=Math.max(peak,Math.abs(wav.readInt16LE(n)));expect(peak).toBeGreaterThan(1000);expect(peak).toBeLessThan(32767);}expect(manifest.origin).toContain('Original');});
});
