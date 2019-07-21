import { Injectable } from '@angular/core';
import { ChapterService } from './chapter.service';
import PQueue from 'p-queue';
import { DatabaseService } from './database.service';
import { cloneDeep } from 'lodash';
import {
  Note,
  VerseNote,
  FakeVerseBreaks,
  FormatTagType,
  FormatGroup,
  FormatGroupPara,
  FormatGroupParaGap,
  FormatGroupLine,
  FormatGroupLineGap,
  FormatGroupBlockGap,
  FormatGroupBlock,
  FormatGroupText,
} from '../models/verse-notes';
@Injectable({
  providedIn: 'root',
})
export class SaveService {
  public constructor(
    private chaterService: ChapterService,
    private databaseService: DatabaseService,
  ) {}
  private interval: NodeJS.Timer | undefined;

  private saveQueue = new PQueue({ concurrency: 1 });

  public async save(): Promise<void> {
    if (this.chaterService.chapterNotes !== undefined) {
      await this.saveQueue.add(
        async (): Promise<void> => {
          if (this.chaterService.chapterNotes) {
            if (this.chaterService.chapterNotes.save === true) {
              this.chaterService.chapterNotes.save = undefined;
              const temp = cloneDeep(this.chaterService.chapterNotes);
              temp.verseNotes = temp.verseNotes
                ? temp.verseNotes.map(
                    (verseNotes): VerseNote => {
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
                : temp.verseNotes;
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
      console.log(vBreaks);
    } else {
      vBreaks = this.generateBreaks();
    }

    console.log('Save Fake Verses');

    if (
      this.chaterService.chapterVerses &&
      this.chaterService.chapterVerses.verses
    ) {
      this.chaterService.chapterVerses.verses.map((verse): void => {
        if (vBreaks) {
          const brk = vBreaks.verseBreaks.find((b): boolean => {
            return (
              b._id !== undefined &&
              b._id.replace('-breaks', '-verse') === verse._id
            );
          });

          if (brk && verse.fakeVerseBreak) {
            brk.breaks = this.convertFormatTagsToFormatGroups(
              verse.fakeVerseBreak,
            );
          } else {
            const a: {
              _id: string;
              breaks: FormatGroup[];
            } = {
              _id: verse._id ? verse._id.replace('verse', 'breaks') : '',
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

          const mergedBreaks = vBreaks.verseBreaks.map((vB): {
            _id: string;
            breaks: FormatGroup[];
          } => {
            const brks: FormatGroup[] = [];
            let lastBrk: FormatGroup | undefined;
            vB.breaks.map((b): void => {
              if (brks.length === 0) {
                brks.push(b);
                lastBrk = b;
              } else {
                if (
                  lastBrk &&
                  lastBrk.offsets === b.offsets &&
                  (b.classList && !b.classList.includes('gap'))
                ) {
                  lastBrk.classList =
                    lastBrk.classList && b.classList
                      ? lastBrk.classList.concat(b.classList)
                      : b.classList;
                } else {
                  brks.push(b);
                  lastBrk = b;
                }
              }
            });

            return { _id: vB._id, breaks: brks };
          });
          vBreaks.verseBreaks = mergedBreaks;
        }
      });

      if (vBreaks) {
        await this.databaseService.updateDatabaseItem(vBreaks);
      }
    }
  }

  public start(): void {
    {
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
          _id: verse._id ? verse._id.replace('verse', 'breaks') : '',
          breaks: [],
        };
      });
      return { _id: _id ? _id : '', _rev: undefined, verseBreaks: breaks };
    }
    return undefined;
  }
}
