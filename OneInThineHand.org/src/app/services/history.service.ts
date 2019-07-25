import { Injectable } from '@angular/core';
import { PageState } from './PageState';
import { PageStateService } from './page-state.service';

import { cloneDeep } from 'lodash';
import { SaveStateModel } from './SaveStateModel';
import { ChapterVerses, VerseNotes } from '../models/verse-notes';
@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  public backHistory: HistoryItem[] = [];
  public forwardHistory: HistoryItem[] = [];

  public constructor(private pageStatwService: PageStateService) {}

  public addHistory(
    chapterVerses: ChapterVerses,
    saveStateData: SaveStateModel,
    chapterNotes: VerseNotes,
  ): void {
    this.backHistory.push({
      chapterNotes: cloneDeep(chapterNotes),
      chapterVerses: cloneDeep(chapterVerses),
      saveStateData: saveStateData,
    });
  }

  public init(): void {
    this.backHistory = [];
    this.forwardHistory = [];
  }
  public redoHistory(
    chapterNotes: VerseNotes,
    chapterVerses: ChapterVerses,
    saveStateData: SaveStateModel,
  ): void {
    if (this.backHistory.length > 0) {
      const s = this.forwardHistory.shift();
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

        // chapterNotes.verseNotes = s.chapterNotes.verseNotes;
        // chapterVerses.verses = s.chapterVerses.verses;
      }
    }
  }

  public undoHistory(
    chapterNotes: VerseNotes,
    saveStateData: SaveStateModel,
    chapterVerses: ChapterVerses,
  ): void {
    if (this.backHistory.length > 0) {
      const s = this.backHistory.shift();
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

        // chapterNotes.verseNotes = s.chapterNotes.verseNotes;
        // chapterVerses.verses = s.chapterVerses.verses;
      }
    }
  }
}

export class HistoryItem {
  public chapterNotes: VerseNotes;
  public chapterVerses: ChapterVerses;
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
