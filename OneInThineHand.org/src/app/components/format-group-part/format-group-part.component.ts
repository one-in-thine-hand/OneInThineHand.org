import { Component, OnInit, Input } from '@angular/core';
import { Verse, FormatTag } from '../../../../../shared/src/shared';
import { FMerged } from '../../../../../shared/src/models/format_tags/FormatTag';
import { isEqual, last } from 'lodash';
import { FormatGroupPart } from '../../../../../shared/src/models/format_groups/FormatGroup';
import { ChapterService } from '../../services/chapter.service';
@Component({
  selector: 'app-format-group-part',
  templateUrl: './format-group-part.component.html',
  styleUrls: ['./format-group-part.component.scss'],
})
export class FormatGroupPartComponent implements OnInit {
  public fMerged: FMerged[] = [];
  @Input() public formatGroup: FormatGroupPart;
  @Input() public formatTags: FormatTag[];
  public hasKJVVerse = false;
  @Input() public verse: Verse;
  public constructor(public chapterService: ChapterService) {}
  /**
   * getFormatTags
   */
  public getFormatTags(): FMerged[] {
    return this.formatGroup.fMerges ? this.formatGroup.fMerges : [];
  }

  public getOffSets(f: FMerged): string {
    if (f.offsets) {
      return `${f.offsets[0]}-${last(f.offsets)}`;
    }
    return '0,0';
  }

  public ngOnInit(): void {
    console.log(this.formatGroup.kjvRef);
  }

  private checkIfDuplicateMerge(
    lastMerged: FMerged | undefined,
    fMerged: FMerged,
    offset: number,
    mergedFormatTags: FMerged[],
  ): FMerged {
    if (
      lastMerged &&
      isEqual(lastMerged.formatTags, fMerged.formatTags) &&
      isEqual(lastMerged.refTags, fMerged.refTags)
    ) {
      lastMerged.offsets.push(offset);
    } else {
      if (lastMerged) {
        mergedFormatTags.push(lastMerged);
      }
      lastMerged = fMerged;
    }
    return lastMerged;
  }

  private getMergedTags(fMerged: FMerged, offset: number): void {
    fMerged.offsets = [offset];

    fMerged.formatTags = this.formatTags.filter((f): boolean => {
      return (
        f.uncompressedOffsets !== undefined &&
        f.uncompressedOffsets.includes(offset)
      );
    });
  }

  private getRefTags(fMerged: FMerged, offset: number): void {}
}
