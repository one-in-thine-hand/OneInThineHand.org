import { Injectable } from '@angular/core';
import { Chapter } from '../../../../chapter/src/Chapter';
import { Note, Verse } from '../../../../shared/src/shared';
import { ChapterNotes } from '../../../../notes/src/main';

@Injectable({
  providedIn: 'root',
})
export class ChapterService {
  public chapter: Chapter | undefined;
  public verses: Verse[] | undefined;
  public notes: Note[] | undefined;
  public chapterNotes: ChapterNotes | undefined;
  public constructor() {}

  public mergeVersesNotes(verses: Verse[], notes: Note[] | undefined): void {
    if (notes) {
      verses.map(
        (verse): void => {
          // console.log(verse._id);
          const note = notes.find(
            (n): boolean => {
              return n._id
                ? n._id.replace('note', 'verse') === verse._id
                : false;
            },
          );

          verse.note = note;
          // console.log(note);
        },
      );
    }
  }
}
