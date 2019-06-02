import { Paragraph } from './Paragraph';
export async function parseParagraphs(
  document: Document,
): Promise<Paragraph[]> {
  const paragraphSelectors = [
    '[data-content-type="chapter"][lang="jpn"] .body-block',
    '[data-content-type="chapter"][lang="rus"] .body-block',
    '[data-content-type="chapter"][lang="tha"] .body-block',
    '[data-content-type="chapter"][lang="ang"] .body-block',
    '[data-content-type="chapter"][lang="swe"] .body-block',
    '[data-content-type="chapter"][lang="deu"] .body-block',
    '[data-content-type="chapter"][lang="fra"] .body-block',
    '[data-content-type="chapter"][lang="spa"] .body-block',
    '[data-content-type="chapter"][lang="eng"] .body-block',
    'html[data-uri*="/scriptures/gs"] body > header',
    'html[data-uri*="/scriptures/gs"] .body-block > p',
    '[data-content-type="chapter"] header ',
    // '.body-block > p, nav > ul',
    // ' .body-block > div',
    // '.body-block > section > *',
  ];
  const paragraphPromises = Array.from(
    document.querySelectorAll(paragraphSelectors.toString()),
  ).map(
    async (paragraphElement): Promise<Paragraph> => {
      console.log(paragraphElement);

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
  return await Promise.all(paragraphPromises);
}
