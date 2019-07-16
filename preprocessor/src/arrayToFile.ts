import { writeFile, pathExists, mkdirp } from 'fs-extra';
import { normalize } from 'path';
export function sliceArray<T>(array: T[], chunkSizes: number): T[][] {
  const newArray: T[][] = [];
  let x = 0;
  while (x < array.length) {
    newArray.push(array.slice(x, x + chunkSizes));
    x = x + chunkSizes;
  }
  return newArray;
}

export async function arrayToFile<T>(
  array: T[],
  fileName: string,
): Promise<void> {
  if (array.length > 0) {
    let c = 0;
    if (!(await pathExists(normalize(`../scripture_files/output`)))) {
      await mkdirp(normalize(`../scripture_files/output`));
    }
    sliceArray(array, 10).map(
      async (s): Promise<void> => {
        c = c + 1;
        await writeFile(
          normalize(`../scripture_files/output/${fileName}-${c}.json`),
          JSON.stringify(s),
        );
      },
    );
  }
}
