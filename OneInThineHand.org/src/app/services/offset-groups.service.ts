import { Injectable } from '@angular/core';
import { VerseNote, Note, getVisible, VerseNotes } from '../models/verse-notes';
import { NoteType } from '../../../../shared/src/shared';
import { sortBy } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class OffsetGroupsService {
  public constructor() {}

  public buildOffsetGroups(verseNotes: VerseNotes): VerseNoteOffsetGroup[] {
    // const offsetGroups:
    if (verseNotes.verseNotes) {
      const verseNoteOffsetGroups = verseNotes.verseNotes.map(
        (verseNote): VerseNoteOffsetGroup => {
          return {
            verseNote: verseNote,
            offsetGroups: this.getOffsetGroups(verseNote),
          };
        },
      );
      console.log(verseNoteOffsetGroups);
      return verseNoteOffsetGroups;
    }
    return [];
  }

  public getOffsetGroups(verseNote: VerseNote): OffsetGroup[] {
    const offsetGroups: OffsetGroup[] = [];
    if (verseNote.notes) {
      sortBy(verseNote.notes, (note): NoteType | undefined => {
        return note.noteType;
      })
        .filter((note): boolean => {
          // console.log(note);
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

          if (
            offsetGroup &&
            note.offsets !== undefined &&
            note.offsets !== ''
          ) {
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

    return offsetGroups;
  }
}

export class OffsetGroup {
  public notePhrase: string;

  public notes: Note[];
  public offsets?: string;
}

export class VerseNoteOffsetGroup {
  public offsetGroups: OffsetGroup[];
  public verseNote: VerseNote;
}
