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
  @Input() public verse: Verse;
  public kjvRefVerse: Verse | undefined;
  public constructor(
    public chapterService: ChapterService,
    public saveStateService: SaveStateService,
  ) {}

  public ngOnInit(): void {}

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

  public getClassList(): string {
    const classList: string[] = [];

    if (this.verse && this.verse.context) {
      classList.push('context');
    }
    if (this.verse && this.verse.highlight) {
      classList.push('highlight');
    }

    return classList.toString().replace(/,/g, ' ');
  }

  public getOffSets(): string {
    return `0-${
      this.verse && this.verse.text ? this.verse.text.length - 1 : 0
    }`;
  }
}
