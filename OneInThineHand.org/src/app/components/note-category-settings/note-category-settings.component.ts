import { Component, OnInit } from '@angular/core';
import { SaveStateService } from '../../services/save-state.service';
import {
  NoteCategorySort,
  NoteCategory,
  NoteTypeOverlay,
} from '../../models/verse-notes';
import { OffsetGroupsService } from '../../services/offset-groups.service';
import { VisibilityService } from '../../services/visibility.service';
import { ChapterService } from '../../services/chapter.service';
import { NoteVisiblityBtn } from '../../services/NoteVisiblityBtn';

@Component({
  selector: 'app-note-category-settings',
  templateUrl: './note-category-settings.component.html',
  styleUrls: ['./note-category-settings.component.scss'],
})
export class NoteCategorySettingsComponent implements OnInit {
  public constructor(
    public chapterService: ChapterService,
    public offsetGroupsService: OffsetGroupsService,
    public saveStateService: SaveStateService,
    public visibilityService: VisibilityService,
  ) {}

  public altClick(): void {
    this.flipVisibility('alt');
    this.setNoteCategoriesVisibility(
      ['reference-label-alt'],
      this.saveStateService.data.alt.vis,
    );
    this.resetNotes();
  }
  public baseClick(baseName: string): void {
    this.flipVisibility(baseName);
    this.flipVisibility(`${baseName}More`, false);
  }
  public bdClick(): void {
    this.flipVisibility('bd');
    this.setNoteCategoriesVisibility(
      ['reference-label-bd'],
      this.saveStateService.data.bd.vis,
    );
    this.resetNotes();
  }

  public crClick(): void {
    this.flipVisibility('cr');
    if (this.saveStateService.data.cr) {
    } else {
    }
    this.resetNotes();
  }
  public geoClick(): void {
    this.baseClick('geo');
    // this.flipVisibility('geo');
    // this.flipVisibility('geoMore', false);
    if (this.saveStateService.data.geo) {
    } else {
    }
    this.resetNotes();
  }
  public geoMoreClick(): void {
    this.flipVisibility('geo', true);
    this.flipVisibility('geoMore');
    if (this.saveStateService.data.geoMore) {
    } else {
    }
    this.resetNotes();
  }
  public getNoteType(typeName: string): NoteTypeOverlay | undefined {
    return this.saveStateService.data.noteTypes
      ? this.saveStateService.data.noteTypes.noteTypes.find((nC): boolean => {
          return nC.className === typeName;
        })
      : undefined;
  }
  public grClick(): void {
    this.flipVisibility('gr');
    this.setNoteCategoriesVisibility(
      ['reference-label-greek'],
      this.saveStateService.data.gr.vis,
    );
    this.resetNotes();
  }
  public gsClick(): void {
    this.flipVisibility('gs');
    this.setNoteCategoriesVisibility(
      ['reference-label-gs'],
      this.saveStateService.data.gs.vis,
    );
    this.resetNotes();
  }
  public hebClick(): void {
    this.flipVisibility('heb');
    this.setNoteCategoriesVisibility(
      ['reference-label-heb'],
      this.saveStateService.data.heb.vis,
    );
    this.resetNotes();
  }
  public hmyClick(): void {
    this.flipVisibility('hmy');
    this.setNoteCategoriesVisibility(
      ['reference-label-harmony'],
      this.saveStateService.data.hmy.vis,
    );
    this.resetNotes();
  }
  public hstClick(): void {
    this.baseClick('hst');
    if (this.saveStateService.data.hst) {
    } else {
    }
    this.resetNotes();
  }
  public hstMoreClick(): void {
    this.moreClick('hst');
    if (this.saveStateService.data.hstMore) {
    } else {
    }
    this.resetNotes();
  }

  public ieClick(): void {
    this.flipVisibility('ie');
    if (this.saveStateService.data.ie) {
    } else {
    }
    this.resetNotes();
  }
  public moreClick(baseName: string): void {
    this.flipVisibility(baseName, true);
    this.flipVisibility(`${baseName}More`);
  }

  public ngOnInit(): void {}

  public orClick(): void {
    this.baseClick('or');
    if (this.saveStateService.data.or) {
    } else {
    }
    this.resetNotes();
  }
  public orMoreClick(): void {
    this.moreClick('or');
    if (this.saveStateService.data.orMore) {
    } else {
    }
    this.resetNotes();
  }
  public phrClick(): void {
    this.baseClick('phr');
    if (this.saveStateService.data.phr) {
    } else {
    }
    this.resetNotes();
  }
  public phrMoreClick(): void {
    this.moreClick('phr');
    if (this.saveStateService.data.phrMore) {
    } else {
    }
    this.resetNotes();
  }
  public pronunciationClick(): void {
    this.baseClick('pronunciation');
    if (this.saveStateService.data.pronunciation) {
    } else {
    }
    this.resetNotes();
  }
  public pronunciationMoreClick(): void {
    this.moreClick('pronunciation');

    if (this.saveStateService.data.pronunciation) {
    } else {
    }
    this.resetNotes();
  }
  public quoClick(): void {
    this.baseClick('quo');
    if (this.saveStateService.data.quo) {
    } else {
    }
    this.resetNotes();
  }
  public quoMoreClick(): void {
    this.moreClick('quo');
    if (this.saveStateService.data.quoMore) {
    } else {
    }
    this.resetNotes();
  }
  public tgClick(): void {
    this.flipVisibility('tg');
    this.setNoteCategoriesVisibility(
      ['reference-label-tg'],
      this.saveStateService.data.tg.vis,
    );
    this.resetNotes();
  }

