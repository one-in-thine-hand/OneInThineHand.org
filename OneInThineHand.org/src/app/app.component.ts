import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';

import { AppConfig } from '../environments/environment';
import { ElectronService } from './providers/electron.service';
import { SaveStateService } from './services/save-state.service';
import { VisibilityService } from './services/visibility.service';
import { ChapterService } from './services/chapter.service';
import { OffsetGroupsService } from './services/offset-groups.service';

// import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public ngOnInit(): void {
    this.saveStateService.resetNoteSettingsObservable.subscribe(
      async (): Promise<void> => {
        this.saveStateService.resetNoteCategorySettings();

        await this.saveStateService.save();
        if (this.chapterService.notes && this.chapterService.chapterNotes) {
          this.visibilityService.resetNoteVisibility(this.chapterService.notes);

          this.chapterService.offsetGroups = this.offsetGroupsService.buildOffsetGroups(
            this.chapterService.chapterNotes,
          );
          this.chapterService.offsetGroupsOb.next(
            this.chapterService.offsetGroups,
          );
        }
      },
    );
  }
  public constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    public saveStateService: SaveStateService,
    private swUpdate: SwUpdate,
    public act: Router,
    public chapterService: ChapterService,
    public offsetGroupsService: OffsetGroupsService,
    public visibilityService: VisibilityService,
  ) {
    translate.setDefaultLang('en');
    this.swUpdate.available.subscribe((evt): void => {
      if (!document.querySelector('.update-button')) {
        // matCSS.toast({
        //   html:
        //     '<span class="update-button" onclick="location.reload()">Click here to update</span>',
        //   displayLength: 1000000,
        // });
      }
    });
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  @HostListener('window:resize')
  public windowResize(): void {}
}
