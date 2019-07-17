import { Component, OnInit, Input, HostListener } from '@angular/core';

import { ChapterService } from '../../services/chapter.service';
import { SaveStateService } from '../../services/save-state.service';
import { Verse, FormatGroup, FormatGroupType } from '../../models/verse-notes';
import { expandOffsets } from '../../../../../shared/src/shared';

@Component({
  selector: 'app-verse',
  templateUrl: './verse.component.html',
  styleUrls: ['./verse.component.scss'],
})
export class VerseComponent implements OnInit {
  public kjvRefVerse: Verse | undefined;
  @Input() public verse: Verse;
  public constructor(
    public chapterService: ChapterService,
    public saveStateService: SaveStateService,
  ) {}

  public getClassList(): string {
    const classList: string[] = [];

    if (this.getVerseNoteHasAll()) {
      classList.push('all');
    }

    if (this.verse && this.verse.context) {
      classList.push('context');
    }
    if (this.verse && this.verse.highlight) {
      classList.push('highlight');
    }

    return classList.toString().replace(/,/g, ' ');
  }
  public getFormatGroups(): FormatGroup[] {
    if (
      this.verse &&
      this.verse.formatGroups &&
      this.verse.formatTags &&
      this.verse.text
    ) {
      if (
        this.verse.breakFormatGroups &&
        this.verse.breakFormatGroups.length > 0 &&
        (this.saveStateService.data.poetryVisible ||
          (this.saveStateService.data.blockVisible ||
            this.saveStateService.data.paragraphsVisible))
      ) {
        expandOffsets(this.verse.breakFormatGroups);
      } else {
        expandOffsets(this.verse.formatGroups);
      }
      expandOffsets(this.verse.formatTags);
      try {
        if (
          this.verse.breakFormatGroups &&
          this.verse.breakFormatGroups.length > 0 &&
          (this.saveStateService.data.poetryVisible ||
            (this.saveStateService.data.blockVisible ||
              this.saveStateService.data.paragraphsVisible))
        ) {
          return this.verse.breakFormatGroups.filter((formatGroup): boolean => {
            switch (formatGroup.formatGroupType) {
              case FormatGroupType.Para: {
                return this.saveStateService.data.paragraphsVisible;
              }
              case FormatGroupType.ParaGap: {
                return this.saveStateService.data.paragraphsVisible;
              }
              case FormatGroupType.Line: {
                return this.saveStateService.data.poetryVisible;
                break;
              }
              case FormatGroupType.LineGap: {
                return this.saveStateService.data.poetryVisible;
                break;
              }
              case FormatGroupType.Block: {
                return this.saveStateService.data.blockVisible;
                break;
              }
              case FormatGroupType.BlockGap: {
                return this.saveStateService.data.blockVisible;
                break;
              }
            }
            return (
              formatGroup.formatGroupType !== FormatGroupType.PAGE_BREAK &&
              formatGroup.formatGroupType !== FormatGroupType.BR
            );
          });
        }
      } catch (error) {}
      return this.verse.formatGroups.filter((formatGroup): boolean => {
        return (
          formatGroup.formatGroupType !== FormatGroupType.PAGE_BREAK &&
          formatGroup.formatGroupType !== FormatGroupType.BR
        );
      }); // this.verse.formatTags.map((f): void => {});
    } else {
    }
    return [];
  }

  // @HostListener('mouseup', ['$event'])
  // public onPopState(event: PopStateEvent): void {
  // }
  public getID(): string {
    // if (this.verse === undefined || this.verse._id === undefined) {
    // }
    return this.verse !== undefined && this.verse._id !== undefined
      ? this.verse._id
      : '';
  }

  public getOffSets(): string {
    return `0-${
      this.verse && this.verse.text ? this.verse.text.length - 1 : 0
    }`;
  }

  public ngOnInit(): void {}

  private getVerseNoteHasAll(): boolean {
    if (
      this.chapterService.chapterNotes &&
      this.chapterService.chapterNotes.verseNotes
    ) {
      const verseNote = this.chapterService.chapterNotes.verseNotes.find(
        (vN): boolean => {
          return (
            this.verse._id !== undefined &&
            this.verse._id.replace('verse', 'verse-notes') === vN._id
          );
        },
      );
      if (verseNote) {
        if (
          verseNote.notes &&
          verseNote.notes.filter((note): boolean => {
            return (
              (note.visible &&
                (note.offsets !== undefined && note.offsets.startsWith('0'))) ||
              note.offsets === 'all'
            );
          }).length > 0
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
