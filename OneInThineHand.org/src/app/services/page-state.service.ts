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
  public pageStateMap: Map<string, PageState> = new Map();
  public currentPageState: PageState | undefined;
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

  public async pageStateExists(chapterID: string): Promise<boolean> {
    try {
      // console.log(chapterID.replace('chapter', 'page-state'));

      // const pageState = await this.databaseService.getDatabaseItem(
      //   chapterID.replace('chapter', 'page-state'),
      // );

      const pageState = this.pageStateMap.get(
        chapterID.replace('chapter', 'page-state'),
      );
      // console.log(chapterID.replace('chapter', 'page-state'));

      this.currentPageState = pageState as PageState;
      if (
        this.currentPageState &&
        this.currentPageState.chapter &&
        this.currentPageState.chapterNotes &&
        this.currentPageState.chapterVerses
      ) {
        this.startHistory();
        return true;
      } else {
        this.currentPageState = undefined;
        return false;
      }
      return pageState !== undefined;
    } catch (error) {
      console.log(error);
      this.currentPageState = undefined;
      return false;
    }
  }

  public async newPage(
    chapter: Chapter,
    chapterVerses: ChapterVerses,
    chapterNotes: ChapterNotes,
  ): Promise<void> {
    // console.log('oiasdjfoiajsdf');
    // this.timer = undefined;
    if (this.timer) {
      clearInterval(this.timer);
    }
    // if (!this.currentPageState) {
    // }
    this.currentPageState = new PageState();
    this.currentPageState._id = chapter._id.replace('chapter', 'page-state');
    this.currentPageState.chapterNotes = chapterNotes;
    this.currentPageState.chapter = chapter;
    this.currentPageState.chapterVerses = chapterVerses;
    this.setScrollTop();
    // await this.databaseService.updateDatabaseItem(this.currentPageState);
    this.pageStateMap.set(this.currentPageState._id, this.currentPageState);
    this.startHistory();
  }

  public updateHistory(): void {
    if (this.currentPageState) {
      console.log(this.currentPageState._id);
      this.setScrollTop();
      // this.pageStateMap.set(this.currentPageState._id, this.currentPageState);
    }
  }

  private startHistory(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(async (): Promise<void> => {
      if (this.currentPageState) {
        this.setScrollTop();
        // console.log(this.currentPageState);
        // await this.databaseService.updateDatabaseItem(this.currentPageState);
      }
    }, 2000);
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
