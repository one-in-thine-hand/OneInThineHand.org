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
import { ReferenceLabel } from '../../../../../shared/src/models/notes/Note';
import { sortBy } from 'lodash';
import {
  NoteCategory,
  getReferenceLabelByClassName,
  ReferenceLabels,
} from '../../../../../shared/src/shared';
import { DatabaseService } from '../../services/database.service';
import { TempSettingsService } from '../../services/temp-settings.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public uploading: boolean = false;
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

  public ngOnInit(): void {}
  public async navigationPaneToggle(): Promise<void> {
    this.saveStateService.data.navigationPaneToggle = !this.saveStateService
      .data.navigationPaneToggle;
    await this.saveStateService.save();
  }
  public async notesPaneToggle(): Promise<void> {
    this.saveStateService.data.notesPaneToggle = !this.saveStateService.data
      .notesPaneToggle;

    await this.saveStateService.save();
  }
  public async paragraphsVisible(): Promise<void> {
    this.saveStateService.data.paragraphsVisible = !this.saveStateService.data
      .paragraphsVisible;
    await this.formatTagService.resetFormatTags(
      this.chapterService.chapterVerses,
      this.chapterService.chapterNotes,
    );

    await this.saveStateService.save();
  }
  public async blockVisible(): Promise<void> {
    this.saveStateService.data.blockVisible = !this.saveStateService.data
      .blockVisible;
    await this.formatTagService.resetFormatTags(
      this.chapterService.chapterVerses,
      this.chapterService.chapterNotes,
    );

    await this.saveStateService.save();
  }
  public async poetryVisible(): Promise<void> {
    this.saveStateService.data.poetryVisible = !this.saveStateService.data
      .poetryVisible;
    await this.formatTagService.resetFormatTags(
      this.chapterService.chapterVerses,
      this.chapterService.chapterNotes,
    );

    await this.saveStateService.save();
  }
  public async secondaryNotesVisible(): Promise<void> {
    this.saveStateService.data.secondaryNotesVisible = !this.saveStateService
      .data.secondaryNotesVisible;
    await this.saveStateService.save();
  }
  public async open(content): Promise<void> {
    await this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    }).result;
  }
  public refLabelClick(ref: { visible: boolean } | string): void {
    const asdf = this.electronService.isElectron();
    console.log(ref);

    if ((ref as { visible: boolean }).visible !== undefined) {
      (ref as { visible: boolean }).visible = !(ref as { visible: boolean })
        .visible;
      console.log(ref);
    } else {
      this.saveStateService.data[ref as string] = !this.saveStateService.data[
        ref as string
      ];
    }
    if (this.chapterService.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);
      // this.formatTagService.resetFormatTags(this.chapterService.chapterVerses);
    }
    this.saveStateService.save();
  }
  public async backClick(): Promise<void> {
    this.location.back();
  }
  public async forwardClick(): Promise<void> {
    this.location.forward();
  }

  public getNoteCategories(): ReferenceLabel[] {
    return sortBy(
      this.saveStateService.data.ReferenceLabelSetting.filter(
        (refLabelSetting): boolean => {
          return refLabelSetting.noteCategory !== NoteCategory.ERR;
        },
      ),
      (refLabelSetting): number => {
        return refLabelSetting.noteCategory;
      },
    );
  }
  public async showOrphanRefs(): Promise<void> {}
  public async loadChapterFile(event: Event): Promise<void> {
    this.uploading = true;
    await this.preprocessorService.loadChapterFiles(
      event.target as HTMLInputElement,
    );
    this.uploading = false;
    console.log('Finished');

    return;
    // console.log(event);
    // 'application/x-zip-compressed';

    // const zipFiles = (event.target as HTMLInputElement).files;
    // console.log('asodijfoiasjdf');
    // //
    // if (zipFiles) {
    //   Array.from(zipFiles).map((zipFile): void => {
    //     if (zipFile.type === 'application/x-zip-compressed') {
    //       const reader = new FileReader();

    //       reader.onload = async (): Promise<void> => {
    //         try {
    //           const zip = new JSZip();
    //           const files = await zip.loadAsync(zipFile);

    //           files.forEach(
    //             async (fileName): Promise<void> => {
    //               try {
    //                 const file = await files.file(fileName).async('text');
    //                 // console.log(file);

    //                 const dom = new DOMParser();
    //                 const newDocument = dom.parseFromString(
    //                   file,
    //                   'application/xml',
    //                 );
    //                 const notes = await this.noteProcessor.run(newDocument);
    //                 console.log(notes);
    //               } catch (error) {
    //                 console.log(error);
    //               }
    //             },
    //           );
    //         } catch (error) {
    //           console.log(error);
    //         }
    //       };

    //       reader.readAsArrayBuffer(zipFile);
    //     }
    //   });
    // }
    // console.log(zipFiles);
  }

  public async loadNoteFile(event: Event): Promise<void> {
    await this.preprocessorService.loadNoteFiles(event);
  }
  public async onSubmit(): Promise<void> {
    const fileInput = document.querySelector('#chapterFileOpener');
    if (fileInput) {
      this.uploading = true;
      await this.preprocessorService.loadChapterFiles(
        fileInput as HTMLInputElement,
      );
      this.uploading = false;
    }
  }

  public async noteCategoryBtnClick(
    noteCategoryClassNames: string[],
  ): Promise<void> {
    try {
      const noteCategories = noteCategoryClassNames.map(
        (noteCategoryClassName): ReferenceLabel => {
          return this.findNoteCategorySetting(
            noteCategoryClassName,
          ) as ReferenceLabel;
        },
      );
      noteCategories[0].visible = !noteCategories[0].visible;
      if (noteCategories.length > 1) {
        for (let x = 1; x < noteCategories.length; x++) {
          const noteCat = noteCategories[x];

          noteCat.visible = noteCategories[0].visible;
          console.log(noteCat.visible);
        }
        // noteCategories[1].visible = noteCategories[0].visible;
      }
    } catch (error) {}
    // const noteCategory = this.saveStateService.data.noteCategorySettings.find(
    //   (noteCategory): boolean => {
    //     return noteCategory.className === noteCategoryClassName;
    //   },
    // );

    // if (noteCategory) {
    //   noteCategory.visible = !noteCategory.visible;
    // }

    // if (this.chapterService.notes) {
    //   this.visibilityService.resetNoteVisibility(this.chapterService.notes);
    //   // this.formatTagService.resetFormatTags(this.chapterService.chapterVerses);
    // }
    if (this.chapterService.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);
      // this.formatTagService.resetFormatTags(this.chapterService.chapterVerses);
    }
    await this.saveStateService.save();
  }

  public categoryIsActive(noteCategoryClassName: string): boolean {
    const noteCategory = this.findNoteCategorySetting(noteCategoryClassName);
    if (!noteCategory) {
      console.log(noteCategoryClassName);
      // console.log(ReferenceLabels);
    }
    return noteCategory && noteCategory.visible ? noteCategory.visible : false;
    // return true;
  }
  private findNoteCategorySetting(
    noteCategoryClassName: string,
  ): ReferenceLabel | undefined {
    return this.saveStateService.data.noteCategorySettings.find(
      (noteCategory): boolean => {
        return noteCategory.className === noteCategoryClassName;
      },
    );
  }

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

    if (
      refLabelTRN &&
      refLabelTRN1 &&
      refLabelTRN2 &&
      refLabelGreek &&
      refLabelHEB
    ) {
      refLabelTRN.visible = !refLabelTRN.visible;

      refLabelTRN1.visible = refLabelTRN.visible;
      refLabelGreek.visible = refLabelTRN1.visible;
      refLabelHEB.visible = refLabelTRN1.visible;
      refLabelTRN2.visible = false;
    }

    if (this.chapterService.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);
      // this.formatTagService.resetFormatTags(this.chapterService.chapterVerses);
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

    if (refLabelTRN && refLabelTRN.visible && refLabelTRN2) {
      refLabelTRN2.visible = !refLabelTRN2.visible;
    }

    if (this.chapterService.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);
      // this.formatTagService.resetFormatTags(this.chapterService.chapterVerses);
    }
    await this.saveStateService.save();
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
      // this.formatTagService.resetFormatTags(this.chapterService.chapterVerses);
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
      // this.formatTagService.resetFormatTags(this.chapterService.chapterVerses);
    }
    await this.saveStateService.save();
  }
  public async quotationClick(): Promise<void> {
    const refLabelQuo = this.findNoteCategorySetting(
      'reference-label-quotation',
    );
    const refLabelQuo1 = this.findNoteCategorySetting(
      'reference-label-quotation-1',
    );
    const refLabelQuo2 = this.findNoteCategorySetting(
      'reference-label-quotation-2',
    );

    if (refLabelQuo && refLabelQuo1 && refLabelQuo2) {
      refLabelQuo.visible = !refLabelQuo.visible;

      refLabelQuo2.visible = false;
      refLabelQuo1.visible = refLabelQuo.visible;
    }

    if (this.chapterService.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);
      // this.formatTagService.resetFormatTags(this.chapterService.chapterVerses);
    }
    await this.saveStateService.save();
  }
  public async quotationMoreClick(): Promise<void> {
    const refLabelQuo = this.findNoteCategorySetting(
      'reference-label-quotation',
    );
    const refLabelQuo1 = this.findNoteCategorySetting(
      'reference-label-quotation-1',
    );
    const refLabelQuo2 = this.findNoteCategorySetting(
      'reference-label-quotation-2',
    );

    if (refLabelQuo && refLabelQuo1 && refLabelQuo2) {
      refLabelQuo.visible = true;

      refLabelQuo2.visible = !refLabelQuo2.visible;
      refLabelQuo1.visible = !refLabelQuo2.visible;
    }

    if (this.chapterService.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterService.notes);
      // this.formatTagService.resetFormatTags(this.chapterService.chapterVerses);
    }
    await this.saveStateService.save();
  }
}
