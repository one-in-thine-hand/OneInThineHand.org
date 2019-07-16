import { Injectable } from '@angular/core';
import { Chapter } from '../../../../chapter/src/Chapter';
import { Verse, FormatGroup } from '../../../../shared/src/shared';
import { ChapterNotes } from '../../../../notes/src/main';
import { ChapterVerses } from '../../../../format-tags/src/main';
import { Observable } from 'rxjs';
import { flatten } from '@angular/compiler';
import { VerseNote } from '../models/verse-notes';

@Injectable({
  providedIn: 'root',
})
export class ChapterService {
  public chapter: Chapter | undefined;
  public chapterBreaks: {
    _id: string;
    _rev: string | undefined;
    verseBreaks: {
      _id: string;
      breaks: FormatGroup[];
    }[];
  };
  public chapterNotes: ChapterNotes | undefined;
  public chapterVerses: ChapterVerses | undefined;
  public kjvChapterNotes: ChapterNotes | undefined;
  public kjvChapterVerse: ChapterVerses | undefined;
  public notes: VerseNote[] | undefined;
  public verses: Verse[] | undefined;

  public constructor() {}

  public generateIDS(verseIDS: string[]): string[] {
    return flatten(
      verseIDS.map((verseID): string[] => {
        return [
          // verseID.replace('verse', 'note'),
          verseID.replace('verse', 'breaks'),
        ];
      }),
    );
    throw new Error('Method not implemented.');
  }

  public mergeVersesNotes(
    verses: Verse[],
    notes: VerseNote[] | undefined,
  ): void {
    if (notes) {
      verses.map((verse): void => {
        // console.log(verse._id);
        const note = notes.find((n): boolean => {
          return n._id ? n._id.replace('-notes', '') === verse._id : false;
        });

        verse.note = note;
        // console.log(note);
      });
    }
  }
  public resetNoteVis(): void {
    if (this.chapterNotes && this.chapterNotes.notes) {
      this.chapterNotes.notes.map((note): void => {
        if (note.notes) {
          note.notes.map((secondaryNote): void => {
            if (secondaryNote.refTag) {
              secondaryNote.refTag.highlight = false;
            }
            // secondaryNote.highlight = false;s
          });
        }
      });
    }
  }
}
