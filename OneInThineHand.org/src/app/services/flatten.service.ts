import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FlattenService {
  public constructor() {}
  // public refTagMap = new Map<string, RefTag>();
  // public notesMap = new Map<string, Note>();
  // public verseNotesMap = new Map<string, VerseNotes>();
  // public verseMap = new Map<string, Verse>();

  // public setMaps(chV: ChapterVerses, chN: ChapterNotes): void {
  //   if (chV.verses) {
  //     chV.verses.map(
  //       (verse): void => {
  //         if (verse._id) {
  //           this.verseMap.set(verse._id, verse);
  //         }
  //       },
  //     );
  //   }

  //   if (chN && chN.notes) {
  //     chN.notes.map(
  //       (note): void => {
  //         if (note._id) {
  //           this.verseNotesMap.set(note._id, note);
  //         }
  //         if (note.notes) {
  //           note.notes.map(
  //             (sN): void => {
  //               if (sN.id) {
  //                 if (sN.refTag) {
  //                   this.refTagMap.set(sN.id, sN.refTag);
  //                 }
  //               }
  //             },
  //           );
  //         }
  //       },
  //     );
  //   }
  // }
}
