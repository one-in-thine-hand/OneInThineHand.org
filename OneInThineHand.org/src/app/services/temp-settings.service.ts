import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TempSettingsService {
  public editMode = false;
  public jstMode = false;
  public navigationMobilePaneToggle = false;
  public constructor() {}
}
