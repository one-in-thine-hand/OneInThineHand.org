import { Injectable } from '@angular/core';
import { VerseNote, Note, getVisible } from '../models/verse-notes';
import { NoteType } from '../../../../shared/src/shared';
import { sortBy } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class OffsetGroupsService {
  public constructor() {}

  public getOffsetGroups(verseNote: VerseNote): OffsetGroup[] {
    const offsetGroups: OffsetGroup[] = [];
    if (verseNote.notes) {
      sortBy(verseNote.notes, (note): NoteType | undefined => {
        return note.noteType;
      })
        .filter((note): boolean => {
          // console.log(note);

          if (note.visible && note.noteRefs && note.notePhrase) {
            return getVisible(note.noteRefs).length > 0;
          }
          return false;
        })
        .map((note): void => {
          const offsetGroup = offsetGroups.find((ofg): boolean => {
            return ofg.offsets === note.offsets;
          });

          if (offsetGroup) {
            offsetGroup.notes.push(note);
          } else {
            offsetGroups.push({
              notePhrase: note.notePhrase,
              offsets: note.offsets,
              notes: [note],
            });
          }
        });
    }
    // console.log(offsetGroups);

    return offsetGroups;
  }
}

export class OffsetGroup {
  public notePhrase: string;

  public notes: Note[];
  public offsets?: string;
}
