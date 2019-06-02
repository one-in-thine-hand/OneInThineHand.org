import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Chapter } from '../../../../../chapter/src/Chapter';
import { Verse } from '../../../../../shared/src/shared';
@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
})
export class ChapterComponent implements OnInit {
  public constructor() {}

  public chapter: Chapter | undefined;
  public verses: Verse[] | undefined;
  public async ngOnInit(): Promise<void> {
    try {
      this.chapter = (await axios.get('assets/heb-1-eng-chapter.json'))
        .data as Chapter;

      this.verses = (await axios.get('assets/heb-1-eng-verses.json'))
        .data as Verse[];

      console.log(this.chapter);
      console.log(this.verses);
    } catch (error) {
      console.log(error);
    }
  }
}
