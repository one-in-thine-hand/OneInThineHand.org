/* eslint-disable @typescript-eslint/no-var-requires */
const FastGlob = require('fast-glob');
import { normalize } from 'path';
import { FormatTags } from '../../format-tags/src/main';
import { readFile, pathExists, mkdirp, writeFile } from 'fs-extra';
import { dirname, basename } from 'path';
import { JSDOM } from 'jsdom';
import { ChapterProcessor } from '../../chapter/src/main';
import {
  getID,
  getLanguage,
} from '../../shared/src/functions/getFormatTagType';
export async function getScriptureFiles(): Promise<string[]> {
  try {
    return FastGlob(
      normalize('../scripture_files/scriptures_unprocessed/**/**'),
      {
        onlyFiles: true,
      },
    );
  } catch (error) {
    return [];
  }
}

async function main(): Promise<void> {
  const formaTags = new FormatTags();
  const scriptureFileNames = await getScriptureFiles();
  const chapterProcessor = new ChapterProcessor();

  scriptureFileNames.map(
    async (scriptureFileName): Promise<void> => {
      try {
        const scriptureFile = await readFile(normalize(scriptureFileName));
        const document = new JSDOM(scriptureFile).window.document;
        const verses = await formaTags.main(document);

        const chapter = await chapterProcessor.main(document);

        const lang = await getLanguage(document);
        const id = await getID(document, lang);
        console.log(chapter);

        // getID()
        // console.log(dirname(normalize(scriptureFileName)));
        const directory = normalize(
          dirname(
            scriptureFileName.replace('scriptures_unprocessed', 'scriptures'),
          ),
        );
        if (!(await pathExists(directory))) {
          await mkdirp(directory);
        }
        await writeFile(
          `${directory}/${basename(id)}-verses.json`,
          JSON.stringify(verses),
        );
        await writeFile(
          `${directory}/${basename(id)}-chapter.json`,
          JSON.stringify(chapter),
        );

        // console.log(verses);

        // console.log(scriptureFile);
      } catch (error) {
        console.log(error);
      }
    },
  );
}

main();
