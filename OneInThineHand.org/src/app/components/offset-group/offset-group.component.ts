import { Component, OnInit, Input } from '@angular/core';
import { OffsetGroup } from '../../services/offset-groups.service';
import { VerseNote, Note } from '../../models/verse-notes';

@Component({
  selector: 'app-offset-group',
  templateUrl: './offset-group.component.html',
  styleUrls: ['./offset-group.component.scss'],
})
export class OffsetGroupComponent implements OnInit {
  @Input() public offsetGroup: OffsetGroup;
  @Input() public verseNotes: VerseNote;
  constructor() {}

  public highlight(notes: Note[]): boolean {
    return (
      notes.filter((note): boolean => {
        return (
          note.noteRefFormatTag !== undefined && note.noteRefFormatTag.highlight
        );
      }).length > 0
    );
  }

  public ngOnInit() {
    console.log(this.offsetGroup);
  }
}
