import { Component, OnInit, Input } from '@angular/core';
import {
  Verse,
  FormatGroup,
  FormatTag,
} from '../../../../../shared/src/shared';
import { FMerged } from '../../../../../shared/src/models/format_tags/FormatTag';
import { isEqual, last, first } from 'lodash';
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
  public getFormatTags(): FMerged[] {
    // if()
    // console.log(this.formatTags);
    const mergedFormatTags: FMerged[] = [];
    let lastMerged: FMerged | undefined;
    this.formatGroup.uncompressedOffsets
      ? this.formatGroup.uncompressedOffsets.pop() &&
        this.formatGroup.uncompressedOffsets.map(
          (offset): FMerged => {
            const fMerged = new FMerged();
            this.getMergedTags(fMerged, offset);
            this.getRefTags(fMerged, offset);

            lastMerged = this.checkIfDuplicateMerge(
              lastMerged,
              fMerged,
              offset,
              mergedFormatTags,
            );

            return fMerged;
          },
        )
      : [];

    if (lastMerged !== undefined) {
      mergedFormatTags.push(lastMerged);
    }
    mergedFormatTags.map((u): void => {
      if (u.offsets && this.verse.text) {
        const f = first(u.offsets);
        const l = last(u.offsets);

        u.text = this.verse.text.slice(f, (l as number) + 1);
      }
    });
    // console.log(mergedFormatTags);

    // console.log(f);

    return mergedFormatTags;
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

  private getRefTags(fMerged: FMerged, offset: number): void {
    if (this.verse.note && this.verse.note.secondaryNotes) {
      this.verse.note.secondaryNotes.map((secondaryNote): void => {
        if (secondaryNote.refTag) {
          if (
            secondaryNote.offsets === 'all' ||
            (secondaryNote.uncompressedOffsets &&
              secondaryNote.uncompressedOffsets.includes(offset))
          ) {
            fMerged.refTags
              ? fMerged.refTags.push(secondaryNote.refTag)
              : (fMerged.refTags = [secondaryNote.refTag]);
          }
        }
      });
      this.verse.note.secondaryNotes.map((secondaryNote): void => {
        if (secondaryNote.formatTag) {
          if (secondaryNote.formatTag.offsets === 'all') {
            fMerged.formatTags.push(secondaryNote.formatTag);
          } else if (
            secondaryNote.formatTag.uncompressedOffsets &&
            secondaryNote.formatTag.uncompressedOffsets.includes(offset)
          ) {
            fMerged.formatTags.push(secondaryNote.formatTag);
          }
        }
      });
    }
  }

  public getOffSets(f: FMerged): string {
    // console.log(f);

    if (f.offsets) {
      return `${f.offsets[0]}-${last(f.offsets)}`;
    }
    return '0,0';
  }
}
