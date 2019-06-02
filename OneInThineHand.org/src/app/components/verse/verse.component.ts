import { Component, OnInit, Input } from '@angular/core';
import { Verse, parseOffsets } from '../../../../../shared/src/shared';

@Component({
  selector: 'app-verse',
  templateUrl: './verse.component.html',
  styleUrls: ['./verse.component.scss'],
})
export class VerseComponent implements OnInit {
  @Input() public verse: Verse;
  public constructor() {}

  public ngOnInit() {}

  public getFormatGroups(): void {
    if (this.verse.formatGroups && this.verse.formatTags && this.verse.text) {
      this.verse.formatTags.map((f): void => {});
      this.verse.formatGroups.map(
        (f): void => {
          f.uncompressedOffsets = parseOffsets(f.offsets);
        },
      );
      // this.verse.formatTags.map((f): void => {});
    }
  }
}
