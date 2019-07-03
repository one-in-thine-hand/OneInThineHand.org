// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import { Verse } from '../../shared/src/shared';
import { parseVerses } from './functions/parseVerses';
import { isChapter } from './functions/queryVerseElements';
import {
  getChapterID,
  getLanguage,
} from '../../shared/src/functions/getFormatTagType';

export class ChapterVerses {
  public _id: string;
  public _rev: string | undefined;
  public verses: Verse[] | undefined;
}

export class FormatTags {
  /**
   * main
   */
  public async main(document: Document): Promise<ChapterVerses | undefined> {
    // console.log(document);

    if (await isChapter(document)) {
      const verses = await parseVerses(document);
      const chapterVerses = new ChapterVerses();
      chapterVerses.verses = verses;
      const language = await getLanguage(document);
      console.log(language);

      chapterVerses._id = `${language}-${await getChapterID(
        document,
        language,
      )}-chapter-verses`;

      console.log(chapterVerses._id);

      // console.log(chapterVerses);
      return chapterVerses;
      // return await parseVerses(document);
    } else {
      return undefined;
    }
    return undefined;
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
