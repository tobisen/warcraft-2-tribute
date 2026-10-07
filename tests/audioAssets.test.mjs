import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {describe,it,expect} from 'vitest';
import {audioFiles} from '../src/config/audio';
const file=p=>readFileSync(new URL(`../${p}`,import.meta.url)),manifest=JSON.parse(file('public/audio/manifest.json'));
describe('local audio exports',()=>{
 it('documents masters, loop/duration/volume and local OGG plus real PCM fallback',()=>{expect(Object.keys(manifest.entries).sort()).toEqual(audioFiles.filter(n=>!n.startsWith('animal-')).sort());for(const [name,m] of Object.entries(manifest.entries)){const ogg=file('public/'+m.ogg),wav=file('public/'+m.fallback);expect(ogg.subarray(0,4).toString()).toBe('OggS');expect(wav.subarray(0,4).toString()).toBe('RIFF');expect(wav.subarray(8,12).toString()).toBe('WAVE');expect(wav.readUInt16LE(20)).toBe(1);expect(wav.readUInt16LE(22)).toBe(1);expect(wav.readUInt32LE(24)).toBe(24000);expect(wav.readUInt16LE(34)).toBe(16);expect((wav.length-44)/48000).toBeCloseTo(m.duration,4);expect(m.loop).toBe(name==='music');expect(m.volume).toBeGreaterThan(0);expect(file(m.master).equals(wav)).toBe(true);}});
 it('contains non-silent samples without clipping and documents original synthesis',()=>{for(const m of Object.values(manifest.entries)){const wav=file(m.master);let peak=0;for(let n=44;n<wav.length;n+=2)peak=Math.max(peak,Math.abs(wav.readInt16LE(n)));expect(peak).toBeGreaterThan(1000);expect(peak).toBeLessThan(32767);}expect(manifest.origin).toContain('Original');});
});

const sha=data=>createHash('sha256').update(data).digest('hex');
it('ships all315 unique voice masters with matching runtime files and derivative licenses',()=>{
 const source=JSON.parse(file('assets/sources/audio-identity/all-factions-voices.json'));
 const runtime=JSON.parse(file('public/audio/voices/manifest.json'));
 const converted=JSON.parse(file('assets/sources/audio-identity/converted-voices.json'));
 const generated=JSON.parse(file('assets/sources/audio-identity/generated-voices.json'));
 expect(runtime.entries).toEqual(source.entries);expect(runtime.entries).toHaveLength(315);
 const hashes=new Set();
 for(const entry of runtime.entries){
  const master=file('assets/'+entry.recording),wav=file('public/'+entry.recording);expect(wav.equals(master)).toBe(true);
  expect(wav.subarray(0,4).toString()).toBe('RIFF');expect(wav.readUInt16LE(22)).toBe(1);expect(wav.readUInt16LE(34)).toBe(16);
  const identity=entry.faction==='crown'?generated.entries[entry.id]:converted.entries[entry.id];
  const hash=sha(master);hashes.add(hash);expect(hash).toBe(entry.faction==='crown'?identity.sha256:identity.outputSha256);
  expect(entry.license).toBe(entry.faction==='dwarves'?'CC-BY-SA-3.0':entry.faction==='crown'?'CC0-1.0 (project-generated output); Apache-2.0 (Kokoro model)':'CC0-1.0');
  expect(entry.listeningVerified).toBe(false);expect(entry.author).toBeTruthy();expect(entry.processing).toBeTruthy();
 }
 expect(hashes.size).toBe(315);expect(file('public/audio/voices/CC-BY-SA-3.0.txt').toString()).toContain('Attribution-ShareAlike');
 expect(file('public/audio/credits.html').toString()).toContain('MaximB');
});
it('ties every material sound to licensed hashed original layers and the actual published PCM/OGG files',()=>{
 const materials=JSON.parse(file('assets/sources/audio-identity/material-effects.json'));
 expect(Object.keys(materials.entries)).toHaveLength(13);
 for(const [name,e] of Object.entries(materials.entries)){
  expect(sha(file(e.master))).toBe(e.masterSha256);expect(sha(file('public/'+manifest.entries[name].ogg))).toBe(e.oggSha256);
  expect(e.license).toBe('CC0-1.0');expect(e.peak).toBeLessThanOrEqual(.500001);
  for(const source of e.sources){expect(sha(file(source.original))).toBe(source.sha256);expect(source.author).toBeTruthy();expect(source.source).toMatch(/^https:\/\//);expect(source.license).toBe('CC0-1.0');}
 }
});
