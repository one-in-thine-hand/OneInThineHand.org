import { Injectable } from '@angular/core';
import { sortBy } from 'lodash';
import { DatabaseService } from './database.service';
import { ChapterService } from './chapter.service';
import {
  getRanges,
  NoteTypeConverts,
  FormatGroup,
  FormatGroupType,
  CouchDocGet,
} from '../../../../shared/src/shared';

import { saveAs } from 'file-saver';
import {
  VerseNotes,
  Note,
  NoteCategory,
  NoteCategorySort,
} from '../models/verse-notes';
import { findByAttribute } from '../../../../shared/src/functions/filterUndefined';
import { SaveStateService } from './save-state.service';
@Injectable({
  providedIn: 'root',
})
export class ExportService {
  public constructor(
    public chapterService: ChapterService,
    private saveStateService: SaveStateService,
    public databaseService: DatabaseService,
  ) {}
  public breaksToString(breaks: FormatGroup[]): string {
    return breaks
      .map((brk): string => {
        const elementName = this.getBreakElementName(brk.formatGroupType);
        if (elementName) {
          return `<${elementName} ${
            brk.offsets ? `offsets=${brk.offsets}` : ''
          }></${elementName}>`;
        }
        return '';
      })
      .join('\n');
    return '';
  }
  public chapterBreaksToString(cNotes: {
    _id: string;
    _rev: string | undefined;
    verseBreaks: {
      _id: string;
      breaks: FormatGroup[];
    }[];
  }): string {
    let chapterNotesString = `<chapter id="${cNotes._id.replace(
      'notes',
      'chapter',
    )}">`;
    if (cNotes.verseBreaks) {
      chapterNotesString = `${chapterNotesString} ${cNotes.verseBreaks
        .map((verseBreak): string => {
          return `<verse-breaks id="${verseBreak._id}">${this.breaksToString(
            verseBreak.breaks,
          )}</verse-breaks>`;
        })
        .join('')}</chapter>`;
    }
    return chapterNotesString;
  }
  public chapterNotesToString(cNotes: VerseNotes): string {
    let chapterNotesString = `<chapter id="${cNotes._id.replace(
      'notes',
      'chapter',
    )}">`;
    if (cNotes.verseNotes) {
      chapterNotesString = `${chapterNotesString} ${cNotes.verseNotes
        .map((verseNote): string => {
          return `<verse-notes id="${verseNote._id}">${this.notesToString(
            verseNote.notes,
          )}</verse-notes>`;
        })
        .join('')}</chapter>`;
    }
    return chapterNotesString;
  }

  /**
   * exportBook
   */
  public async exportBook(): Promise<void> {
    if (this.chapterService.chapter) {
      const idSplit = this.chapterService.chapter._id.split('-');
      const bookName = `${idSplit[0]}-${idSplit[1]}`;

      const docs = await this.databaseService.allDocs();
      if (docs) {
        const ids = sortBy(
          docs.rows
            .filter((d): boolean => {
              return d.id.includes(bookName) && d.id.includes('note');
            })
            .map(
              (d): CouchDocGet => {
                return { id: d.id, rev: d.value.rev };
              },
            ),
          (a): number => {
            return parseInt(a.id.split('-')[2], 10);
          },
        );

        const bulkGetDocs = await this.databaseService.bulkGet(ids);
        if (bulkGetDocs) {
          const exportText = `<?xml version="1.0" encoding="UTF-8"?>
          <html>
            <head>
            <meta charset="UTF-8"/>
            <!-- css goes here -->
            </head>
            <body>
            ${bulkGetDocs.results
              .map(
                (r): VerseNotes => {
                  return (r.docs[0] as any).ok as VerseNotes;
                },
              )
              .map((cNotes): string => {
                return this.chapterNotesToString(cNotes);
              })
              .join('\n')}
              </body>
              </html>`;

          const blob = new Blob([exportText], {
            type: 'text/html;charset=utf=8',
          });
          saveAs(blob, `${bookName}-breaks.html`);
          // console.log(blob);
          // console.log(exportText);
        }
      }
    }
  }

