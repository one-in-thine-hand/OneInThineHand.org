import { Injectable } from '@angular/core';
import {
  Verse,
  FormatGroup,
  FormatTag,
  Note,
  FormatGroupType,
  parseOffsets,
  DisplayAs,
} from '../../../../shared/src/shared';
import {
  FMerged,
  RefTag,
} from '../../../../shared/src/models/format_tags/FormatTag';
import { isEqual } from 'lodash';
import { ChapterVerses } from '../../../../format-tags/src/main';
@Injectable({
  providedIn: 'root',
})
export class FormatTagService {
  public constructor() {}

  private buildOffset(item: {
    offsets: string | undefined;
    uncompressedOffsets: number[] | undefined;
  }): void {
    item.uncompressedOffsets = parseOffsets(item.offsets);
  }

  public resetFormatTags(chapterVerses: ChapterVerses | undefined): void {
    if (chapterVerses && chapterVerses.verses) {
      chapterVerses.verses.map(
        (verse): void => {
          this.buildOffsets(verse.formatGroups);
          this.buildOffsets(verse.formatTags);
          this.buildFormatGroups(
            verse.formatGroups,
            verse.formatTags,
            verse.note,
          );
        },
      );
      console.log(chapterVerses);
    }
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
    note: Note | undefined,
  ): void {
    if (formatGroups && fTags && note) {
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
            this.buildFormatGroup(grp, fTags, note);
          },
        );
    }
  }
  public buildFormatGroup(
    grp: FormatGroup,
    fTags: FormatTag[] | undefined,
    note: Note | undefined,
  ): void {
    grp.uncompressedOffsets = parseOffsets(grp.offsets);
    if (grp.uncompressedOffsets) {
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
              lastMerged.offsets.push(o);
            } else {
              fMergeds.push(lastMerged);
              lastMerged = fMerged;
            }
          }
        },
      );
      if (lastMerged) {
        fMergeds.push(lastMerged);
      }
    }
  }
  public fmergeEqual(lastMerged: FMerged, fMerged: FMerged): boolean {
    return (
      isEqual(lastMerged.formatTags, fMerged.formatTags) &&
      isEqual(lastMerged.offsets, fMerged.offsets)
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
  public getRefTags(o: number, note: Note | undefined): RefTag[] | undefined {
    if (note && note.secondaryNotes) {
      const oFtags = note.secondaryNotes
        .filter(
          (f): boolean => {
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
