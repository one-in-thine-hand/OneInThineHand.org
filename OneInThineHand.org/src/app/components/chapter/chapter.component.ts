import { Component, OnInit, HostListener } from '@angular/core';
import { Chapter } from '../../../../../chapter/src/Chapter';
import { ChapterService } from '../../services/chapter.service';
import { VisibilityService } from '../../services/visibility.service';
import { OffsetService } from '../../services/offset.service';
import { SaveStateService } from '../../services/save-state.service';
import { HeaderService } from '../../services/header.service';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { ParamService } from '../../services/param.service';
import { ChapterVerses } from '../../../../../format-tags/src/main';
import { ChapterNotes } from '../../../../../notes/src/main';
import { PageStateService } from '../../services/page-state.service';
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
    public saveStateService: SaveStateService,
    public headerService: HeaderService,
    public databaseService: DatabaseService,
    public activatedRouter: ActivatedRoute,
    public paramService: ParamService,
    public pageStateService: PageStateService,
  ) {}

  public popStateActivated = false;
  public chapter: Chapter | undefined;
  public chapterNotes: ChapterNotes;
  public chapterVerses: ChapterVerses | undefined;

  @HostListener('window:popstate', ['$event'])
  public onPopState(event: PopStateEvent): void {
    this.popStateActivated = event.state !== null;

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

        try {
          // try {
          // } catch (error) {
          //   console.log('error');
          // }
          this.chapter = (await this.databaseService.getDatabaseItem(
            `${chapterParams.book}-${chapterParams.chapter}-eng-chapter`,
          )) as Chapter;
          this.chapterVerses = (await this.databaseService.getDatabaseItem(
            `${chapterParams.book}-${chapterParams.chapter}-eng-verses`,
          )) as ChapterVerses;
          this.chapterNotes = (await this.databaseService.getDatabaseItem(
            `${chapterParams.book}-${chapterParams.chapter}-eng-notes`,
          )) as ChapterNotes;
          console.log(this.chapterNotes.notes);

          // this.notes = (await axios.get(
          //   'assets/scriptures/heb-1-eng-notes.json',
          // )).data as Note[];
          this.offsetService.expandNotes(this.chapterNotes.notes);
          if (this.chapterVerses && this.chapterVerses.verses) {
            this.chapterService.mergeVersesNotes(
              this.chapterVerses.verses,
              this.chapterNotes.notes,
            );
          }

          this.chapterService.chapter = this.chapter;
          this.chapterService.verses = this.chapterVerses
            ? this.chapterVerses.verses
            : undefined;
          this.chapterService.notes = this.chapterNotes.notes;
          this.pageStateService.newPage(
            this.chapter,
            this.chapterVerses,
            this.chapterNotes,
          );
          this.headerService.headerTitle = this.chapter.title;
          this.headerService.headerShortTitle = this.chapter.shortTitle;
          this.visibilityService.resetNoteVisibility(this.chapterNotes.notes);
          // console.log(this.chapter);
          // console.log(this.verses);
          // console.log(this.notes);
        } catch (error) {
          console.log(error);
        }
        this.popStateActivated = false;
      },
    );
  }

  public onScroll(): void {
    console.log('hhg');
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
        // console.log(
        //   `${verseElement.id} ${verseElement.getBoundingClientRect().bottom}`,
        // );
        break;
      }
    }
    // Array.from(document.querySelectorAll('verse')).map(
    //   (verseElement): void => {},
    // );
  }

  public getWhiteSpaceHeight(): string {
    // const verseElements = Array.from(document.querySelectorAll('verse'));

    // if (verseElements.length > 0) {
    //   const total = verseElements
    //     .map(
    //       (verseElement): number => {
    //         return (verseElement as HTMLElement).clientHeight;
    //       },
    //     )
    //     .reduce(
    //       (v, v2): number => {
    //         return v + v2;
    //       },
    //     );
    //   console.log(total);
    // }
    return `${window.innerHeight - 34}px`;
  }
}
