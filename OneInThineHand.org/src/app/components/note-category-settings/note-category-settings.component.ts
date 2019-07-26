import { Component, OnInit } from '@angular/core';

import { ChapterService } from '../../services/chapter.service';
import { OffsetGroupsService } from '../../services/offset-groups.service';
import { SaveStateService } from '../../services/save-state.service';
import { VisibilityService } from '../../services/visibility.service';
import { NoteCategorySetting } from '../../models/verse-notes';

@Component({
  selector: 'app-note-category-settings',
  templateUrl: './note-category-settings.component.html',
  styleUrls: ['./note-category-settings.component.scss'],
})
export class NoteCategorySettingsComponent implements OnInit {
  public constructor(
    public chapterService: ChapterService,
    public visibilityService: VisibilityService,
    public offsetGroupsService: OffsetGroupsService,
    public saveStateService: SaveStateService,
  ) {}

  public async setNoteCategorySettings(
    noteCateGorySetting: NoteCategorySetting,
  ): Promise<void> {
    if (noteCateGorySetting.setting.toLowerCase().includes('more')) {
      console.log(
        noteCateGorySetting.setting.toLowerCase().replace('_more', ''),
      );

      this.saveStateService.data[
        noteCateGorySetting.setting.toLowerCase().replace('_more', '')
      ] = true;
      this.saveStateService.data[noteCateGorySetting.setting] = !this
        .saveStateService.data[noteCateGorySetting.setting];
    } else {
      this.saveStateService.data[noteCateGorySetting.setting] = !this
        .saveStateService.data[noteCateGorySetting.setting];
      this.saveStateService.data[`${noteCateGorySetting.setting}_more`] = false;
      console.log(`${noteCateGorySetting.setting}_more`);
    }
    this.saveStateService.resetNoteSettingsObservable.next();
  }

  public ngOnInit(): void {}
}
