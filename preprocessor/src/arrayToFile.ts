import { mkdirp, pathExists, writeFile } from 'fs-extra';
import { normalize } from 'path';

export function sliceArray<T>(array: T[], chunkSizes: number): T[][] {
  const newArray: T[][] = [];
  let x = 0;
  while (x < array.length) {
    try {
      newArray.push(array.slice(x, x + chunkSizes));
      x = x + chunkSizes;
    } catch (error) {
      console.log(error);
    }
  }

  return newArray;
}

export async function arrayToFile<T>(
  array: T[],
  fileName: string,
): Promise<void> {
  // console.log(array);

  if (array.length > 0) {
    // console.log(array.length);

    let c = 0;
    try {
      if (!(await pathExists(normalize(`../scripture_files/output`)))) {
        await mkdirp(normalize(`../scripture_files/output`));
      }
    } catch (error) {
      console.log(error);
    }
    try {
      const p = array.map(
        async (a): Promise<void> => {
          c = c + 1;
          try {
            await writeFile(
              normalize(`../scripture_files/output/${fileName}-${c}.json`),
              JSON.stringify(a),
            );
          } catch (error) {
            console.log(error);
          }
        },
      );
      // const p = sliceArray(array, 1).map(
      //   async (s): Promise<void> => {
      //     c = c + 1;
      //     try {
      //       await writeFile(
      //         normalize(`../scripture_files/output/${fileName}-${c}.json`),
      //         JSON.stringify(s),
      //       );
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   },
      // );
      await Promise.all(p);
    } catch (error) {
      console.log(error);
    }
  }
}
