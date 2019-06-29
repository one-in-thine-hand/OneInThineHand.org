import { sortBy } from 'lodash';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Chapter } from '../../../../../chapter/src/Chapter';
import { ChapterService } from '../../services/chapter.service';
import { VisibilityService } from '../../services/visibility.service';
import { OffsetService } from '../../services/offset.service';
import { SaveStateService } from '../../services/save-state.service';
import { HeaderService } from '../../services/header.service';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamService, ChapterParams } from '../../services/param.service';
import { ChapterVerses } from '../../../../../format-tags/src/main';
import { ChapterNotes } from '../../../../../notes/src/main';
import { PageStateService } from '../../services/page-state.service';
import {
  parseOffsets,
  Verse,
  CouchDoc,
} from '../../../../../shared/src/shared';
import { FormatTagService } from '../../services/format-tag.service';
// import { HistoryServie } from '../../services/history.service';
import { asyncScrollIntoView, asyncScrollTop } from '../../scroll-into-view';
import { SaveService } from '../../services/save.service';
@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
})
export class ChapterComponent implements OnInit, OnDestroy {
  public constructor(
    public chapterService: ChapterService,
    public offsetService: OffsetService,
    public visibilityService: VisibilityService,
    public saveStateService: SaveStateService,
    public saveService: SaveService,
    public headerService: HeaderService,
    public databaseService: DatabaseService,
    public activatedRouter: ActivatedRoute,
    public paramService: ParamService,
    public pageStateService: PageStateService,
    public router: Router,
    public formatTagService: FormatTagService, // public historyService: HistoryService,
  ) {}
  public popStateActivated = false;
  public chapter: Chapter | undefined;
  public chapterNotes: ChapterNotes;
  public chapterVerses: ChapterVerses | undefined;
  public ctrlKeyPressed: boolean;
  public shiftKeyPressed: boolean;
  public ctrlKeyInterval: NodeJS.Timer | undefined;
  public shiftKeyInterval: NodeJS.Timer | undefined;
  public async ngOnDestroy(): Promise<void> {
    await this.setHistory();
    this.chapterService.chapterNotes = undefined;
  }

  @HostListener('window:keyup', ['$event'])
  public async onKeyUp(event: KeyboardEvent): Promise<void> {
    if (event instanceof KeyboardEvent) {
      // console.log(event);
      if (event.ctrlKey || event.key.toLowerCase() === 'control') {
        console.log('asdfiojasdoifj');

        this.ctrlKeyPressed = true;
        if (this.ctrlKeyInterval !== undefined) {
          clearInterval(this.ctrlKeyInterval);
        }
        this.ctrlKeyInterval = setInterval((): void => {
          this.ctrlKeyPressed = false;
          if (this.ctrlKeyInterval) {
            clearInterval(this.ctrlKeyInterval);
          }
        }, 1000);
        // setTimeout((): void => {
        //   this.ctrlKeyPressed = false;
        // }, 1000);
      }
      if (event.shiftKey || event.key.toLowerCase() === 'shift') {
        this.shiftKeyPressed = true;
        if (this.shiftKeyInterval !== undefined) {
          clearInterval(this.shiftKeyInterval);
        }
        this.shiftKeyInterval = setInterval((): void => {
          this.shiftKeyPressed = false;
          if (this.shiftKeyInterval) {
            clearInterval(this.shiftKeyInterval);
          }
        }, 1000);
        // setTimeout((): void => {
        //   this.shiftKeyPressed = false;
        // }, 1000);
      }
      // console.log(event);

      // console.log(this.ctrlKeyPressed);
      // console.log(this.shiftKeyPressed);

      if (this.ctrlKeyPressed) {
        switch (event.key.toLowerCase()) {
          case 'z': {
            // if (this.chapterVerses && this.chapterNotes) {
            //   this.historyService.undoHistory(
            //     this.chapterNotes,
            //     this.saveStateService.data,
            //     this.chapterVerses,
            //   );
            // await
            // }
            // await this.formatTagService.resetFormatTags(this.chapterVerses);
            break;
          }
          case 'y': {
            // console.log('y');
            // if (this.chapterVerses && this.chapterNotes) {
            //   this.historyService.redoHistory(
            //     this.chapterNotes,
            //     this.chapterVerses,
            //     this.saveStateService.data,
            //   );
            // }

            break;
          }
          case 's': {
            if (this.shiftKeyPressed) {
              console.log('hggg');
              await this.saveService.save();
              // await this.databaseService.updateDatabaseItem(this.chapterNotes);
              console.log('Finished');
            }
            break;
          }
        }
      }
    }
  }

