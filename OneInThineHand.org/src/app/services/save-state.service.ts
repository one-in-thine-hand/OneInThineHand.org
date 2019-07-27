import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { NoteTypeConverts } from '../../../../shared/src/models/notes/NoteType';
import {
  NoteTypeOverlay,
  NoteTypes,
  NoteCategories,
} from '../models/verse-notes';
import { DatabaseService } from './database.service';
import { NoteVisiblityBtn } from './NoteVisiblityBtn';
import { SaveStateModel } from './SaveStateModel';
import { findByAttribute } from '../../../../shared/src/functions/filterUndefined';

@Injectable({
  providedIn: 'root',
})
export class SaveStateService {
  public data: SaveStateModel = new SaveStateModel();
  public resetNoteSettingsObservable = new Subject();

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

      // this.data.ReferenceLabelSetting,
    } else {
      this.data = new SaveStateModel();
    }
    await this.loadNoteSettings();
    await this.save();
  }

  public async loadNoteSettings(forceReset?: boolean): Promise<void> {
    await this.loadNoteCategoryBtns(forceReset);

    await this.loadNotCategories(forceReset);
    await this.loadNoteTypes(forceReset);
    this.resetNoteCategorySettings();
  }
  public async loadNoteCategoryBtns(forceReset?: boolean): Promise<void> {
    try {
      const noteCategories = (await this.databaseService.getDatabaseItem(
        'eng-note-categories',
      )) as NoteCategories;
      console.log(noteCategories);


      noteCategories.visibilitySettings.map((visSetting): void => {
        visSetting.map((vS): void => {
          if (vS.setting.trim() !== '') {
            if (forceReset || this.data[vS.setting] === undefined) {
              this.data[vS.setting] = true;
            }
          }
        });
      });
    } catch (error) {}
  }

  public async loadNoteTypes(forceReset?: boolean): Promise<void> {
    try {
      const noteTypes = (await this.databaseService.getDatabaseItem(
        'eng-note-types',
      )) as NoteTypes;

      if (!forceReset && noteTypes && this.data.noteTypes) {
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
    } catch (error) {}

    await this.save();
  }
  public async loadNotCategories(forceReset?: boolean): Promise<void> {
    try {
      const noteCategories = (await this.databaseService.getDatabaseItem(
        'eng-note-categories',
      )) as NoteCategories;

      if (!forceReset && noteCategories && this.data.noteCategories) {
        noteCategories.noteCategories.map((noteCategory): void => {
          if (this.data.noteTypes) {
            const nT = this.data.noteCategories.noteCategories.find(
              (n): boolean => {
                return n.className === noteCategory.className;
              },
            );
            if (nT) {
              nT.name = noteCategory.name;
              nT.label = noteCategory.label;
              nT.noteCategory = noteCategory.noteCategory;
              nT.on = noteCategory.on;
              nT.off = noteCategory.off;
            } else {
              this.data.noteCategories.noteCategories.push(noteCategory);
            }
          }
        });
      } else {
        this.data.noteCategories = noteCategories;
      }
    } catch (error) {}

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
          noteSettings.push(noteTypeConvert);
        } else {
          // nTC.
        }
      });
    } else {
      noteSettings = noteSettingsMaster;
    }
  }
  public resetNoteCategorySettings(): void {
    if (this.data.noteCategories) {
      this.data.noteCategories.noteCategories.map((noteCategory): void => {
        console.log(noteCategory);

        const noteCategoryOn =
          noteCategory.on.filter((on): boolean => {
            return this.getNoteVisiblitySetting(on);
          }).length === noteCategory.on.length;

        const noteCategoryOff =
          noteCategory.off === undefined
            ? true
            : noteCategory.off.filter((off): boolean => {
                return this.getNoteVisiblitySetting(off) === false;
              }).length === noteCategory.off.length;

        noteCategory.visible = noteCategoryOff && noteCategoryOn;
      });
    }
  }
  private getNoteVisiblitySetting(on: string): boolean {
    if (!on.includes('overlay')) {
      return this.data[on] === true;
    } else {
      if (this.data.noteTypes) {
        const noteType = findByAttribute(
          this.data.noteTypes.noteTypes,
          'className',
          on,
        );
        return noteType !== undefined && noteType.visibility === true;
      }
      return false;
    }
  }
}
