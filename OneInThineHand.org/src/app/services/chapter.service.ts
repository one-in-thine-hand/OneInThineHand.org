import { Injectable } from '@angular/core';
import { Chapter } from '../../../../chapter/src/Chapter';
import { Note, Verse } from '../../../../shared/src/shared';

@Injectable({
  providedIn: 'root',
})
export class ChapterService {
  public chapter: Chapter | undefined;
  public verses: Verse[] | undefined;
  public notes: Note[] | undefined;
  constructor() {}

  public mergeVersesNotes(verses: Verse[], notes: Note[]): void {
    verses.map(
      (verse): void => {
        console.log(verse._id);
      },
    );
  }
}
