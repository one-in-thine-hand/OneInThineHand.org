// import { Verse, LDSSourceVerse, NodeName } from '../models/Verse';
import { queryVerseElements } from './queryVerseElements';
import { normalizeCharacterCounts } from './normalizeCharacterCounts';
// import { verifyVerseFlatness } from './verifyVerseFlatness';
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
  getRanges,
} from '../../../shared/src/shared';
import { NodeName } from '../../../shared/src/models/Verse';
import { queryFormatGroups } from './queryFormatGroups';
import {
  getChapterID,
  getLanguage,
} from '../../../shared/src/functions/getFormatTagType';

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
    if (childNode.textContent && childNode.textContent.length > 0) {
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
                  formatTag.classList
                    ? formatTag.classList.push(
                        formatTagTypeOption.className
                          ? formatTagTypeOption.className
                          : '',
                      )
                    : (formatTag.classList = [
                        formatTagTypeOption.className
                          ? formatTagTypeOption.className
                          : '',
                      ]);

                  // formatTag.offsets = getRanges(
                  //   formatTag.uncompressedOffsets,
                  // ).toString();
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
    if (
      childNode.nodeName.toLowerCase() === 'deletion' ||
      childNode.nodeName.toLowerCase() === 'insertion'
    ) {
      //  newClassList.push( childNode.nodeName.toLowerCase());
    }
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
  return Array.from(formatTags.values()).map(
    (formatTag): FormatTag => {
      // console.log(getRanges(formatTag.uncompressedOffsets as []));
      // console.log(
      //   getRanges(formatTag.uncompressedOffsets as [])
      //     .map(
      //       (offset): string => {
      //         return offset[0] === offset[1]
      //           ? `${offset[0]}`
      //           : `${offset[0]}-${offset[1]}`;
      //       },
      //     )
      //     .toString(),
      // );

      formatTag.offsets = getRanges(formatTag.uncompressedOffsets as [])
        .map(
          (offset): string => {
            return offset[0] === offset[1]
              ? `${offset[0]}`
              : `${offset[0]}-${offset[1] - 1}`;
          },
        )
        .toString();
      formatTag.uncompressedOffsets = undefined;
      return formatTag;
    },
  );
}

async function parseVerse(verseElement: Element): Promise<Verse | undefined> {
  const verse = new Verse();
  // const dataAid = verseElement.getAttribute('data-aid');
  const lang = await getLanguage(verseElement.ownerDocument as Document);

  verse.verseID = verseElement.id;

  let chapterID = await getChapterID(
    verseElement.ownerDocument as Document,
    lang,
  );

  verse._id = `${chapterID.replace('chapter', '')}-${
    verse.verseID.startsWith('p')
      ? verse.verseID.replace('p', '')
      : verse.verseID
  }-verse`.replace('--', '-');
  // if (lang === 'fra') {
  //   verse.kjvRef = getKJVRef(verseElement, verse._id);
  // }
  verse.noteID = `${chapterID.replace('chapter', '')}-${
    verse.verseID.startsWith('p')
      ? verse.verseID.replace('p', '')
      : verse.verseID
  }-verse-notes`
    .replace('jst-', 'jst_')
    .replace('--', '-');
  // console.log(id);

  const formatGroups = await queryFormatGroups(verseElement, verse);

  verse.formatGroups = formatGroups ? formatGroups : [];
  // const book = bookNames.find(
  //   (bookName): boolean => {
  //     return chapterID.startsWith(bookName.chapterStartsWith);
  //   },
  // );
  // if (book) {
  //   chapterID = chapterID.replace(book.chapterStartsWith, book.startsWith);
  // }
  // if (chapterID) {
  //   verse._id = chapterID;
  // } else {
  //   return undefined;
  // }
  verse.formatTags = buildFormatTags(verseElement);
  verse.classList = verseElement.className;
  verse.text = verseElement.textContent ? verseElement.textContent : '';

  getVerseNodeName(verse, verseElement);

  return verse;
}

async function fixJSTIds(verses: Verse[], document: Document): Promise<void> {
  const lang = await getLanguage(document);
  verses.map(
    (verse): void => {
      if (verse._id && verse._id.includes('jst-')) {
        verse._id = verse._id.replace('jst-', 'jst_');
        verse._id = !verse._id.startsWith(lang)
          ? `${lang}-${verse._id}`
          : verse._id;
      }
    },
  );
}

export async function parseVerses(document: Document): Promise<Verse[]> {
  await normalizeCharacterCounts(document);
  // if (!(await verifyVerseFlatness(document))) {
  //   const title = document.querySelector('title');
  //   throw `${title ? title.innerHTML : ''} Document isn't flat`;
  // }
  const verseElements = (await queryVerseElements(document)).filter(
    (verseElement): boolean => {
      return !verseElement.classList.contains('page-break');
    },
  );
  const versePromises = verseElements.map(
    async (verseElement): Promise<Verse | undefined> => {
      return parseVerse(verseElement);
    },
  );
  const verses = (await Promise.all(versePromises)).filter(
    (verse): boolean => {
      return verse !== undefined;
    },
  ) as Verse[];
  await fixJSTIds(verses, document);
  return verses;
}
