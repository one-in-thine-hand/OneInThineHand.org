import { Component, OnInit, Input } from '@angular/core';
import {
  Verse,
  parseOffsets,
  expandOffsets,
  FormatGroup,
  NoteRef,
} from '../../../../../shared/src/shared';
import { ReferenceLabels } from '../../../../../shared/src/models/notes/Note';

@Component({
  selector: 'app-verse',
  templateUrl: './verse.component.html',
  styleUrls: ['./verse.component.scss'],
})
export class VerseComponent implements OnInit {
  @Input() public verse: Verse;
  public constructor() {}

  public ngOnInit() {}

  public getFormatGroups(): FormatGroup[] {
    // console.log(this.verse);

    if (this.verse.formatGroups && this.verse.formatTags && this.verse.text) {
      expandOffsets(this.verse.formatGroups);
      expandOffsets(this.verse.formatTags);

      // console.log(this.verse);
      return this.verse.formatGroups; // this.verse.formatTags.map((f): void => {});
    }
    return [];
  }
}
