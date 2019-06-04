/* eslint-disable @typescript-eslint/no-var-requires */
const FastGlob = require('fast-glob');
import { normalize } from 'path';
import { FormatTags } from '../../format-tags/src/main';
import { readFile, pathExists, mkdirp, writeFile } from 'fs-extra';
import { dirname, basename } from 'path';
import { JSDOM } from 'jsdom';
import { ChapterProcessor } from '../../chapter/src/main';
import { NoteProcessor } from '../../notes/src/main';
import {
  getID,
  getLanguage,
} from '../../shared/src/functions/getFormatTagType';

export async function getFiles(folderGlob: string): Promise<string[]> {
  try {
    return FastGlob(normalize(folderGlob), {
      onlyFiles: true,
    });
  } catch (error) {
    return [];
  }
}

export async function getScriptureFiles(): Promise<string[]> {
  return getFiles('../scripture_files/scriptures_unprocessed/**/**');
}

export async function getNoteFiles(): Promise<string[]> {
  return getFiles('../scripture_files/notes/**/**');
}

async function processScriptureFiles(
  scriptureFileNames: string[],
  formaTags: FormatTags,
  chapterProcessor: ChapterProcessor,
): Promise<void> {
  const totalCount = scriptureFileNames.length;
  let count = 0;
  const promises = scriptureFileNames.map(
    async (scriptureFileName): Promise<void> => {
      try {
        const scriptureFile = await readFile(normalize(scriptureFileName));
        const document = new JSDOM(scriptureFile).window.document;
        const verses = await formaTags.main(document);
        const chapter = await chapterProcessor.main(document);
        const lang = await getLanguage(document);
        const id = await getID(document, lang);
        // console.log(chapter);
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
        count = count + 1;

        console.log(`${count}/${totalCount}`);

        // console.log(verses);
        // console.log(scriptureFile);
      } catch (error) {
        console.log(error);
      }
    },
  );

  await Promise.all(promises);
}

async function main(): Promise<void> {
  const formaTags = new FormatTags();
  const scriptureFileNames = await getScriptureFiles();
  const chapterProcessor = new ChapterProcessor();

  const noteProcessor = new NoteProcessor();

  await processScriptureFiles(scriptureFileNames, formaTags, chapterProcessor);

  const noteFileNames = await getNoteFiles();

  noteFileNames.map(
    async (noteFileName): Promise<void> => {
      const noteFile = await readFile(noteFileName);
      const noteDocument = new JSDOM(noteFile).window.document;
      await noteProcessor.run(noteDocument);
    },
  );
}

main();
