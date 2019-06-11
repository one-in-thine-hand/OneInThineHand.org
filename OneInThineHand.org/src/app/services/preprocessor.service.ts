import { Injectable } from '@angular/core';
import { NoteProcessor } from '../../../../notes/src/main';
import { ChapterProcessor } from '../../../../chapter/src/main';
import * as JSZip from 'jszip';

@Injectable({
  providedIn: 'root',
})
export class PreprocessorService {
  private noteProcessor = new NoteProcessor();
  private chapterProcessor = new ChapterProcessor();
  public constructor() {}

  public async loadChapterFiles(event: Event): Promise<void> {
    const zipFiles = (event.target as HTMLInputElement).files;
    console.log(zipFiles);

    //
    if (zipFiles) {
      Array.from(zipFiles).map((zipFile): void => {
        if (zipFile.type === 'application/x-zip-compressed') {
          const reader = new FileReader();
          reader.onload = async (): Promise<void> => {
            try {
              const zip = new JSZip();
              const files = await zip.loadAsync(zipFile);

              files.forEach(
                async (fileName): Promise<void> => {
                  try {
                    console.log(fileName);

                    const file = await files.file(fileName).async('text');
                    // console.log(file);

                    const dom = new DOMParser();
                    const newDocument = dom.parseFromString(
                      file,
                      'application/xml',
                    );
                    const chapter = await this.chapterProcessor.main(
                      newDocument,
                    );
                    if (
                      chapter === undefined ||
                      (chapter.title === '' || chapter.shortTitle === '')
                    ) {
                      throw 'File not a chapter';
                    }
                    console.log(chapter);
                  } catch (error) {
                    console.log(error);
                  }
                },
              );
            } catch (error) {
              console.log(error);
            }
          };

          reader.readAsArrayBuffer(zipFile);
        }
      });
    }
    console.log(zipFiles);
  }

  public async loadNoteFiles(event: Event): Promise<void> {
    const zipFiles = (event.target as HTMLInputElement).files;

    //
    if (zipFiles) {
      Array.from(zipFiles).map((zipFile): void => {
        if (zipFile.type === 'application/x-zip-compressed') {
          const reader = new FileReader();

          reader.onload = async (): Promise<void> => {
            try {
              const zip = new JSZip();
              const files = await zip.loadAsync(zipFile);

              files.forEach(
                async (fileName): Promise<void> => {
                  try {
                    const file = await files.file(fileName).async('text');
                    // console.log(file);

                    const dom = new DOMParser();
                    const newDocument = dom.parseFromString(
                      file,
                      'application/xml',
                    );
                    const notes = await this.noteProcessor.run(newDocument);
                    console.log(notes);
                  } catch (error) {
                    console.log(error);
                  }
                },
              );
            } catch (error) {
              console.log(error);
            }
          };

          reader.readAsArrayBuffer(zipFile);
        }
      });
    }
    console.log(zipFiles);
  }
}
