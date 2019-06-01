// import { Verse, LDSSourceVerse, NodeName } from '../models/Verse';
import { queryVerseElements } from './queryVerseElements';
import { normalizeCharacterCounts } from './normalizeCharacterCounts';
import { verifyVerseFlatness } from './verifyVerseFlatness';
// import { queryFormatGroups } from './queryFormatGroups';
// import { removeEmptySpaces } from './removeEmptySpaces';
// import { parseClassList, parseTextContent } from '../run';
// import { F, FormatTagTemp, FormatTagLDSSource } from '../models/format_tags/F';
// import { queryChildNodes } from './queryChildNodes';

// import { isEqual, first, last, uniq } from 'lodash';
// import { RichText } from '../enums/RichText';
// import { FormatRichText } from '../models/format_tags/FRichText';
// import { Environment } from '../Environment';
import {
  FormatTag,
  FormatTagType,
  getFormatTagTypeFromNode,
  Verse,
  getFormatTagType,
} from '../../../shared/src/shared';
import { NodeName } from '../../../shared/src/models/Verse';
import { queryFormatGroups } from './queryFormatGroups';

// import { getID, getLanguage } from '../../../oith.shared/src/functions';

// function verifyChildNodesNotEmpty(childNodes: Node[]): boolean {
//   return !childNodes
//     .map(
//       (childNode): boolean => {
//         if (childNode.textContent && childNode.textContent.length > 0) {
//           return true;
//         }
//         return false;
//       }
//     )
//     .includes(false);
// }

// function isTextNode(node: Node): boolean {
//   if (node.nodeName === '#text') {
//     return true;
//   }

//   const classList = (node as Element).classList;

//   if (!classList || classList.length === 0) {
//     return true;
//   }
//   return false;
// }
// function generateFormatBaseTags(node: Node, formatTags: F[], classList: string[]): void {
//   // console.log(`${node.nodeName} ${await isTextNode(node)}`);

//   if (isTextNode(node)) {
//     if (node.textContent) {
//       node.textContent.split('').map(
//         (character): void => {
//           const f = new FormatTagTemp();

//           f.text = character;
//           f.classList = classList;
//           formatTags.push(f);
//         }
//       );
//     }
//   } else {
//     let newClassList: string[] = [];
//     newClassList = newClassList.concat(classList);
//     if ((node as Element).classList !== undefined) {
//       newClassList = newClassList.concat(Array.from((node as Element).classList));
//     }

//     Array.from(node.childNodes).map(
//       (childNode): void => {
//         generateFormatBaseTags(childNode, formatTags, newClassList);
//       }
//     );
//   }
// }

// function formatTempTagsAreEqual(f1: FormatTagTemp, f2: FormatTagTemp): boolean {
//   if (f1.classList === undefined && f2.classList == undefined) {
//     return true;
//   } else if (f1.classList !== undefined && f2.classList !== undefined) {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     return isEqual(f1.classList.sort(), (f2 as any).classList);
//   } else if (f1.classList === undefined && f2.classList !== undefined) {
//     return isEqual(f1, f2.classList.sort());
//   } else if (f1.classList && f2.classList) {
//     return isEqual(f1.classList.sort(), f2.classList.sort());
//   }

//   return false;
// }

// function compressFormatTempTags(formatTempTags: FormatTagTemp[]): F[] {
//   const newFormatTempTags: F[] = [];
//   let newFormatTempTag: F | undefined;
//   let count = 0;

//   formatTempTags.map(
//     (f): void => {
//       if (!newFormatTempTag) {
//         newFormatTempTag = f;

//         newFormatTempTag.offsets = [count];
//       } else {
//         if (newFormatTempTag.offsets === undefined) {
//           newFormatTempTag.offsets = [];
//         }
//         if (formatTempTagsAreEqual(newFormatTempTag, f)) {
//           newFormatTempTag.offsets.push(count);
//         } else {
//           newFormatTempTags.push(newFormatTempTag);
//           newFormatTempTag = undefined;
//           newFormatTempTag = f;
//           if (newFormatTempTag.offsets === undefined) {
//             newFormatTempTag.offsets = [];
//           }
//           newFormatTempTag.offsets.push(count);
//         }
//       }

//       count = count + 1;
//     }
//   );
//   if (newFormatTempTag) {
//     newFormatTempTags.push(newFormatTempTag);
//   }

//   return newFormatTempTags;
// }

