import {readFileSync} from 'node:fs';
import {expect,it} from 'vitest';
const read=path=>readFileSync(new URL('../'+path,import.meta.url));
it('each original animal call has a valid non-silent, unclipped PCM master and identical local runtime file',()=>{
 const manifest=JSON.parse(read('public/audio/wildlife-manifest.json'));expect(manifest.origin).toContain('Original');expect(Object.keys(manifest.entries)).toEqual(['deer','rabbit','fox']);const clips=[];
 for(const clip of Object.values(manifest.entries)){const wav=read('public/'+clip.file);expect(wav.subarray(0,4).toString()).toBe('RIFF');expect(wav.subarray(8,12).toString()).toBe('WAVE');expect(wav.readUInt16LE(20)).toBe(1);expect(wav.readUInt16LE(22)).toBe(1);expect(wav.readUInt32LE(24)).toBe(24000);expect(wav.readUInt16LE(34)).toBe(16);expect((wav.length-44)/48000).toBeCloseTo(clip.duration,5);expect(read(clip.master)).toEqual(wav);let peak=0;for(let i=44;i<wav.length;i+=2)peak=Math.max(peak,Math.abs(wav.readInt16LE(i)));expect(peak).toBeGreaterThan(600);expect(peak).toBeLessThan(32767);clips.push(wav.toString('base64'));}expect(new Set(clips).size).toBe(3);
});
