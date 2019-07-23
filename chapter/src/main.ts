import { parseLanguage } from './parseLanguage';
import { navigation } from '../manifests2.json';
import { Chapter } from './Chapter';
import { parseParagraphs } from './parseParagraphs';
import { parseElementAttribute } from './parseElementAttribute';
import * as he from 'he';
import { getChapterID } from '../../shared/src/functions/getFormatTagType';
import { verseSelectors } from '../../shared/src/shared';
export async function parseNoteIDS(document: Document): Promise<string[]> {
  return Array.from(document.querySelectorAll('footer note')).map(
    (note): string => {
      return note.id;
    },
  );
}
export async function extractInnerHTML(
  document: Document,
  selector: string,
): Promise<string> {
  const html = document.querySelector(selector);
  if (html !== undefined && html !== null) {
    return he.decode(html.innerHTML);
  }

  return '';
}

export async function parseChapter(
  document: Document,
): Promise<Chapter | undefined> {
  const chapter = new Chapter();
  const language = await parseLanguage(document);

  const id = await getChapterID(document, language);

  const paragraphs = await parseParagraphs(document);
  const dataAid = await parseElementAttribute(document, 'html', 'data-aid');
  const noteIDs = await parseNoteIDS(document);

  const shortTitle = await extractInnerHTML(document, '[type=short-citation]');
  const title = await extractInnerHTML(document, 'title');
  // console.log(id);

  chapter._id = id;

  // if (chapter._id.startsWith('jst-')) {
  //   chapter._id = chapter._id.replace('jst-', 'jst_');
  //   if (!chapter._id.startsWith(language)) {
  //     chapter._id = `${language}-${chapter._id}`;
  //   }
  // }

  chapter.verseIDS = Array.from(
    document.querySelectorAll(verseSelectors.toString()),
  ).map(
    (v): string => {
      return `${chapter._id.replace('chapter', '')}${
        v.id.startsWith('p') ? v.id.replace('p', '') : v.id
      }-verse`;
    },
  );
  // console.log(ver);

  // console.log(
  //   `#/${id
  //     .replace(`${language}-`, '')
  //     .replace('-chapter', '')
  //     .replace('-', '/')
  //     .replace('_', '-')}`,
  // );

  const value = navigation.find(
    (n): boolean => {
      return (
        n.href ===
        `#/${id
          .replace(`${language}-`, '')
          .replace('-chapter', '')
          .replace('-', '/')}`
      );
    },
  );

  if (value) {
    const index = navigation.indexOf(value);
    if (index !== undefined) {
      if (index === 0) {
        chapter.previousPage = navigation[navigation.length - 1].href;
      } else {
        chapter.previousPage = navigation[index - 1].href;
      }
      if (index === navigation.length - 1) {
        chapter.nextPage = navigation[0].href;
      } else {
        chapter.nextPage = navigation[index + 1].href;
      }
    }
  }

  chapter.language = language;
  chapter.paragraphs = paragraphs;
  chapter.dataAid = dataAid;
  chapter.notesIDs = noteIDs.length > 0 ? noteIDs : undefined;
  chapter.versesFileID = `${id}-wtags`;
  chapter.notesFileID = `${id}-notes`;
  chapter.shortTitle = shortTitle;
  chapter.title = title;

  return chapter;
}

// async function main(do): Promise<void> {
//   // await getFiles();
//   // console.log(await getFiles());
//   try {
//     const promises = (await getScriptureFiles()).map(
//       async (fileName: string): Promise<void> => {
//         try {
//           const file = await readFile(normalize(fileName));
//           const document = new JSDOM(file).window.document;

//           const chapter = await parseChapter(document);
//           if (chapter) {
//             // const outPath = normalize(
//             //   expandTilde(
//             //     `~/source/repos/scripture_files/scriptures/${chapter._id}.json`,
//             //   ),
//             // );
//             // // console.log(chapter);
//             writeScriptureFile(chapter, `${chapter._id}.json`);

//             // await writeFile(outPath, JSON.stringify(chapter));

//             // await writeFile(
//             //   normalize(
//             //     `../src/assets/scripture_files/${await parseID(
//             //       document,
//             //       chapter.language,
//             //     )}-chapter.json`,
//             //   ),
//             //   JSON.stringify(chapter),
//             // );
//           }
//         } catch (error) {
//           console.log(error);
//         }
//       },
//     );
//     await Promise.all(promises);
//     console.log('asdfoikjasdf');
//   } catch (error) {
//     console.log(error);
//   }
// }

// main();
// console.log('adsf');

export class ChapterProcessor {
  /**
   * main
   */
  public async main(document: Document): Promise<Chapter | undefined> {
    try {
      // const chapter= new Chapter()

      return await parseChapter(document);
      // return chapter
    } catch (error) {
      console.log(error);

      return undefined;
    }
  }
}
