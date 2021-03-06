import { Component, OnInit, Input } from '@angular/core';
import {
  FMerged,
  RefTag,
} from '../../../../../shared/src/models/format_tags/FormatTag';
import {
  Optional,
  formatTagTypeOptions,
  DisplayAs,
  FormatTagType,
  Verse,
} from '../../../../../shared/src/shared';
import { MarkService } from '../../services/mark.service';
import { last } from 'lodash';
import { VisibilityService } from '../../services/visibility.service';
import { ChapterService } from '../../services/chapter.service';
import { findByAttribute } from '../../services/history.service';
import { asyncScrollIntoView } from '../../scroll-into-view';

@Component({
  selector: 'app-format-tag',
  templateUrl: './format-tag.component.html',
  styleUrls: ['./format-tag.component.scss'],
})
export class FormatTagComponent implements OnInit {
  @Input() public fMerged: FMerged;
  @Input() public verse: Verse;
  public text: string = '';
  public classList: string[] = [];
  public offsets = '';
  public refList: string[] | undefined;

  public constructor(
    public markService: MarkService,
    public visibilityService: VisibilityService,

    public chapterService: ChapterService,
  ) {}

  public ngOnInit(): void {}

  public getText(): string {
    const text = this.fMerged.text;
    if (this.fMerged.formatTags && this.fMerged.formatTags.length > 0) {
      const richFormatTags = this.fMerged.formatTags.filter(
        (f): boolean => {
          return (
            f.displayAs === DisplayAs.RICHTEXT && f.optional !== Optional.NEVER
          );
        },
      );
      // .map(
      //   (f): void => {
      //     console.log(f);
      //   },
      // );
      // console.log('oiasjdfoiajsdfoiasjdfoi');
      // console.log('richtest');

      return this.markService.getFormatTagRichText(
        this.fMerged.text,
        richFormatTags,
      );

      // return text;
    }
    if (this.text !== text) {
      this.text = text;
    }

    return this.text;
  }
  private getVisibleRefTags(): RefTag[] | undefined {
    if (this.fMerged.refTags) {
      return this.fMerged.refTags.filter(
        (refTag): boolean => {
          return (
            this.visibilityService.secondaryNotesVisibility.get(
              refTag.secondaryNoteID,
            ) === true
          );
        },
      );
    }
  }

  public getClassList(): string {
    this.getVisibleRefTags();
    const classList: string[] = [];
    const visibleRefTags = this.getVisibleRefTags();
    if (visibleRefTags && visibleRefTags.length !== 0) {
      visibleRefTags.length > 1
        ? classList.push('oith-ref-double')
        : classList.push('oith-ref-single');

      if (
        visibleRefTags.filter(
          (f): boolean => {
            return f.highlight === true;
          },
        ).length > 0
      ) {
        console.log('jhhh0');

        classList.push('ref-selected');
      } else {
        this.refList = undefined;
      }
      // this.fMerged.refTags.map(
      //   (f): void => {
      //     // if(f)
      //   },
      // );
      // console.log(this.fMerged.refTags);
    }
    if (this.fMerged.formatTags && this.fMerged.formatTags.length > 0) {
      this.fMerged.formatTags
        .filter(
          (f): boolean => {
            return (
              (f.displayAs === DisplayAs.CLASS &&
                f.optional !== Optional.NEVER) ||
              f.formatType === FormatTagType.verseNumber
            );
          },
        )
        .map(
          (f): void => {
            const fTO = formatTagTypeOptions.find(
              (formatTagOption): boolean => {
                return formatTagOption.formatTagType === f.formatType;
              },
            );
            // console.log(fTO ? fTO.className : 'Nothing');
            if (fTO && fTO.className) {
              classList.push(fTO.className);
            }
          },
        );

      console.log();
    }
    if (
      this.classList.toString().replace(/,/s, ' ') !==
      classList.toString().replace(/,/s, ' ')
    ) {
      this.classList = classList;
    }
    return this.classList.toString().replace(/,/g, ' ');
  }

  public getOffSets(): string {
    // console.log(f);

    if (this.fMerged.offsets) {
      return `${this.fMerged.offsets[0]}-${last(this.fMerged.offsets)}`;
    }
    return '0,0';
  }

  public async formatTagClick(event: Event): Promise<void> {
    // const selection = window.getSelection();
    // console.log('hhgg');
    // console.log(event);
    // this.visibilityService.resetHighlight();
    this.chapterService.resetNoteVis();

    if (this.fMerged.refTags) {
      if (this.refList === undefined) {
        this.refList = this.fMerged.refTags.map(
          (refT): string => {
            return refT.secondaryNoteID;
          },
        );
      }
      const id = this.refList.pop();
      const r = findByAttribute('secondaryNoteID', id, this.fMerged.refTags);
      console.log(r);

      if (r) {
        r.highlight = true;
        await asyncScrollIntoView(`#eng-${r.secondaryNoteID}`);
      } else {
        this.refList = undefined;
      }
      // this.fMerged.refTags[0].highlight = !this.fMerged.refTags[0].highlight;
    }
    // if (selection) {
    //   selection.addRange(selection.getRangeAt(0));
    // }
  }
}