  @HostListener('window:popstate', ['$event'])
  public onPopState(event: PopStateEvent): void {
    this.popStateActivated = event.state !== null;
    this.pageStateService.timer = undefined;

    console.log(`Activate History ${this.popStateActivated}`);
    console.log(event);
  }
  // public notes: Note[] | undefined;
  public async ngOnInit(): Promise<void> {
    this.databaseService.initReadingMode();
    this.activatedRouter.params.subscribe(
      async (params): Promise<void> => {
        await this.setHistory();
        await asyncScrollTop('.chapter-grid');

        const chapterParams = this.paramService.parseChapterParams(params);
        if (
          this.chapter &&
          this.chapterVerses &&
          this.chapterVerses.verses &&
          this.chapter._id ===
            `eng-${chapterParams.book}-${chapterParams.chapter}-chapter`
        ) {
          this.setHighlighting(chapterParams, this.chapterVerses.verses);
        } else {
          const pageState = this.pageStateService.pageStateMap.get(
            `eng-${chapterParams.book}-${chapterParams.chapter}-chapter-page-state`,
          );

          if (this.popStateActivated && pageState) {
            console.log('Page State Activated');

            this.chapter = pageState.chapter;
            this.chapterVerses = pageState.chapterVerses;

            this.chapterNotes = pageState.chapterNotes;
            await this.setChapterVariables(
              this.chapterNotes,
              this.chapterVerses,
              this.chapter,
              false,
              true,
            );
            const chapterGrid = document.querySelector('.chapter-grid');
            const notesGrid = document.querySelector('#notes');

            if (chapterGrid) {
              console.log(pageState.chapterGridScrollTop);

              chapterGrid.scrollTop = pageState.chapterGridScrollTop;
            }
            if (notesGrid) {
              console.log(pageState.notesScrollTop);
              notesGrid.scrollTop = pageState.notesScrollTop;
            }
            this.popStateActivated = false;
            // if (this.pageStateService.currentPageState) {
            // }
          } else {
            try {
              this.chapter = (await this.databaseService.getDatabaseItem(
                `eng-${chapterParams.book}-${chapterParams.chapter}-chapter`,
              )) as Chapter;
              // console.log(this.chapter);
              const v = await this.databaseService.bulkGetByIDs<Verse>(
                this.chapter.verseIDS,
              );
              console.log(v);

              this.chapterVerses = {
                verses: v,
                _id: '',
                _rev: '',
              };

              // this.chapterVerses = (await this.databaseService.getDatabaseItem(
              //   `eng-${chapterParams.book}-${chapterParams.chapter}-chapter-verses`,
              // )) as ChapterVerses;
              this.chapterNotes = (await this.databaseService.getDatabaseItem(
                `eng-${chapterParams.book}-${chapterParams.chapter}-notes`,
              )) as ChapterNotes;
              await this.setChapterVariables(
                this.chapterNotes,
                this.chapterVerses,
                this.chapter,
              );
              await this.testGettingIndividualVerses();

              if (this.chapterVerses.verses) {
                this.setHighlighting(chapterParams, this.chapterVerses.verses);
              }
            } catch (error) {
              // console.log(error);
            }
          }
        }
        // this.historyService.init();
        this.popStateActivated = false;
      },
    );
  }
  private async testGettingIndividualVerses(): Promise<void> {
    if (this.chapterVerses && this.chapterVerses.verses) {
      const chapterVersesIds = this.chapterVerses.verses.map(
        (verse): CouchDoc => {
          return { id: verse._id as string, rev: '' };
        },
      );
      const testVerses = await this.databaseService.bulkGet(chapterVersesIds);
      if (testVerses) {
        console.log(
          testVerses.results.map(
            (result): Verse => {
              return (result.docs[0] as any).ok;
            },
          ),
        );
      }
    }
  }

  private async setHistory(): Promise<void> {
    if (this.chapter && this.chapterVerses && this.chapterNotes) {
      this.pageStateService.newPage(
        this.chapter,
        this.chapterVerses,
        this.chapterNotes,
      );
    }
  }

