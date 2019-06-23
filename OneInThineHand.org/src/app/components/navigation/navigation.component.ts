import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { TempSettingsService } from '../../services/temp-settings.service';
import { SaveStateService } from '../../services/save-state.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  public constructor(
    public navigationService: NavigationService,
    public tempSettingsService: TempSettingsService,
    public saveStateService: SaveStateService,
  ) {}

  public ngOnInit(): void {}

  public async addressBarKeyUp(
    event: KeyboardEvent | undefined,
  ): Promise<void> {
    if (
      event &&
      event instanceof KeyboardEvent &&
      event.key === 'Enter' &&
      event.target
    ) {
      try {
        const addressBarInput = (event.target as HTMLInputElement).value
          .trim()
          .replace(':', '.');
        await this.navigationService.parseAddressBarUrl(addressBarInput);
      } catch (error) {
        console.log(error);
      }
    }
  }

  public getNavHeight(): string {
    return `${window.innerHeight - 192}px`;
  }
  public getNavGrid(): string {
    return `48px ${window.innerHeight - 192}px 48px`;
  }
}
