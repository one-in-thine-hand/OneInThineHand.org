import { Injectable } from '@angular/core';
import {
  Verse,
  FormatGroup,
  FormatTag,
  Note,
  FormatGroupType,
  parseOffsets,
  DisplayAs,
  VerseNotes,
} from '../../../../shared/src/shared';
import {
  FMerged,
  RefTag,
} from '../../../../shared/src/models/format_tags/FormatTag';
import { isEqual, first, last } from 'lodash';
import { ChapterVerses } from '../../../../format-tags/src/main';
import { HistoryService } from './history.service';
import { ChapterNotes } from '../../../../notes/src/main';
import { SaveStateService } from './save-state.service';
import PQueue from 'p-queue/dist';
@Injectable({
  providedIn: 'root',
})
export class FormatTagService {
  public constructor(
    private historyService: HistoryService,
    private saveStateService: SaveStateService,
  ) {}

  private buildOffset(item: {
    offsets: string | undefined;
    uncompressedOffsets: number[] | undefined;
  }): void {
    item.uncompressedOffsets = parseOffsets(item.offsets);
  }

  public resetFormatTagsQueue = new PQueue({ concurrency: 1 });
  public async resetFormatTags(
    chapterVerses: ChapterVerses | undefined,
    chapterNotes: ChapterNotes | undefined,
  ): Promise<void> {
    await this.resetFormatTagsQueue.add(
      (): void => {
        if (chapterVerses && chapterNotes) {
          this.historyService.addHistory(
            chapterVerses,
            this.saveStateService.data,
            chapterNotes,
          );
        }
        if (chapterVerses && chapterVerses.verses) {
          chapterVerses.verses.map(
            (verse): void => {
              this.buildOffsets(verse.formatGroups);
              this.buildOffsets(verse.formatTags);
              this.buildFormatGroups(
                verse.formatGroups,
                verse.formatTags,
                verse.note,
                verse,
              );
            },
          );
          console.log(chapterVerses);
        }
      },
    );
  }
  public buildOffsets(
    formatGroups:
      | {
          offsets: string | undefined;
          uncompressedOffsets: number[] | undefined;
        }[]
      | undefined,
  ): void {
    if (formatGroups) {
      formatGroups.map(
        (fGrp): void => {
          this.buildOffset(fGrp);
        },
      );
    }
  }
  public buildFormatGroups(
    formatGroups: FormatGroup[] | undefined,
    fTags: FormatTag[] | undefined,
    note: VerseNotes | undefined,
    verse: Verse,
  ): void {
    if (formatGroups && fTags) {
      formatGroups
        .filter(
          (grp): boolean => {
            return (
              grp.formatGroupType !== FormatGroupType.PAGE_BREAK &&
              grp.formatGroupType !== FormatGroupType.BR &&
              grp.offsets !== undefined
            );
          },
        )
        .map(
          (grp): void => {
            this.buildFormatGroup(grp, fTags, note, verse);
          },
        );
    }
  }
  public buildFormatGroup(
    grp: FormatGroup,
    fTags: FormatTag[] | undefined,
    note: VerseNotes | undefined,
    verse: Verse,
  ): void {
    grp.uncompressedOffsets = parseOffsets(grp.offsets);
    if (grp.uncompressedOffsets) {
      grp.uncompressedOffsets.pop();
      const fMergeds: FMerged[] = [];
      let lastMerged: FMerged | undefined;
      grp.uncompressedOffsets.map(
        (o): void => {
          const fMerged = new FMerged();
          fMerged.offsets = [o];
          fMerged.formatTags = this.getFormatTags(o, fTags);
          fMerged.refTags = this.getRefTags(o, note);
          if (!lastMerged) {
            lastMerged = fMerged;
          } else {
            if (this.fmergeEqual(lastMerged, fMerged)) {
              // console.log('jjj');

              lastMerged.offsets.push(o);
            } else {
              fMergeds.push(lastMerged);
              lastMerged = undefined;
              lastMerged = fMerged;
            }
          }
        },
      );
      if (lastMerged) {
        fMergeds.push(lastMerged);
      }
      grp.fMerges = fMergeds;
      this.addText(grp.fMerges, verse);
    }
  }
  private addText(fMerges: FMerged[], verse: Verse): void {
    if (verse.text) {
      fMerges.map(
        (fM): void => {
          const f = first(fM.offsets);
          const l = last(fM.offsets);
          if (f !== undefined && l !== undefined) {
            fM.text = verse.text ? verse.text.slice(f, l + 1) : '';
          } else {
            console.log(`${f} ${l}`);
          }
          // console.log(verse.text ? verse.text.slice(f, l) : '');
        },
      );
    }
  }
  public fmergeEqual(lastMerged: FMerged, fMerged: FMerged): boolean {
    // return (
    //   lastMerged.formatTags === fMerged.formatTags &&
    //   lastMerged.refTags === fMerged.refTags
    // );
    return (
      isEqual(lastMerged.formatTags, fMerged.formatTags) &&
      isEqual(lastMerged.refTags, fMerged.refTags)
    );
  }
  public getFormatTags(
    o: number,
    fTags: FormatTag[] | undefined,
  ): FormatTag[] | undefined {
    if (fTags) {
      const oFtags = fTags.filter(
        (f): boolean => {
          return (
            f.uncompressedOffsets !== undefined &&
            f.uncompressedOffsets.includes(o) &&
            f.displayAs !== DisplayAs.NEVER
          );
        },
      );

      return oFtags.length > 0 ? oFtags : undefined;
    }
    return undefined;
  }
  public getRefTags(
    o: number,
    note: VerseNotes | undefined,
  ): RefTag[] | undefined {
    if (note && note.notes) {
      const oFtags = note.notes
        .filter(
          (f): boolean => {
            if (f.refTag && f.refTag.offsets === 'all') {
              return true;
            }
            return (
              f.refTag !== undefined &&
              f.uncompressedOffsets !== undefined &&
              (f.offsets === 'all' || f.uncompressedOffsets.includes(o))
            );
          },
        )
        .map(
          (s): RefTag => {
            return s.refTag as RefTag;
          },
        );

      return oFtags.length > 0 ? oFtags : undefined;
    }
    return undefined;
  }
}
