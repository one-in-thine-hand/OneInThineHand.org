import { Component, OnInit } from '@angular/core';
import { SaveStateService } from '../../services/save-state.service';
import { ChapterService } from '../../services/chapter.service';
import { TextSelectService } from '../../services/text-select.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { VisibilityService } from '../../services/visibility.service';
import { DatabaseService } from '../../services/database.service';
import { sortBy } from 'lodash';

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
    public visibilityService: VisibilityService,
    public databaseService: DatabaseService,
    private location: Location,
  ) {}

  public ngOnInit(): void {}

  public async showNotes(): Promise<void> {
    this.showOrphanNotes = false;
    // this.refService.resetChapterVisbility();
  }
  public async showOrphanRefs(): Promise<void> {
    console.log('hgg');

    if (this.chapterService.notes)
      this.visibilityService.showMissingOffsets(this.chapterService.notes);
    // const fRefs = await this.refService.getWRefList();
    // if (fRefs) {
    //   this.showOrphanNotes = true;
    //   await this.refService.setListOfNotesVisibility(fRefs, false);
    //   // fRefs.map((fRefs): void => {});
    //   console.log(Array.from(this.refService.noteVis.values()));
    // }
    // +console.log(fRefs);
  }

  public async save(): Promise<void> {
    if (this.chapterService.chapterNotes) {
      await this.databaseService.updateDatabaseItem(
        this.chapterService.chapterNotes,
      );
    }
  }
  /**
   * edit
   */
  public edit() {
    this.saveState.data.editMode = !this.saveState.data.editMode;
  }

  /**
   * exportBook
   */
  public async exportBook(): Promise<void> {
    if (this.chapterService.chapter) {
      const idSplit = this.chapterService.chapter._id.split('-');
      console.log(`${idSplit[0]}-${idSplit[1]}`);
      const docs = await this.databaseService.allDocs();
      const ifs = sortBy(
        docs.rows
          .filter(
            (d): boolean => {
              return (
                d.id.includes(`${idSplit[0]}-${idSplit[1]}`) &&
                d.id.includes('note')
              );
            },
          )
          .map(
            (d): string => {
              return d.id;
            },
          ),
        (a): number => {
          return parseInt(a.split('-')[2]);
        },
      );

      console.log(ifs);
    }
  }
}
