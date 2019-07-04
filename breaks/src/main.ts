// import PQueue from 'p-queue';
import FastGlob from 'fast-glob';
import { readFile, writeFile, mkdirp } from 'fs-extra';
import { JSDOM } from 'jsdom';

import { FormatGroup } from '../../shared/src/shared';
import { normalize } from 'path';
import {
  FormatGroupLine,
  FormatGroupLineGap,
  FormatGroupParaGap,
  FormatGroupBlock,
  FormatGroupBlockGap,
  FormatGroupPara,
} from '../../shared/src/models/format_groups/FormatGroup';
import { VerseBreaks } from '../../shared/src/models/Verse';
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
  nodeName: string,
  offsets?: string,
  classList?: string[],
): FormatGroup | undefined {
  let formatGroup: FormatGroup | undefined;
  switch (nodeName) {
    case 'para': {
      formatGroup = new FormatGroupPara();

      break;
    }
    case 'line': {
      formatGroup = new FormatGroupLine();
      break;
    }
    case 'block': {
      formatGroup = new FormatGroupBlock();
      break;
    }
    case 'block-gap': {
      formatGroup = new FormatGroupBlockGap();
      break;
    }
    case 'line-gap': {
      formatGroup = new FormatGroupLineGap();
      break;
    }
    case 'para-gap': {
      formatGroup = new FormatGroupParaGap();
      break;
    }
    // case 'gap': {
    //   formatGroup = new FormatGroupPara();
    //   break;
    // }
  }
  if (formatGroup) {
    formatGroup.offsets = offsets;
    formatGroup.classList = classList;
    return formatGroup;
  }
  console.log(nodeName);

  return undefined;
}
function getClassList(element: Element): string[] | undefined {
  try {
    const classList = Array.from(element.classList.values());
    return classList.length > 0 ? classList : undefined;
  } catch (error) {}
  return undefined;
}

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

function filterChildrensTextNodes(node: Element | Node): Node[] {
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
  console.log('aoiioasdjf');
  console.log(fileNames);

  const p = fileNames.map(
    async (fileName): Promise<void> => {
      console.log(fileName);

      const file = await readFile(fileName);
      console.log(file);

      const document = new JSDOM(file).window.document;
      queryToArray('chapter', document).map(
        (chapter): void => {
          let verseBreaksChapter: {
            _id?: string;
            verseBreaks: VerseBreaks[];
          } = { _id: `${chapter.id}-breaks`, verseBreaks: [] };
          queryToArray('verse-breaks', chapter).map(
            (verseBreak): void => {
              const verseBreaks = new VerseBreaks();
              verseBreaks._id = verseBreak.id;
              const formatGroups = filterChildrensTextNodes(verseBreak).map(
                (childNode): FormatGroup | undefined => {
                  const offsets = getOffSets(childNode as Element);
                  const classList = getClassList(childNode as Element);
                  return getFormatGroupType(
                    childNode.nodeName.toLowerCase(),
                    offsets,
                    classList,
                  );
                },
              );
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

  console.log(p);

  await Promise.all(p);

  console.log(proccessedFormatGroups);
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
  const fileNames = await FastGlob('../scripture_files/breaks/**/**');
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
