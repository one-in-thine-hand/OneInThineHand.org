import PQueue from 'p-queue';
import FastGlob from 'fast-glob';
import { readFile, writeFile, mkdirp } from 'fs-extra';
import { JSDOM } from 'jsdom';

import cuid from 'cuid';
import { FormatTagType, FormatTag } from '../../shared/src/shared';
import { normalize } from 'path';
const pQueue = new PQueue({ concurrency: 10 });

function nodeNameToFornatTag(nodeName: string): FormatTagType {
  switch (nodeName) {
    case 'paragraph': {
      return FormatTagType.Paragraph;
    }
    case 'poetry': {
      return FormatTagType.Poetry;
    }
    case 'line': {
      return FormatTagType.line;
    }
    case 'stanza': {
      return FormatTagType.Stanza;
    }
    case 'prose': {
      return FormatTagType.Prose;
    }
    case 'block': {
      return FormatTagType.Block;
    }
  }
  throw 'hhh';
}
async function processFiles(
  fileNames: string[],
  verseBreaks: { _id: string; breaks: FormatTag[] }[],
): Promise<void> {
  const p = fileNames.map(
    async (fileName): Promise<void> => {
      const file = await readFile(fileName);
      pQueue.add(
        (): void => {
          const document = new JSDOM(file).window.document;
          console.log(document);
          Array.from(document.querySelectorAll('verse-breaks')).map(
            (verseBreakElement): void => {
              const verseBreak: {
                _id: string;
                breaks: FormatTag[];
              } = {
                _id: verseBreakElement.id,
                breaks: [],
              };
              0;
              // console.log(verseBreakElement);
              Array.from(verseBreakElement.childNodes)
                .filter(
                  (node): boolean => {
                    return node.nodeName.toLowerCase() !== '#text';
                  },
                )
                .map(
                  (node): void => {
                    try {
                      const formatTag = new FormatTag();
                      formatTag.formatType = nodeNameToFornatTag(
                        node.nodeName.toLowerCase(),
                      );
                      const offset = (node as Element).getAttribute('offset');
                      formatTag.offsets = offset ? offset.trim() : '';
                      if (formatTag.offsets.trim() === '') {
                        throw '';
                      }
                      verseBreak.breaks.push(formatTag);
                    } catch (error) {}
                  },
                );
              verseBreaks.push(verseBreak);
            },
          );
        },
      );
    },
  );
  await Promise.all(p);
}

// POETRY
// LINE
// STANZA
// LINE
// PROSE
// BLOCK
function sliceArray<T>(array: T[], chunkSizes: number): T[][] {
  const newArray: T[][] = [];
  let x = 0;
  while (x < array.length) {
    newArray.push(array.slice(x, x + chunkSizes));
    x = x + chunkSizes;
  }
  return newArray;
}
async function main(): Promise<void> {
  const fileNames = await FastGlob('test_breaks/**/**');
  // console.log(fileNames);
  const verseBreaks: { _id: string; breaks: FormatTag[] }[] = [];
  await processFiles(fileNames, verseBreaks);

  try {
    await mkdirp(`../scripture_files/scriptures/breaks/`);
  } catch (error) {}
  sliceArray(
    verseBreaks.filter(
      (vb): boolean => {
        return vb.breaks !== undefined && vb.breaks.length > 0;
      },
    ),
    100,
  ).map(
    (slice): void => {
      console.log(slice);

      writeFile(
        normalize(`../scripture_files/scriptures/breaks/${cuid()}.json`),
        JSON.stringify(slice),
      );
    },
  );
  console.log(verseBreaks);
}

main();
