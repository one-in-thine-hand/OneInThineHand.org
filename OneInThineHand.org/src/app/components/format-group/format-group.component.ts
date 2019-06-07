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
    const m: FMerged[] = [];
    let f2: FMerged | undefined;
    const f = this.formatGroup.uncompressedOffsets
      ? this.formatGroup.uncompressedOffsets.pop() &&
        this.formatGroup.uncompressedOffsets.map(
          (offset): FMerged => {
            const fMerged = new FMerged();
            fMerged.offsets = [offset];
            fMerged.formatTags = this.formatTags.filter(
              (f): boolean => {
                return (
                  f.uncompressedOffsets !== undefined &&
                  f.uncompressedOffsets.includes(offset)
                );
              },
            );
            if (this.verse.note && this.verse.note.secondaryNotes) {
              this.verse.note.secondaryNotes.map(
                (secondaryNote): void => {
                  if (secondaryNote.formatTag) {
                    if (secondaryNote.formatTag.offsets === 'all') {
                      fMerged.formatTags.push(secondaryNote.formatTag);
                    } else if (
                      secondaryNote.formatTag.uncompressedOffsets &&
                      secondaryNote.formatTag.uncompressedOffsets.includes(
                        offset,
                      )
                    ) {
                      fMerged.formatTags.push(secondaryNote.formatTag);
                    }
                  }
                },
              );
            }

            if (f2 && isEqual(f2.formatTags, fMerged.formatTags)) {
              // console.log(isEqual(f2, fMerged));
              // console.log(offset);
              f2.offsets.push(offset);
              // console.log(f2);
            } else {
              if (f2) {
                m.push(f2);
              }
              f2 = fMerged;
            }
            // f2 = fMerged;F
            return fMerged;
          },
        )
      : [];

    if (f2 !== undefined) {
      m.push(f2);
    }
    m.map(
      (u): void => {
        if (u.offsets && this.verse.text) {
          const f = first(u.offsets);
          const l = last(u.offsets);

          u.text = this.verse.text.slice(f, l + 1);
        }
      },
    );
    console.log(m);

    // console.log(f);

    return m;
  }
}
