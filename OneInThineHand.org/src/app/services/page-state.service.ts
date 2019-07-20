import { Injectable } from '@angular/core';

import { Chapter } from '../../../../chapter/src/Chapter';

import { DatabaseService } from './database.service';
import { Router } from '@angular/router';
import { PageState } from './PageState';
import { ChapterVerses, VerseNotes } from '../models/verse-notes';
import { OffsetGroup, VerseNoteOffsetGroup } from './offset-groups.service';

@Injectable({
  providedIn: 'root',
})
export class PageStateService {
  public pageStateMap: Map<string, PageState> = new Map();
  // public currentPageState: PageState | undefined;
  public timer: NodeJS.Timer | undefined;
  public constructor(
    private databaseService: DatabaseService,
    private router: Router,
  ) {
    // router.events.subscribe((value): void => {
    //   this.currentPageState = undefined;
    //   this.timer = undefined;
    // });
  }

  public async newPage(
    chapter: Chapter,
    chapterVerses: ChapterVerses,
    chapterNotes: VerseNotes,
    // offsetGroups: VerseNoteOffsetGroup[],
  ): Promise<void> {
    // console.log('oiasdjfoiajsdf');
    // this.timer = undefined;
    if (this.timer) {
      clearInterval(this.timer);
    }
    // if (!this.currentPageState) {
    // }

    const pageState = new PageState();
    pageState._id = `${chapter._id}-page-state`;

    pageState.chapterNotes = chapterNotes;
    pageState.chapter = chapter;
    pageState.chapterVerses = chapterVerses;
    // pageState.offsetGroups = offsetGroups;
    this.setScrollTop(pageState);
    // await this.databaseService.updateDatabaseItem(pageState);
    this.pageStateMap.set(pageState._id, pageState);
    this.startHistory();
  }

  public async pageStateExists(chapterID: string): Promise<boolean> {
    try {
      // console.log(chapterID.replace('chapter', 'page-state'));

      // const pageState = await this.databaseService.getDatabaseItem(
      //   chapterID.replace('chapter', 'page-state'),
      // );

      const pageState = this.pageStateMap.get(`${chapterID}-page-state`);
      console.log(`${chapterID}-page-state`);

      // console.log(chapterID.replace('chapter', 'page-state'));

      // this.currentPageState = pageState as PageState;
      if (
        pageState &&
        pageState.chapter &&
        pageState.chapterNotes &&
        pageState.chapterVerses
      ) {
        // this.startHistory();
        return true;
      } else {
        // this.currentPageState = undefined;
        return false;
      }
      return pageState !== undefined;
    } catch (error) {
      console.log(error);
      // this.currentPageState = undefined;
      return false;
    }
  }

  public setScrollTop(pageState: PageState): void {
    if (pageState) {
      const chapterGrid = document.querySelector('.chapter-grid');
      const notesGrid = document.querySelector('#notes');
      if (chapterGrid) {
        pageState.chapterGridScrollTop = chapterGrid.scrollTop;
      }
      if (notesGrid) {
        pageState.notesScrollTop = notesGrid.scrollTop;
      }
    }
  }

  public updateHistory(): void {
    // if (this.currentPageState) {
    //   console.log(this.currentPageState._id);
    //   this.setScrollTop();
    //   // this.pageStateMap.set(this.currentPageState._id, this.currentPageState);
    // }
  }

  private startHistory(): void {
    // if (this.timer) {
    //   clearInterval(this.timer);
    // }
    // this.timer = setInterval(async (): Promise<void> => {
    //   if (this.currentPageState) {
    //     this.setScrollTop();
    //     // console.log(this.currentPageState);
    //     // await this.databaseService.updateDatabaseItem(this.currentPageState);
    //   }
    // }, 2000);
  }
}
