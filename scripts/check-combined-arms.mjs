import {spawnSync} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
const r=spawnSync('npm',['test','--','src/gameplay/combinedArmsBalance.test.ts','--silent=false','--disableConsoleIntercept','--reporter=verbose'],{encoding:'utf8'});
const log=(r.stdout??'')+(r.stderr??'');await mkdir('artifacts/rts-169',{recursive:true});await writeFile('artifacts/rts-169/simulation.log',log);
const rows=log.split('\n').filter(l=>l.startsWith('W2T_BALANCE_ROW=')).map(line=>{const raw=line.slice('W2T_BALANCE_ROW='.length);return JSON.parse(raw.slice(0,raw.lastIndexOf('}')+1));});
if(rows.length!==89||r.status!==0){console.error(log.slice(-6000));process.exit(r.status||1);}
const result={method:'Deterministic .1s actual combat. Open-field land fixtures, actual-water naval fixtures; wood/gold equal weight, nearest rounded whole-unit cost. Both research1 for land/air, no research in naval. Nearest legal focus, no kiting, local fog for spells. Separate paid AI adapter tests. Not human playtest or paid full economy.',reports:rows};await writeFile('artifacts/rts-169/results.json',JSON.stringify(result,null,2));console.log(`PASS ${rows.length} reproducible combined-arms scenarios; explicit fixtures, preliminary balance, no human playtest.`);
