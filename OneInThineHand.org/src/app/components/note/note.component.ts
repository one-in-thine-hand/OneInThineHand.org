import { Component, OnInit, Input } from '@angular/core';
import {
  NotePhrase,
  Note,
  SecondaryNote,
  getVisible,
  NoteRef,
} from '../../../../../shared/src/shared';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {
  @Input() public note: Note;

  public constructor() {}

  public ngOnInit() {}

  public getNotePhrase(notePhrase: NotePhrase | undefined): string {
    return notePhrase && notePhrase.text
      ? notePhrase.text
      : 'Note Phrase Misding';
  }

  public getSecondaryNotes(): SecondaryNote[] {
    let secondaryNotes: SecondaryNote[] = [];
    if (this.note && this.note.secondaryNotes) {
      secondaryNotes = this.note.secondaryNotes.filter(
        (secondaryNote): boolean => {
          if (
            secondaryNote.visible &&
            secondaryNote.noteRefs &&
            secondaryNote.notePhrase
          ) {
            return getVisible(secondaryNote.noteRefs).length > 0;
          }
          return false;
        },
      );
    }
    return secondaryNotes;
  }

  public getNoteRefs(secondaryNote: SecondaryNote): NoteRef[] {
    return getVisible(secondaryNote.noteRefs);
  }
}
