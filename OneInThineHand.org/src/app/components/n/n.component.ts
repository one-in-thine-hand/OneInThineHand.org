import { Component, OnInit, Input } from '@angular/core';
import {
  Note,
  VerseNotes,
  getVisible,
  getReferenceLabelByNoteCategory,
  NoteRef,
  NotePhrase,
  ReferenceLabels,
} from '../../../../../shared/src/shared';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-n',
  templateUrl: './n.component.html',
  styleUrls: ['./n.component.scss'],
})
export class NComponent implements OnInit {
  @Input() public note: Note;
  @Input() public verseNotes: VerseNotes;
  public edit: boolean = false;

  public constructor(public domSanitizer: DomSanitizer) {}

  public ngOnInit() {}

  /**
   * convertNoteCategory
   */
  public convertNoteCategory(noteRef: NoteRef): string {
    // console.log(noteRef.none);

    if (noteRef.none === true) {
      return '';
    }
    const nc = ReferenceLabels.find((rl): boolean => {
      // if (
      //   rl.noteCategory === noteRef.noteCategory &&
      //   noteRef.text &&
      //   noteRef.text.includes('many')
      // ) {
      //   // console.log(ReferenceLabels);
      // }
      return rl.noteCategory === noteRef.noteCategory;
    });
    // if (noteRef.text && noteRef.text.includes('many')) {
    //   // console.log(nc);
    // }
    return nc ? nc.referenceLabelShortName : 'extERR';
  }

  public getNotePhrase(notePhrase: NotePhrase | undefined): string {
    return notePhrase && notePhrase.text
      ? notePhrase.text
      : 'Note Phrase Missing';
  }

  public getNoteRefText(noteRef: NoteRef): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(
      noteRef.text ? noteRef.text : '',
    );
  }
  public highlight(note: Note): boolean {
    return note.refTag && note.refTag.highlight ? true : false;
  }
  public getRefClass(noteRef: NoteRef): string {
    if (noteRef && noteRef.noteCategory) {
      const nC = getReferenceLabelByNoteCategory(noteRef.noteCategory);
      return nC ? nC.className : '';
    }
    return '';
  }
  public getNoteRefs(secondaryNote: Note): NoteRef[] {
    return getVisible(secondaryNote.noteRefs);
  }
}