  public gotoChapter(href: string | undefined): void {
    console.log(href);
    if (href) {
      this.router.navigateByUrl(href.replace('#/', ''));
      this.popStateActivated = true;
    }
  }
  public previousChapter(): void {
    this.popStateActivated = true;
  }
  private highlightVerses(
    chapterParams: ChapterParams,
    highlightOffSets: number[] | undefined,
    item: Verse[],
    attrName: string,
  ): void {
    // console.log(highlightOffSets);
    this.getHighlightVerses(chapterParams, highlightOffSets, item);
    // console.log(asdf);

    this.getHighlightVerses(chapterParams, highlightOffSets, item).map(
      (v): void => {
        // console.log(v);

        v[attrName] = true;
      },
    );
  }

  private async setHighlighting(
    chapterParams: ChapterParams,
    verses: Verse[],
  ): Promise<void> {
    const highlightOffSets = parseOffsets(chapterParams.highlight);
    const contextOffsets = parseOffsets(chapterParams.context);

    verses.forEach((verse): void => {
      verse.highlight = false;
      verse.context = false;
    });

    this.highlightVerses(chapterParams, highlightOffSets, verses, 'highlight');
    this.highlightVerses(chapterParams, contextOffsets, verses, 'context');

    if (highlightOffSets) {
      let highlighting: number[] = [];
      highlighting = highlighting.concat(highlightOffSets);
      if (contextOffsets) {
        highlighting = highlighting.concat(contextOffsets);
      }

      await asyncScrollIntoView(
        `#eng-${chapterParams.book}-${chapterParams.chapter}-${
          sortBy(highlighting)[0]
        }-verse`,
        { timeout: 100 },
      );

      // const ve
    } else {
      await asyncScrollIntoView('verse');
      await asyncScrollIntoView('verse-notes');
    }
  }

  public getHighlightVerses(
    chapterParams: ChapterParams,
    context: number[] | undefined,
    verses: Verse[],
  ): Verse[] {
    if (context) {
      const filteredVerses = context.map((c): Verse | undefined => {
        return verses.find((verse): boolean => {
          return (
            verse._id ===
            `eng-${chapterParams.book}-${chapterParams.chapter}-${c}-verse`
          );
        });
      });
      // console.log(filteredVerses);

      return filteredVerses.filter((v): boolean => {
        return v !== undefined;
      }) as Verse[];
    } else {
      return [];
    }
  }

  private async setChapterVariables(
    chapterNotes: ChapterNotes,
    chapterVerses: ChapterVerses,
    chapter: Chapter,
    newPage: boolean = true,
    pageStateActive: boolean = false,
  ): Promise<void> {
    if (!pageStateActive) {
      await this.offsetService.expandNotes(chapterNotes.notes);
      if (chapterVerses && chapterVerses.verses) {
        this.chapterService.mergeVersesNotes(
          chapterVerses.verses,
          chapterNotes.notes,
        );
      }
      await this.formatTagService.resetFormatTags(
        this.chapterVerses,
        this.chapterNotes,
      );
    }
    this.chapterService.chapter = chapter;
    this.chapterService.chapterNotes = chapterNotes;
    this.chapterService.verses = chapterVerses
      ? chapterVerses.verses
      : undefined;
    this.chapterService.notes = this.chapterNotes.notes;
    this.chapterService.chapterVerses = this.chapterVerses;
    if (newPage) {
      await this.pageStateService.newPage(chapter, chapterVerses, chapterNotes);
    }
    this.headerService.headerTitle = chapter.title;
    this.headerService.headerShortTitle = chapter.shortTitle;
    this.visibilityService.resetNoteVisibility(chapterNotes.notes);
  }

  public async onScroll(): Promise<void> {
    const verseElements = Array.from(document.querySelectorAll('verse'));
    for (let x = 0; x < verseElements.length; x++) {
      const verseElement = verseElements[x];
      if (verseElement.getBoundingClientRect().bottom - 102 > 0) {
        if (!(await asyncScrollIntoView(`#${verseElement.id}-notes`))) {
          if (x === 0) {
            await asyncScrollIntoView('.notes-top');
          } else if (x === verseElements.length - 1) {
            await asyncScrollIntoView('.notes-bottom');
          }
        }

        break;
      }
    }
  }

  public getWhiteSpaceHeight(): string {
    return `${window.innerHeight - 34}px`;
  }
}
