import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { SaveStateService } from '../../services/save-state.service';

@Component({
  selector: 'app-title-header',
  templateUrl: './title-header.component.html',
  styleUrls: ['./title-header.component.scss'],
})
export class TitleHeaderComponent implements OnInit {
  public constructor(
    public headerService: HeaderService,
    public saveStateService: SaveStateService,
  ) {}
  public ngOnInit(): void {}

  public async navigationPaneToggle(): Promise<void> {
    this.saveStateService.data.navigationPaneToggle = !this.saveStateService
      .data.navigationPaneToggle;
    await this.saveStateService.save();
  }

  public async notesPaneToggle(): Promise<void> {
    this.saveStateService.data.notesPaneToggle = !this.saveStateService.data
      .notesPaneToggle;

    await this.saveStateService.save();
  }

  // public
}
