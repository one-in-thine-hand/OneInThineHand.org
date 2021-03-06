import { verseSelectors } from '../../../shared/src/shared';
import { queryVerseElements } from './queryVerseElements';
export async function verifyVerseFlatness(
  document: Document,
): Promise<boolean> {
  return (
    verseSelectors.filter(
      (verseSelector): boolean => {
        // console.log(verseSelector);

        // console.log(document.querySelectorAll(`${verseSelector} > * > *`));
        // if (document.querySelectorAll(`${verseSelector} > * > *`).length > 0) {
        //   console.log(verseSelector);

        //   const asdf = Array.from(
        //     document.querySelectorAll(`${verseSelector} > * > *`),
        //   );
        //   console.log(asdf);
        // }

        // console.log();

        return document.querySelectorAll(`${verseSelector} > * > *`).length > 0;
      },
    ).length === 0
  );
}

export async function getVerseCharacterCounts(
  document: Document,
): Promise<[string, string, number][]> {
  return (await queryVerseElements(document)).map(
    (verseElement): [string, string, number] => {
      return [
        verseElement.id,
        verseElement.textContent ? verseElement.textContent : '',
        verseElement.textContent ? verseElement.textContent.length : 0,
      ];
    },
  );
}
