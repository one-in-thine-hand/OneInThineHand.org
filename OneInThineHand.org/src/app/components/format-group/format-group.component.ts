import { Component, OnInit, Input } from '@angular/core';
import {
  Verse,
  FormatGroup,
  FormatTag,
} from '../../../../../shared/src/shared';

export class FMerged {
  public uncompressedOffets: number[] = [];
  public formatTags: FormatTag[] = [];
}

@Component({
  selector: 'app-format-group',
  templateUrl: './format-group.component.html',
  styleUrls: ['./format-group.component.scss'],
})
export class FormatGroupComponent implements OnInit {
  @Input() public verse: Verse;
  @Input() public formatGroup: FormatGroup;
  @Input() public formatTags: FormatTag[];
  public constructor() {}

  public ngOnInit(): void {}

  /**
   * getFormatTags
   */
  public getFormatTags(): FormatTag[] {
    const f = this.formatGroup.uncompressedOffsets
      ? this.formatGroup.uncompressedOffsets.map(
          (offset): FMerged => {
            const formatTag = new FMerged();
            formatTag.formatTags = this.formatTags.filter(
              (f): boolean => {
                return (
                  f.uncompressedOffsets !== undefined &&
                  f.uncompressedOffsets.includes(offset)
                );
              },
            );
            return formatTag;
          },
        )
      : [];

    return [];
  }
}
