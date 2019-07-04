import { sortBy, uniq, flatten } from 'lodash';
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
  Note,
  VerseNotes,
} from '../../../../../shared/src/shared';
import { FormatTagService } from '../../services/format-tag.service';
// import { HistoryServie } from '../../services/history.service';
import { asyncScrollIntoView, asyncScrollTop } from '../../scroll-into-view';
import { SaveService } from '../../services/save.service';
import {
  VerseBreaks,
  FakeVerseBreaks,
} from '../../../../../shared/src/models/Verse';
import {
  FormatGroupPart,
  FormatGroupSegment,
  FormatGroup,
} from '../../../../../shared/src/models/format_groups/FormatGroup';
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
        this.activatedRouter.queryParams.subscribe(
          async (queryParam): Promise<void> => {
            let language = queryParam['lang'] as string | undefined;
            if (!language) {
              language = 'eng';
            }

            await this.setHistory();
            await asyncScrollTop('.chapter-grid');

            const chapterParams = this.paramService.parseChapterParams(params);
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
                  language,
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
                  const all = await this.databaseService.bulkGetByIDs([
                    `${language}-${chapterParams.book}-${chapterParams.chapter}-chapter`,
                    `${language}-${chapterParams.book}-${chapterParams.chapter}-chapter-verses`,
                    `${language}-${chapterParams.book}-${chapterParams.chapter}-notes`,
                    `${language}-${chapterParams.book}-${chapterParams.chapter}-breaks`,
                  ]);
                  // console.log(all);
                  console.log(
                    `${language}-${chapterParams.book}-${chapterParams.chapter}-breaks`,
                  );

                  console.log(all);

                  this.chapter = all[0] as Chapter;
                  this.chapterVerses = all[1] as ChapterVerses;
                  this.chapterNotes = all[2] as ChapterNotes;

                  const breaks = all[3] as {
                    _id: string;
                    verseBreaks: { _id: string; breaks: FormatGroup[] }[];
                  };
                  if (this.chapterVerses.verses) {
                    this.chapterVerses.verses.map((verse): void => {
                      const b = breaks.verseBreaks.find((brk): boolean => {
                        return brk._id.replace('-breaks', '') === verse._id;
                      });
                      if (b) {
                        verse.breakFormatGroups = b.breaks;
                      }
                      console.log(b);
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

                  await this.setChapterVariables(
                    this.chapterNotes,
                    this.chapterVerses,
                    this.chapter,
                    language,
                  );

                  if (this.chapterVerses.verses) {
                    this.setHighlighting(
                      chapterParams,
                      this.chapterVerses.verses,
                      language,
                    );
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
      },
    );
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

  private async setChapterVariables(
    chapterNotes: ChapterNotes,
    chapterVerses: ChapterVerses,
    chapter: Chapter,
    language: string,
    newPage: boolean = true,
    pageStateActive: boolean = false,
  ): Promise<void> {
    if (!pageStateActive) {
      if (chapterNotes) {
        await this.offsetService.expandNotes(chapterNotes.notes);
        if (chapterVerses && chapterVerses.verses) {
          this.chapterService.mergeVersesNotes(
            chapterVerses.verses,
            chapterNotes.notes,
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

    await this.getKJVRef(this.chapterVerses);
    if (newPage) {
      await this.pageStateService.newPage(chapter, chapterVerses, chapterNotes);
    }
    this.headerService.headerTitle = chapter.title;
    this.headerService.headerShortTitle = chapter.shortTitle;
    this.visibilityService.resetNoteVisibility(chapterNotes.notes);
  }
  public async getKJVRef(
    chapterVerses: ChapterVerses | undefined,
  ): Promise<void> {
    try {
      if (chapterVerses && chapterVerses.verses) {
        const kjvRefs: string[] = [];
        chapterVerses.verses.map((verse): void => {
          if (verse.kjvRef) {
            verse.kjvRef.map((k): void => {
              kjvRefs.push(k);
            });
            verse.formatGroups.map((formatGroup): void => {
              const fGroup: FormatGroupSegment = formatGroup as never;
              if (fGroup.kjvRef) {
                fGroup.kjvRef.map((k): void => {
                  kjvRefs.push(k);
                });
              }
            });
          }
        });
        this.chapterService.kjvChapterVerse = new ChapterVerses();
        this.chapterService.kjvChapterVerse.verses = [];
        this.chapterService.kjvChapterNotes = new ChapterNotes();
        this.chapterService.kjvChapterNotes.notes = [];
        const promises = uniq(
          kjvRefs.map((k): string => {
            const kSplit = k.split('-');
            return `${kSplit[0]}-${kSplit[1]}-${kSplit[2]}-chapter-verses`;
          }),
        ).map(
          async (chapterID): Promise<void> => {
            const verse = (await this.databaseService.getDatabaseItem(
              chapterID,
            )) as ChapterVerses;
            const notes = (await this.databaseService.getDatabaseItem(
              chapterID.replace('-chapter-verses', '-notes'),
            )) as ChapterNotes;
            if (
              this.chapterService.kjvChapterVerse &&
              this.chapterService.kjvChapterVerse.verses &&
              verse.verses
            ) {
              this.chapterService.kjvChapterVerse.verses = this.chapterService.kjvChapterVerse.verses.concat(
                verse.verses,
              );
            }
            if (
              this.chapterService.chapterNotes &&
              this.chapterService.chapterNotes.notes &&
              notes.notes
            ) {
              this.chapterService.chapterNotes.notes = this.chapterService.chapterNotes.notes.concat(
                notes.notes,
              );
            }

            await this.formatTagService.resetFormatTags(
              this.chapterService.kjvChapterVerse,
              this.chapterService.kjvChapterNotes,
            );
          },
        );
        await Promise.all(promises);
        console.log(this.chapterService.kjvChapterVerse);
        if (
          this.chapterService.kjvChapterVerse.verses &&
          this.chapterVerses &&
          this.chapterVerses.verses
        ) {
          this.chapterVerses.verses.map((verse): void => {
            if (verse.kjvRef) {
              verse.kjvRef.map((k): void => {
                if (
                  this.chapterService.kjvChapterVerse &&
                  this.chapterService.kjvChapterVerse.verses
                ) {
                  const v = this.chapterService.kjvChapterVerse.verses.find(
                    (ver): boolean => {
                      return ver._id === k;
                    },
                  );
                  if (v) {
                    if (!verse.kjvVerse) {
                      verse.kjvVerse = [];
                    }
                    verse.kjvVerse.push(v);
                  }
                }
              });
            }
          });
        }
        // const asdf = uniq(
        //   flatten(
        //     chapterVerses.verses.map((verse): string[] => {
        //       let kjvRefs: string[] = [];
        //       if (verse.kjvRef) {
        //         console.log(verse.kjvRef);
        //         const kjvRefSubg = verse.kjvRef.map((k): string[] => {
        //           return k.split('-');
        //         });
        //         kjvRefSubg.map((kjvRef): void => {
        //           try {
        //             kjvRefs.push(
        //               `${kjvRef[0]}-${kjvRef[1]}-${kjvRef[2]}-chapter-verses`,
        //             );
        //           } catch (error) {
        //             console.log(error);
        //           }
        //         });
        //       }
        //       if (verse.formatGroups) {
        //         const moreKJVRefs = verse.formatGroups.map((formatGroup):
        //           | string[]
        //           | undefined => {
        //           if ((formatGroup as FormatGroupPart).kjvRef !== undefined) {
        //             const subKJVRefs = (formatGroup as FormatGroupPart).kjvRef;
        //             if (subKJVRefs) {
        //               return subKJVRefs
        //                 .map((kjvRef): string | undefined => {
        //                   try {
        //                     return `${subKJVRefs[0]}-${subKJVRefs[1]}-${subKJVRefs[2]}-chapter-verses`;
        //                   } catch (error) {
        //                     return undefined;
        //                   }
        //                   // return (formatGroup as FormatGroupPart).kjvRef as string;
        //                 })
        //                 .filter((a): boolean => {
        //                   return a !== undefined;
        //                 }) as string[];
        //             }
        //           }
        //         });
        //         console.log(moreKJVRefs);
        //         kjvRefs = kjvRefs.concat(
        //           flatten((moreKJVRefs.filter((a): boolean => {
        //             return a !== undefined;
        //           }) as never) as string[]),
        //         );
        //       }
        //       console.log(kjvRefs);
        //       return uniq(kjvRefs);
        //     }),
        //   ),
        // );
        // if (asdf.length === 1) {
        //   try {
        //     this.chapterService.kjvChapterVerse = (await this.databaseService.getDatabaseItem(
        //       asdf[0],
        //     )) as ChapterVerses;
        //     console.log(asdf);
        //     this.chapterService.kjvChapterNotes = (await this.databaseService.getDatabaseItem(
        //       asdf[0].replace('-chapter-verses', '-notes'),
        //     )) as ChapterNotes;
        //     await this.formatTagService.resetFormatTags(
        //       this.chapterService.kjvChapterVerse,
        //       this.chapterService.kjvChapterNotes,
        //     );
        //     console.log(this.chapterService.kjvChapterVerse);
        //     if (this.chapterService.kjvChapterVerse.verses) {
        //       this.chapterService.kjvChapterVerse.verses.map(
        //         (kjvVerse): void => {
        //           const verse =
        //             this.chapterVerses && this.chapterVerses.verses
        //               ? this.chapterVerses.verses.find((v): boolean => {
        //                   return (
        //                     v._id !== undefined &&
        //                     v._id.replace('fra', 'eng') === kjvVerse._id
        //                   );
        //                 })
        //               : undefined;
        //           if (verse) {
        //             if (!verse.kjvVerse) {
        //               verse.kjvVerse = [];
        //             }
        //             verse.kjvVerse.push(kjvVerse);
        //           }
        //         },
        //       );
        //     }
        //   } catch (error) {
        //     console.log(error);
        //   }
        // } else if (asdf.length > 1) {
        //   console.log(asdf);
        // }
      }
    } catch (error) {
      console.log(error);
    }
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
