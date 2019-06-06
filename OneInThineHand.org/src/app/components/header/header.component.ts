import { Component, OnInit } from '@angular/core';
import { SaveStateService } from '../../services/save-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TextSelectService } from '../../services/text-select.service';
import { ChapterService } from '../../services/chapter.service';
import { VisibilityService } from '../../services/visibility.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public constructor(
    public saveStateService: SaveStateService,
    public visibilityService: VisibilityService,
    public chapterServicd: ChapterService,
    public textSelectionService: TextSelectService,
    public modalService: NgbModal,
    private location: Location,
  ) {}

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
    // this.textSelectionService.getSelection();
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
}
