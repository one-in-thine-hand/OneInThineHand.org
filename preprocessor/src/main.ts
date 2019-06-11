/* eslint-disable @typescript-eslint/no-var-requires */
const FastGlob = require('fast-glob');
import { normalize } from 'path';
import { uniq } from 'lodash';
import { FormatTags } from '../../format-tags/src/main';
import { readFile, pathExists, mkdirp, writeFile } from 'fs-extra';
import { basename } from 'path';
import { JSDOM } from 'jsdom';
import { ChapterProcessor } from '../../chapter/src/main';
import { NoteProcessor } from '../../notes/src/main';
import {
  getID,
  getLanguage,
} from '../../shared/src/functions/getFormatTagType';
import { Note } from '../../shared/src/shared';

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
        // const directory = normalize(
        //   dirname(
        //     scriptureFileName.replace('scriptures_unprocessed', 'scriptures'),
        //   ),
        // );
        // if (!(await pathExists(directory))) {
        //   await mkdirp(directory);
        // }
        const directory = normalize(
          `../scripture_files/scriptures/scriptures/`,
        );
        // console.log(await pathExists(directory));

        if (!(await pathExists(directory))) {
          await mkdirp(directory);
        }
        // console.log(`${directory}/${basename(id)}-verses.json`);

        await writeFile(
          normalize(`${directory}/${basename(id)}-verses.json`),
          JSON.stringify(verses),
        );
        await writeFile(
          normalize(`${directory}/${basename(id)}-chapter.json`),
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
const notesMap: Map<string, Note[]> = new Map();

function mergeNotes(newNotesMap: Map<string, Note[]> | undefined): void {
  if (newNotesMap) {
    newNotesMap.forEach(
      (value, key): void => {
        const notes = notesMap.get(key);
        if (!notes) {
          notesMap.set(key, value);
        } else {
          notes.map(
            (note): void => {
              // console.log(note.secondaryNotes);
              const newNote = value.find(
                (n): boolean => {
                  return n._id === note._id;
                },
              );
              if (newNote && newNote.secondaryNotes) {
                note.secondaryNotes = note.secondaryNotes
                  ? note.secondaryNotes.concat(newNote.secondaryNotes)
                  : newNote.secondaryNotes;

                note.secondaryNotes = uniq(note.secondaryNotes);
              }
              // console.log(note.secondaryNotes);
            },
          );
        }
      },
    );
  }
}

async function main(): Promise<void> {
  if (true) {
    const formaTags = new FormatTags();
    const scriptureFileNames = await getScriptureFiles();
    const chapterProcessor = new ChapterProcessor();

    await processScriptureFiles(
      scriptureFileNames,
      formaTags,
      chapterProcessor,
    );
  }

  const noteProcessor = new NoteProcessor();
  const noteFileNames = await getNoteFiles();

  const promises = noteFileNames.map(
    async (noteFileName): Promise<void> => {
      const noteFile = await readFile(noteFileName, { encoding: 'utf-8' });
      const noteDocument = new JSDOM(noteFile).window.document;
      const newNotesMap = await noteProcessor.run(noteDocument);

      mergeNotes(newNotesMap);
      // if (newNotesMap) {
      //   newNotesMap.forEach(
      //     (value, key): void => {
      //       console.log(`${key} ${value.length}`);
      //     },
      //   );
      // }
    },
  );
  await Promise.all(promises);
  console.log('finished');
  notesMap.forEach(
    async (value, key): Promise<void> => {
      const directory = normalize(`../scripture_files/scriptures/notes/`);
      if (!(await pathExists(directory))) {
        await mkdirp(directory);
      }

      try {
        await writeFile(
          `${directory}/${key.replace('chapter', 'notes')}.json`,
          JSON.stringify(value),
        );
      } catch (error) {
        console.log(error);
      }
    },
  );
}

main();
