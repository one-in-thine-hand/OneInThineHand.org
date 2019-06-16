import { Injectable } from '@angular/core';
import { SecondaryNote, Note, Verse } from '../../../../shared/src/shared';
import { RefTag } from '../../../../shared/src/models/format_tags/FormatTag';
import { Chapter } from '../../../../chapter/src/Chapter';
import { ChapterVerses } from '../../../../format-tags/src/main';
import { ChapterNotes } from '../../../../notes/src/main';

@Injectable({
  providedIn: 'root',
})
export class FlattenService {
  public refTagMap = new Map<string, RefTag>();
  public notesMap = new Map<string, SecondaryNote>();
  public verseNotesMap = new Map<string, Note>();
  public verseMap = new Map<string, Verse>();
  public constructor() {}

  public setMaps(chV: ChapterVerses, chN: ChapterNotes): void {
    if (chV.verses) {
      chV.verses.map(
        (verse): void => {
          if (verse._id) {
            this.verseMap.set(verse._id, verse);
          }
        },
      );
    }

    if (chN && chN.notes) {
      chN.notes.map(
        (note): void => {
          if (note._id) {
            this.verseNotesMap.set(note._id, note);
          }
          if (note.notes) {
            note.notes.map(
              (sN): void => {
                if (sN.id) {
                  this.notesMap.set(sN.id, sN);

                  if (sN.refTag) {
                    this.refTagMap.set(sN.id, sN.refTag);
                  }
                }
              },
            );
          }
        },
      );
    }
  }
}
