import { formatTagTypeOptions } from '../constants/verse-selectors';
import { FormatTagType, FormatTagTypeOptions } from '../enums/enums';
import { range } from 'lodash';
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
  for (let i = 0; i < array.length; i++) {
    rstart = array[i];
    rend = rstart;
    while (array[i + 1] - array[i] === 1) {
      rend = array[i + 1]; // increment the index if the numbers sequential
      i++;
    }
    ranges.push(rstart === rend ? [rstart, rstart] : [rstart, rend]);
  }
  return ranges;
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

export async function getID(
  document: Document,
  language: string,
): Promise<string> {
  return `${getElementAttribute(
    document,
    'html',
    'data-uri',
    new RegExp(new RegExp(/(?!\\)[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+$/g)),
  ).replace(/\//g, '-')}-${language}`;
}
export async function getLanguage(document: Document): Promise<string> {
  return getElementAttribute(document, 'html', 'lang', new RegExp(/.+/g));
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
  return offsetSplit.sort();
}
