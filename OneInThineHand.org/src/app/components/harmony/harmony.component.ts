import { Harmony, HarmonyCell } from '../../../../../harmony/src/Harmony';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { CouchDoc, Verse } from '../../../../../shared/src/shared';
import { DatabaseService } from '../../services/database.service';
import { flatten, uniq } from 'lodash';
import PQueue from 'p-queue/dist';
import { FormatTagService } from '../../services/format-tag.service';
import { ActivatedRoute, Router } from '@angular/router';
import { sortBy } from 'lodash';
import { ChapterVerses } from '../../../../../format-tags/src/main';
@Component({
  selector: 'app-harmony',
  templateUrl: './harmony.component.html',
  styleUrls: ['./harmony.component.scss'],
})
export class HarmonyComponent implements OnInit {
  public harmony: Harmony | undefined;
  public harmonyDocQueue = new PQueue({ concurrency: 1 });
  public verses: Verse[] = [];
  public constructor(
    public databaseService: DatabaseService,
    public formatTagService: FormatTagService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
  ) {}

  public async ngOnInit(): Promise<void> {
    this.databaseService.initReadingMode();

    this.activatedRoute.params.subscribe(
      async (params): Promise<void> => {
        this.activatedRoute.queryParams.subscribe(
          async (queryParams): Promise<void> => {
            const chap = params['chapter'] as string;
            const book = params['book'] as string;
            const lang = queryParams['lang'] as string | undefined;
            if (!lang) {
              this.router.navigateByUrl('/');
            } else {
              console.log(`${book}-${chap}-harmony`);

              this.harmony = (await this.databaseService.getDatabaseItem(
                `${lang}-${book}-${chap}-chapter-harmony`,
              )) as Harmony;

              console.log(this.harmony);
              this.setHarmonVerse(this.harmony);
            }
          },
        );
      },
    );
  }

  public async setHarmonVerse(hmy?: Harmony): Promise<void> {
    if (hmy) {
      const flat = flatten(
        hmy.harmonyRows.map((row): HarmonyCell[] => {
          return row.harmonyCells.map(
            (cell): HarmonyCell => {
              return cell;
            },
          );
        }),
      );
      const chapterIDS = this.getChapterId(flat);
      const p = chapterIDS.map(
        async (id): Promise<void> => {
          try {
            const i = (await this.databaseService.getDatabaseItem(
              id,
            )) as ChapterVerses;
            if (i && i.verses) {
              this.verses = this.verses.concat(i.verses);
            }
            console.log(i);
          } catch (error) {
            console.log(error);
          }
        },
      );
      await Promise.all(p);

      flat.map((f): void => {
        f.verseRef
          ? f.verseRef.map((vRef): Verse | undefined => {
              return this.verses.find((v): boolean => {
                return v._id === `${vRef}-verse`;
              });
            })
          : [];
        f.verse;
      });

      const vs = flatten(
        flat.map((f): Verse[] => {
          return f.verse ? f.verse : [];
        }),
      );
      await this.formatTagService.resetVerses(vs);

      // await this.formatTagService.resetVerses(flatten(flat
      //   .map((f): Verse[] | undefined => {
      //     return f.verse;
      //   })
      //   .filter(f => {
      //     return f !== undefined;
      //   }) as Verse[]) as Verse[]);
      console.log(this.verses);

      // console.log(flat);
    }
  }
  private getChapterId(flat: HarmonyCell[]): string[] {
    const i = flatten(
      flat.map((f): string[] => {
        return f.verseRef ? f.verseRef : [];
      }),
    ).map((f: string): string => {
      const ids = f.split('-');
      // console.log(ids.pop());
      ids.pop();
      return `${ids.join('-')}-chapter-verses`;
    });
    return uniq(i);
  }
}