// function getFirstAndLast<T>(list: T[]): [T, T] | undefined {
//   const f = first(list);
//   const l = last(list);

//   return f !== undefined && l !== undefined ? [f, l] : undefined;
// }

// function convertFormatTempTagToFormatTag(
//   formatTempTag: FormatTagTemp,
//   cssClass: string,
//   environment: Environment
// ): F | undefined {
//   let formatTag: F | undefined;

//   const firstLast = getFirstAndLast(formatTempTag.offsets ? formatTempTag.offsets : []);
//   if (environment === Environment.browser) {
//     formatTag = new FormatTagLDSSource();

//     formatTag.compressedOffsets = firstLast ? [firstLast] : [[0, 0]];
//     formatTag.classList = [cssClass];

//     switch (cssClass) {
//       case 'verse-number': {
//         (formatTag as FormatTagLDSSource).bold = true;
//         break;
//       }
//       case 'italic': {
//         (formatTag as FormatTagLDSSource).italic = true;
//         break;
//       }
//       case 'underline': {
//         (formatTag as FormatTagLDSSource).underline = true;
//         break;
//       }
//       case 'double-underline': {
//         (formatTag as FormatTagLDSSource).doubleUnderline = true;
//         break;
//       }
//     }

//     return formatTag;
//   }

//   switch (cssClass) {
//     case 'verse-number': {
//       formatTag = new FormatRichText();
//       (formatTag as FormatRichText).richText = RichText.verseNumber;

//       break;
//     }
//     default:
//       break;
//   }

//   if (formatTag) {
//     formatTag.compressedOffsets = firstLast ? [firstLast] : [[0, 0]];
//   }

//   return formatTag;
// }

// function convertFormatTempTagsToFormatTags(
//   formatTempTags: FormatTagTemp[],
//   environment: Environment
// ): F[] {
//   const formatTags: F[] = [];

//   formatTempTags.map(
//     (formatTempTag): void => {
//       if (formatTempTag.classList !== undefined) {
//         // let formatTag = new FormatBase();
//         // const f = first(formatTempTag.charCountUncompressed);
//         // const l = last(formatTempTag.charCountUncompressed);
//         // formatTag.charCount = f && l ? [[f, l]] : [[0, 0]];
//         // formatTag.optional = false;
//         uniq(formatTempTag.classList).map(
//           (item): void => {
//             const f = convertFormatTempTagToFormatTag(formatTempTag, item, environment);
//             if (f) {
//               formatTags.push(f);
//             }
//           }
//         );
//       }
//       // else {
//       //   uniq(formatTempTag.classList).map(
//       //     (item): void => {
//       //       const f = convertFormatTempTagToFormatTag(formatTempTag, item);
//       //       if (f) {
//       //         formatTags.push(f);
//       //       }
//       //     },
//       //   );
//       // }
//     }
//   );

//   return formatTags;
// }

// async function parseFormatTags(verseElement: Element, environment: Environment): Promise<F[]> {
//   const childNodes = await queryChildNodes(verseElement);
//   if (verifyChildNodesNotEmpty(childNodes)) {
//     const formatTempTags: F[] = [];

//     childNodes.map(
//       (childNode): void => {
//         let classList: string[] =
//           (childNode as Element).classList !== undefined
//             ? Array.from((childNode as Element).classList)
//             : [];

//         generateFormatBaseTags(childNode, formatTempTags, classList);
//       }
//     );
//     const newFormatTempTags = compressFormatTempTags(formatTempTags);

//     return convertFormatTempTagsToFormatTags(newFormatTempTags, environment);
//   }

//   const document = verseElement.ownerDocument;

//   const title = document ? document.querySelector('title') : undefined;

//   throw `There are still empty nodes in ${title ? title.innerHTML : 'Unknown'}`;
// }

// async function getDataAid(element: Element): Promise<string> {
//   const dataAid = element.getAttribute('data-aid');

//   if (dataAid) {
//     return dataAid;
//   } else {
//     throw `Couldn't find data-aid in: ${element.outerHTML}`;
//   }
// }

