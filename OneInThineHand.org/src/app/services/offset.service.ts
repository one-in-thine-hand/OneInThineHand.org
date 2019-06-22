import { Injectable } from '@angular/core';
import {
  Note,
  parseOffsets,
  FormatTag,
  VerseNotes,
  sortNotes,
} from '../../../../shared/src/shared';
import { RefTag } from '../../../../shared/src/models/format_tags/FormatTag';

@Injectable({
  providedIn: 'root',
})
export class OffsetService {
  public constructor() {}

  public async expandNotes(notes: VerseNotes[] | undefined): Promise<void> {
    // console.log(notes);

    if (notes) {
      await sortNotes(notes);
      notes.map((note): void => {
        if (note.notes) {
          note.notes.map((secondaryNote): void => {
            secondaryNote.uncompressedOffsets = parseOffsets(
              secondaryNote.offsets,
            );

            if (
              (secondaryNote.uncompressedOffsets ||
                secondaryNote.offsets === 'all') &&
              secondaryNote.noteRefs
            ) {
              const formatTag = new FormatTag();
              const refTag = new RefTag();
              refTag.uncompressedOffsets = secondaryNote.uncompressedOffsets;

              formatTag.uncompressedOffsets = secondaryNote.uncompressedOffsets;
              if (secondaryNote.id) {
                refTag.secondaryNoteID = secondaryNote.id;
              }
              console.log(
                secondaryNote.offsets !== 'all' &&
                  (secondaryNote.uncompressedOffsets &&
                    !secondaryNote.uncompressedOffsets.includes(0)),
              );

              if (
                secondaryNote.offsets !== 'all' &&
                (secondaryNote.uncompressedOffsets &&
                  !secondaryNote.uncompressedOffsets.includes(0))
              ) {
                refTag.refs = secondaryNote.noteRefs
                  .map((ref): string => {
                    return ref._id ? ref._id : '';
                  })
                  .filter((ref): boolean => {
                    return ref.trim() !== '';
                  });
                formatTag.refs = secondaryNote.noteRefs
                  .map((ref): string => {
                    return ref._id ? ref._id : '';
                  })
                  .filter((ref): boolean => {
                    return ref.trim() !== '';
                  });
              } else {
                console.log();
                console.log(secondaryNote.notePhrase);

                refTag.offsets = 'all';
                formatTag.refs = ['all'];
              }

              secondaryNote.refTag = refTag;
              secondaryNote.formatTag = formatTag;
            }

            // console.log(secondaryNote.offsets);
          });
        }
      });
    }
  }
}
