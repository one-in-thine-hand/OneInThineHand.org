import { Injectable } from '@angular/core';
import { sortBy } from 'lodash';
import { DatabaseService } from './database.service';
import { ChapterService } from './chapter.service';
import {
  CouchDoc,
  Note,
  getReferenceLabelByNoteCategory,
  ReferenceLabel,
  getRanges,
  NoteTypeConverts,
} from '../../../../shared/src/shared';
import { ChapterNotes } from '../../../../notes/src/main';
import { saveAs } from 'file-saver';
@Injectable({
  providedIn: 'root',
})
export class ExportService {
  public constructor(
    public chapterService: ChapterService,
    public databaseService: DatabaseService,
  ) {}

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
              (d): CouchDoc => {
                return { id: d.id, rev: d.value.rev };
              },
            ),
          (a): number => {
            return parseInt(a.id.split('-')[2]);
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
                (r): ChapterNotes => {
                  return (r.docs[0] as any).ok as ChapterNotes;
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
          saveAs(blob, `${bookName}.html`);
          // console.log(blob);
          // console.log(exportText);
        }
      }
    }
  }
  public chapterNotesToString(cNotes: ChapterNotes): string {
    let chapterNotesString = `<chapter id="${cNotes._id.replace(
      'notes',
      'chapter',
    )}">`;
    if (cNotes.notes) {
      chapterNotesString = `${chapterNotesString} ${cNotes.notes
        .map((verseNote): string => {
          return `<verse-notes id="${verseNote._id}">${this.notesToString(
            verseNote.notes,
          )}</verse-notes>`;
        })
        .join('')}</chapter>`;
    }
    return chapterNotesString;
  }
  public notesToString(notes: Note[] | undefined): string {
    if (notes) {
      return notes
        .map((note): string => {
          if (note.uncompressedOffsets) {
            if (note.uncompressedOffsets.includes(0)) {
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
          return `<note class="${classList.join(' ')}" id="${note.id}" ${
            note.offsets !== undefined ? `offsets="${note.offsets}"` : ''
          }>
          <p class="note-phrase">${
            note.notePhrase ? note.notePhrase.text : ''
          }</p>
          ${note.noteRefs
            .map((noteRef): string => {
              let refLabel: ReferenceLabel | undefined;
              if (noteRef.noteCategory) {
                refLabel = getReferenceLabelByNoteCategory(
                  noteRef.noteCategory,
                );
              }

              return `<p class="note-reference"><span class="${
                refLabel ? refLabel.className : ''
              }${noteRef.none === true ? ' none' : ''}">${
                refLabel ? refLabel.referenceLabelShortName : ''
              } </span>${
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
