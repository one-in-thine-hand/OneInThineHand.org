import { Injectable } from '@angular/core';
import { sortBy } from 'lodash';
import { DatabaseService } from './database.service';
import { ChapterService } from './chapter.service';
import {
  CouchDoc,
  Note,
  getReferenceLabelByNoteCategory,
  ReferenceLabel,
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
      console.log(`${idSplit[0]}-${idSplit[1]}`);
      const docs = await this.databaseService.allDocs();
      if (docs) {
        const ids = sortBy(
          docs.rows
            .filter(
              (d): boolean => {
                return (
                  d.id.includes(`${idSplit[0]}-${idSplit[1]}`) &&
                  d.id.includes('note')
                );
              },
            )
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
          const exportText = `<?xml version="1.0" encoding="UTF-8"?>\n${bulkGetDocs.results
            .map(
              (r): ChapterNotes => {
                return (r.docs[0] as any).ok as ChapterNotes;
              },
            )
            .map(
              (cNotes): string => {
                return this.chapterNotesToString(cNotes);
              },
            )
            .join('\n')}`;

          const blob = new Blob([exportText], {
            type: 'text/html;charset=utf=8',
          });
          saveAs(blob, 'test.html');
          console.log(blob);
          console.log(exportText);
        }
      }
    }
  }
  public chapterNotesToString(cNotes: ChapterNotes): string {
    let chapterNotesString = `<chapter id="${cNotes._id}">`;
    if (cNotes.notes) {
      chapterNotesString = `${chapterNotesString} ${cNotes.notes
        .map(
          (verseNote): string => {
            return `<verse-notes id="${verseNote._id}">${this.notesToString(
              verseNote.notes,
            )}</verse-notes>`;
          },
        )
        .join('')}</chapter>`;
    }
    return chapterNotesString;
  }
  public notesToString(notes: Note[] | undefined): string {
    if (notes) {
      return notes
        .map(
          (note): string => {
            return `<note${
              note.classList !== undefined
                ? `class="${note.classList.join(' ')}"`
                : ''
            } id="${note.id}">
          <p class="note-phrase">${
            note.notePhrase ? note.notePhrase.text : ''
          }</p>
          ${note.noteRefs
            .map(
              (noteRef): string => {
                let refLabel: ReferenceLabel | undefined;
                if (noteRef.noteCategory) {
                  refLabel = getReferenceLabelByNoteCategory(
                    noteRef.noteCategory,
                  );
                }

                return `<p class="note-reference"><span class="${
                  refLabel ? refLabel.className : ''
                }">${refLabel ? refLabel.referenceLabelShortName : ''} </span>${
                  noteRef.text
                }</p>`;
              },
            )
            .join('\n')}
          </note>`;
          },
        )
        .join('\n');
    }
    return '';
  }
}
