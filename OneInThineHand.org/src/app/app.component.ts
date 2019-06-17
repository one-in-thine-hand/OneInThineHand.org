import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { SaveStateService } from './services/save-state.service';
import { SwUpdate } from '@angular/service-worker';

// import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    public saveStateService: SaveStateService,
    private swUpdate: SwUpdate,
  ) {
    translate.setDefaultLang('en');
    this.swUpdate.available.subscribe(
      (evt): void => {
        if (!document.querySelector('.update-button')) {
          // matCSS.toast({
          //   html:
          //     '<span class="update-button" onclick="location.reload()">Click here to update</span>',
          //   displayLength: 1000000,
          // });
        }
      },
    );
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }
}
