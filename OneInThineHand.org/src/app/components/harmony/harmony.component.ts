import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Verse, VerseNotes } from '../../../../../shared/src/shared';
import { DatabaseService, DatabaseItem } from '../../services/database.service';
import { FormatTagService } from '../../services/format-tag.service';
import { MapShell, KJVVerseRef } from './map-shell';
import { ChapterVerses } from '../../../../../format-tags/src/main';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { SaveStateService } from '../../services/save-state.service';
import { TempSettingsService } from '../../services/temp-settings.service';
import { ChapterNotes } from '../../../../../notes/src/main';
import { OffsetService } from '../../services/offset.service';

@Component({
  selector: 'app-harmony',
  templateUrl: './harmony.component.html',
  styleUrls: ['./harmony.component.scss'],
})
export class HarmonyComponent implements OnInit {
  public mapShell?: MapShell;
  public mapShellDatabaseItems?: DatabaseItem[];
  public safeHeader?: SafeHtml;
  public verseNotes?: VerseNotes[];
  public verses?: Verse[];

  public constructor(
    public databaseService: DatabaseService,
    public formatTagService: FormatTagService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public httpClient: HttpClient,
    public domSanitizer: DomSanitizer,
    public saveStateService: SaveStateService,
    public tempSettings: TempSettingsService,
    public offsetService: OffsetService,
  ) {}
  public getWhiteSpaceHeight(): string {
    return `${window.innerHeight - 64}px`;
  }
  public async ngOnInit(): Promise<void> {
    this.databaseService.initReadingMode();

    this.activatedRoute.params.subscribe(
      async (params): Promise<void> => {
        const id = `${params['language']}-${params['book']}-${params['chapter']}-chapter-map-shell`;
        console.log(id);

        this.mapShell = ((await this.databaseService.getDatabaseItem(
          id,
        )) as never) as MapShell;
        console.log(this.mapShell);

        this.mapShellDatabaseItems = await this.getDataBaseItems(this.mapShell);
        console.log(this.mapShellDatabaseItems);

        await this.extractVersesFromDatabaseItems(this.mapShellDatabaseItems);
        if (this.verses) {
          this.extractVerseNotesFromDatabaseItems(
            this.mapShellDatabaseItems,
            this.verses,
          );
        }
        if (this.verses && this.mapShell) {
          if (this.mapShell.headerHtml) {
            this.safeHeader = this.domSanitizer.bypassSecurityTrustHtml(
              this.mapShell.headerHtml,
            );
          }
          await this.formatTagService.resetVerses(this.verses);
          this.addVersesToMapShell(this.verses, this.mapShell);
          if (id.includes('jst_')) {
            this.tempSettings.jstMode = true;
          } else {
            this.tempSettings.jstMode = false;
            this.safeHeader = undefined;
          }
        }
      },
    );
  }
  public async extractVerseNotesFromDatabaseItems(
    mapShellDatabaseItems: DatabaseItem[],
    verses: Verse[],
  ): Promise<void> {
    const p = mapShellDatabaseItems
      .filter((mapShellDatabaseItem): boolean => {
        return (mapShellDatabaseItem as ChapterNotes).notes !== undefined;
      })
      .map(
        async (chapterNotes: ChapterNotes): Promise<void> => {
          console.log(chapterNotes);
          if (chapterNotes.notes) {
            await this.offsetService.expandNotes(chapterNotes.notes);
            chapterNotes.notes.map((verseNote): void => {
              const verse = verses.find((verse): boolean => {
                return (
                  verse._id !== undefined &&
                  verse._id.replace('verse', 'verse-notes') === verseNote._id
                );
              });
              if (verse) {
                verse.note = verseNote;
              }
              console.log(verse);
            });
          }
        },
      );
    console.log('oijasofaoijsdf');
    await Promise.all(p);
    await this.formatTagService.resetVerses(verses);
  }

  private addVersesToMapShell(verses: Verse[], mapShell: MapShell): void {
    mapShell.mapShellRows.map((mapShellRow): void => {
      mapShellRow.mapShellColumns.map((mapShellColumn): void => {
        mapShellColumn.verses = [];
        mapShellColumn.verseRefs.map((verseRef): void => {
          let verse = verses.find((v): boolean => {
            return v._id === verseRef.id;
          });
          if (verse && mapShellColumn.verses) {
            mapShellColumn.verses.push(verse);
          }

          if ((verseRef as KJVVerseRef).kjvRef) {
            verse = verses.find((v): boolean => {
              return v._id === (verseRef as KJVVerseRef).kjvRef;
            });
            if (verse && mapShellColumn.verses) {
              mapShellColumn.verses.push(verse);
            }
          }
          // console.log(verseRef);
          // console.log(verse);
        });
        // console.log(mapShellColumn.verses);
      });
    });
  }

  private extractVersesFromDatabaseItems(databaseItems: DatabaseItem[]): void {
    const chapterVerses = databaseItems
      .map((databaseItem): DatabaseItem | undefined => {
        if ((databaseItem as ChapterVerses).verses !== undefined) {
          return databaseItem;
        }
        return undefined;
      })
      .filter((databaseItem): boolean => {
        return databaseItem !== undefined;
      }) as ChapterVerses[];
    chapterVerses.map((chapterVerse): void => {
      if (!this.verses) {
        this.verses = [];
      }
      this.verses = this.verses.concat(
        chapterVerse.verses ? chapterVerse.verses : [],
      );
    });
    console.log(this.verses);
  }

  private async getDataBaseItems(mapShell: MapShell): Promise<DatabaseItem[]> {
    try {
      return (await this.databaseService.bulkGetByIDs(
        mapShell.databaseIDS,
      )) as DatabaseItem[];
    } catch (error) {
      return [];
    }
  }
}
