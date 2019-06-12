import { Component, OnInit, HostListener } from '@angular/core';
import { Chapter } from '../../../../../chapter/src/Chapter';
import { ChapterService } from '../../services/chapter.service';
import { VisibilityService } from '../../services/visibility.service';
import { OffsetService } from '../../services/offset.service';
import { SaveStateService } from '../../services/save-state.service';
import { HeaderService } from '../../services/header.service';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { ParamService, ChapterParams } from '../../services/param.service';
import { ChapterVerses } from '../../../../../format-tags/src/main';
import { ChapterNotes } from '../../../../../notes/src/main';
import onChange from 'on-change';
import { PageStateService } from '../../services/page-state.service';
import { parseOffsets, Verse } from '../../../../../shared/src/shared';
@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
})
export class ChapterComponent implements OnInit {
  public popStateActivated = false;
  public chapter: Chapter | undefined;
  public chapterNotes: ChapterNotes;
  public chapterVerses: ChapterVerses | undefined;

  public constructor(
    public chapterService: ChapterService,
    public offsetService: OffsetService,
    public visibilityService: VisibilityService,
    public saveStateService: SaveStateService,
    public headerService: HeaderService,
    public databaseService: DatabaseService,
    public activatedRouter: ActivatedRoute,
    public paramService: ParamService,
    public pageStateService: PageStateService,
  ) {}

  @HostListener('window:popstate', ['$event'])
  public onPopState(event: PopStateEvent): void {
    this.popStateActivated = event.state !== null;
    this.pageStateService.timer = undefined;

    console.log(this.popStateActivated);
    console.log(event);
  }
  // public notes: Note[] | undefined;
  public async ngOnInit(): Promise<void> {
    this.activatedRouter.params.subscribe(
      async (params): Promise<void> => {
        console.log(this.popStateActivated);

        console.log(params);
        const chapterParams = this.paramService.parseChapterParams(params);
        console.log(chapterParams);
        if (
          this.chapter &&
          this.chapterVerses &&
          this.chapterVerses.verses &&
          this.chapter._id ===
            `${chapterParams.book}-${chapterParams.chapter}-eng-chapter`
        ) {
          this.setHighlighting(chapterParams, this.chapterVerses.verses);
        } else {
          if (
            this.popStateActivated &&
            (await this.pageStateService.pageStateExists(
              `${chapterParams.book}-${chapterParams.chapter}-eng-page-state`,
            ))
          ) {
            if (this.pageStateService.currentPageState) {
              this.chapter = this.pageStateService.currentPageState.chapter;
              this.chapterVerses = this.pageStateService.currentPageState.chapterVerses;

              this.chapterNotes = this.pageStateService.currentPageState.chapterNotes;
              await this.setChapterVariables(
                this.chapterNotes,
                this.chapterVerses,
                this.chapter,
                false,
              );
              const chapterGrid = document.querySelector('.chapter-grid');
              const notesGrid = document.querySelector('#notes');

              if (chapterGrid) {
                chapterGrid.scrollTop = this.pageStateService.currentPageState.chapterGridScrollTop;
              }
              if (notesGrid) {
                notesGrid.scrollTop = this.pageStateService.currentPageState.notesScrollTop;
              }
              this.popStateActivated = false;
            }
          } else {
            try {
              this.chapter = (await this.databaseService.getDatabaseItem(
                `${chapterParams.book}-${chapterParams.chapter}-eng-chapter`,
              )) as Chapter;
              this.chapterVerses = (await this.databaseService.getDatabaseItem(
                `${chapterParams.book.replace('_', '-')}-${
                  chapterParams.chapter
                }-eng-verses`,
              )) as ChapterVerses;
              this.chapterNotes = (await this.databaseService.getDatabaseItem(
                `${chapterParams.book}-${chapterParams.chapter}-eng-notes`,
              )) as ChapterNotes;

              await this.setChapterVariables(
                this.chapterNotes,
                this.chapterVerses,
                this.chapter,
              );
              if (this.chapterVerses.verses) {
                this.setHighlighting(chapterParams, this.chapterVerses.verses);
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
        this.popStateActivated = false;
      },
    );
  }

  private setHighlighting(chapterParams: ChapterParams, verses: Verse[]): void {
    const highlightOffSets = parseOffsets(chapterParams.highlight);
    const contextOffsets = parseOffsets(chapterParams.context);

    // console.log(this.getHighlightVerses(chapterParams, contextOffsets, verses));
    // console.log(contextOffsets);
    verses.forEach((verse): void => {
      verse.highlight = false;
      verse.context = false;
    });

    if (highlightOffSets) {
      this.getHighlightVerses(chapterParams, highlightOffSets, verses).map(
        (v): void => {
          v.highlight = true;
        },
      );
      this.getHighlightVerses(chapterParams, contextOffsets, verses).map(
        (v): void => {
          v.context = true;
        },
      );
      const verseElement = document.querySelector(
        `#${chapterParams.book.replace('_', '-')}-${chapterParams.chapter}-${
          highlightOffSets[0]
        }-eng-verse`,
      );
      if (verseElement) {
        console.log(verseElement);

        verseElement.scrollIntoView();
      }
    } else {
      const chapterGrid = document.querySelector('.chapter-grid');
      const notesGrid = document.querySelector('#notes');
      if (chapterGrid) {
        chapterGrid.scrollTop = 0;
      }
      if (notesGrid) {
        notesGrid.scrollTop = 0;
      }
    }
    // verses.map((verse): void => {
    //   console.log(verse._id);

    //   console.log(
    //     `${chapterParams.book.replace('_', '-')}-${
    //       chapterParams.chapter
    //     }-eng-verse` === verse._id,
    //   );
    // });
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
            `${chapterParams.book.replace('_', '-')}-${
              chapterParams.chapter
            }-${c}-eng-verse`
          );
        });
      });
      console.log(filteredVerses);

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
  ): Promise<void> {
    this.offsetService.expandNotes(chapterNotes.notes);
    if (chapterVerses && chapterVerses.verses) {
      this.chapterService.mergeVersesNotes(
        chapterVerses.verses,
        chapterNotes.notes,
      );
    }
    this.chapterService.chapter = chapter;
    this.chapterService.verses = chapterVerses
      ? chapterVerses.verses
      : undefined;
    this.chapterService.notes = this.chapterNotes.notes;
    if (newPage) {
      await this.pageStateService.newPage(chapter, chapterVerses, chapterNotes);
    }
    this.headerService.headerTitle = chapter.title;
    this.headerService.headerShortTitle = chapter.shortTitle;
    this.visibilityService.resetNoteVisibility(chapterNotes.notes);
    console.log(
      this.chapterVerses !== undefined &&
        this.chapterVerses.verses !== undefined &&
        chapter !== undefined,
    );
  }

  public onScroll(): void {
    console.log('hhg');
    this.pageStateService.updateHistory();
    const verseElements = Array.from(document.querySelectorAll('verse'));
    for (let x = 0; x < verseElements.length; x++) {
      const verseElement = verseElements[x];
      if (verseElement.getBoundingClientRect().bottom - 48 > 0) {
        let noteElement = document.querySelector(
          `#${verseElement.id.replace('verse', 'note')}`,
        );
        console.log(noteElement);

        if (noteElement) {
          noteElement.scrollIntoView();
        } else {
          if (x === 0) {
            noteElement = document.querySelector('.notes-top');
          } else if (x === verseElements.length - 1) {
            noteElement = document.querySelector('.notes-bottom');
          }

          if (noteElement) {
            noteElement.scrollIntoView();
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