  public trnClick(): void {
    this.baseClick('trn');
    if (this.saveStateService.data.trn) {
    } else {
    }
    this.resetNotes();
  }
  public trnMoreClick(): void {
    this.moreClick('trn');
    if (this.saveStateService.data.trnMore) {
    } else {
    }
    this.resetNotes();
  }

  private findNoteCategory(
    noteCategoryClassName: string,
  ): NoteCategory | undefined {
    return this.saveStateService.data.noteCategorySettings.find(
      (noteCategory): boolean => {
        return noteCategory.className === noteCategoryClassName;
      },
    );
  }
  private flipVisibility(noteVisibilityBtn: string, vis?: boolean): void {
    const noteVisButton = this.saveStateService.data[
      noteVisibilityBtn
    ] as NoteVisiblityBtn;
    noteVisButton.vis = vis !== undefined ? vis : !noteVisButton.vis;

    console.log(noteVisButton.vis);
    console.log(vis);
  }

  private resetNoteCategoryVisibility(): void {
    this.setNoteCategoriesVisibility(
      ['reference-label-harmony'],
      this.saveStateService.data.hmy.vis,
    );
    this.setQuotationVisibility();

    this.setPhrasingNotesVisibility();

    this.setNoteCategoriesVisibility(
      ['reference-label-translation'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-translation-1'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-translation-2'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-or-translation-1'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-or-translation-2'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-or'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-alt'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-ie-quotation'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-ie-quotation-1'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-ie-quotation-2'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-ie'],
      this.saveStateService.data.quo.vis,
    );
    this.setCrossRefVisibility();
    this.setNoteCategoriesVisibility(
      ['reference-label-history'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-geography'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-pronunciation-2'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-tg'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-gs'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-bd'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-error'],
      this.saveStateService.data.quo.vis,
    );
  }

  private setCrossRefVisibility(): void {
    const jstOverlay = this.getNoteType('overlay-jst');
    this.setNoteCategoriesVisibility(
      ['reference-label-cross-ref'],
      this.saveStateService.data.cr.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-cross-not-jst-ref'],
      jstOverlay
        ? !jstOverlay.visibility
        : true && this.saveStateService.data.cr.vis,
    );
  }

  private resetNotes(): void {
    this.resetNoteCategoryVisibility();
    if (this.chapterService.notes && this.chapterService.chapterNotes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);

      this.chapterService.offsetGroups = this.offsetGroupsService.buildOffsetGroups(
        this.chapterService.chapterNotes,
      );
    }
  }

  private setNoteCategoriesVisibility(
    noteCategoriesClassNames: string[],
    vis: boolean,
  ): void {
    noteCategoriesClassNames.map((noteCategoryClassName): void => {
      const noteCategory = this.findNoteCategory(noteCategoryClassName);
      if (noteCategory) {
        noteCategory.visible = vis;
      }
    });
  }

  private setPhrasingNotesVisibility() {
    const noteTypeSetting = this.getNoteType('overlay-quo');
    this.setNoteCategoriesVisibility(
      ['reference-label-phrasing'],
      this.saveStateService.data.phr.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-phrasing-1'],
      this.saveStateService.data.phr.vis &&
        !this.saveStateService.data.phrMore.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-phrasing-2'],
      this.saveStateService.data.phr.vis &&
        this.saveStateService.data.phrMore.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-phrasing-quotation'],
      noteTypeSetting
        ? noteTypeSetting.visibility
        : false && this.saveStateService.data.phr.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-phrasing-1-quotation'],
      noteTypeSetting
        ? noteTypeSetting.visibility
        : false &&
            this.saveStateService.data.phr.vis &&
            !this.saveStateService.data.phrMore.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-phrasing-2-quotation'],
      noteTypeSetting
        ? noteTypeSetting.visibility
        : false &&
            this.saveStateService.data.phr.vis &&
            this.saveStateService.data.phrMore.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-phrasing-not-quotation'],
      noteTypeSetting
        ? noteTypeSetting.visibility !== true
        : true && this.saveStateService.data.phr.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-phrasing-1-not-quotation'],
      noteTypeSetting
        ? noteTypeSetting.visibility !== true
        : true &&
            this.saveStateService.data.phr.vis &&
            !this.saveStateService.data.phrMore.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-phrasing-2-not-quotation'],
      noteTypeSetting
        ? noteTypeSetting.visibility !== true
        : true &&
            this.saveStateService.data.phr.vis &&
            this.saveStateService.data.phrMore.vis,
    );
  }

  private setQuotationVisibility() {
    this.setNoteCategoriesVisibility(
      ['reference-label-quotation'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-quotation-1'],
      this.saveStateService.data.quo.vis &&
        !this.saveStateService.data.quoMore.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-quotation-2'],
      this.saveStateService.data.quo.vis &&
        this.saveStateService.data.quoMore.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-quotation-none'],
      this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-quotation-2-none'],
      this.saveStateService.data.quo.vis &&
        !this.saveStateService.data.quoMore.vis,
    );
  }
}
