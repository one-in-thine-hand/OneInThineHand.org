import { Injectable } from '@angular/core';
import { sortBy } from 'lodash';
import { DatabaseService } from './database.service';
import { ChapterService } from './chapter.service';
import { CouchDoc, Note } from '../../../../shared/src/shared';
import { ChapterNotes } from '../../../../notes/src/main';

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
            .filter((d): boolean => {
              return (
                d.id.includes(`${idSplit[0]}-${idSplit[1]}`) &&
                d.id.includes('note')
              );
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
          const exportText = bulkGetDocs.results
            .map(
              (r): ChapterNotes => {
                return (r.docs[0] as any).ok as ChapterNotes;
              },
            )
            .map((cNotes): string => {
              return this.chapterNotesToString(cNotes);
            })
            .join('\n');
          console.log(exportText);
        }
      }
    }
  }
  public chapterNotesToString(cNotes: ChapterNotes): string {
    let chapterNotesString = '<xml>';
    if (cNotes.notes) {
      chapterNotesString = `${chapterNotesString}${cNotes.notes
        .map((verseNote): string => {
          return `${this.notesToString(verseNote.notes)}`;
        })
        .join('')}`;
    }
    return chapterNotesString;
  }
  public notesToString(notes: Note[] | undefined): string {
    if (notes) {
      return notes
        .map((note): string => {
          return `<note id="${note.id}">
          <note-title>${note.id}</note-title>
          </note>`;
        })
        .join('\n');
    }
    return '';
  }
}
