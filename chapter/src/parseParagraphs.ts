import { Paragraph } from './Paragraph';
const paragraphSelectors = [
  '[data-content-type="chapter"] .body-block',
  'html[data-uri*="/scriptures/gs"] body > header',
  'html[data-uri*="/scriptures/gs"] .body-block > p',
  '[data-content-type="chapter"] header ',
  // '.body-block > p, nav > ul',
  // ' .body-block > div',
  // '.body-block > section > *',
];
export async function parseParagraphs(
  document: Document,
): Promise<Paragraph[]> {
  const paragraphPromises = Array.from(
    document.querySelectorAll(paragraphSelectors.toString()),
  ).map(
    async (paragraphElement): Promise<Paragraph> => {
      // console.log(paragraphElement);

      const paragraph = new Paragraph();
      const verseIDs = Array.from(
        paragraphElement.nodeName === 'UL'
          ? paragraphElement.querySelectorAll('li > *')
          : paragraphElement.children,
      )
        .map(
          (verseElement): string => {
            return verseElement.id;
          },
        )
        .filter(
          (verseID): boolean => {
            return verseID.trim() !== '';
          },
        );
      const classList = Array.from(paragraphElement.classList);
      const nodeName = `w-${paragraphElement.nodeName}`;
      paragraph.verseIds = verseIDs;
      paragraph.nodeName = nodeName.toLowerCase();
      paragraph.classList = classList.length > 0 ? classList : undefined;
      return paragraph;
    },
  );
  return Promise.all(paragraphPromises);
}
