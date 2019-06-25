import {
  Harmony,
  HarmonyVerse,
  HarmonyCell,
  HarmonyXRef,
} from '../../../../../harmony/src/Harmony';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { CouchDoc, Verse } from '../../../../../shared/src/shared';
import { DatabaseService } from '../../services/database.service';
import { flatten, uniq } from 'lodash';
import PQueue from 'p-queue/dist';
@Component({
  selector: 'app-harmony',
  templateUrl: './harmony.component.html',
  styleUrls: ['./harmony.component.scss'],
})
export class HarmonyComponent implements OnInit {
  public harmony: Harmony | undefined;
  public harmonyDocQueue = new PQueue({ concurrency: 1 });
  public constructor(public databaseService: DatabaseService) {}

  public async ngOnInit(): Promise<void> {
    this.databaseService.initReadingMode();
    const harmonyData = await axios.get(
      '/assets/harmony/harmony_of the gospels.json',
    );

    this.harmony = harmonyData.data as Harmony;

    const harmonyVerses = flatten(
      this.harmony.harmonyCells.map((row): HarmonyVerse[] => {
        return flatten(
          row.map((col: HarmonyCell | HarmonyXRef): HarmonyVerse[] => {
            if ((col as HarmonyCell).harmonyVerses) {
              return (col as HarmonyCell).harmonyVerses as HarmonyVerse[];
            } else if ((col as HarmonyCell).harmonyXRef !== undefined) {
              const harmonyXRefs = (col as HarmonyCell)
                .harmonyXRef as HarmonyXRef[];
              // console.log(
              //   flatten(
              //     harmonyXRefs
              //       .filter((h): boolean => {
              //         return h.harmonyVerse !== undefined;
              //       })
              //       .map((harmonyXRef): HarmonyVerse[] => {
              //         return harmonyXRef.harmonyVerse as HarmonyVerse[];
              //       }),
              //   ),
              // );
              return flatten(
                harmonyXRefs
                  .filter((h): boolean => {
                    return h.harmonyVerse !== undefined;
                  })
                  .map((harmonyXRef): HarmonyVerse[] => {
                    return harmonyXRef.harmonyVerse as HarmonyVerse[];
                  }),
              );
              // await this.processHarmonyXRef(c?ol);
            }
            return [];
          }),
        );
      }),
    );
    const verseIDS = uniq(
      harmonyVerses.map(
        (harmonyVerse): CouchDoc => {
          return { id: harmonyVerse.verseRef, rev: '' };
        },
      ),
    );

    try {
      const promises = this.sliceArray(verseIDS, 100).map(
        async (slice): Promise<void> => {
          await this.harmonyDocQueue.add(
            async (): Promise<void> => {
              const docs = await this.databaseService.bulkGet(slice);

              if (docs) {
                console.log(docs.results);
              }
            },
          );
        },
      );
      await Promise.all(promises);
      console.log(verseIDS);
    } catch (error) {
      console.log(error);
    }

    // this.harmony.harmonyCells.map((row): void => {
    //   row.map(
    //     async (col: HarmonyCell | HarmonyXRef): Promise<void> => {
    //       if ((col as HarmonyCell).harmonyVerses) {
    //         this.processHarmonyCell(col as HarmonyCell);
    //       } else if ((col as HarmonyCell).harmonyXRef !== undefined) {
    //         await this.processHarmonyXRef(col);
    //       }
    //     },
    //   );
    // });

    console.log(this.harmony);
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

  private async processHarmonyXRef(
    col: HarmonyCell | HarmonyXRef,
  ): Promise<void> {
    const harmonyXRef = col as HarmonyCell;

    if (harmonyXRef.harmonyXRef) {
      harmonyXRef.harmonyXRef.map(
        async (harmonyXRef): Promise<void> => {
          if (harmonyXRef.harmonyVerse) {
            await this.getVerseIds(harmonyXRef.harmonyVerse);
          }
        },
      );
    }
  }

  private processHarmonyCell(col: HarmonyCell): void {
    if (col.harmonyVerses) {
      this.getVerseIds(col.harmonyVerses);
    }
    // console.log(
    //   harmonyCell.harmonyVerses ? harmonyCell.harmonyVerses.length : '',
    // );
  }
  private async getVerseIds(harmonyVerses: HarmonyVerse[]): Promise<void> {
    const verseIDS = harmonyVerses.map(
      (harmonyVerse): CouchDoc => {
        return { id: `${harmonyVerse.verseRef}-verse`, rev: '' };
      },
    );

    const versesDocs = await this.databaseService.bulkGet(verseIDS);

    if (versesDocs !== undefined) {
      versesDocs.results.map((result): void => {
        try {
          const verse = (result.docs[0] as any).ok as Verse;
          // console.log(verse);

          const harmonyVerse = harmonyVerses.find((h): boolean => {
            return `${h.verseRef}-verse` === verse._id;
          });
          if (harmonyVerse) {
            harmonyVerse.verse = verse;
          }
        } catch (error) {
          // console.log(error);
        }
      });
    }
  }

  public async getHarmonyVerses(
    harmonyVerses: HarmonyVerse[],
  ): Promise<HarmonyVerse[]> {
    const verseIDS = harmonyVerses.map(
      (harmonyVerse): CouchDoc => {
        return { id: harmonyVerse.verseRef, rev: '' };
      },
    );
    const versesDocs = await this.databaseService.bulkGet(verseIDS);
    if (versesDocs) {
      console.log(versesDocs.results.length);
    }
    return harmonyVerses;
  }
}
