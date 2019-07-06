import FastGlob from 'fast-glob';
import { readFile, mkdirp } from 'fs-extra';
import { JSDOM } from 'jsdom';
import { writeFile } from 'fs-extra';
import { normalize } from 'path';
import { HarmonyCell, HarmonyRow, Harmony } from './Harmony';
import {
  getChapterID,
  getLanguage,
} from '../../shared/src/functions/getFormatTagType';
export async function getHarmoniesFileNames(): Promise<string[]> {
  return FastGlob('../scripture_files/harmony/**/**', {
    onlyFiles: true,
  });
}

function getTextContent(
  element: Element | Document,
  selector: string,
): string | undefined {
  const textElement = element.querySelector(selector);
  return textElement && textElement.textContent
    ? textElement.textContent
    : undefined;
}
function getHarmonyCell(element: Element): HarmonyCell {
  // const sortKey = getTextContent(element, 'sortKey');
  // const verseRef = element.querySelector('verseRef');
  const verseRefs = Array.from(element.querySelectorAll('verseRef')).map(
    (verseRefElement): string => {
      return verseRefElement.id;
    },
  );
  return {
    verse: undefined,
    sortKey: undefined,
    verseRef: verseRefs ? verseRefs : undefined,
  };

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

async function getHarmonyChapters(document: Document): Promise<Harmony[]> {
  return await Promise.all(
    Array.from(document.querySelectorAll('.body-block')).map(
      async (harmony): Promise<Harmony> => {
        const title = getTextContent(document, 'title');
        const titleNumber = getTextContent(harmony, 'p.title-number');
        const rows = getHarmonyRow(harmony);

        const id = await getChapterID(document, await getLanguage(document));
        console.log(id);

        return {
          _id: `${id}-harmony`,
          harmonyRows: rows,
          title: title,
          titleNumber: titleNumber,
          _rev: undefined,
        };
      },
    ),
  );
}

async function main(): Promise<void> {
  let c = 0;
  try {
    await mkdirp(normalize('../scripture_files/scriptures/harmony'));
  } catch (error) {}
  console.log(await getHarmoniesFileNames());

  (await getHarmoniesFileNames()).map(
    async (fileName): Promise<void> => {
      try {
        const file = await readFile(fileName);
        const document = new JSDOM(file).window.document;

        // console.log(document);

        const harmonies = await getHarmonyChapters(document);
        // console.log(harmonies);

        c = c + 1;
        await writeFile(
          normalize(`../scripture_files/scriptures/harmony/harmony-${c}.json`),
          JSON.stringify(harmonies),
        );
      } catch (error) {}
    },
  );
}

main();