  /**
   * exportBook
   */
  public async exportBreaks(): Promise<void> {
    if (this.chapterService.chapter) {
      const idSplit = this.chapterService.chapter._id.split('-');
      const bookName = `${idSplit[0]}-${idSplit[1]}`;

      const docs = await this.databaseService.allDocs();
      if (docs) {
        const ids = sortBy(
          docs.rows
            .filter((d): boolean => {
              return d.id.includes(bookName) && d.id.includes('breaks');
            })
            .map(
              (d): CouchDocGet => {
                return { id: d.id, rev: d.value.rev };
              },
            ),
          (a): number => {
            return parseInt(a.id.split('-')[2], 10);
          },
        );

        const bulkGetDocs = await this.databaseService.bulkGet(ids);
        if (bulkGetDocs) {
          const exportText = `<?xml version="1.0" encoding="UTF-8"?>
          <testament data-content-type="overlay-break" lang="eng">
            ${bulkGetDocs.results
              .map((r): {
                _id: string;
                _rev: string | undefined;
                verseBreaks: {
                  _id: string;
                  breaks: FormatGroup[];
                }[];
              } => {
                return (r.docs[0] as any).ok as {
                  _id: string;
                  _rev: string | undefined;
                  verseBreaks: {
                    _id: string;
                    breaks: FormatGroup[];
                  }[];
                };
              })
              .map((cNotes): string => {
                return this.chapterBreaksToString(cNotes);
              })
              .join('\n')}
              </testament>`;

          const blob = new Blob([exportText], {
            type: 'text/html;charset=utf=8',
          });
          saveAs(blob, `${bookName}.html`);
          // console.log(blob);
          // console.log(exportText);
        }
      }
    }
  }
  public getBreakElementName(
    formatGroupType: FormatGroupType | undefined,
  ): string | undefined {
    switch (formatGroupType) {
      case FormatGroupType.Para: {
        return 'Para'.toLowerCase();
      }
      case FormatGroupType.ParaGap: {
        return 'Para-Gap'.toLowerCase();
      }
      case FormatGroupType.Line: {
        return 'Line'.toLowerCase();
      }
      case FormatGroupType.LineGap: {
        return 'Line-Gap'.toLowerCase();
      }
      case FormatGroupType.BlockGap: {
        return 'Block-Gap'.toLowerCase();
      }
      case FormatGroupType.Block: {
        return 'Block'.toLowerCase();
      }
      case FormatGroupType.Text: {
        return 'Plain'.toLowerCase();
      }

      default:
        break;
    }
    return undefined;
  }
  public notesToString(notes: Note[] | undefined): string {
    if (notes) {
      return notes
        .map((note): string => {
          if (note.uncompressedOffsets) {
            if (
              note.uncompressedOffsets.includes(0) ||
              note.offsets === 'all'
            ) {
              note.offsets = 'all';
            } else {
              note.offsets = getRanges(note.uncompressedOffsets)
                .map((offsets): string => {
                  return offsets.join('-');
                })
                .join(',');
            }
            // console.log(note.offsets);

            // console.log(getRanges(note.uncompressedOffsets));
            // console.log(
            //   sortBy(
            //     note.uncompressedOffsets,
            //     (u): number => {
            //       return u;
            //     },
            //   ),
            // );
          }

          const getNoteType = NoteTypeConverts.find((nTC): boolean => {
            return nTC.noteType === note.noteType;
          });
          let classList: string[] = [];

          if (getNoteType) {
            classList.push(getNoteType.className);
          }

          if (note.classList) {
            classList = classList.concat(note.classList);
          }
          return `<note class="${classList.join(' ')}" id="${note._id}" ${
            note.offsets !== undefined
              ? `offsets=\"${
                  note.offsets === 'all' || note.offsets === '0'
                    ? 'all'
                    : note.offsets
                }\"`
              : ''
          }>
          <p class="note-phrase">${note.notePhrase ? note.notePhrase : ''}</p>
          ${note.noteRefs
            .map((noteRef): string => {
              let refLabel: NoteCategory | undefined;
              if (noteRef.noteCategory) {
                refLabel = findByAttribute(
                  this.saveStateService.data.noteCategories.noteCategories,
                  'noteCategory',
                  noteRef.noteCategory,
                );
              }

              return `<p class="note-reference"><span class="${
                refLabel ? refLabel.className : ''
              }${
                noteRef.noteCategory === NoteCategorySort.NONE ? ' none' : ''
              }">${refLabel ? refLabel.label : ''} </span>${
                noteRef.text ? noteRef.text.replace(/&/g, '&amp;') : ''
              }</p>`;
            })
            .join('\n')}
          </note>`;
        })
        .join('\n');
    }
    return '';
  }

  private createElementFromHTML(htmlString: string | undefined): string {
    if (htmlString) {
      const div = document.createElement('div');
      div.innerHTML = htmlString.trim();

      // Change this to div.childNodes to support multiple top-level nodes
      return div.innerHTML;
    }
    return '';
  }
}
