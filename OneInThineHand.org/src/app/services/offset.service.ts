import { Injectable } from '@angular/core';
import {
  Note,
  getRanges,
  expandOffsets,
  parseOffsets,
} from '../../../../shared/src/shared';

@Injectable({
  providedIn: 'root',
})
export class OffsetService {
  public constructor() {}

  public expandNotes(notes: Note[]): void {
    notes.map(
      (note): void => {
        if (note.secondaryNotes) {
          note.secondaryNotes.map(
            (sN): void => {
              sN.uncompressedOffsets = parseOffsets(sN.offsets);
              console.log(sN.offsets);
            },
          );
        }
      },
    );
  }
}
