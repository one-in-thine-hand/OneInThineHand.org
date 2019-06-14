import { Injectable } from '@angular/core';
import { PageState } from './PageState';
import { PageStateService } from './page-state.service';
import { ChapterVerses } from '../../../../format-tags/src/main';
import { ChapterNotes } from '../../../../notes/src/main';
import { cloneDeep } from 'lodash';
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
    chapterNotes: ChapterNotes,
  ): void {
    this.backHistory.push({
      chapterNotes: cloneDeep(chapterNotes),
      chapterVerses: cloneDeep(chapterVerses),
    });
  }

  public undoHistory(
    chapterNotes: ChapterNotes,
    chapterVerses: ChapterVerses,
  ): void {
    if (this.backHistory.length > 0) {
      const s = this.backHistory.shift();
      console.log(s);
      if (s) {
        this.forwardHistory.push({
          chapterNotes: cloneDeep(chapterNotes),
          chapterVerses: cloneDeep(chapterVerses),
        });
        if (chapterNotes.notes) {
          chapterNotes.notes.map(
            (n): void => {
              if (s.chapterNotes.notes) {
                const o = s.chapterNotes.notes.find(
                  (l): boolean => {
                    return l._id === n._id;
                  },
                );
                if (o) {
                  n.secondaryNotes = o.secondaryNotes;
                }
              }
            },
          );
        }
        if (chapterVerses.verses) {
          chapterVerses.verses.map(
            (n): void => {
              if (s.chapterVerses.verses) {
                const o = s.chapterVerses.verses.find(
                  (l): boolean => {
                    return l._id === n._id;
                  },
                );
                if (o) {
                  n.formatGroups = o.formatGroups;
                }
              }
            },
          );
        }

        // chapterNotes.notes = s.chapterNotes.notes;
        // chapterVerses.verses = s.chapterVerses.verses;
      }
    }
  }
  public redoHistory(
    chapterNotes: ChapterNotes,
    chapterVerses: ChapterVerses,
  ): void {
    if (this.backHistory.length > 0) {
      const s = this.forwardHistory.shift();
      console.log(s);
      if (s) {
        this.backHistory.push({
          chapterNotes: cloneDeep(chapterNotes),
          chapterVerses: cloneDeep(chapterVerses),
        });
        if (chapterNotes.notes) {
          chapterNotes.notes.map(
            (n): void => {
              if (s.chapterNotes.notes) {
                const o = s.chapterNotes.notes.find(
                  (l): boolean => {
                    return l._id === n._id;
                  },
                );
                if (o) {
                  n.secondaryNotes = o.secondaryNotes;
                }
              }
            },
          );
        }
        if (chapterVerses.verses) {
          chapterVerses.verses.map(
            (n): void => {
              if (s.chapterVerses.verses) {
                const o = s.chapterVerses.verses.find(
                  (l): boolean => {
                    return l._id === n._id;
                  },
                );
                if (o) {
                  n.formatGroups = o.formatGroups;
                }
              }
            },
          );
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
}

export function findByAttribute<T, T2>(
  attr: string,
  val: T,
  list: T2[] | undefined,
): T2 | undefined {
  if (list === undefined || list.length === 0) {
    return undefined;
  }
  return list.find(
    (l): boolean => {
      return l[attr] !== undefined && l[attr] === val;
    },
  );
}
