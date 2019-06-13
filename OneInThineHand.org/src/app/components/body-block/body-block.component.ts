import { Component, OnInit, Input } from '@angular/core';
import { Verse } from '../../../../../shared/src/shared';
import { Chapter } from '../../../../../chapter/src/Chapter';
import { Paragraph } from '../../../../../chapter/src/Paragraph';

@Component({
  selector: 'app-body-block',
  templateUrl: './body-block.component.html',
  styleUrls: ['./body-block.component.scss'],
})
export class BodyBlockComponent implements OnInit {
  @Input() public verses: Verse[];

  @Input() public chapter: Chapter;

  public constructor() {}

  public ngOnInit() {
    // console.log(this.verses);
  }

  public getParagraphs(): Paragraph[] {
    return this.chapter.paragraphs ? this.chapter.paragraphs : [];
  }
}
