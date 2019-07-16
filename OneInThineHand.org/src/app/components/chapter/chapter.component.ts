import { sortBy, uniq } from 'lodash';
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

import { PageStateService } from '../../services/page-state.service';
import { parseOffsets } from '../../../../../shared/src/shared';
import { FormatTagService } from '../../services/format-tag.service';
// import { HistoryServie } from '../../services/history.service';
import { asyncScrollIntoView, asyncScrollTop } from '../../scroll-into-view';
import { SaveService } from '../../services/save.service';
import {
  FormatGroupSegment,
  FormatGroup,
} from '../../../../../shared/src/models/format_groups/FormatGroup';
import { Title } from '@angular/platform-browser';
import { ChapterVerses, VerseNotes, Verse } from '../../models/verse-notes';
@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
})
export class ChapterComponent implements OnInit, OnDestroy {
  public chapter?: Chapter;
  public chapterNotes: VerseNotes;
  public chapterVerses?: ChapterVerses;
  public ctrlKeyInterval?: NodeJS.Timer;
  public ctrlKeyPressed: boolean;
  public fadeInChapter = false;
  public fadeOutChapter = false;
  public popStateActivated = false;
  public shiftKeyInterval?: NodeJS.Timer;
  public shiftKeyPressed: boolean;
  public constructor(
    public titleService: Title,
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

  public getHighlightVerses(
    chapterParams: ChapterParams,
    context: number[] | undefined,
    verses: Verse[],
    language: string,
  ): Verse[] {
    if (context) {
      const filteredVerses = context.map((c): Verse | undefined => {
        return verses.find((verse): boolean => {
          return (
            verse._id ===
            `${language}-${chapterParams.book}-${chapterParams.chapter}-${c}-verse`
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

  public getWhiteSpaceHeight(): string {
    return `${window.innerHeight - 34}px`;
  }

  public gotoChapter(href: string | undefined): void {
    console.log(href);
    if (href) {
      this.router.navigateByUrl(href.replace('#/', ''));
      this.popStateActivated = true;
    }
  }
  public async ngOnDestroy(): Promise<void> {
    await this.setHistory();
    this.chapterService.chapterNotes = undefined;
  }
  // public notes: Note[] | undefined;
  public async ngOnInit(): Promise<void> {
    this.databaseService.initReadingMode();
    this.activatedRouter.params.subscribe(
      async (params): Promise<void> => {
        this.activatedRouter.queryParams.subscribe(
          async (queryParam): Promise<void> => {
            this.fadeOutChapter = true;
            this.fadeInChapter = false;
            let language = queryParam['lang'] as string | undefined;
            if (!language) {
              language = 'eng';
            }

            await this.setHistory();

            const chapterParams = this.paramService.parseChapterParams(params);
            if (chapterParams.book.includes('jst_')) {
              this.router.navigateByUrl(
                `eng/${chapterParams.book}/${chapterParams.chapter}`,
                { replaceUrl: true },
              );
              // this.router
            } else {
              if (
                this.chapter &&
                this.chapterVerses &&
                this.chapterVerses.verses &&
                this.chapter._id ===
                  `${language}-${chapterParams.book}-${chapterParams.chapter}-chapter`
              ) {
                this.setHighlighting(
                  chapterParams,
                  this.chapterVerses.verses,
                  language,
                );
              } else {
                const pageState = this.pageStateService.pageStateMap.get(
                  `${language}-${chapterParams.book}-${chapterParams.chapter}-chapter-page-state`,
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
                    setTimeout((): void => {
                      notesGrid.scrollTop = pageState.notesScrollTop;
                    }, 300);
                  }
                  this.popStateActivated = false;
                  // if (this.pageStateService.currentPageState) {
                  // }
                } else {
                  setTimeout(async (): Promise<void> => {
                    await asyncScrollTop('.chapter-grid');
                  }, 200);

                  try {
                    const all = await this.databaseService.bulkGetByIDs([
                      `${language}-${chapterParams.book}-${chapterParams.chapter}-chapter`,
                      `${language}-${chapterParams.book}-${chapterParams.chapter}-chapter-verses`,
                      `${language}-${chapterParams.book}-${chapterParams.chapter}-notes`,
                      `${language}-${chapterParams.book}-${chapterParams.chapter}-breaks`,
                    ]);
                    // console.log(all);
                    console.log([
                      `${language}-${chapterParams.book}-${chapterParams.chapter}-chapter`,
                      `${language}-${chapterParams.book}-${chapterParams.chapter}-chapter-verses`,
                      `${language}-${chapterParams.book}-${chapterParams.chapter}-notes`,
                      `${language}-${chapterParams.book}-${chapterParams.chapter}-breaks`,
                    ]);

                    console.log(all);

                    this.chapter = all[0] as Chapter;
                    this.chapterVerses = all[1] as ChapterVerses;
                    this.chapterNotes = all[2] as ChapterNotes;

                    this.chapterService.chapterBreaks = all[3] as {
                      _id: string;
                      _rev: string | undefined;
                      verseBreaks: {
                        _id: string;
                        breaks: FormatGroup[];
                      }[];
                    };
                    if (
                      this.chapterVerses.verses &&
                      this.chapterService.chapterBreaks
                    ) {
                      this.chapterVerses.verses.map((verse): void => {
                        const b = this.chapterService.chapterBreaks.verseBreaks.find(
                          (brk): boolean => {
                            return (
                              brk._id.replace('-breaks', '-verse') === verse._id
                            );
                          },
                        );
                        if (b) {
                          verse.breakFormatGroups = b.breaks;
                        }
                        // console.log(b);
                      });
                    }

                    // const vIds = this.chapter.verseIDS.filter((v): boolean => {
                    //   return !v.includes('--');
                    // });
                    // const ids = this.chapterService.generateIDS(vIds);
                    // const breaks = (await this.databaseService.bulkGetByIDs(
                    //   ids,
                    // )) as FakeVerseBreaks[];
                    // console.log(breaks);

                    // breaks.map((b): void => {
                    //   const v =
                    //     this.chapterVerses && this.chapterVerses.verses
                    //       ? this.chapterVerses.verses.find((v2): boolean => {
                    //           return (
                    //             v2._id !== undefined &&
                    //             b._id === v2._id.replace('verse', 'breaks')
                    //           );
                    //         })
                    //       : undefined;
                    //   console.log(v);
                    //   if (v) {
                    //     v.fakeVerseBreak = b;
                    //   }
                    // });

                    try {
                      await this.setChapterVariables(
                        this.chapterNotes,
                        this.chapterVerses,
                        this.chapter,
                      );
                      if (this.chapterVerses.verses) {
                        this.setHighlighting(
                          chapterParams,
                          this.chapterVerses.verses,
                          language,
                        );
                      }
                    } catch (error) {
                      console.log(error);
                    }
                  } catch (error) {
                    // console.log(error);
                  }
                }
              }
              // this.historyService.init();
              if (this.chapter) {
                this.titleService.setTitle(this.chapter.title);
              }
              this.popStateActivated = false;
            }
          },
        );
      },
    );
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
  public previousChapter(): void {
    this.popStateActivated = true;
  }
  private highlightVerses(
    chapterParams: ChapterParams,
    highlightOffSets: number[] | undefined,
    item: Verse[],
    attrName: string,
    language: string,
  ): void {
    // console.log(highlightOffSets);
    this.getHighlightVerses(chapterParams, highlightOffSets, item, language);
    // console.log(asdf);

    this.getHighlightVerses(
      chapterParams,
      highlightOffSets,
      item,
      language,
    ).map((v): void => {
      // console.log(v);

      v[attrName] = true;
    });
  }

  private async setChapterVariables(
    chapterNotes: VerseNotes,
    chapterVerses: ChapterVerses,
    chapter: Chapter,
    newPage: boolean = true,
    pageStateActive: boolean = false,
  ): Promise<void> {
    if (!pageStateActive) {
      if (chapterNotes) {
        await this.offsetService.expandNotes(chapterNotes.verseNotes);
        if (chapterVerses && chapterVerses.verses) {
          this.chapterService.mergeVersesNotes(
            chapterVerses.verses,
            chapterNotes.verseNotes,
          );
        }
      }
      await this.formatTagService.resetFormatTags(
        this.chapterVerses,
        this.chapterNotes,
      );

      // if (
      //   this.chapterService.kjvChapterVerse &&
      //   this.chapterService.kjvChapterVerse.verses &&
      //   this.chapterService.kjvChapterNotes &&
      //   this.chapterService.kjvChapterNotes.notes
      // ) {
      // }
    }
    this.chapterService.chapter = chapter;

    this.chapterService.chapterNotes = chapterNotes;
    this.chapterService.verses = chapterVerses
      ? chapterVerses.verses
      : undefined;
    if (this.chapterNotes) {
      this.chapterService.notes = this.chapterNotes.notes;
    }
    this.chapterService.chapterVerses = this.chapterVerses;
    this.fadeOutChapter = false;
    this.fadeInChapter = true;
    setTimeout(() => {
      this.fadeInChapter = false;
    }, 500);
    try {
      // await this.getKJVRef(this.chapterVerses);
    } catch (error) {
      console.log(error);
    }
    if (newPage) {
      await this.pageStateService.newPage(chapter, chapterVerses, chapterNotes);
    }
    this.headerService.headerTitle = chapter.title;
    this.headerService.headerShortTitle = chapter.shortTitle;
    this.visibilityService.resetNoteVisibility(chapterNotes.notes);
  }

  private async setHighlighting(
    chapterParams: ChapterParams,
    verses: Verse[],
    language: string,
  ): Promise<void> {
    const highlightOffSets = parseOffsets(chapterParams.highlight);
    const contextOffsets = parseOffsets(chapterParams.context);

    verses.forEach((verse): void => {
      verse.highlight = false;
      verse.context = false;
    });

    this.highlightVerses(
      chapterParams,
      highlightOffSets,
      verses,
      'highlight',
      language,
    );
    this.highlightVerses(
      chapterParams,
      contextOffsets,
      verses,
      'context',
      language,
    );

    if (highlightOffSets) {
      let highlighting: number[] = [];
      highlighting = highlighting.concat(highlightOffSets);
      if (contextOffsets) {
        highlighting = highlighting.concat(contextOffsets);
      }

      await asyncScrollIntoView(
        `#${language}-${chapterParams.book}-${chapterParams.chapter}-${
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

  private async setHistory(): Promise<void> {
    if (this.chapter && this.chapterVerses && this.chapterNotes) {
      this.pageStateService.newPage(
        this.chapter,
        this.chapterVerses,
        this.chapterNotes,
      );
    }
  }
}
