import {createMatch} from '../match';
/** Explicit historical geometry for component tests with original coordinate fixtures. */
export function createClassicMatch(...args:Parameters<typeof createMatch>){return createMatch(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],'classic');}
