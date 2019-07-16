import { Injectable } from '@angular/core';
import { SaveStateService } from './save-state.service';
import { VerseNote } from '../models/verse-notes';

@Injectable({
  providedIn: 'root',
})
export class VisibilityService {
  public secondaryNotesHighlight: Map<string, boolean> = new Map();
  public secondaryNotesVisibility: Map<string, boolean> = new Map();
  public constructor(private saveStateService: SaveStateService) {}

  public resetHighlight(): void {
    this.secondaryNotesHighlight.forEach((x, k): void => {
      this.secondaryNotesHighlight.set(k, false);
      this.secondaryNotesVisibility.set(k, false);
    });
  }
  public resetNoteVisibility(notes: VerseNote[] | undefined): void {
    if (notes) {
      this.resetHighlight();
      notes.map((note): void => {
        if (note.notes) {
          note.notes.map((sN): void => {
            const noteTypeSetting = this.saveStateService.data.noteTypeSettings.find(
              (nC): boolean => {
                return nC.noteType === sN.noteType;
              },
            );

            sN.visible = noteTypeSetting ? noteTypeSetting.visible : true;

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
