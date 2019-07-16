import { Component, Input, OnInit } from '@angular/core';
import { last } from 'lodash';

import {
  FMerged,
  RefTag,
} from '../../../../../shared/src/models/format_tags/FormatTag';
import {
  DisplayAs,
  FormatTagType,
  formatTagTypeOptions,
  Optional,
  Verse,
  VerseNote,
} from '../../models/verse-notes';
import { asyncScrollIntoView } from '../../scroll-into-view';
import { ChapterService } from '../../services/chapter.service';
import { findByAttribute } from '../../services/history.service';
import { MarkService } from '../../services/mark.service';
import { VisibilityService } from '../../services/visibility.service';

@Component({
  selector: 'app-format-tag',
  templateUrl: './format-tag.component.html',
  styleUrls: ['./format-tag.component.scss'],
})
export class FormatTagComponent implements OnInit {
  public classList: string[] = [];
  @Input() public fMerged: FMerged;
  public offsets = '';
  public refList: string[] | undefined;
  public text = '';
  @Input() public verse: Verse;

  public constructor(
    public markService: MarkService,
    public visibilityService: VisibilityService,

    public chapterService: ChapterService,
  ) {}

  public async formatTagClick(event: Event): Promise<void> {
    // const selection = window.getSelection();
    // this.visibilityService.resetHighlight();
    if (this.checkNoTextIsSelected()) {
      this.chapterService.resetNoteVis();

      if (this.fMerged.refTags) {
        if (this.refList === undefined) {
          // this.refList = this.fMerged.refTags.map((refT): string => {
          //   return refT.secondaryNoteID;
          // });
          const tempRefList = this.getVisibleRefTags(true);

          if (tempRefList) {
            this.refList = tempRefList.map((refTag): string => {
              return refTag.secondaryNoteID;
            });
          }
        }
        if (this.refList) {
          const id = this.refList.pop();
          const r = findByAttribute(
            'secondaryNoteID',
            id,
            this.fMerged.refTags,
          );

          if (r) {
            r.highlight = true;

            await asyncScrollIntoView(
              `#${(this.verse.note as VerseNote)._id as string}`,
            );
            // await asyncScrollIntoView(`#${r.secondaryNoteID}`);
          } else {
            this.refList = undefined;
          }
        }
        // this.fMerged.refTags[0].highlight = !this.fMerged.refTags[0].highlight;
      }
      // if (selection) {
      //   selection.addRange(selection.getRangeAt(0));
      // }
    }
  }

  public getClassList(): string {
    this.getVisibleRefTags();
    const classList: string[] = [];
    const visibleRefTags = this.getVisibleRefTags();
    if (this.fMerged.breaks) {
      this.fMerged.breaks.map((brk): void => {
        const fto = formatTagTypeOptions.find((f): boolean => {
          return f.formatTagType === brk.formatType;
        });
        if (fto && fto.className) {
          // console.log(fto.className);
          classList.push(fto.className);
        }
      });
    }
    if (visibleRefTags && visibleRefTags.length !== 0) {
      visibleRefTags.length > 1
        ? classList.push('oith-ref-double')
        : classList.push('oith-ref-single');

      if (
        visibleRefTags.filter((f): boolean => {
          return f.highlight === true;
        }).length > 0
      ) {
        classList.push('ref-selected');
      } else {
        this.refList = undefined;
      }
      // this.fMerged.refTags.map(
      //   (f): void => {
      //     // if(f)
      //   },
      // );
    }
    if (this.fMerged.formatTags && this.fMerged.formatTags.length > 0) {
      this.fMerged.formatTags
        .filter((f): boolean => {
          return (
            (f.displayAs === (DisplayAs.CLASS as number) &&
              f.optional !== (Optional.NEVER as number)) ||
            f.formatType === (FormatTagType.verseNumber as number)
          );
        })
        .map((f): void => {
          const fTO = formatTagTypeOptions.find((formatTagOption): boolean => {
            return formatTagOption.formatTagType === f.formatType;
          });
          if (fTO && fTO.className) {
            classList.push(fTO.className);
          }
        });
    }
    if (
      this.classList.toString().replace(/,/g, ' ') !==
      classList.toString().replace(/,/g, ' ')
    ) {
      this.classList = classList;
    }
    return this.classList.toString().replace(/,/g, ' ');
  }

  public getOffSets(): string {
    if (this.fMerged.offsets) {
      return `${this.fMerged.offsets[0]}-${last(this.fMerged.offsets)}`;
    }
    return '0,0';
  }

  public getText(): string {
    const text = this.fMerged.text;
    if (this.fMerged.formatTags && this.fMerged.formatTags.length > 0) {
      const richFormatTags = this.fMerged.formatTags.filter((f): boolean => {
        return (
          f.displayAs === (DisplayAs.RICHTEXT as number) &&
          f.optional !== (Optional.NEVER as number)
        );
      });
      // .map(
      //   (f): void => {
      //   },
      // );

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

  public ngOnInit(): void {}

  private checkNoTextIsSelected(): boolean {
    try {
      const selection = window.getSelection();
      return selection
        ? selection.getRangeAt(0).toString().length === 0
        : false;
    } catch (error) {
      return false;
    }
  }
  private getVisibleRefTags(includeAll?: boolean): RefTag[] | undefined {
    if (this.fMerged.refTags) {
      return this.fMerged.refTags.filter((refTag): boolean => {
        if (
          !includeAll &&
          ((refTag.offsets !== undefined && refTag.offsets.startsWith('0')) ||
            refTag.offsets === 'all')
        ) {
          return (
            this.visibilityService.secondaryNotesVisibility.get(
              refTag.secondaryNoteID,
            ) === true && refTag.highlight === true
          );
        }

        return (
          this.visibilityService.secondaryNotesVisibility.get(
            refTag.secondaryNoteID,
          ) === true
        );
      });
    }
  }
}
