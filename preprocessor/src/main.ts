/* eslint-disable @typescript-eslint/no-var-requires */
const FastGlob = require('fast-glob');
import { normalize } from 'path';
import { FormatTags } from '../../format-tags/src/main';
import { readFile } from 'fs-extra';
import { JSDOM } from 'jsdom';
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

  scriptureFileNames.map(
    async (scriptureFileName): Promise<void> => {
      try {
        const scriptureFile = await readFile(normalize(scriptureFileName));
        const document = new JSDOM(scriptureFile).window.document;
        const verses = await formaTags.main(document);

        console.log(verses);

        // console.log(scriptureFile);
      } catch (error) {
        console.log(error);
      }
    },
  );
}

main();
