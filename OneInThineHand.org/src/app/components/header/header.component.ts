import { Component, OnInit } from '@angular/core';
import { SaveStateService } from '../../services/save-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TextSelectService } from '../../services/text-select.service';
import { ChapterService } from '../../services/chapter.service';
import { VisibilityService } from '../../services/visibility.service';
import { Location } from '@angular/common';
import { HeaderService } from '../../services/header.service';
import { ElectronService } from '../../providers/electron.service';
import { NoteProcessor } from '../../../../../notes/src/main';
import { PreprocessorService } from '../../services/preprocessor.service';
import { FormatTagService } from '../../services/format-tag.service';
import { sortBy } from 'lodash';
import { DatabaseService } from '../../services/database.service';
import { TempSettingsService } from '../../services/temp-settings.service';
import {
  NoteCategory,
  NOTE_CATEGORIES,
  NoteCategorySort,
  NoteTypeOverlay,
} from '../../models/verse-notes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public uploading = false;
  public constructor(
    public saveStateService: SaveStateService,
    public visibilityService: VisibilityService,
    public chapterService: ChapterService,
    public textSelectionService: TextSelectService,
    public modalService: NgbModal,
    public headerService: HeaderService,
    private location: Location,
    public preprocessorService: PreprocessorService,
    public electronService: ElectronService,
    public formatTagService: FormatTagService,
    public databaseService: DatabaseService,
    public tempSettingsService: TempSettingsService,
  ) {}

  private noteProcessor = new NoteProcessor();
  public async backClick(): Promise<void> {
    this.location.back();
  }
  public async blockVisible(): Promise<void> {
    this.saveStateService.data.blockVisible = !this.saveStateService.data
      .blockVisible;
    await this.formatTagService.resetFormatTags(
      this.chapterService.chapterVerses,
      this.chapterService.chapterNotes,
    );
    await this.save();
  }

  public categoryIsActive(noteCategoryClassName: string): boolean {
    const noteCategory = this.findNoteCategorySetting(noteCategoryClassName);
    if (!noteCategory) {
    }
    return noteCategory && noteCategory.visible ? noteCategory.visible : false;
  }
  public async forwardClick(): Promise<void> {
    this.location.forward();
  }

  public getNoteCategories(): NoteCategory[] {
    return sortBy(
      this.saveStateService.data.noteCategorySettings.filter(
        (refLabelSetting): boolean => {
          return refLabelSetting.noteCategory !== NoteCategorySort.ERR;
        },
      ),
      (refLabelSetting): number => {
        return refLabelSetting.noteCategory;
      },
    );
  }
  public async loadChapterFile(event: Event): Promise<void> {
    this.uploading = true;
    await this.preprocessorService.loadChapterFiles(event);
    this.uploading = false;

    return;
  }

  public async loadNoteFile(event: Event): Promise<void> {
    await this.preprocessorService.loadNoteFiles(event);
  }
  public async navigationPaneToggle(): Promise<void> {
    this.saveStateService.data.navigationPaneToggle = !this.saveStateService
      .data.navigationPaneToggle;
    await this.saveStateService.save();
  }

  public ngOnInit(): void {}

  public async noteCategoryBtnClick(
    noteCategoryClassNames: string[],
    visibility?: boolean,
  ): Promise<void> {
    try {
      const noteCategories = noteCategoryClassNames.map(
        (noteCategoryClassName): NoteCategory => {
          return this.findNoteCategorySetting(
            noteCategoryClassName,
          ) as NoteCategory;
        },
      );
      noteCategories[0].visible = visibility
        ? visibility
        : !noteCategories[0].visible;
      if (noteCategories.length > 1) {
        for (let x = 1; x < noteCategories.length; x++) {
          const noteCat = noteCategories[x];

          noteCat.visible = noteCategories[0].visible;
        }
      }
    } catch (error) {}

    if (this.chapterService.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);
    }
    await this.saveStateService.save();
  }
  public async notesPaneToggle(): Promise<void> {
    this.saveStateService.data.notesPaneToggle = !this.saveStateService.data
      .notesPaneToggle;
    await this.save();
  }

  public async noteTypeClick(noteType: NoteTypeOverlay): Promise<void> {
    noteType.visibility = !noteType.visibility;
    if (this.chapterService.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);
    }
    await this.save();
  }
  public async onSubmit(event: Event): Promise<void> {
    const fileInput = document.querySelector('#chapterFileOpener');
    this.uploading = true;
    await this.preprocessorService.loadChapterFiles(event);

    this.uploading = false;
    if (fileInput) {
    }
  }
  public async open(content): Promise<void> {
    await this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    }).result;
  }
  public async orClick(): Promise<void> {
    const refLabelOR = this.findNoteCategorySetting('reference-label-or');
    const refLabelOR1 = this.findNoteCategorySetting('reference-label-or-1');
    const refLabelOR2 = this.findNoteCategorySetting('reference-label-or-2');

    if (refLabelOR && refLabelOR1 && refLabelOR2) {
      refLabelOR.visible = !refLabelOR.visible;

      refLabelOR1.visible = refLabelOR.visible;
      refLabelOR2.visible = false;
    }

    if (this.chapterService.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);
    }
    await this.saveStateService.save();
  }

  public async orMoreClick(): Promise<void> {
    const refLabelOR = this.findNoteCategorySetting('reference-label-or');
    const refLabelOR2 = this.findNoteCategorySetting('reference-label-or-2');

    if (refLabelOR && refLabelOR.visible && refLabelOR2) {
      refLabelOR2.visible = !refLabelOR2.visible;
    }

    if (this.chapterService.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);
    }
    await this.saveStateService.save();
  }
  public async paragraphsVisible(): Promise<void> {
    this.saveStateService.data.paragraphsVisible = !this.saveStateService.data
      .paragraphsVisible;
    await this.formatTagService.resetFormatTags(
      this.chapterService.chapterVerses,
      this.chapterService.chapterNotes,
    );
    await this.save();
  }
  public async poetryVisible(): Promise<void> {
    this.saveStateService.data.poetryVisible = !this.saveStateService.data
      .poetryVisible;
    await this.formatTagService.resetFormatTags(
      this.chapterService.chapterVerses,
      this.chapterService.chapterNotes,
    );
    await this.save();
  }
  public async quotationClick(): Promise<void> {
    const refLabelQuo = this.findNoteCategorySetting(
      'reference-label-quotation',
    );
    const refLabels = this.findNoteCategorysSetting([
      'reference-label-quotation-1',
      'reference-label-quotation-2',
      'reference-label-ie-quotation-1',
      'reference-label-ie-quotation-2',
    ]);
    if (refLabelQuo) {
      refLabelQuo.visible = !refLabelQuo.visible;
      refLabels.map((refLabel): void => {
        if (refLabel.className.includes('-2')) {
          refLabel.visible = false;
        } else {
          refLabel.visible = refLabelQuo ? refLabelQuo.visible : false;
        }
      });
    }

    if (this.chapterService.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);
    }
    await this.saveStateService.save();
  }
  public async quotationMoreClick(): Promise<void> {
    const refLabelQuo = this.findNoteCategorySetting(
      'reference-label-quotation',
    );
    if (refLabelQuo) {
      refLabelQuo.visible = true;
      const vis = this.flipRefLabelVis('reference-label-quotation-2');
      console.log(vis);

      this.flipRefLabelVis('reference-label-ie-quotation-2', !vis);
      this.flipRefLabelVis('reference-label-ie-quotation-1', !vis);
      this.flipRefLabelVis('reference-label-quotation-1', vis);
    }

    if (this.chapterService.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);
    }
    await this.saveStateService.save();
  }

  public refLabelClick(ref: { visible: boolean } | string): void {
    const asdf = this.electronService.isElectron();

    if ((ref as { visible: boolean }).visible !== undefined) {
      (ref as { visible: boolean }).visible = !(ref as { visible: boolean })
        .visible;
    } else {
      this.saveStateService.data[ref as string] = !this.saveStateService.data[
        ref as string
      ];
    }
    if (this.chapterService.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);
    }
    this.saveStateService.save();
  }

  public async save(): Promise<void> {
    await this.saveStateService.save();
  }
  public async secondaryNotesVisible(): Promise<void> {
    this.saveStateService.data.secondaryNotesVisible = !this.saveStateService
      .data.secondaryNotesVisible;
    await this.saveStateService.save();
  }
  public async showOrphanRefs(): Promise<void> {}

  public async trnClick(): Promise<void> {
    const refLabelTRN = this.findNoteCategorySetting(
      'reference-label-translation',
    );
    const refLabelTRN1 = this.findNoteCategorySetting(
      'reference-label-translation-1',
    );
    const refLabelHEB = this.findNoteCategorySetting('reference-label-hebrew');
    const refLabelGreek = this.findNoteCategorySetting('reference-label-greek');
    const refLabelTRN2 = this.findNoteCategorySetting(
      'reference-label-translation-2',
    );
    const orTR1 = this.findNoteCategorySetting(
      'reference-label-or-translation-1',
    );
    const orTR2 = this.findNoteCategorySetting(
      'reference-label-or-translation-2',
    );

    if (
      refLabelTRN &&
      refLabelTRN1 &&
      refLabelTRN2 &&
      refLabelGreek &&
      refLabelHEB &&
      orTR1 &&
      orTR2
    ) {
      refLabelTRN.visible = !refLabelTRN.visible;
      refLabelTRN2.visible = false;
      refLabelTRN1.visible = refLabelTRN.visible;
      refLabelGreek.visible = refLabelTRN1.visible;
      refLabelHEB.visible = refLabelTRN1.visible;
      orTR1.visible = refLabelTRN2.visible;
      orTR2.visible = refLabelTRN2.visible;
    }
    if (this.chapterService.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);
    }
    await this.saveStateService.save();
  }

  public async trnMoreClick(): Promise<void> {
    const refLabelTRN = this.findNoteCategorySetting(
      'reference-label-translation',
    );
    const refLabelTRN2 = this.findNoteCategorySetting(
      'reference-label-translation-2',
    );

    const orTR1 = this.findNoteCategorySetting(
      'reference-label-or-translation-1',
    );
    const orTR2 = this.findNoteCategorySetting(
      'reference-label-or-translation-2',
    );
    if (refLabelTRN && refLabelTRN2 && orTR1 && orTR2) {
      refLabelTRN.visible = true;
      refLabelTRN2.visible = !refLabelTRN2.visible;
      orTR1.visible = refLabelTRN2.visible;
      orTR2.visible = refLabelTRN2.visible;
    }

    if (this.chapterService.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);
    }
    await this.saveStateService.save();
  }
  private findNoteCategorySetting(
    noteCategoryClassName: string,
  ): NoteCategory | undefined {
    return this.saveStateService.data.noteCategorySettings.find(
      (noteCategory): boolean => {
        return noteCategory.className === noteCategoryClassName;
      },
    );
  }
  private findNoteCategorysSetting(
    noteCategoryClassNames: string[],
  ): NoteCategory[] {
    return noteCategoryClassNames
      .map((noteCategoryClassName): NoteCategory | undefined => {
        return this.findNoteCategorySetting(noteCategoryClassName);
      })
      .filter((refLabel): boolean => {
        return refLabel !== undefined;
      }) as NoteCategory[];
  }

  private flipRefLabelVis(refLabelClassName: string, vis?: boolean): boolean {
    const refLabel = this.findNoteCategorySetting(refLabelClassName);

    if (refLabel) {
      refLabel.visible = vis ? !vis : !refLabel.visible;
      return refLabel.visible;
    }
    return false;
  }
}
