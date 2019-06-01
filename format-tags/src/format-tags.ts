// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import { Verse, Environment } from '../../shared';
import { parseVerses } from './functions/parseVerses';
import { isChapter } from './functions/queryVerseElements';
export default class FormatTags {
  /**
   * main
   */
  public async main(document: Document, environment: Environment): Promise<Verse[]> {
    if (await isChapter(document)) {
      return await parseVerses(document, environment);
    } else {
      return [];
    }
    return [];
  }
}

export async function parseTextContent(element: Element | Node): Promise<string> {
  return element.textContent ? element.textContent : '';
}

export async function parseClassList(element: Element): Promise<string[] | undefined> {
  return element.classList ? (Array.from(element.classList) as string[]) : undefined;
}
