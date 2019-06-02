import { normalize } from 'path';
const FastGlob = require('fast-glob');
const expandTidle = require('expand-tilde');
export async function getFiles(): Promise<string[]> {
  return (await FastGlob(
    `${normalize(
      expandTidle('~/source/repos/scripture_files/scriptures_unprocessed'),
    )}/**/**`,
    { onlyFiles: true },
  )) as string[];
}
