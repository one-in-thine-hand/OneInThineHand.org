import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { TempSettingsService } from '../../services/temp-settings.service';
import { SaveStateService } from '../../services/save-state.service';
import * as navigation from '../../../assets/manifests.json';
import {
  NavigationItem,
  Verse,
  FormatTag,
  FormatTagType,
  filterUndefined,
} from '../../../../../shared/src/shared';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ParamService } from '../../services/param.service';
import { flattenNavigationItem } from '../../../../../shared/src/models/NavigationItem';
import { ChapterService } from '../../services/chapter.service';
import { VerseBreaks } from '../../../../../shared/src/models/Verse';
import { SaveService } from '../../services/save.service';
import { OffsetService } from '../../services/offset.service';
import { FormatTagService } from '../../services/format-tag.service';
import { last } from 'lodash';
import PQueue from 'p-queue/dist';

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
    public chapterService: ChapterService,
    public saveService: SaveService,
    public formatTagService: FormatTagService,
  ) {}

  public currentNavItems: NavigationItem[] = [];

  public navigationItems = navigation.navigation.filter((navItem): boolean => {
    return navItem.title !== '';
  }) as NavigationItem[];

  public saveQueue = new PQueue({ concurrency: 1 });
  public ngOnInit(): void {
    this.router.events.subscribe(
      async (value): Promise<void> => {
        this.tempSettingsService.navigationMobilePaneToggle = false;
        if (value instanceof NavigationEnd) {
          console.log(value);
          await this.resetNavigation(this.navigationItems);
          try {
            // const chapterParams = this.paramService.parseChapterParams(params);
            const n = this.findNav(
              value.url.split('.')[0],
              this.navigationItems,
            );
            if (n) {
              this.currentNavItems = flattenNavigationItem(n).filter(
                (nk): boolean => {
                  return nk.display === true;
                },
              );
            } else {
              throw new Error('');
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
  /**
   * isSingleChapter
nI:NavigationItem   */
  public isSingleChapter(nI: NavigationItem): boolean {
    return [
      'Obadiah',
      'Philemon',
      '2John',
      '3John',
      'Jude',
      'Enos',
      'Jarom',
      'Omni',
      'WordsofMormon',
      'JosephSmith—Matthew',
      'JosephSmith—History',
      'ArticlesofFaith',
    ].includes(nI.title.replace(/\s/g, ''));
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
    // console.log(id);

    const navigationItem = navItems.find((navItem): boolean => {
      return navItem.href === `#${id}` || navItem.id === `${id}`;
    });

    if (
      navigationItem &&
      navigationItem.id !== undefined &&
      !navigationItem.active
    ) {
      if (navigationItem.navItems) {
        this.setNavItemsDisplay(navigationItem.navItems, false, true);
      }
      // navItems.map(
      //   (n): void => {
      //     n.display = false;
      //     n.active = false;
      //   },
      // );
      this.setNavItemsDisplay(navItems, false, false);
      this.setNavItemDisplay(navigationItem, true, true);
      // navItem.display = true;
      // navItem.active = true;
      console.log(navigationItem);
      return navigationItem;
    }
    if (navigationItem) {
      this.setNavItemsDisplay(navItems, false, true);
      navigationItem.active = true;
      return navigationItem;
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
    navItems.map((n): void => {
      this.setNavItemDisplay(n, active, display);
    });
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

  private validateSelectedNodes(node: Node): Element | undefined {
    if (
      (node as HTMLElement).getAttribute !== undefined &&
      (node as HTMLElement).getAttribute('offsets') !== null
    ) {
      return node as Element;
    } else {
      let parentElement: Element | undefined | null = node.parentElement;

      while (
        parentElement &&
        parentElement.getAttribute !== null &&
        parentElement.getAttribute('offsets') === null
      ) {
        parentElement = parentElement.parentElement;
      }
      if (parentElement) {
        return parentElement;
      }
    }
    return undefined;
  }
  private calcOffset(): { offsets: string; verse: Verse } | undefined {
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      if (range.toString().length === 0) {
        throw new Error('No selection');
      }
      const elements = {
        startElememt: this.validateSelectedNodes(range.startContainer),
        endElememt: this.validateSelectedNodes(range.endContainer),
      };
      if (elements.endElememt && elements.startElememt) {
        const offsets1 = (elements.startElememt.getAttribute(
          'offsets',
        ) as string).split('-');
        const offsets2 = (elements.endElememt.getAttribute(
          'offsets',
        ) as string).split('-');
        const verseid = elements.endElememt.getAttribute('verse-id') as string;
        console.log(this.chapterService.verses);

        const verse = this.chapterService.verses
          ? this.chapterService.verses.find((v): boolean => {
              return v._id !== undefined && v._id === verseid;
            })
          : undefined;
        console.log(verse);
        if (verse) {
          if (!verse.verseBreaks) {
            verse.verseBreaks = new VerseBreaks();
            verse.verseBreaks._id = verse._id
              ? verse._id.replace('verse', 'breaks')
              : undefined;
            if (!verse.verseBreaks._id) {
              throw '';
            }
            verse.verseBreaks.breaks = [];
          }

          return {
            offsets: `${`${parseInt(offsets1[0], 10) +
              range.startOffset}-${parseInt(offsets2[0], 10) +
              range.endOffset -
              1}`}`,
            verse: verse,
          };
        }
      }
    }
    return undefined;
  }

  private async addBreak(
    formatTagType: FormatTagType,
    offset?: string,
  ): Promise<void> {
    const offsets = this.calcOffset();
    const formatTag = new FormatTag();
    if (offsets) {
      formatTag.offsets = offset ? offset : offsets ? offsets.offsets : '';
      formatTag.formatType = formatTagType;
      if (offsets.verse.fakeVerseBreak) {
        if (!offsets.verse.fakeVerseBreak.breaks) {
          offsets.verse.fakeVerseBreak.breaks = [];
        }
        console.log(formatTag);

        console.log(offsets.verse.fakeVerseBreak.breaks);

        offsets.verse.fakeVerseBreak.breaks.push(formatTag);
      }
      await this.saveQueue.add(
        async (): Promise<void> => {
          await this.saveService.saveFakeVerseBreaks();
        },
      );
    }
  }

  public async addPara(): Promise<void> {
    await this.addBreak(FormatTagType.Para);
  }
  public async addParaGap(): Promise<void> {
    await this.addBreak(FormatTagType.ParaGap);
  }
  public async addLine(): Promise<void> {
    await this.addBreak(FormatTagType.Line);
  }
  public async addLineGap(): Promise<void> {
    await this.addBreak(FormatTagType.LineGap);
  }

  public async addBlock(): Promise<void> {
    await this.addBreak(FormatTagType.Block);
  }
  public async addBlockGap(): Promise<void> {
    await this.addBreak(FormatTagType.BlockGap);
  }

  public async addPlain(): Promise<void> {
    await this.addBreak(FormatTagType.Plain);
  }

  public getVerseNumbers(): { verseNumber: string; verse: Verse }[] {
    if (this.chapterService.verses) {
      return filterUndefined(
        this.chapterService.verses.map((verse):
          | { verseNumber: string; verse: Verse }
          | undefined => {
          if (verse._id) {
            console.log();

            return { verseNumber: verse._id.split('-')[3], verse: verse };
          }
        }),
      );
    }
    return [];
  }

  public async refreshBreaks(): Promise<void> {
    await this.formatTagService.resetFormatTags(
      this.chapterService.chapterVerses,
      this.chapterService.chapterNotes,
    );
  }
  public async resetVerseBreaks(verse: Verse): Promise<void> {
    if (verse.fakeVerseBreak && verse.fakeVerseBreak.breaks) {
      verse.fakeVerseBreak.breaks = undefined;
    }
    await this.formatTagService.resetFormatTags(
      this.chapterService.chapterVerses,
      this.chapterService.chapterNotes,
    );
    await this.saveQueue.add(
      async (): Promise<void> => {
        await this.saveService.saveFakeVerseBreaks();
      },
    );
  }
  // public async addPoetry(): Promise<void> {
  //   await this.addBreak(FormatTagType.Poetry);
  // }
}
