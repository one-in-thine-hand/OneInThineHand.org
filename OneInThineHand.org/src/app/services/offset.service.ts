import { Injectable } from '@angular/core';
import {
  Note,
  getRanges,
  expandOffsets,
  parseOffsets,
  FormatTag,
} from '../../../../shared/src/shared';

@Injectable({
  providedIn: 'root',
})
export class OffsetService {
  public constructor() {}

  public expandNotes(notes: Note[]): void {
    notes.map((note): void => {
      if (note.secondaryNotes) {
        note.secondaryNotes.map((sN): void => {
          sN.uncompressedOffsets = parseOffsets(sN.offsets);

          if ((sN.uncompressedOffsets || sN.offsets === 'all') && sN.noteRefs) {
            const formatTag = new FormatTag();

            formatTag.uncompressedOffsets = sN.uncompressedOffsets;

            if (sN.offsets === 'all') {
              formatTag.refs = sN.noteRefs
                .map((ref): string => {
                  return ref._id ? ref._id : '';
                })
                .filter((ref): boolean => {
                  return ref.trim() !== '';
                });
            } else {
              formatTag.refs = ['all'];
            }

            sN.formatTag = formatTag;
          }

          console.log(sN.offsets);
        });
      }
    });
  }
}
