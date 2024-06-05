import { readdirSync } from 'fs';
import { dirname, resolve } from 'path';

export const findPackageRoot = () => {
  let path = resolve();
  let isRoot = false;
  while (!isRoot) {
    const dir = readdirSync(path);
    isRoot = dir.includes('package.json');
    if (isRoot) return path;
    const newpath = dirname(path);
    if (newpath === path) throw new Error('can\'t find package.json root dir');
    path = newpath;
  }
};
export const __rootdir = findPackageRoot();