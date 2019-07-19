import { Injectable } from '@angular/core';
import { SaveStateService } from './save-state.service';
import { VerseNote, Note } from '../models/verse-notes';

@Injectable({
  providedIn: 'root',
})
export class VisibilityService {
  public secondaryNotesHighlight: Map<string, boolean> = new Map();
  public secondaryNotesVisibility: Map<string, boolean> = new Map();
  public constructor(private saveStateService: SaveStateService) {}

  public resetHighlight(verseNotes: VerseNote[]): void {
    verseNotes.map((verseNote): void => {
      if (verseNote.notes) {
        verseNote.notes.map((note): void => {
          note.highlight = false;
          if (note.noteRefFormatTag) {
            note.noteRefFormatTag.highlight = false;
          }
        });
      }
    });
    this.secondaryNotesHighlight.forEach((x, k): void => {
      this.secondaryNotesHighlight.set(k, false);
      this.secondaryNotesVisibility.set(k, false);
    });
  }
  public resetNoteVisibility(notes: VerseNote[] | undefined): void {
    if (notes) {
      this.resetHighlight(notes);
      notes.map((note): void => {
        if (note.notes) {
          // let lNote: Note | undefined;
          note.notes.reverse().map((sN): void => {
            if (this.saveStateService.data.noteTypes) {
              const noteTypeSetting = this.saveStateService.data.noteTypes.noteTypes.find(
                (nC): boolean => {
                  return nC.sort === sN.noteType;
                },
              );
              // console.log(noteTypeSetting);

              sN.visible = noteTypeSetting ? noteTypeSetting.visibility : true;
            }

            // switch (sN.noteType) {
            //   case NoteType.EXISTING: {
            //     sN.visible = this.saveStateService.data.existingNotesVisible;
            //     break;
            //   }
            //   case NoteType.PRINT: {
            //     sN.visible = this.saveStateService.data.printNotesVisible;
            //     break;
            //   }
            //   case NoteType.TC: {
            //     sN.visible = this.saveStateService.data.tcNotesVisible;
            //     break;
            //   }
            //   case NoteType.TEST: {
            //     sN.visible = this.saveStateService.data.testOverlayVisible;
            //     break;
            //   }
            //   case NoteType.TRANSLATION: {
            //     sN.visible = this.saveStateService.data.translationOverlayVisible;
            //     break;
            //   }
            //   default: {
            //     sN.visible = false;
            //     break;
            //   }
            // }

            // sN.notePhraseVis = true;

            // console.log(sN.offsets);

            if (sN.visible) {
              const visibility = sN.noteRefs.map((noteRef): boolean => {
                const nC = this.saveStateService.data.noteCategorySettings.find(
                  (rL): boolean => {
                    return rL.noteCategory === noteRef.noteCategory;
                  },
                );

                noteRef.visible = nC ? nC.visible : false;

                // if (noteRef.visible === true) {
                //   console.log(this.saveStateService.data.noteCategorySettings);
                // }
                return noteRef.visible ? noteRef.visible : false;
              });

              sN.visible = visibility.includes(true);
              sN.notePhraseVis = true;
              // if (sN.visible) {
              //   if (sN.notePhrase === 'whole verse') {
              //     console.log(note._id);

              //     console.log(
              //       lNote !== undefined && sN.notePhrase === lNote.notePhrase,
              //     );
              //     console.log(lNote);
              //     console.log(sN);
              //   }
              //   sN.notePhraseVis =
              //     lNote !== undefined &&
              //     sN.notePhrase === lNote.notePhrase &&
              //     sN.offsets === lNote.offsets
              //       ? false
              //       : true;
              //   lNote = sN;
              //   // console.log(sN.notePhrase);
              //   // console.log(sN.notePhraseVis);
              // }
            }

            if (sN._id) {
              this.secondaryNotesHighlight.set(
                sN._id,
                sN.visible ? sN.visible : false,
              );
              this.secondaryNotesVisibility.set(
                sN._id,
                sN.visible ? sN.visible : false,
              );
            }
          });
        }
      });
    }
  }

  public showMissingOffsets(notes: VerseNote[]): void {
    notes.map((note): void => {
      if (note.notes) {
        note.notes.map((sN): void => {
          console.log(sN.offsets);

          if (sN.offsets === undefined || sN.offsets.trim() === '') {
            sN.visible = true;
            if (sN.noteRefs) {
              sN.noteRefs.map((noteRef): void => {
                noteRef.visible = true;
              });
            }
          }
        });
      }
    });
  }
}
