import {readdirSync,readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
function tests(dir){return readdirSync(resolve(root,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?tests(`${dir}/${e.name}`):/\.(test|spec)\.[cm]?[jt]sx?$/.test(e.name)?[`${dir}/${e.name}`]:[]);}
const all=[...tests('src'),...tests('tests')].sort(),integration=JSON.parse(readFileSync(new URL('./test-integration-files.json',import.meta.url),'utf8'));
if(new Set(integration).size!==integration.length||integration.some(f=>!all.includes(f)))throw Error('Integration manifest has duplicate or missing files');
const unit=all.filter(f=>!integration.includes(f));
if(process.argv.includes('--list')){console.log(JSON.stringify({unit,integration},null,2));process.exit(0);}
if(!unit.length)throw Error('No unit tests selected');
console.log(`Unit suite: ${unit.length} files; ${integration.length} explicitly classified integration files run via npm test or targeted commands.`);
const result=spawnSync(process.execPath,[resolve(root,'node_modules/vitest/vitest.mjs'),'run',...unit,...process.argv.slice(2)],{cwd:root,stdio:'inherit'});
if(result.error)throw result.error;
process.exit(result.status??1);
