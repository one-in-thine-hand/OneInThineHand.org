import FastGlob from 'fast-glob';
import { readFile } from 'fs-extra';
import { JSDOM } from 'jsdom';
export async function getHarmoniesFileNames(): Promise<string[]> {
  return FastGlob('../scripture_files/harmony/**/**', {
    onlyFiles: true,
  });
}

function calculateColumnLength(rows: Element[]): number {
  const lengthMap: Map<number, number> = new Map();
  rows.map(
    (row): void => {
      const tdsLength = row.querySelectorAll('td').length;

      let length = lengthMap.get(tdsLength);

      if (!length) {
        length = 0;
      }

      lengthMap.set(tdsLength, length + 1);
    },
  );

  return Array.from(lengthMap).sort(
    (a, b): number => {
      return b[1] - a[1];
    },
  )[0][0];
}

async function main(): Promise<void> {
  try {
    (await getHarmoniesFileNames()).map(
      async (fileName): Promise<void> => {
        try {
          const file = await readFile(fileName, { encoding: 'utf-8' });
          const document = new JSDOM(file).window.document;

          const rows = Array.from(document.querySelectorAll('tr'));
          const columnLength = calculateColumnLength(rows);
          console.log(columnLength);

          // rows.map(
          //   (row): void => {
          //     const cells = row.querySelectorAll('td');
          //     if (cells.length !== 7) {
          //       console.log(row.outerHTML);
          //     }
          //   },
          // );
        } catch (error) {}
      },
    );
  } catch (error) {}
}

main();
