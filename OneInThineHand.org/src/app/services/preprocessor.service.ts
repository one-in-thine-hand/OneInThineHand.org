import { Injectable } from '@angular/core';
import { NoteProcessor, ChapterNotes } from '../../../../notes/src/main';
// import * as JSZip from 'jszip';
import JSZip from 'jszip';

import { DatabaseService, DatabaseItem } from './database.service';
import { VerseNotes, CouchDoc } from '../../../../shared/src/shared';
import PQueue from 'p-queue';
import { flatten } from '@angular/compiler';
import { SaveStateService } from './save-state.service';

@Injectable({
  providedIn: 'root',
})
export class PreprocessorService {
  public count = 0;
  public fileCount = 0;
  // private chapterProcessor = new ChapterProcessor();
  public constructor(
    private databaseService: DatabaseService,
    public saveStateService: SaveStateService,
  ) {}
  private noteProcessor = new NoteProcessor();
  private zipMimeTypes = [
    'application/zip',
    'application/octet-stream',
    'application/x-zip-compressed',
    'multipart/x-zip',
  ];
  public async loadChapterFiles(event: Event): Promise<void> {
    //  this.settingsService.loading = true;
    this.count = 0;
    console.log(event);

    const fileUploadElement = document.querySelector('#chapterFileOpener') as
      | HTMLInputElement
      | undefined;

    if (fileUploadElement && fileUploadElement.files) {
      // console.log();

      const p = Array.from(fileUploadElement.files)
        .filter((file): boolean => {
          return file.name.includes('.zip');
        })
        .map(
          async (zipFile): Promise<void> => {
            console.log(zipFile);
            const zip = new JSZip();
            const unziped = await zip.loadAsync(zipFile);

            const allDocs = await this.databaseService.allDocs();
            console.log(allDocs);

            console.log(allDocs);
            // console.log(u);
            const onlyFiles = Object.keys(unziped.files).filter(
              (key): boolean => {
                return unziped.files[key].dir === false;
              },
            );
            this.fileCount = onlyFiles.length;

            const docs = await flatten(
              onlyFiles.map(
                async (file): Promise<void> => {
                  const d = JSON.parse(
                    await unziped.file(file).async('text'),
                  ) as DatabaseItem[];
                  await this.databaseService.setDocsRev(d, allDocs);
                  await this.databaseService.bulkDocs(d);
                  this.count = this.count + 1;
                  // console.log(this.count);

                  // console.log(this.count / this.fileCount);
                },
              ),
            );
            console.log(docs.length);

            await Promise.all(docs);
          },
        );
      await Promise.all(p);
    }

    await this.saveStateService.loadNoteTypes();
    // try {
    //   const zipFiles = target.files;
    //   console.log(zipFiles);

    //   //
    //   if (zipFiles) {
    //     const queue = new PQueue({ concurrency: 100 });
    //     const promises = Array.from(zipFiles).map(
    //       async (zipFile): Promise<void> => {
    //         if (this.zipMimeTypes.includes(zipFile.type)) {
    //           try {
    //             const data = await new Response(zipFile).arrayBuffer();
    //             const files = await JSZip.loadAsync(data);
    //             const onlyFiles = Object.keys(files.files).filter(
    //               (key): boolean => {
    //                 return files.files[key].dir === false;
    //               },
    //             );

    //             let allDocs: DatabaseItem[] = [];
    //             const jjj: (() => Promise<void>)[] = [];

    //             const jt = onlyFiles.map(
    //               async (onlyFile): Promise<void> => {
    //                 jjj.push(
    //                   async (): Promise<void> => {
    //                     try {
    //                       const file = JSON.parse(
    //                         await files
    //                           .file(files.files[onlyFile].name)
    //                           .async('text'),
    //                       ) as {
    //                         _id: string;
    //                         _rev: string | undefined;
    //                       }[];
    //                       // console.log(file);
    //                       allDocs = allDocs.concat(file);
    //                       // await this.databaseService.bulkDocs(file);
    //                       // console.log('Finished');
    //                     } catch (error) {}
    //                   },
    //                 );
    //               },
    //             );
    //             // queue.addAll(jt);
    //             // queue.addAll(() => {});
    //             // queue.start();
    //             await queue.addAll(jjj);
    //             // await Promise.all(jt);
    //             const d = await this.databaseService.allDocs();
    //             if (d) {
    //               d.rows.map((r): void => {
    //                 const a = allDocs.find((jj): boolean => {
    //                   return jj._id === r.id;
    //                 });
    //                 if (a) {
    //                   a._rev = r.value.rev;
    //                 }
    //               });
    //             }
    //             console.log(allDocs);
    //             // await this.databaseService.bulkDocs(allDocs);
    //             const t = this.sliceArray(allDocs, 1000).map(
    //               async (array): Promise<void> => {
    //                 await this.databaseService.bulkDocs(array);
    //                 // await queue.add(
    //                 //   async (): Promise<void> => {
    //                 //     console.log('gongg');
    //                 //   },
    //                 // );
    //               },
    //             );
    //             await Promise.all(t);

    //             // const promises = onlyFiles.map(
    //             //   async (onlyFile): Promise<void> => {
    //             //     await queue.add(
    //             //       async (): Promise<void> => {
    //             //         let items: DatabaseItem[] = [];

    //             //         const promises = onlyFile.map(
    //             //           async (key): Promise<void> => {
    //             //             try {
    //             //               // console.log(files.files[key]);
    //             //               const file = JSON.parse(
    //             //                 await files
    //             //                   .file(files.files[key].name)
    //             //                   .async('text'),
    //             //               ) as { _id: string; _rev: string | undefined };
    //             //               // console.log(file);
    //             //               // console.log(file);
    //             //               console.log(typeof file);
    //             //               items = items.concat(file);

    //             //               // await this.databaseSerQvice.updateDatabaseItem(file);
    //             //             } catch (error) {
    //             //               console.log(error);
    //             //             }
    //             //           },
    //             //         );
    //             //         await Promise.all(promises);
    //             //         console.log(items);
    //             //         await this.databaseService.bulkDocs(items);
    //             //       },
    //             //     );
    //             //   },
    //             // );
    //             // await Promise.all(promises);

    //             // const promises = Object.keys(files.files)
    //             //   .filter((key): boolean => {
    //             //     return files.files[key].dir === false;
    //             //   })
    //             //   .map(
    //             //     async (key): Promise<void> => {
    //             //       try {
    //             //         // console.log(files.files[key]);
    //             //         const file = JSON.parse(
    //             //           await files.file(files.files[key].name).async('text'),
    //             //         ) as { _id: string; _rev: string | undefined };
    //             //         // console.log(file);
    //             //         console.log(file);
    //             //         items.push(file);
    //             //         // await this.databaseService.updateDatabaseItem(file);
    //             //       } catch (error) {
    //             //         console.log(error);
    //             //       }
    //             //     },
    //             //   );
    //             // await Promise.all(promises);
    //           } catch (error) {
    //             console.log(error);
    //           }
    //         }
    //       },
    //     );
    //     // queue.
    //     // console.log(promises.length);
    //     await Promise.all(promises);
    //     // console.log(items);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  }

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
              const p = Object.keys(files.files)
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
                        notes.forEach((value, k): void => {
                          if (notesMap.has(k) && value.notes) {
                            const noteChapter = notesMap.get(k);
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
                            notesMap.set(k, value);
                          }
                        });
                      }
                      // console.log(notes);

                      // await this.databaseService.updateDatabaseItem(notes);
                    } catch (error) {
                      console.log(error);
                    }
                  },
                );
              await Promise.all(p);
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
  public mergeSecondaryNotes(notes: VerseNotes[], note: VerseNotes): void {
    const saveNote = notes.find((n): boolean => {
      return n._id === note._id;
    });
    // console.log(note.notes);

    if (saveNote) {
      if (saveNote.notes && note.notes) {
        saveNote.notes = saveNote.notes.concat(note.notes);
      } else if (saveNote.notes === undefined && note.notes) {
        saveNote.notes = note.notes;
      }
    } else {
      notes.push(note);
    }
  }

  private sliceArray<T>(array: T[], chunkSizes: number): T[][] {
    const newArray: T[][] = [];
    let x = 0;
    while (x < array.length) {
      newArray.push(array.slice(x, x + chunkSizes));
      x = x + chunkSizes;
    }
    return newArray;
  }
}
