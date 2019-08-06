import { formatTagTypeOptions } from '../constants/verse-selectors';
import { FormatTagType, FormatTagTypeOptions } from '../enums/enums';
import { range, sortBy, uniq, flatten } from 'lodash';
// import { bookNames } from '../models/BookName';
export function getFormatTagType(
  formatType: FormatTagType,
): FormatTagTypeOptions | undefined {
  return formatTagTypeOptions.find(
    (f): boolean => {
      return f.formatTagType === formatType;
    },
  );
}

export function getFormatTagTypeFromNode(node: Node): FormatTagType[] {
  try {
    const classList = Array.from((node as Element).classList);
    classList.push(node.nodeName.toLowerCase());
    return classList
      .map(
        (cl): FormatTagType | undefined => {
          const fOptions = formatTagTypeOptions.find(
            (f): boolean => {
              return f.className === cl;
            },
          );
          return fOptions ? fOptions.formatTagType : undefined;
        },
      )
      .filter(
        (f): boolean => {
          return f !== undefined;
        },
      ) as FormatTagType[];
  } catch (error) {
    return [];
  }
}

export function getRanges(array: number[]): [number, number][] {
  const ranges: [number, number][] = [];
  let rstart: number, rend: number;
  const sortedArray = uniq(
    sortBy(
      array,
      (u): number => {
        return u;
      },
    ),
  );
  for (let i = 0; i < sortedArray.length; i++) {
    rstart = sortedArray[i];
    rend = rstart;
    while (sortedArray[i + 1] - sortedArray[i] === 1) {
      rend = sortedArray[i + 1]; // increment the index if the numbers sequential
      i++;
    }
    ranges.push(rstart === rend ? [rstart, rstart] : [rstart, rend + 1]);
  }
  return ranges.filter(
    (range): boolean => {
      // console.log(typeof range[0]);

      return isNaN(range[0]) === false && isNaN(range[1]) === false;
    },
  );
}

export function getElementAttribute(
  document: Document,
  selector: string,
  attrName: string,
  regex: RegExp = new RegExp(/.+/g),
): string {
  const rootElement = document.querySelector(selector);
  const elementAttribute = rootElement
    ? rootElement.getAttribute(attrName)
    : undefined;
  if (elementAttribute) {
    const text = regex.exec(elementAttribute);
    // if (text) {
    //   console.log(text[0].toString());
    // }
    return text ? `${text[0].toString()}` : '';
  }
  throw 'Attribute not found';
}
export const specialChapterIDs = [
  'bofm-eight',
  'bofm-bofm-title',
  'bofm-explanation',
  'bofm-illustrations',
  'bofm-introduction',
  'bofm-js',
  'bofm-three',
  'bofm-title-page',
  'pgp-introduction',
  'pgp-title-page',
  'triple-title-page',
];

export async function getChapterID(
  document: Document,
  language: string,
): Promise<string> {
  let id = `${getElementAttribute(
    document,
    'html',
    'data-uri',
    new RegExp(new RegExp(/(?!\\)[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+$/g)),
  ).replace(/\//g, '-')}`;

  return `${language}-${id}-chapter`;
  // console.log(id);

  // const book = bookNames.find(
  //   (bookName): boolean => {
  //     return id.startsWith(bookName.chapterStartsWith);
  //   },
  // );
  // // console.log(language);
  // // console.log(id);

  // if (book) {
  //   id = `${language}-${id.replace(
  //     book.chapterStartsWith,
  //     book.startsWith,
  //   )}-chapter`;
  // } else if (id.includes('jst-')) {
  //   return `${language}-${id}-chapter`.replace('jst-', 'jst_');
  // } else if (specialChapterIDs.includes(id)) {
  //   // specialChapterIDs.
  //   return `${language}-${id.replace(/\-/g, '_')}-chapter`;
  // }
  // return id;
}

export async function getLanguage(document: Document): Promise<string> {
  return getElementAttribute(document, 'html', 'lang', new RegExp(/.+/g));
}

export function parseOffsets2(offsets?: string) {
  if (offsets === '1-19,14-19') {
    const s = offsets.split('-');

    console.log(range(1, 19 + 1));
  }

  if (offsets === 'all') {
    const uncompressedOffsets = [0];
    return uncompressedOffsets;
  }
  if (offsets) {
    const uncompressedOffsets = flatten(
      offsets
        .split(',')
        .filter(o => o.trim() !== '')
        .map(sOffsets => {
          const splitOffsets = sOffsets.split('-');
          if (splitOffsets.length === 0) {
            return [parseInt(splitOffsets[0], 10)];
          } else {
            // console.log(
            // range(parseInt(splitOffsets[0]), parseInt(splitOffsets[1]) + 1),
            // );

            return range(
              parseInt(splitOffsets[0]),
              parseInt(splitOffsets[1]) + 1,
            );
          }
        }),
    );
    return uncompressedOffsets;
  }
  return undefined;
}
export function parseOffsets(offets: string | undefined): number[] | undefined {
  if (!offets || offets === '') {
    return undefined;
  }
  let offsetSplit: number[] = [];
  offets.split(',').map(
    (r): void => {
      if (r.indexOf('-') !== -1) {
        const split2 = r.split('-');
        const f = parseInt(split2[0]);
        const l = parseInt(split2[1]);
        offsetSplit = offsetSplit.concat(range(f, l + 1));
      } else {
        offsetSplit.push(parseInt(r));
      }
    },
  );
  return offsetSplit.sort(
    (r, s): number => {
      return r - s;
    },
  );
}

export function expandOffsets(
  items: {
    uncompressedOffsets: number[] | undefined;
    offsets: string | undefined;
  }[],
): void {
  items.map(
    (f): void => {
      f.uncompressedOffsets = parseOffsets(f.offsets);
    },
  );
}

export function getElementsAttribute(element: Element, attr: string): string {
  const value = element.getAttribute(attr);
  return value ? value : '';
}
