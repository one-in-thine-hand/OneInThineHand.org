import { Component, OnInit } from '@angular/core';
import { SaveStateService } from '../../services/save-state.service';
import { ChapterService } from '../../services/chapter.service';
import { TextSelectService } from '../../services/text-select.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { VisibilityService } from '../../services/visibility.service';
import { DatabaseService, DatabaseItem } from '../../services/database.service';
import { ExportService } from '../../services/export.service';
import { ChapterVerses } from '../../../../../format-tags/src/main';
import { Verse } from '../../../../../shared/src/shared';
import PQueue from 'p-queue/dist';
import { flatten } from 'lodash';

@Component({
  selector: 'app-header-dropdown',
  templateUrl: './header-dropdown.component.html',
  styleUrls: ['./header-dropdown.component.scss'],
})
export class HeaderDropdownComponent implements OnInit {
  public showOrphanNotes: boolean = false;
  public preparingHarmony: boolean;
  public constructor(
    public saveState: SaveStateService,
    public chapterService: ChapterService,
    public databaseService: DatabaseService,
    public textSelectionService: TextSelectService,
    public modalService: NgbModal,
    public visibilityService: VisibilityService,
    public exportService: ExportService,

    private location: Location,
  ) {}

  public pQueueVerses = new PQueue({ concurrency: 1 });

  public ngOnInit(): void {}
  public async prepareForHarmony(): Promise<void> {
    console.log('aoisdjfoiasjdfoiajsdf');

    try {
      const docs = await this.databaseService.allDocs();

      if (docs) {
        const verses = docs.rows
          .filter((doc): boolean => {
            return doc.id.includes('verses');
          })
          .map(
            async (row): Promise<Verse[]> => {
              return ((await this.databaseService.getDatabaseItem(
                row.id,
              )) as ChapterVerses).verses as Verse[];
            },
          );
        const promises = this.sliceArray(
          flatten(await Promise.all(verses)),
          1000,
        ).map(
          async (slice): Promise<void> => {
            await this.pQueueVerses.add(
              async (): Promise<void> => {
                await this.databaseService.bulkDocs(slice as DatabaseItem[]);
              },
            );
          },
        );
        this.preparingHarmony = true;
        await Promise.all(promises);

        this.preparingHarmony = false;
        console.log('Finished');
        alert('Finished');
      }
    } catch (error) {
      console.log(error);
    }
  }

  private sliceArray<T>(array: T[], chunkSizes: number): T[][] {
    const newArray: T[][] = [];
    let x = 0;
    while (x < array.length) {
      newArray.push(array.slice(x, x + chunkSizes));
      x = x + chunkSizes;
    }
    return newArray;
  }

  public async showNotes(): Promise<void> {
    this.showOrphanNotes = false;
  }
  public async showOrphanRefs(): Promise<void> {
    console.log('hgg');

    if (this.chapterService.notes) {
      this.visibilityService.showMissingOffsets(this.chapterService.notes);
    }
  }

  public async save(): Promise<void> {
    if (this.chapterService.chapterNotes) {
      await this.databaseService.updateDatabaseItem(
        this.chapterService.chapterNotes,
      );
      console.log('Finished');
    }
  }
  /**
   * edit
   */
  public edit(): void {
    this.saveState.data.editMode = !this.saveState.data.editMode;
  }

  /**
   * exportBook
   */
  public async exportBook(): Promise<void> {
    await this.exportService.exportBook();
  }

  public async exportBreaks(): Promise<void> {
    await this.exportService.exportBreaks();
  }
}
