// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import { Verse } from '../../shared/src/shared';
import { parseVerses } from './functions/parseVerses';
import { isChapter } from './functions/queryVerseElements';
export class FormatTags {
  /**
   * main
   */
  public async main(document: Document): Promise<Verse[]> {
    if (await isChapter(document)) {
      return await parseVerses(document);
    } else {
      return [];
    }
    return [];
  }
}

export async function parseTextContent(
  element: Element | Node,
): Promise<string> {
  return element.textContent ? element.textContent : '';
}

export async function parseClassList(
  element: Element,
): Promise<string[] | undefined> {
  return element.classList
    ? (Array.from(element.classList) as string[])
    : undefined;
}
