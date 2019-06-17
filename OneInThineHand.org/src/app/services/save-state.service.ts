import { Injectable } from '@angular/core';
import { SaveStateModel } from './SaveStateModel';
import { ReferenceLabel } from '../../../../shared/src/models/notes/Note';
import {
  NoteTypeConvert,
  NoteTypeConverts,
  ReferenceLabels,
} from '../../../../shared/src/shared';

@Injectable({
  providedIn: 'root',
})
export class SaveStateService {
  public constructor() {}

  public data: SaveStateModel = new SaveStateModel();

  public async load(): Promise<void> {
    const tempData = localStorage.getItem('oithSettings');

    if (tempData) {
      this.data = JSON.parse(tempData) as SaveStateModel;

      if (this.data.underLineRefs === undefined) {
        this.data.underLineRefs = true;
      }

      this.mergeNoteSettings(this.data.noteTypeSettings, NoteTypeConverts);
      this.mergeNoteSettings(this.data.ReferenceLabelSetting, ReferenceLabels);
      this.data.ReferenceLabelSetting = this.data.ReferenceLabelSetting.filter(
        (refLabelSetting): boolean => {
          return refLabelSetting.className.startsWith('reference-label');
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
  private mergeNoteSettings<T extends { className: string }>(
    noteSettings: T[],
    noteSettingsMaster: T[],
  ): void {
    if (noteSettings) {
      noteSettingsMaster.map(
        (noteTypeConvert): void => {
          if (
            !noteSettings.find(
              (nT): boolean => {
                return nT.className === noteTypeConvert.className;
              },
            )
          ) {
            console.log(noteTypeConvert);
            noteSettings.push(noteTypeConvert);
          }
        },
      );
    } else {
      noteSettings = noteSettingsMaster;
    }
  }

  public async save(): Promise<void> {
    localStorage.setItem('oithSettings', JSON.stringify(this.data));
  }
}
