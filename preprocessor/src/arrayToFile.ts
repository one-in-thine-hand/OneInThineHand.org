import { mkdirp, pathExists, writeFile } from 'fs-extra';

export function sliceArray<T>(array: T[], chunkSizes: number): T[][] {
  console.log(array.length);
  const newArray: T[][] = [];
  let x = 0;
  console.log(chunkSizes);

  while (x < array.length) {
    console.log(x);

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
    console.log(process.cwd());

    let c = 0;
    try {
      if (!(await pathExists(`..\\scripture_files\\output`))) {
        await mkdirp(`..\\scripture_files\\output`);
      }
    } catch (error) {
      console.log(error);
    }
    try {
      // const p = array.map(
      //   async (a): Promise<void> => {
      //     c = c + 1;
      //     try {
      //       await writeFile(
      //         normalize(`../scripture_files/output/${fileName}-${c}.json`),
      //         JSON.stringify([a]),
      //       );
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   },
      // );

      // const newArray: T[][] = [];
      let x = 0;
      // console.log(chunkSizes);

      while (x < array.length) {
        // console.log(x);

        try {
          await writeFile(
            `..\\scripture_files\\output\\${fileName}-${c}.json`,
            JSON.stringify(array.slice(x, x + 10)),
          );
          c = c + 1;
          // newArray.push(array.slice(x, x + 10));
          x = x + 10;
        } catch (error) {
          console.log(error);
        }
      }
      // let x = 0;
      // while (array.length > x) {
      //   c = c + 1;
      //   await writeFile(
      //     `..\\scripture_files\\output\\${fileName}-${c}.json`,
      //     JSON.stringify(array.slice(x, 10)),
      //   );
      //   x = x + 10;
      //   console.log(x);
      // }

      // const p = sliceArray(array, 10).map(
      //   async (s): Promise<void> => {
      //     c = c + 1;
      //     try {
      //       await writeFile(
      //         `..\\scripture_files\\output\\${fileName}-${c}.json`,
      //         JSON.stringify(s),
      //       );
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   },
      // );
      // await Promise.all(p);
    } catch (error) {
      console.log(error);
    }
  }
}
