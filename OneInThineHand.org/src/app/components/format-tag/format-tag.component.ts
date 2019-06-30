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
  VerseNotes,
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
      const richFormatTags = this.fMerged.formatTags.filter((f): boolean => {
        return (
          f.displayAs === DisplayAs.RICHTEXT && f.optional !== Optional.NEVER
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
  private getVisibleRefTags(): RefTag[] | undefined {
    if (this.fMerged.refTags) {
      return this.fMerged.refTags.filter((refTag): boolean => {
        return (
          this.visibilityService.secondaryNotesVisibility.get(
            refTag.secondaryNoteID,
          ) === true
        );
      });
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
            (f.displayAs === DisplayAs.CLASS &&
              f.optional !== Optional.NEVER) ||
            f.formatType === FormatTagType.verseNumber
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
          const tempRefList = this.getVisibleRefTags();

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
              `#${(this.verse.note as VerseNotes)._id as string}`,
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
}
