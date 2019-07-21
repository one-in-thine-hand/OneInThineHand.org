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

  public async altClick(): Promise<void> {
    await this.flipVisibility('alt');
    this.setNoteCategoriesVisibility(
      ['reference-label-alt'],
      this.saveStateService.data.alt.vis,
    );
    await this.resetNotes();
  }
  public async baseClick(baseName: string): Promise<void> {
    await this.flipVisibility(baseName);
    await this.flipVisibility(`${baseName}More`, false);
  }
  public async bdClick(): Promise<void> {
    await this.flipVisibility('bd');
    this.setNoteCategoriesVisibility(
      ['reference-label-bd'],
      this.saveStateService.data.bd.vis,
    );
    await this.resetNotes();
  }

  public async crClick(): Promise<void> {
    await this.flipVisibility('cr');

    await this.resetNotes();
  }
  public async geoClick(): Promise<void> {
    await this.baseClick('geo');

    await this.resetNotes();
  }

  public async geoMoreClick(): Promise<void> {
    this.moreClick('geo');

    await this.resetNotes();
  }
  public getNoteType(typeName: string): NoteTypeOverlay | undefined {
    return this.saveStateService.data.noteTypes
      ? this.saveStateService.data.noteTypes.noteTypes.find((nC): boolean => {
          return nC.className === typeName;
        })
      : undefined;
  }
  public async grClick(): Promise<void> {
    await this.flipVisibility('gr');

    await this.resetNotes();
  }
  public async gsClick(): Promise<void> {
    await this.flipVisibility('gs');
    this.setNoteCategoriesVisibility(
      ['reference-label-gs'],
      this.saveStateService.data.gs.vis,
    );
    await this.resetNotes();
  }
  public async hebClick(): Promise<void> {
    await this.flipVisibility('heb');

    await this.resetNotes();
  }
  public async hmyClick(): Promise<void> {
    await this.flipVisibility('hmy');
    this.setNoteCategoriesVisibility(
      ['reference-label-harmony'],
      this.saveStateService.data.hmy.vis,
    );
    await this.resetNotes();
  }
  public async hstClick(): Promise<void> {
    await this.baseClick('hst');

    await this.resetNotes();
  }
  public async hstMoreClick(): Promise<void> {
    this.moreClick('hst');

    await this.resetNotes();
  }

  public async ieClick(): Promise<void> {
    await this.flipVisibility('ie');

    await this.resetNotes();
  }
  public async moreClick(baseName: string): Promise<void> {
    await this.flipVisibility(baseName, true);
    await this.flipVisibility(`${baseName}More`);
  }

  public ngOnInit(): void {}

  public async orClick(): Promise<void> {
    await this.baseClick('or');

    await this.resetNotes();
  }
  public async orMoreClick(): Promise<void> {
    this.moreClick('or');

    await this.resetNotes();
  }
  public async phrClick(): Promise<void> {
    await this.baseClick('phr');

    await this.resetNotes();
  }
  public async phrMoreClick(): Promise<void> {
    this.moreClick('phr');

    await this.resetNotes();
  }
  public async pronunciationClick(): Promise<void> {
    await this.baseClick('pronunciation');
    this.saveStateService.data.pronunciationVisible = false;

    await this.resetNotes();
  }
  public async pronunciationMoreClick(): Promise<void> {
    await this.moreClick('pronunciation');

    this.saveStateService.data.pronunciationVisible = !this.saveStateService
      .data.pronunciationVisible;
    await this.resetNotes();
  }
  public async quoClick(): Promise<void> {
    await this.baseClick('quo');

    await this.resetNotes();
  }
  public async quoMoreClick(): Promise<void> {
    this.moreClick('quo');

    await this.resetNotes();
  }
  public async tgClick(): Promise<void> {
    await this.flipVisibility('tg');

    await this.resetNotes();
  }

  public async trnClick(): Promise<void> {
    await this.baseClick('trn');

    await this.resetNotes();
  }
  public async trnMoreClick(): Promise<void> {
    this.moreClick('trn');

    await this.resetNotes();
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
  private async flipVisibility(
    noteVisibilityBtn: string,
    vis?: boolean,
  ): Promise<void> {
    const noteVisButton = this.saveStateService.data[
      noteVisibilityBtn
    ] as NoteVisiblityBtn;
    noteVisButton.vis = vis !== undefined ? vis : !noteVisButton.vis;

    console.log(noteVisButton.vis);
    console.log(vis);
  }

  private resetNoteCategoryVisibility(): void {
    this.setHarmonyNotesVisiblity();
    this.setQuotationVisibility();

    this.setPhrasingNotesVisibility();

    this.setTranslationVisibility();

    this.setIENoteVisibility();
    this.setCrossRefVisibility();
    this.setHistoryNotesVisibility();
    this.setGeographyNotesVisibility();
    this.setPronunciationNotesVisibility();
    this.setNoteCategoriesVisibility(
      ['reference-label-heb'],
      this.saveStateService.data.heb.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-tg'],
      this.saveStateService.data.tg.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-greek'],
      this.saveStateService.data.gr.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-gs'],
      this.saveStateService.data.gs.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-bd'],
      this.saveStateService.data.bd.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-alt'],
      this.saveStateService.data.alt.vis,
    );
  }

  private async resetNotes(): Promise<void> {
    this.resetNoteCategoryVisibility();
    await this.saveStateService.save();
    if (this.chapterService.notes && this.chapterService.chapterNotes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);

      this.chapterService.offsetGroups = this.offsetGroupsService.buildOffsetGroups(
        this.chapterService.chapterNotes,
      );
    }
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

  private setGeographyNotesVisibility(): void {
    this.setNoteCategoriesVisibility(
      ['reference-label-geography'],
      this.saveStateService.data.geo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-geography-1'],
      this.saveStateService.data.geo.vis &&
        !this.saveStateService.data.geoMore.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-geography-2'],
      this.saveStateService.data.geo.vis &&
        this.saveStateService.data.geoMore.vis,
    );
  }

  private setHarmonyNotesVisiblity(): void {
    this.setNoteCategoriesVisibility(
      ['reference-label-harmony'],
      this.saveStateService.data.hmy.vis,
    );
  }

  private setHistoryNotesVisibility(): void {
    this.setNoteCategoriesVisibility(
      ['reference-label-history'],
      this.saveStateService.data.hst.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-history-1'],
      this.saveStateService.data.hst.vis &&
        !this.saveStateService.data.hstMore.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-history-2'],
      this.saveStateService.data.hst.vis &&
        this.saveStateService.data.hstMore.vis,
    );
  }

  private setIENoteVisibility(): void {
    this.setNoteCategoriesVisibility(
      ['reference-label-ie'],
      this.saveStateService.data.ie.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-ie-quotation'],
      this.saveStateService.data.ie.vis && this.saveStateService.data.quo.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-ie-quotation-1'],
      this.saveStateService.data.ie.vis &&
        this.saveStateService.data.quo.vis &&
        !this.saveStateService.data.quoMore.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-ie-quotation-2'],
      this.saveStateService.data.ie.vis &&
        this.saveStateService.data.quo.vis &&
        this.saveStateService.data.quoMore.vis,
    );
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

  private setPhrasingNotesVisibility(): void {
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

  private setPronunciationNotesVisibility(): void {
    this.setNoteCategoriesVisibility(
      ['reference-label-pronunciation-2'],
      this.saveStateService.data.pronunciationMore.vis,
    );
    // this.saveStateService.data.pronunciationMore =
    //   this.saveStateService.data.pronunciation.vis &&
    //   !this.saveStateService.data.pronunciationMore.vis;

    console.log(this.saveStateService.data.pronunciationVisible);
  }
  private setQuotationVisibility(): void {
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

  private setTranslationVisibility(): void {
    this.setNoteCategoriesVisibility(
      ['reference-label-translation'],
      this.saveStateService.data.trn.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-translation-1'],
      this.saveStateService.data.trn.vis &&
        !this.saveStateService.data.trnMore.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-translation-2'],
      this.saveStateService.data.trn.vis &&
        this.saveStateService.data.trnMore.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-or'],
      this.saveStateService.data.or.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-or-translation-1'],
      this.saveStateService.data.or.vis &&
        this.saveStateService.data.trn.vis &&
        this.saveStateService.data.trnMore.vis,
    );
    this.setNoteCategoriesVisibility(
      ['reference-label-or-translation-2'],
      this.saveStateService.data.or.vis &&
        this.saveStateService.data.trn.vis &&
        !this.saveStateService.data.trnMore.vis,
    );
  }
}
