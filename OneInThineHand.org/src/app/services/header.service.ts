import { Injectable } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  public headerTitle: string = '';
  public headerShortTitle: string = '';
  public constructor(private router: Router) {
    router.events.subscribe(
      (value): void => {
        console.log('asdfoijaosdfij');

        if (value instanceof NavigationStart) {
          this.headerShortTitle = '';
          this.headerTitle = '';
        }
      },
    );
  }

  public getTitle(): string {
    return this.headerTitle;
  }
}
