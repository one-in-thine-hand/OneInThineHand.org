import { Component, OnInit, Input } from '@angular/core';
import {
  Verse,
  expandOffsets,
  FormatGroup,
  FormatGroupType,
} from '../../../../../shared/src/shared';

@Component({
  selector: 'app-verse',
  templateUrl: './verse.component.html',
  styleUrls: ['./verse.component.scss'],
})
export class VerseComponent implements OnInit {
  @Input() public verse: Verse;
  public constructor() {}

  public ngOnInit(): void {}

  public getFormatGroups(): FormatGroup[] {
    // console.log(this.verse);

    if (this.verse.formatGroups && this.verse.formatTags && this.verse.text) {
      expandOffsets(this.verse.formatGroups);
      expandOffsets(this.verse.formatTags);

      // console.log(this.verse);
      return this.verse.formatGroups.filter((formatGroup): boolean => {
        return (
          formatGroup.formatGroupType !== FormatGroupType.PAGE_BREAK &&
          formatGroup.formatGroupType !== FormatGroupType.BR
        );
      }); // this.verse.formatTags.map((f): void => {});
    }
    return [];
  }

  public getClassList(): string {
    const classList: string[] = [];

    if (this.verse.context) {
      classList.push('context');
    }
    if (this.verse.highlight) {
      classList.push('highlight');
    }

    return classList.toString().replace(/,/g, ' ');
  }
}
