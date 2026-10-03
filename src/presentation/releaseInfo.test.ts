import {it,expect} from 'vitest';
import {releaseLabels} from './releaseInfo';
import {releaseVersion,changelog} from '../config/release';
it('keeps the product release stable across local and commit builds and rejects invalid build labels',()=>{
 for(const id of ['local','a8c42c1','unknown'])expect(releaseLabels(id)).toEqual({release:`v${releaseVersion}`,build:`Build ${id}`});
 expect(releaseLabels('<script>')).toEqual({release:`v${releaseVersion}`,build:'Build unknown'});expect(changelog[0].version).toBe(releaseVersion);
});
