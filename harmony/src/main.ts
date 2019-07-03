import FastGlob from 'fast-glob';
import { readFile, mkdirp } from 'fs-extra';
import { JSDOM } from 'jsdom';
import { writeFile } from 'fs-extra';
import { normalize } from 'path';
import { HarmonyCell, HarmonyRow, Harmony } from './Harmony';
export async function getHarmoniesFileNames(): Promise<string[]> {
  return FastGlob('../scripture_files/harmony/**/**', {
    onlyFiles: true,
  });
}

function getTextContent(
  element: Element,
  selector: string,
): string | undefined {
  const textElement = element.querySelector(selector);
  return textElement && textElement.textContent
    ? textElement.textContent
    : undefined;
}
function getHarmonyCell(element: Element): HarmonyCell {
  const sortKey = getTextContent(element, 'sortKey');
  const verseRef = element.querySelector('verseRef');

  if (sortKey) {
    return {
      verse: undefined,
      sortKey: sortKey,
      verseRef: verseRef ? verseRef.id : undefined,
    };
  }

  throw '';
}

function getHarmonyRow(harmony: Element): HarmonyRow[] {
  return Array.from(harmony.querySelectorAll('table tr')).map(
    (row): HarmonyRow => {
      return {
        harmonyCells: Array.from(row.querySelectorAll('td')).map(
          (col): HarmonyCell => {
            return getHarmonyCell(col);
          },
        ),
      };
    },
  );
}
function getHarmonyChapters(document: Document): Harmony[] {
  return Array.from(document.querySelectorAll('harmony')).map(
    (harmony): Harmony => {
      const title = getTextContent(harmony, 'h1#title1');
      const titleNumber = getTextContent(harmony, 'p.title-number');
      const rows = getHarmonyRow(harmony);

      return {
        _id: harmony.id,
        harmonyRows: rows,
        title: title,
        titleNumber: titleNumber,
        _rev: undefined,
      };
    },
  );
}

async function main(): Promise<void> {
  let c = 0;
  try {
    await mkdirp(normalize('../scripture_files/scriptures/harmony'));
  } catch (error) {}
  (await getHarmoniesFileNames()).map(
    async (fileName): Promise<void> => {
      try {
        const file = await readFile(fileName);
        const document = new JSDOM(file).window.document;

        const harmonies = await getHarmonyChapters(document);
        await console.log(harmonies);

        await writeFile(
          normalize(`../scripture_files/scriptures/harmony/harmony-${c}.json`),
          JSON.stringify(harmonies),
        );
      } catch (error) {}
    },
  );
}

main();
