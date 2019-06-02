import { normalize } from 'path';
import { pathExists, mkdir } from 'fs-extra';
import expandTilde = require('expand-tilde');
export async function makeOutputDir(): Promise<void> {
  if (
    !(await pathExists(
      normalize(expandTilde('~/source/repos/scripture_files/scriptures/')),
    ))
  ) {
    await mkdir(
      normalize(expandTilde('~/source/repos/scripture_files/scriptures/')),
    );
  }
}