function getVerseNodeName(verse: Verse, verseElement: Element): void {
  switch (verseElement.nodeName.toLowerCase()) {
    case 'p': {
      verse.nodeName = NodeName.p;
      break;
    }
    case 'h1': {
      verse.nodeName = NodeName.h1;
      break;
    }
    case 'h2': {
      verse.nodeName = NodeName.h2;
      break;
    }
    case 'h3': {
      verse.nodeName = NodeName.h3;
      break;
    }
    case 'h4': {
      verse.nodeName = NodeName.h4;
      break;
    }
    case 'h5': {
      verse.nodeName = NodeName.h5;
      break;
    }
    case 'h6': {
      verse.nodeName = NodeName.h6;
      break;
    }
    case 'span': {
      verse.nodeName = NodeName.span;
      break;
    }
  }
}

// async function parseVerse(verseElement: Element, environment: Environment): Promise<Verse> {
//   let verse = new Verse();

//   if (environment === Environment.browser) {
//     verse = new LDSSourceVerse();
//     (verse as LDSSourceVerse).verseElement = verseElement;
//     getVerseNodeName(verse as LDSSourceVerse, verseElement);
//   }

//   const formatGroups = await queryFormatGroups(verseElement);
//   removeEmptySpaces(verseElement);
//   verse.classList = await parseClassList(verseElement);
//   verse.text = await parseTextContent(verseElement);
//   verse.formatGroups = formatGroups ? formatGroups : [];
//   // verse._id = `${chapterID}-${verseElement.id}`;
//   verse.formatTags = await parseFormatTags(verseElement, environment);
//   verse._id = await getDataAid(verseElement);
//   verse.id = `${verseElement.id}`;

//   return verse;
// }
function buildFormatTag(
  childNode: Node,
  formatTags: Map<FormatTagType, FormatTag>,
  classList: FormatTagType[],
  count: { count: number },
): void {
  if (childNode.nodeName === '#text') {
    if (childNode.textContent) {
      childNode.textContent.split('').map(
        (): void => {
          classList.map(
            (c): void => {
              let formatTag = formatTags.get(c);
              if (!formatTag) {
                formatTag = new FormatTag();
                const formatTagTypeOption = getFormatTagType(c);
                if (formatTagTypeOption) {
                  formatTag.formatType = formatTagTypeOption.formatTagType;
                  formatTag.optional = formatTagTypeOption.optional;
                  formatTag.displayAs = formatTagTypeOption.displayAs;
                  formatTag.uncompressedOffsets = [count.count];
                  formatTags.set(c, formatTag);
                }
              } else {
                formatTag.uncompressedOffsets
                  ? formatTag.uncompressedOffsets.push(count.count)
                  : [count.count];
              }
            },
          );
          count.count = count.count + 1;
        },
      );
    }
  } else {
    const newClassList = classList.concat(getFormatTagTypeFromNode(childNode));
    Array.from(childNode.childNodes).map(
      (childNode2): void => {
        buildFormatTag(childNode2, formatTags, newClassList, count);
      },
    );
  }
}
function buildFormatTags(verseElement: Element): FormatTag[] {
  const formatTags: Map<FormatTagType, FormatTag> = new Map();
  const count = { count: 0 };
  Array.from(verseElement.childNodes).map(
    (childNodes): void => {
      buildFormatTag(childNodes, formatTags, [], count);
    },
  );
  return Array.from(formatTags.values());
}

async function parseVerse(verseElement: Element): Promise<Verse | undefined> {
  const verse = new Verse();
  const dataAid = verseElement.getAttribute('data-aid');
  const formatGroups = await queryFormatGroups(verseElement);

  verse.formatGroups = formatGroups ? formatGroups : [];

  if (dataAid) {
    verse._id = dataAid;
  } else {
    return undefined;
  }

  verse.verseID = verseElement.id;
  verse.formatTags = buildFormatTags(verseElement);
  verse.classList = verseElement.className;
  verse.text = verseElement.textContent ? verseElement.textContent : '';

  getVerseNodeName(verse, verseElement);

  return verse;
}

export async function parseVerses(document: Document): Promise<Verse[]> {
  await normalizeCharacterCounts(document);
  if (!(await verifyVerseFlatness(document))) {
    const title = document.querySelector('title');
    throw `${title ? title.innerHTML : ''} Document isn't flat`;
  }
  const verseElements = (await queryVerseElements(document)).filter(
    (verseElement): boolean => {
      return !verseElement.classList.contains('page-break');
    },
  );
  const versePromises = verseElements.map(
    async (verseElement): Promise<Verse | undefined> => {
      return await parseVerse(verseElement);
    },
  );
  const verses = (await Promise.all(versePromises)).filter(
    (verse): boolean => {
      return verse !== undefined;
    },
  ) as Verse[];
  return verses;
}
