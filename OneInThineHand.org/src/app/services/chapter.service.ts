import { Injectable } from '@angular/core';
import { Chapter } from '../../../../chapter/src/Chapter';
import { Note, Verse } from '../../../../shared/src/shared';
import { ChapterNotes } from '../../../../notes/src/main';
import { ChapterVerses } from '../../../../format-tags/src/main';

@Injectable({
  providedIn: 'root',
})
export class ChapterService {
  public chapter: Chapter | undefined;
  public verses: Verse[] | undefined;
  public notes: Note[] | undefined;
  public chapterNotes: ChapterNotes | undefined;
  public chapterVerses: ChapterVerses | undefined;
  public constructor() {}

  public mergeVersesNotes(verses: Verse[], notes: Note[] | undefined): void {
    if (notes) {
      verses.map(
        (verse): void => {
          // console.log(verse._id);
          const note = notes.find(
            (n): boolean => {
              return n._id ? n._id.replace('-notes', '') === verse._id : false;
            },
          );

          verse.note = note;
          // console.log(note);
        },
      );
    }
  }
  public resetNoteVis(): void {
    if (this.chapterNotes && this.chapterNotes.notes) {
      this.chapterNotes.notes.map(
        (note): void => {
          if (note.notes) {
            note.notes.map(
              (secondaryNote): void => {
                if (secondaryNote.refTag) {
                  secondaryNote.refTag.highlight = false;
                }
                // secondaryNote.highlight = false;s
              },
            );
          }
        },
      );
    }
  }
}
