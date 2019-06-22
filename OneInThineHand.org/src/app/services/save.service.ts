import { Injectable } from '@angular/core';
import { ChapterService } from './chapter.service';
import PQueue from 'p-queue';
import { DatabaseService } from './database.service';
import { cloneDeep } from 'lodash';
import { Note, VerseNotes } from '../../../../shared/src/shared';

@Injectable({
  providedIn: 'root',
})
export class SaveService {
  private interval: NodeJS.Timer | undefined;

  private saveQueue = new PQueue({ concurrency: 1 });
  public constructor(
    private chaterService: ChapterService,
    private databaseService: DatabaseService,
  ) {}

  public start(): void {
    {
      // if (this.interval === undefined)
      //   this.interval = setInterval(async (): Promise<void> => {
      //     await this.save();
      //   }, 100000);
    }
  }

  public async save(): Promise<void> {
    if (this.chaterService.chapterNotes !== undefined) {
      await this.saveQueue.add(
        async (): Promise<void> => {
          if (this.chaterService.chapterNotes) {
            if (this.chaterService.chapterNotes.save === true) {
              this.chaterService.chapterNotes.save = undefined;
              const temp = cloneDeep(this.chaterService.chapterNotes);
              temp.notes = temp.notes
                ? temp.notes.map(
                    (verseNotes): VerseNotes => {
                      verseNotes.notes = verseNotes.notes
                        ? verseNotes.notes.map(
                            (note): Note => {
                              note.formatTag = undefined;
                              return note;
                            },
                          )
                        : verseNotes.notes;
                      return verseNotes;
                    },
                  )
                : temp.notes;
              await this.databaseService.updateDatabaseItem(temp);
              console.log('Finished');
            }
          } else {
            if (this.interval) {
              clearInterval(this.interval);
              console.log('closed');
            }
          }
        },
      );
    }
  }
}
