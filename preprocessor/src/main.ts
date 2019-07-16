// const FastGlob = require('fast-glob');
import FastGlob from 'fast-glob';
import { readFile } from 'fs-extra';
// import { basename } from 'path';
import { JSDOM } from 'jsdom';
import { uniq } from 'lodash';
import { normalize } from 'path';
import { Chapter } from '../../chapter/src/Chapter';
import { ChapterProcessor } from '../../chapter/src/main';
import { ChapterVerses, FormatTags } from '../../format-tags/src/main';
import { ChapterNotes, NoteProcessor } from '../../notes/src/main';
import { Verse } from '../../shared/src/shared';
import { arrayToFile } from './arrayToFile';

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

// function sliceArray<T>(array: T[], chunkSizes: number): T[][] {
//   const newArray: T[][] = [];
//   let x = 0;
//   while (x < array.length) {
//     newArray.push(array.slice(x, x + chunkSizes));
//     x = x + chunkSizes;
//   }
//   return newArray;
// }
// tslint:disable-next-line: max-func-body-length
async function processScriptureFiles(
  scriptureFileNames: string[],
  formaTags: FormatTags,
  chapterProcessor: ChapterProcessor,
): Promise<void> {
  const allVerses: Verse[] = [];
  const promises = scriptureFileNames.map(
    async (
      scriptureFileName,
    ): Promise<[Chapter, ChapterVerses] | undefined> => {
      try {
        const scriptureFile = await readFile(normalize(scriptureFileName));
        const document = new JSDOM(scriptureFile).window.document;
        const html = document.querySelector('html');
        const fileTypeAttr = html
          ? html.getAttribute('data-content-type') === 'chapter'
          : undefined;
        if (fileTypeAttr !== undefined) {
          const verses = await formaTags.main(document);
          const chapter = await chapterProcessor.main(document);
          if (chapter !== undefined && verses !== undefined) {
            return [chapter, verses];
          } else {
            return undefined;
          }
          // const lang = await getLanguage(document);
          // const id = await getID(document, lang);
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
          // const directory = normalize(
          //   `../scripture_files/scriptures/scriptures/`,
          // );
          // // console.log(await pathExists(directory));

          // if (!(await pathExists(directory))) {
          //   await mkdirp(directory);
          // }
          // // console.log(`${directory}/${basename(id)}-verses.json`);

          // if (verses && verses.verses) {
          //   allVerses = allVerses.concat(verses.verses);
          // }
          // await writeFile(
          //   normalize(
          //     `${directory}/${basename(verses ? verses._id : 'failed')}.json`,
          //   ),
          //   JSON.stringify(verses),
          // );
          // await writeFile(
          //   normalize(
          //     `${directory}/${basename(chapter ? chapter._id : 'failed')}.json`,
          //   ),
          //   JSON.stringify(chapter),
          // );
          // count = count + 1;

          // console.log(`${count}/${totalCount}`);
        }

        // console.log(verses);
        // console.log(scriptureFile);
      } catch (error) {
        console.log('iojasdfoiajsdfoij');

        console.log(error);

        return undefined;
      }

      return undefined;
    },
  );

  try {
    const chaptersVases = (await Promise.all(promises)).filter(
      (chapterV): boolean => {
        return chapterV !== undefined;
      },
    ) as [Chapter, ChapterVerses][];
    console.log(allVerses.length);

    const cVerses = chaptersVases.map(
      (v): ChapterVerses => {
        return v[1];
      },
    );
    await arrayToFile(cVerses, 'chapterVerses');
    const chapters = chaptersVases.map(
      (v): Chapter => {
        return v[0];
      },
    );
    await arrayToFile(chapters, 'chapters');
  } catch (error) {
    console.log(error);
  }

  // try {
  //   await mkdirp(`../scripture_files/scriptures/verses/`);
  // } catch (error) {}
  // let c = 1;
  // const p = sliceArray(allVerses, 100).map(
  //   async (slice): Promise<void> => {
  //     // console.log(slice);

  //     try {
  //       c = c + 1;
  //       await writeFile(
  //         normalize(`../scripture_files/scriptures/verses/verses-${c}.json`),
  //         JSON.stringify(slice),
  //       );
  //       console.log(c);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  // );
  // await Promise.all(p);
}
const notesMap: Map<string, ChapterNotes> = new Map();

function mergeNotes(newNotesMap: Map<string, ChapterNotes> | undefined): void {
  if (newNotesMap !== undefined) {
    newNotesMap.forEach(
      (value, key): void => {
        const notes = notesMap.get(key);
        if (notes === undefined) {
          notesMap.set(key, value);
        } else if (notes !== undefined && notes.notes !== undefined) {
          notes.notes.map(
            (note): void => {
              // console.log(note.notes);

              if (value.notes !== undefined) {
                const newNote = value.notes.find(
                  (n): boolean => {
                    return n._id === note._id;
                  },
                );
                if (newNote !== undefined && newNote.notes !== undefined) {
                  note.notes = note.notes
                    ? note.notes.concat(newNote.notes)
                    : newNote.notes;

                  note.notes = uniq(note.notes);
                }
                // if (note.notes) {
                //   note.notes.map(
                //     (n): void => {
                //       n.noteRefs = sortBy(
                //         n.noteRefs,
                //         (noteRef): number => {
                //           return noteRef.noteCategory
                //             ? noteRef.noteCategory
                //             : 0;
                //         },
                //       );
                //     },
                //   );
                //   note.notes = sortBy(
                //     note.notes,
                //     (n): number => {
                //       return n.noteType ? n.noteType : 0;
                //     },
                //   );
                // }
              }
              // console.log(note.notes);
            },
          );
        }
      },
    );
  }
}

async function main(): Promise<void> {
  if (false) {
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

      try {
        mergeNotes(newNotesMap);
      } catch (error) {
        console.log('oiasjdfoiajdfoijadoifjaoisdfjoaisdjfoijasd');
      }
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
  try {
    await arrayToFile(Array.from(notesMap.values()), 'notes');
  } catch (error) {
    console.log(error);
  }

  // notesMap.forEach(
  //   async (value, key): Promise<void> => {
  //     const directory = normalize(`../scripture_files/scriptures/notes/`);
  //     if (!(await pathExists(directory))) {
  //       await mkdirp(directory);
  //     }

  //     console.log(`${directory}/${key.replace('chapter', 'notes')}.json`);

  //     try {
  //       await writeFile(
  //         `${directory}${key.replace('chapter', 'notes')}.json`,
  //         JSON.stringify(value),
  //       );
  //     } catch (error) {
  //       console.log('oiasjdfoiajsdfoijadsfoijadsoifj');

  //       console.log(error);
  //     }
  //   },
  // );
}
console.clear();
main();
