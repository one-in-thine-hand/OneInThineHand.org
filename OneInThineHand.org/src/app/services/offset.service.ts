import { Injectable } from '@angular/core';
import { Note, parseOffsets, FormatTag } from '../../../../shared/src/shared';
import { RefTag } from '../../../../shared/src/models/format_tags/FormatTag';

@Injectable({
  providedIn: 'root',
})
export class OffsetService {
  public constructor() {}

  public expandNotes(notes: Note[] | undefined): void {
    // console.log(notes);

    if (notes) {
      notes.map(
        (note): void => {
          if (note.secondaryNotes) {
            note.secondaryNotes.map(
              (secondaryNote): void => {
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
                  refTag.uncompressedOffsets =
                    secondaryNote.uncompressedOffsets;

                  formatTag.uncompressedOffsets =
                    secondaryNote.uncompressedOffsets;

                  if (secondaryNote.offsets === 'all') {
                    refTag.refs = secondaryNote.noteRefs
                      .map(
                        (ref): string => {
                          return ref._id ? ref._id : '';
                        },
                      )
                      .filter(
                        (ref): boolean => {
                          return ref.trim() !== '';
                        },
                      );
                    formatTag.refs = secondaryNote.noteRefs
                      .map(
                        (ref): string => {
                          return ref._id ? ref._id : '';
                        },
                      )
                      .filter(
                        (ref): boolean => {
                          return ref.trim() !== '';
                        },
                      );
                  } else {
                    refTag.offsets = 'all';
                    formatTag.refs = ['all'];
                  }

                  secondaryNote.refTag = refTag;
                  secondaryNote.formatTag = formatTag;
                }

                // console.log(secondaryNote.offsets);
              },
            );
          }
        },
      );
    }
  }
}
