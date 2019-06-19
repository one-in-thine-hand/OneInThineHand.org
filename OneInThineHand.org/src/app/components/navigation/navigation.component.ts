import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  public constructor(public navigationService: NavigationService) {}

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
}
