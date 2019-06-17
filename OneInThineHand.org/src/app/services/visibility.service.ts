import { Injectable } from '@angular/core';
import { SaveStateService } from './save-state.service';
import { Note, NoteType } from '../../../../shared/src/shared';

@Injectable({
  providedIn: 'root',
})
export class VisibilityService {
  public secondaryNotesHighlight: Map<string, boolean> = new Map();
  public secondaryNotesVisibility: Map<string, boolean> = new Map();
  public constructor(private saveStateService: SaveStateService) {}

  public resetHighlight(): void {
    this.secondaryNotesHighlight.forEach(
      (x, k): void => {
        this.secondaryNotesHighlight.set(k, false);
      },
    );
  }
  public resetNoteVisibility(notes: Note[] | undefined): void {
    if (notes) {
      this.resetHighlight();
      notes.map(
        (note): void => {
          if (note.notes) {
            note.notes.map(
              (sN): void => {
                switch (sN.noteType) {
                  case NoteType.Eng: {
                    sN.visible = this.saveStateService.data.englishNotesVisible;
                    break;
                  }
                  case NoteType.New: {
                    sN.visible = this.saveStateService.data.newNotesVisible;
                    break;
                  }
                  case NoteType.TC: {
                    sN.visible = this.saveStateService.data.translatorNotesVisible;
                    break;
                  }
                  case NoteType.EngOverlay: {
                    sN.visible = this.saveStateService.data.englishOverlayVisible;
                    break;
                  }
                  default: {
                    sN.visible = false;
                    break;
                  }
                }
                if (sN.id) {
                  this.secondaryNotesHighlight.set(sN.id, sN.visible);
                  this.secondaryNotesVisibility.set(sN.id, sN.visible);
                }

                if (sN.visible) {
                  sN.noteRefs.map(
                    (noteRef): void => {
                      const nC = this.saveStateService.data.ReferenceLabelSetting.find(
                        (rL): boolean => {
                          return rL.noteCategory === noteRef.noteCategory;
                        },
                      );
                      noteRef.visible = nC ? nC.visible : false;
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

  public showMissingOffsets(notes: Note[]): void {
    notes.map(
      (note): void => {
        if (note.notes) {
          note.notes.map(
            (sN): void => {
              console.log(sN.offsets);

              if (sN.offsets === undefined || sN.offsets.trim() === '') {
                sN.visible = true;
                if (sN.noteRefs) {
                  sN.noteRefs.map(
                    (noteRef): void => {
                      noteRef.visible = true;
                    },
                  );
                }
              }
            },
          );
        }
      },
    );
  }
}
