import { Injectable } from '@angular/core';
import { NoteProcessor, ChapterNotes } from '../../../../notes/src/main';
import { ChapterProcessor } from '../../../../chapter/src/main';
import * as JSZip from 'jszip';
import { DatabaseService, DatabaseItem } from './database.service';
import { FormatTags } from '../../../../format-tags/src/main';
import { Note } from '../../../../shared/src/shared';
import PQueue from 'p-queue';

@Injectable({
  providedIn: 'root',
})
export class PreprocessorService {
  private noteProcessor = new NoteProcessor();
  private formatTagProcessor = new FormatTags();
  private chapterProcessor = new ChapterProcessor();
  public constructor(private databaseService: DatabaseService) {}

  private sliceArray<T>(array: T[], chunkSizes: number): T[][] {
    const newArray: T[][] = [];
    let x = 0;
    while (x < array.length) {
      newArray.push(array.slice(x, x + chunkSizes));
      x = x + chunkSizes;
    }
    return newArray;
  }

  public async loadChapterFiles(event: Event): Promise<void> {
    const zipFiles = (event.target as HTMLInputElement).files;
    console.log(zipFiles);

    //
    if (zipFiles) {
      const queue = new PQueue({ concurrency: 1 });
      const promises = Array.from(zipFiles).map(
        async (zipFile): Promise<void> => {
          if (zipFile.type === 'application/x-zip-compressed') {
            try {
              const data = await new Response(zipFile).arrayBuffer();
              const files = await JSZip.loadAsync(data);
              const onlyFiles = this.sliceArray(
                Object.keys(files.files).filter((key): boolean => {
                  return files.files[key].dir === false;
                }),
                100,
              );

              const promises = onlyFiles.map(
                async (onlyFile): Promise<void> => {
                  await queue.add(
                    async (): Promise<void> => {
                      const items: DatabaseItem[] = [];
                      const promises = onlyFile.map(
                        async (key): Promise<void> => {
                          try {
                            // console.log(files.files[key]);
                            const file = JSON.parse(
                              await files
                                .file(files.files[key].name)
                                .async('text'),
                            ) as { _id: string; _rev: string | undefined };
                            // console.log(file);
                            // console.log(file);
                            items.push(file);
                            // await this.databaseSerQvice.updateDatabaseItem(file);
                          } catch (error) {
                            console.log(error);
                          }
                        },
                      );
                      await Promise.all(promises);
                      console.log(items);
                      await this.databaseService.bulkDocs(items);
                    },
                  );
                },
              );
              await Promise.all(promises);

              // const promises = Object.keys(files.files)
              //   .filter((key): boolean => {
              //     return files.files[key].dir === false;
              //   })
              //   .map(
              //     async (key): Promise<void> => {
              //       try {
              //         // console.log(files.files[key]);
              //         const file = JSON.parse(
              //           await files.file(files.files[key].name).async('text'),
              //         ) as { _id: string; _rev: string | undefined };
              //         // console.log(file);
              //         console.log(file);
              //         items.push(file);
              //         // await this.databaseService.updateDatabaseItem(file);
              //       } catch (error) {
              //         console.log(error);
              //       }
              //     },
              //   );
              // await Promise.all(promises);
            } catch (error) {
              console.log(error);
            }
          }
        },
      );
      // queue.
      // console.log(promises.length);
      await Promise.all(promises);
      // console.log(items);

      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
      console.log('Finished');
    }
  }

  private processChapterFiles(files: JSZip) {}

  public async loadNoteFiles(event: Event): Promise<void> {
    const zipFiles = (event.target as HTMLInputElement).files;

    const notesMap = new Map<string, ChapterNotes>();
    //
    if (zipFiles) {
      const promises = Array.from(zipFiles).map(
        async (zipFile): Promise<void> => {
          if (zipFile.type === 'application/x-zip-compressed') {
            try {
              const data = await new Response(zipFile).arrayBuffer();
              const files = await JSZip.loadAsync(data);
              const promises = Object.keys(files.files)
                .filter((key): boolean => {
                  return files.files[key].dir === false;
                })
                .map(
                  async (key): Promise<void> => {
                    try {
                      // console.log(files.files[key]);
                      const file = await files
                        .file(files.files[key].name)
                        .async('text');
                      // console.log(file);

                      // const file = await files.file(fileName).async('text');
                      // console.log(file);

                      const dom = new DOMParser();
                      const newDocument = dom.parseFromString(
                        file,
                        'application/xml',
                      );
                      const notes = await this.noteProcessor.run(newDocument);
                      if (notes) {
                        notes.forEach((value, key): void => {
                          if (notesMap.has(key) && value.notes) {
                            const noteChapter = notesMap.get(key);
                            if (noteChapter && noteChapter.notes) {
                              value.notes.forEach((note): void => {
                                if (noteChapter.notes) {
                                  this.mergeSecondaryNotes(
                                    noteChapter.notes,
                                    note,
                                  );
                                }
                              });
                            }
                          } else {
                            console.log('adsfasdf');
                            notesMap.set(key, value);
                          }
                        });
                      }
                      console.log(notes);

                      // await this.databaseService.updateDatabaseItem(notes);
                    } catch (error) {
                      console.log(error);
                    }
                  },
                );
              await Promise.all(promises);
            } catch (error) {
              console.log(error);
            }
          }
        },
      );
      await Promise.all(promises);
      Array.from(notesMap.values()).map(
        async (noteChapter): Promise<void> => {
          await this.databaseService.updateDatabaseItem(noteChapter);
        },
      );
      console.log('Finished');
    }
  }
  public mergeSecondaryNotes(notes: Note[], note: Note): void {
    const saveNote = notes.find((n): boolean => {
      return n._id === note._id;
    });
    console.log(note.secondaryNotes);

    if (saveNote) {
      if (saveNote.secondaryNotes && note.secondaryNotes) {
        saveNote.secondaryNotes = saveNote.secondaryNotes.concat(
          note.secondaryNotes,
        );
      } else if (saveNote.secondaryNotes === undefined && note.secondaryNotes) {
        saveNote.secondaryNotes = note.secondaryNotes;
      }
    } else {
      notes.push(note);
    }
  }
}
