import { Injectable } from '@angular/core';
import { SaveStateService } from './save-state.service';
import { Note, NoteType } from '../../../../shared/src/shared';
import { refLabelSettingsTemplate } from './SaveStateModel';

@Injectable({
  providedIn: 'root',
})
export class VisibilityService {
  public constructor(private saveStateService: SaveStateService) {}

  public resetNoteVisibility(notes: Note[]): void {
    notes.map(
      (note): void => {
        if (note.secondaryNotes) {
          note.secondaryNotes.map(
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

                default: {
                  sN.visible = false;
                  break;
                }
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
