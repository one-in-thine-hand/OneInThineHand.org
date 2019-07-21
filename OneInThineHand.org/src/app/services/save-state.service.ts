import { Injectable } from '@angular/core';
import { SaveStateModel } from './SaveStateModel';
import { sortBy } from 'lodash';

import {
  NOTE_CATEGORIES,
  NoteTypes,
  NoteTypeOverlay,
  NoteCategorySort,
  NoteCategory,
} from '../models/verse-notes';
import {
  NoteTypeConverts,
  NoteTypeConvert,
} from '../../../../shared/src/models/notes/NoteType';
import { DatabaseService } from './database.service';
import { NoteVisiblityBtn } from './NoteVisiblityBtn';

@Injectable({
  providedIn: 'root',
})
export class SaveStateService {
  public data: SaveStateModel = new SaveStateModel();

  public constructor(public databaseService: DatabaseService) {}
  public getNoteOverlays(): NoteTypeOverlay[] {
    // ks(this.data.noteTypes);

    if (this.data && this.data.noteTypes) {
      return this.data.noteTypes.noteTypes;
      // return sortBy(this.data.noteTypeSettings, (ntSetting): number => {
      // return ntSetting.noteType;
      // });
    }
    return [];
  }

  public async load(): Promise<void> {
    const tempData = localStorage.getItem('oithSettings');

    if (tempData) {
      this.data = JSON.parse(tempData) as SaveStateModel;

      if (this.data.underLineRefs === undefined) {
        this.data.underLineRefs = true;
      }

      this.mergeNoteSettings(this.data.noteTypeSettings, NoteTypeConverts);

      if (this.data.noteCategorySettings === undefined) {
        this.data.noteCategorySettings = NOTE_CATEGORIES;
      }

      if (this.data.noteTypeSettings) {
        this.data.noteTypeSettings = this.data.noteTypeSettings.filter(
          (noteTypeSetting): boolean => {
            if (noteTypeSetting.visible === undefined) {
              noteTypeSetting.visible = true;
            }
            const nTC = NoteTypeConverts.find((n): boolean => {
              return n.className.includes(noteTypeSetting.className);
            });
            if (!nTC) {
              return false;
            } else {
              noteTypeSetting.longName = nTC.longName;
              noteTypeSetting.shortName = nTC.shortName;
              noteTypeSetting.noteType = nTC.noteType;
            }
            return noteTypeSetting.className.startsWith('overlay');
          },
        );
      } else {
        this.data.noteTypeSettings = NoteTypeConverts;
      }

      this.mergeNoteCategories(this.data.noteCategorySettings, NOTE_CATEGORIES);
      // console.log(this.data.noteTypeSettings);

      this.data.noteCategorySettings = this.data.noteCategorySettings.filter(
        (noteCategorySetting): boolean => {
          return noteCategorySetting.className.startsWith('reference-label');
        },
      );
      // this.data.ReferenceLabelSetting,
    } else {
      this.data = new SaveStateModel();
    }

    this.loadNoteCategoryBtns();
    // // cg.
    // console.log(refLabelSettingsTemplate);

    // (refLabelSettingsTemplate as ReferenceLabel[]).map(
    //   (c): void => {
    //     if (
    //       !this.data.refLabelSettings.find(
    //         (r): boolean => {
    //           return r.refLabelName === c.refLabelName;
    //         },
    //       )
    //     ) {
    //       this.data.refLabelSettings.push(c);
    //     }
    //   },
    // );
    await this.loadNoteTypes();
    await this.save();
  }
  public loadNoteCategoryBtns(): void {
    [
      'alt',
      'bd',
      'cr',
      'geo',
      'geoMore',
      'gr',
      'gs',
      'heb',
      'hmy',
      'hst',
      'hstMore',
      'ie',
      'or',
      'orMore',
      'phr',
      'phrMore',
      'pronunciation',
      'pronunciationMore',
      'quo',
      'quoMore',
      'tg',
      'trn',
      'trnMore',
    ].map((val): void => {
      if (
        !this.data[val] ||
        (this.data[val] && this.data[val].vis === undefined)
      ) {
        this.data[val] = new NoteVisiblityBtn();
      }
    });
  }

  public async loadNoteTypes(): Promise<void> {
    try {
      const noteTypes = (await this.databaseService.getDatabaseItem(
        'eng-note-types',
      )) as NoteTypes;

      if (noteTypes && this.data.noteTypes) {
        noteTypes.noteTypes.map((noteType): void => {
          if (this.data.noteTypes) {
            const nT = this.data.noteTypes.noteTypes.find((n): boolean => {
              return n.className === noteType.className;
            });
            if (nT) {
              nT.name = noteType.name;
              nT.shortName = noteType.shortName;
              nT.sort = noteType.sort;
            } else {
              this.data.noteTypes.noteTypes.push(noteType);
            }
          }
        });
        this.data.noteTypes.noteTypes = this.data.noteTypes.noteTypes.filter(
          (noteType): boolean => {
            return (
              noteTypes.noteTypes.find((nT): boolean => {
                return nT.className === noteType.className;
              }) !== undefined
            );
          },
        );
      } else {
        this.data.noteTypes = noteTypes;
      }
      // console.log(noteTypes);
    } catch (error) {
      console.log(error);
    }

    await this.save();
  }
  public async save(): Promise<void> {
    localStorage.setItem('oithSettings', JSON.stringify(this.data));
  }
  private mergeNoteSettings<T extends { className: string }>(
    noteSettings: T[],
    noteSettingsMaster: T[],
  ): void {
    if (noteSettings) {
      noteSettingsMaster.map((noteTypeConvert): void => {
        const nTC = noteSettings.find((nT): boolean => {
          return nT.className === noteTypeConvert.className;
        });
        if (!nTC) {
          // console.log(noteTypeConvert);
          noteSettings.push(noteTypeConvert);
        } else {
          // nTC.
        }
      });
    } else {
      noteSettings = noteSettingsMaster;
    }
  }
  private mergeNoteCategories(
    noteSettings: NoteCategory[],
    noteSettingsMaster: NoteCategory[],
  ): void {
    if (noteSettings) {
      noteSettingsMaster.map((noteTypeConvert): void => {
        const nTC = noteSettings.find((nT): boolean => {
          return nT.className === noteTypeConvert.className;
        });
        if (!nTC) {
          // console.log(noteTypeConvert);
          noteSettings.push(noteTypeConvert);
        } else {
          nTC.noteCategory = noteTypeConvert.noteCategory;
          nTC.noteCategoryName = noteTypeConvert.noteCategoryName;
          nTC.noteCategoryShortName = noteTypeConvert.noteCategoryShortName;
          nTC.sortOrder = noteTypeConvert.sortOrder;
        }
      });
    } else {
      noteSettings = noteSettingsMaster;
    }
  }

  private validateNoteCategories(settings: SaveStateModel): void {
    settings.noteCategorySettings = settings.noteCategorySettings.filter(
      (noteCategory): boolean => {
        return (
          NOTE_CATEGORIES.find((nC): boolean => {
            return (
              nC.className === noteCategory.className &&
              nC.noteCategory === noteCategory.noteCategory
            );
          }) !== undefined
        );
      },
    );
    NOTE_CATEGORIES.map((noteCategory): void => {
      const nC = settings.noteCategorySettings.find((n): boolean => {
        return (
          n.className === noteCategory.className &&
          noteCategory.noteCategory === n.noteCategory
        );
      });
      if (!nC) {
        settings.noteCategorySettings.push(noteCategory);
      }
    });
  }
}
