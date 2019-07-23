// import PQueue from 'p-queue';
import * as FastGlob from 'fast-glob';
import { readFile, writeFile, mkdirp } from 'fs-extra';
import { JSDOM } from 'jsdom';

// import { FormatGroup, FormatGroupType } from '../../shared/src/shared';
import { normalize } from 'path';
import {
  FormatGroupBreaks,
  FormatGroup,
  FormatGroupType,
  VerseBreaks,
} from '../../OneInThineHand.org/src/app/models/verse-notes';
// const pQueue = new PQueue({ concurrency: 10 });

// function nodeNameToFornatTag(nodeName: string): FormatTagType {
//   switch (nodeName) {
//     case 'paragraph': {
//       return FormatTagType.Paragraph;
//     }
//     case 'poetry': {
//       return FormatTagType.Poetry;
//     }
//     case 'line': {
//       return FormatTagType.line;
//     }
//     case 'stanza': {
//       return FormatTagType.Stanza;
//     }
//     case 'prose': {
//       return FormatTagType.Prose;
//     }
//     case 'block': {
//       return FormatTagType.Block;
//     }
//     case 'gap': {
//       return FormatTagType.Gap;
//     }
//   }
//   throw new Error(nodeName);
// }

function getFormatGroupType(
  element: Element,
  offsets?: string,
  // classList?: string[],
): FormatGroup {
  let formatGroup = new FormatGroupBreaks();

  try {
    formatGroup.classList = element.className.split(',');
    if (!element.className.includes('gap')) {
      formatGroup.offsets = offsets;
    } else {
      console.log('asdoifjaoisdfj');

      formatGroup.formatGroupType = FormatGroupType.Gaps;
      console.log(formatGroup.formatGroupType);
    }
  } catch (error) {
    console.log(element);

    console.log(error);
  }
  return formatGroup;
  // if (formatGroup) {
  //   formatGroup.classList = classList;
  //   return formatGroup;
  // }
}
// function getClassList(element: Element): string[] | undefined {
//   try {
//     const classList = Array.from(element.classList.values());
//     return classList.length > 0 ? classList : undefined;
//   } catch (error) {}
//   return undefined;
// }

function queryToArray(selector: string, doc?: Document | Element): Element[] {
  const d = doc ? doc : document;

  return d ? Array.from(d.querySelectorAll(selector)) : [];
}
function getOffSets(element: Element): string | undefined {
  try {
    const offsets = element.getAttribute('offsets');
    return offsets ? offsets : undefined;
  } catch (error) {
    return undefined;
  }
}

export function filterChildrensTextNodes(node: Element | Node): Node[] {
  return Array.from(node.childNodes).filter(
    (childNode): boolean => {
      return childNode.nodeName.toLowerCase() !== '#text';
    },
  );
}

async function processFiles(
  fileNames: string[],
): Promise<
  {
    _id?: string;
    verseBreaks?: VerseBreaks[];
  }[]
> {
  let proccessedFormatGroups: {
    _id?: string;
    verseBreaks?: VerseBreaks[];
  }[] = [];
  // console.log('aoiioasdjf');
  // console.log(fileNames);

  const p = fileNames.map(
    async (fileName): Promise<void> => {
      // console.log(fileName);

      const file = await readFile(fileName);
      // console.log(file);

      const document = new JSDOM(file).window.document;
      queryToArray('chapter', document).map(
        (chapter): void => {
          let verseBreaksChapter: {
            _id?: string;
            verseBreaks: VerseBreaks[];
          } = {
            _id: `${chapter.id.replace('-chapter', '')}-breaks`,
            verseBreaks: [],
          };
          queryToArray('verse-breaks', chapter).map(
            (verseBreakElement): void => {
              const verseBreaks = new VerseBreaks();
              verseBreaks._id = verseBreakElement.id;

              const formatGroups = queryToArray('break', verseBreakElement).map(
                (brk): FormatGroup => {
                  const offsets = getOffSets(brk);
                  // const classList = getClassList(brk as Element);
                  return getFormatGroupType(
                    brk,
                    offsets,
                    // classList,
                  );
                },
              );
              // filterChildrensTextNodes(verseBreakElement).map(
              //   (childNode): FormatGroup | undefined => {
              //     const offsets = getOffSets(childNode as Element);
              //     // const classList = getClassList(childNode as Element);
              //     return getFormatGroupType(
              //       childNode as Element,
              //       offsets,
              //       // classList,
              //     );
              //   },
              // );
              // console.log(formatGroups);

              verseBreaks.breaks = formatGroups.filter(
                (formatGroup): boolean => {
                  return formatGroup !== undefined;
                },
              ) as FormatGroup[];
              verseBreaksChapter.verseBreaks.push(verseBreaks);
            },
          );

          proccessedFormatGroups.push(verseBreaksChapter);
        },
      );
    },
  );

  // console.log(p);

  await Promise.all(p);

  // console.log(proccessedFormatGroups);
  return proccessedFormatGroups;

  // pQueue.add(
  //   (): void => {
  //     const document = new JSDOM('file').window.document;
  //     // console.log(document);

  //     Array.from(document.querySelectorAll('verse-breaks')).map(
  //       (verseBreakElement): void => {
  //         const verseBreak: {
  //           _id: string;
  //           breaks: FormatTag[];
  //         } = {
  //           _id: verseBreakElement.id,
  //           breaks: [],
  //         };
  //         0;
  //         // console.log(verseBreakElement);
  //         Array.from(verseBreakElement.childNodes)
  //           .filter(
  //             (node): boolean => {
  //               return node.nodeName.toLowerCase() !== '#text';
  //             },
  //           )
  //           .map(
  //             (node): void => {
  //               try {
  //                 const formatTag = new FormatTag();
  //                 formatTag.formatType = nodeNameToFornatTag(
  //                   node.nodeName.toLowerCase(),
  //                 );
  //                 const offset = (node as Element).getAttribute('offset');
  //                 formatTag.offsets = offset ? offset.trim() : '';
  //                 if (formatTag.offsets.trim() === '') {
  //                   throw '';
  //                 }
  //                 verseBreak.breaks.push(formatTag);
  //               } catch (error) {
  //                 console.log(error);
  //               }
  //             },
  //           );
  //         verseBreaks.push(verseBreak);
  //       },
  //     );
  //   },
  // );
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
  console.log('asdfiopjkasdoifjaoisdf j');
  const fileNames = await FastGlob('../scripture_files/breaks/**/**');
  console.log(fileNames);

  // console.log(fileNames);
  const proccessedFormatGroups = await processFiles(fileNames);

  let x = 0;
  try {
    await mkdirp(`../scripture_files/scriptures/breaks/`);
  } catch (error) {}
  sliceArray(proccessedFormatGroups, 100).map(
    async (slice): Promise<void> => {
      // console.log(slice);
      x = x + 1;

      await writeFile(
        normalize(`../scripture_files/scriptures/breaks/breaks-${x}.json`),
        JSON.stringify(slice),
      );
    },
  );
  // console.log(verseBreaks);
}

main();
