import { Injectable } from '@angular/core';
import { ChapterNotes } from '../../../../notes/src/main';
import { Chapter } from '../../../../chapter/src/Chapter';
import { ChapterVerses } from '../../../../format-tags/src/main';
import { DatabaseService } from './database.service';
import { Router } from '@angular/router';
import { PageState } from './PageState';

@Injectable({
  providedIn: 'root',
})
export class PageStateService {
  public currentPageState: PageState | undefined;
  public constructor(
    private databaseService: DatabaseService,
    private router: Router,
  ) {
    router.events.subscribe((value): void => {
      console.log(value);
      console.log('oaisdfjioasdjfoiasdjfoiasdjfoij');
    });
  }

  public newPage(
    chapter: Chapter,
    chapterVerses: ChapterVerses,
    chapterNotes: ChapterNotes,
  ): void {
    // console.log('oiasdjfoiajsdf');
    if (!this.currentPageState) {
      this.currentPageState = new PageState();
      this.currentPageState._id = chapter._id.replace('chapter', 'page-state');
    }
    this.currentPageState.chapterNotes = chapterNotes;
    this.currentPageState.chapter = chapter;
    this.currentPageState.chapterVerses = chapterVerses;
  }

  public setScrollTop(): void {
    if (this.currentPageState) {
      const chapterGrid = document.querySelector('.chapter-grid');
      const notesGrid = document.querySelector('#notes');

      if (chapterGrid) {
        this.currentPageState.chapterGridScrollTop = chapterGrid.scrollTop;
      }
      if (notesGrid) {
        this.currentPageState.notesScrollTop = notesGrid.scrollTop;
      }
    }
  }
}
