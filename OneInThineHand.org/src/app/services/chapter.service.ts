import { Injectable } from '@angular/core';
import { Chapter } from '../../../../chapter/src/Chapter';
import { flatten } from '@angular/compiler';

import {
  VerseNotes,
  Verse,
  ChapterVerses,
  VerseNote,
  FormatGroup,
} from '../models/verse-notes';
import { OffsetGroup, VerseNoteOffsetGroup } from './offset-groups.service';
import { Subject } from 'rxjs';

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
  public chapterNotes: VerseNotes | undefined;
  public chapterVerses: ChapterVerses | undefined;
  public dontScrollNotes = false;
  public kjvChapterNotes: VerseNotes | undefined;
  public notes: VerseNote[] | undefined;
  public offsetGroups?: VerseNoteOffsetGroup[];
  public offsetGroupsOb = new Subject<VerseNoteOffsetGroup[]>();
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
    if (this.chapterNotes && this.chapterNotes.verseNotes) {
      this.chapterNotes.verseNotes.map((note): void => {
        if (note.notes) {
          note.notes.map((secondaryNote): void => {
            if (secondaryNote.noteRefFormatTag) {
              secondaryNote.noteRefFormatTag.highlight = false;
            }
            // secondaryNote.highlight = false;s
          });
        }
      });
    }
  }
}
