import { Component, OnInit } from '@angular/core';
import { SaveStateService } from '../../services/save-state.service';
import { ChapterService } from '../../services/chapter.service';
import { TextSelectService } from '../../services/text-select.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header-dropdown',
  templateUrl: './header-dropdown.component.html',
  styleUrls: ['./header-dropdown.component.scss'],
})
export class HeaderDropdownComponent implements OnInit {
  public showOrphanNotes: boolean = false;
  public constructor(
    public saveState: SaveStateService,
    public chapterService: ChapterService,
    public textSelectionService: TextSelectService,
    public modalService: NgbModal,
    private location: Location,
  ) {}

  public ngOnInit(): void {}

  public async showNotes(): Promise<void> {
    this.showOrphanNotes = false;
    // this.refService.resetChapterVisbility();
  }
  public async showOrphanRefs(): Promise<void> {
    // const fRefs = await this.refService.getWRefList();
    // if (fRefs) {
    //   this.showOrphanNotes = true;
    //   await this.refService.setListOfNotesVisibility(fRefs, false);
    //   // fRefs.map((fRefs): void => {});
    //   console.log(Array.from(this.refService.noteVis.values()));
    // }
    // +console.log(fRefs);
  }
}
