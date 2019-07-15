import { Component, OnInit, Input } from '@angular/core';
import {
  Verse,
  FormatGroup,
  FormatTag,
} from '../../../../../shared/src/shared';
import { FMerged } from '../../../../../shared/src/models/format_tags/FormatTag';
import { isEqual, last, first } from 'lodash';
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
    // if()
    // console.log(this.formatTags);
    // console.log('formatTags');

    return this.formatGroup.fMerges ? this.formatGroup.fMerges : [];
    // const mergedFormatTags: FMerged[] = [];
    // let lastMerged: FMerged | undefined;
    // this.formatGroup.uncompressedOffsets
    //   ? this.formatGroup.uncompressedOffsets.pop() &&
    //     this.formatGroup.uncompressedOffsets.map(
    //       (offset): FMerged => {
    //         const fMerged = new FMerged();
    //         this.getMergedTags(fMerged, offset);
    //         this.getRefTags(fMerged, offset);

    //         lastMerged = this.checkIfDuplicateMerge(
    //           lastMerged,
    //           fMerged,
    //           offset,
    //           mergedFormatTags,
    //         );

    //         return fMerged;
    //       },
    //     )
    //   : [];

    // if (lastMerged !== undefined) {
    //   mergedFormatTags.push(lastMerged);
    // }
    // mergedFormatTags.map(
    //   (u): void => {
    //     if (u.offsets && this.verse.text) {
    //       const f = first(u.offsets);
    //       const l = last(u.offsets);

    //       u.text = this.verse.text.slice(f, (l as number) + 1);
    //     }
    //   },
    // );
    // // console.log(mergedFormatTags);

    // // console.log(f);

    // if (this.fMerged !== mergedFormatTags) {
    //   this.fMerged = mergedFormatTags;
    //   // console.log('true');
    // }
    // return this.fMerged;
  }

  public getKJVPartVerse(): Verse[] | undefined {
    if (
      this.chapterService.kjvChapterVerse &&
      this.chapterService.kjvChapterVerse.verses
    ) {
      const kjvVerse = this.chapterService.kjvChapterVerse.verses.filter(
        (v): boolean => {
          return (
            v._id !== undefined &&
            this.formatGroup.kjvRef !== undefined &&
            this.formatGroup.kjvRef.includes(v._id)
          );
        },
      );
      this.hasKJVVerse = kjvVerse !== undefined;
      return kjvVerse;
    }
  }

  public getOffSets(f: FMerged): string {
    // console.log(f);

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
