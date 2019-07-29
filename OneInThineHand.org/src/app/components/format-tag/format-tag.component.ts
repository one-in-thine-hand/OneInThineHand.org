import { Component, Input, OnInit } from '@angular/core';
import { last, sortBy, uniqBy } from 'lodash';

import '../../../../../shared/src/models/format_tags/FormatTag';
import {
  DisplayAs,
  FormatTagType,
  formatTagTypeOptions,
  Optional,
  Verse,
  VerseNote,
  FMerged,
  RefTag,
} from '../../models/verse-notes';
import { asyncScrollIntoView } from '../../scroll-into-view';
import { ChapterService } from '../../services/chapter.service';
import { findByAttribute } from '../../services/history.service';
import { MarkService } from '../../services/mark.service';
import { VisibilityService } from '../../services/visibility.service';
import { SaveStateService } from '../../services/save-state.service';
import { TempSettingsService } from '../../services/temp-settings.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-format-tag',
  templateUrl: './format-tag.component.html',
  styleUrls: ['./format-tag.component.scss'],
})
export class FormatTagComponent implements OnInit {
  public classList: string[] = [];
  public className = '';
  @Input() public fMerged: FMerged;
  public formatTagClickObserve = new Observable<Event>();
  public offsets = '';
  public refList: string[] | undefined;
  public text = '';
  @Input() public verse: Verse;

  public constructor(
    public markService: MarkService,
    public visibilityService: VisibilityService,
    public saveStateService: SaveStateService,
    public chapterService: ChapterService,
    public tempSettingsService: TempSettingsService,
  ) {}

  public async formatTagClick(event: Event): Promise<void> {
    // alert('clicked');
    // const test = this.checkNoTextIsSelected();
    // alert(test);
    // console.log(test);

    this.chapterService.resetNoteVis();

    if (this.fMerged.refTags) {
      this.setRefList();

      if (
        this.saveStateService.data['pronunciation'] &&
        !this.saveStateService.data['pronunciation_more']
      ) {
        this.playPronunciation();
      }
      await this.gotoNote();
    }
    if (this.checkNoTextIsSelected()) {
    }
    this.chapterService.formatTagObserve.next();
  }

  public getClassList(): string {
    const classList: string[] = [];
    const visibleRefTags = this.getVisibleRefTags(false, false);
    const pronunciationOverlay = this.saveStateService.data.noteTypes
      ? this.saveStateService.data.noteTypes.noteTypes.find(
          (noteType): boolean => {
            // console.log(noteType);

            return noteType.className === 'overlay-pronunciation';
          },
        )
      : undefined;
    // console.log(this.saveStateService.data.noteTypeSettings);
    // console.log(this.saveStateService.data.noteTypes);

    if (
      pronunciationOverlay &&
      pronunciationOverlay.visibility &&
      this.fMerged.pronunciationIcon &&
      this.saveStateService.data['pronunciation'] &&
      !this.saveStateService.data['pronunciation_more']
    ) {
      classList.push('pronunciation-icon');
    }
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

      return this.markService.getFormatTagRichText(
        this.fMerged.text,
        richFormatTags,
      );
    }
    if (this.text !== text) {
      this.text = text;
    }

    return this.text;
  }

  public ngOnInit(): void {
    this.chapterService.formatTagObserve.pipe().subscribe((): void => {
      this.className = this.getClassList();
    });
    this.formatTagClickObserve.subscribe(
      async (event): Promise<void> => {
        try {
          await this.formatTagClick(event);
        } catch (error) {
          alert(error);
        }
      },
    );
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
  private getVisibleRefTags(
    includeAll?: boolean,
    includeDup?: boolean,
  ): RefTag[] | undefined {
    if (this.fMerged.refTags) {
      const refs = this.fMerged.refTags.filter((refTag): boolean => {
        if (
          refTag.pronunciation &&
          !this.saveStateService.data.pronunciationVisible
        ) {
          return false;
        }
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
      if (!this.tempSettingsService.editMode && !includeDup) {
        return uniqBy(refs, (ref): number => {
          return ref.uncompressedOffsets
            ? ref.uncompressedOffsets.length
            : 10000;
        });
      }
      return refs;
    }
  }

  private async gotoNote(): Promise<void> {
    if (this.refList) {
      const id = this.refList.pop();
      const r = findByAttribute('secondaryNoteID', id, this.fMerged.refTags);
      if (r) {
        this.saveStateService.data.notesPaneToggle = true;
        r.highlight = true;
        await asyncScrollIntoView(
          `#${(this.verse.note as VerseNote)._id as string}`,
        );
      } else {
        this.refList = undefined;
      }
    }
  }

  private playPronunciation(): void {
    if (this.fMerged.pronunciation && this.fMerged.refTags) {
      this.fMerged.refTags.map((ft): void => {
        if (ft.pronunciationHref) {
          const audio = new Audio(`assets/audio/${ft.pronunciationHref}`);
          audio.play();
        }
      });
    }
  }

  private setRefList(): void {
    if (this.refList === undefined) {
      const tempRefList = this.getVisibleRefTags(true, false);
      console.log(tempRefList);

      if (tempRefList) {
        this.refList = sortBy(tempRefList, (t): number => {
          return t.noteType;
        })
          .reverse()
          .map((refTag): string => {
            return refTag.secondaryNoteID;
          });
      }
    }
  }
}
