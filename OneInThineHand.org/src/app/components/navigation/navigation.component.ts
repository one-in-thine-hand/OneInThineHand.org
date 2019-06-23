import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { TempSettingsService } from '../../services/temp-settings.service';
import { SaveStateService } from '../../services/save-state.service';
import * as navigation from '../../../assets/manifests.json';
import { NavigationItem } from '../../../../../shared/src/shared';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ParamService } from '../../services/param.service';
import { flattenNavigationItem } from '../../../../../shared/src/models/NavigationItem';

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
    public activatedRouter: ActivatedRoute,
    public router: Router,
    public paramService: ParamService,
  ) {}

  public currentNavItems: NavigationItem[] = [];

  public navigationItems = navigation.navigation.filter(
    (navItem): boolean => {
      return navItem.title !== '';
    },
  ) as NavigationItem[];
  public ngOnInit(): void {
    this.router.events.subscribe(
      async (value): Promise<void> => {
        if (value instanceof NavigationEnd) {
          console.log(value);
          await this.resetNavigation(this.navigationItems);
          try {
            // const chapterParams = this.paramService.parseChapterParams(params);
            const n = this.findNav(value.url, this.navigationItems);
            if (n) {
              this.currentNavItems = flattenNavigationItem(n).filter(
                (nk): boolean => {
                  return nk.display === true;
                },
              );
            } else {
              throw '';
            }
          } catch (error) {
            console.log(error);

            this.currentNavItems = this.navigationItems;
          }
        }
      },
    );
    this.activatedRouter.params.subscribe((): void => {});
  }

  public async goHome(): Promise<void> {
    this.currentNavItems = this.navigationItems;
  }
  public async resetNavigation(navItems: NavigationItem[]): Promise<void> {
    navItems.map(
      async (navItem): Promise<void> => {
        navItem.active = false;
        navItem.display = false;
        if (navItem.navItems) {
          await this.resetNavigation(navItem.navItems);
        }
      },
    );
  }
  public findNav(
    id: string,
    navItems: NavigationItem[],
  ): NavigationItem | undefined {
    const navItem = navItems.find(
      (navItem): boolean => {
        return navItem.href === `#${id}` || navItem.id === `${id}`;
      },
    );

    if (navItem && navItem.id !== undefined && !navItem.active) {
      if (navItem.navItems) {
        this.setNavItemsDisplay(navItem.navItems, false, true);
      }
      // navItems.map(
      //   (n): void => {
      //     n.display = false;
      //     n.active = false;
      //   },
      // );
      this.setNavItemsDisplay(navItems, false, false);
      this.setNavItemDisplay(navItem, true, true);
      // navItem.display = true;
      // navItem.active = true;
      console.log(navItem);
      return navItem;
    }
    if (navItem) {
      this.setNavItemsDisplay(navItems, false, true);
      navItem.active = true;
      return navItem;
    } else {
      for (let x = 0; x < navItems.length; x++) {
        const i = navItems[x];
        if (i.navItems && this.findNav(id, i.navItems)) {
          this.setNavItemDisplay(i, false, true);
          return i;
        } else {
          this.setNavItemDisplay(i, false, false);
          // i.active = false;
          // i.display = false;
        }
      }
    }
    return undefined;
  }
  private setNavItemsDisplay(
    navItems: NavigationItem[],
    active: boolean,
    display: boolean,
  ): void {
    navItems.map(
      (n): void => {
        this.setNavItemDisplay(n, active, display);
      },
    );
  }

  private setNavItemDisplay(
    n: NavigationItem,
    active: boolean,
    display: boolean,
  ): void {
    n.active = active;
    n.display = display;
  }

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

  public async navigationParentClick(navItem: NavigationItem): Promise<void> {
    await this.resetNavigation(this.navigationItems);
    if (navItem.id !== undefined) {
      const n = this.findNav(navItem.id, this.navigationItems);
      console.log(n);

      if (n) {
        this.currentNavItems = flattenNavigationItem(n).filter(
          (nk): boolean => {
            return nk.display === true;
          },
        );
      } else {
        this.currentNavItems = this.navigationItems;
      }
    }
  }
}
