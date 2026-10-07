import {expect,it} from 'vitest';
import packageRaw from '../../package.json?raw';
import lockRaw from '../../package-lock.json?raw';
import {releaseVersion,changelog} from './release';
it('package, lockfile and shared product release agree while historical changelog versions remain stable',()=>{
 const packageInfo=JSON.parse(packageRaw);
 const lock=JSON.parse(lockRaw);
 expect(packageInfo.version).toBe(releaseVersion);expect(lock.version).toBe(releaseVersion);expect(lock.packages[''].version).toBe(releaseVersion);
 expect(changelog.map(entry=>entry.version)).toEqual([releaseVersion,'0.3.0','0.2.0','0.1.0']);
});
