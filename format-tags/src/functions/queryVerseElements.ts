import { verseSelectors } from '../../../shared/src/shared';

export async function queryVerseElements(
  document: Document,
): Promise<Element[]> {
  return Array.from(document.querySelectorAll(verseSelectors.toString()));
}

export async function isChapter(document: Document): Promise<boolean> {
  return document.querySelector('[data-content-type="chapter"]') !== null;
}
