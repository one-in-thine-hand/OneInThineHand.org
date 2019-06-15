import { Component, OnInit, Input } from '@angular/core';
import { Paragraph } from '../../../../../chapter/src/Paragraph';
import { Verse } from '../../../../../shared/src/shared';

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss'],
})
export class ParagraphComponent implements OnInit {
  @Input() public paragraph: Paragraph;
  @Input() public verses: Verse[];
  public constructor() {}

  public ngOnInit(): void {}

  /**
   * getVerses
   */
  public getVerses(): Verse[] {
    return this.verses.filter(
      (verse): boolean => {
        return (
          this.paragraph.verseIds !== undefined &&
          verse.verseID !== undefined &&
          this.paragraph.verseIds.includes(verse.verseID)
        );
      },
    );
  }
}
