import FastGlob from 'fast-glob';
import { readFile, writeFile, pathExists, mkdirp } from 'fs-extra';
import { JSDOM } from 'jsdom';
import { HarmonyCell, HarmonyXRef, HarmonyVerse } from './Harmony';
import { normalize, basename } from 'path';
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
  // console.log(lengthMap);

  return Array.from(lengthMap).sort(
    (a, b): number => {
      return b[1] - a[1];
    },
  )[0][0];
}

function filterTextNodes(nodes: Node[]): Node[] {
  return nodes.filter(
    (node): boolean => {
      return node.nodeName.toLowerCase() !== '#text';
    },
  );
}

function getHarmonyVerses(nodes: Node[]): HarmonyVerse[] {
  try {
    const harmonyVerses: HarmonyVerse[] = [];
    for (let x = 0; x < nodes.length; x += 2) {
      // console.log(x);

      const harmonyVerse = new HarmonyVerse();
      harmonyVerse.verseRef = (nodes[x + 1] as Element).getAttribute(
        'id',
      ) as string;

      harmonyVerse.verseTitle = (nodes[x] as Element).textContent as string;
      harmonyVerses.push(harmonyVerse);
    }
    return harmonyVerses;
  } catch (error) {
    // console.log(`Node lengths ${nodes[0].nodeName}`);

    throw error;
  }
}

function getHarmonyCell(childNodes: Node[]): HarmonyCell {
  const harmonyCell = new HarmonyCell();
  const sortKeyElement = childNodes[0] as Element;
  if (sortKeyElement.textContent) {
    harmonyCell.sortKey = sortKeyElement.textContent;
    childNodes.shift();
  }
  try {
    if (childNodes[0].nodeName.toLowerCase() === 'sequence-title') {
      harmonyCell.sequenceTitle = childNodes[0].textContent as string;
      return harmonyCell;
    }
  } catch (error) {
    return harmonyCell;
  }
  harmonyCell.harmonyVerses = getHarmonyVerses(childNodes);
  return harmonyCell;
}
function getHarmonyXRefCell(childNodes: Node[]): HarmonyXRef[] {
  const xRefCells = filterTextNodes(childNodes);

  return xRefCells.map(
    (xRefCell): HarmonyXRef => {
      const harmonyXRefCell = new HarmonyXRef();
      harmonyXRefCell.harmonyVerse = [];
      const nodes = filterTextNodes(Array.from(xRefCell.childNodes));

      harmonyXRefCell.xRefTitle =
        nodes[0] && nodes[0].textContent ? nodes[0].textContent : '';

      nodes.shift();
      harmonyXRefCell.harmonyVerse = getHarmonyVerses(nodes);

      return harmonyXRefCell;
    },
  );

  // return harmonyXRefCell;
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
          // console.log(columnLength);

          const rowsE = rows.map(
            (row): (HarmonyCell | HarmonyXRef)[] => {
              try {
                const columns = Array.from(row.querySelectorAll('td')).splice(
                  0,
                  columnLength,
                );
                return columns.map(
                  (column): HarmonyCell | HarmonyXRef => {
                    try {
                      const childNodes = Array.from(column.childNodes).filter(
                        (node): boolean => {
                          return node.nodeName.toLowerCase() !== '#text';
                        },
                      );

                      if (childNodes[0]) {
                        if (
                          childNodes[0].nodeName.toLowerCase() === 'sortkey'
                        ) {
                          return getHarmonyCell(childNodes);
                        } else if (
                          childNodes[0].nodeName.toLowerCase() === 'xref'
                        ) {
                          try {
                            const harmonyCell = new HarmonyCell();

                            harmonyCell.harmonyXRef = getHarmonyXRefCell(
                              childNodes,
                            );
                            // console.log(harmonyCell);

                            return harmonyCell;
                          } catch (error) {
                            throw new Error('error in xref');
                          }
                        }
                      }
                      return new HarmonyCell();

                      // if (childNodes.length % 2 !== 0) {
                      //   console.log(childNodes.length);
                      // }
                    } catch (error) {
                      console.log(error);

                      throw new Error(
                        'This document might not be a Harmony file',
                      );
                    }
                  },
                );
              } catch (error) {
                console.log(error);

                throw error;
              }
            },
          );
          rowsE.map(
            (row): void => {
              console.log(row.length);
            },
          );
          console.log(
            normalize(
              `../scripture_files/scriptures/harmony/${fileName
                .replace('.html', '')
                .replace(' ', '_')}.json`,
            ),
          );
          if (
            !(await pathExists(
              normalize('../scripture_files/scriptures/harmony'),
            ))
          ) {
            console.log(
              await mkdirp(normalize('../scripture_files/scriptures/harmony')),
            );
          }
          const results = await writeFile(
            normalize(
              `../scripture_files/scriptures/harmony/${basename(
                fileName,
              ).replace('.html', '')}.json`,
            ),
            JSON.stringify(rowsE),
          );

          console.log(results);

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
