import { Component, OnInit } from '@angular/core';
import { SaveStateService } from '../../services/save-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TextSelectService } from '../../services/text-select.service';
import { ChapterService } from '../../services/chapter.service';
import { VisibilityService } from '../../services/visibility.service';
import { Location } from '@angular/common';
import { HeaderService } from '../../services/header.service';
import { ElectronService } from '../../providers/electron.service';
import * as JSZip from 'jszip';
import { NoteProcessor } from '../../../../../notes/src/main';
import { PreprocessorService } from '../../services/preprocessor.service';

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
    public chapterServicd: ChapterService,
    public textSelectionService: TextSelectService,
    public modalService: NgbModal,
    public headerService: HeaderService,
    private location: Location,
    public preprocessorService: PreprocessorService,
    public electronService: ElectronService,
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

    await this.saveStateService.save();
  }
  public async poetryVisible(): Promise<void> {
    this.saveStateService.data.poetryVisible = !this.saveStateService.data
      .poetryVisible;
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
    console.log(asdf);

    if ((ref as { visible: boolean }).visible !== undefined) {
      (ref as { visible: boolean }).visible = !(ref as { visible: boolean })
        .visible;
      console.log(ref);
    } else {
      this.saveStateService.data[ref as string] = !this.saveStateService.data[
        ref as string
      ];
    }
    if (this.chapterServicd.notes) {
      this.visibilityService.resetNoteVisibility(this.chapterServicd.notes);
    }
    this.saveStateService.save();
  }
  public async backClick(): Promise<void> {
    this.location.back();
  }
  public async forwardClick(): Promise<void> {
    this.location.forward();
  }

  public async showOrphanRefs(): Promise<void> {}
  public async loadChapterFile(event: Event): Promise<void> {
    this.uploading = true;
    await this.preprocessorService.loadChapterFiles(event);
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
}
