import { Injectable } from '@angular/core';
import { PageState } from './PageState';
import { PageStateService } from './page-state.service';
import { ChapterVerses } from '../../../../format-tags/src/main';
import { ChapterNotes } from '../../../../notes/src/main';
import { cloneDeep } from 'lodash';
import { SaveStateModel } from './SaveStateModel';
@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  public backHistory: HistoryItem[] = [];
  public forwardHistory: HistoryItem[] = [];

  public constructor(private pageStatwService: PageStateService) {}

  public init(): void {
    this.backHistory = [];
    this.forwardHistory = [];
  }

  public addHistory(
    chapterVerses: ChapterVerses,
    saveStateData: SaveStateModel,
    chapterNotes: ChapterNotes,
  ): void {
    this.backHistory.push({
      chapterNotes: cloneDeep(chapterNotes),
      chapterVerses: cloneDeep(chapterVerses),
      saveStateData: saveStateData,
    });
  }

  public undoHistory(
    chapterNotes: ChapterNotes,
    saveStateData: SaveStateModel,
    chapterVerses: ChapterVerses,
  ): void {
    if (this.backHistory.length > 0) {
      const s = this.backHistory.shift();
      console.log(s);
      if (s) {
        this.forwardHistory.push({
          chapterNotes: cloneDeep(chapterNotes),
          saveStateData: saveStateData,
          chapterVerses: cloneDeep(chapterVerses),
        });
        if (chapterNotes.verseNotes) {
          chapterNotes.verseNotes.map((n): void => {
            if (s.chapterNotes.verseNotes) {
              const o = s.chapterNotes.verseNotes.find((l): boolean => {
                return l._id === n._id;
              });
              if (o) {
                n.notes = o.notes;
              }
            }
          });
        }
        if (chapterVerses.verses) {
          chapterVerses.verses.map((n): void => {
            if (s.chapterVerses.verses) {
              const o = s.chapterVerses.verses.find((l): boolean => {
                return l._id === n._id;
              });
              if (o) {
                n.formatGroups = o.formatGroups;
              }
            }
          });
        }

        // chapterNotes.notes = s.chapterNotes.notes;
        // chapterVerses.verses = s.chapterVerses.verses;
      }
    }
  }
  public redoHistory(
    chapterNotes: ChapterNotes,
    chapterVerses: ChapterVerses,
    saveStateData: SaveStateModel,
  ): void {
    if (this.backHistory.length > 0) {
      const s = this.forwardHistory.shift();
      console.log(s);
      if (s) {
        this.backHistory.push({
          chapterNotes: cloneDeep(chapterNotes),
          saveStateData: saveStateData,
          chapterVerses: cloneDeep(chapterVerses),
        });
        if (chapterNotes.verseNotes) {
          chapterNotes.verseNotes.map((n): void => {
            if (s.chapterNotes.verseNotes) {
              const o = s.chapterNotes.verseNotes.find((l): boolean => {
                return l._id === n._id;
              });
              if (o) {
                n.notes = o.notes;
              }
            }
          });
        }
        if (chapterVerses.verses) {
          chapterVerses.verses.map((n): void => {
            if (s.chapterVerses.verses) {
              const o = s.chapterVerses.verses.find((l): boolean => {
                return l._id === n._id;
              });
              if (o) {
                n.formatGroups = o.formatGroups;
              }
            }
          });
        }

        // chapterNotes.notes = s.chapterNotes.notes;
        // chapterVerses.verses = s.chapterVerses.verses;
      }
    }
  }
}

export class HistoryItem {
  public chapterVerses: ChapterVerses;
  public chapterNotes: ChapterNotes;
  public saveStateData: SaveStateModel;
}

export function findByAttribute<T, T2>(
  attr: string,
  val: T,
  list: T2[] | undefined,
): T2 | undefined {
  if (list === undefined || list.length === 0) {
    return undefined;
  }
  return list.find((l): boolean => {
    return l[attr] !== undefined && l[attr] === val;
  });
}
