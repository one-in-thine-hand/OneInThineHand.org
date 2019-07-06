import { sortBy } from 'lodash';
import { VerseNotes } from '../models/notes/Note';
export async function sortNotes(
  verseNotes: VerseNotes[] | undefined,
): Promise<void> {
  if (verseNotes) {
    verseNotes.map(
      (verseNote): void => {
        if (verseNote.notes) {
          verseNote.notes = sortBy(
            verseNote.notes,
            (note): number => {
              return note.noteType ? note.noteType : 0;
            },
          );
          verseNote.notes.map(
            (note): void => {
              if (note.noteRefs) {
                note.noteRefs = sortBy(
                  note.noteRefs,
                  (noteRef): number => {
                    return noteRef.noteCategory ? noteRef.noteCategory : 0;
                  },
                );
              }
            },
          );
        }
      },
    );
  }
}
