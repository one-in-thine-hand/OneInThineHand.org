import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { SaveStateService } from '../../services/save-state.service';
import { TempSettingsService } from '../../services/temp-settings.service';

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
  ) {}
  public ngOnInit(): void {}

  public async navigationPaneToggle(): Promise<void> {
    this.saveStateService.data.navigationPaneToggle = !this.saveStateService
      .data.navigationPaneToggle;

    this.tempSettingsService.navigationMobilePaneToggle = !this
      .tempSettingsService.navigationMobilePaneToggle;

    await this.saveStateService.save();
  }

  public async notesPaneToggle(): Promise<void> {
    this.saveStateService.data.notesPaneToggle = !this.saveStateService.data
      .notesPaneToggle;

    await this.saveStateService.save();
  }

  // public
}
