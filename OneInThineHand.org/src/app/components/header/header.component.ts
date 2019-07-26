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
import { NoteCategory, NoteTypeOverlay } from '../../models/verse-notes';
import { OffsetGroupsService } from '../../services/offset-groups.service';

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
    public offsetGroupService: OffsetGroupsService,
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

  public async forwardClick(): Promise<void> {
    this.location.forward();
  }

  public async loadChapterFile(event: Event): Promise<void> {
    this.uploading = true;
    await this.preprocessorService.loadChapterFiles(event);
    this.uploading = false;
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

  public async noteTypeClick(noteType: NoteTypeOverlay): Promise<void> {
    noteType.visibility = !noteType.visibility;
    console.log(noteType);

    this.saveStateService.resetNoteSettingsObservable.next();
    // if (this.chapterService.notes && this.chapterService.chapterNotes) {
    //   // console.log('oiasjdfioajsdfiojasdofaoisdvnioj');

    //   this.visibilityService.resetNoteVisibility(this.chapterService.notes);

    //   this.chapterService.offsetGroups = this.offsetGroupService.buildOffsetGroups(
    //     this.chapterService.chapterNotes,
    //   );
    //   this.chapterService.offsetGroupsOb.next(this.chapterService.offsetGroups);
    // }
    // await this.save();
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
  public async refLabelClick(
    ref: { visible: boolean } | string,
  ): Promise<void> {
    const asdf = this.electronService.isElectron();

    if ((ref as { visible: boolean }).visible !== undefined) {
      (ref as { visible: boolean }).visible = !(ref as { visible: boolean })
        .visible;
    } else {
      this.saveStateService.data[ref as string] = !this.saveStateService.data[
        ref as string
      ];
    }
    await this.resetNotes();
    // this.saveStateService.save();
  }

  public async save(): Promise<void> {
    await this.saveStateService.save();
  }

  private async resetNotes(): Promise<void> {
    this.saveStateService.resetNoteSettingsObservable.next();
    // if (this.chapterService.notes && this.chapterService.chapterNotes) {
    //   this.visibilityService.resetNoteVisibility(this.chapterService.notes);
    //   this.chapterService.offsetGroups = this.offsetGroupService.buildOffsetGroups(
    //     this.chapterService.chapterNotes,
    //   );
    //   this.chapterService.offsetGroupsOb.next(this.chapterService.offsetGroups);
    // }
    // await this.saveStateService.save();
  }
}
