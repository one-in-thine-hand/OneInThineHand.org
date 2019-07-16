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
import { FormatTagService } from '../../services/format-tag.service';

@Component({
  selector: 'app-header-dropdown',
  templateUrl: './header-dropdown.component.html',
  styleUrls: ['./header-dropdown.component.scss'],
})
export class HeaderDropdownComponent implements OnInit {
  public pQueueVerses = new PQueue({ concurrency: 1 });
  public preparingHarmony: boolean;
  public showOrphanNotes = false;
  public constructor(
    public saveStateService: SaveStateService,
    public formatTagService: FormatTagService,
    public chapterService: ChapterService,
    public databaseService: DatabaseService,
    public textSelectionService: TextSelectService,
    public modalService: NgbModal,
    public visibilityService: VisibilityService,
    public exportService: ExportService,

    private location: Location,
  ) {}
  public async blockVisible(): Promise<void> {
    this.saveStateService.data.blockVisible = !this.saveStateService.data
      .blockVisible;
    await this.formatTagService.resetFormatTags(
      this.chapterService.chapterVerses,
      this.chapterService.chapterNotes,
    );

    await this.saveStateService.save();
  }
  /**
   * edit
   */
  public edit(): void {
    this.saveStateService.data.editMode = !this.saveStateService.data.editMode;
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

  public ngOnInit(): void {}

  public async paragraphsVisible(): Promise<void> {
    this.saveStateService.data.paragraphsVisible = !this.saveStateService.data
      .paragraphsVisible;
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

  public async save(): Promise<void> {
    if (this.chapterService.chapterNotes) {
      await this.databaseService.updateDatabaseItem(
        this.chapterService.chapterNotes,
      );
      console.log('Finished');
    }
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

  private sliceArray<T>(array: T[], chunkSizes: number): T[][] {
    const newArray: T[][] = [];
    let x = 0;
    while (x < array.length) {
      newArray.push(array.slice(x, x + chunkSizes));
      x = x + chunkSizes;
    }
    return newArray;
  }
}
