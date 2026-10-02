import {defineConfig} from 'vite';
/** Dev keeps its familiar root URL; preview uses the exact published project subpath. */
export default defineConfig(({command,isPreview})=>({base:command==='build'||isPreview?'/warcraft-2-tribute/':'/'}));
