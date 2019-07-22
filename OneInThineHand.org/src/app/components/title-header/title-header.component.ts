import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { SaveStateService } from '../../services/save-state.service';
import { TempSettingsService } from '../../services/temp-settings.service';
import { ChapterService } from '../../services/chapter.service';

@Component({
  selector: 'app-title-header',
  templateUrl: './title-header.component.html',
  styleUrls: ['./title-header.component.scss'],
})
export class TitleHeaderComponent implements OnInit {
  public constructor(
    public headerService: HeaderService,
    public tempSettingsService: TempSettingsService,
    public saveStateService: SaveStateService,
    public chapterService: ChapterService,
  ) {}

  public async navigationPaneToggle(): Promise<void> {
    this.saveStateService.data.navigationPaneToggle = !this.saveStateService
      .data.navigationPaneToggle;

    this.tempSettingsService.navigationMobilePaneToggle = !this
      .tempSettingsService.navigationMobilePaneToggle;

    await this.saveStateService.save();
  }
  public ngOnInit(): void {}

  public async notesPaneToggle(): Promise<void> {
    this.saveStateService.data.notesPaneToggle = !this.saveStateService.data
      .notesPaneToggle;
    console.log(this.chapterService.offsetGroups);

    this.chapterService.offsetGroupsOb.next(this.chapterService.offsetGroups);
    await this.saveStateService.save();
  }

  // public
}
