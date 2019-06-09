import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Chapter } from '../../../../../chapter/src/Chapter';
import { Verse, Note } from '../../../../../shared/src/shared';
import { ChapterService } from '../../services/chapter.service';
import { VisibilityService } from '../../services/visibility.service';
import { OffsetService } from '../../services/offset.service';
@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
})
export class ChapterComponent implements OnInit {
  public constructor(
    public chapterService: ChapterService,
    public offsetService: OffsetService,
    public visibilityService: VisibilityService,
  ) {}

  public chapter: Chapter | undefined;
  public verses: Verse[] | undefined;
  public notes: Note[] | undefined;
  public async ngOnInit(): Promise<void> {
    try {
      this.chapter = (await axios.get(
        'assets/scriptures/heb-1-eng-chapter.json',
      )).data as Chapter;

      this.verses = (await axios.get('assets/scriptures/heb-1-eng-verses.json'))
        .data as Verse[];
      this.notes = (await axios.get('assets/scriptures/heb-1-eng-notes.json'))
        .data as Note[];
      this.offsetService.expandNotes(this.notes);
      this.chapterService.mergeVersesNotes(this.verses, this.notes);

      this.chapterService.chapter = this.chapter;
      this.chapterService.verses = this.verses;
      this.chapterService.notes = this.notes;
      this.visibilityService.resetNoteVisibility(this.notes);
      // console.log(this.chapter);
      // console.log(this.verses);
      // console.log(this.notes);
    } catch (error) {
      console.log(error);
    }
  }

  public onScroll(): void {
    console.log('hhg');
    const verseElements = Array.from(document.querySelectorAll('verse'));
    for (let x = 0; x < verseElements.length; x++) {
      const verseElement = verseElements[x];
      if (verseElement.getBoundingClientRect().bottom - 48 > 0) {
        const noteElement = document.querySelector(
          `#${verseElement.id.replace('verse', 'note')}`,
        );
        console.log(noteElement);

        if (noteElement) {
          noteElement.scrollIntoView();
        }
        console.log(
          `${verseElement.id} ${verseElement.getBoundingClientRect().bottom}`,
        );
        break;
      }
    }
    Array.from(document.querySelectorAll('verse')).map(
      (verseElement): void => {},
    );
  }
}
