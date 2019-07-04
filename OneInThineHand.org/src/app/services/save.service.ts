import { Injectable } from '@angular/core';
import { ChapterService } from './chapter.service';
import PQueue from 'p-queue';
import { DatabaseService } from './database.service';
import { cloneDeep } from 'lodash';
import {
  Note,
  VerseNotes,
  FormatGroup,
  FormatTagType,
} from '../../../../shared/src/shared';
import {
  FakeVerseBreaks,
  VerseBreaks,
} from '../../../../shared/src/models/Verse';
import {
  FormatGroupPart,
  FormatGroupPara,
  FormatGroupParaGap,
  FormatGroupLine,
  FormatGroupLineGap,
  FormatGroupBlock,
  FormatGroupBlockGap,
  FormatGroupText,
} from '../../../../shared/src/models/format_groups/FormatGroup';
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
  private convertFormatTagsToFormatGroups(
    fakeVerseBreak: FakeVerseBreaks,
  ): FormatGroup[] {
    if (fakeVerseBreak && fakeVerseBreak.breaks) {
      return fakeVerseBreak.breaks
        .map((brk): FormatGroup | undefined => {
          let formatGroup: FormatGroup | undefined;
          switch (brk.formatType) {
            case FormatTagType.Para: {
              formatGroup = new FormatGroupPara();
              formatGroup.offsets = brk.offsets;
              break;
            }
            case FormatTagType.ParaGap: {
              formatGroup = new FormatGroupParaGap();
              break;
            }
            case FormatTagType.Line: {
              formatGroup = new FormatGroupLine();
              formatGroup.offsets = brk.offsets;
              break;
            }
            case FormatTagType.LineGap: {
              formatGroup = new FormatGroupLineGap();
              break;
            }
            case FormatTagType.BlockGap: {
              formatGroup = new FormatGroupBlockGap();
              break;
            }
            case FormatTagType.Block: {
              formatGroup = new FormatGroupBlock();
              formatGroup.offsets = brk.offsets;
              break;
            }
            case FormatTagType.Plain: {
              formatGroup = new FormatGroupText();
              formatGroup.offsets = brk.offsets;
              break;
            }

            default: {
              console.log('Error Error');

              break;
            }
          }

          return formatGroup;
        })
        .filter((formatGroup): boolean => {
          return formatGroup !== undefined;
        }) as FormatGroup[];
    }
    return [];
  }

  private generateBreaks():
    | {
        _id: string;
        _rev: string | undefined;
        verseBreaks: {
          _id: string;
          breaks: FormatGroup[];
        }[];
      }
    | undefined {
    if (
      this.chaterService.chapterVerses &&
      this.chaterService.chapterVerses.verses
    ) {
      const _id = this.chaterService.chapterVerses._id
        ? this.chaterService.chapterVerses._id.replace(
            'chapter-verses',
            'breaks',
          )
        : undefined;
      const breaks = this.chaterService.chapterVerses.verses.map((verse): {
        _id: string;
        breaks: FormatGroup[];
      } => {
        return {
          _id: verse._id ? verse._id.replace('verse', 'verse-breaks') : '',
          breaks: [],
        };
      });
      return { _id: _id ? _id : '', _rev: undefined, verseBreaks: breaks };
    }
    return undefined;
  }

  public async saveFakeVerseBreaks(): Promise<void> {
    let vBreaks:
      | {
          _id: string;
          _rev: string | undefined;
          verseBreaks: {
            _id: string;
            breaks: FormatGroup[];
          }[];
        }
      | undefined;
    if (
      this.chaterService.chapterBreaks &&
      this.chaterService.chapterBreaks.verseBreaks
    ) {
      vBreaks = cloneDeep(this.chaterService.chapterBreaks);
    } else {
      vBreaks = this.generateBreaks();
    }
    console.log(vBreaks);

    // const vBreaks = cloneDeep(this.chaterService.chapterBreaks);

    if (
      this.chaterService.chapterVerses &&
      this.chaterService.chapterVerses.verses
    ) {
      this.chaterService.chapterVerses.verses.map((verse): void => {
        if (vBreaks) {
          const brk = vBreaks.verseBreaks.find((b): boolean => {
            return (
              b._id !== undefined && b._id.replace('-breaks', '') === verse._id
            );
          });
          if (brk && verse.fakeVerseBreak) {
            brk.breaks = this.convertFormatTagsToFormatGroups(
              verse.fakeVerseBreak,
            );
            console.log(brk.breaks);
          } else {
            const a: {
              _id: string;
              breaks: FormatGroup[];
            } = {
              _id: verse._id ? verse._id.replace('verse', 'verse-breaks') : '',
              breaks: [],
            };
            if (verse.fakeVerseBreak) {
              a.breaks = this.convertFormatTagsToFormatGroups(
                verse.fakeVerseBreak,
              );
            } else {
              a.breaks = verse.breakFormatGroups;
            }
          }
        }
      });

      if (vBreaks) {
        await this.databaseService.updateDatabaseItem(vBreaks);
      }

      // this.chaterService.chapterBreaks.verseBreaks.map((verseBreak): void => {
      //   if (
      //     this.chaterService.chapterVerses &&
      //     this.chaterService.chapterVerses.verses
      //   ) {
      //     const verse = this.chaterService.chapterVerses.verses.find(
      //       (v): boolean => {
      //         return (
      //           v._id !== undefined &&
      //           v._id.replace('verse', 'verse-breaks') === verseBreak._id
      //         );
      //       },
      //     );
      //     if (verse) {
      //       verseBreak.breaks = verse.breakFormatGroups;
      //     }
      //     // console.log(verse);
      //   }
      // });
      // // console.log(this.chaterService.chapterBreaks);

      // await this.databaseService.updateDatabaseItem(
      //   this.chaterService.chapterBreaks,
      // );
    }
    // if (
    //   this.chaterService.chapterVerses &&
    //   this.chaterService.chapterVerses.verses
    // ) {
    //   const fakeVerseBreaks = this.chaterService.chapterVerses.verses
    //     .map((verse): FakeVerseBreaks | undefined => {
    //       // console.log(verse.fakeVerseBreak);

    //       return verse.fakeVerseBreak;
    //     })
    //     .filter((v): boolean => {
    //       return v !== undefined;
    //     }) as VerseBreaks[];

    //   if (fakeVerseBreaks.length > 0) {
    //     await this.databaseService.updateDatabaseItems(fakeVerseBreaks);
    //     // console.log(fakeVerseBreaks);
    //   }
    // }
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
