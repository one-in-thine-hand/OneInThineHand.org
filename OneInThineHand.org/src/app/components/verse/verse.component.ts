import { Component, OnInit, Input, HostListener } from '@angular/core';
import {
  Verse,
  expandOffsets,
  FormatGroup,
  FormatGroupType,
} from '../../../../../shared/src/shared';
import { ChapterService } from '../../services/chapter.service';
import { SaveStateService } from '../../services/save-state.service';

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
    // console.log(this.verse);

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
        console.log('tedt');

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
      } catch (error) {
        console.log(error);
      }
      // console.log(this.verse);
      return this.verse.formatGroups.filter((formatGroup): boolean => {
        return (
          formatGroup.formatGroupType !== FormatGroupType.PAGE_BREAK &&
          formatGroup.formatGroupType !== FormatGroupType.BR
        );
      }); // this.verse.formatTags.map((f): void => {});
    } else {
      // console.log(this.verse);
    }
    return [];
  }

  // @HostListener('mouseup', ['$event'])
  // public onPopState(event: PopStateEvent): void {
  //   // console.log(event);
  // }
  public getID(): string {
    // if (this.verse === undefined || this.verse._id === undefined) {
    //   console.log(this.verse);
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
      this.chapterService.chapterNotes.notes
    ) {
      const verseNote = this.chapterService.chapterNotes.notes.find(
        (vN): boolean => {
          return (
            this.verse._id !== undefined &&
            this.verse._id.replace('verse', 'verse-notes') === vN._id
          );
        },
      );
      if (verseNote) {
        console.log(verseNote);

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
          console.log('oaisjdfoiajsdfoi');
          return true;
        }
      }
    }
    return false;
  }
}
