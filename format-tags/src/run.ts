import { Verse } from './models/Verse';
import { isChapter } from './functions/queryVerseElements';
import { parseVerses } from './functions/parseVerses';
import { Environment } from './Environment';

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

export async function run(
  document: Document,
  environment: Environment,
): Promise<Verse[]> {
  // const language = await getLanguage(document);
  // const chapterID = await getID(document, language);

  if (await isChapter(document)) {
    return await parseVerses(document, environment);
  } else {
    return [];
  }
}
