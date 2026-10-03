import {execFileSync} from 'node:child_process';
import {defineConfig} from 'vite';
const buildId=()=>{try{return execFileSync('git',['rev-parse','--short=7','HEAD'],{encoding:'utf8'}).trim();}catch{return 'unknown';}};
/** Dev keeps its familiar root URL; preview uses the exact published project subpath. */
export default defineConfig(({command,isPreview})=>({define:{__BUILD_ID__:JSON.stringify(command==='build'?buildId():'local')},base:command==='build'||isPreview?'/warcraft-2-tribute/':'/'}));
