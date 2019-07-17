import { Injectable } from '@angular/core';
import { parseOffsets } from '../../../../shared/src/shared';
import { RefTag } from '../../../../shared/src/models/format_tags/FormatTag';
import PQueue from 'p-queue';
import { VerseNote, NoteRef, FormatTag, Note } from '../models/verse-notes';

@Injectable({
  providedIn: 'root',
})
export class OffsetService {
  public expandNotesQueue = new PQueue({ concurrency: 1 });
  public constructor() {}

  public async expandNotes(notes: VerseNote[] | undefined): Promise<void> {
    // console.log(notes);
    await this.expandNotesQueue.add(
      async (): Promise<void> => {
        if (notes) {
          // await sortNotes(notes);
          notes.map((note): void => {
            try {
              if (note.notes) {
                note.notes.map((secondaryNote): void => {
                  if (
                    secondaryNote.offsets &&
                    (secondaryNote.offsets.startsWith('0') ||
                      secondaryNote.offsets === 'all')
                  ) {
                    secondaryNote.uncompressedOffsets = [0];
                  } else if (!secondaryNote.offsets) {
                    secondaryNote.uncompressedOffsets = undefined;
                  } else {
                    secondaryNote.uncompressedOffsets = parseOffsets(
                      secondaryNote.offsets,
                    );
                    if (secondaryNote.uncompressedOffsets) {
                      secondaryNote.uncompressedOffsets.pop();
                    }
                  }
                  if (
                    (secondaryNote.uncompressedOffsets ||
                      secondaryNote.offsets === 'all' ||
                      secondaryNote.offsets === '0') &&
                    secondaryNote.noteRefs
                  ) {
                    const formatTag = new FormatTag();
                    const refTag = new RefTag();
                    refTag.uncompressedOffsets =
                      secondaryNote.uncompressedOffsets;

                    formatTag.uncompressedOffsets =
                      secondaryNote.uncompressedOffsets;
                    if (secondaryNote._id) {
                      refTag.secondaryNoteID = secondaryNote._id;
                    }

                    if (
                      secondaryNote.offsets !== 'all' &&
                      (secondaryNote.uncompressedOffsets &&
                        !secondaryNote.uncompressedOffsets.includes(0))
                    ) {
                      refTag.refs = [secondaryNote._id];
                      // secondaryNote
                      // .map((ref): string => {
                      // // return ref._id ? ref._id : '';
                      // })
                      // .filter((ref): boolean => {
                      // // return ref.trim() !== '';
                      // });
                      formatTag.refs = [secondaryNote._id];
                      // secondaryNote.noteRefs;
                      // .map((ref): string => {
                      // return ref._id ? ref._id : '';
                      // })
                      // .filter((ref): boolean => {
                      // return ref.trim() !== '';
                      // });
                    } else {
                      refTag.offsets = 'all';
                      formatTag.refs = ['all'];
                    }

                    secondaryNote.noteRefFormatTag = refTag;
                    secondaryNote.formatTag = formatTag;
                  }

                  // console.log(secondaryNote.offsets);
                });
              }
            } catch (error) {
              console.log(error);
            }
          });
        }
      },
    );
  }
}
