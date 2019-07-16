import { Injectable } from '@angular/core';
import { SaveStateModel } from './SaveStateModel';
import { sortBy } from 'lodash';

import { NOTE_CATEGORIES } from '../models/verse-notes';
import {
  NoteTypeConverts,
  NoteTypeConvert,
} from '../../../../shared/src/models/notes/NoteType';

@Injectable({
  providedIn: 'root',
})
export class SaveStateService {
  public data: SaveStateModel = new SaveStateModel();
  public constructor() {}
  public getNoteOverlays(): NoteTypeConvert[] {
    if (this.data && this.data.noteTypeSettings) {
      return sortBy(this.data.noteTypeSettings, (ntSetting): number => {
        return ntSetting.noteType;
      });
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

      this.mergeNoteSettings(this.data.noteCategorySettings, NOTE_CATEGORIES);
      console.log(this.data.noteTypeSettings);

      this.data.noteCategorySettings = this.data.noteCategorySettings.filter(
        (noteCategorySetting): boolean => {
          return noteCategorySetting.className.startsWith('reference-label');
        },
      );
      // this.data.ReferenceLabelSetting,
    } else {
      this.data = new SaveStateModel();
    }

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
          console.log(noteTypeConvert);
          noteSettings.push(noteTypeConvert);
        }
      });
    } else {
      noteSettings = noteSettingsMaster;
    }
  }
}
